-- New Supabase projects (2026+) do not auto-grant API roles on new tables.
-- Edge Functions use service_role via supabase-js; clients never touch this table directly.
grant select, insert, update, delete on table public.scan_usage to service_role;
