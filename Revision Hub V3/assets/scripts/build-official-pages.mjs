import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const site = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const dataPath = path.join(site, "assets/data/curriculum.json");

const decode = (value = "") => value
  .replace(/<[^>]+>/g, "")
  .replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#39;", "'")
  .replaceAll("&nbsp;", " ").replaceAll("&apos;", "'").trim();
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;").replaceAll("'", "&#39;");
const read = (relative) => fs.readFileSync(path.join(site, relative), "utf8");
const write = (relative, content) => fs.writeFileSync(path.join(site, relative), `${content.trim()}\n`);

const parseTextbookLinks = () => {
  const source = read("assets/support-pages.js");
  const result = {};
  for (const year of [7, 8, 9]) {
    const match = source.match(new RegExp(`${year}:\\s*\\[([\\s\\S]*?)\\n\\s*\\](?:,|\\n\\s*};)`));
    result[year] = match ? [...match[1].matchAll(/\["[^"]+",\s*"([^"]+)"\]/g)].map((item) => item[1]) : [];
  }
  return result;
};

const inferCategory = (title, fallback = "Mathematics") => {
  const text = title.toLowerCase();
  if (/data|statistic|graph/.test(text)) return "Data";
  if (/angle|shape|area|volume|transform|construction|measure|trig|circle|vector|proof|congruence/.test(text)) return "Geometry";
  if (/equation|formula|quadratic|algebra|sequence|power/.test(text)) return "Algebra";
  if (/probability/.test(text)) return "Probability";
  return fallback;
};

const extractCurriculum = () => {
  const textbooks = parseTextbookLinks();
  const years = {};
  for (const year of [7, 8, 9]) {
    years[year] = [];
    for (let number = 1; number <= 10; number += 1) {
      const pad = String(number).padStart(2, "0");
      const source = read(`year_${year}/year${year}_unit${pad}.html`);
      const title = decode(source.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || `Unit ${number}`);
      const topics = [...source.matchAll(/<span class="topic-chip">([\s\S]*?)<\/span>/g)].map((item) => decode(item[1]));
      const category = decode(source.match(/<a[^>]+aria-current="page"[\s\S]*?<small>([^<]+)<\/small>/)?.[1] || inferCategory(title, "Number"));
      years[year].push({ number, title, category, topics, textbook: textbooks[year][number - 1] || "" });
    }
  }
  const gcse = [];
  for (let number = 1; number <= 19; number += 1) {
    const pad = String(number).padStart(2, "0");
    const source = read(`gcse/gcse_unit${pad}.html`);
    const title = decode(source.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || `Unit ${number}`);
    const topics = [...source.matchAll(/<span class="topic-chip">([\s\S]*?)<\/span>/g)].map((item) => decode(item[1]));
    gcse.push({ number, title, category: inferCategory(title, "GCSE"), topics });
  }
  const curriculum = { years, gcse };
  fs.writeFileSync(dataPath, `${JSON.stringify(curriculum, null, 2)}\n`);
  return curriculum;
};

const curriculum = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, "utf8")) : extractCurriculum();

const routeMap = new Map([
  ["future-home.html", "index.html"], ["future-ks3.html", "ks3_hub.html"],
  ["future-textbooks.html", "dashboard.html"], ["future-sparx.html", "sparx.html"],
  ["future-assessments.html", "ks3_eoy.html"], ["future-year7.html", "ks3_hub.html#year-7"],
  ["future-year7-unit01.html", "year_7/year7_unit01.html"]
]);
const officialLinks = (value) => {
  let result = value;
  routeMap.forEach((to, from) => { result = result.replaceAll(from, to); });
  return result.replaceAll("Future home", "Home");
};
const extractMain = (relative) => {
  const source = officialLinks(read(relative));
  const match = source.match(/<main id="main-content">[\s\S]*?<\/main>/);
  if (!match) throw new Error(`No main content found in ${relative}`);
  return match[0];
};

const page = ({ title, description, main, section = "", bodyClass = "", attrs = "", nested = false, scripts = [] }) => {
  const root = nested ? ".." : ".";
  const asset = nested ? "../assets" : "assets";
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="theme-color" content="#f6faf8">
  <link rel="icon" type="image/svg+xml" href="${asset}/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <script src="${asset}/theme-init.js"></script>
  <link rel="stylesheet" href="${asset}/official/official-site.css">
  <title>${escapeHtml(title)}</title>
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ""} data-root="${root}"${section ? ` data-section="${section}"` : ""}${attrs ? ` ${attrs}` : ""}>
  <div id="site-header"></div>
  ${main}
  <div id="site-footer"></div>
  <script src="${asset}/site-shell.js" defer></script>
