(function () {
  const body = document.body;
  if (!body.classList.contains("sleek-home-prototype")) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;

  const update = () => {
    frame = 0;
    const distance = Math.max(window.innerHeight * 0.5, 1);
    const rawProgress = Math.min(Math.max(window.scrollY / distance, 0), 1);
    const progress = reducedMotion.matches ? (rawProgress > 0.02 ? 1 : 0) : rawProgress;
    body.style.setProperty("--entry-progress", progress.toFixed(4));
    body.classList.toggle("prototype-nav-visible", progress >= 0.98);
  };

  const requestUpdate = () => {
    if (!frame) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  reducedMotion.addEventListener?.("change", requestUpdate);
  update();
}());
