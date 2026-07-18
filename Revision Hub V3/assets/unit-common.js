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

  function safeResourceUrl(value) {
    if (!value) return null;
    try {
      const url = new URL(value, window.location.origin);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  }

  function makeResCard({ title, url }) {
    const safeUrl = safeResourceUrl(url);
    if (!safeUrl) return null;
    const { icon, cta } = iconFor(url);

    const yt = (url || "").match(
      /(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    );

    const card = document.createElement("a");
    card.href = safeUrl;
    card.target = "_blank";
    card.rel = "noopener";
    card.className =
      "block bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300";

    const media = document.createElement("div");
    media.className = "w-full h-32 rounded-lg mb-4 flex items-center justify-center overflow-hidden bg-stripes relative";
    if (yt) {
      const thumbnail = document.createElement("img");
      thumbnail.src = `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg`;
      thumbnail.alt = "Video thumbnail";
      thumbnail.className = "w-full h-full object-cover";
      media.appendChild(thumbnail);
    } else {
      const mediaIcon = document.createElement("span");
      mediaIcon.className = "material-icons text-4xl text-gray-600";
      mediaIcon.textContent = icon;
      media.appendChild(mediaIcon);
    }

    const heading = document.createElement("h3");
    heading.className = "font-semibold text-gray-800 mb-2";
    heading.textContent = title || "Untitled";

    const action = document.createElement("div");
    action.className = "flex items-center text-sm font-semibold";
    action.style.color = "var(--accent)";
    action.append(document.createTextNode(`${cta} `));
    const actionIcon = document.createElement("span");
    actionIcon.className = "material-icons ml-1";
    actionIcon.textContent = cta === "Watch Now" ? "play_arrow" : cta === "Take Quiz" ? "arrow_forward" : "open_in_new";
    action.appendChild(actionIcon);

    card.append(media, heading, action);
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
  "inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/40 border border-white/50 backdrop-blur-md text-gray-900 text-sm font-medium shadow-sm transition-all hover:bg-white/60";

      const code = document.createElement("span");
      code.className = "font-mono text-purple-800 font-bold";
      code.textContent = item.code || "";
      const note = document.createElement("span");
      note.className = "text-gray-800 text-sm font-medium whitespace-nowrap";
      note.textContent = item.note || "";
      chip.append(code, note);

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
        const card = makeResCard({ title: r.title, url: r.url });
        if (grid && card) grid.appendChild(card);
      });

      hideEmptyBlocks();
      renderSparxSection(data);
    } catch (e) {
      console.error("Unit load error:", e);
    }
  }

  document.addEventListener("DOMContentLoaded", loadUnit);
})();
