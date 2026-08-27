(function () {
  const detailsLinks = Array.from(document.querySelectorAll("[data-open-details]"));
  const openLinkedDetails = (link) => {
    const target = document.getElementById(link.dataset.openDetails);
    if (target?.tagName === "DETAILS") target.open = true;
  };
  detailsLinks.forEach((link) => link.addEventListener("click", () => openLinkedDetails(link)));
  const initialDetailsLink = detailsLinks.find((link) => link.hash === window.location.hash);
  if (initialDetailsLink) openLinkedDetails(initialDetailsLink);

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
    7: [
      ["Analysing & Displaying Data", "https://drive.google.com/file/d/1G7L8o3RPjWFOjGIh2eCoGJvAGlXdjmyl/view?usp=drive_link"],
      ["Number Skills", "https://drive.google.com/file/d/1Xc9yKEavJwFO0IMcdoMu6I13sN0dlvwP/view?usp=drive_link"],
      ["Equations, Functions & Formulae", "https://drive.google.com/file/d/1UhOT77f1s_540E8kVsiV6G8FvD-TaH7I/view?usp=drive_link"],
      ["Fractions", "https://drive.google.com/file/d/1D7tTSSJYXL_lkDSwUuGpQCLa08VG1Fdc/view?usp=drive_link"],
      ["Angles & Shapes", "https://drive.google.com/file/d/1rjVaMjbb_yqlQOUQzMM-W3d3v1rK7-u3/view?usp=drive_link"],
      ["Decimals", "https://drive.google.com/file/d/1cAy4Uir1fWBil9nNhrP8P3mrAH_YzUx4/view?usp=drive_link"],
      ["Equations", "https://drive.google.com/file/d/1KXZB9_ZWayU1ZAo6KOzOirYotnw6cByF/view?usp=drive_link"],
      ["Multiplicative Reasoning", "https://drive.google.com/file/d/1ADTRwNJAa6IJcr52bCpJgVOxeUJSJZQ-/view?usp=drive_link"],
      ["Perimeter, Area & Volume", "https://drive.google.com/file/d/1hs_AC1tTtHhph2zu4UvMTB6Iqnf02LBe/view?usp=drive_link"],
      ["Sequences & Graphs", "https://drive.google.com/file/d/1D1EnmR4Y0oPThUQT36b2pVsLaiH-98zP/view?usp=drive_link"]
    ],
    8: [
      ["Factors & Powers", "https://drive.google.com/file/d/1EpoB6hKfse3KDTUEdMKBnlQftnfpV0rW/view?usp=drive_link"],
      ["Working with Powers", "https://drive.google.com/file/d/1_ZJwwfmNKzwXfdKObJbxR71SFWd7ugGt/view?usp=drive_link"],
      ["2D Shapes & 3D Solids", "https://drive.google.com/file/d/1BpqiUGujuTK57o7mK7Hv0X9CA8VIqQm-/view?usp=drive_link"],
      ["Real-Life Graphs", "https://drive.google.com/file/d/1GQ9catkH-8ypqUjhJvu-r16lvaxkKhxl/view?usp=drive_link"],
      ["Transformations", "https://drive.google.com/file/d/1XxRs7Cc6wJ_9kIRx7HRteektdANIangh/view?usp=drive_link"],
      ["Fractions, Decimals & Percentages", "https://drive.google.com/file/d/1bTJ9Y2kvncHC0ZMFc_olexfWzGcHR-7_/view?usp=drive_link"],
      ["Construction & Loci", "https://drive.google.com/file/d/1S-UJWODkNQUfhi_LcWWCMJegqqz6gw0w/view?usp=drive_link"],
      ["Probability", "https://drive.google.com/file/d/1I0Ttc1_LqjnkBIKoFToQoZfdrtIfL1bk/view?usp=drive_link"],
      ["Scale Drawings & Measures", "https://drive.google.com/file/d/1FHF-KoGyhuYOEK2rVmg85bHAR7iQKEA8/view?usp=drive_link"],
      ["Graphs", "https://drive.google.com/file/d/1M7185sXmJr61okgwyO3nx7bR82nTBvHW/view?usp=drive_link"]
    ],
    9: [
      ["Powers & Roots", "https://drive.google.com/file/d/1tflubYILk9MnqU2kvbCx7l61FCnZmCzM/view?usp=drive_link"],
      ["Quadratics", "https://drive.google.com/file/d/1YRD6xZ8Ge4SJX6nY0T3YLoX26mcnuhfp/view?usp=drive_link"],
      ["Inequalities & Formulae", "https://drive.google.com/file/d/1E1x4yOdiPXoWHv9CXLFUrwjJ3z5y9p_H/view?usp=drive_link"],
      ["Collecting & Analysing Data", "https://drive.google.com/file/d/1ouXPkwre5NlPRZZfTb5zUm1MPZmo4a52/view?usp=drive_link"],
      ["Multiplicative Reasoning", "https://drive.google.com/file/d/1U6k5eZEGdmGHAw1Ko1G0J9L5Cj1x8SCL/view?usp=drive_link"],
      ["Non-linear Graphs", "https://drive.google.com/file/d/1HSw_YAfFfYl8Gb9rVxx2ceXH0HyDq7wy/view?usp=drive_link"],
      ["Accuracy & Measures", "https://drive.google.com/file/d/1s02OPT7dx5lCO24oKw335bpYyvDsrviP/view?usp=drive_link"],
      ["Graphical Solutions", "https://drive.google.com/file/d/1B1wIQEzfL0cz8AB9ZM3MkjyqDHGES6I1/view?usp=drive_link"],
      ["Trigonometry", "https://drive.google.com/file/d/1VZLYIsY9rzqRpnZ02oTbds7D-1-QZ3hJ/view?usp=drive_link"],
      ["Proof", "https://drive.google.com/file/d/1ubYgixXwYcLN3BS_2pYXoHJa67vlEEje/view?usp=drive_link"]
    ]
  };

  const unitList = document.getElementById("textbook-unit-list");
  const unitHeading = document.getElementById("textbook-unit-heading");
  const unitPanel = document.querySelector("[data-textbook-unit-panel]");
  const yearButtons = Array.from(document.querySelectorAll("[data-textbook-year]"));
  if (unitList && unitHeading && yearButtons.length) {
    const selectYear = (year) => {
      document.body.dataset.year = String(year);
      yearButtons.forEach((button) => {
        const selected = button.dataset.textbookYear === String(year);
        button.setAttribute("aria-pressed", String(selected));
        button.setAttribute("aria-expanded", String(selected));
      });
      unitHeading.textContent = `Year ${year} textbook units`;
      unitList.replaceChildren(...textbookUnits[year].map(([title, href], index) => {
        const link = document.createElement("a");
        link.className = "unit-option";
        link.style.setProperty("--unit-delay", `${index * 28}ms`);
        link.href = href;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.setAttribute("aria-label", `Open Year ${year} Unit ${index + 1}: ${title} textbook in a new tab`);
        const number = document.createElement("span");
        number.className = "unit-option__number";
        number.textContent = String(index + 1).padStart(2, "0");
        const copy = document.createElement("span");
        const name = document.createElement("strong");
        name.textContent = title;
        const status = document.createElement("small");
        status.textContent = "Open textbook ↗";
        copy.append(name, status);
        link.append(number, copy);
        return link;
      }));
      if (unitPanel) {
        unitPanel.dataset.state = "open";
        unitPanel.setAttribute("aria-hidden", "false");
      }
    };
    yearButtons.forEach((button) => button.addEventListener("click", () => selectYear(Number(button.dataset.textbookYear))));
    if (!document.body.hasAttribute("data-textbook-await-choice")) selectYear(7);
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

})();
