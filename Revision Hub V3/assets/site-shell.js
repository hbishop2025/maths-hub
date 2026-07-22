(function () {
  const body = document.body;
  const root = body.dataset.root || ".";
  const active = body.dataset.section || "";
  const path = (value) => `${root}/${value}`.replace(/^\.\/\.\//, "./");

  const mainLinks = [
    ["home", "Home", "index.html"],
    ["ks3", "KS3", "ks3_hub.html"],
    ["gcse", "GCSE", "gcse_hub.html"],
    ["alevel", "A-level", "alevel_hub.html"]
  ];

  const tools = [
    ["Policy", "Privacy, acceptable use and guidance", "policy.html", false],
    ["SPARX setup", "Homework expectations and access", "sparx.html", false],
    ["Dr Frost Maths", "Independent practice and revision", "https://www.drfrost.org/", true],
    ["Pearson ActiveHub", "Open other digital textbooks", "https://activehub.pearson.com/", true]
  ];

  const headerSlot = document.getElementById("site-header");
  if (headerSlot) {
    const nav = mainLinks.map(([key, label, href]) =>
      `<a href="${path(href)}"${active === key ? ' aria-current="page"' : ""}>${label}</a>`
    ).join("");
    const toolLinks = tools.map(([label, description, href, external]) =>
      `<a href="${external ? href : path(href)}"${external ? ' target="_blank" rel="noopener"' : ""}><strong>${label}${external ? " ↗" : ""}</strong><span>${description}</span></a>`
    ).join("");

    headerSlot.innerHTML = `
      <a class="skip-link" href="#main-content">Skip to content</a>
      <header class="site-header">
        <div class="site-header__inner">
          <a class="site-brand" href="${path("index.html")}" aria-label="SJWMS Maths home">
            <img src="${path("assets/hub_logo.png")}" alt="" width="84" height="32">
            <span>SJWMS Maths<small>Revision and learning</small></span>
          </a>
          <nav class="site-nav" id="site-navigation" aria-label="Main navigation">
            ${nav}
            <div class="site-nav__dropdown">
              <button class="site-nav__dropdown-button" id="tools-button" type="button" aria-expanded="false" aria-controls="tools-panel">Tools <span class="site-nav__chevron" aria-hidden="true">⌄</span></button>
              <div class="tools-panel" id="tools-panel">${toolLinks}</div>
            </div>
            <a class="site-nav__tool" href="${path("dashboard.html")}">Textbooks</a>
          </nav>
          <div class="site-header__actions">
            <button class="header-icon-button" id="theme-button" type="button" aria-label="Switch to dark mode"><span aria-hidden="true">◐</span></button>
            <button class="header-icon-button" id="updates-button" type="button" aria-label="Open updates" aria-expanded="false" aria-controls="updates-popover">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"></path><path d="M10 21h4"></path></svg>
              <span class="notification-badge" id="notification-badge"></span>
            </button>
            <button class="menu-button" type="button" aria-expanded="false" aria-controls="site-navigation" aria-label="Open navigation menu">Menu</button>
          </div>
        </div>
      </header>
      <aside class="updates-popover" id="updates-popover" aria-label="Site updates">
        <div class="updates-popover__heading"><strong>Latest updates</strong><span class="card__meta">SJWMS Maths</span></div>
        <div class="updates-list" id="header-updates-list"><p class="notice">Loading updates…</p></div>
      </aside>`;

    const menuButton = headerSlot.querySelector(".menu-button");
    const menu = headerSlot.querySelector(".site-nav");
    const toolsButton = headerSlot.querySelector("#tools-button");
    const toolsPanel = headerSlot.querySelector("#tools-panel");
    const updatesButton = headerSlot.querySelector("#updates-button");
    const updatesPanel = headerSlot.querySelector("#updates-popover");
    const themeButton = headerSlot.querySelector("#theme-button");

    const setMenu = (open) => {
      menu.classList.toggle("is-open", open);
      menuButton.setAttribute("aria-expanded", String(open));
      menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      body.classList.toggle("menu-open", open);
    };
    const setTools = (open) => {
      toolsPanel.classList.toggle("is-open", open);
      toolsButton.setAttribute("aria-expanded", String(open));
    };
    const setUpdates = (open) => {
      updatesPanel.classList.toggle("is-open", open);
      updatesButton.setAttribute("aria-expanded", String(open));
      updatesButton.setAttribute("aria-label", open ? "Close updates" : "Open updates");
    };
    const setThemeLabel = () => {
      const dark = document.documentElement.dataset.theme === "dark";
      themeButton.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
      themeButton.querySelector("span").textContent = dark ? "☀" : "◐";
    };

    menuButton.addEventListener("click", () => {
      setUpdates(false);
      setTools(false);
      setMenu(!menu.classList.contains("is-open"));
    });
    toolsButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setUpdates(false);
      setTools(!toolsPanel.classList.contains("is-open"));
    });
    updatesButton.addEventListener("click", (event) => {
      event.stopPropagation();
      setTools(false);
      setMenu(false);
      setUpdates(!updatesPanel.classList.contains("is-open"));
    });
    themeButton.addEventListener("click", () => {
      const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem("sjwms-theme", theme); } catch {}
      setThemeLabel();
    });
    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) setMenu(false);
    });
    document.addEventListener("click", (event) => {
      if (!event.target.closest(".site-nav__dropdown")) setTools(false);
      if (!event.target.closest("#updates-popover") && !event.target.closest("#updates-button")) setUpdates(false);
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") { setMenu(false); setTools(false); setUpdates(false); }
    });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setMenu(false);
    });
    setThemeLabel();
  }

  const footer = document.getElementById("site-footer");
  if (footer) {
    footer.innerHTML = `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <div class="site-footer__brand">
            <img src="${path("assets/sjwms-maths-logo.svg")}" alt="" width="104" height="40" loading="lazy" decoding="async">
            <div><strong>SJWMS Maths</strong><p>Find it. Practise it. Master it.</p></div>
          </div>
          <p>Revision Hub v3.5 · Built for SJWMS students</p>
        </div>
      </footer>`;
  }

  const safeUpdateHref = (value) => {
    if (!value || /^(?:javascript|data):/i.test(value)) return null;
    if (/^https?:\/\//i.test(value)) return value;
    return path(String(value).replace(/^\/+/, ""));
  };

  const makeUpdate = (item) => {
    const article = document.createElement("article");
    article.className = "update-item";
    if (item.date) {
      const time = document.createElement("time");
      time.textContent = String(item.date);
      article.appendChild(time);
    }
    const heading = document.createElement("h3");
    heading.textContent = String(item.title || "Update");
    const text = document.createElement("p");
    text.textContent = String(item.text || "");
    article.append(heading, text);
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

  // Keep the shared pages useful when opened directly from the filesystem, where
  // browsers block JSON fetches. The managed JSON remains the live source.
  const localUpdateFallback = [
    {
      title: "A clearer SJWMS Maths",
      date: "22 July 2026",
      text: "The clearer visual identity now runs across KS3, GCSE, unit pages and the main learning tools.",
      btnText: "Explore KS3",
      btnLink: "ks3_hub.html"
    },
    {
      title: "More unit pages available",
      date: "22 July 2026",
      text: "Year 7 now includes all ten units and the GCSE course includes units 1 to 19.",
      btnText: "Browse Year 7",
      btnLink: "year7_hub.html"
    },
    {
      title: "Accessing SPARX",
      date: "22 July 2026",
      text: "New to SJWMS? Use the setup guide to get SPARX ready for homework assignments in Years 7 to 11.",
      btnText: "SPARX help",
      btnLink: "sparx.html"
    }
  ];

  const headerUpdates = document.getElementById("header-updates-list");
  const homeUpdates = document.getElementById("home-updates-list");
  if (headerUpdates || homeUpdates) {
    const renderUpdates = (items) => {
      [headerUpdates, homeUpdates].filter(Boolean).forEach((container) => {
        container.replaceChildren(...items.map(makeUpdate));
      });
      const badge = document.getElementById("notification-badge");
      if (badge && items.length) {
        badge.textContent = items.length > 9 ? "9+" : String(items.length);
        badge.classList.add("is-visible");
      }
    };

    fetch(path("assets/data/home_updates.json"))
      .then((response) => response.ok ? response.json() : Promise.reject(new Error(`HTTP ${response.status}`)))
      .then((data) => {
        const items = Array.isArray(data) ? data : data.items || [];
        renderUpdates(items);
      })
      .catch(() => {
        renderUpdates(localUpdateFallback);
      });
  }
})();
