-- Domain 1: User Management
-- profiles, roles, user_roles

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists roles (
  id serial primary key,
  name text not null unique check (name in ('customer','seller','delivery_partner','admin','super_admin')),
  level int not null unique
);

insert into roles (name, level) values
  ('customer', 1),
  ('delivery_partner', 2),
  ('seller', 3),
  ('admin', 4),
  ('super_admin', 5)
on conflict (name) do nothing;

create table if not exists user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  role_id int not null references roles(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (user_id, role_id)
);

create index if not exists idx_user_roles_user_id on user_roles(user_id);
