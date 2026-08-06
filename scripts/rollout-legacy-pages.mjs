import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("Revision Hub V3");

const legacyPages = [
  "alevel/y12_pure_01.html",
  "explore.html",
  "gcse/unit.html",
  "gcse_topics.html",
  "image_info.html",
  "lessons/indices_overview.html",
  "test.html"
];

const experiencePages = [
  "games/Cube_Manipulation.html",
  "games/bounds_quiz.html",
  "games/elimination_agent.html",
  "games/game_template.html",
  "games/learn_surds.html",
  "games/surd-o.html",
  "games/trig_identify.html",
  "games/year9_indices_quiz.html",
  "gridgraph.html",
  "pi_event.html",
  "year_9/year9_surds_game.html"
];

const withBodyClass = (source, names, rootPath, section) => source.replace(/<body([^>]*)>/i, (whole, attributes) => {
  let next = attributes;
  const classMatch = next.match(/\sclass=(['"])(.*?)\1/i);
  if (classMatch) {
    const classes = new Set(classMatch[2].split(/\s+/).filter(Boolean));
    names.forEach((name) => classes.add(name));
    next = next.replace(classMatch[0], ` class=${classMatch[1]}${[...classes].join(" ")}${classMatch[1]}`);
  } else {
    next += ` class="${names.join(" ")}"`;
  }
  if (!/\sdata-root=/i.test(next)) next += ` data-root="${rootPath}"`;
  if (!/\sdata-section=/i.test(next)) next += ` data-section="${section}"`;
  return `<body${next}>`;
});

const injectHead = (source, prefix) => {
  const additions = [];
  if (!source.includes("assets/theme-init.js")) additions.push(`  <script src="${prefix}assets/theme-init.js"></script>`);
  if (!source.includes("assets/design-system.css")) additions.push(`  <link rel="stylesheet" href="${prefix}assets/design-system.css">`);
  if (!source.includes("assets/foundation.css")) additions.push(`  <link rel="stylesheet" href="${prefix}assets/foundation.css">`);
  if (!source.includes("assets/legacy-theme.css")) additions.push(`  <link rel="stylesheet" href="${prefix}assets/legacy-theme.css">`);
  if (!/DM\+Sans/i.test(source)) additions.push('  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">');
  return additions.length ? source.replace(/<\/head>/i, `${additions.join("\n")}\n</head>`) : source;
};

const removeOldSidebar = (source) => source
  .replace(/\s*<div\s+id=(['"])sidebar\1[^>]*>\s*<\/div>/gi, "")
  .replace(/\s*<script[^>]+src=(['"])[^'"]*sidebar-loader\.js\1[^>]*>\s*<\/script>/gi, "");

const ensureMainTarget = (source) => {
  if (source.includes('id="main-content"') || source.includes("id='main-content'")) return source;
  if (/<main\b/i.test(source)) return source.replace(/<main\b(?![^>]*\bid=)/i, '<main id="main-content"');
  return source.replace(/(<div class="experience-ribbon"[\s\S]*?<\/div>\s*<\/div>)/i, '$1\n  <span id="main-content" tabindex="-1"></span>');
};

const migrate = async (relative, kind) => {
  const filename = path.join(root, relative);
  const depth = relative.split("/").length - 1;
  const prefix = depth ? "../".repeat(depth) : "";
  let source = await readFile(filename, "utf8");
  source = injectHead(source, prefix);
  source = withBodyClass(source, ["design-v3", kind === "experience" ? "experience-v3" : "legacy-v3"], depth ? ".." : ".", relative.includes("gcse") ? "gcse" : relative.includes("alevel") ? "alevel" : "ks3");
  source = removeOldSidebar(source);
  source = source.replace(/id=(['"])footer-slot\1/gi, 'id="site-footer"');
  source = source.replace(/\s*<script[^>]+src=(['"])[^'"]*footer-loader\.js\1[^>]*>\s*<\/script>/gi, "");
  if (!source.includes('id="site-header"') && !source.includes("id='site-header'")) {
    source = source.replace(/(<body[^>]*>)/i, `$1\n  <div id="site-header"></div>`);
  }
  const ribbon = `  <div class="experience-ribbon"><div class="experience-ribbon__inner"><span><strong>${kind === "experience" ? "Interactive mathematics" : "SJWMS Maths resource"}</strong> · Part of the shared learning library</span><a href="${prefix}index.html">Return to the hub →</a></div></div>`;
  if (!source.includes("experience-ribbon")) source = source.replace(/(<div id=(['"])site-header\2><\/div>)/i, `$1\n${ribbon}`);
  source = ensureMainTarget(source);
  if (!source.includes('id="site-footer"') && !source.includes("id='site-footer'")) {
    source = source.replace(/<\/body>/i, `  <div id="site-footer"></div>\n</body>`);
  }
  if (!source.includes("assets/site-shell.js")) {
    source = source.replace(/<\/body>/i, `  <script src="${prefix}assets/site-shell.js" defer></script>\n</body>`);
  }
  if (relative === "gridgraph.html" && !source.includes('class="gridgraph-app"')) {
    source = source.replace(/(<span id="main-content"[^>]*><\/span>)/i, '$1\n  <div class="gridgraph-app">');
    source = source.replace(/(\s*<div id="site-footer"><\/div>)/i, '\n  </div>$1');
  }
  await writeFile(filename, source);
};

for (const page of legacyPages) await migrate(page, "legacy");
for (const page of experiencePages) await migrate(page, "experience");

console.log(`${legacyPages.length + experiencePages.length} legacy and interactive pages now use the shared site shell.`);
