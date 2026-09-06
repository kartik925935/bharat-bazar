-- ============================================================================
-- Task 3: Catalog Layer Reconciliation
-- Migration: 20260906091400_catalog_layer.sql
--
-- Preconditions verified via MCP before writing:
--   - categories:       0 rows
--   - products:         5 rows (4 approved, 1 published) — no null slugs
--   - product_variants: 0 rows
--   - product_images:   0 rows
--   - inventory:        0 rows
--   - shops:            0 rows
--   - pg_trgm available but not installed
--   - products.selling_price: 2 rows with non-integer values (see Section D)
--
-- Canonical seller-identity table: sellers
--   products.seller_id → sellers(id) ON DELETE CASCADE
--   shops.seller_id    → sellers(id) ON DELETE CASCADE
--
-- Rules applied:
--   - Additive + idempotent everywhere (IF NOT EXISTS / DO $$ blocks)
--   - No destructive changes in Sections A–C
--   - No RLS policies, no business-logic triggers
--   - All NEW money columns: integer paise, CHECK >= 0
--   - Never drop, never ALTER type, never add NOT NULL on populated columns here
-- ============================================================================


-- ============================================================================
-- SECTION A: ENUMS, NEW TABLES, ADDITIVE COLUMNS, CONSTRAINTS
-- ============================================================================

-- ── A1. product_status ENUM (D3) ─────────────────────────────────────────────
-- 'active' unifies the live DB's 'approved' + 'published' values.
-- 'delisted' is the new SA delist action.
-- 'out_of_stock' is NOT a moderation status — it is derived from inventory.
-- Conversion of products.status (text) to this enum is in Section D.
DO $$ BEGIN
  CREATE TYPE product_status AS ENUM (
    'draft',
    'pending_review',
    'active',
    'changes_required',
    'rejected',
    'delisted',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ── A2. categories: additive columns (D2) ────────────────────────────────────
-- Justified: Category.icon (product.types.ts:47), Category.color (:49),
--   Category.image (:50), admin nav sort, admin active toggle.
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS sort_order    INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS icon          TEXT,
  ADD COLUMN IF NOT EXISTS color         TEXT,
  ADD COLUMN IF NOT EXISTS image_url     TEXT,
  ADD COLUMN IF NOT EXISTS description   TEXT;


-- ── A3. products: additive columns ───────────────────────────────────────────
-- Every column below is justified by a frontend file (Hard Rule 2a):
--   tags           → seller-store.ts SellerProduct.tags (L69) + Product.tags
--   story          → seller-store.ts SellerProduct.story (L66)
--   handmade       → seller-store.ts SellerProduct.handmade (L84)
--   gi_tagged      → seller-store.ts SellerProduct.giTagged (L85)
--   free_shipping  → seller-store.ts SellerProduct.freeShipping (L82) + Product.freeDelivery
--   featured_by_admin → seller-store.ts SellerProduct.featuredByAdmin (L88); SA toggle
--   views          → seller-store.ts SellerProduct.views (L89)
--   wishlist_count → seller-store.ts SellerProduct.wishlistCount (L90)
--   rating         → product.types.ts Product.rating (L29) + SellerProduct.rating (L93)
--   review_count   → product.types.ts Product.reviewCount (L30) + SellerProduct.reviewCount (L94)
--   search_vector  → D5 requirement: GIN full-text search
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS tags              TEXT[]    NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS story             TEXT,
  ADD COLUMN IF NOT EXISTS handmade          BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS gi_tagged         BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS free_shipping     BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured_by_admin BOOLEAN   NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS views             INTEGER   NOT NULL DEFAULT 0  CHECK (views             >= 0),
  ADD COLUMN IF NOT EXISTS wishlist_count    INTEGER   NOT NULL DEFAULT 0  CHECK (wishlist_count    >= 0),
  ADD COLUMN IF NOT EXISTS rating            NUMERIC(3,2) NOT NULL DEFAULT 0.00
                                               CHECK (rating >= 0 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS review_count      INTEGER   NOT NULL DEFAULT 0  CHECK (review_count      >= 0);

-- search_vector: generated stored tsvector (D5)
-- Using 'english' dictionary (not 'simple') for stemming benefit on English-transliterated
-- artisan product names (e.g. "handcrafted" → matches "handcraft").
-- Title weighted A (highest), description weighted B.
-- Must be added separately because GENERATED columns cannot use ADD COLUMN IF NOT EXISTS
-- in older Postgres versions — guard with a DO block.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'products'
      AND column_name  = 'search_vector'
  ) THEN
    ALTER TABLE products
      ADD COLUMN search_vector TSVECTOR
        GENERATED ALWAYS AS (
          setweight(to_tsvector('english', coalesce(name,        '')), 'A') ||
          setweight(to_tsvector('english', coalesce(description, '')), 'B')
        ) STORED;
  END IF;
END $$;


-- ── A4. product_variants: additive columns + SKU UNIQUE (D1) ─────────────────
-- price_paise    → absolute price in paise; supersedes price_adjustment (see Section D)
-- compare_at_paise → nullable MRP override for this variant
-- label          → display label e.g. "Medium / Red"; maps to SellerProduct.variants[].name
-- is_default     → one default per product; app-layer rule, no DB trigger
-- options        → NOT added: frontend variants shape uses typed fields, not a jsonb bag
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS price_paise          INTEGER  NOT NULL DEFAULT 0
                                                  CHECK (price_paise >= 0),
  ADD COLUMN IF NOT EXISTS compare_at_price_paise INTEGER
                                                  CHECK (compare_at_price_paise >= 0),
  ADD COLUMN IF NOT EXISTS label                TEXT,
  ADD COLUMN IF NOT EXISTS is_default           BOOLEAN  NOT NULL DEFAULT false;

-- SKU UNIQUE on product_variants (0 rows — safe; NULLs excluded by PostgreSQL UNIQUE)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema   = 'public'
      AND table_name     = 'product_variants'
      AND constraint_name = 'product_variants_sku_key'
  ) THEN
    ALTER TABLE product_variants ADD CONSTRAINT product_variants_sku_key UNIQUE (sku);
  END IF;
