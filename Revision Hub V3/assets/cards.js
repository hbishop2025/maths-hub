/* ---------- Shared helpers (global) ---------- */

// Robust CSV parser (quotes-aware)
function parseCSV(text){
  const rows=[]; let r=[], f="", q=false;
  for (let i=0;i<text.length;i++){
    const c=text[i];
    if(q){
      if(c==='"' && text[i+1]==='"'){ f+='"'; i++; }
      else if(c==='"'){ q=false; }
      else f+=c;
    }else{
      if(c==='"'){ q=true; }
      else if(c===','){ r.push(f.trim()); f=""; }
      else if(c==='\r'){ /* ignore */ }
      else if(c==='\n'){ r.push(f.trim()); rows.push(r); r=[]; f=""; }
      else f+=c;
    }
  }
  if (f.length || r.length){ r.push(f.trim()); rows.push(r); }
  const header = (rows.shift()||[]).map(h => String(h||'').trim().toLowerCase());
  return rows.map(row => {
    const o={}; header.forEach((h,idx)=> o[h] = (row[idx]||'').trim()); return o;
  });
}

// Date helper
function parseDate(s){
  if(!s) return null;
  if(/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)){
    const [d,m,y]=s.split('/').map(Number); const dt=new Date(y,m-1,d); return isNaN(dt)?null:dt;
  }
  const dt=new Date(s); return isNaN(dt)?null:dt;
}

// Pick icon/cta
function iconFor(url){
  const u=(url||'').toLowerCase();
  if(u.endsWith('.pdf')) return {icon:"picture_as_pdf", cta:"View"};
  if(u.includes('youtube') || u.includes('youtu.be') || u.includes('watch')) return {icon:"videocam", cta:"Watch Now"};
  if(u.includes('quiz') || u.includes('forms.gle') || u.includes('form')) return {icon:"quiz", cta:"Take Quiz"};
  return {icon:"description", cta:"View"};
}

// YouTube thumbnail (if any)
function ytThumbFor(url){
  const m=(url||'').match(/(?:youtube\.com.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

// Shared resource card (index & units)
function makeCard({year, unit, title, url}){
  const {icon, cta} = iconFor(url);
  const yt = ytThumbFor(url);

  const div = document.createElement('div');
  div.className = "bg-white p-4 rounded-xl shadow-sm";

  const media = yt
    ? `<div class="w-full h-32 rounded-lg mb-4 overflow-hidden relative">
         <img src="${yt}" alt="Video thumbnail" class="w-full h-full object-cover">
         <span class="material-icons absolute inset-0 m-auto w-12 h-12 flex items-center justify-center rounded-full bg-white/80 text-gray-800">play_arrow</span>
       </div>`
    : `<div class="w-full h-32 rounded-lg mb-4 flex items-center justify-center bg-stripes">
     <span class="material-icons text-4xl text-gray-600">${icon}</span>
   </div>`;
  
  const meta =
    `${year ? `Year ${year}` : ''}${unit ? (year ? ' – ' : '') + `Unit ${String(unit).padStart(2,'0')}` : ''}`;

  div.innerHTML = `
    ${media}
    ${meta ? `<p class="text-sm text-gray-500">${meta}</p>` : ``}
    <h3 class="font-semibold text-gray-800 mb-2">${title || 'Untitled'}</h3>
    <a class="flex items-center font-semibold" href="${url}" target="_blank" rel="noopener" style="color:var(--accent);">
      ${cta}
      <span class="material-icons ml-1">${cta==='Watch Now' ? 'play_arrow' : (cta==='Take Quiz' ? 'arrow_forward' : 'download')}</span>
    </a>
  `;
  return div;
}

// “Latest Information” card (index)
function makeInfoCard({type,text,date,url}){
  const hasLink = url && url.trim();
  const div=document.createElement('div');
  div.className="bg-white p-4 rounded-xl shadow-sm flex justify-between items-center";
  div.innerHTML=`
    <div>
      ${type ? `<p class="text-sm text-gray-500">${type}</p>` : ``}
      <p class="font-semibold text-gray-800">${text||''}</p>
      ${date ? `<p class="text-sm text-gray-500">${date}</p>` : ``}
    </div>
    ${hasLink ? `
      <a class="px-6 py-2 rounded-lg font-semibold flex items-center" href="${url}" target="_blank" rel="noopener" style="background:#EEF2FF;color:#4F46E5;">
        More Info <span class="material-icons ml-2">arrow_forward</span>
      </a>` : ``}
  `;
  return div;
}
