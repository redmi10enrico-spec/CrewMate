-- Fase 1: profili utente, ruoli e verifica del nome Minecraft.
-- Vedi docs/superpowers/specs/2026-08-17-fase1-auth-design.md

create type public.app_role as enum ('user', 'helper', 'mod', 'admin');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  username text unique,
  mc_username text,
  mc_uuid text,
  mc_verified boolean not null default false,
  discord_id text,
  avatar_url text,
  role public.app_role not null default 'user',
  created_at timestamptz not null default now()
);

create table public.mc_verification_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  code text not null,
  expires_at timestamptz not null,
  used boolean not null default false
);

create index mc_verification_codes_user_id_idx on public.mc_verification_codes (user_id);

alter table public.profiles enable row level security;
alter table public.mc_verification_codes enable row level security;

-- profiles: lettura per qualunque utente autenticato (dati non sensibili,
-- servono per mostrare autore forum/candidature nelle fasi successive).
create policy "profiles_select_authenticated"
  on public.profiles for select
  to authenticated
  using (true);

-- profiles: l'utente aggiorna solo la propria riga. Il trigger
-- prevent_role_self_update blocca comunque il cambio di ruolo dal client.
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Nessuna policy insert/delete per il client: la riga profilo nasce solo
-- dal trigger handle_new_user (esecuzione come proprietario della funzione).

-- mc_verification_codes: l'utente vede e crea solo i propri codici.
-- Nessuna policy update/delete: la conferma (used = true, mc_verified =
-- true su profiles) avviene solo via service role dall'endpoint
-- /api/mc-verify (Route Handler server-side), mai dal client.
create policy "mc_codes_select_own"
  on public.mc_verification_codes for select
  to authenticated
  using (auth.uid() = user_id);

create policy "mc_codes_insert_own"
  on public.mc_verification_codes for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Crea automaticamente il profilo alla registrazione di un nuovo utente
-- Supabase Auth, precompilando i campi disponibili da email/password
-- (raw_user_meta_data.mc_username, impostato dal client in fase di
-- signUp) o da OAuth Discord (raw_user_meta_data.provider_id/avatar_url).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, mc_username, discord_id, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'mc_username',
    case
      when new.raw_app_meta_data ->> 'provider' = 'discord'
        then new.raw_user_meta_data ->> 'provider_id'
      else null
    end,
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Impedisce che un utente si assegni un ruolo diverso da 'user' senza
-- passare dal service role (usato solo lato server, es. pannello admin
-- in Fase 3).
create function public.prevent_role_self_update()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    raise exception 'Non puoi modificare il tuo ruolo';
  end if;
  return new;
end;
$$;

create trigger profiles_prevent_role_self_update
  before update on public.profiles
  for each row execute function public.prevent_role_self_update();