END $$;


-- ── A5. product_images: additive columns (D4) ────────────────────────────────
-- alt_text   → seller-store.ts SellerProduct.images[].altText (L78)
-- variant_id → D4 requirement: colour variant owns its gallery subset
ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS alt_text   TEXT,
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL;


-- ── A6. inventory: add variant_id (D1 + D6) ──────────────────────────────────
-- variant_id nullable now; backfill + NOT NULL + swap UNIQUE to variant_id in Section D.
-- quantity_reserved already satisfies D6 "reserved_quantity for checkout holds" (task 14).
ALTER TABLE inventory
  ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE;


-- ============================================================================
-- SECTION B: INDEXES
-- ============================================================================

-- ── B1. pg_trgm extension (D5) ───────────────────────────────────────────────
-- Available in pg_available_extensions; not yet installed (installed_version = null).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── B2. categories indexes (D2) ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_categories_is_active   ON categories (is_active);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order  ON categories (sort_order);

-- ── B3. products indexes (D5 + status) ───────────────────────────────────────
-- GIN full-text search on generated tsvector
CREATE INDEX IF NOT EXISTS idx_products_search_vector
  ON products USING GIN (search_vector);

-- Trigram index for ILIKE / similarity search on product name (D5)
CREATE INDEX IF NOT EXISTS idx_products_name_trgm
  ON products USING GIN (name gin_trgm_ops);

-- Composite: admin listing by status + recency
CREATE INDEX IF NOT EXISTS idx_products_status_updated
  ON products (status, updated_at DESC);

-- GIN on tags array for containment queries (@>)
CREATE INDEX IF NOT EXISTS idx_products_tags
  ON products USING GIN (tags);

-- featured_by_admin: partial index (sparse — most products are not featured)
CREATE INDEX IF NOT EXISTS idx_products_featured
  ON products (featured_by_admin) WHERE featured_by_admin = true;

-- ── B4. product_variants indexes (D1) ────────────────────────────────────────
-- Partial index on sku (excludes NULLs for efficiency)
CREATE INDEX IF NOT EXISTS idx_product_variants_sku
  ON product_variants (sku) WHERE sku IS NOT NULL;

