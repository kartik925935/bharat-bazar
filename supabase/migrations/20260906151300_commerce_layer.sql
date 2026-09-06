-- ============================================================================
-- Task 4: Commerce Layer Reconciliation
-- Migration: 20260906151300_commerce_layer.sql
--
-- Preconditions verified via MCP before writing:
--   - Task 3 applied. product_variants has price_paise.
--   - All commerce tables (carts, orders, payments, etc.) have 0 rows.
--   - returns.refund_id FK to refunds table already exists.
--   - products.rating and products.review_count already exist.
--   - Legacy numeric columns exist on orders, order_items, payments, etc.
--     (Their drop is deferred to Section D per strict rules).
--
-- Canonical Identity Targets:
--   - order_items.seller_id → sellers(id)
--   - commissions.seller_id → sellers(id)
--
-- Rules applied:
--   - Additive + idempotent everywhere.
--   - order_items snapshot ALL product data for strict immutability (D1).
--   - All NEW money columns: integer paise, CHECK >= 0.
--   - No RLS policies or business logic triggers.
-- ============================================================================

-- ============================================================================
-- SECTION A: ENUMS, NEW COLUMNS, CONSTRAINTS
-- ============================================================================

-- ── A1. ENUMS (D2, D3, D5, D6) ───────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE order_status AS ENUM (
    'pending_payment', 'confirmed', 'processing', 'packed', 'shipped',
    'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'created', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE return_status AS ENUM (
    'requested', 'under_review', 'approved', 'rejected', 'pickup_scheduled', 'picked_up', 'received', 'refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE return_reason AS ENUM (
    'defective', 'wrong_item', 'not_as_described', 'size_issue', 'quality_issue', 'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE review_status AS ENUM (
    'pending', 'published', 'removed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- ── A2. cart_items (D8) ──────────────────────────────────────────────────────
-- cart_items.variant_id already exists. Just enforcing uniqueness per cart.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'cart_items' AND constraint_name = 'cart_items_cart_id_variant_id_key'
  ) THEN
    ALTER TABLE cart_items ADD CONSTRAINT cart_items_cart_id_variant_id_key UNIQUE (cart_id, variant_id);
  END IF;
END $$;


-- ── A3. orders & order_items (D1 Immutability) ───────────────────────────────
-- Add _paise money columns to orders
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS subtotal_paise        INTEGER CHECK (subtotal_paise >= 0),
  ADD COLUMN IF NOT EXISTS delivery_charge_paise INTEGER CHECK (delivery_charge_paise >= 0),
  ADD COLUMN IF NOT EXISTS discount_amount_paise INTEGER CHECK (discount_amount_paise >= 0),
  ADD COLUMN IF NOT EXISTS total_amount_paise    INTEGER CHECK (total_amount_paise >= 0);

-- Snapshot columns to order_items (D1)
ALTER TABLE order_items
  ADD COLUMN IF NOT EXISTS variant_label    TEXT,
  ADD COLUMN IF NOT EXISTS sku              TEXT,
  ADD COLUMN IF NOT EXISTS image_url        TEXT,
  ADD COLUMN IF NOT EXISTS seller_name      TEXT,
  ADD COLUMN IF NOT EXISTS commission_rate  NUMERIC(5,2),
  ADD COLUMN IF NOT EXISTS unit_price_paise INTEGER CHECK (unit_price_paise >= 0),
  ADD COLUMN IF NOT EXISTS subtotal_paise   INTEGER CHECK (subtotal_paise >= 0);


-- ── A4. payments & refunds (D3) ──────────────────────────────────────────────
ALTER TABLE payments
  ADD COLUMN IF NOT EXISTS gateway             TEXT NOT NULL DEFAULT 'razorpay',
  ADD COLUMN IF NOT EXISTS gateway_signature   TEXT,
  ADD COLUMN IF NOT EXISTS currency            TEXT NOT NULL DEFAULT 'INR',
  ADD COLUMN IF NOT EXISTS amount_paise        INTEGER CHECK (amount_paise >= 0),
  ADD COLUMN IF NOT EXISTS idempotency_key     TEXT,
  ADD COLUMN IF NOT EXISTS raw_webhook_payload JSONB;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'payments' AND constraint_name = 'payments_razorpay_payment_id_key'
  ) THEN
    -- If they ever switch to generic gateway_payment_id, they can use razorpay_payment_id field as the storage
    ALTER TABLE payments ADD CONSTRAINT payments_razorpay_payment_id_key UNIQUE (razorpay_payment_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'payments' AND constraint_name = 'payments_idempotency_key_key'
  ) THEN
    ALTER TABLE payments ADD CONSTRAINT payments_idempotency_key_key UNIQUE (idempotency_key);
  END IF;
