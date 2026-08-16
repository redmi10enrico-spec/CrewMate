/* ==========================================================================
   CrewMate Network — Script di pagina
   Interazioni base (skeleton): filtri shop, invio form candidature.
   La logica reale (backend) andrà collegata in seguito.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initShopFilters();
  initApplicationForm();
});

/* Filtri Shop ----------------------------------------------------------- */
function initShopFilters() {
  const chips = document.querySelectorAll(".filter-chip");
  const cards = document.querySelectorAll("[data-category]");
  if (!chips.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;

      cards.forEach((card) => {
        const match = filter === "all" || card.dataset.category === filter;
        card.style.display = match ? "" : "none";
      });
    });
  });
}

/* Form Candidature ------------------------------------------------------ */
function initApplicationForm() {
  const form = document.getElementById("applicationForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    // TODO: collegare invio reale (fetch verso API / Discord webhook / Google Form)
    const alert = document.getElementById("formAlert");
    if (alert) {
      alert.classList.add("success");
      alert.textContent =
        "✅ Candidatura inviata! (demo) — Collega qui il backend per riceverla davvero.";
      alert.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    form.reset();
  });
}
