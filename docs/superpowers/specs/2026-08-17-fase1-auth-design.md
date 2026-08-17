# Fase 1 — Autenticazione — Design

Sotto-progetto 2 della roadmap (`docs/BRIEF.md` §9). L'utente ha chiesto di
proseguire tutte le fasi in sequenza senza fermarsi a chiedere conferma
(2026-08-17): questo doc resta come traccia sintetica delle decisioni prese
per questa fase, non passa per un giro di approvazione in chat.

## Vincolo noto

Non esiste ancora un progetto Supabase reale (Fase 0, scelta "solo
scaffolding") e l'ambiente non ha Docker, quindi `supabase start` (Postgres
locale) non è eseguibile qui. Le migrazioni SQL sono scritte e revisionate
manualmente ma **non eseguite** contro un database reale in questa sessione;
il codice TypeScript che le consuma è verificato con typecheck/build e test
unitari contro un client Supabase mockato, non contro un DB vero. L'utente
dovrà eseguire `supabase db push` (o applicare le migrazioni dalla dashboard)
una volta creato il progetto reale, seguendo `docs/SETUP.md`.

## Scope

In scope:
- Migrazione SQL: tabella `profiles`, tabella `mc_verification_codes`,
  enum ruolo, trigger di creazione profilo al signup, trigger che blocca
  l'auto-escalation del ruolo, RLS di base.
- `packages/db`: helper tipizzati per leggere/scrivere `profiles` e
  generare/verificare codici MC, testati con un client Supabase mockato.
- `apps/web`: client Supabase browser/server (`@supabase/ssr`), middleware
  di refresh sessione, pagine signup (email+password+nome MC) e login
  (email+password), pulsante login Discord, callback OAuth, onboarding
  post-Discord per il nome MC mancante, pagina di richiesta codice di
  verifica MC.
- Route `POST /api/mc-verify`: endpoint server-to-server (protetto da
  secret condiviso, non da sessione utente) che il futuro plugin/comando
  Minecraft chiamerà per marcare un codice come usato e il profilo come
  `mc_verified`. L'implementazione del comando `/verify` lato server di
  gioco resta fuori scope (BRIEF §13, "ancora da definire").

Fuori scope (fasi successive):
- UI per scegliere/cambiare lo `username` del sito (il campo esiste nello
  schema ma resta nullable in questa fase; non c'è nel flusso descritto
  dal brief per la Fase 1).
- Guard `role = admin` su `apps/admin` (Fase 3).
- Qualsiasi altra tabella di dominio (prodotti, forum, candidature).

## Struttura

```
supabase/
  config.toml
  migrations/
    20260817000001_profiles_and_roles.sql
packages/db/src/
  profiles.ts            # getProfile, ensureMcVerificationCode, ...
  profiles.test.ts
apps/web/
  middleware.ts
  lib/supabase/client.ts   # browser client (@supabase/ssr)
  lib/supabase/server.ts   # server client (@supabase/ssr, cookies())
  app/(auth)/actions.ts    # server actions: signUp, signIn, signInWithDiscord, signOut
  app/(auth)/login/page.tsx
  app/(auth)/signup/page.tsx
  app/auth/callback/route.ts
  app/onboarding/mc-username/page.tsx
  app/api/mc-verify/route.ts
```

## Decisioni

| Tema | Scelta |
|------|--------|
| Auth SDK Next.js | `@supabase/ssr` (browser + server client, standard per App Router) |
| `username` sito | Nullable in questa fase, nessuna UI dedicata |
| Blocco escalation ruolo | Trigger Postgres `BEFORE UPDATE`, non solo RLS |
| Verifica MC | Generazione codice lato web; conferma via endpoint server-to-server con secret condiviso (`MC_VERIFY_SECRET`), non da un vero plugin (non ancora scritto) |
| Test | Unitari con client Supabase mockato in `packages/db`; nessun test di integrazione contro Postgres reale (nessun Docker disponibile) |
