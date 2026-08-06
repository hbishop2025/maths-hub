import { writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("Revision Hub V3");
const head = (title, description) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="${description}">
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&amp;display=swap" rel="stylesheet">
  <script src="assets/theme-init.js"></script>
  <link rel="stylesheet" href="assets/design-system.css">
  <link rel="stylesheet" href="assets/foundation.css">
  <title>${title}</title>
</head>`;
const shellEnd = `  <div id="site-footer"></div>
  <script src="assets/site-shell.js" defer></script>
</body>
</html>\n`;
const subHead = (title, description) => head(title, description)
  .replaceAll('href="assets/', 'href="../assets/')
  .replaceAll('src="assets/', 'src="../assets/');

const gcseTitles = ["Number", "Algebra", "Interpreting &amp; Representing Data", "Fractions, Ratio &amp; Percentages", "Angles &amp; Trigonometry", "Graphs", "Area &amp; Volume", "Transformations &amp; Constructions", "Equations &amp; Inequalities", "Probability", "Compound Measures", "Congruence &amp; Similarity", "More Trigonometry", "Further Statistics", "Equations &amp; Graphs", "Circle Theorems", "More Algebra", "Vectors &amp; Geometric Proofs", "Proportion &amp; Graphs"];
const gcseTopics = [
  ["Number problems", "Indices", "Standard form"], ["Expressions", "Equations", "Sequences"], ["Statistical diagrams", "Scatter graphs", "Averages"],
  ["Fractions", "Ratio", "Percentages"], ["Angle properties", "Pythagoras", "Trigonometry"], ["Linear graphs", "Rates of change", "Non-linear graphs"],
  ["Perimeter and area", "Prisms", "Circles"], ["Transformations", "Constructions", "Loci"], ["Inequalities", "Quadratics", "Simultaneous equations"],
  ["Combined events", "Tree diagrams", "Venn diagrams"], ["Rates", "Density", "Pressure"], ["Congruence", "Similarity", "Scale factors"],
  ["Sine rule", "Cosine rule", "Trigonometric graphs"], ["Sampling", "Histograms", "Cumulative frequency"], ["Functions", "Iterations", "Graphical solutions"],
  ["Circle properties", "Tangents", "Proof"], ["Algebraic fractions", "Surds", "Proof"], ["Vectors", "Geometric proof", "Ratio"], ["Proportion", "Growth and decay", "Graphs"]
];
const gcseGroups = [
  ["Number &amp; proportional reasoning", "Core number skills, ratio and measures", [1, 4, 11, 19]],
  ["Algebra &amp; graphs", "Expressions, equations, sequences and graphical methods", [2, 6, 9, 15, 17]],
  ["Geometry &amp; trigonometry", "Shape, space, constructions, proof and vectors", [5, 7, 8, 12, 13, 16, 18]],
  ["Statistics &amp; probability", "Representing data, chance and statistical reasoning", [3, 10, 14]]
];
const gcseGroupIds = ["gcse-number", "gcse-algebra", "gcse-geometry", "gcse-statistics"];
const gcseGroupMarkup = gcseGroups.map(([title, description, units], groupIndex) => `          <details class="gcse-group" id="${gcseGroupIds[groupIndex]}"${groupIndex === 0 ? " open" : ""}>
            <summary><span><strong>${title}</strong><small>${description}</small></span><span class="gcse-group__count">${units.length} units</span></summary>
            <div class="gcse-unit-list">
${units.map((unit) => {
  const index = unit - 1;
  const number = String(unit).padStart(2, "0");
  return `              <a class="gcse-unit-link" href="gcse/gcse_unit${number}.html"><span class="gcse-unit-link__number">${number}</span><span><strong>${gcseTitles[index]}</strong><span class="gcse-unit-link__topics">${gcseTopics[index].join(" · ")}</span></span><b aria-hidden="true">→</b></a>`;
}).join("\n")}
            </div>
          </details>`).join("\n");

const gcseHub = `${head("GCSE Mathematics | SJWMS Maths", "GCSE mathematics units, revision resources, past papers and extension opportunities.")}
<body class="design-v3" data-root="." data-section="gcse" data-stage="gcse">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--gcse">
      <div class="container edu-page-hero__inner">
        <div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>GCSE</span></nav><p class="eyebrow">KS4 · Years 10 and 11</p><h1>Revise with purpose.</h1><p class="lead">Work through the Edexcel course by topic, then bring the ideas together with exam practice.</p><nav class="edu-quick-links" aria-label="GCSE quick links"><a href="#gcse-number" data-open-details="gcse-number">Number</a><a href="#gcse-algebra" data-open-details="gcse-algebra">Algebra</a><a href="#gcse-geometry" data-open-details="gcse-geometry">Geometry</a><a href="#gcse-statistics" data-open-details="gcse-statistics">Statistics</a><a href="https://www.mathsgenie.co.uk/papers.php" target="_blank" rel="noopener">Past papers ↗</a></nav></div>
        <div class="stage-collage stage-collage--gcse" aria-hidden="true"><div class="stage-collage__main"><span>GCSE</span><strong>19 units</strong><small>Edexcel Mathematics</small></div><div class="stage-collage__chart"><small>Exam accuracy</small><div><i></i><i></i><i></i><i></i><i></i></div><strong>78%</strong></div><div class="stage-collage__exam">Exam practice<strong>✓</strong></div><span class="stage-collage__formula">y = mx + c</span><i></i></div>
      </div>
    </section>
    <div class="container learning-steps" aria-label="A purposeful GCSE revision cycle"><div><span>01</span><strong>Learn</strong><small>Revisit a clear explanation.</small></div><div><span>02</span><strong>Practise</strong><small>Build accuracy with focused work.</small></div><div><span>03</span><strong>Check</strong><small>Mark and correct your errors.</small></div><div><span>04</span><strong>Extend</strong><small>Apply the topic in exam questions.</small></div></div>
    <section class="section section--stage-units" aria-labelledby="gcse-units">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">Edexcel Mathematics</p><h2 id="gcse-units">Choose a topic group</h2></div><p>Four expandable groups keep all 19 units available without presenting one long page of options.</p></div>
        <div class="gcse-groups">
${gcseGroupMarkup}
        </div>
      </div>
    </section>
    <section class="section section--soft deferred-section" aria-labelledby="gcse-tools">
      <div class="container">
        <div class="section-heading"><div><p class="eyebrow">Exam preparation</p><h2 id="gcse-tools">Useful GCSE tools</h2></div><p>Trusted sources for papers, formulae and additional practice.</p></div>
        <div class="tool-card-grid">
          <a class="tool-card tool-card--violet" href="https://www.mathsgenie.co.uk/papers.php" target="_blank" rel="noopener"><span class="tool-card__icon" data-symbol="≡" aria-hidden="true"></span><span><strong>Past papers</strong><small>MathsGenie examination archive</small></span><b aria-hidden="true">↗</b></a>
          <a class="tool-card tool-card--yellow" href="https://drive.google.com/file/d/1oxMQu9HU_TeWDvT2laMWbfNKZt5_o_bw/view?usp=sharing" target="_blank" rel="noopener"><span class="tool-card__icon" data-symbol="ƒ" aria-hidden="true"></span><span><strong>Formula sheet</strong><small>Open the official reference PDF</small></span><b aria-hidden="true">↗</b></a>
          <a class="tool-card tool-card--mint" href="https://www.ukmt.org.uk/competitions/solo/intermediate-mathematical-challenge/archive" target="_blank" rel="noopener"><span class="tool-card__icon" data-symbol="✦" aria-hidden="true"></span><span><strong>UKMT challenge</strong><small>Intermediate problem solving</small></span><b aria-hidden="true">↗</b></a>
          <a class="tool-card tool-card--coral" href="https://www.drfrost.org/" target="_blank" rel="noopener"><span class="tool-card__icon" data-symbol="√x" aria-hidden="true"></span><span><strong>Dr Frost Maths</strong><small>Independent practice and revision</small></span><b aria-hidden="true">↗</b></a>
        </div>
        <p class="teacher-note"><span aria-hidden="true">◆</span><span><strong>Teacher-curated pathways.</strong> The hub points students towards trusted resources but does not ask for an account, record activity or store personal progress.</span></p>
        <p class="notice" style="margin-top:1rem"><strong>AQA Further Maths:</strong> dedicated unit links will appear here when the resources are ready.</p>
      </div>
    </section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const sparx = `${head("SPARX Setup and Guidance | SJWMS Maths", "How to access SPARX, complete homework correctly and use the supporting video guides.")}
<body class="design-v3" data-root=".">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--sparx"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>SPARX</span></nav><p class="eyebrow">Online homework</p><h1>Get set up for SPARX.</h1><p class="lead">How to log in, complete homework properly and avoid the common mistakes that make future work harder.</p><div class="button-row"><a class="button button--primary" href="https://selectschool.sparx-learning.com/" target="_blank" rel="noopener">Launch SPARX ↗</a><a class="button button--ghost" href="#overview">Read the guide</a></div></div><div class="support-collage support-collage--sparx" aria-hidden="true"><div class="support-collage__main"><span>√x</span><strong>Weekly homework</strong><small>Practise · show working · check</small></div><div class="support-collage__note"><b>W</b><span>Wednesday to Wednesday</span></div><div class="support-collage__chip">Orange book ready</div><i>✓</i></div></div></section>
    <section class="section"><div class="container docs-layout">
      <nav class="section-nav" data-section-nav aria-label="On this page"><strong>On this page</strong><a class="is-active" href="#overview">Overview</a><a href="#cycle">Homework cycle</a><a href="#orange">Orange book</a><a href="#videos">Video guides</a><a href="#anti-cheat">AI and homework</a><a href="#launch">Launch SPARX</a></nav>
      <div class="article-stack">
        <section class="content-section" id="overview"><p class="eyebrow">Overview</p><h2>What SPARX is for</h2><p>SPARX is one of the SJWMS Mathematics Department’s homework platforms. Each week you complete a personalised set of questions designed to build progress through consistent practice—not rushing or guessing.</p></section>
        <section class="content-section" id="cycle"><p class="eyebrow">Schedule</p><h2>Homework cycle</h2><p>SPARX normally runs from <strong>Wednesday to Wednesday</strong>, unless your teacher states otherwise. Complete all work before the deadline.</p></section>
        <section class="content-section" id="orange"><p class="eyebrow">Bookwork protocol</p><h2>Orange book requirements</h2><p>Every SPARX question must be supported with written working in your orange book.</p><ul class="guidance-list"><li>Write the bookwork code.</li><li>Show your full working clearly.</li><li>Write the final answer neatly.</li></ul></section>
        <section class="content-section" id="videos"><p class="eyebrow">Support</p><h2>Video guides</h2><div class="video-grid"><div class="video-frame"><iframe src="https://www.youtube.com/embed/a92XCC0MeM0" title="SPARX setup video guide" loading="lazy" allowfullscreen></iframe></div><div class="video-frame"><iframe src="https://www.youtube.com/embed/IQUMypfwHnU" title="SPARX homework video guide" loading="lazy" allowfullscreen></iframe></div></div></section>
        <section class="content-section" id="anti-cheat"><p class="eyebrow">Important</p><h2>AI and homework</h2><p>Using AI solvers to complete SPARX may make the system think you are more advanced than you are. Future homework can then become significantly harder.</p><div class="callout callout--warning"><strong>Attempt every question yourself first.</strong> Use AI as a study aid, not an answer generator.</div><div class="button-row"><a class="button button--secondary" href="ai_usage.html">Read the AI guidance</a></div></section>
        <section class="content-section" id="launch"><p class="eyebrow">Access</p><h2>Ready to begin?</h2><p>Open SPARX, choose SJWMS and sign in using the account details provided by school.</p><div class="button-row"><a class="button button--primary" href="https://selectschool.sparx-learning.com/" target="_blank" rel="noopener">Launch SPARX ↗</a></div></section>
      </div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const aiUsage = `${head("AI Usage in Mathematics | SJWMS Maths", "Guidance for using AI responsibly to learn mathematics, practise methods and check reasoning.")}
<body class="design-v3" data-root=".">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--ai"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>AI guidance</span></nav><p class="eyebrow">Responsible learning</p><h1>Use AI to support your thinking.</h1><p class="lead">Use it to understand methods, practise and check your reasoning—never to replace your own working.</p><div class="button-row"><a class="button button--primary" href="#overview">Read the guidance <span aria-hidden="true">↓</span></a></div></div><div class="support-collage support-collage--ai" aria-hidden="true"><div class="support-collage__main"><span>✦</span><strong>Ask · Check · Understand</strong><small>Keep the mathematics yours</small></div><div class="support-collage__note"><b>01</b><span>Try it yourself first</span></div><div class="support-collage__chip">Verify every step</div><i>?</i></div></div></section>
    <section class="section"><div class="container docs-layout">
      <nav class="section-nav" data-section-nav aria-label="On this page"><strong>On this page</strong><a class="is-active" href="#overview">Good AI use</a><a href="#approved">Approved tools</a><a href="#dos">Do and avoid</a><a href="#hallucinations">Check accuracy</a><a href="#ai-on-site">AI on this site</a></nav>
      <div class="article-stack">
        <section class="content-section" id="overview"><p class="eyebrow">Overview</p><h2>What good AI use looks like</h2><p>AI should help you understand the method. You should still be able to explain every step yourself.</p><div class="content-grid"><div class="content-card"><h3>Explain steps</h3><p>Ask for a hint first, then request the complete method only after attempting the question.</p></div><div class="content-card"><h3>Build practice</h3><p>Generate questions at your level and ask for feedback on your working.</p></div><div class="content-card"><h3>Find mistakes</h3><p>Share your attempt and ask for the first incorrect step and why it is wrong.</p></div></div></section>
        <section class="content-section" id="approved"><p class="eyebrow">School approved</p><h2>Tools you can use</h2><p>Use these responsibly. Ask your teacher before using AI for assessed work.</p><div class="tool-list"><a class="tool-link tool-link--blue" href="https://gemini.google.com" target="_blank" rel="noopener" style="--tool-icon:url('assets/cube-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Google Gemini</strong><small>Explanations, checking and practice</small></span><b aria-hidden="true">↗</b></a><a class="tool-link tool-link--purple" href="https://notebooklm.google.com" target="_blank" rel="noopener" style="--tool-icon:url('assets/paperclip-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>NotebookLM</strong><small>Study from your own revision materials</small></span><b aria-hidden="true">↗</b></a><a class="tool-link tool-link--orange" href="https://www.canva.com" target="_blank" rel="noopener" style="--tool-icon:url('assets/pen-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Canva AI</strong><small>Create revision posters and diagrams</small></span><b aria-hidden="true">↗</b></a></div></section>
        <section class="content-section" id="dos"><p class="eyebrow">Guidance</p><h2>Use AI as a study partner, not a shortcut</h2><div class="content-grid content-grid--two"><div class="content-card"><h3>Do</h3><ul class="guidance-list"><li>Ask for hints before full solutions.</li><li>Ask it to identify your first mistake.</li><li>Generate practice at your year or exam level.</li><li>Verify answers with notes or another method.</li></ul></div><div class="content-card"><h3>Avoid</h3><ul class="guidance-list guidance-list--avoid"><li>Copying answers without understanding.</li><li>Using AI for assessed work without permission.</li><li>Trusting formulas or facts blindly.</li><li>Sharing personal data or school logins.</li></ul></div></div><div class="callout"><strong>Useful prompt:</strong> “I’m in Year 9. Identify the first mistake in my working, explain why, then give me one hint. Do not give the final answer until I ask.”</div></section>
        <section class="content-section" id="hallucinations"><p class="eyebrow">Reliability</p><h2>Confident answers can still be wrong</h2><p>AI can invent steps, definitions or results that look convincing. Verification is part of learning mathematics.</p><div class="content-grid"><div class="content-card"><h3>Use another method</h3><p>Substitute back in, estimate or solve a simpler version.</p></div><div class="content-card"><h3>Compare with notes</h3><p>Ask for the method used in class if the approach is unfamiliar.</p></div><div class="content-card"><h3>Inspect each step</h3><p>One incorrect step can invalidate the entire solution.</p></div></div></section>
        <section class="content-section" id="ai-on-site"><p class="eyebrow">Transparency</p><h2>AI on this website</h2><div class="content-grid"><div class="content-card"><h3>No on-page AI</h3><p>The site has no chatbot and does not use AI to read what you type.</p></div><div class="content-card"><h3>Reviewed resources</h3><p>AI may have helped draft some material, which was then reviewed and edited by staff.</p></div><div class="content-card"><h3>Supported development</h3><p>AI assisted with code and layout work; final decisions remain human-made.</p></div></div><div class="callout"><strong>Privacy:</strong> treat external AI tools as public services. Never share personal data or school logins.</div></section>
      </div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const eoy = `${head("KS3 End-of-Year Revision | SJWMS Maths", "Year 7, Year 8 and Year 9 assessment resources and exam preparation guidance.")}
<body class="design-v3" data-root="." data-section="ks3" data-year="7">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--assessment"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><a href="ks3_hub.html">KS3</a><span aria-hidden="true">/</span><span>Assessment revision</span></nav><p class="eyebrow">KS3 assessment preparation</p><h1>Prepare one topic at a time.</h1><p class="lead">Choose your year, open the revision resources and target the topics that need more practice.</p><div class="button-row"><a class="button button--ghost" href="ks3_hub.html">Back to KS3</a></div></div><div class="support-collage support-collage--assessment" aria-hidden="true"><div class="support-collage__main"><span>✓</span><strong>Plan · practise · check</strong><small>Years 7, 8 and 9</small></div><div class="support-collage__note"><b>3</b><span>Year groups</span></div><div class="support-collage__chip">Revision checklists</div><i>∑</i></div></div></section>
    <section class="section"><div class="container workspace-layout" id="revision-workspace">
      <aside class="workspace-sidebar"><div class="selector-card"><h2>Choose a year</h2><div class="year-choices"><button class="year-choice year-choice--7" type="button" data-revision-year="y7" aria-pressed="true"><span><strong>Year 7</strong><small>Foundation curriculum</small></span><b>→</b></button><button class="year-choice year-choice--8" type="button" data-revision-year="y8" aria-pressed="false"><span><strong>Year 8</strong><small>Developing curriculum</small></span><b>→</b></button><button class="year-choice year-choice--9" type="button" data-revision-year="y9" aria-pressed="false"><span><strong>Year 9</strong><small>GCSE preparation</small></span><b>→</b></button></div></div><div class="selector-card"><h3>Exam reminders</h3><ul class="guidance-list"><li>Show every stage of your method.</li><li>Read the whole question carefully.</li><li>Bring a ruler, pencil and scientific calculator.</li><li>Move on and return if you get stuck.</li><li>Attempt every question.</li></ul></div></aside>
      <div><div class="section-heading"><div><p class="eyebrow text-stage">Your revision library</p><h2 id="revision-heading">Year 7 revision resources</h2></div><p>Start with mixed practice, then target individual knowledge gaps.</p></div><div class="resource-grid resource-grid--three" id="revision-grid"></div><p class="notice" id="revision-empty" hidden>No resources are listed for this year yet.</p></div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const dashboard = `${head("Digital Textbooks | SJWMS Maths", "Choose a KS3 year and textbook unit. PDF textbook links will be added when available.")}
<body class="design-v3" data-root="." data-section="ks3" data-year="7">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--textbooks"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Textbooks</span></nav><p class="eyebrow">KS3 digital textbooks</p><h1>Your textbook, without the searching.</h1><p class="lead">Choose Year 7, 8 or 9 and jump directly to the unit being taught.</p><div class="trust-list"><span>Three year groups</span><span>Ten units each</span><span>No site login</span></div></div><div class="textbook-collage" aria-hidden="true"><div class="textbook-collage__mascot"><img src="assets/dino-mascot-geometric.webp" alt="" width="512" height="512"></div><div class="textbook-collage__card"><span>KS3</span><strong>Textbook finder</strong></div><div class="textbook-collage__years"><i>7</i><i>8</i><i>9</i></div><b>√x</b></div></div></section>
    <section class="section section--textbooks"><div class="container textbook-workspace">
      <div class="textbook-toolbar"><div><p class="eyebrow">Textbook finder</p><h2>Choose your year</h2><p>The unit list updates straight away.</p></div><div class="textbook-year-tabs" role="group" aria-label="Choose a textbook year"><button class="textbook-year-tab textbook-year-tab--7" type="button" data-textbook-year="7" aria-pressed="true">Year 7</button><button class="textbook-year-tab textbook-year-tab--8" type="button" data-textbook-year="8" aria-pressed="false">Year 8</button><button class="textbook-year-tab textbook-year-tab--9" type="button" data-textbook-year="9" aria-pressed="false">Year 9</button></div></div>
      <div class="textbook-access"><span aria-hidden="true">●</span><p><strong>External school access may be required.</strong> This website never asks for or stores login details. Textbook links will open the provider separately when the PDFs are ready.</p></div>
      <div class="textbook-unit-panel" aria-live="polite"><div class="textbook-unit-panel__heading"><h2 id="textbook-unit-heading">Year 7 textbook units</h2><span>10 units</span></div><div class="unit-option-grid" id="textbook-unit-list"></div></div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const policy = `${head("Privacy and Site Policy | SJWMS Maths", "How the SJWMS Maths site handles privacy, external links and acceptable educational use.")}
<body class="design-v3" data-root=".">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--policy"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>Policy</span></nav><p class="eyebrow">Privacy and acceptable use</p><h1>A clear policy, without the small print.</h1><p class="lead">What this site does, what happens when you follow an external link and how its learning resources may be used.</p><div class="trust-list"><span>No accounts</span><span>No student data</span><span>No tracking</span></div></div><div class="support-collage support-collage--policy" aria-hidden="true"><div class="support-collage__main"><span>✓</span><strong>Privacy by design</strong><small>Simple · transparent · student-safe</small></div><div class="support-collage__note"><b>0</b><span>Student profiles stored</span></div><div class="support-collage__chip">School-approved approach</div><i>i</i></div></div></section>
    <section class="section"><div class="container docs-layout">
      <nav class="section-nav" data-section-nav aria-label="On this page"><strong>On this page</strong><a class="is-active" href="#commitment">Our commitment</a><a href="#accounts">Accounts and access</a><a href="#terms">Acceptable use</a><a href="#external">External links</a><a href="#questions">Questions</a></nav>
      <div class="article-stack">
        <section class="content-section" id="commitment"><p class="eyebrow">Our commitment</p><h2>Privacy by design</h2><p>SJWMS Maths is a static revision and learning library. It has no student accounts and does not collect or store student names, answers, scores, progress or other personal information. It does not include advertising or behavioural tracking.</p><ul class="guidance-list"><li>Every core revision page can be browsed without creating a site account.</li><li>Interactive activities keep answers and scores only while the page is open.</li><li>An anonymous theme preference and copies of public resource lists may be saved on the device to improve display and loading; neither contains student information.</li><li>Resources are selected and linked by teaching staff.</li><li>The site never asks for passwords or school credentials.</li></ul></section>
        <section class="content-section" id="accounts"><p class="eyebrow">Accounts and access</p><h2>Some external services require a school login</h2><p>Textbooks, SPARX, Google Drive and other third-party services may ask you to sign in. Those accounts belong to the external service or the school—not this website.</p><div class="callout"><strong>Never enter a password directly into an SJWMS Maths page.</strong> Check that any sign-in page belongs to the expected provider.</div></section>
        <section class="content-section" id="terms"><p class="eyebrow">Acceptable use</p><h2>Educational use</h2><p>By using the site, you agree to use its pages and links for personal, non-commercial education.</p><ul class="guidance-list"><li>Do not copy, scrape or redistribute the site’s structure without permission.</li><li>Respect the copyright and terms of each linked resource.</li><li>Use school-provided services in line with the school’s acceptable-use rules.</li></ul></section>
        <section class="content-section" id="external"><p class="eyebrow">External links</p><h2>Other websites have their own policies</h2><p>The site links to services such as YouTube, revision platforms, exam resources and cloud documents. SJWMS Maths does not control their availability, content or privacy practices. Review the destination before providing any information.</p></section>
        <section class="content-section" id="questions"><p class="eyebrow">Questions</p><h2>Speak to the site administrator</h2><p>If a link looks wrong, a resource should be removed or you have a question about how the site works, contact the SJWMS Maths website administrator through school.</p></section>
      </div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const alevelHub = `${head("A-Level Mathematics | SJWMS Maths", "Year 12 and Year 13 pure mathematics, statistics, mechanics and examination resources.")}
<body class="design-v3" data-root="." data-section="alevel" data-stage="alevel">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--alevel"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="index.html">Home</a><span aria-hidden="true">/</span><span>A-level</span></nav><p class="eyebrow">KS5 · Years 12 and 13</p><h1>Choose your A-level strand.</h1><p class="lead">Open the moderated Pure, Statistics and Mechanics resources for your course.</p><nav class="edu-quick-links" aria-label="A-level quick links"><a href="#alevel-workspace" data-alevel-quick="y12-pure">Y12 Pure</a><a href="#alevel-workspace" data-alevel-quick="y13-pure">Y13 Pure</a><a href="#alevel-workspace" data-alevel-quick="stats">Statistics</a><a href="#alevel-workspace" data-alevel-quick="mech">Mechanics</a><a href="#alevel-workspace" data-alevel-quick="papers">Exam papers</a></nav></div><div class="stage-collage stage-collage--alevel" aria-hidden="true"><div class="stage-collage__main"><span>A</span><strong>Pure · Statistics · Mechanics</strong><small>Years 12 and 13</small></div><div class="stage-collage__chart"><small>Course strands</small><div><i></i><i></i><i></i><i></i><i></i></div><strong>KS5</strong></div><div class="stage-collage__exam">Exam practice<strong>∫</strong></div><span class="stage-collage__formula">f′(x)</span><i></i></div></div></section>
    <section class="section section--stage-units" id="alevel-workspace"><div class="container workspace-layout">
      <aside class="workspace-sidebar"><div class="selector-card"><p class="eyebrow text-stage">Course selector</p><h2>Choose a strand</h2><div class="year-choices" id="alevel-track-buttons"><p class="notice">Loading course strands…</p></div></div><div class="selector-card"><h3>KS5 quick links</h3><div class="tool-list tool-list--single"><a class="tool-link tool-link--blue" href="https://sites.google.com/sjwms.org.uk/mathsatthemath/exam-revision" target="_blank" rel="noopener" style="--tool-icon:url('assets/pen-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Exam revision</strong><small>Moderated papers and guidance</small></span><b aria-hidden="true">↗</b></a><a class="tool-link tool-link--purple" href="https://sites.google.com/sjwms.org.uk/mathsatthemath/papers/a-questions" target="_blank" rel="noopener" style="--tool-icon:url('assets/square-root-of-x-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>A* questions</strong><small>Stretch and challenge problems</small></span><b aria-hidden="true">↗</b></a><a class="tool-link tool-link--orange" href="https://ukmt.org.uk" target="_blank" rel="noopener" style="--tool-icon:url('assets/compass-math-svgrepo-com.svg')"><span class="tool-link__icon" aria-hidden="true"></span><span><strong>Senior Maths Challenge</strong><small>UKMT papers and problem solving</small></span><b aria-hidden="true">↗</b></a></div></div></aside>
      <div><div class="section-heading"><div><p class="eyebrow text-stage">Moderated KS5 library</p><h2 id="alevel-track-heading">A-level resources</h2></div><p id="alevel-track-summary">Loading the available course links…</p></div><div class="unit-grid" id="alevel-track-grid"></div></div>
    </div></section>
  </main>
  <div id="site-footer"></div><script src="assets/site-shell.js" defer></script><script src="assets/support-pages.js" defer></script>
</body></html>\n`;

const year9Games = `${subHead("Year 9 Interactive Activities | SJWMS Maths", "Year 9 mathematics games and interactive tools for indices and three-dimensional geometry.")}
<body class="design-v3" data-root=".." data-section="ks3" data-year="9">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--year"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../year9_hub.html">Year 9</a><span aria-hidden="true">/</span><span>Interactive activities</span></nav><p class="eyebrow">Year 9 interactive</p><h1>Practise by playing and exploring.</h1><p class="lead">Use short challenges to rehearse key skills or manipulate mathematical objects directly.</p><div class="button-row"><a class="button button--ghost" href="../year9_hub.html">Back to Year 9</a></div></div><div class="support-collage" aria-hidden="true"><div class="support-collage__main"><span>▶</span><strong>Short, focused challenges</strong><small>Try · adapt · try again</small></div><div class="support-collage__note"><b>2</b><span>Activities ready</span></div><div class="support-collage__chip">Year 9 skills</div><i>+</i></div></div></section>
    <section class="section"><div class="container"><div class="section-heading"><div><p class="eyebrow text-stage">Available now</p><h2>Choose an activity</h2></div><p>These activities have their own focused game interface but link back into the Year 9 course.</p></div><div class="card-grid card-grid--two"><a class="card stage-card--year9" href="../games/year9_indices_quiz.html"><span class="card__meta">Indices · timed challenge</span><h3>Indices beat the clock</h3><p>Select the correct index form to gain time. One wrong move ends the round.</p><span class="card__action">Play now</span></a><a class="card stage-card--year9" href="../games/Cube_Manipulation.html"><span class="card__meta">Geometry · interactive tool</span><h3>Cube manipulation</h3><p>Add and remove cubes, then compare the plan and side elevations.</p><span class="card__action">Open activity</span></a></div><p class="notice" style="margin-top:1rem"><strong>More activities are coming.</strong> New games will appear here once they are ready for students.</p></div></section>
  </main>
  <div id="site-footer"></div><script src="../assets/site-shell.js" defer></script>
</body></html>\n`;

const gcsePrep = `${subHead("Year 9 to GCSE Transition | SJWMS Maths", "A clear route from Year 9 mathematics into the GCSE course and its revision resources.")}
<body class="design-v3" data-root=".." data-section="ks3" data-year="9">
  <div id="site-header"></div>
  <main class="page" id="main-content">
    <section class="edu-page-hero edu-page-hero--year"><div class="container edu-page-hero__inner"><div class="edu-page-hero__copy"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="../index.html">Home</a><span aria-hidden="true">/</span><a href="../year9_hub.html">Year 9</a><span aria-hidden="true">/</span><span>GCSE transition</span></nav><p class="eyebrow">Transition module</p><h1>From Year 9 into GCSE.</h1><p class="lead">Use the finished Year 9 units to secure your foundations, then preview how the GCSE course is organised.</p><div class="button-row"><a class="button button--primary" href="../gcse_hub.html">Explore GCSE units</a></div></div><div class="support-collage" aria-hidden="true"><div class="support-collage__main"><span>9</span><strong>Build the bridge to GCSE</strong><small>Secure · connect · continue</small></div><div class="support-collage__note"><b>10</b><span>KS3 units</span></div><div class="support-collage__chip">Next: GCSE</div><i>→</i></div></div></section>
    <section class="section"><div class="container"><div class="feature-panel"><div class="feature-panel__copy"><p class="eyebrow">Before Year 10</p><h2>Focus on algebraic fluency</h2><p>Quadratics, rearranging formulae, graphing and proportional reasoning form an important bridge into GCSE mathematics.</p><div class="button-row"><a class="button button--secondary" href="year9_unit02.html">Review quadratics</a><a class="button button--secondary" href="year9_unit03.html">Review formulae</a></div></div><div class="feature-panel__copy"><p class="eyebrow">Dedicated resources</p><h3>Transition materials are being prepared</h3><p>The previous draft links did not point to available files, so they have been removed until verified worksheets and videos are ready.</p><div class="button-row"><a class="button button--secondary" href="../gcse_hub.html">Use the GCSE hub</a></div></div></div></div></section>
  </main>
  <div id="site-footer"></div><script src="../assets/site-shell.js" defer></script>
</body></html>\n`;

for (const [name, content] of Object.entries({ "gcse_hub.html": gcseHub, "alevel_hub.html": alevelHub, "sparx.html": sparx, "ai_usage.html": aiUsage, "ks3_eoy.html": eoy, "dashboard.html": dashboard, "policy.html": policy, "year_9/year9_games.html": year9Games, "year_9/gcse_prep.html": gcsePrep })) {
  await writeFile(path.join(root, name), content);
}
console.log("GCSE hub and eight supporting pages now use the shared visual system.");
