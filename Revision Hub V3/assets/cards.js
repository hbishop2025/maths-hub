/* ===============================================================
   YEAR 9 — AUTOMATIC UNIT LOADER
   =============================================================== */

(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const pageType = body.dataset.page;

    // Only run on Year 9 unit pages
    if (pageType !== "year9") return;

    // Detect year9_unitXX.html from URL
    const path = window.location.pathname || "";
    const match = path.match(/year9_unit(\d{2})\.html$/);
    if (!match) {
      console.warn("cards.js: Not a recognised Year 9 unit URL:", path);
      return;
    }

    const unit = match[1]; // "07"
    const DATA_URL = "../assets/data/year9_unit" + unit + ".json";
    console.log("Loading unit data from:", DATA_URL);

    const GRID_FOR = {
      worksheets: document.getElementById("grid-worksheets"),
      videos:     document.getElementById("grid-videos"),
      other:      document.getElementById("grid-other"),
    };

    function makeResCard({ title, url }) {
      const safeUrl = ensureHttps(url);
      const { icon, cta } = iconFor(url);
      const thumb = ytThumbFor(url);

      const media = thumb
        ? `<div class="w-full h-32 rounded-lg mb-4 overflow-hidden relative">
            <img src="${thumb}" class="w-full h-full object-cover">
            <span class="material-icons absolute inset-0 m-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 text-gray-800">play_arrow</span>
           </div>`
        : `<div class="w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-stripes relative">
            <span class="material-icons text-4xl text-gray-600">${icon}</span>
           </div>`;

      const card = document.createElement("a");
      card.href = safeUrl;
      card.target = "_blank";
      card.rel = "noopener";
      card.className =
        "block bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform";

      card.innerHTML = `
        ${media}
        <h3 class="font-semibold text-gray-800 mb-2">${title}</h3>
        <div class="flex items-center text-sm font-semibold" style="color:var(--accent);">
          ${cta}
          <span class="material-icons ml-1">
            ${cta === "Watch Now" ? "play_arrow" :
              cta === "Take Quiz" ? "arrow_forward" :
              "open_in_new"}
          </span>
        </div>
      `;

      return card;
    }

    function hideEmptyBlocks() {
      ["worksheets", "videos", "other"].forEach((key) => {
        const grid = GRID_FOR[key];
        const title = grid?.previousElementSibling;
        if (grid && grid.children.length === 0) {
          grid.style.display = "none";
          if (title) title.style.display = "none";
        }
      });

      const emptyMsg = document.getElementById("unit-empty");
      if (emptyMsg) {
        const any =
          GRID_FOR.worksheets.children.length +
          GRID_FOR.videos.children.length +
          GRID_FOR.other.children.length > 0;
        emptyMsg.hidden = any;
      }
    }

    function renderSparxSection(data) {
      const list = data.sparx_codes || [];
      if (!list.length) return;

      const section = document.getElementById("sparx-section");
      const container = document.getElementById("sparx-code-list");

      list.forEach(item => {
        const chip = document.createElement("span");
        chip.className =
          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium border border-gray-200";

        chip.innerHTML = `
          <span class="font-mono text-purple-600 font-semibold">${item.code}</span>
          <span class="text-gray-600 text-sm">${item.note || ""}</span>
        `;

        container.appendChild(chip);
      });

      section.classList.remove("hidden");
    }

    async function loadUnit() {
      try {
        const data = await fetch(DATA_URL, { cache: "no-store" })
          .then((r) => r.ok ? r.json() : { items: [] });

        const rows = Array.isArray(data) ? data : data.items || [];
        const items = rows.filter(
          r => r.title && r.url && String(r.active ?? "true") !== "false"
        );

        items.sort((a, b) =>
          new Date(b.addediso || 0) - new Date(a.addediso || 0)
        );

        items.forEach(res => {
          const key = (res.blockkey || "").toLowerCase();
          const grid = GRID_FOR[key];
          if (grid) grid.appendChild(makeResCard(res));
        });

        hideEmptyBlocks();
        renderSparxSection(data);

      } catch (err) {
        console.error("cards.js: error loading unit data:", err);
      }
    }

    loadUnit();
  });
})();
