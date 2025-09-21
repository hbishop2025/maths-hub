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

      /* ===== Mobile off-canvas controls ===== */
(function(){
  const sb = wrap; // #sidebar already defined above

  // Overlay (click to close)
  if (!document.querySelector('.nav-overlay')) {
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.addEventListener('click', () => setNavOpen(false));
    document.body.appendChild(overlay);
  }

  // Hamburger (open)
  if (!document.getElementById('nav-toggle')) {
    const openBtn = document.createElement('button');
    openBtn.id = 'nav-toggle';
    openBtn.setAttribute('aria-label','Open menu');
    openBtn.className = [
      'md:hidden','fixed','top-4','left-4','z-50',
      'rounded-xl','shadow','bg-white','border','border-gray-200',
      'px-3','py-2','text-gray-700','hover:bg-gray-50',
      'focus:outline-none','focus:ring-2','focus:ring-gray-300'
    ].join(' ');
    openBtn.innerHTML = `<span class="material-icons">menu</span>`;
    openBtn.addEventListener('click', () => setNavOpen(true));
    document.body.appendChild(openBtn);
  }

  // Floating Close (X)
  if (!document.getElementById('nav-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.id = 'nav-close';
    closeBtn.setAttribute('aria-label','Close menu');
    closeBtn.className = [
      'md:hidden','fixed','top-4','right-4','z-50',
      'rounded-xl','shadow','bg-white','border','border-gray-200',
      'px-3','py-2','text-gray-700','hover:bg-gray-50',
      'focus:outline-none','focus:ring-2','focus:ring-gray-300',
      'hidden'
    ].join(' ');
    closeBtn.innerHTML = `<span class="material-icons">close</span>`;
    closeBtn.addEventListener('click', () => setNavOpen(false));
    document.body.appendChild(closeBtn);
  }

  function syncButtons(){
    const open = document.body.classList.contains('nav-open');
    document.getElementById('nav-toggle')?.classList.toggle('hidden', open);
    document.getElementById('nav-close')?.classList.toggle('hidden', !open);
  }
  function setNavOpen(state){
    document.body.classList.toggle('nav-open', state);
    syncButtons();
  }

  // ESC closes
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setNavOpen(false);
  });

  // Clicking any link in sidebar closes
  sb.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (a) setNavOpen(false);
  });

  // Optional: swipe left to close (when using side-drawer variant)
  let startX = null;
  sb.addEventListener('touchstart', (e)=>{ startX = e.touches[0].clientX; }, {passive:true});
  sb.addEventListener('touchmove', (e)=>{
    if (startX == null) return;
    const dx = e.touches[0].clientX - startX;
    if (dx < -50) { setNavOpen(false); startX = null; }
  }, {passive:true});

  // First sync
  syncButtons();
})();
      /* ===== END mobile controls ===== */
    })
    .catch(() => {
      wrap.innerHTML = `<div class="panel" style="padding:16px;font-weight:600;">Menu unavailable</div>`;
    });
})();
