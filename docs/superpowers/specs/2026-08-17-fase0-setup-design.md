# Fase 0 — Setup & fondamenta — Design

Sotto-progetto 1 della roadmap in `docs/BRIEF.md` (§9). Approvato in chat
dall'utente il 2026-08-17. Obiettivo: passare dallo scheletro statico
HTML/CSS/JS a un monorepo Next.js pronto per le fasi successive, senza
ancora collegare Supabase/Vercel reali (l'utente li creerà manualmente
seguendo `docs/SETUP.md`).

## Scope

In scope:
- Monorepo pnpm workspaces + Turborepo.
- `packages/ui`: porta della palette/design tokens dello scheletro
  (`assets/css/style.css`) in un tema Tailwind condiviso, più componenti
  base (`Button`, `Card`, `Container`, `SectionTitle`, `Badge`).
- `apps/web` e `apps/admin`: scaffold Next.js 15 (App Router, TypeScript
  strict) minimi, che importano il tema di `packages/ui` e montano una
  home page placeholder per verificare il collegamento visivo.
- `packages/db`: client Supabase tipizzato con placeholder per i tipi
  generati (nessun progetto reale ancora).
- `.env.example` per `apps/web` e `apps/admin` secondo §10 del brief.
- `docs/SETUP.md`: istruzioni manuali per l'utente (creazione progetto
  Supabase regione UE, due progetti Vercel, chiavi, domini).

Fuori scope (fasi successive):
- Porting completo delle 4 pagine esistenti dentro `apps/web` (Fase 2).
- Header/Footer dinamici da `site_settings` (Fase 2/4).
- Guard di autenticazione su `apps/admin` (Fase 3).
- Qualsiasi tabella Supabase reale, RLS, auth (Fase 1+).
- Le pagine HTML statiche in root restano intoccate.

## Struttura

```
CrewMate/
├── apps/
│   ├── web/
│   └── admin/
├── packages/
│   ├── ui/
│   └── db/
├── docs/
│   ├── BRIEF.md
│   └── SETUP.md
├── pnpm-workspace.yaml
├── turbo.json
├── package.json
└── (index.html, shop.html, forum.html, candidature.html, assets/ — invariati)
```

## Design system (`packages/ui`)

- `packages/ui/src/theme/tokens.css` — stesse CSS variables dello
  scheletro (`--bg-900`, `--accent`, `--green`, `--text`, `--radius`,
  `--shadow`, font "Press Start 2P" + Segoe UI...).
- `packages/ui/tailwind-preset.ts` — preset Tailwind che mappa i token in
  `theme.extend.colors`, `borderRadius`, `boxShadow`, `fontFamily`.
- Componenti React in `packages/ui/src/components/`: `Button` (varianti
  primary/outline, come `.btn .btn-primary` / `.btn .btn-outline`),
  `Card`, `Container`, `SectionTitle`, `Badge` (per lo stato server
  online/offline).
- Esportati da un unico entrypoint `packages/ui/src/index.ts`.

## `apps/web` e `apps/admin`

- Next.js 15, App Router, TypeScript strict, ESLint config condivisa.
- `apps/web`: `app/layout.tsx` importa i token CSS di `packages/ui`,
  `app/page.tsx` è una home placeholder che monta `Button`/`Card`/
  `SectionTitle` per verifica visiva (non è ancora la Home reale del
  brief).
- `apps/admin`: stesso scaffold minimo, nessuna logica di auth.
- Entrambe le app dipendono da `packages/ui` e `packages/db` via
  workspace protocol (`workspace:*`).

## `packages/db`

- `packages/db/src/client.ts`: wrapper attorno a
  `@supabase/supabase-js` (`createClient`), legge URL/anon key da env.
- `packages/db/src/database.types.ts`: placeholder con commento che
  spiega come rigenerare (`supabase gen types typescript --project-id ...`)
  una volta creato il progetto reale.

## Env e setup

- `apps/web/.env.example`: `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`.
- `apps/admin/.env.example`: le stesse + `SUPABASE_SERVICE_ROLE_KEY`,
  `RCON_HOST`, `RCON_PORT`, `RCON_PASSWORD`, `DISCORD_CLIENT_ID`,
  `DISCORD_CLIENT_SECRET`.
- `docs/SETUP.md`: passi manuali (fuori dal codice) per creare i
  progetti Supabase/Vercel e popolare le env reali.

## Verifica

- `pnpm install` pulito sulla root del monorepo.
- `pnpm turbo build` e `pnpm turbo lint` passano su tutti i workspace.
- `pnpm --filter web dev` e `pnpm --filter admin dev` si avviano e
  mostrano la palette/i componenti di `packages/ui` (verifica visiva).
- Le pagine HTML statiche esistenti continuano a funzionare invariate
  (nessuna regressione, non sono toccate da questa fase).

## Decisioni

| Tema | Scelta |
|------|--------|
| Styling | Tailwind CSS, tema derivato dai token CSS esistenti |
| Next.js | v15, App Router, TypeScript strict |
| Package manager | pnpm workspaces + Turborepo |
| Provisioning cloud | Manuale da parte dell'utente, via `docs/SETUP.md` |
| Contenuto pagine reali (4 pagine) | Rimandato a Fase 2, non in questa fase |
