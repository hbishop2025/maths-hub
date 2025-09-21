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

      /* ===== NEW: Mobile off-canvas controls ===== */
      (function(){
        // Add a close bar inside sidebar (only mobile)
        if (!wrap.querySelector('.mobile-close')) {
          const closeBar = document.createElement('div');
          closeBar.className = 'mobile-close';
          closeBar.innerHTML = `
            <span class="material-icons">chevron_left</span>
            <span>Close menu</span>
          `;
          closeBar.addEventListener('click', () => document.body.classList.remove('nav-open'));
          wrap.prepend(closeBar);
        }

        // Add overlay once
        if (!document.querySelector('.nav-overlay')) {
          const overlay = document.createElement('div');
          overlay.className = 'nav-overlay';
          overlay.addEventListener('click', () => document.body.classList.remove('nav-open'));
          document.body.appendChild(overlay);
        }

        // Add hamburger button (mobile only)
        if (!document.getElementById('nav-toggle')) {
          const btn = document.createElement('button');
          btn.id = 'nav-toggle';
          btn.setAttribute('aria-label','Open menu');
          btn.className = [
            'md:hidden',
            'fixed', 'top-4', 'left-4', 'z-50',
            'rounded-xl', 'shadow', 'bg-white', 'border', 'border-gray-200',
            'px-3', 'py-2', 'text-gray-700', 'hover:bg-gray-50',
            'focus:outline-none', 'focus:ring-2', 'focus:ring-gray-300'
          ].join(' ');
          btn.innerHTML = `<span class="material-icons">menu</span>`;
          btn.addEventListener('click', () => {
            document.body.classList.add('nav-open');
          });
          document.body.appendChild(btn);
        }

        // ESC closes
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape') document.body.classList.remove('nav-open');
        });

        // Close when clicking any link in sidebar
        wrap.addEventListener('click', (e) => {
          const a = e.target.closest('a');
          if (a) document.body.classList.remove('nav-open');
        });
      })();
      /* ===== END mobile controls ===== */
    })
    .catch(() => {
      wrap.innerHTML = `<div class="panel" style="padding:16px;font-weight:600;">Menu unavailable</div>`;
    });
})();