END $$;

ALTER TABLE refunds
  ADD COLUMN IF NOT EXISTS amount_paise      INTEGER CHECK (amount_paise >= 0),
  ADD COLUMN IF NOT EXISTS gateway_refund_id TEXT;


-- ── A5. returns (D5) ─────────────────────────────────────────────────────────
ALTER TABLE returns
  ADD COLUMN IF NOT EXISTS description         TEXT,
  ADD COLUMN IF NOT EXISTS refund_amount_paise INTEGER CHECK (refund_amount_paise >= 0);


-- ── A6. reviews (D6) ─────────────────────────────────────────────────────────
ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS title                     TEXT,
  ADD COLUMN IF NOT EXISTS verified_purchase_item_id UUID REFERENCES order_items(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderation_status         review_status NOT NULL DEFAULT 'pending';

-- Enforce ONE review per user per product
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'reviews' AND constraint_name = 'reviews_user_id_product_id_key'
  ) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_user_id_product_id_key UNIQUE (user_id, product_id);
  END IF;
END $$;


-- ── A7. coupons & coupon_usages (D7) ─────────────────────────────────────────
ALTER TABLE coupons
  ADD COLUMN IF NOT EXISTS discount_value_paise  INTEGER CHECK (discount_value_paise >= 0),
  ADD COLUMN IF NOT EXISTS min_order_value_paise INTEGER CHECK (min_order_value_paise >= 0),
  ADD COLUMN IF NOT EXISTS max_discount_paise    INTEGER CHECK (max_discount_paise >= 0);

-- Enforce ONE usage per user per coupon per order
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public' AND table_name = 'coupon_usages' AND constraint_name = 'coupon_usages_coupon_order_user_key'
  ) THEN
    ALTER TABLE coupon_usages ADD CONSTRAINT coupon_usages_coupon_order_user_key UNIQUE (coupon_id, user_id, order_id);
  END IF;
END $$;


-- ── A8. offers, commissions, settlements (Paise additions) ───────────────────
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS discount_value_paise INTEGER CHECK (discount_value_paise >= 0);

ALTER TABLE commissions
  ADD COLUMN IF NOT EXISTS order_amount_paise      INTEGER CHECK (order_amount_paise >= 0),
  ADD COLUMN IF NOT EXISTS commission_amount_paise INTEGER CHECK (commission_amount_paise >= 0),
  ADD COLUMN IF NOT EXISTS seller_net_amount_paise INTEGER CHECK (seller_net_amount_paise >= 0);

ALTER TABLE settlements
  ADD COLUMN IF NOT EXISTS total_amount_paise INTEGER CHECK (total_amount_paise >= 0);


-- ============================================================================
-- SECTION B: INDEXES
-- ============================================================================

-- D7: Functional UNIQUE index on lower(code) for coupons
CREATE UNIQUE INDEX IF NOT EXISTS idx_coupons_lower_code ON coupons (lower(code));

-- Lookup indexes for payments/refunds
CREATE INDEX IF NOT EXISTS idx_payments_gateway_payment_id ON payments (razorpay_payment_id);
CREATE INDEX IF NOT EXISTS idx_refunds_gateway_refund_id ON refunds (gateway_refund_id);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);
CREATE INDEX IF NOT EXISTS idx_returns_order_item_id ON returns (order_item_id);


-- ============================================================================
-- SECTION C: COMMENT ON
-- ============================================================================

