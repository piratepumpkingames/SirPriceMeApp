create table if not exists public.scan_usage (
  app_user_id text not null,
  month_key text not null,
  scan_count integer not null default 0 check (scan_count >= 0),
  updated_at timestamptz not null default now(),
  primary key (app_user_id, month_key)
);

create index if not exists scan_usage_month_key_idx on public.scan_usage (month_key);

alter table public.scan_usage enable row level security;

grant select, insert, update, delete on table public.scan_usage to service_role;