${scripts.length ? `  ${scripts.map((script) => `<script src="${asset}/${script}" defer></script>`).join("\n  ")}\n` : ""}
</body>
</html>`;
};

const promoted = [
  { source: "index.html", output: "index.html", title: "SJWMS Maths | Revision and textbooks", description: "Teacher-selected mathematics revision, practice and KS3 textbooks for SJWMS students.", section: "home" },
  { source: "dashboard.html", output: "dashboard.html", title: "KS3 Textbooks | SJWMS Maths", description: "Open the matching Year 7, 8 or 9 digital textbook chapter using a school account.", section: "ks3", bodyClass: "future-textbook-page", attrs: 'data-year="7"', scripts: ["support-pages.js"] },
  { source: "sparx.html", output: "sparx.html", title: "SPARX Guidance | SJWMS Maths", description: "SPARX setup, bookwork and independent practice guidance for SJWMS students.", bodyClass: "future-sparx-page" },
  { source: "ks3_eoy.html", output: "ks3_eoy.html", title: "KS3 Assessments | SJWMS Maths", description: "Year 7, 8 and 9 assessment preparation, revision guides and practice resources.", section: "ks3", bodyClass: "future-assessment-page", attrs: 'data-year="7"', scripts: ["support-pages.js"] }
];
promoted.forEach((item) => write(item.output, page({ ...item, main: extractMain(item.source) })));

const iconFor = (category) => {
  const text = category.toLowerCase();
  if (text.includes("algebra")) return "ƒ";
  if (text.includes("geometry")) return "△";
  if (text.includes("data") || text.includes("statistic")) return "▥";
  if (text.includes("probability")) return "◇";
  return "#";
};

const compactUnit = (unit, unitHref, textbookHref = "") => `<article class="year7-unit-card"><span class="year7-unit-card__number">${String(unit.number).padStart(2, "0")}</span><span class="year7-unit-card__icon" aria-hidden="true">${iconFor(unit.category)}</span><a class="year7-unit-card__main" href="${unitHref}"><small>${escapeHtml(unit.category)}</small><strong>${escapeHtml(unit.title)}</strong></a><span class="year7-unit-card__actions"><a href="${unitHref}" aria-label="Open ${escapeHtml(unit.title)}">Unit <b aria-hidden="true">→</b></a>${textbookHref ? `<a href="${textbookHref}" target="_blank" rel="noopener" aria-label="Open the ${escapeHtml(unit.title)} textbook in a new tab">Textbook <b aria-hidden="true">↗</b></a>` : ""}</span></article>`;

const yearDescriptions = {
  7: "Number, algebra, geometry and data from your Year 7 lessons.",
  8: "Powers, transformations, proportion, graphs and more from Year 8.",
  9: "Your final KS3 topics and the ideas that lead into GCSE."
};

const ks3YearAccordion = (year) => `<details class="curriculum-accordion curriculum-accordion--year${year}" id="year-${year}"><summary><span class="curriculum-accordion__number">0${year}</span><span class="curriculum-accordion__title"><small>Ten curriculum units</small><strong>Year ${year}</strong><span>${yearDescriptions[year]}</span></span><span class="curriculum-accordion__count">10 units</span><b aria-hidden="true">＋</b></summary><div class="accordion-unit-grid">${curriculum.years[year].map((unit) => compactUnit(unit, `year_${year}/year${year}_unit${String(unit.number).padStart(2, "0")}.html`)).join("\n")}</div></details>`;

const ks3Main = `<main id="main-content">
  <section class="year7-hero year7-hero--compact" aria-labelledby="ks3-title"><div class="future-container year7-hero__compact"><nav class="future-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>KS3</span></nav><div class="year7-hero__line"><div><p class="section-label"><span aria-hidden="true"></span>Years 7–9</p><h1 id="ks3-title">KS3</h1><p>Choose your year, then open the unit being taught.</p></div><a class="text-link" href="dashboard.html">Open all KS3 textbooks <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="future-section year7-units-section" aria-labelledby="ks3-units-title"><div class="future-container year7-unit-panel"><header class="year7-unit-panel__heading"><div><p class="section-label"><span aria-hidden="true"></span>KS3 curriculum</p><h2 id="ks3-units-title">Choose your year</h2></div><p>Expand a year to see all ten unit links.</p></header><div class="curriculum-accordion-list">${[7, 8, 9].map(ks3YearAccordion).join("\n")}</div></div></section>
  <section class="future-section year7-support-section" aria-labelledby="ks3-support-title"><div class="future-container year7-support-panel"><div><p class="section-label section-label--light"><span aria-hidden="true"></span>More KS3 help</p><h2 id="ks3-support-title">Other pages you may need.</h2><p>Open your textbook, get help with SPARX or prepare for an assessment.</p></div><div class="year7-support-links"><a href="dashboard.html"><span aria-hidden="true">▤</span><strong>Textbooks</strong><b aria-hidden="true">→</b></a><a href="sparx.html"><span aria-hidden="true">√</span><strong>SPARX</strong><b aria-hidden="true">→</b></a><a href="ks3_eoy.html"><span aria-hidden="true">✓</span><strong>Assessments</strong><b aria-hidden="true">→</b></a></div></div></section>
