-- Domain 2: Seller Management
-- sellers, seller_documents, bank_accounts, seller_performance

create table if not exists sellers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  seller_id text not null unique, -- format: SEL-IND-000123
  seller_type text not null check (seller_type in ('ngo','village_producer','artisan','shop_owner','shg_group','professional')),
  legal_name text not null,
  display_name text not null,
  username text not null unique,
  village text,
  district text,
  state text,
  description text,
  kyc_status text not null default 'pending' check (kyc_status in ('pending','under_review','approved','rejected','changes_required','suspended')),
  current_tier text not null default 'bronze' check (current_tier in ('bronze','silver','gold','platinum')),
  registration_fee_paid boolean not null default false,
  registration_fee_waived boolean not null default false,
  rejected_at timestamptz,
  reapply_after date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sellers_user_id on sellers(user_id);
create index if not exists idx_sellers_kyc_status on sellers(kyc_status);

create table if not exists seller_documents (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references sellers(id) on delete cascade,
  document_type text not null check (document_type in ('aadhaar','pan','gst','business_registration')),
  document_number text,
  file_url text, -- signed URL / private bucket path
  verified boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_seller_documents_seller_id on seller_documents(seller_id);

create table if not exists bank_accounts (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references sellers(id) on delete cascade,
  account_holder_name text not null,
  account_number text not null,
  ifsc_code text not null,
  bank_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists seller_performance (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null unique references sellers(id) on delete cascade,
  total_sales numeric(12,2) not null default 0,
  avg_rating numeric(3,2) not null default 0,
  return_rate numeric(5,4) not null default 0,
  cancellation_rate numeric(5,4) not null default 0,
  on_time_dispatch_rate numeric(5,4) not null default 0,
  performance_score numeric(5,4) not null default 0,
  calculated_at timestamptz not null default now()
);