-- Composite: find the default variant for a product quickly
CREATE INDEX IF NOT EXISTS idx_product_variants_default
  ON product_variants (product_id, is_default);

-- ── B5. product_images indexes (D4) ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_product_images_variant_id
  ON product_images (variant_id) WHERE variant_id IS NOT NULL;

-- ── B6. inventory indexes (D1 + D6) ──────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_inventory_variant_id
  ON inventory (variant_id) WHERE variant_id IS NOT NULL;


-- ============================================================================
-- SECTION C: COMMENT ON — documenting all D1–D6 rulings
-- ============================================================================

COMMENT ON TYPE product_status IS
  'Task 3 D3: canonical product moderation enum. '
  'Values: draft (seller draft), pending_review (submitted for SA review), '
  'active (SA approved; unifies legacy approved+published), '
  'changes_required (SA requested edits), rejected (SA permanently rejected), '
  'delisted (SA removed a previously active product), archived (seller archived). '
  'out_of_stock is NOT in this enum — it is a derived inventory state. '
  'Conversion of products.status TEXT column to this enum is in Section D.';

COMMENT ON COLUMN categories.is_active IS
  'D2: admin can deactivate a category without deleting it. Default true.';
COMMENT ON COLUMN categories.sort_order IS
  'D2: display order in storefront navigation menus and category pages.';
COMMENT ON COLUMN categories.icon IS
  'D2: icon identifier string. Matches Category.icon in src/types/product.types.ts:47.';
COMMENT ON COLUMN categories.color IS
  'D2: hex or Tailwind color token. Matches Category.color in src/types/product.types.ts:49.';
COMMENT ON COLUMN categories.image_url IS
  'D2: hero image storage path for category landing pages. Matches Category.image (:50). '
  'Storage bucket wiring is task 8.';
COMMENT ON COLUMN categories.parent_id IS
  'D2: self-FK for category hierarchy. Currently ON DELETE SET NULL (live constraint). '
  'Task 3 recommends changing to ON DELETE RESTRICT — see Section D. '
  'Circular-reference prevention is an app-layer / task-7 concern (no trigger here).';

COMMENT ON COLUMN products.tags IS
  'Frontend: text[] of string tags. Read by SellerProduct.tags (seller-store.ts:69) '
  'and Product.tags (product.types.ts:38). GIN-indexed for @> containment queries.';
COMMENT ON COLUMN products.story IS
  'Frontend: artisan origin story text. Read by SellerProduct.story (seller-store.ts:66).';
COMMENT ON COLUMN products.handmade IS
  'Frontend: true if product is handmade. Badge in seller-products UI (seller-store.ts:84).';
COMMENT ON COLUMN products.gi_tagged IS
  'Frontend: true if product carries a GI Tag. Badge in seller-products UI (:85).';
COMMENT ON COLUMN products.free_shipping IS
  'Frontend: free shipping flag. Read by SellerProduct.freeShipping (:82) '
  'and Product.freeDelivery (product.types.ts:37).';
COMMENT ON COLUMN products.featured_by_admin IS
  'Frontend: SA-controlled featured badge. SellerProduct.featuredByAdmin (:88). '
  'Partial index on true values only.';
COMMENT ON COLUMN products.views IS
  'Frontend: page-view counter. SellerProduct.views (:89). '
  'Incremented by task 13 server action; not a trigger.';
COMMENT ON COLUMN products.wishlist_count IS
  'Frontend: denormalized wishlist-add count. SellerProduct.wishlistCount (:90). '
  'Updated by task 7 trigger.';
COMMENT ON COLUMN products.rating IS
  'Frontend: denormalized average rating 0–5 (2 decimals). '
  'Product.rating (product.types.ts:29) + SellerProduct.rating (:93). '
  'Updated by task 7 rollup trigger on reviews table.';
COMMENT ON COLUMN products.review_count IS
  'Frontend: denormalized review count. '
  'Product.reviewCount (:30) + SellerProduct.reviewCount (:94). '
  'Updated by task 7 trigger.';
