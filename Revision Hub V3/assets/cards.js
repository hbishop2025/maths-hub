function safeResourceUrl(value) {
  if (!value) return null;
  try {
    const url = new URL(value, window.location.origin);
    return ["http:", "https:"].includes(url.protocol) ? url.href : null;
  } catch {
    return null;
  }
}

function safeColour(value, fallback) {
  return typeof value === "string" && /^#[0-9a-f]{3,8}$/i.test(value)
    ? value
    : fallback;
}

function makeSiteCard(site) {
  site = site || {};

  const name = String(site.name || "Resource");
  const description = String(site.description || "");
  const cta = String(site.cta || "Open");
  const url = safeResourceUrl(site.url) || "#";
  const brand = site.brand || {};
  const background = safeColour(brand.bg, "#F3F4F6");
  const foreground = safeColour(brand.fg, "#2563EB");
  const logoUrl = safeResourceUrl(site.logo);

  const iconByType = {
    drive: "folder",
    quiz: "quiz",
    textbook: "menu_book",
    pdf: "picture_as_pdf"
  };

  const card = document.createElement("a");
  card.href = url;
  if (url !== "#") {
    card.target = "_blank";
    card.rel = "noopener";
  }
  card.className =
    "block bg-white p-4 rounded-2xl shadow-sm border border-gray-200 " +
    "hover:shadow-md hover:-translate-y-0.5 transition transform " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300";

  const media = document.createElement("div");
  media.className = "w-full h-32 rounded-xl mb-4 flex items-center justify-center relative overflow-hidden";
  media.style.background = `linear-gradient(135deg, ${background}, #ffffff)`;

  if (logoUrl) {
    const logo = document.createElement("img");
    logo.src = logoUrl;
    logo.alt = `${name} logo`;
    logo.loading = "lazy";
    logo.decoding = "async";
    logo.className = "relative max-h-14 w-auto object-contain";
    media.appendChild(logo);
  } else {
    const icon = document.createElement("span");
    icon.className = "material-icons text-5xl relative";
    icon.style.color = foreground;
    icon.textContent = iconByType[site.type] || "link";
    media.appendChild(icon);
  }

  const body = document.createElement("div");
  body.className = "flex items-start justify-between gap-3";

  const copy = document.createElement("div");
  const heading = document.createElement("h3");
  heading.className = "font-semibold text-gray-800 mb-1";
  heading.textContent = name;
  copy.appendChild(heading);

  if (description) {
    const text = document.createElement("p");
    text.className = "text-sm text-gray-500";
    text.textContent = description;
    copy.appendChild(text);
  }

  const action = document.createElement("span");
  action.className = "inline-flex items-center text-xs font-semibold text-gray-600 mt-1";
  action.append(document.createTextNode(`${cta} `));
  const actionIcon = document.createElement("span");
  actionIcon.className = "material-icons text-base ml-1";
  actionIcon.textContent = "open_in_new";
  action.appendChild(actionIcon);

  body.append(copy, action);
  card.append(media, body);
  return card;
}
