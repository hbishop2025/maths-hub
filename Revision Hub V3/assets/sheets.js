// sheets.js  — helpers for CSV + cards (+ lightweight caching)
window.Sheets = (() => {

  function parseCSV(text) {
    const rows = []; let r = [], f = "", q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      if (q) {
        if (c === '"' && text[i + 1] === '"') { f += '"'; i++; }
        else if (c === '"') { q = false; }
        else { f += c; }
      } else {
        if (c === '"') q = true;
        else if (c === ",") { r.push(f.trim()); f = ""; }
        else if (c === "\r") {}
        else if (c === "\n") { r.push(f.trim()); rows.push(r); r = []; f = ""; }
        else { f += c; }
      }
    }
    if (f.length || r.length) { r.push(f.trim()); rows.push(r); }
    const header = rows.shift().map(h => (h || "").toLowerCase());
    return rows.map(row => {
      const o = {}; header.forEach((h, i) => o[h] = (row[i] || "").trim()); return o;
    });
  }

  function parseDate(s) {
    if (!s) return null;
    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
      const [d, m, y] = s.split("/").map(Number);
      const dt = new Date(y, m - 1, d);
      return isNaN(dt) ? null : dt;
    }
    const dt = new Date(s);
    return isNaN(dt) ? null : dt;
  }

  function ensureHttps(u) { return /^https?:\/\//i.test(u) ? u : ("https://" + u); }

  function iconFor(url) {
    const u = (url || "").toLowerCase();
    if (u.endsWith(".pdf")) return { icon: "picture_as_pdf", cta: "View" };
    if (u.includes("youtube") || u.includes("youtu.be")) return { icon: "videocam", cta: "Watch Now" };
    if (u.includes("quiz") || u.includes("forms.gle") || u.includes("form")) return { icon: "quiz", cta: "Take Quiz" };
    return { icon: "description", cta: "View" };
  }

  function youtubeThumb(url) {
    const m = (url || "").match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
  }

  // localStorage cache (TTL in ms; default 10 minutes)
  async function fetchCSV(url, ttl = 10 * 60 * 1000) {
    const key = "csv:" + url;
    const now = Date.now();
    try {
      const cached = JSON.parse(localStorage.getItem(key) || "null");
      if (cached && (now - cached.time) < ttl) {
        return cached.text;
      }
    } catch {}

    const text = await fetch(url, { cache: "no-store" }).then(r => r.text());
    try { localStorage.setItem(key, JSON.stringify({ time: now, text })); } catch {}
    return text;
  }

  // A tiny card builder that matches our style (optional to use)
  function buildCard({ title, url }) {
    const { icon, cta } = iconFor(url);
    const yt = youtubeThumb(url);
    const thumb = yt
      ? `<div class="w-full h-32 rounded-lg mb-4 overflow-hidden relative">
           <img src="${yt}" alt="Video thumbnail" class="w-full h-full object-cover">
           <span class="material-icons absolute inset-0 m-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 text-gray-800">play_arrow</span>
         </div>`
      : `<div class="w-full h-32 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
           <span class="material-icons text-4xl text-gray-400">${icon}</span>
         </div>`;

    const el = document.createElement("div");
    el.className = "bg-white p-4 rounded-xl shadow-sm";
    el.innerHTML = `
      ${thumb}
      <h3 class="font-semibold text-gray-800 mb-2">${title || "Untitled"}</h3>
      <a class="flex items-center font-semibold" href="${ensureHttps(url)}" target="_blank" rel="noopener"
         style="color:var(--accent);">
        ${cta}
        <span class="material-icons ml-1">${cta === "Watch Now" ? "play_arrow" : (cta === "Take Quiz" ? "arrow_forward" : "download")}</span>
      </a>`;
    return el;
  }

  return { parseCSV, parseDate, ensureHttps, iconFor, youtubeThumb, fetchCSV, buildCard };
})();