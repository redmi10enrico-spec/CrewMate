/* ==========================================================================
   CrewMate Network — Componenti condivisi (header + footer)
   Iniettati via JS per evitare duplicazione HTML tra le pagine.
   Ogni pagina include un <div id="header"></div> e <div id="footer"></div>
   e imposta window.CREWMATE_PAGE = "home|shop|forum|candidature".
   ========================================================================== */

const CREWMATE = {
  serverIP: "play.crewmate.net", // <-- Modifica con l'IP reale del server
  discord: "#",                  // <-- Link Discord
  siteName: "CrewMate Network",
};

const NAV_ITEMS = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "shop", label: "Shop", href: "shop.html" },
  { id: "forum", label: "Forum", href: "forum.html" },
  { id: "candidature", label: "Candidature", href: "candidature.html" },
];

function renderHeader() {
  const current = window.CREWMATE_PAGE || "home";
  const links = NAV_ITEMS.map(
    (item) =>
      `<li><a href="${item.href}" class="${item.id === current ? "active" : ""}">${item.label}</a></li>`
  ).join("");

  return `
  <header class="site-header">
    <div class="container navbar">
      <a href="index.html" class="nav-brand">
        <img src="assets/img/logo.png" alt="${CREWMATE.siteName}" onerror="this.onerror=null;this.src='assets/img/logo.svg'">
        <span>CrewMate</span>
      </a>

      <nav>
        <ul class="nav-links" id="navLinks">${links}</ul>
      </nav>

      <div class="nav-actions">
        <button class="ip-copy" id="ipCopy" title="Clicca per copiare l'IP">
          🎮 <code>${CREWMATE.serverIP}</code>
        </button>
        <button class="nav-toggle" id="navToggle" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>`;
}

function renderFooter() {
  const year = new Date().getFullYear();
  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <img src="assets/img/logo.png" alt="${CREWMATE.siteName}" onerror="this.onerror=null;this.src='assets/img/logo.svg'">
          <p>Il server Minecraft dove costruire, giocare e crescere insieme alla community.</p>
        </div>
        <div class="footer-col">
          <h4>Naviga</h4>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="shop.html">Shop</a></li>
            <li><a href="forum.html">Forum</a></li>
            <li><a href="candidature.html">Candidature</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Community</h4>
          <ul>
            <li><a href="${CREWMATE.discord}">Discord</a></li>
            <li><a href="#">Regolamento</a></li>
            <li><a href="#">Staff</a></li>
            <li><a href="#">Vote</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Legale</h4>
          <ul>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Termini di Servizio</a></li>
            <li><a href="#">Cookie Policy</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>© ${year} ${CREWMATE.siteName}. Non affiliato con Mojang o Microsoft.</span>
        <span>Fatto con 💙 dalla community</span>
      </div>
    </div>
  </footer>`;
}

/* Inizializzazione ------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");
  if (headerEl) headerEl.innerHTML = renderHeader();
  if (footerEl) footerEl.innerHTML = renderFooter();

  // Toggle menu mobile
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (toggle && navLinks) {
    toggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  // Copia IP negli appunti
  const ipCopy = document.getElementById("ipCopy");
  if (ipCopy) {
    ipCopy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(CREWMATE.serverIP);
        const original = ipCopy.innerHTML;
        ipCopy.innerHTML = "✅ <code>Copiato!</code>";
        setTimeout(() => (ipCopy.innerHTML = original), 1500);
      } catch (e) {
        console.warn("Clipboard non disponibile", e);
      }
    });
  }
});
