-- Domain 9 (part): Commission & System
-- platform_settings — single-row global config, editable by Super Admin

create table if not exists platform_settings (
  id int primary key default 1,
  commission_rate numeric(5,2) not null default 10,
  return_window_days int not null default 7,
  settlement_cycle_days int not null default 7,
  min_settlement_amount numeric(10,2) not null default 100,
  seller_registration_fee numeric(10,2) not null default 499,
  updated_by uuid references profiles(id),
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into platform_settings (id) values (1)
on conflict (id) do nothing;
