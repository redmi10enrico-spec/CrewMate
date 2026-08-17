-- Fase 5: shop (categorie, prodotti, feature, ordini). Pagamenti reali
-- non ancora collegati: lo stato "paid" viene impostato da un flusso
-- simulato lato server (vedi packages/db/src/orders.ts), nello stesso
-- punto in cui in Fase 10 arriverà il webhook del gateway reale.

create type public.order_status as enum ('pending', 'paid', 'delivered', 'failed', 'refunded');

create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  "order" integer not null default 0
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.product_categories (id) on delete set null,
  name text not null unique,
  description text not null default '',
  price numeric(10, 2) not null,
  currency text not null default 'EUR',
  image_url text,
  featured boolean not null default false,
  enabled boolean not null default true,
  "order" integer not null default 0,
  stock integer
);

create index products_category_id_idx on public.products (category_id);

create table public.product_features (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products (id) on delete cascade,
  text text not null,
  "order" integer not null default 0,
  unique (product_id, text)
);

create index product_features_product_id_idx on public.product_features (product_id);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  status public.order_status not null default 'pending',
  total numeric(10, 2) not null,
  currency text not null default 'EUR',
  created_at timestamptz not null default now(),
  paid_at timestamptz,
  delivered_at timestamptz
);

create index orders_user_id_idx on public.orders (user_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid references public.products (id) on delete set null,
  unit_price numeric(10, 2) not null,
  quantity integer not null default 1
);

create index order_items_order_id_idx on public.order_items (order_id);

alter table public.product_categories enable row level security;
alter table public.products enable row level security;
alter table public.product_features enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "product_categories_select_public"
  on public.product_categories for select
  to public
  using (true);

create policy "products_select_enabled"
  on public.products for select
  to public
  using (enabled = true);

create policy "product_features_select_public"
  on public.product_features for select
  to public
  using (true);

-- orders: l'utente vede e crea solo i propri ordini, sempre in stato
-- 'pending' (le transizioni a paid/delivered/failed/refunded avvengono
-- solo da service role: flusso simulato ora, webhook di pagamento e
-- consegna RCON nelle fasi successive).
create policy "orders_select_own"
  on public.orders for select
  to authenticated
  using (auth.uid() = user_id);

create policy "orders_insert_own_pending"
  on public.orders for insert
  to authenticated
  with check (auth.uid() = user_id and status = 'pending');

create policy "order_items_select_own"
  on public.order_items for select
  to authenticated
  using (exists (select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()));

create policy "order_items_insert_own_pending_order"
  on public.order_items for insert
  to authenticated
  with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
        and orders.user_id = auth.uid()
        and orders.status = 'pending'
    )
  );
