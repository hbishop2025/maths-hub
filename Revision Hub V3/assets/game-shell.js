(function () {
  const body = document.body;
  if (!body.classList.contains("labs-game")) return;

  const title = body.dataset.gameTitle || document.title.replace(/^SJWMS Maths\s*[|—-]\s*/, "");
  const topic = body.dataset.gameTopic || "Maths game";
  const ribbon = document.querySelector(".experience-ribbon__inner");

  if (ribbon) {
    ribbon.innerHTML = `
      <span class="game-crumb"><span>Maths Labs</span><i aria-hidden="true">/</i><b>${title}</b><i aria-hidden="true">·</i><span>${topic}</span></span>
      <a href="../maths_labs.html"><span aria-hidden="true">←</span> Back to Maths Labs</a>`;
  }

  document.querySelectorAll('a[href="/index.html"],a[href="../index.html"]').forEach((link) => {
    if (link.closest("#site-header") || link.closest("#site-footer")) return;
    link.href = "../maths_labs.html";
    if (/back|return/i.test(link.textContent)) link.childNodes[link.childNodes.length - 1].textContent = " Back to Maths Labs";
  });

  const feedback = document.querySelectorAll("#feedback,#feedbackBox,[id*='feedback'],.feedback");
  feedback.forEach((element) => {
    if (!element.hasAttribute("aria-live")) element.setAttribute("aria-live", "polite");
  });
})();
