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

  fetch('assets/sidebar.html') // <-- put sidebar.html in /assets
    .then(r => r.text())
    .then(html => {
      wrap.innerHTML = `<div class="panel">${html}</div>`;

      // Decide which link to mark as active
      const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

      function isYear9Page(f){
        return /^year9_(hub|unit\d{2}|games)\.html$/.test(f);
      }

      // Map of routes to href in the sidebar
      const routes = [
        { test: f => f === '' || f === 'index.html', href: 'index.html' },
        { test: f => f === 'policy.html',            href: 'policy.html' },
        { test: f => f === 'ai_usage.html',          href: 'ai_usage.html' },
        { test: f => isYear9Page(f),                 href: 'year9_hub.html' },
        { test: f => f === 'year9_hub.html',         href: 'year9_hub.html' },
      ];

      const active = routes.find(r => r.test(file));
      if(active){
        const link = wrap.querySelector(`nav a[href="${active.href}"]`);
        if(link){
          link.classList.add('active');
          link.setAttribute('aria-current','page');
        }
      }
    })
    .catch(() => {
      wrap.innerHTML = `<div class="panel" style="padding:16px;font-weight:600;">Menu unavailable</div>`;
    });
})();