(function () {
  const sectionNav = document.querySelector("[data-section-nav]");
  if (sectionNav && "IntersectionObserver" in window) {
    const links = Array.from(sectionNav.querySelectorAll('a[href^="#"]'));
    const sections = links.map((link) => document.querySelector(link.hash)).filter(Boolean);
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      links.forEach((link) => link.classList.toggle("is-active", link.hash === `#${visible.target.id}`));
    }, { rootMargin: "-28% 0px -62% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }

  const textbookUnits = {
    7: ["Analysing & Displaying Data", "Number Skills", "Equations, Functions & Formulae", "Fractions", "Angles & Shapes", "Decimals", "Equations", "Multiplicative Reasoning", "Perimeter, Area & Volume", "Sequences & Graphs"],
    8: ["Factors & Powers", "Working with Powers", "2D Shapes & 3D Solids", "Real-Life Graphs", "Transformations", "Fractions, Decimals & Percentages", "Construction & Loci", "Probability", "Scale Drawings & Measures", "Graphs"],
    9: ["Powers & Roots", "Quadratics", "Inequalities & Formulae", "Collecting & Analysing Data", "Multiplicative Reasoning", "Non-linear Graphs", "Accuracy & Measures", "Graphical Solutions", "Trigonometry", "Proof"]
  };

  const unitList = document.getElementById("textbook-unit-list");
  const unitHeading = document.getElementById("textbook-unit-heading");
  const yearButtons = Array.from(document.querySelectorAll("[data-textbook-year]"));
  if (unitList && unitHeading && yearButtons.length) {
    const selectYear = (year) => {
      document.body.dataset.year = String(year);
      yearButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.textbookYear === String(year))));
      unitHeading.textContent = `Year ${year} textbook units`;
      unitList.replaceChildren(...textbookUnits[year].map((title, index) => {
        const button = document.createElement("button");
        button.className = "unit-option";
        button.type = "button";
        button.disabled = true;
        button.setAttribute("aria-label", `Unit ${index + 1}: ${title}. PDF coming soon.`);
        const number = document.createElement("span");
        number.className = "unit-option__number";
        number.textContent = String(index + 1).padStart(2, "0");
        const copy = document.createElement("span");
        const name = document.createElement("strong");
        name.textContent = title;
        const status = document.createElement("small");
        status.textContent = "PDF coming soon";
        copy.append(name, status);
        button.append(number, copy);
        return button;
      }));
    };
    yearButtons.forEach((button) => button.addEventListener("click", () => selectYear(Number(button.dataset.textbookYear))));
    selectYear(7);
  }

  const revisionGrid = document.getElementById("revision-grid");
  const revisionHeading = document.getElementById("revision-heading");
  const revisionEmpty = document.getElementById("revision-empty");
  const revisionButtons = Array.from(document.querySelectorAll("[data-revision-year]"));
  if (revisionGrid && revisionHeading && revisionEmpty && revisionButtons.length) {
    let resources = { y7: [], y8: [], y9: [] };
    let currentYear = "y7";
    const safeUrl = (value) => {
      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : null;
      } catch { return null; }
    };
    const makeRevisionCard = (item) => {
      const href = safeUrl(item.url);
      if (!href) return null;
      const link = document.createElement("a");
      link.className = "resource-card";
      link.href = href;
      link.target = "_blank";
      link.rel = "noopener";
      const icon = document.createElement("span");
      icon.className = "resource-card__icon";
      icon.textContent = href.toLowerCase().includes("youtube") ? "VIDEO" : href.toLowerCase().includes(".pdf") ? "PDF" : "LINK";
      const copy = document.createElement("span");
      copy.className = "resource-card__copy";
      const title = document.createElement("h3");
      title.textContent = item.title;
      const action = document.createElement("span");
      action.textContent = "Open resource ↗";
      copy.append(title, action);
      link.append(icon, copy);
      return link;
    };
    const render = (year) => {
      currentYear = year;
      const numeric = year.slice(1);
      document.body.dataset.year = numeric;
      revisionHeading.textContent = `Year ${numeric} revision resources`;
      revisionButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.revisionYear === year)));
      const cards = resources[year].map(makeRevisionCard).filter(Boolean);
      revisionGrid.replaceChildren(...cards);
      revisionEmpty.hidden = cards.length > 0;
    };
    revisionButtons.forEach((button) => button.addEventListener("click", () => render(button.dataset.revisionYear)));
    fetch("assets/data/ks3_eoy_resources.json")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((data) => {
        const list = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : null;
        resources = list
          ? { y7: list.filter((item) => item.active !== false && item.year === "y7"), y8: list.filter((item) => item.active !== false && item.year === "y8"), y9: list.filter((item) => item.active !== false && item.year === "y9") }
          : { y7: data.y7 || [], y8: data.y8 || [], y9: data.y9 || [] };
        render(currentYear);
      })
      .catch(() => {
        revisionEmpty.hidden = false;
        revisionEmpty.textContent = "Revision resources could not be loaded. Please refresh or try again later.";
      });
    render(currentYear);
  }

  const alevelButtons = document.getElementById("alevel-track-buttons");
  const alevelGrid = document.getElementById("alevel-track-grid");
  const alevelHeading = document.getElementById("alevel-track-heading");
  const alevelSummary = document.getElementById("alevel-track-summary");
  if (alevelButtons && alevelGrid && alevelHeading && alevelSummary) {
    const safeExternalUrl = (value) => {
      try {
        const url = new URL(value);
        return ["http:", "https:"].includes(url.protocol) ? url.href : null;
      } catch { return null; }
    };
    const renderTrack = (track) => {
      alevelButtons.querySelectorAll("button").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.trackId === track.id)));
      const sections = Array.isArray(track.sections) ? track.sections : [];
      alevelHeading.textContent = track.label || "A-level resources";
      alevelSummary.textContent = sections.map((section) => section.subheading).filter(Boolean).join(" ");
      let number = 0;
      const cards = sections.flatMap((section) => (section.cards || []).map((item) => {
        const href = safeExternalUrl(item.url);
        if (!href) return null;
        number += 1;
        const link = document.createElement("a");
        link.className = "unit-card";
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener";
        const badge = document.createElement("span");
        badge.className = "unit-card__number";
        badge.textContent = String(number).padStart(2, "0");
        const copy = document.createElement("span");
        copy.className = "unit-card__content";
        const category = document.createElement("span");
        category.className = "unit-card__category";
        category.textContent = section.heading || track.label;
        const title = document.createElement("h3");
        title.textContent = item.title || "Resource";
        const summary = document.createElement("span");
        summary.className = "unit-card__summary";
        summary.textContent = item.description || "Open the moderated KS5 resource.";
        const action = document.createElement("span");
        action.className = "unit-card__action";
        action.textContent = "Open resource ↗";
        copy.append(category, title, summary, action);
        link.append(badge, copy);
        return link;
      })).filter(Boolean);
      alevelGrid.replaceChildren(...cards);
    };
    fetch("assets/data/alevel_tracks.json")
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((data) => {
        const tracks = Array.isArray(data.tracks) ? data.tracks : [];
        const buttons = tracks.map((track) => {
          const button = document.createElement("button");
          button.className = "year-choice";
          button.type = "button";
          button.dataset.trackId = track.id;
          button.setAttribute("aria-pressed", "false");
          const label = document.createElement("strong");
          label.textContent = track.label;
          const arrow = document.createElement("b");
          arrow.textContent = "→";
          button.append(label, arrow);
          button.addEventListener("click", () => renderTrack(track));
          return button;
        });
        alevelButtons.replaceChildren(...buttons);
        if (tracks[0]) renderTrack(tracks[0]);
      })
      .catch(() => {
        alevelButtons.innerHTML = '<p class="notice">Course links could not be loaded. Please refresh or try again later.</p>';
        alevelHeading.textContent = "A-level resources";
        alevelSummary.textContent = "The moderated KS5 resource library is temporarily unavailable.";
      });
  }
})();
