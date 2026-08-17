-- Fase 8: forum custom (categorie con permessi per ruolo, discussioni,
-- risposte, moderazione).

create table public.forum_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  icon text not null default '',
  "order" integer not null default 0,
  min_role_view public.app_role not null default 'user',
  min_role_post public.app_role not null default 'user'
);

create table public.forum_threads (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.forum_categories (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  title text not null,
  slug text not null,
  pinned boolean not null default false,
  locked boolean not null default false,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  last_reply_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index forum_threads_category_id_idx on public.forum_threads (category_id);

create table public.forum_posts (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.forum_threads (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  content text not null,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index forum_posts_thread_id_idx on public.forum_posts (thread_id);

alter table public.forum_categories enable row level security;
alter table public.forum_threads enable row level security;
alter table public.forum_posts enable row level security;

-- Confronta due ruoli per rango (user < helper < mod < admin), usata dalle
-- policy sotto per i permessi di lettura/scrittura per categoria.
create or replace function public.role_rank(r public.app_role)
returns integer
language sql
immutable
as $$
  select case r
    when 'user' then 0
    when 'helper' then 1
    when 'mod' then 2
    when 'admin' then 3
  end;
$$;

-- Rango del ruolo dell'utente corrente (0/'user' se anonimo o senza
-- profilo): usata per non dover ripetere la subquery su profiles in ogni
-- policy.
create or replace function public.current_role_rank()
returns integer
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select public.role_rank(role) from public.profiles where id = auth.uid()),
    0
  );
$$;

create policy "forum_categories_select_by_role"
  on public.forum_categories for select
  to public
  using (public.current_role_rank() >= public.role_rank(min_role_view));

create policy "forum_threads_select_by_role"
  on public.forum_threads for select
  to public
  using (
    exists (
      select 1 from public.forum_categories fc
      where fc.id = forum_threads.category_id
        and public.current_role_rank() >= public.role_rank(fc.min_role_view)
    )
  );

create policy "forum_threads_insert_by_role"
  on public.forum_threads for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.forum_categories fc
      where fc.id = forum_threads.category_id
        and public.current_role_rank() >= public.role_rank(fc.min_role_post)
    )
  );

create policy "forum_posts_select_by_role"
  on public.forum_posts for select
  to public
  using (
    exists (
      select 1 from public.forum_threads ft
      join public.forum_categories fc on fc.id = ft.category_id
      where ft.id = forum_posts.thread_id
        and public.current_role_rank() >= public.role_rank(fc.min_role_view)
    )
  );

create policy "forum_posts_insert_by_role"
  on public.forum_posts for insert
  to authenticated
  with check (
    auth.uid() = author_id
    and exists (
      select 1 from public.forum_threads ft
      join public.forum_categories fc on fc.id = ft.category_id
      where ft.id = forum_posts.thread_id
        and ft.locked = false
        and public.current_role_rank() >= public.role_rank(fc.min_role_post)
    )
  );

-- Un utente può modificare solo i propri post (edited_at aggiornato dal
-- client). Pin/lock/eliminazione thread e moderazione restano riservati
-- al pannello admin (service role, bypassa la RLS).
create policy "forum_posts_update_own"
  on public.forum_posts for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Aggiorna last_reply_at ad ogni nuovo post, cosi' l'utente non ha
-- bisogno di un permesso di update sui thread (che non ha via RLS).
create or replace function public.touch_thread_last_reply()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.forum_threads set last_reply_at = new.created_at where id = new.thread_id;
  return new;
end;
$$;

create trigger forum_posts_touch_thread
  after insert on public.forum_posts
  for each row execute function public.touch_thread_last_reply();

-- Contatore visualizzazioni: incrementabile da chiunque (anche anonimi)
-- senza concedere un permesso di update generico sui thread.
create or replace function public.increment_thread_views(thread_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.forum_threads set views = views + 1 where id = thread_id;
$$;

grant execute on function public.increment_thread_views(uuid) to anon, authenticated;