COMMENT ON COLUMN products.search_vector IS
  'D5: GENERATED STORED tsvector using english dictionary '
  '(English stemming benefits transliterated artisan product names). '
  'setweight: name=A, description=B. GIN-indexed via idx_products_search_vector.';
COMMENT ON COLUMN products.mrp IS
  'D4/Section D: currently numeric(10,2). '
  '0 float rows in live DB at time of task 3. '
  'Conversion to mrp_paise integer paise is planned in Section D.';
COMMENT ON COLUMN products.selling_price IS
  'D4/Section D: currently numeric(10,2). '
  '2 rows with non-integer values at time of task 3. '
  'Conversion to selling_price_paise integer paise is planned in Section D.';
COMMENT ON COLUMN products.status IS
  'D3/Section D: currently text with CHECK constraint. '
  'product_status enum has been created in task 3. '
  'Column type conversion (update approved→active, published→active, then ALTER TYPE) '
  'is in Section D and requires owner approval.';

COMMENT ON COLUMN product_variants.price_paise IS
  'D1: absolute selling price for this variant in paise (integer). '
  'This is the canonical price field. '
  'price_adjustment (legacy relative numeric offset) is deprecated — see Section D.';
COMMENT ON COLUMN product_variants.compare_at_price_paise IS
  'D1: compare-at / MRP price for this variant in paise. '
  'NULL means inherit from parent products.mrp.';
COMMENT ON COLUMN product_variants.label IS
  'D1: display label for this variant combination, e.g. "Medium / Red". '
  'Maps to SellerProduct.variants[].name in seller-store.ts:81. '
  'Populated by the application layer by concatenating variant_name + variant_value.';
COMMENT ON COLUMN product_variants.is_default IS
  'D1: marks the default variant shown on PDP load. '
  'Application rule (task 13/16): every product must have exactly one default variant. '
  'Not enforced by a DB trigger — enforced in the server action upsert logic.';
COMMENT ON COLUMN product_variants.price_adjustment IS
  'D1/Section D: legacy relative price offset (numeric). '
  'Superseded by price_paise (absolute). Deprecation plan in Section D. '
  '0 rows exist — no backfill needed when owner approves drop.';
COMMENT ON COLUMN product_variants.sku IS
  'D1: stock-keeping unit. UNIQUE constraint added in task 3 (guarded). '
  'PostgreSQL treats NULLs as distinct for UNIQUE purposes — multiple NULL SKUs allowed.';

COMMENT ON COLUMN product_images.alt_text IS
  'D4: accessibility alt text. '
  'Read by SellerProduct.images[].altText in seller-store.ts:78.';
COMMENT ON COLUMN product_images.variant_id IS
  'D4: optional FK to product_variants. Allows a colour variant to own its gallery subset. '
  'NULL means the image belongs to the parent product (shown for all variants). '
  'ON DELETE SET NULL preserves orphaned images for admin review.';

COMMENT ON COLUMN inventory.variant_id IS
  'D1/D6: nullable FK to product_variants. '
  'Task 3 adds this column. Inventory will move from product-level to variant-level: '
  'once every product has at least one variant, populate variant_id for all rows, '
  'then apply Section D to make it NOT NULL and swap the UNIQUE constraint.';
COMMENT ON COLUMN inventory.quantity_reserved IS
  'D6: reserved quantity for in-progress checkout holds. '
  'CHECK >= 0. Task 14 will decrement this during checkout and release on cancel/timeout.';


-- ============================================================================
-- SECTION D: REQUIRES OWNER APPROVAL — ALL COMMENTED OUT
-- ============================================================================
-- Reply "APPROVED" to each item before task 4 begins.
-- Items are independent; each can be approved separately.

