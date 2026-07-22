(function () {
  const body = document.body;
  const dataUrl = body.dataset.json;
  if (!dataUrl) return;

  const safeExternalUrl = (value) => {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.href : null;
    } catch {
      return null;
    }
  };

  const resourceType = (url, block) => {
    if (block === "videos") return { label: "VIDEO", action: "Watch video" };
    if ((url || "").toLowerCase().includes(".pdf")) return { label: "PDF", action: "Open worksheet" };
    return { label: "LINK", action: "Open resource" };
  };

  const makeCard = (item) => {
    const url = safeExternalUrl(item.url);
    if (!url) return null;
    const type = resourceType(url, item.blockkey);
    const link = document.createElement("a");
    link.className = "resource-card";
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";

    const youtube = url.match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    if (youtube) {
      const image = document.createElement("img");
      image.className = "resource-card__thumbnail";
      image.src = `https://img.youtube.com/vi/${youtube[1]}/mqdefault.jpg`;
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      image.referrerPolicy = "no-referrer";
      link.appendChild(image);
    } else {
      const icon = document.createElement("span");
      icon.className = "resource-card__icon";
      icon.textContent = type.label;
      link.appendChild(icon);
    }

    const copy = document.createElement("span");
    copy.className = "resource-card__copy";
    const title = document.createElement("h3");
    title.textContent = item.title;
    const action = document.createElement("span");
    action.textContent = `${type.action} ↗`;
    copy.append(title, action);
    link.appendChild(copy);
    return link;
  };

  fetch(dataUrl)
    .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
    .then((data) => {
      const rows = Array.isArray(data) ? data : data.items || [];
      const counts = { worksheets: 0, videos: 0, other: 0 };
      rows.filter((item) => item?.active !== false && item?.title && item?.url).forEach((item) => {
        const key = String(item.blockkey || "other").toLowerCase();
        const grid = document.getElementById(`grid-${key}`) || document.getElementById("grid-other");
        const card = makeCard(item);
        if (grid && card) {
          grid.appendChild(card);
          counts[key in counts ? key : "other"] += 1;
        }
      });

      Object.entries(counts).forEach(([key, count]) => {
        const group = document.querySelector(`[data-resource-group="${key}"]`);
        if (group) group.hidden = count === 0;
        const anchor = document.querySelector(`[data-resource-anchor="${key}"]`);
        if (anchor) anchor.hidden = count === 0;
      });

      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      const empty = document.getElementById("resource-empty");
      if (empty) empty.hidden = total > 0;

      const codes = Array.isArray(data.sparx_codes) ? data.sparx_codes : [];
      const panel = document.getElementById("sparx-section");
      const list = document.getElementById("sparx-code-list");
      const sparxAnchor = document.querySelector('[data-resource-anchor="sparx"]');
      if (sparxAnchor) sparxAnchor.hidden = codes.length === 0;
      if (panel && list && codes.length) {
        codes.forEach((item) => {
          const chip = document.createElement("span");
          chip.className = "sparx-code";
          const code = document.createElement("strong");
          code.textContent = item.code || "";
          chip.append(code, document.createTextNode(item.note || ""));
          list.appendChild(chip);
        });
        panel.classList.add("is-visible");
      }
    })
    .catch(() => {
      const empty = document.getElementById("resource-empty");
      if (empty) {
        empty.hidden = false;
        empty.textContent = "Resources could not be loaded. Please refresh the page or try again later.";
      }
    });
})();
