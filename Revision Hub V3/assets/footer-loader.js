// assets/footer-loader.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const slot = document.getElementById("footer-slot");
    if (!slot) return;

    fetch("footer.html", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.text();
      })
      .then((html) => {
        // Replace the placeholder div with the real footer HTML
        slot.outerHTML = html;
      })
      .catch((err) => {
        console.error("Footer load error:", err);
      });
  });
})();
