-- Domain 5: Orders & Payments
-- orders, order_items, payments, refunds

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique, -- format: ORD-2024-000001
  user_id uuid not null references profiles(id) on delete restrict,
  status text not null default 'pending_payment' check (status in (
    'pending_payment','paid','confirmed','processing','ready_for_pickup',
    'picked_up','in_transit','out_for_delivery','delivered','cancelled'
  )),
  shipping_address jsonb not null, -- denormalized snapshot per Rule (order history integrity)
  subtotal numeric(10,2) not null,
  delivery_charge numeric(10,2) not null default 0,
  discount_amount numeric(10,2) not null default 0,
  total_amount numeric(10,2) not null,
  coupon_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_user_id on orders(user_id);
create index if not exists idx_orders_status on orders(status);

-- Multi-seller carts split into one order_item per seller line, per order (Rule OR-007)
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id) on delete restrict,
  seller_id uuid not null references sellers(id) on delete restrict,
  variant_id uuid references product_variants(id) on delete set null,
  product_name text not null, -- snapshot at time of order
  quantity int not null check (quantity > 0),
  unit_price numeric(10,2) not null,
  subtotal numeric(10,2) not null,
  item_status text not null default 'pending' check (item_status in (
    'pending','accepted','processing','ready_for_pickup','picked_up',
    'in_transit','out_for_delivery','delivered','cancelled'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on order_items(order_id);
create index if not exists idx_order_items_seller_id on order_items(seller_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  razorpay_order_id text,
  razorpay_payment_id text,
  amount numeric(10,2) not null,
  status text not null default 'created' check (status in ('created','pending','captured','failed','refunded')),
  webhook_verified boolean not null default false, -- source of truth per Rule OR-001/OR-002
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_payments_order_id on payments(order_id);

create table if not exists refunds (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references payments(id) on delete restrict,
  order_id uuid not null references orders(id) on delete restrict,
  amount numeric(10,2) not null,
  razorpay_refund_id text,
  status text not null default 'initiated' check (status in ('initiated','processing','completed','failed')),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