COMMENT ON COLUMN order_items.variant_id IS 'D1: Maps to product_variants. Task 3 made variants the sellable unit. Currently ON DELETE SET NULL which protects historical orders if a variant is deleted.';
COMMENT ON COLUMN order_items.sku IS 'D1: Snapshot of variant SKU at purchase time to guarantee order immutability.';
COMMENT ON COLUMN order_items.variant_label IS 'D1: Snapshot of variant attributes (e.g., Medium/Red).';
COMMENT ON COLUMN order_items.seller_name IS 'D1: Snapshot of seller name.';
COMMENT ON COLUMN order_items.commission_rate IS 'D1: Snapshot of the resolved commission rate applied to this item.';
COMMENT ON COLUMN order_items.unit_price_paise IS 'D1: Snapshot of price in paise.';
COMMENT ON COLUMN orders.shipping_address IS 'D1: JSONB snapshot of shipping address to prevent order mutation if user alters their address book.';
COMMENT ON TYPE order_status IS 'D2: Canonical order status state machine. Transition triggers handled in task 7.';
COMMENT ON COLUMN payments.gateway IS 'D3: e.g., razorpay or cod.';
COMMENT ON COLUMN payments.amount_paise IS 'D3: Integer paise amount replacing legacy numeric amount.';
COMMENT ON COLUMN returns.order_item_id IS 'D5: Frontend seller-returns UI expects per-item returns.';
COMMENT ON COLUMN reviews.moderation_status IS 'D6: Matches Super Admin reviews panel requirements.';
COMMENT ON INDEX idx_coupons_lower_code IS 'D7: Case-insensitive unique constraint for coupon codes.';


-- ============================================================================
-- SECTION D: REQUIRES OWNER APPROVAL — ALL COMMENTED OUT
-- ============================================================================
-- Reply "APPROVED" to each item before task 5 begins.
-- Since ALL commerce tables currently have 0 rows, these are safe to run, but
-- grouped here per strict instructions.

/*
────────────────────────────────────────────────────────────────────────────────
D-1: DROP LEGACY NUMERIC MONEY COLUMNS (0 rows affected)
────────────────────────────────────────────────────────────────────────────────
Rationale: Money must be integer paise. We added the _paise variants in Section A.
Since row counts are 0, no data migration is necessary.

  ALTER TABLE orders
    DROP COLUMN subtotal,
    DROP COLUMN delivery_charge,
    DROP COLUMN discount_amount,
    DROP COLUMN total_amount;

  ALTER TABLE order_items
    DROP COLUMN unit_price,
    DROP COLUMN subtotal;

  ALTER TABLE payments DROP COLUMN amount;
  ALTER TABLE refunds DROP COLUMN amount;
  ALTER TABLE coupons DROP COLUMN discount_value, DROP COLUMN min_order_value;
  ALTER TABLE offers DROP COLUMN discount_value;
  
  ALTER TABLE commissions
    DROP COLUMN order_amount,
    DROP COLUMN commission_amount,
    DROP COLUMN seller_net_amount;
    
  ALTER TABLE settlements DROP COLUMN total_amount;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-2: ENFORCE NOT NULL ON NEW PAISE COLUMNS
────────────────────────────────────────────────────────────────────────────────
Rationale: New paise columns added in Section A default to NULL. After D-1, we 
should make them NOT NULL (with defaults where appropriate) to maintain schema integrity.

  ALTER TABLE orders
    ALTER COLUMN subtotal_paise SET NOT NULL,
    ALTER COLUMN total_amount_paise SET NOT NULL;
    
  ALTER TABLE order_items
    ALTER COLUMN unit_price_paise SET NOT NULL,
    ALTER COLUMN subtotal_paise SET NOT NULL;
    
  ALTER TABLE payments ALTER COLUMN amount_paise SET NOT NULL;

OWNER SIGN-OFF REQUIRED: [ ]


────────────────────────────────────────────────────────────────────────────────
D-3: CONVERT STATUS TEXT COLUMNS TO ENUMS
────────────────────────────────────────────────────────────────────────────────
Rationale: Replace loose text columns with the strong enums created in Section A.

  ALTER TABLE orders ALTER COLUMN status DROP DEFAULT;
  ALTER TABLE orders ALTER COLUMN status TYPE order_status USING status::order_status;
  ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending_payment'::order_status;

  ALTER TABLE payments ALTER COLUMN status DROP DEFAULT;
  ALTER TABLE payments ALTER COLUMN status TYPE payment_status USING status::payment_status;
  ALTER TABLE payments ALTER COLUMN status SET DEFAULT 'created'::payment_status;

  ALTER TABLE returns ALTER COLUMN status DROP DEFAULT;
  ALTER TABLE returns ALTER COLUMN status TYPE return_status USING status::return_status;
  ALTER TABLE returns ALTER COLUMN status SET DEFAULT 'requested'::return_status;
  
  -- Assuming return_reason replaces returns.reason text
  ALTER TABLE returns ALTER COLUMN reason TYPE return_reason USING reason::return_reason;

OWNER SIGN-OFF REQUIRED: [ ]
*/
