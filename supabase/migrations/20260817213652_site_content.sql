-- Fase 2: contenuti editabili della Home (site_settings, server_modes,
-- home_features). Lettura pubblica, scrittura solo da service role
-- (pannello admin, Fase 3+).

create table public.site_settings (
  key text primary key,
  value jsonb not null
);

create table public.server_modes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  icon text not null default '',
  image_url text,
  "order" integer not null default 0,
  enabled boolean not null default true
);

create table public.home_features (
  id uuid primary key default gen_random_uuid(),
  title text not null unique,
  description text not null,
  icon text not null default '',
  "order" integer not null default 0,
  enabled boolean not null default true
);

alter table public.site_settings enable row level security;
alter table public.server_modes enable row level security;
alter table public.home_features enable row level security;

-- site_settings non ha un flag enabled: è config globale, sempre
-- pubblica (nome sito, IP, link Discord servono per renderizzare la
-- Home anche a visitatori anonimi).
create policy "site_settings_select_public"
  on public.site_settings for select
  to public
  using (true);

create policy "server_modes_select_enabled"
  on public.server_modes for select
  to public
  using (enabled = true);

create policy "home_features_select_enabled"
  on public.home_features for select
  to public
  using (enabled = true);

-- Nessuna policy insert/update/delete per il client: queste tabelle si
-- scrivono solo dal pannello admin (service role, Fase 3+).