</main>`;

write("ks3_hub.html", page({ title: "KS3 Mathematics | SJWMS Maths", description: "Expand Year 7, 8 or 9 and open any KS3 mathematics unit from one page.", section: "ks3", bodyClass: "future-year7-page official-ks3-page", main: ks3Main, scripts: ["curriculum-accordions.js"] }));

const topicDisclosure = (topics) => {
  if (!topics.length) return `<details class="unit-topic-overview"><summary><span><small>At a glance</small><strong>Topic outline</strong></span><b aria-hidden="true">＋</b></summary><p class="unit-topic-empty">The detailed topic list for this unit is being prepared.</p></details>`;
  const items = topics.map((topic, index) => {
    const match = topic.match(/^(\S+)\s+(.+)$/);
    const number = match ? match[1] : String(index + 1).padStart(2, "0");
    const title = match ? match[2] : topic;
    return `<li><span>${escapeHtml(number)}</span><strong>${escapeHtml(title)}</strong></li>`;
  }).join("");
  return `<details class="unit-topic-overview"><summary><span><small>At a glance</small><strong>View the ${topics.length} topics in this unit</strong></span><b aria-hidden="true">＋</b></summary><ol class="unit-topic-list">${items}</ol></details>`;
};

const unitMain = ({ stage, year, units, unit }) => {
  const isGcse = stage === "gcse";
  const label = isGcse ? "GCSE" : `Year ${year}`;
  const hub = isGcse ? "gcse_hub.html" : `ks3_hub.html#year-${year}`;
  const prefix = isGcse ? "gcse" : `year${year}`;
  const pad = String(unit.number).padStart(2, "0");
  const next = units[unit.number] || null;
  const sidebar = units.map((item) => `<a${item.number === unit.number ? ' aria-current="page"' : ""} href="${prefix}_unit${String(item.number).padStart(2, "0")}.html"><span>${String(item.number).padStart(2, "0")}</span><strong>${escapeHtml(item.title)}</strong></a>`).join("");
  const textbookAction = unit.textbook ? `<a class="future-button unit-textbook-button" href="${unit.textbook}" target="_blank" rel="noopener">Open textbook <span aria-hidden="true">↗</span></a>` : "";
  const emptyAction = unit.textbook ? `<a href="${unit.textbook}" target="_blank" rel="noopener">Open this textbook →</a>` : `<a href="../${hub}">Back to ${label} →</a>`;
  return `<main id="main-content">
    <section class="unit-hero" aria-labelledby="unit-title"><div class="future-container unit-hero__inner"><nav class="future-breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span>${isGcse ? "" : '<a href="../ks3_hub.html">KS3</a><span aria-hidden="true">/</span>'}<a href="../${hub}">${label}</a><span aria-hidden="true">/</span><span>Unit ${unit.number}</span></nav><div class="unit-hero__content"><div><p class="section-label"><span aria-hidden="true"></span>${label} · Unit ${pad}</p><h1 id="unit-title">${escapeHtml(unit.title)}</h1><p>Open the topic list, worksheets, videos and SPARX codes for this unit.</p></div><dl class="unit-hero__facts"><div><dt>Unit</dt><dd>${pad}</dd></div><div><dt>Topics</dt><dd>${unit.topics.length || "—"}</dd></div><div><dt>Area</dt><dd>${escapeHtml(unit.category)}</dd></div></dl></div><div class="hero-actions"><a class="future-button future-button--primary" href="#unit-resources-title">Open resources <span aria-hidden="true">↓</span></a>${textbookAction}<a class="text-link" href="../${hub}">All ${label} units <span aria-hidden="true">↗</span></a></div></div></section>
    <section class="future-section unit-learning-section" id="unit-learning"><div class="future-container unit-layout"><aside class="unit-rail" aria-label="${label} unit navigation"><details class="unit-sidebar" open><summary><span>${label}</span><strong>Choose another unit</strong></summary><nav>${sidebar}</nav><a class="unit-rail__all" href="../${hub}">View the ${label} hub →</a></details></aside><div class="unit-content">${topicDisclosure(unit.topics)}
      <section class="unit-method-panel" aria-labelledby="unit-method-title"><div><p class="section-label section-label--light"><span aria-hidden="true"></span>Work through the unit</p><h2 id="unit-method-title">Learn. Practise. Check.</h2></div><ol><li><span>01</span><strong>Review the method</strong></li><li><span>02</span><strong>Try the questions</strong></li><li><span>03</span><strong>Check and improve</strong></li></ol></section>
      <section class="unit-resources" aria-labelledby="unit-resources-title"><header class="future-heading"><div><p class="section-label"><span aria-hidden="true"></span>Revision for this unit</p><h2 id="unit-resources-title">Unit resources</h2></div><p>Choose a worksheet, video or useful link for the topic you are revising.</p></header><nav class="unit-resource-jumps" aria-label="Resource types"><a href="#worksheets" data-resource-anchor="worksheets">Worksheets</a><a href="#videos" data-resource-anchor="videos">Videos</a><a href="#other-resources" data-resource-anchor="other">Useful links</a><a href="#sparx-section" data-resource-anchor="sparx">SPARX codes</a></nav><div class="unit-resource-group" id="worksheets" data-resource-group="worksheets"><h3>Worksheets</h3><div class="unit-resource-grid" id="grid-worksheets"></div></div><div class="unit-resource-group" id="videos" data-resource-group="videos"><h3>Videos</h3><div class="unit-resource-grid" id="grid-videos"></div></div><div class="unit-resource-group" id="other-resources" data-resource-group="other"><h3>Useful links</h3><div class="unit-resource-grid" id="grid-other"></div></div><div class="unit-empty" id="resource-empty" hidden><span aria-hidden="true">＋</span><div><strong>Resources are still being added</strong><p>For now, use SPARX or go back to the unit list.</p></div>${emptyAction}</div><details class="sparx-panel sparx-disclosure is-visible" id="sparx-section"><summary><span><small>Extra practice</small><strong>SPARX codes for this unit</strong></span><b aria-hidden="true">＋</b></summary><div class="sparx-disclosure__body"><div id="sparx-code-list"><p class="sparx-empty" data-sparx-fallback>No SPARX codes have been listed for this unit yet.</p></div><a href="https://selectschool.sparx-learning.com/" target="_blank" rel="noopener">Open SPARX in a new tab <span aria-hidden="true">↗</span></a></div></details></section>
      <nav class="unit-next" aria-label="Unit navigation"><a href="../${hub}"><span>${label} overview</span><strong>All units</strong></a>${next ? `<a href="${prefix}_unit${String(next.number).padStart(2, "0")}.html"><span>Next unit</span><strong>${String(next.number).padStart(2, "0")} · ${escapeHtml(next.title)} →</strong></a>` : `<a href="../${hub}"><span>Course complete</span><strong>Return to ${label} →</strong></a>`}</nav>
    </div></div></section>
  </main>`;
};

