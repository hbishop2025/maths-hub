(function () {
  const body = document.body;
  const rootPath = body.dataset.root || ".";
  const active = body.dataset.section || "";
  const themeControlEnabled = body.dataset.themeControl !== "false";
  const path = (value) => `${rootPath}/${value}`.replace(/^\.\/\.\//, "./");

  if (!document.querySelector('link[data-official-shell]')) {
    const stylesheet = document.createElement("link");
    stylesheet.rel = "stylesheet";
    stylesheet.href = path("assets/official/official-shell.css");
    stylesheet.dataset.officialShell = "";
    document.head.appendChild(stylesheet);
  }

  const mainLinks = [
    ["home", "Home", "index.html"],
    ["ks3", "KS3", "ks3_hub.html"],
    ["gcse", "GCSE", "gcse_hub.html"],
    ["alevel", "A-level", "alevel_hub.html"]
  ];
  const tools = [
    ["✣", "Maths Labs", "Themed lessons and quick maths games", "maths_labs.html", false],
    ["▤", "KS3 textbooks", "Open a digital textbook by unit", "dashboard.html", false],
    ["√", "SPARX support", "Sign-in, bookwork and homework help", "sparx.html", false],
    ["✓", "Assessments", "Checklists and practice papers", "ks3_eoy.html", false],
    ["◇", "UKMT challenges", "Dates, formats and preparation", "ukmt.html", false],
    ["✦", "AI guidance", "Use AI without sharing data or copying answers", "ai_usage.html", false],
    ["i", "Privacy and policy", "How the website handles access and data", "policy.html", false],
    ["∑", "Dr Frost Maths", "Independent practice and revision", "https://www.drfrost.org/", true],
    ["A", "Pearson ActiveHub", "Open other digital textbooks", "https://activehub.pearson.com/", true]
  ];

  const headerSlot = document.getElementById("site-header");
  if (headerSlot) {
    const nav = mainLinks.map(([key, label, href]) => `<a href="${path(href)}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`).join("");
    const toolLinks = tools.map(([icon, label, description, href, external]) => `<a href="${external ? href : path(href)}"${external ? ' target="_blank" rel="noopener"' : ""}><span class="mini-icon" aria-hidden="true">${icon}</span><span><strong>${label}${external ? " ↗" : ""}</strong><small>${description}</small></span></a>`).join("");
    const mobileTools = tools.filter((item) => !item[4]).map(([, label,, href]) => `<a href="${path(href)}">${label}</a>`).join("");

    headerSlot.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a><div class="page-sentinel" aria-hidden="true"></div>
      <header class="future-header" id="future-header"><div class="future-header__pill">
        <a class="future-brand" href="${path("index.html")}" aria-label="SJWMS Maths home"><img src="${path("assets/favicon.svg")}" alt="" width="38" height="38"><span><strong>SJWMS Maths</strong><small>Revision and textbooks</small></span></a>
        <nav class="desktop-nav" aria-label="Main navigation">${nav}<details class="nav-disclosure"><summary>Tools <span aria-hidden="true">⌄</span></summary><div class="nav-popover nav-popover--tools">${toolLinks}</div></details></nav>
        <div class="future-header__actions"><details class="updates-disclosure"><summary class="icon-button" aria-label="Open updates"><span class="bell-icon" aria-hidden="true"></span><span class="updates-badge" id="future-updates-badge">0</span></summary><div class="nav-popover nav-popover--updates"><div class="popover-heading"><span>Latest updates</span><small>SJWMS Maths</small></div><div class="future-updates" id="future-updates-list"><p>Loading updates…</p></div></div></details>${themeControlEnabled ? '<button class="icon-button theme-button" id="future-theme-button" type="button" aria-label="Switch to dark mode"><span aria-hidden="true">◐</span></button>' : ""}<details class="mobile-menu"><summary class="menu-button">Menu</summary><nav class="mobile-nav" aria-label="Mobile navigation">${nav}${mobileTools}</nav></details></div>
      </div></header>`;

    const header = headerSlot.querySelector("#future-header");
    const sentinel = headerSlot.querySelector(".page-sentinel");
    if (header && sentinel && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(([entry]) => header.classList.toggle("is-condensed", !entry.isIntersecting), { threshold: 0 });
      observer.observe(sentinel);
    }

    const disclosures = Array.from(headerSlot.querySelectorAll("details"));
    disclosures.forEach((details) => details.addEventListener("toggle", () => {
      if (details.open) disclosures.forEach((other) => { if (other !== details) other.open = false; });
    }));
    document.addEventListener("click", (event) => disclosures.forEach((details) => {
      if (details.open && !details.contains(event.target)) details.open = false;
    }));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") disclosures.forEach((details) => { details.open = false; });
    });

    const themeButton = headerSlot.querySelector("#future-theme-button");
    const setThemeLabel = () => {
      if (!themeButton) return;
      const dark = document.documentElement.dataset.theme === "dark";
      themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      themeButton.querySelector("span").textContent = dark ? "☀" : "◐";
    };
    themeButton?.addEventListener("click", () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("sjwms-theme", theme); } catch {}
      setThemeLabel();
    });
    setThemeLabel();
  }

  const footerSlot = document.getElementById("site-footer");
  if (footerSlot) {
    footerSlot.innerHTML = `<footer class="future-footer"><div class="future-container future-footer__top"><div class="future-footer__intro"><a href="${path("index.html")}"><img src="${path("assets/favicon.svg")}" alt="" width="44" height="44"><span><strong>SJWMS Maths</strong><small>Revision and textbooks</small></span></a><p>Find revision, practice and KS3 textbooks for the maths you are studying.</p></div><nav class="future-footer__nav" aria-label="Footer navigation"><div><strong>Courses</strong><a href="${path("ks3_hub.html")}">KS3</a><a href="${path("gcse_hub.html")}">GCSE</a><a href="${path("alevel_hub.html")}">A-level</a></div><div><strong>Study tools</strong><a href="${path("dashboard.html")}">Textbooks</a><a href="${path("sparx.html")}">SPARX support</a><a href="${path("ukmt.html")}">UKMT challenges</a><a href="${path("ks3_eoy.html")}">Assessments</a></div><div><strong>Explore</strong><a href="${path("maths_labs.html")}">Maths Labs</a><a href="${path("ai_usage.html")}">AI guidance</a><a href="${path("policy.html")}">Privacy and policy</a></div></nav></div><div class="future-container future-footer__bottom"><p>SJWMS Maths · Built for students</p><p>No accounts · No student data collected</p></div></footer>`;
  }

  const safeUpdateHref = (value) => {
    if (!value || /^(?:javascript|data):/i.test(value)) return null;
    return /^https?:\/\//i.test(value) ? value : path(String(value).replace(/^\/+/, ""));
  };
  const makeUpdate = (item) => {
    const article = document.createElement("article");
    if (item.date) {
      const time = document.createElement("time");
      time.textContent = String(item.date);
      article.appendChild(time);
    }
    const title = document.createElement("strong");
    title.textContent = String(item.title || "Update");
    const copy = document.createElement("p");
    copy.textContent = String(item.text || "");
    article.append(title, copy);
    const href = safeUpdateHref(item.btnLink);
    if (href && item.btnText) {
      const link = document.createElement("a");
      link.href = href;
      link.textContent = `${item.btnText} →`;
      if (/^https?:\/\//i.test(href)) { link.target = "_blank"; link.rel = "noopener"; }
      article.appendChild(link);
    }
    return article;
  };
  const updateList = document.getElementById("future-updates-list");
  const updateBadge = document.getElementById("future-updates-badge");
  if (updateList) {
    const render = (items) => {
      updateList.replaceChildren(...items.map(makeUpdate));
      if (updateBadge) updateBadge.textContent = items.length > 9 ? "9+" : String(items.length);
    };
    fetch(path("assets/data/home_updates.json"), { cache: "no-store" })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((data) => render((Array.isArray(data) ? data : data.items || []).filter((item) => item && item.active !== false && (item.title || item.text))))
      .catch(() => render([{ title: "Welcome to SJWMS Maths", date: "26 August 2026", text: "The refreshed revision and textbook website is now available.", btnText: "Choose a course", btnLink: "index.html#courses" }]));
  }
})();
