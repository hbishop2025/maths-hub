(function(){
  // Mobile menu (same pattern as your other pages)
  const btn = document.getElementById("menuBtn");
  const menu = document.getElementById("mobileMenu");
  function closeMenu(){ if(menu){ menu.classList.add("hidden"); btn?.setAttribute("aria-expanded","false"); } }
  function toggleMenu(e){
    e.stopPropagation();
    const open = menu.classList.contains("hidden");
    menu.classList.toggle("hidden", !open);
    btn?.setAttribute("aria-expanded", String(open));
  }
  btn?.addEventListener("click", toggleMenu);
  document.addEventListener("click", (e)=>{
    if(!e.target.closest("#mobileMenu") && !e.target.closest("#menuBtn")) closeMenu();
  });
  document.addEventListener("keydown", (e)=>{ if(e.key === "Escape") closeMenu(); });

  // Highlight active mini-site nav link
  const path = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll("[data-shake-nav] a").forEach(a=>{
    const href = (a.getAttribute("href") || "").toLowerCase();
    if(href === path) a.classList.add("active");
  });
})();
