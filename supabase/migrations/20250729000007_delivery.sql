-- Domain 6: Delivery
-- delivery_partners, deliveries, delivery_status_history

create table if not exists delivery_partners (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  vehicle_type text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  delivery_partner_id uuid references delivery_partners(id) on delete set null,
  pickup_address jsonb not null,
  delivery_address jsonb not null,
  status text not null default 'pending' check (status in (
    'pending','assigned','picked_up','in_transit','out_for_delivery','delivered','failed'
  )),
  estimated_delivery_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_deliveries_delivery_partner_id on deliveries(delivery_partner_id);

create table if not exists delivery_status_history (
  id uuid primary key default gen_random_uuid(),
  delivery_id uuid not null references deliveries(id) on delete cascade,
  status text not null,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_delivery_status_history_delivery_id on delivery_status_history(delivery_id);
