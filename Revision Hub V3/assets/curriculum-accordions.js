(function () {
  const lists = Array.from(document.querySelectorAll(".curriculum-accordion-list"));
  if (!lists.length) return;

  const openFromHash = () => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (!id) return;
    const target = document.getElementById(id);
    if (target?.classList.contains("curriculum-accordion")) target.open = true;
  };

  lists.forEach((list) => {
    const accordions = Array.from(list.querySelectorAll(":scope > .curriculum-accordion"));
    accordions.forEach((accordion) => accordion.addEventListener("toggle", () => {
      if (!accordion.open) return;
      accordions.forEach((other) => { if (other !== accordion) other.open = false; });
      if (accordion.id) history.replaceState(null, "", `#${accordion.id}`);
    }));
  });

  openFromHash();
  window.addEventListener("hashchange", openFromHash);
})();