for (const year of [7, 8, 9]) {
  for (const unit of curriculum.years[year]) {
    const pad = String(unit.number).padStart(2, "0");
    write(`year_${year}/year${year}_unit${pad}.html`, page({ title: `${unit.title} | Year ${year} Mathematics`, description: `Year ${year} ${unit.title} revision resources, videos, worksheets and SPARX codes.`, section: "ks3", bodyClass: "future-unit-page", attrs: `data-year="${year}" data-json="../assets/data/year${year}_unit${pad}.json"`, nested: true, main: unitMain({ stage: "ks3", year, units: curriculum.years[year], unit }), scripts: ["prototype-unit.js"] }));
  }
}

const gcseMain = `<main id="main-content">
  <section class="year7-hero year7-hero--compact" aria-labelledby="gcse-title"><div class="future-container year7-hero__compact"><nav class="future-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>GCSE</span></nav><div class="year7-hero__line"><div><p class="section-label"><span aria-hidden="true"></span>Years 10 and 11</p><h1 id="gcse-title">GCSE</h1><p>Choose the unit you are revising.</p></div><a class="text-link" href="https://www.mathsgenie.co.uk/papers.php" target="_blank" rel="noopener">Open past papers <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="future-section year7-units-section" aria-labelledby="gcse-units-title"><div class="future-container year7-unit-panel"><header class="year7-unit-panel__heading"><div><p class="section-label"><span aria-hidden="true"></span>GCSE curriculum</p><h2 id="gcse-units-title">Choose a unit</h2></div><p>All 19 units in one compact list.</p></header><div class="year7-unit-grid">${curriculum.gcse.map((unit) => compactUnit(unit, `gcse/gcse_unit${String(unit.number).padStart(2, "0")}.html`)).join("\n")}</div></div></section>
  <section class="future-section year7-support-section" aria-labelledby="gcse-support-title"><div class="future-container year7-support-panel"><div><p class="section-label section-label--light"><span aria-hidden="true"></span>Exam practice</p><h2 id="gcse-support-title">Need more questions?</h2><p>Open past papers, check the formula sheet or practise on Dr Frost Maths.</p></div><div class="year7-support-links"><a href="https://www.mathsgenie.co.uk/papers.php" target="_blank" rel="noopener"><span aria-hidden="true">≡</span><strong>Past papers</strong><b aria-hidden="true">↗</b></a><a href="https://drive.google.com/file/d/1oxMQu9HU_TeWDvT2laMWbfNKZt5_o_bw/view?usp=sharing" target="_blank" rel="noopener"><span aria-hidden="true">ƒ</span><strong>Formula sheet</strong><b aria-hidden="true">↗</b></a><a href="https://www.drfrost.org/" target="_blank" rel="noopener"><span aria-hidden="true">√</span><strong>Dr Frost Maths</strong><b aria-hidden="true">↗</b></a></div></div></section>
</main>`;
write("gcse_hub.html", page({ title: "GCSE Mathematics | SJWMS Maths", description: "Browse the GCSE mathematics course across 19 compact revision units.", section: "gcse", bodyClass: "future-year7-page official-gcse-page", attrs: 'data-stage="gcse"', main: gcseMain }));

