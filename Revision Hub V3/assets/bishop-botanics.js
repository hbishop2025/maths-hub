(function () {
  const products = {
    split: { name: "Split 01", image: "assets/bishop-botanics/monstera.webp", price: 48, answer: 48, question: "Split 01 starts at £64. The drop removes 25%. What is the new price?", prefix: "£", suffix: "", display: "£48.00" },
    vertical: { name: "Vertical 02", image: "assets/bishop-botanics/snake-plant.webp", price: 40.8, answer: 40.8, question: "Vertical 02 starts at £48 and is reduced by 15%. What is the sale price?", prefix: "£", suffix: "", display: "£40.80" },
    cascade: { name: "Cascade 03", image: "assets/bishop-botanics/pothos-white.webp", price: 25.92, answer: 25.92, question: "Cascade 03 costs £36. Apply 20% off, then apply another 10% off the reduced price.", prefix: "£", suffix: "", display: "£25.92" },
    orbit: { name: "Orbit 04", image: "assets/bishop-botanics/cactus.webp", price: 24, answer: 24, question: "Orbit 04 launches at £20, then its price increases by 20%. What is the new price?", prefix: "£", suffix: "", display: "£24.00" },
    fractal: { name: "Fractal 05", image: "assets/bishop-botanics/fern.webp", price: 31.5, answer: 45, question: "Fractal 05 is now £31.50 after a 30% reduction. What was the original price?", prefix: "£", suffix: "", display: "£31.50", original: "£45.00" },
    signal: { name: "Signal 06", image: "assets/bishop-botanics/palm.webp", price: 35.7, answer: 15, question: "Signal 06 falls from £42 to £35.70. What percentage reduction was applied?", prefix: "", suffix: "%", display: "£35.70", discount: "15% off" }
  };

  const header = document.getElementById("botanics-header");
  const challengeBackdrop = document.getElementById("challenge-backdrop");
  const challengeDialog = document.getElementById("challenge-dialog");
  const challengeForm = document.getElementById("challenge-form");
  const answerInput = document.getElementById("challenge-answer");
  const question = document.getElementById("challenge-question");
  const prefix = document.getElementById("challenge-prefix");
  const suffix = document.getElementById("challenge-suffix");
  const feedback = document.getElementById("challenge-feedback");
  const basketDrawer = document.getElementById("basket-drawer");
  const basketShade = document.getElementById("basket-shade");
  const basketTrigger = document.getElementById("basket-trigger");
  const basketItems = document.getElementById("basket-items");
  const basketCount = document.getElementById("basket-count");
  const basketTotal = document.getElementById("basket-total");
  const basketFeedback = document.getElementById("basket-feedback");
  const basket = new Set();
  let currentProduct = null;
  let previousFocus = null;

  const money = (value) => `£${value.toFixed(2)}`;
  const updateHeader = () => header?.classList.toggle("is-scrolled", window.scrollY > 40);
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  function lockPage() { document.body.classList.add("is-locked"); }
  function unlockPage() {
    if (challengeBackdrop.hidden && !basketDrawer.classList.contains("is-open")) document.body.classList.remove("is-locked");
  }

  function openChallenge(key, trigger) {
    const product = products[key];
    if (!product) return;
    previousFocus = trigger;
    currentProduct = key;
    question.textContent = product.question;
    prefix.textContent = product.prefix;
    suffix.textContent = product.suffix;
    answerInput.value = "";
    feedback.textContent = "";
    feedback.className = "challenge-feedback";
    challengeBackdrop.hidden = false;
    lockPage();
    requestAnimationFrame(() => answerInput.focus());
  }

  function closeChallenge() {
    challengeBackdrop.hidden = true;
    currentProduct = null;
    unlockPage();
    previousFocus?.focus();
  }

  function unlockProduct(key) {
    const product = products[key];
    const card = document.querySelector(`[data-product="${key}"]`);
    if (!product || !card) return;
    card.classList.add("is-unlocked");
    card.querySelector("[data-price-display]").textContent = product.display;
    if (product.original) card.querySelector("[data-original-display]").textContent = product.original;
    if (product.discount) card.querySelector("[data-discount-display]").textContent = product.discount;
    const add = card.querySelector("[data-add]");
    add.disabled = false;
  }

  challengeForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const product = products[currentProduct];
    const value = Number.parseFloat(answerInput.value);
    if (!product || !Number.isFinite(value)) return;
    const correct = Math.abs(value - product.answer) < 0.011;
    feedback.className = `challenge-feedback ${correct ? "is-correct" : "is-wrong"}`;
    if (correct) {
      feedback.textContent = "Correct. The tag is unlocked.";
      unlockProduct(currentProduct);
      window.setTimeout(closeChallenge, 850);
    } else {
      feedback.textContent = "Not quite. Check which amount the percentage acts on, then try again.";
      answerInput.select();
    }
  });

  document.querySelectorAll("[data-solve]").forEach((button) => button.addEventListener("click", () => openChallenge(button.dataset.solve, button)));
  document.getElementById("challenge-close")?.addEventListener("click", closeChallenge);
  challengeBackdrop?.addEventListener("click", (event) => { if (event.target === challengeBackdrop) closeChallenge(); });

  function renderBasket() {
    const keys = Array.from(basket);
    const total = keys.reduce((sum, key) => sum + products[key].price, 0);
    basketCount.textContent = String(keys.length);
    basketTotal.textContent = money(total);
    basketItems.replaceChildren();
    if (!keys.length) {
      const empty = document.createElement("p");
      empty.textContent = "Unlock a price, then add a plant.";
      basketItems.appendChild(empty);
    } else {
      keys.forEach((key) => {
        const product = products[key];
        const row = document.createElement("div");
        row.className = "basket-item";
        row.innerHTML = `<img src="${product.image}" alt=""><span><strong>${product.name}</strong><small>${money(product.price)}</small></span><button type="button" aria-label="Remove ${product.name}">×</button>`;
        row.querySelector("button").addEventListener("click", () => toggleBasket(key));
        basketItems.appendChild(row);
      });
    }
  }

  function toggleBasket(key) {
    const card = document.querySelector(`[data-product="${key}"]`);
    if (basket.has(key)) basket.delete(key); else basket.add(key);
    card?.classList.toggle("is-in-basket", basket.has(key));
    const button = card?.querySelector("[data-add]");
    if (button) button.textContent = basket.has(key) ? "Remove from basket" : "Add to basket";
    basketFeedback.textContent = "";
    renderBasket();
  }

  document.querySelectorAll("[data-add]").forEach((button) => button.addEventListener("click", () => toggleBasket(button.dataset.add)));

  function openBasket() {
    previousFocus = document.activeElement;
    basketDrawer.classList.add("is-open");
    basketDrawer.setAttribute("aria-hidden", "false");
    basketShade.hidden = false;
    basketTrigger.setAttribute("aria-expanded", "true");
    lockPage();
    requestAnimationFrame(() => document.getElementById("basket-close").focus());
  }

  function closeBasket() {
    basketDrawer.classList.remove("is-open");
    basketDrawer.setAttribute("aria-hidden", "true");
    basketShade.hidden = true;
    basketTrigger.setAttribute("aria-expanded", "false");
    unlockPage();
    previousFocus?.focus();
  }

  basketTrigger?.addEventListener("click", openBasket);
  document.getElementById("open-basket")?.addEventListener("click", openBasket);
  document.getElementById("basket-close")?.addEventListener("click", closeBasket);
  basketShade?.addEventListener("click", closeBasket);
  document.getElementById("basket-check")?.addEventListener("click", () => {
    const total = Array.from(basket).reduce((sum, key) => sum + products[key].price, 0);
    const correct = basket.size === 3 && total <= 120;
    basketFeedback.className = `basket-feedback ${correct ? "is-correct" : "is-wrong"}`;
    if (correct) basketFeedback.textContent = `Mission complete. Three plants cost ${money(total)}, leaving ${money(120 - total)}.`;
    else if (basket.size !== 3) basketFeedback.textContent = `Choose exactly three plants. Your basket currently has ${basket.size}.`;
    else basketFeedback.textContent = `That set costs ${money(total)}, which is ${money(total - 120)} over budget. Try another combination.`;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (!challengeBackdrop.hidden) closeChallenge();
    else if (basketDrawer.classList.contains("is-open")) closeBasket();
  });

  renderBasket();
})();
