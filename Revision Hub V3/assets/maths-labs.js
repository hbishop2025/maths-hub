(function () {
  const buttons = Array.from(document.querySelectorAll("[data-game-filter]"));
  const cards = Array.from(document.querySelectorAll("[data-game-category]"));
  const empty = document.getElementById("game-empty");

  buttons.forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.gameFilter;
    let visible = 0;

    buttons.forEach((item) => {
      const selected = item === button;
      item.classList.toggle("is-active", selected);
      item.setAttribute("aria-pressed", String(selected));
    });

    cards.forEach((card) => {
      const categories = (card.dataset.gameCategory || "").split(/\s+/);
      const show = filter === "all" || categories.includes(filter);
      card.hidden = !show;
      if (show) visible += 1;
    });

    if (empty) empty.hidden = visible !== 0;
  }));

  const carousel = document.querySelector("[data-lab-carousel]");
  if (!carousel) return;

  const slides = Array.from(carousel.querySelectorAll("[data-lab-slide]"));
  const tabs = Array.from(carousel.querySelectorAll("[data-lab-target]"));
  const position = document.getElementById("lab-carousel-position");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeIndex = 0;
  let timer = null;

  slides.forEach((slide, index) => {
    slide.id = `featured-lab-${slide.dataset.labSlide}`;
    slide.setAttribute("role", "tabpanel");
    if (tabs[index]) {
      tabs[index].id = `featured-lab-tab-${slide.dataset.labSlide}`;
      tabs[index].setAttribute("aria-controls", slide.id);
      slide.setAttribute("aria-labelledby", tabs[index].id);
    }
  });

  function activate(index, focusTab = false) {
    activeIndex = (index + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === activeIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.querySelectorAll("a,button").forEach((control) => { control.tabIndex = active ? 0 : -1; });
    });
    tabs.forEach((tab, tabIndex) => {
      const active = tabIndex === activeIndex;
      tab.classList.toggle("is-active", active);
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    if (position) position.textContent = String(activeIndex + 1);
    if (focusTab) tabs[activeIndex]?.focus();
  }

  function stopRotation() {
    window.clearInterval(timer);
    timer = null;
  }

  function startRotation() {
    if (reduceMotion || timer) return;
    timer = window.setInterval(() => activate(activeIndex + 1), 7000);
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => { activate(index); stopRotation(); startRotation(); });
    tab.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); activate(activeIndex + 1, true); }
      if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); activate(activeIndex - 1, true); }
      if (event.key === "Home") { event.preventDefault(); activate(0, true); }
      if (event.key === "End") { event.preventDefault(); activate(slides.length - 1, true); }
    });
  });

  carousel.querySelector("[data-lab-previous]")?.addEventListener("click", () => { activate(activeIndex - 1); stopRotation(); startRotation(); });
  carousel.querySelector("[data-lab-next]")?.addEventListener("click", () => { activate(activeIndex + 1); stopRotation(); startRotation(); });
  carousel.addEventListener("pointerenter", stopRotation);
  carousel.addEventListener("pointerleave", startRotation);
  carousel.addEventListener("focusin", stopRotation);
  carousel.addEventListener("focusout", (event) => { if (!carousel.contains(event.relatedTarget)) startRotation(); });
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopRotation(); else startRotation(); });

  activate(0);
  startRotation();
})();