for (const unit of curriculum.gcse) {
  const pad = String(unit.number).padStart(2, "0");
  write(`gcse/gcse_unit${pad}.html`, page({ title: `${unit.title} | GCSE Mathematics`, description: `GCSE ${unit.title} revision resources, videos, worksheets and SPARX codes.`, section: "gcse", bodyClass: "future-unit-page", attrs: `data-stage="gcse" data-json="../assets/data/gcse_unit${pad}.json"`, nested: true, main: unitMain({ stage: "gcse", units: curriculum.gcse, unit }), scripts: ["prototype-unit.js"] }));
}

const alevelData = JSON.parse(read("assets/data/alevel_tracks.json"));
const alevelTracks = Array.isArray(alevelData.tracks) ? alevelData.tracks : [];
const alevelTrackAccordion = (track, trackIndex) => {
  const sections = Array.isArray(track.sections) ? track.sections : [];
  const cards = sections.flatMap((section) => Array.isArray(section.cards) ? section.cards : []);
  let cardNumber = 0;
  const sectionMarkup = sections.map((section) => {
    const sectionCards = (section.cards || []).map((item) => {
      cardNumber += 1;
      return `<a class="course-link-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener"><span class="course-link-card__number">${String(cardNumber).padStart(2, "0")}</span><span class="course-link-card__copy"><small>${escapeHtml(section.heading || track.label)}</small><strong>${escapeHtml(item.title || "Resource")}</strong><span>${escapeHtml(item.description || "Open this A-level mathematics resource.")}</span></span><b aria-hidden="true">↗</b></a>`;
    }).join("\n");
    return `<section class="alevel-track-section" aria-label="${escapeHtml(section.heading || track.label)}"><header><strong>${escapeHtml(section.heading || track.label)}</strong>${section.subheading ? `<span>${escapeHtml(section.subheading)}</span>` : ""}</header><div class="course-link-grid">${sectionCards}</div></section>`;
  }).join("\n");
  const summary = sections.map((section) => section.subheading).filter(Boolean).join(" ");
  return `<details class="curriculum-accordion curriculum-accordion--alevel" id="${escapeHtml(track.id)}"><summary><span class="curriculum-accordion__number">${String(trackIndex + 1).padStart(2, "0")}</span><span class="curriculum-accordion__title"><small>A-level section</small><strong>${escapeHtml(track.label)}</strong><span>${escapeHtml(summary)}</span></span><span class="curriculum-accordion__count">${cards.length} links</span><b aria-hidden="true">＋</b></summary><div class="alevel-accordion__body">${sectionMarkup}</div></details>`;
};

