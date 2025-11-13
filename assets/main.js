// assets/main.js - frontend with API integration, language and theme support
const qInput = document.getElementById('qInput');
const mileageInput = document.getElementById('mileageInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const qError = document.getElementById('qError');
const mError = document.getElementById('mError');
const langSelect = document.getElementById('langSelect');
const themeToggle = document.getElementById('themeToggle');

const META_API = document.querySelector('meta[name="cf-api-base"]');
const API_BASE = (META_API && META_API.content) || window.CF_API_BASE || '';

/*
 Expected API:
 GET ${API_BASE}/lookup?q=<query>&m=<mileage>
 Response JSON (example):
 {
   "vin":"JTMBFREV0JD123456",
   "model":"Toyota Prius 2021",
   "mileage":120000,
   "sections":[
     {"id":"next_service","title_ru":"Следующее ТО","title_en":"Next service","content_ru":"Замена масла через 5500 км","content_en":"Oil change in 5500 km"},
     {"id":"oil","title_ru":"Масло","title_en":"Oil","content_ru":"0W-20 — 10000 km","content_en":"0W-20 — 10000 km"},
     {"id":"filters","title_ru":"Фильтры","title_en":"Filters","content_ru":"Воздушный — каждые 30000 км","content_en":"Air filter — every 30000 km"}
   ],
   "notes": "Доп. примечание"
 }
*/

const i18n = {
  ru: {
    tagline: "Проверка автомобиля по VIN / номеру кузова / модели — история ТО и сервисов",
    searchTitle: "Поиск автомобиля",
    labelVin: "VIN или номер кузова",
    labelMileage: "Пробег (км) — опционально",
    btnShow: "Показать ТО",
    btnClear: "Очистить",
    footer: "© CarFact — улучшенная версия файлов.",
    searching: "Идёт поиск...",
    notFound: "Результаты не найдены.",
    fetchError: "Ошибка при выполнении запроса. Проверьте API и подключение.",
  },
  en: {
    tagline: "Check a car by VIN / chassis number / model — service history & maintenance",
    searchTitle: "Search vehicle",
    labelVin: "VIN or chassis number",
    labelMileage: "Mileage (km) — optional",
    btnShow: "Show service",
    btnClear: "Clear",
    footer: "© CarFact — improved files.",
    searching: "Searching...",
    notFound: "No results found.",
    fetchError: "Error performing request. Check API and connection.",
  }
};

function t(key){
  const lang = langSelect.value || 'ru';
  return (i18n[lang] && i18n[lang][key]) || i18n.ru[key] || key;
}

function applyTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // update placeholders / button text that were not data-i18n attributed
  submitBtn.textContent = t('btnShow');
  clearBtn.textContent = t('btnClear');
  // update inputs labels
  document.querySelectorAll('.label-text').forEach(lbl=>{
    const map = lbl.getAttribute('data-i18n');
    if(map) lbl.textContent = t(map);
  });
}

function setStatus(text=''){
  statusEl.textContent = text;
}

