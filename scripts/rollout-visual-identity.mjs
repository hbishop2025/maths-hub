import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("Revision Hub V3");

const cleanText = (value = "") => value
  .replace(/<[^>]+>/g, " ")
  .replaceAll("&amp;", "&")
  .replaceAll("&nbsp;", " ")
  .replaceAll("&#39;", "'")
  .replaceAll("&quot;", '"')
  .replace(/\s+/g, " ")
  .trim();

const escapeAttr = (value = "") => value
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

const extractTopics = (source) => {
  const topics = [];
  const pattern = /<span[^>]*class="[^"]*(?:topic-chip|rounded-full|px-3\s+py-1\.5)[^"]*"[^>]*>([\s\S]*?)<\/span>/gi;
  for (const match of source.matchAll(pattern)) {
    const topic = cleanText(match[1]);
    if (topic && !topics.includes(topic)) topics.push(topic);
  }
  return topics;
};

const years = {
  7: {
    colour: "Orange pathway",
    intro: "Ten structured units that establish strong foundations across number, algebra, geometry and data.",
    units: [
      ["Analysing &amp; Displaying Data", "Data handling", ["Two-way tables &amp; bar charts", "Averages &amp; range", "Pie charts &amp; correlation"]],
      ["Number Skills", "Number", ["Factors, primes &amp; multiples", "Negative numbers", "Squares, roots &amp; calculations"]],
      ["Equations, Functions &amp; Formulae", "Algebra", ["Simplifying expressions", "Writing formulae", "Brackets, powers &amp; factorising"]],
      ["Fractions", "Number", ["Working with fractions", "Adding &amp; subtracting", "FDP &amp; mixed numbers"]],
      ["Angles &amp; Shapes", "Geometry", ["Angles &amp; parallel lines", "Triangles &amp; quadrilaterals", "Polygons"]],
      ["Decimals", "Number", ["Ordering &amp; rounding", "Four operations", "FDP &amp; percentages"]],
      ["Equations", "Algebra", ["One-step equations", "Two-step equations", "More complex equations"]],
      ["Multiplicative Reasoning", "Number", ["Ratios", "Proportion", "Unitary method"]],
      ["Perimeter, Area &amp; Volume", "Geometry", ["Areas of shapes", "Compound shapes", "Surface area &amp; volume"]],
      ["Sequences &amp; Graphs", "Algebra", ["Sequences &amp; nth term", "Coordinates &amp; line segments", "Graphs"]]
    ]
  },
  8: {
    colour: "Green pathway",
    intro: "Ten clear units that build confidence in number, algebra, geometry and data.",
    units: [
      ["Factors &amp; Powers", "Number", ["Prime factor decomposition", "Laws of indices", "Calculating and estimating"]],
      ["Working with Powers", "Algebra", ["Simplifying expressions", "Expanding and factorising", "Substituting and solving"]],
      ["2D Shapes &amp; 3D Solids", "Geometry", ["Plans and elevations", "Surface area and volume", "Circles and Pythagoras"]],
      ["Real-Life Graphs", "Data", ["Distance-time graphs", "Rates of change", "Misleading graphs"]],
      ["Transformations", "Geometry", ["Reflection and translation", "Rotation", "Enlargement"]],
      ["Fractions, Decimals &amp; Percentages", "Number", ["Recurring decimals", "Percentage change", "Repeated change"]],
      ["Construction &amp; Loci", "Geometry", ["Accurate drawings", "Constructions", "Loci"]],
      ["Probability", "Probability", ["Comparing probabilities", "Tree diagrams", "Experimental probability"]],
      ["Scale Drawings &amp; Measures", "Geometry", ["Maps and scales", "Bearings", "Similar shapes"]],
      ["Graphs", "Algebra", ["Plotting linear graphs", "Gradient and y = mx + c", "Non-linear graphs"]]
    ]
  },
  9: {
    colour: "Purple pathway",
    intro: "Ten focused units that consolidate KS3 knowledge and build a confident bridge into GCSE mathematics.",
    units: [
      ["Powers &amp; Roots", "Algebra and number", ["Reciprocals &amp; indices", "Standard form", "Surds"]],
      ["Quadratics", "Algebra", ["Expanding &amp; factorising", "Solving equations", "Sequences"]],
      ["Inequalities &amp; Formulae", "Algebra", ["Inequalities", "Changing the subject", "Algebraic fractions"]],
      ["Collecting &amp; Analysing Data", "Data handling", ["Box plots", "Histograms", "Cumulative frequency"]],
      ["Multiplicative Reasoning", "Number", ["Direct proportion", "Non-linear proportion", "Arcs &amp; sectors"]],
      ["Non-linear Graphs", "Algebra", ["Quadratics", "Cubics", "Reciprocal graphs"]],
      ["Accuracy &amp; Measures", "Number", ["Bounds", "Density &amp; pressure", "Rates of change"]],
      ["Graphical Solutions", "Algebra", ["Simultaneous equations", "y = mx + c", "Inequalities"]],
      ["Trigonometry", "Geometry", ["SOHCAHTOA", "Finding angles", "Problem solving"]],
      ["Proof", "Number", ["Explain and justify", "Modelling", "Proof methods"]]
    ]
  }
};

