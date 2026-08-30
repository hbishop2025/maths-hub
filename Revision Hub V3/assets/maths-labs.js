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
})();
