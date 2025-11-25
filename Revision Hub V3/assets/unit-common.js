// assets/unit-common.js
// Shared logic for Year 9 (and other) unit pages.
// Uses <body data-json="..."> to know which JSON file to load.

(function () {
  const body = document.body;
  if (!body) return;

  const DATA_URL = body.dataset.json;
  if (!DATA_URL) {
    console.warn("No data-json attribute found on <body> for unit page.");
    return;
  }

  function iconFor(url) {
    const u = (url || "").toLowerCase();
    if (u.endsWith(".pdf")) return { icon: "picture_as_pdf", cta: "View" };
    if (u.includes("youtube") || u.includes("youtu.be") || u.includes("watch"))
      return { icon: "videocam", cta: "Watch Now" };
    if (u.includes("quiz") || u.includes("forms.gle") || u.includes("form"))
      return { icon: "quiz", cta: "Take Quiz" };
    return { icon: "description", cta: "View" };
  }

  function ensureHttps(u) {
    return /^https?:\/\//i.test(u) ? u : "https://" + u;
  }

  function makeResCard({ title, url }) {
    const safeUrl = ensureHttps(url);
    const { icon, cta } = iconFor(url);

    const yt = (url || "").match(
      /(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );

    const media = yt
      ? (() => {
          const id = yt[1];
          const img = `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
          return `
            <div class="w-full h-32 rounded-lg mb-4 overflow-hidden relative">
              <img src="${img}" alt="Video thumbnail" class="w-full h-full object-cover">
              <span class="material-icons absolute inset-0 m-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 text-gray-800">play_arrow</span>
            </div>`;
        })()
      : `
        <div class="w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-stripes relative">
          <span class="material-icons text-4xl text-gray-600">${icon}</span>
        </div>`;

    const card = document.createElement("a");
    card.href = safeUrl;
    card.target = "_blank";
    card.rel = "noopener";
    card.className =
      "block bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300";
    card.innerHTML = `
      ${media}
      <h3 class="font-semibold text-gray-800 mb-2">${title || "Untitled"}</h3>
      <div class="flex items-center text-sm font-semibold" style="color:var(--accent);">
        ${cta}
        <span class="material-icons ml-1">${
          cta === "Watch Now"
            ? "play_arrow"
            : cta === "Take Quiz"
            ? "arrow_forward"
            : "open_in_new"
        }</span>
      </div>
    `;
    return card;
  }

  const GRID_FOR = {
    worksheets: document.getElementById("grid-worksheets"),
    videos: document.getElementById("grid-videos"),
    other: document.getElementById("grid-other"),
  };

  function hideEmptyBlocks() {
    ["worksheets", "videos", "other"].forEach((key) => {
      const grid = document.getElementById(`grid-${key}`);
      const title = grid?.previousElementSibling;
      if (grid && grid.children.length === 0) {
        grid.style.display = "none";
        if (title) title.style.display = "none";
      }
    });
    const empty = document.getElementById("unit-empty");
    if (empty) {
      const any = ["worksheets", "videos", "other"].some((k) => {
        const grid = document.getElementById(`grid-${k}`);
        return grid && grid.children.length > 0;
      });
      empty.hidden = any;
    }
  }

  // SPARX chips
  function renderSparxSection(data) {
    const list = data.sparx_codes || [];
    if (!list.length) return;

    const section = document.getElementById("sparx-section");
    const container = document.getElementById("sparx-code-list");
    if (!section || !container) return;

    list.forEach((item) => {
      const chip = document.createElement("span");
      chip.className =
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-800 text-sm font-medium border border-gray-200";

      chip.innerHTML = `
        <span class="font-mono text-purple-600 font-semibold">${item.code}</span>
        <span class="text-gray-600 text-sm whitespace-nowrap">${item.note || ""}</span>
      `;

      container.appendChild(chip);
    });

    section.classList.remove("hidden");
  }

  async function loadUnit() {
    try {
      const data = await fetch(DATA_URL, { cache: "no-store" })
        .then((r) => r.json())
        .catch(() => ({ items: [] }));

      const rows = Array.isArray(data) ? data : data.items || [];
      const items = rows.filter(
        (r) =>
          r &&
          r.title &&
          r.url &&
          String(r.active ?? true).toLowerCase() !== "false"
      );

      // newest first if addediso present
      items.sort((a, b) => {
        const da = new Date(a.addediso || 0).getTime() || 0;
        const db = new Date(b.addediso || 0).getTime() || 0;
        return db - da;
      });

      items.forEach((r) => {
        const key = (r.blockkey || "").toLowerCase();
        const grid = GRID_FOR[key];
        if (grid) grid.appendChild(makeResCard({ title: r.title, url: r.url }));
      });

      hideEmptyBlocks();
      renderSparxSection(data);
    } catch (e) {
      console.error("Unit load error:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", loadUnit);
})();
