-- Domain 8: Coupons & Offers
-- coupons, coupon_usages, offers

create table if not exists coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique, -- stored/compared case-insensitively (Rule CP-001) — enforce lower() at query time
  coupon_type text not null check (coupon_type in ('admin','seller')),
  seller_id uuid references sellers(id) on delete cascade, -- null for admin (platform-wide) coupons
  discount_type text not null check (discount_type in ('percentage','flat')),
  discount_value numeric(10,2) not null,
  min_order_value numeric(10,2) not null default 0,
  usage_limit int,
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint seller_coupon_requires_seller check (
    (coupon_type = 'seller' and seller_id is not null) or
    (coupon_type = 'admin' and seller_id is null)
  )
);

create index if not exists idx_coupons_seller_id on coupons(seller_id);

create table if not exists coupon_usages (
  id uuid primary key default gen_random_uuid(),
  coupon_id uuid not null references coupons(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  order_id uuid not null references orders(id) on delete cascade,
  used_at timestamptz not null default now()
);

create index if not exists idx_coupon_usages_coupon_id on coupon_usages(coupon_id);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  discount_type text not null check (discount_type in ('percentage','flat')),
  discount_value numeric(10,2) not null,
  valid_from timestamptz not null default now(),
  valid_until timestamptz not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