const alevelMain = `<main id="main-content">
  <section class="year7-hero year7-hero--compact" aria-labelledby="alevel-title"><div class="future-container year7-hero__compact"><nav class="future-breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>A-level</span></nav><div class="year7-hero__line"><div><p class="section-label"><span aria-hidden="true"></span>Years 12 and 13</p><h1 id="alevel-title">A-level</h1><p>Open pure mathematics, statistics, mechanics or exam questions.</p></div><a class="text-link" href="https://sites.google.com/sjwms.org.uk/mathsatthemath/exam-revision" target="_blank" rel="noopener">Open exam revision <span aria-hidden="true">↗</span></a></div></div></section>
  <section class="future-section year7-units-section" aria-labelledby="alevel-pathways-title"><div class="future-container year7-unit-panel"><header class="year7-unit-panel__heading"><div><p class="section-label"><span aria-hidden="true"></span>A-level course</p><h2 id="alevel-pathways-title">Choose a section</h2></div><p>Pure mathematics, statistics, mechanics and exam papers are all on this page.</p></header><div class="curriculum-accordion-list">${alevelTracks.map(alevelTrackAccordion).join("\n")}</div></div></section>
  <section class="future-section year7-support-section" aria-labelledby="alevel-support-title"><div class="future-container year7-support-panel"><div><p class="section-label section-label--light"><span aria-hidden="true"></span>More practice</p><h2 id="alevel-support-title">Exam questions and challenges.</h2><p>Use exam papers, A* questions and UKMT problems when you want more practice.</p></div><div class="year7-support-links"><a href="https://sites.google.com/sjwms.org.uk/mathsatthemath/exam-revision" target="_blank" rel="noopener"><span aria-hidden="true">≡</span><strong>Exam revision</strong><b aria-hidden="true">↗</b></a><a href="https://sites.google.com/sjwms.org.uk/mathsatthemath/papers/a-questions" target="_blank" rel="noopener"><span aria-hidden="true">A*</span><strong>A* questions</strong><b aria-hidden="true">↗</b></a><a href="https://ukmt.org.uk" target="_blank" rel="noopener"><span aria-hidden="true">∑</span><strong>UKMT</strong><b aria-hidden="true">↗</b></a></div></div></section>
</main>`;

write("alevel_hub.html", page({ title: "A-level Mathematics | SJWMS Maths", description: "Expand an A-level mathematics pathway and open Pure, Statistics, Mechanics or exam resources.", section: "alevel", bodyClass: "future-year7-page official-alevel-page", attrs: 'data-stage="alevel"', main: alevelMain, scripts: ["curriculum-accordions.js"] }));

const redirects = new Map([
  ["future-home.html", "index.html"], ["future-ks3.html", "ks3_hub.html"],
  ["future-textbooks.html", "dashboard.html"], ["future-sparx.html", "sparx.html"],
  ["future-assessments.html", "ks3_eoy.html"], ["future-year7.html", "ks3_hub.html#year-7"],
  ["future-year7-unit01.html", "year_7/year7_unit01.html"],
  ["year7_hub.html", "ks3_hub.html#year-7"], ["year8_hub.html", "ks3_hub.html#year-8"],
  ["year9_hub.html", "ks3_hub.html#year-9"]
]);
redirects.forEach((target, output) => write(output, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="refresh" content="0; url=${target}"><link rel="canonical" href="${target}"><title>Page moved | SJWMS Maths</title></head><body><p>This page has moved to <a href="${target}">${target}</a>.</p></body></html>`));

console.log("Official pages generated from the shared curriculum and approved layouts.");