const gcseTitles = [
  "Number", "Algebra", "Interpreting &amp; Representing Data", "Fractions, Ratio &amp; Percentages",
  "Angles &amp; Trigonometry", "Graphs", "Area &amp; Volume", "Transformations &amp; Constructions",
  "Equations &amp; Inequalities", "Probability", "Compound Measures", "Congruence &amp; Similarity",
  "More Trigonometry", "Further Statistics", "Equations &amp; Graphs", "Circle Theorems",
  "More Algebra", "Vectors &amp; Geometric Proofs", "Proportion &amp; Graphs"
];

const pageHead = ({ title, description, depth = 0 }) => {
  const prefix = depth ? "../" : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${escapeAttr(description)}">
  <link rel="icon" type="image/svg+xml" href="${prefix}assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <script src="${prefix}assets/theme-init.js"></script>
  <link rel="stylesheet" href="${prefix}assets/design-system.css">
  <title>${escapeAttr(title)}</title>
</head>`;
};

const compactTools = (year) => `<div class="tool-list tool-list--single">
  <a class="tool-link tool-link--blue" href="dashboard.html" style="--tool-icon: url('assets/paperclip-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Textbooks</strong><small>Choose a Year ${year} textbook unit</small></span><b aria-hidden="true">→</b></a>
  <a class="tool-link tool-link--purple" href="sparx.html" style="--tool-icon: url('assets/square-root-of-x-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>SPARX</strong><small>Find codes and independent practice</small></span><b aria-hidden="true">→</b></a>
</div>`;

const unitCard = ({ href, number, title, category, topics }) => `          <a class="unit-card" href="${href}"><span class="unit-card__number">${String(number).padStart(2, "0")}</span><span class="unit-card__content"><span class="unit-card__category">${category}</span><h3>${title}</h3><ul>${topics.map((topic) => `<li>${topic}</li>`).join("")}</ul><span class="unit-card__action">Open unit →</span></span></a>`;

const yearHub = (year) => {
  const config = years[year];
  const extras = year === 9 ? `
    <section class="section section--tools deferred-section" aria-labelledby="year9-extras">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow text-stage">Explore further</p><h2 id="year9-extras">Year 9 extras</h2></div><p>Use an interactive activity or look ahead to the GCSE course.</p></div>
        <div class="tool-list">
          <a class="tool-link tool-link--purple" href="year_9/year9_games.html" style="--tool-icon:url('assets/cube-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Interactive activities</strong><small>Practise indices and explore 3D shapes</small></span><b aria-hidden="true">→</b></a>
          <a class="tool-link tool-link--blue" href="year_9/gcse_prep.html" style="--tool-icon:url('assets/compass-math-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>GCSE transition</strong><small>See how Year 9 connects to the GCSE course</small></span><b aria-hidden="true">→</b></a>
        </div>
      </div>
    </section>` : "";
  const cards = config.units.map((unit, index) => unitCard({
    href: `year_${year}/year${year}_unit${String(index + 1).padStart(2, "0")}.html`,
    number: index + 1,
    title: unit[0],
    category: unit[1],
    topics: unit[2]
  })).join("\n");
  return `${pageHead({ title: `Year ${year} Mathematics | SJWMS Maths`, description: `Year ${year} mathematics units, revision resources and assessment preparation.` })}
<body data-root="." data-section="ks3" data-year="${year}">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="intro-panel intro-panel--year">
      <div class="container">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="ks3_hub.html">KS3</a><span aria-hidden="true">/</span><span>Year ${year}</span></nav>
        <div class="intro-panel__grid">
          <div><p class="eyebrow text-stage">Year ${year} · ${config.colour}</p><h1>Choose a unit and start practising.</h1><p class="lead">${config.intro}</p></div>
          <a class="button button--secondary" href="ks3_eoy.html">Year ${year} assessment prep</a>
        </div>
      </div>
    </section>
    <section class="section section--stage-units" aria-labelledby="year${year}-units">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow text-stage">Full-year curriculum</p><h2 id="year${year}-units">Choose a unit</h2></div><p>Each unit opens worksheets, videos, supporting resources and relevant SPARX codes.</p></div>
        <div class="unit-grid">
${cards}
        </div>
      </div>
    </section>
${extras}
    <section class="section deferred-section" aria-labelledby="year${year}-next">
      <div class="container">
        <div class="feature-panel feature-panel--year">
          <div class="feature-panel__copy"><p class="eyebrow text-stage">Assessment preparation</p><h2 id="year${year}-next">Ready to check your understanding?</h2><p>Use the topic checklist and practice papers to identify what to revisit before your end-of-year assessment.</p><div class="button-row"><a class="button button--dark" href="ks3_eoy.html">Start assessment revision</a></div></div>
          <div class="feature-panel__copy feature-panel__split"><p class="eyebrow text-stage">Quick tools</p><h3>Keep your resources together</h3><p>Open the Year ${year} textbook or independent practice.</p>${compactTools(year)}</div>
        </div>
      </div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="assets/site-shell.js" defer></script>
</body>
</html>\n`;
};

const unitPage = ({ stage, year, index, title, topics, count }) => {
  const isGcse = stage === "gcse";
  const padded = String(index).padStart(2, "0");
  const hub = isGcse ? "gcse_hub.html" : `year${year}_hub.html`;
  const hubLabel = isGcse ? "GCSE" : `Year ${year}`;
  const fileBase = isGcse ? "gcse_unit" : `year${year}_unit`;
  const jsonBase = isGcse ? "gcse_unit" : `year${year}_unit`;
  const previous = index > 1
    ? [`${fileBase}${String(index - 1).padStart(2, "0")}.html`, "Previous unit", `${String(index - 1).padStart(2, "0")} · ${isGcse ? gcseTitles[index - 2] : years[year].units[index - 2][0]}`]
    : [`../${hub}`, `Back to ${hubLabel}`, `Explore the full ${hubLabel} curriculum`];
  const next = index < count
    ? [`${fileBase}${String(index + 1).padStart(2, "0")}.html`, "Next unit", `${String(index + 1).padStart(2, "0")} · ${isGcse ? gcseTitles[index] : years[year].units[index][0]}`]
    : [`../${hub}`, `Back to ${hubLabel}`, `Choose another ${hubLabel} unit`];
  const topicMarkup = topics.length ? `<div class="topic-list" aria-label="Unit topics">${topics.map((topic) => `<span class="topic-chip">${escapeAttr(topic)}</span>`).join("")}</div>` : "";
  const bodyTheme = isGcse ? 'data-stage="gcse"' : `data-year="${year}"`;
  const section = isGcse ? "gcse" : "ks3";
  const crumbs = isGcse
    ? `<a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../gcse_hub.html">GCSE</a><span aria-hidden="true">/</span><span>Unit ${index}</span>`
    : `<a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../ks3_hub.html">KS3</a><span aria-hidden="true">/</span><a href="../${hub}">${hubLabel}</a><span aria-hidden="true">/</span><span>Unit ${index}</span>`;
  return `${pageHead({ title: `${cleanText(title)} | ${hubLabel} Mathematics`, description: `${hubLabel} ${cleanText(title)} revision resources, videos, worksheets and SPARX codes.`, depth: 1 })}
<body data-root=".." data-section="${section}" ${bodyTheme} data-json="../assets/data/${jsonBase}${padded}.json">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="section--tight"><div class="container"><nav class="breadcrumbs" aria-label="Breadcrumb">${crumbs}</nav></div></section>
    <section class="section--tight section--flush-top">
      <div class="container">
        <div class="stage-band">
          <p class="eyebrow">${hubLabel} · Unit ${padded}</p>
          <h1>${title}</h1>
          <p class="lead">Use this page to find worksheets, videos and focused practice links for the unit as they are added.</p>
          <nav class="anchor-nav" aria-label="Jump to resources"><a href="#worksheets" data-resource-anchor="worksheets">Worksheets</a><a href="#videos" data-resource-anchor="videos">Videos</a><a href="#other" data-resource-anchor="other">Other resources</a><a href="#sparx-section" data-resource-anchor="sparx">SPARX codes</a></nav>
${topicMarkup ? `          ${topicMarkup}` : ""}
        </div>
      </div>
    </section>
    <section class="section deferred-section" aria-labelledby="unit-resources">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow text-stage">Revise in your own order</p><h2 id="unit-resources">Unit resources</h2></div><p>Start with a worksheet, use a video when you need an explanation, then practise independently.</p></div>
        <div class="resource-layout">
          <div class="resource-stack">
            <section class="resource-group" id="worksheets" data-resource-group="worksheets"><div class="resource-group__heading"><h2>Worksheets</h2></div><div class="resource-grid" id="grid-worksheets"></div></section>
            <section class="resource-group" id="other" data-resource-group="other"><div class="resource-group__heading"><h2>Other resources</h2></div><div class="resource-grid" id="grid-other"></div></section>
          </div>
          <aside class="resource-stack">
            <section class="resource-group" id="videos" data-resource-group="videos"><div class="resource-group__heading"><h2>Videos</h2></div><div class="resource-grid resource-grid--single" id="grid-videos"></div></section>
            <section class="sparx-panel" id="sparx-section"><div class="sparx-panel__top"><div><h2>SPARX quick revision</h2><p>Use these codes for focused independent practice.</p></div><a class="button button--dark" href="https://selectschool.sparx-learning.com/" target="_blank" rel="noopener">Open SPARX ↗</a></div><div class="sparx-codes" id="sparx-code-list"></div></section>
          </aside>
        </div>
        <p class="notice" id="resource-empty" hidden><strong>No resources are available yet.</strong> Return to the ${hubLabel} hub or try this unit again later.</p>
      </div>
    </section>
    <section class="section deferred-section" aria-labelledby="keep-going">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">Keep moving</p><h2 id="keep-going">Choose your next step</h2></div></div>
        <div class="card-grid card-grid--two">
          <a class="card" href="${previous[0]}"><span class="card__meta">${previous[1]}</span><h3>${previous[2]}</h3><p>Move back and review an earlier part of the course.</p><span class="card__action">Open</span></a>
          <a class="card" href="${next[0]}"><span class="card__meta">${next[1]}</span><h3>${next[2]}</h3><p>Continue through the course when you are ready.</p><span class="card__action">Open</span></a>
        </div>
      </div>
    </section>
  </main>
  <div id="site-footer"></div>
  <script src="../assets/site-shell.js" defer></script>
  <script src="../assets/prototype-unit.js" defer></script>
</body>
</html>\n`;
};

