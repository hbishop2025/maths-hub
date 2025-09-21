/* Load sidebar.html, reserve space, and highlight active link */
(function(){
  const wrap = document.getElementById('sidebar');
  if(!wrap) return;

  // Reserve layout + skeleton immediately
  if(!wrap.innerHTML.trim()){
    wrap.innerHTML = `
      <div class="panel">
        <div class="skeleton"><div class="bar"></div></div>
      </div>`;
  }

  // Root-relative so it works from / and /year_9/ etc.
  fetch('/assets/sidebar.html')
    .then(r => r.text())
    .then(html => {
      wrap.innerHTML = `<div class="panel">${html}</div>`;

      const pathname = location.pathname.toLowerCase();
      const file = (pathname.split('/').pop() || 'index.html');

      // Any page inside /year_9/ OR specific year9 pages at root
      const isYear9Path = pathname.includes('/year_9/');
      const isYear9File = /^year9_(hub|unit\d{2}|games)\.html$/.test(file);

      // Map of routes to href in the sidebar
      const routes = [
        { test: () => file === '' || file === 'index.html', href: 'index.html' },
        { test: () => file === 'policy.html',              href: 'policy.html' },
        { test: () => file === 'ai_usage.html',            href: 'ai_usage.html' },
        { test: () => isYear9Path || isYear9File,          href: 'year9_hub.html' },
        { test: () => file === 'year9_hub.html',           href: 'year9_hub.html' },
      ];

      const active = routes.find(r => r.test());
      if(active){
        const link = wrap.querySelector(`nav a[href="${active.href}"]`);
        if(link){
          link.classList.add('active');
          link.setAttribute('aria-current','page');
        }
      }

      /* ===== Mobile modal menu (popup) ===== */
(function(){
  const sb = wrap; // #sidebar already filled with sidebar.html
  // Create overlay once
  let overlay = document.querySelector('.nav-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    document.body.appendChild(overlay);
  }

  // Create mobile modal once
  let modal = document.querySelector('.mobile-menu');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'mobile-menu';
    // Try to find a logo inside the sidebar HTML; fallback to site title
    const logoEl = sb.querySelector('.logo, img[alt*="logo"], img[alt*="Logo"]');
    const logoHTML = logoEl ? logoEl.outerHTML : `<strong class="text-gray-800">Menu</strong>`;
    modal.innerHTML = `
  <div class="mm-header">
    <div class="mm-brand" style="display:flex;align-items:center;gap:.5rem;">
      ${logoHTML}
      <span class="text-gray-800 font-semibold whitespace-nowrap">SJWMS Maths Hub</span>
    </div>
    <button class="mm-close" type="button">
      <span class="material-icons" aria-hidden="true">close</span>
      <span class="sr-only">Close</span>
    </button>
  </div>
  <div class="mm-body"></div>
`;
    document.body.appendChild(modal);
  }

  // Copy the sidebar's nav/content into the modal body
  const bodySlot = modal.querySelector('.mm-body');
  if (bodySlot) {
    // Clone only the <nav> (preferred). If not present, clone all inner HTML.
    const nav = sb.querySelector('nav');
    bodySlot.innerHTML = "";
    bodySlot.appendChild((nav ? nav.cloneNode(true) : sb.cloneNode(true)));
  }

  // Floating open/close buttons (mobile only)
  if (!document.getElementById('nav-toggle')) {
    const openBtn = document.createElement('button');
    openBtn.id = 'nav-toggle';
    openBtn.setAttribute('aria-label','Open menu');
    openBtn.className = [
      'lg:hidden','fixed','top-4','left-4','z-50',
      'rounded-xl','shadow','bg-white','border','border-gray-200',
      'px-3','py-2','text-gray-700','hover:bg-gray-50',
      'focus:outline-none','focus:ring-2','focus:ring-gray-300'
    ].join(' ');
    openBtn.innerHTML = `<span class="material-icons">menu</span>`;
    openBtn.addEventListener('click', () => setOpen(true));
    document.body.appendChild(openBtn);
  }
  if (!document.getElementById('nav-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.id = 'nav-close';
    closeBtn.setAttribute('aria-label','Close menu');
    closeBtn.className = [
      'lg:hidden','fixed','top-4','right-4','z-50',
      'rounded-xl','shadow','bg-white','border','border-gray-200',
      'px-3','py-2','text-gray-700','hover:bg-gray-50',
      'focus:outline-none','focus:ring-2','focus:ring-gray-300','hidden'
    ].join(' ');
    closeBtn.innerHTML = `<span class="material-icons">close</span>`;
    closeBtn.addEventListener('click', () => setOpen(false));
    document.body.appendChild(closeBtn);
  }

  // Close actions
  modal.querySelector('.mm-close')?.addEventListener('click', () => setOpen(false));
  overlay.addEventListener('click', () => setOpen(false));
  modal.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) setOpen(false); // close when choosing a link
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  // Open/close helpers
  function setOpen(state){
    document.body.classList.toggle('nav-open', state);
    modal.classList.toggle('open', state);
    overlay.classList.toggle('open', state);
    document.getElementById('nav-toggle')?.classList.toggle('hidden', state);
    document.getElementById('nav-close')?.classList.toggle('hidden', !state);
  }
})();
      /* ===== END mobile controls ===== */
    })
    .catch(() => {
      wrap.innerHTML = `<div class="panel" style="padding:16px;font-weight:600;">Menu unavailable</div>`;
    });
})();
