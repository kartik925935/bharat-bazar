-- Domain 9: Commission & System
-- commissions, settlements, audit_logs

create table if not exists commissions (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null unique references order_items(id) on delete cascade,
  seller_id uuid not null references sellers(id) on delete restrict,
  order_amount numeric(10,2) not null,
  commission_rate numeric(5,2) not null,
  commission_amount numeric(10,2) not null,
  seller_net_amount numeric(10,2) not null,
  settlement_status text not null default 'pending' check (settlement_status in (
    'pending','eligible','processing','settled','held'
  )),
  created_at timestamptz not null default now()
);

create index if not exists idx_commissions_seller_id on commissions(seller_id);
create index if not exists idx_commissions_settlement_status on commissions(settlement_status);

create table if not exists settlements (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers(id) on delete restrict,
  period_start date not null,
  period_end date not null,
  total_amount numeric(10,2) not null,
  status text not null default 'processing' check (status in ('processing','completed','failed')),
  transaction_ref text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_settlements_seller_id on settlements(seller_id);

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_audit_logs_entity on audit_logs(entity_type, entity_id);
create index if not exists idx_audit_logs_user_id on audit_logs(user_id);
