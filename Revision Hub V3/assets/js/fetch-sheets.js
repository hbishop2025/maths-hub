// assets/js/fetch-sheets.js
// Run with: node assets/js/fetch-sheets.js

const fs = require('fs');
const path = require('path');
const https = require('https');

const sources = [
  // Explore (Year 9 ‘Explore’ tab)
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=1718705208&single=true&output=csv",
    out: "assets/data/explore.json"
  },
  // Info tab (gid=362373857)
  {
    url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSKY5Fr86c9vJRRmFeRquLr0QJb7lpw-yGSioJcjPxz77C-AMKuCiflJ1UZ5vViLO9B3xIJMA0MPy1u/pub?gid=362373857&single=true&output=csv",
    out: "assets/data/info.json"
  },
  // Year 7 (same doc, gid=0)
  {
    url: "https://docs.google.com/spreadsheets/d/1BNLmpyXbyo_TuHql3s36thOVKwgcQrtZiCv_qdxTCcE/pub?gid=0&single=true&output=csv",
    out: "assets/data/year7.json"
  },
  // Year 8 (same doc, gid=794689788)
  {
    url: "https://docs.google.com/spreadsheets/d/1BNLmpyXbyo_TuHql3s36thOVKwgcQrtZiCv_qdxTCcE/pub?gid=794689788&single=true&output=csv",
    out: "assets/data/year8.json"
  }
];

// Tiny CSV parser (handles quotes)
function parseCSV(text){
  const rows=[]; let r=[], f="", q=false;
  for (let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"'){
        if(text[i+1]==='"'){ f+='"'; i++; } else { q=false; }
      } else { f+=c; }
    } else {
      if(c==='"'){ q=true; }
      else if(c===','){ r.push(f.trim()); f=""; }
      else if(c==='\r'){ /* skip */ }
      else if(c==='\n'){ r.push(f.trim()); rows.push(r); r=[]; f=""; }
      else { f+=c; }
    }
  }
  if (f.length || r.length){ r.push(f.trim()); rows.push(r); }
  if (!rows.length) return [];
  const header = rows.shift().map(h => (h||"").toLowerCase());
  return rows.map(cols => {
    const obj={};
    header.forEach((h,i)=> obj[h] = (cols[i]||"").trim());
    return obj;
  });
}

function fetchText(url){
  return new Promise((resolve,reject)=>{
    https.get(url, res=>{
      if(res.statusCode!==200){
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        res.resume(); return;
      }
      let data="";
      res.setEncoding('utf8');
      res.on('data', chunk => data+=chunk);
      res.on('end', ()=> resolve(data));
    }).on('error', reject);
  });
}

async function run(){
  // make sure the folder exists
  fs.mkdirSync(path.join(process.cwd(), 'assets', 'data'), {recursive:true});

  for (const src of sources){
    console.log(`→ Fetching ${src.url}`);
    const csv = await fetchText(src.url);
    const json = parseCSV(csv);
    fs.writeFileSync(src.out, JSON.stringify(json, null, 2), 'utf8');
    console.log(`  Saved ${src.out} (${json.length} rows)`);
  }
  console.log('✅ Done.');
}

run().catch(err=>{
  console.error('❌ fetch-sheets failed:', err);
  process.exit(1);
});