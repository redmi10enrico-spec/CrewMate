# 📘 Brief di Progetto — CrewMate Network

Documento guida per la realizzazione **finale** del sito del server Minecraft
**CrewMate Network**. Definisce stack, architettura, database, funzionalità e una
roadmap **step-by-step** da seguire dall'inizio alla messa online.

> Stato attuale: esiste uno **scheletro statico** (HTML/CSS/JS) con 4 pagine
> (Home, Shop, Forum, Candidature). Questo brief descrive come trasformarlo nel
> prodotto finale, dinamico e personalizzabile.

---

## 1. Obiettivi

| # | Obiettivo |
|---|-----------|
| 1 | Sito pubblico: **Home, Shop, Forum, Candidature** |
| 2 | **Shop** con consegna prodotti in-game via **RCON** (pagamenti reali collegati in una fase successiva) |
| 3 | **Forum** custom (categorie, discussioni, risposte, moderazione) |
| 4 | **Candidature** con ruoli e domande **completamente configurabili** |
| 5 | **Pannello Admin separato** (sito a parte, non `/admin`) per modificare **TUTTO** |
| 6 | Massima **personalizzazione dai dati** (niente contenuti "hardcoded") |

**Principio guida:** tutto ciò che l'admin deve poter cambiare (modalità del
server, prodotti, comandi RCON, ruoli e domande delle candidature, categorie del
forum, testi, colori, logo…) vive nel **database**, non nel codice. Il codice
legge dal DB e mostra; l'admin scrive nel DB.

---

## 2. Stack tecnologico

