(function () {
  const body = document.body;
  if (!body.classList.contains("ukmt-page")) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const darkSections = Array.from(document.querySelectorAll('[data-ukmt-nav-tone="dark"]'));
  const siteHeader = document.querySelector("#site-header .future-header");
  let frame = 0;
  const updateHeaderTone = () => {
    if (document.documentElement.dataset.theme === "dark") {
      body.classList.remove("ukmt-nav-dark");
      return;
    }
    const headerBottom = siteHeader?.getBoundingClientRect().bottom || 72;
    const sampleY = Math.max(Math.min(headerBottom - 8, 72), 24);
    const overDarkSection = darkSections.some((section) => {
      const bounds = section.getBoundingClientRect();
      return bounds.top <= sampleY && bounds.bottom > sampleY;
    });
    body.classList.toggle("ukmt-nav-dark", overDarkSection);
  };
  const updateIntro = () => {
    frame = 0;
    const distance = Math.max(window.innerHeight * 0.72, 1);
    const raw = Math.min(Math.max(window.scrollY / distance, 0), 1);
    const progress = reducedMotion.matches ? (raw > 0.02 ? 1 : 0) : raw;
    body.style.setProperty("--ukmt-progress", progress.toFixed(4));
    body.classList.toggle("ukmt-nav-visible", progress >= 0.9);
    updateHeaderTone();
  };
  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(updateIntro);
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener?.("change", requestUpdate);
  new MutationObserver(requestUpdate).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  updateIntro();

  const revealItems = Array.from(document.querySelectorAll("[data-ukmt-reveal]"));
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.08 });
    revealItems.forEach((item) => observer.observe(item));
  }
}());
