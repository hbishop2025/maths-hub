// assets/scripts/fetch-sheets.mjs
// Node 20 has global fetch. Converts your published CSVs to JSON files in assets/data/

import { writeFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// 🔗 PUBLISHED CSV URLS
// Year 7 & 8 are from your single Google Sheet by gid:
const SHEET_ID_Y78 = "1BNLmpyXbyo_TuHql3s36thOVKwgcQrtZiCv_qdxTCcE";
const YEAR7_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=0&single=true&output=csv";
const YEAR8_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=794689788&single=true&output=csv";

// Year 9 (your working published “Year_9” tab CSV):
const YEAR9_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=1806966889&single=true&output=csv";

// Explore “Latest resources”:
const EXPLORE_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=1718705208&single=true&output=csv";

// Info tab:
const INFO_CSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=362373857&single=true&output=csv";

// --- Simple CSV parser (handles quotes) ---
function parseCSV(text) {
  const rows = [];
  let row = [];
  let field = "";
  let i = 0;
  let inQuotes = false;

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        inQuotes = false; i++; continue;
      }
      field += c; i++; continue;
    } else {
      if (c === '"') { inQuotes = true; i++; continue; }
      if (c === ",") { row.push(field.trim()); field = ""; i++; continue; }
      if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field.trim()); field = "";
        if (row.length) rows.push(row);
        row = []; i++; continue;
      }
      field += c; i++;
    }
  }
  if (field.length || row.length) { row.push(field.trim()); rows.push(row); }

  const header = (rows.shift() || []).map(h => String(h || "").trim().toLowerCase());
  return rows.map(r => {
    const o = {};
    header.forEach((h, idx) => { o[h] = (r[idx] || "").trim(); });
    return o;
  });
}

async function fetchToJson(url, outPath) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch failed ${res.status} for ${url}`);
  const csv = await res.text();
  const json = parseCSV(csv);

  await mkdir(dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(json, null, 2), "utf8");
  console.log(`✅ Wrote ${outPath} (${json.length} rows)`);
}

async function run() {
  await fetchToJson(YEAR7_CSV,   __dirname + "/../data/year7.json");
  await fetchToJson(YEAR8_CSV,   __dirname + "/../data/year8.json");
  await fetchToJson(YEAR9_CSV,   __dirname + "/../data/year9.json");
  await fetchToJson(EXPLORE_CSV, __dirname + "/../data/explore.json");
  await fetchToJson(INFO_CSV,    __dirname + "/../data/info.json");
}

run().catch(err => {
  console.error("❌ Fetch error:", err);
  process.exit(1);
});