| Livello | Tecnologia | Note |
|---------|-----------|------|
| Framework | **Next.js (App Router, React, TypeScript)** | Rendering server + Server Actions/Route Handlers per operazioni sicure |
| Database & Auth | **Supabase** (PostgreSQL + Auth + Storage) | RLS attivo; Storage per immagini prodotti/logo |
| Hosting | **Vercel** | Due progetti: sito pubblico + admin |
| Consegna acquisti | **RCON** (Minecraft) | Solo lato server, mai dal browser |
| Pagamenti | *(fase successiva)* | Predisposizione per Stripe/PayPal |
| Styling | CSS/Tailwind (portando l'attuale design system) | Palette e componenti già definiti nello skeleton |

---

## 3. Architettura generale

```
                        ┌──────────────────────────┐
                        │      Supabase (cloud)     │
                        │  Postgres + Auth + Storage│
                        └───────────▲──────────────┘
                                    │  (stessa istanza / stesse tabelle)
              ┌─────────────────────┼─────────────────────┐
              │                     │                      │
   ┌──────────┴─────────┐   ┌───────┴────────┐    ┌────────┴────────┐
   │  SITO PUBBLICO     │   │  PANNELLO ADMIN │    │  Server Minecraft│
   │  (Next.js @Vercel) │   │ (Next.js @Vercel)│    │   (RCON)         │
   │  crewmate.net      │   │ admin.crewmate.. │    │                  │
   └──────────┬─────────┘   └───────┬─────────┘    └────────▲────────┘
              │                     │                        │
              │   Le operazioni RCON partono SOLO dal server │
              └──────────────── Server Actions ─────────────┘
```

- **Sito pubblico** e **Admin** sono **due app/deploy separati** che condividono
  **lo stesso database Supabase**.
- Consigliato un **monorepo** (pnpm workspaces + Turborepo):
  - `apps/web` → sito pubblico
  - `apps/admin` → pannello admin (deploy separato / sottodominio `admin.`)
  - `packages/db` → tipi generati da Supabase + client condiviso
  - `packages/ui` → componenti e design system condivisi
- L'admin è protetto: accessibile **solo** a profili con `role = admin` (o `staff`).

---

## 4. Modello dati (Supabase / PostgreSQL)

Schema di riferimento. Ogni tabella "di contenuto" è pensata per essere gestita
dall'admin. `order` = campo per ordinare gli elementi nell'interfaccia.

### 4.1 Utenti & autenticazione
```
profiles
  id            uuid  PK (FK auth.users.id)
  username      text  unique
  mc_username   text
  mc_uuid       text
  mc_verified   boolean default false
  discord_id    text  null
  avatar_url    text  null
  role          text  enum(user, helper, mod, admin) default 'user'
  created_at    timestamptz

mc_verification_codes        -- verifica proprietà account MC in gioco
  id          uuid PK
  user_id     uuid FK profiles
  code        text            -- codice da digitare in gioco
  expires_at  timestamptz
  used        boolean default false
```

### 4.2 Personalizzazione sito
```
site_settings                -- chiave/valore per branding e config globali
  key         text PK         -- es. 'server_ip', 'discord_url', 'site_name',
  value       jsonb           --     'theme_colors', 'logo_url', 'hero_text'...

server_modes                 -- modalità di gioco (Home)  [EDITABILE]
  id, name, slug, description, icon, image_url, "order", enabled

home_features                -- card "Perché CrewMate" [EDITABILE]
  id, title, description, icon, "order", enabled
```

### 4.3 Shop
```
product_categories           [EDITABILE]
  id, name, slug, "order"

products                     [EDITABILE]
  id, category_id FK, name, description, price, currency,
  image_url, featured boolean, enabled boolean, "order", stock int null

product_features             -- elenco puntato del prodotto [EDITABILE]
  id, product_id FK, text, "order"

product_commands             -- comandi RCON eseguiti alla consegna [EDITABILE]
  id, product_id FK, command text, "order"
                             -- es. "lp user {player} parent add vip"

orders
  id, user_id FK, status enum(pending,paid,delivered,failed,refunded),
  total, currency, created_at, paid_at, delivered_at

order_items
  id, order_id FK, product_id FK, unit_price, quantity

delivery_logs                -- audit consegne RCON
  id, order_id FK, command, response, success boolean, created_at
```

### 4.4 Forum (custom)
```
forum_categories             [EDITABILE]
  id, name, slug, description, icon, "order",
  min_role_view, min_role_post

forum_threads
  id, category_id FK, author_id FK, title, slug,
  pinned boolean, locked boolean, views int,
  created_at, last_reply_at

forum_posts
  id, thread_id FK, author_id FK, content, created_at, edited_at null
```

### 4.5 Candidature (dinamiche)
```
application_forms            -- "su cosa candidarsi" [EDITABILE]
  id, role_name, slug, description, enabled, is_open boolean, "order"

application_questions        -- domande del form [EDITABILE]
  id, form_id FK, label, type enum(text,textarea,number,select,radio,checkbox),
  options jsonb null, required boolean, placeholder, hint, "order"

applications                 -- candidature ricevute
  id, form_id FK, user_id FK, status enum(pending,interview,accepted,rejected),
  created_at, reviewed_by null, reviewed_at null, notes null

application_answers
  id, application_id FK, question_id FK, value
```

### 4.6 Audit
```
audit_logs                   -- traccia modifiche fatte dall'admin
  id, admin_id FK, action, entity, entity_id, diff jsonb, created_at
```

> **Row Level Security (RLS):** attivare su tutte le tabelle. Regole tipiche:
> lettura pubblica solo su contenuti `enabled`; scrittura su `orders`,
> `applications`, `forum_posts` solo dall'utente proprietario e autenticato;
> tabelle di configurazione scrivibili **solo** da `role in (admin)`.
> Le operazioni sensibili (RCON, cambio stato ordini) passano da codice server
> con **service role key**, mai dal client.

---

## 5. Autenticazione (flusso deciso)

Due modalità di accesso, entrambe con collegamento al nome Minecraft:

1. **Email + password** (Supabase Auth)
   - In registrazione si chiede anche il **nome Minecraft**.
2. **Login con Discord** (Supabase OAuth)
   - **Dopo** il primo login Discord, il sito chiede il **nome Minecraft**
     (se non ancora presente nel profilo).

**Verifica del nome MC (consigliata):**
- Il sito genera un **codice** (`mc_verification_codes`).
- L'utente entra nel server e digita il codice (es. `/verify ABC123`) → un
  plugin/comando marca `mc_verified = true`.
- La verifica evita che qualcuno riceva acquisti sul nick di un altro.

**Ruoli:** `user` (default) → `helper` / `mod` → `admin`. L'accesso al pannello
admin richiede `role = admin` (eventualmente `mod` per aree limitate).

---

## 6. Specifica funzionale

### 6.1 Home
- Hero con logo, IP copiabile, stato server (online/giocatori — via query/RCON).
- **Modalità di gioco** e card "Perché CrewMate": lette da `server_modes` e
  `home_features` → **modificabili dall'admin**.
- Testi principali da `site_settings`.

### 6.2 Shop
- Prodotti da `products` (+ `product_features`), filtrabili per categoria.
- Carrello → creazione **ordine** (`orders` in stato `pending`).
- **Pagamento:** in questa fase l'ordine resta `pending`/`paid` **simulato**;
  il gateway reale (Stripe/PayPal) verrà collegato dopo (vedi §9).
- Alla conferma pagamento → **consegna RCON** (vedi §7): esecuzione dei
  `product_commands` con `{player}` sostituito dal nome MC verificato.
- Storico ordini nel profilo utente.

### 6.3 Forum
- Categorie, discussioni, risposte (custom su Supabase).
- Permessi per categoria (`min_role_view`, `min_role_post`).
- Moderazione (pin, lock, elimina) da admin o ruoli staff.

### 6.4 Candidature
- Elenco dei **form aperti** (`application_forms`) → "su cosa candidarsi".
- Ogni form ha **domande dinamiche** (`application_questions`) renderizzate in
  base a `type`.
- Invio → `applications` + `application_answers`.
- L'utente vede lo stato della propria candidatura.

---

## 7. Integrazione RCON (consegna acquisti)

> RCON **non** incassa denaro: esegue comandi sul server per **consegnare** il
> prodotto (rank, kit, oggetti) dopo un ordine andato a buon fine.

Regole:
- Le credenziali RCON stanno **solo** nelle env del server (Vercel), mai nel client.
- La chiamata RCON avviene in una **Server Action / Route Handler** o in un
  **webhook** post-pagamento.
- I comandi sono **template** in `product_commands` con placeholder
  (`{player}`, `{uuid}`) sostituiti a runtime.
- Ogni esecuzione è tracciata in `delivery_logs` (comando + risposta + esito).
- **Retry** automatico se il server è offline; possibilità di **ri-consegna
  manuale** dall'admin.
- Libreria consigliata: un client RCON per Node (es. `rcon-client`).

---

## 8. Pannello Admin (sito separato) — "modifica TUTTO"

App Next.js separata (`apps/admin`, deploy su sottodominio `admin.`), protetta da
ruolo `admin`. Sezioni:

| Sezione | Cosa si modifica |
|---------|------------------|
| **Dashboard** | Statistiche: ordini, candidature, utenti, stato consegne |
| **Aspetto / Branding** | Nome sito, logo, colori (theme), IP, link Discord, testi Home (`site_settings`) |
| **Modalità server** | CRUD `server_modes` + card `home_features` |
| **Shop → Categorie** | CRUD `product_categories` |
| **Shop → Prodotti** | CRUD `products`, `product_features`, prezzo, immagine, featured |
| **Shop → Comandi RCON** | `product_commands` per ogni prodotto |
| **Shop → Ordini** | Lista ordini, stato, log consegna, **ri-consegna manuale** |
| **Candidature → Form** | CRUD `application_forms` (crea/attiva/chiudi ruoli) |
| **Candidature → Domande** | CRUD `application_questions` (tipo, ordine, obbligatorietà) |
| **Candidature → Ricevute** | Revisione, cambio stato, note |
| **Forum** | CRUD `forum_categories`, moderazione thread/post, permessi |
| **Utenti & Ruoli** | Gestione `profiles`, assegnazione ruoli |
| **Audit log** | Storico modifiche (`audit_logs`) |

**Regola d'oro:** ogni nuova funzione pubblica nasce con la sua sezione admin.
Se un contenuto appare sul sito, deve essere modificabile qui.

---

## 9. Roadmap step-by-step

Fasi in ordine. Ogni fase è rilasciabile e testabile prima della successiva.

### ✅ Fase 0 — Setup & fondamenta
- [ ] Inizializzare **monorepo** (pnpm + Turborepo): `apps/web`, `apps/admin`, `packages/db`, `packages/ui`.
- [ ] Creare progetto **Supabase** (region UE) e progetto **Vercel** (x2).
- [ ] Configurare **env** (§10) e generare i **tipi TypeScript** da Supabase.
- [ ] Portare il **design system** dallo skeleton attuale in `packages/ui`.

### 🔐 Fase 1 — Autenticazione
- [ ] Tabella `profiles` + trigger di creazione al signup.
- [ ] Login **email/password** con richiesta nome MC.
- [ ] Login **Discord** (OAuth) + step "inserisci nome MC" post-login.
- [ ] Flusso **verifica MC** (`mc_verification_codes` + comando in gioco).
- [ ] **RLS** base + ruoli.

### 🏠 Fase 2 — Sito pubblico (skeleton → Next.js)
- [ ] Layout, header/footer, routing, i18n (Italiano).
- [ ] **Home** dinamica da `server_modes` / `home_features` / `site_settings`.
- [ ] Stato server + IP copiabile.

### 🛠️ Fase 3 — Fondamenta Admin
- [ ] App `apps/admin` con **guard** su `role = admin`.
- [ ] Layout admin + framework CRUD riutilizzabile + `audit_logs`.

### 🎮 Fase 4 — Contenuti Home editabili
- [ ] CRUD `server_modes` e `home_features` nell'admin.
- [ ] Sezione **Branding** (`site_settings`: nome, logo, colori, IP, Discord).

### 🛒 Fase 5 — Shop (senza pagamento reale)
- [ ] CRUD `product_categories`, `products`, `product_features` in admin.
- [ ] Pagine shop pubbliche + carrello + creazione `orders`.
- [ ] Stato ordine simulato (`paid`) per testare la pipeline.

### 🔌 Fase 6 — RCON (consegna)
- [ ] CRUD `product_commands` in admin.
- [ ] Server Action di **consegna** (template `{player}` → RCON) + `delivery_logs`.
- [ ] **Retry** + **ri-consegna manuale** dall'admin.

### 📝 Fase 7 — Candidature dinamiche
- [ ] CRUD `application_forms` + `application_questions` in admin.
- [ ] Form pubblico dinamico + invio (`applications`, `application_answers`).
- [ ] Area **revisione** candidature in admin + stato lato utente.

### 💬 Fase 8 — Forum custom
- [ ] CRUD `forum_categories` (con permessi) in admin.
- [ ] Discussioni + risposte + viste + moderazione.

### 🎨 Fase 9 — Personalizzazione globale
- [ ] Theming da `site_settings` (colori/logo caricabili da Storage).
- [ ] Rifinire tutte le sezioni "editabili" e i default.

### 🚀 Fase 10 — Hardening & go-live
- [ ] Revisione completa **RLS** e permessi.
- [ ] SEO, meta, sitemap, performance.
- [ ] Deploy finale su Vercel (web + admin) + dominio e sottodominio.
- [ ] **[Successivo]** Collegare gateway di **pagamento reale** (Stripe/PayPal):
      webhook → `orders.status = paid` → consegna RCON automatica.

---

## 10. Variabili d'ambiente (indicative)

**Sito pubblico (`apps/web`)**
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=
```

**Admin + operazioni server (`apps/admin` / route handler)**
```
SUPABASE_SERVICE_ROLE_KEY=      # solo lato server, mai esposta
RCON_HOST=
RCON_PORT=
RCON_PASSWORD=
DISCORD_CLIENT_ID=              # per OAuth
DISCORD_CLIENT_SECRET=
# (fase successiva) STRIPE_SECRET_KEY / PAYPAL_CLIENT_ID ...
```

---

## 11. Sicurezza — punti fermi

- **RCON e service role key**: solo lato server. Mai nel browser.
- **RLS** attivo su tutte le tabelle; default "nega, poi consenti".
- Consegna prodotti **solo** su ordini `paid` e nick **verificato**.
- Validazione input (form candidature, forum) lato server.
- **Audit log** su ogni modifica admin.
- Rate limiting su login, invio candidature e post forum.

---

## 12. Decisioni prese

| Tema | Scelta |
|------|--------|
| Framework | **Next.js (React, TypeScript)** |
| Database/Auth/Storage | **Supabase** |
| Hosting | **Vercel** (web + admin separati) |
| Consegna shop | **RCON** |
| Pagamenti | **Struttura ora, gateway reale in fase successiva** |
| Login | **Email/password + nome MC** e **Discord** (nome MC richiesto dopo) |
| Forum | **Custom su Supabase** |
| Admin | **Sito separato** (`admin.`), modifica di tutti i contenuti |

---

## 13. Punti ancora da definire (quando ci arriviamo)

Non bloccano l'inizio, ma andranno decisi nelle fasi relative:
- Gateway di pagamento definitivo (Stripe vs PayPal) e valuta/IVA.
- Plugin/comando per la **verifica MC** in gioco (`/verify`).
- Come leggere lo **stato server** (query protocol vs RCON `list`).
- Policy forum (regole, ruoli di moderazione, reazioni/like sì/no).
- Dominio definitivo e sottodominio admin.
- Monorepo vs due repo separati (consigliato monorepo).

---

*Documento vivo: aggiornalo man mano che le fasi vengono completate o le
decisioni cambiano.*
