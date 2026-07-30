-- Domain 3: Shop & Catalog
-- shops, categories, products, product_variants, product_images, inventory

create table if not exists shops (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references sellers(id) on delete cascade,
  shop_name text not null,
  shop_slug text not null unique,
  logo_url text,
  banner_url text,
  shop_story text,
  business_location text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  parent_id uuid references categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists idx_categories_parent_id on categories(parent_id);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers(id) on delete cascade,
  shop_id uuid not null references shops(id) on delete cascade,
  category_id uuid references categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  specifications jsonb not null default '{}'::jsonb, -- category-specific attrs e.g. size/color/fabric
  mrp numeric(10,2) not null,
  selling_price numeric(10,2) not null,
  sku text,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  weight numeric(10,3),
  dimensions jsonb,
  status text not null default 'draft' check (status in ('draft','pending_review','approved','rejected','published','archived','changes_required')),
  completeness_score int not null default 0 check (completeness_score between 0 and 100),
  rejection_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint selling_price_not_above_mrp check (selling_price <= mrp)
);

create index if not exists idx_products_seller_id on products(seller_id);
create index if not exists idx_products_status on products(status);
create index if not exists idx_products_category_id on products(category_id);

create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  variant_name text not null, -- e.g. "Size", "Color"
  variant_value text not null, -- e.g. "M", "Red"
  price_adjustment numeric(10,2) not null default 0,
  stock_quantity int not null default 0 check (stock_quantity >= 0),
  sku text
);

create index if not exists idx_product_variants_product_id on product_variants(product_id);

create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  image_url text not null,
  is_primary boolean not null default false,
  display_order int not null default 0
);

create index if not exists idx_product_images_product_id on product_images(product_id);

create table if not exists inventory (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null unique references products(id) on delete cascade,
  quantity_available int not null default 0 check (quantity_available >= 0),
  quantity_reserved int not null default 0 check (quantity_reserved >= 0),
  low_stock_threshold int not null default 5,
  updated_at timestamptz not null default now()
);
