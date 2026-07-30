-- Domain 7: Reviews & Returns
-- reviews, review_images, returns

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null unique references order_items(id) on delete cascade, -- Rule REV-002: one review per product per order
  product_id uuid not null references products(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  review_text text,
  is_approved boolean not null default false, -- Rule REV-003
  created_at timestamptz not null default now()
);

create index if not exists idx_reviews_product_id on reviews(product_id);

create table if not exists review_images (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  image_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists returns (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  reason text not null,
  evidence_photo_url text not null, -- Rule RR-002
  status text not null default 'requested' check (status in (
    'requested','approved','rejected','pickup_assigned','received','quality_checked','refund_initiated','refunded'
  )),
  refund_id uuid references refunds(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_returns_order_item_id on returns(order_item_id);