const readUnitMetadata = async (stage, year, count) => {
  const directory = stage === "gcse" ? "gcse" : `year_${year}`;
  const prefix = stage === "gcse" ? "gcse_unit" : `year${year}_unit`;
  const titles = stage === "gcse" ? gcseTitles : years[year].units.map((unit) => unit[0]);
  const metadata = [];
  for (let index = 1; index <= count; index += 1) {
    const filename = `${prefix}${String(index).padStart(2, "0")}.html`;
    const source = await readFile(path.join(root, directory, filename), "utf8");
    metadata.push({ stage, year, index, count, title: titles[index - 1], topics: extractTopics(source) });
  }
  return metadata;
};

for (const year of [7, 9]) {
  await writeFile(path.join(root, `year${year}_hub.html`), yearHub(year));
}

const unitGroups = [
  await readUnitMetadata("ks3", 7, 10),
  await readUnitMetadata("ks3", 8, 10),
  await readUnitMetadata("ks3", 9, 10),
  await readUnitMetadata("gcse", null, 19)
];

for (const group of unitGroups) {
  for (const metadata of group) {
    const directory = metadata.stage === "gcse" ? "gcse" : `year_${metadata.year}`;
    const prefix = metadata.stage === "gcse" ? "gcse_unit" : `year${metadata.year}_unit`;
    await writeFile(path.join(root, directory, `${prefix}${String(metadata.index).padStart(2, "0")}.html`), unitPage(metadata));
  }
}

console.log("Year hubs and 49 unit pages now use the shared visual system.");
