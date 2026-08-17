-- Fase 3: audit log delle modifiche fatte dal pannello admin.
-- Le scritture avvengono solo da server actions con service role (bypassa
-- la RLS): la policy select qui sotto serve solo per un'eventuale lettura
-- diretta da un client admin autenticato.

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.profiles (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  diff jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_created_at_idx on public.audit_logs (created_at desc);

alter table public.audit_logs enable row level security;

create policy "audit_logs_select_admin"
  on public.audit_logs for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );
