create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  body text not null,
  type text not null,
  priority text not null default 'low',
  is_read boolean not null default false,
  read_at timestamptz,
  is_dismissed boolean not null default false,
  action_route text,
  action_label text,
  created_at timestamptz not null default now()
);

create index if not exists idx_notifications_user_id on notifications(user_id);

create table if not exists notification_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles(id) on delete cascade,
  email_on_critical boolean not null default true,
  email_on_high boolean not null default false,
  browser_push_enabled boolean not null default false,
  muted_types text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
