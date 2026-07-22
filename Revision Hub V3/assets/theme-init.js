(function () {
  try {
    const saved = localStorage.getItem("sjwms-theme");
    const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    document.documentElement.dataset.theme = saved === "dark" || saved === "light" ? saved : preferred;
  } catch {
    document.documentElement.dataset.theme = "light";
  }
})();
