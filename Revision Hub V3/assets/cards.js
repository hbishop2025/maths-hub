/* ---------- Shared helpers (global) ---------- */

// Robust CSV parser (quotes-aware)
function parseCSV(text){
  const rows=[]; let r=[], f="", q=false;
  for (let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"' && text[i+1]==='"'){ f+='"'; i++; }
      else if(c==='"'){ q=false; }
      else f+=c;
    }else{
      if(c==='"'){ q=true; }
      else if(c===','){ r.push(f.trim()); f=""; }
      else if(c==='\r'){ /* ignore */ }
      else if(c==='\n'){ r.push(f.trim()); rows.push(r); r=[]; f=""; }
      else f+=c;
    }
  }
  if (f.length || r.length){ r.push(f.trim()); rows.push(r); }
  const header = (rows.shift()||[]).map(h => String(h||'').trim().toLowerCase());
  return rows.map(row => {
    const o={}; header.forEach((h,idx)=> o[h] = (row[idx]||'').trim()); return o;
  });
}

// Date helper
function parseDate(s){
  if(!s) return null;
  if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)){
    const [d,m,y]=s.split('/').map(Number);
    const dt=new Date(y,m-1,d);
    return isNaN(dt)?null:dt;
  }
  const dt=new Date(s);
  return isNaN(dt)?null:dt;
}

// Normalise URL
function ensureHttps(u){
  if(!u) return "#";
  return /^https?:\/\//i.test(u) ? u : ("https://" + u);
}

// Pick icon/cta for resource links
function iconFor(url){
  const u=(url||'').toLowerCase();
  if(u.endsWith('.pdf')) return {icon:"picture_as_pdf", cta:"View"};
  if(u.includes('youtube') || u.includes('youtu.be') || u.includes('watch')) return {icon:"videocam", cta:"Watch Now"};
  if(u.includes('quiz') || u.includes('forms.gle') || u.includes('form')) return {icon:"quiz", cta:"Take Quiz"};
  return {icon:"description", cta:"View"};
}

// YouTube thumbnail (if any)
function ytThumbFor(url){
  const m=(url||'').match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

/* ---------- Resource card (used by index + unit pages) ---------- */
// “Latest Information” card (index)
function makeInfoCard({ type, text, date, url }) {
  const hasLink = url && url.trim();
  const div = document.createElement("div");

  // Card container
  div.className =
    "bg-white p-4 rounded-xl shadow-sm";

  // Inner layout: text on left, button on right (stacks on small screens)
  div.innerHTML = `
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        ${type ? `<p class="text-sm text-gray-500">${type}</p>` : ``}
        <p class="font-semibold text-gray-800">${text || ""}</p>
        ${date ? `<p class="text-sm text-gray-500">${date}</p>` : ``}
      </div>

      ${
        hasLink
          ? `
        <a
          class="inline-flex items-center px-6 py-2 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-900 transition"
          href="${url}"
          target="_blank"
          rel="noopener"
          aria-label="More info about: ${text || type || "item"}"
        >
          More Info
          <span class="material-icons ml-2">arrow_forward</span>
        </a>`
          : ``
      }
    </div>
  `;

  return div;
}

/* ---------- Featured Site card (Explore page) ---------- */
/*
Expected object shape (from assets/data/featured_sites.json):
{
  "name": "DrFrostMaths",
  "url": "https://www.drfrostmaths.com/",
  "description": "Worksheets, videos, DFM tasks…",
  "type": "site" | "drive" | "quiz" | "textbook",
  "brand": {
    "bg": "#FEE2E2",        // optional: tile background
    "fg": "#B91C1C",        // optional: icon/heading colour
    "stripe": "rgba(...)"   // optional: diagonal accent
  },
  "logo": "assets/img/dfm.svg", // optional: path to logo image
  "cta": "Open"                 // optional: defaults to "Visit"
}
*/
function makeSiteCard(site){
  const name = site?.name || "Resource";
  const url  = ensureHttps(site?.url);
  const desc = site?.description || "";
  const cta  = site?.cta || "Open";

  // Brand colours (for logo/icon backgrounds)
  const bg     = site?.brand?.bg     || "#F3F4F6";  // light gray
  const fg     = site?.brand?.fg     || "#2563EB";  // blue-600
  const stripe = site?.brand?.stripe || "rgba(0,0,0,0.03)";

  // Icon fallback by type
  const typeIcon =
    site?.type === "drive"   ? "folder" :
    site?.type === "quiz"    ? "quiz" :
    site?.type === "textbook"? "menu_book" :
    "link";

  // Media block: logo or icon
  const media = site?.logo
    ? `<div class="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative"
            style="background:linear-gradient(135deg, ${bg}, #ffffff);">
         <div class="absolute inset-0" style="
              background: repeating-linear-gradient(
                -45deg,
                ${stripe},
                ${stripe} 8px,
                transparent 8px,
                transparent 16px
              ); opacity:.6;"></div>
         <img src="${site.logo}" alt="${name} logo"
              class="relative h-12 w-auto object-contain">
       </div>`
    : `<div class="w-full h-32 rounded-lg mb-4 flex items-center justify-center relative"
            style="background:linear-gradient(135deg, ${bg}, #ffffff);">
         <div class="absolute inset-0" style="
              background: repeating-linear-gradient(
                -45deg,
                ${stripe},
                ${stripe} 8px,
                transparent 8px,
                transparent 16px
              ); opacity:.6;"></div>
         <span class="material-icons text-5xl" style="color:${fg};">${typeIcon}</span>
       </div>`;

  const card = document.createElement("a");
  card.href = url;
  card.target = "_blank";
  card.rel = "noopener";
  card.className =
    "block bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition transform";

  card.innerHTML = `
    ${media}
    <h3 class="font-semibold text-gray-800 mb-1">${name}</h3>
    ${desc ? `<p class="text-sm text-gray-500 mb-4">${desc}</p>` : ``}
    <span class="inline-flex items-center px-4 py-2 rounded-lg font-semibold bg-gray-800 text-white hover:bg-gray-900 transition">
      ${cta}
      <span class="material-icons ml-1">open_in_new</span>
    </span>
  `;

  return card;
}
