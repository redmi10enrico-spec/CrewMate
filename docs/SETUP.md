# Setup manuale — Supabase & Vercel

Questi passi vanno fatti a mano dall'admin del progetto (non dal codice).
Servono per collegare le fasi successive a un progetto reale.

## 1. Supabase

1. Crea un account su https://supabase.com se non ne hai già uno.
2. Crea un nuovo progetto, **regione EU** (es. `eu-central-1`), come da
   `docs/BRIEF.md` §3.
3. Copia da *Project Settings → API*:
   - `Project URL` → va in `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` → va in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role key` → va in `SUPABASE_SERVICE_ROLE_KEY` (**solo** in
     `apps/admin/.env.local`, mai nel client, mai committata)
4. Compila `apps/web/.env.local` e `apps/admin/.env.local` copiando
   `.env.example` e incollando i valori reali (questi file sono già
   esclusi da git tramite `.gitignore`).
5. Le tabelle del database (`profiles`, `products`, ecc. — vedi
   `docs/BRIEF.md` §4) verranno create nella Fase 1 in poi, con le
   relative migrazioni.

## 2. Vercel

1. Crea un account su https://vercel.com se non ne hai già uno.
2. Crea **due** progetti Vercel collegati a questo repository:
   - uno con Root Directory `apps/web` (dominio principale)
   - uno con Root Directory `apps/admin` (sottodominio `admin.`)
3. In entrambi i progetti, aggiungi le stesse variabili d'ambiente dei
   rispettivi `.env.example` nelle impostazioni del progetto Vercel
   (Environment Variables), sia per Production che Preview.
4. Il deploy vero e proprio è previsto in Fase 10 (go-live) — questi
   passi preparano solo i progetti.

## 3. Discord OAuth (per la Fase 1)

1. Vai su https://discord.com/developers/applications e crea una nuova
   applicazione.
2. In *OAuth2*, copia `Client ID` e `Client Secret` → vanno in
   `DISCORD_CLIENT_ID` e `DISCORD_CLIENT_SECRET` (solo in
   `apps/admin/.env.local`, usati lato server per il flusso OAuth
   configurato in Supabase Auth).
3. Configura il provider Discord in Supabase (*Authentication →
   Providers → Discord*) con questi stessi valori.

## 4. RCON (per la Fase 6)

Non serve ancora in questa fase. Quando il server Minecraft sarà pronto
per i test di consegna, compila `RCON_HOST`, `RCON_PORT`,
`RCON_PASSWORD` in `apps/admin/.env.local`.
