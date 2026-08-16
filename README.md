# CrewMate Network — Sito Web

Sito web (scheletro) per il server Minecraft **CrewMate Network**.
Realizzato con HTML, CSS e JavaScript puri — nessun framework, nessuna build necessaria.

## 🚀 Come avviare il sito

Apri direttamente `index.html` nel browser, oppure avvia un piccolo server locale
(consigliato, così la copia dell'IP e i componenti funzionano al meglio):

```bash
# Con Python
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## 📄 Pagine

| Pagina             | File                | Descrizione                                    |
|--------------------|---------------------|------------------------------------------------|
| Home               | `index.html`        | Landing page con hero, modalità e statistiche  |
| Shop               | `shop.html`         | Ranghi, kit e cosmetici con filtri             |
| Forum              | `forum.html`        | Categorie di discussione e sidebar             |
| Candidature        | `candidature.html`  | Modulo per candidarsi nello staff              |

## 📁 Struttura del progetto

```
CrewMate/
├── index.html            # Home
├── shop.html             # Shop
├── forum.html            # Forum
├── candidature.html      # Candidature staff
├── assets/
│   ├── css/
│   │   └── style.css     # Tutti gli stili (con variabili/design tokens)
│   ├── js/
│   │   ├── components.js # Header + footer condivisi (iniettati via JS)
│   │   └── main.js       # Interazioni: filtri shop, invio form
│   └── img/
│       ├── logo.svg      # Logo segnaposto (fallback)
│       └── logo.png      # ← Metti qui il logo reale del server
└── README.md
```

## 🎨 Personalizzazione

### Logo
Salva il logo reale del server come `assets/img/logo.png`.
Verrà usato automaticamente al posto del segnaposto SVG.

### IP del server, Discord e nome
Modifica le costanti in cima a `assets/js/components.js`:

```js
const CREWMATE = {
  serverIP: "play.crewmate.net", // IP reale del server
  discord: "#",                  // Link al Discord
  siteName: "CrewMate Network",
};
```

### Colori
Tutti i colori sono definiti come variabili CSS in cima a `assets/css/style.css`
(sezione `:root`). Cambia lì la palette per aggiornare tutto il sito.

### Menu di navigazione
Le voci del menu sono in `NAV_ITEMS` dentro `assets/js/components.js`.

## 🔌 Prossimi passi (collegare il backend)

Questo è lo **scheletro**: la struttura e la grafica sono pronte, ma le funzioni
"vere" vanno collegate a un backend/servizio esterno.

- **Shop** → integrazione con un provider (Tebex, CraftingStore) nei bottoni "Acquista".
- **Forum** → un software forum (Flarum, Discourse, phpBB) o un backend custom.
- **Candidature** → l'invio del form in `assets/js/main.js` (funzione `initApplicationForm`)
  è in modalità demo. Collegalo a un webhook Discord, un'API o un Google Form.
- **Statistiche** (giocatori online, ecc.) → query all'API del server Minecraft.

## ⚠️ Note

Progetto non affiliato con Mojang o Microsoft. "Minecraft" è un marchio di Mojang AB.