function validateVinLike(value){
  if(!value) return {ok:false, msg:t('labelVin') + ' ' + 'не должно быть пустым'};
  const v = value.replace(/\s+/g,'').toUpperCase();
  if(/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return {ok:true, normalized:v};
  if(v.length >= 3) return {ok:true, normalized:v};
  return {ok:false, msg:'Некорректный VIN/номер кузова. VIN обычно 17 символов.'};
}

function validateMileage(value){
  if(!value) return {ok:true, normalized:null};
  const v = value.replace(/\s+/g,'');
  if(/^[0-9]{1,7}$/.test(v)) return {ok:true, normalized:parseInt(v,10)};
  return {ok:false, msg:'Некорректный пробег. Только цифры.'};
}

function clearErrors(){
  qError.textContent = '';
  mError.textContent = '';
}

function renderSection(section, lang){
  const item = document.createElement('div');
  item.className = 'accordion-item';
  const summary = document.createElement('div');
  summary.className = 'accordion-summary';
  const titleText = section['title_' + lang] || section.title || section.id || '';
  summary.innerHTML = `<div><strong>${titleText}</strong></div><div class="toggle-icon">▸</div>`;
  const content = document.createElement('div');
  content.className = 'accordion-content';
  content.innerHTML = section['content_' + lang] || section.content || '<span style="color:#999">—</span>';
  // toggle
  summary.addEventListener('click', ()=>{
    const opened = content.style.display === 'block';
    content.style.display = opened ? 'none' : 'block';
    summary.querySelector('.toggle-icon').textContent = opened ? '▸' : '▾';
  });
  item.appendChild(summary);
  item.appendChild(content);
  return item;
}

function renderResultCard(data){
  const lang = langSelect.value || 'ru';
  const card = document.createElement('article');
  card.className = 'card';
  const title = document.createElement('h3');
  title.textContent = data.model || (data.vin ? `VIN: ${data.vin}` : 'Результат');
  card.appendChild(title);

  const info = document.createElement('div');
  info.className = 'keyline';
  const items = [
    ['VIN', data.vin],
    ['Model', data.model],
    [t('labelMileage'), data.mileage],
  ];
  items.forEach(([k,v])=>{
    const el = document.createElement('div');
    el.className = 'kv';
    el.innerHTML = `<strong>${k}:</strong> ${v ?? '<span style="color:#999">—</span>'}`;
    info.appendChild(el);
  });
  card.appendChild(info);

  // sections accordion
  const acc = document.createElement('div');
  acc.className = 'accordion';
  const sections = Array.isArray(data.sections) ? data.sections : [];
  if(sections.length === 0){
    // fallback: map common fields
    const fallback = [
      {id:'nextService', title_ru:'Следующее ТО', title_en:'Next service', content_ru:data.nextService, content_en:data.nextService},
      {id:'oil', title_ru:'Масло', title_en:'Oil', content_ru:data.oil, content_en:data.oil},
      {id:'filters', title_ru:'Фильтры', title_en:'Filters', content_ru:data.filters, content_en:data.filters},
    ];
    fallback.forEach(s=> acc.appendChild(renderSection(s, lang)));
  } else {
    sections.forEach(s=> acc.appendChild(renderSection(s, lang)));
  }
  card.appendChild(acc);

  if(data.notes){
    const notes = document.createElement('div');
    notes.className = 'kv';
    notes.style.marginTop = '10px';
    notes.innerHTML = `<strong>Notes:</strong> ${data.notes}`;
    card.appendChild(notes);
  }

  return card;
}

async function callApiLookup(query, mileage){
  if(!API_BASE){
    throw new Error('API base not configured. Edit meta[name="cf-api-base"] in index.html or set window.CF_API_BASE.');
  }
  const params = new URLSearchParams();
  params.set('q', query);
  if(mileage) params.set('m', mileage);
  const url = API_BASE.replace(/\/$/,'') + '/lookup?' + params.toString();
  const resp = await fetch(url, {cache:'no-store'});
  if(!resp.ok){
    const txt = await resp.text();
    throw new Error(`API error: ${resp.status} ${txt}`);
  }
  const json = await resp.json();
  return json;
}

document.getElementById('searchForm').addEventListener('submit', async (ev)=>{
  ev.preventDefault();
  clearErrors();
  setStatus('');
  resultsEl.innerHTML = '';

  const qRaw = qInput.value.trim();
  const mRaw = mileageInput.value.trim();

  const vRes = validateVinLike(qRaw);
  if(!vRes.ok){ qError.textContent = vRes.msg; return; }
  const mRes = validateMileage(mRaw);
  if(!mRes.ok){ mError.textContent = mRes.msg; return; }

  submitBtn.disabled = true;
  setStatus(t('searching'));

  try {
    const json = await callApiLookup(vRes.normalized, mRes.normalized);
    if(!json || Object.keys(json).length === 0){
      setStatus(t('notFound'));
      return;
    }
    setStatus('');
    const card = renderResultCard(json);
    resultsEl.appendChild(card);

    // save query history
    try{
      const history = JSON.parse(localStorage.getItem('cf_history')||'[]');
      history.unshift({q:vRes.normalized, when:new Date().toISOString()});
      localStorage.setItem('cf_history', JSON.stringify(history.slice(0,30)));
    }catch(e){}
  } catch(err){
    console.error(err);
    setStatus(t('fetchError') + ' ' + (err.message||''));
  } finally {
    submitBtn.disabled = false;
  }
});

clearBtn.addEventListener('click', ()=>{
  qInput.value=''; mileageInput.value=''; resultsEl.innerHTML=''; setStatus('');
  clearErrors();
});

// language and translations
langSelect.addEventListener('change', applyTranslations);
document.addEventListener('DOMContentLoaded', ()=>{
  // init lang from localStorage
  const savedLang = localStorage.getItem('cf_lang') || 'ru';
  langSelect.value = savedLang;
  langSelect.addEventListener('change', ()=> localStorage.setItem('cf_lang', langSelect.value));
  applyTranslations();

  // theme
  const savedTheme = localStorage.getItem('cf_theme') || 'light';
  if(savedTheme === 'dark') document.documentElement.setAttribute('data-theme','dark');
  themeToggle.checked = savedTheme === 'dark';
  themeToggle.addEventListener('change', ()=>{
    const dark = themeToggle.checked;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem('cf_theme', dark ? 'dark' : 'light');
  });
});