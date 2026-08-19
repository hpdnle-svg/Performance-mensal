-- Performance Regional SP | banco persistente Supabase
-- Execute no SQL Editor do Supabase.

create table if not exists public.performance_days (
  date date primary key,
  source_name text not null default '',
  imported_at timestamptz not null default now(),
  rows jsonb not null default '[]'::jsonb
);

create index if not exists performance_days_imported_at_idx
  on public.performance_days (imported_at desc);

alter table public.performance_days enable row level security;

-- O painel exige login com e-mail/senha. Usuários autenticados podem consultar e manter os dias.
drop policy if exists "authenticated_read_performance_days" on public.performance_days;
create policy "authenticated_read_performance_days"
  on public.performance_days for select
  to authenticated
  using (true);

drop policy if exists "authenticated_insert_performance_days" on public.performance_days;
create policy "authenticated_insert_performance_days"
  on public.performance_days for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated_update_performance_days" on public.performance_days;
create policy "authenticated_update_performance_days"
  on public.performance_days for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "authenticated_delete_performance_days" on public.performance_days;
create policy "authenticated_delete_performance_days"
  on public.performance_days for delete
  to authenticated
  using (true);
