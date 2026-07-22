// assets/footer-loader.js
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const slot = document.getElementById("footer-slot");
    if (!slot) return;

    // The footer is published at the site root. Using a root-relative URL keeps
    // this request valid on both top-level pages and nested routes such as
    // /gcse/gcse_unit01.html.
    fetch("/footer.html")
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
