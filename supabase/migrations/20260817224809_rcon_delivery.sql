-- Fase 6: comandi RCON per la consegna dei prodotti e log di consegna.
-- Nessuna policy pubblica: sono dati operativi sensibili (comandi reali
-- sul server di gioco), letti/scritti solo da service role.

create table public.product_commands (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  command text not null,
  "order" integer not null default 0
);

create index product_commands_product_id_idx on public.product_commands (product_id);

create table public.delivery_logs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  command text not null,
  response text,
  success boolean not null,
  created_at timestamptz not null default now()
);

create index delivery_logs_order_id_idx on public.delivery_logs (order_id);

alter table public.product_commands enable row level security;
alter table public.delivery_logs enable row level security;