/*
────────────────────────────────────────────────────────────────────────────────
D-1: CONVERT categories.parent_id FK from ON DELETE SET NULL → ON DELETE RESTRICT
────────────────────────────────────────────────────────────────────────────────
Rationale: Prevents orphaning subcategories when a parent is deleted.
Precondition: 0 category rows in live DB — safe to run immediately.

  ALTER TABLE categories DROP CONSTRAINT categories_parent_id_fkey;
  ALTER TABLE categories ADD CONSTRAINT categories_parent_id_fkey
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE RESTRICT;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-2: CONVERT products.mrp + products.selling_price to INTEGER PAISE
────────────────────────────────────────────────────────────────────────────────
Rationale: Hard Rule — money must be integer paise.
Live state: 5 rows. 0 float mrp rows. 2 float selling_price rows.
Review first: SELECT id, name, mrp, selling_price FROM products WHERE selling_price != FLOOR(selling_price);

Step 1 — Add paise columns:
  ALTER TABLE products
    ADD COLUMN mrp_paise           INTEGER,
    ADD COLUMN selling_price_paise INTEGER;

Step 2 — Backfill (round to nearest paise):
  UPDATE products
    SET mrp_paise           = ROUND(mrp           * 100)::INTEGER,
        selling_price_paise = ROUND(selling_price * 100)::INTEGER;

Step 3 — Apply constraints:
  ALTER TABLE products
    ALTER COLUMN mrp_paise           SET NOT NULL,
    ALTER COLUMN selling_price_paise SET NOT NULL;
  ALTER TABLE products
    ADD CONSTRAINT mrp_paise_positive           CHECK (mrp_paise           >= 0),
    ADD CONSTRAINT selling_price_paise_positive CHECK (selling_price_paise >= 0),
    ADD CONSTRAINT selling_price_paise_not_above_mrp
      CHECK (selling_price_paise <= mrp_paise);

Step 4 — Drop old columns AFTER all app queries migrate to new columns:
  ALTER TABLE products DROP COLUMN mrp;
  ALTER TABLE products DROP COLUMN selling_price;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-3: CONVERT products.status from TEXT to product_status ENUM
────────────────────────────────────────────────────────────────────────────────
Rationale: Type safety and prevention of invalid status values.
Live state: 4 rows 'approved', 1 row 'published'. Both map to 'active'.
product_status enum already created in Section A.

Step 1 — Update existing rows:
  UPDATE products SET status = 'active'
    WHERE status IN ('approved', 'published');

Step 2 — Drop the old CHECK constraint:
  ALTER TABLE products DROP CONSTRAINT IF EXISTS products_status_check;

Step 3 — Cast column type:
  ALTER TABLE products
    ALTER COLUMN status TYPE product_status
      USING status::product_status;

Step 4 — Set enum default:
  ALTER TABLE products
    ALTER COLUMN status SET DEFAULT 'draft'::product_status;

Verify status distribution first:
  SELECT status, COUNT(*) FROM products GROUP BY status;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-4: DEPRECATE product_variants.price_adjustment
────────────────────────────────────────────────────────────────────────────────
Rationale: price_paise (absolute, integer paise) supersedes price_adjustment (relative, numeric).
Precondition: 0 rows in product_variants — no backfill needed.

  ALTER TABLE product_variants DROP COLUMN price_adjustment;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-5: MIGRATE inventory from product-level to variant-level
────────────────────────────────────────────────────────────────────────────────
Rationale: D1 mandates inventory references the variant, not the product.
Precondition: All products must have at least one product_variant row first (task 13 work).

Step 1 — For each existing inventory row, find the default variant:
  UPDATE inventory i
    SET variant_id = pv.id
    FROM product_variants pv
    WHERE pv.product_id = i.product_id
      AND pv.is_default = true;

Step 2 — Verify no inventory rows remain with variant_id IS NULL:
  SELECT COUNT(*) FROM inventory WHERE variant_id IS NULL;

Step 3 — Enforce NOT NULL:
  ALTER TABLE inventory ALTER COLUMN variant_id SET NOT NULL;

Step 4 — Swap UNIQUE from product_id to variant_id:
  ALTER TABLE inventory DROP CONSTRAINT inventory_product_id_key;
  ALTER TABLE inventory ADD CONSTRAINT inventory_variant_id_key UNIQUE (variant_id);

Step 5 — Optionally drop product_id FK after all queries are updated:
  ALTER TABLE inventory DROP COLUMN product_id;

OWNER SIGN-OFF REQUIRED: [ ]
*/
