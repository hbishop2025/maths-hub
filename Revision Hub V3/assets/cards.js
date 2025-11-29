function makeSiteCard(site){
  const name = site?.name || "Resource";
  const url  = ensureHttps(site?.url);
  const desc = site?.description || "";
  const cta  = site?.cta || "Open";

  // Brand colours (for logo/icon backgrounds)
  const bg     = site?.brand?.bg     || "#F3F4F6";  // light gray
  const fg     = site?.brand?.fg     || "#2563EB";  // blue-600 (icon colour)
  const stripe = site?.brand?.stripe || "rgba(148,163,184,0.15)";

  // Icon fallback by type
  const typeIcon =
    site?.type === "drive"    ? "folder" :
    site?.type === "quiz"     ? "quiz" :
    site?.type === "textbook" ? "menu_book" :
    site?.type === "pdf"      ? "picture_as_pdf" :
    "link";

  // Top "media" area: either logo or icon on a striped panel
  const media = site?.logo
    ? `
      <div class="w-full h-32 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
           style="background:linear-gradient(135deg, ${bg}, #ffffff);">
        <div class="absolute inset-0" style="
             background: repeating-linear-gradient(
               -45deg,
               ${stripe},
               ${stripe} 8px,
               transparent 8px,
               transparent 16px
             );
             opacity:.5;"></div>
        <img src="${site.logo}" alt="${name} logo"
             class="relative max-h-14 w-auto object-contain drop-shadow-sm">
      </div>`
    : `
      <div class="w-full h-32 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden"
           style="background:linear-gradient(135deg, ${bg}, #ffffff);">
        <div class="absolute inset-0" style="
             background: repeating-linear-gradient(
               -45deg,
               ${stripe},
               ${stripe} 8px,
               transparent 8px,
               transparent 16px
             );
             opacity:.5;"></div>
        <span class="material-icons text-5xl relative" style="color:${fg};">
          ${typeIcon}
        </span>
      </div>`;

  // Whole card is a link
  const card = document.createElement("a");
  card.href = url;
  card.target = "_blank";
  card.rel = "noopener";
  card.className =
    "block bg-white p-4 rounded-2xl shadow-sm border border-gray-200 " +
    "hover:shadow-md hover:-translate-y-0.5 transition transform " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300";

  card.innerHTML = `
    ${media}
    <div class="flex items-start justify-between gap-3">
      <div>
        <h3 class="font-semibold text-gray-800 mb-1">${name}</h3>
        ${desc ? `<p class="text-sm text-gray-500">${desc}</p>` : ``}
      </div>
      <span class="inline-flex items-center text-xs font-semibold text-gray-600 mt-1">
        ${cta}
        <span class="material-icons text-base ml-1">open_in_new</span>
      </span>
    </div>
  `;

  return card;
}
