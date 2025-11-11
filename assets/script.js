
"use strict";

// === STATE ===
let currentLang = localStorage.getItem("lang") || "ru";
let currentTheme = localStorage.getItem("theme") || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
let lastQuery = { carKey: null, mileage: 0 };
let cars = {};

// ELEMENTS
const resultEl = document.getElementById("result");
const errorMsg = document.getElementById("errorMsg");

// TRANSLATIONS (включены все ключи из оригинала)
const translations = {
  ru: {
    title: "CarFact",
    subtitle: "Введите VIN или номер кузова — узнайте, что менять и какие запчасти использовать",
    labelVin: "VIN / Номер кузова / Модель",
    labelMileage: "Пробег (км)",
    btnSubmit: "Показать ТО",
    nextTO: "Следующее ТО",
    recommendedByManufacturer: "рекомендуемое заводом изготовителем",
    dueIn: "через",
    km: "км",
    overdue: "просрочено на",
    oil: "Моторное масло",
    filters: "Фильтры",
    oilFilter: "Масляный",
    airFilter: "Воздушный",
    cabinFilter: "Салонный",
    fuelFilter: "Топливный",
    sparkPlugs: "Свечи зажигания",
    brakes: "Тормозные колодки",
    brakeFront: "Передние",
    brakeRear: "Задние",
    timing: "ГРМ",
    chain: "цепь",
    belt: "ремень",
    wheels: "Колёса и давление",
    tireSize: "Размер шин",
    pressure: "Давление (бар)",
    front: "перед",
    rear: "зад",
    recommendations: "Рекомендации",
    inspectAt: "Проверка —",
    replaceAt: "Замена —",
    every: "каждые",
    at: "на",
    notFoundTitle: "Авто не найдено",
    supportedList: "Поддерживаемые: Prius 2021, Fit 2020, Escudo 2015, XV 2019, C200 2019"
  },
  en: {
    title: "CarFact",
    subtitle: "Enter VIN or body number — see what to service and which parts to use",
    labelVin: "VIN / Body No. / Model",
    labelMileage: "Mileage (km)",
    btnSubmit: "Show Maintenance",
    nextTO: "Next Service",
    recommendedByManufacturer: "as recommended by the manufacturer",
    dueIn: "due in",
    km: "km",
    overdue: "overdue by",
    oil: "Engine Oil",
    filters: "Filters",
    oilFilter: "Oil",
    airFilter: "Air",
    cabinFilter: "Cabin",
    fuelFilter: "Fuel",
    sparkPlugs: "Spark Plugs",
    brakes: "Brake Pads",
    brakeFront: "Front",
    brakeRear: "Rear",
    timing: "Timing System",
    chain: "chain",
    belt: "belt",
    wheels: "Wheels & Tire Pressure",
    tireSize: "Tire size",
    pressure: "Pressure (bar)",
    front: "Front",
    rear: "Rear",
    recommendations: "Notes",
    inspectAt: "Inspect at",
    replaceAt: "Replace at",
    every: "every",
    at: "at",
    notFoundTitle: "Not found",
    supportedList: "Supported: Prius 2021, Fit 2020, Escudo 2015, XV 2019, C200 2019"
  }
};

function t(key){ return translations[currentLang] && translations[currentLang][key] ? translations[currentLang][key] : key; }

// THEME
function setTheme(theme){
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const themeToggle = document.getElementById("themeToggle");
  if (themeToggle) themeToggle.textContent = theme === "dark" ? "🌙" : "☀️";
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "dark" ? "#000000" : "#ffffff");
  localStorage.setItem("theme", theme);
}

function toggleTheme(){ setTheme(currentTheme === "light" ? "dark" : "light"); }

// LANGUAGE
function setLanguage(lang){
  currentLang = lang;
  localStorage.setItem("lang", lang);
  document.documentElement.lang = lang;
  const langToggle = document.getElementById("langToggle");
  if (langToggle) langToggle.textContent = lang === "ru" ? "RU" : "EN";
  // update UI texts
  document.getElementById("pageTitle").textContent = t("title");
  document.getElementById("pageSubtitle").textContent = t("subtitle");
  document.getElementById("labelVin").textContent = t("labelVin");
  document.getElementById("labelMileage").textContent = t("labelMileage");
  document.getElementById("submitBtn").textContent = t("btnSubmit");
  // re-render last result in current language
  if (lastQuery.carKey) renderReport(lastQuery.carKey, lastQuery.mileage);
}

function toggleLang(){ setLanguage(currentLang === "ru" ? "en" : "ru"); }

// ERRORS
function showError(msg){ errorMsg.textContent = msg; errorMsg.hidden = false; }
function clearError(){ errorMsg.hidden = true; errorMsg.textContent = ""; }

// UTIL
function human(km){
  const absKm = Math.abs(km);
  if (absKm >= 1000){
    const k = Math.round(absKm / 1000);
    return currentLang === "ru" ? `${k} тыс. ${t('km')}` : `${k}k ${t('km')}`;
  }
  return `${Math.round(absKm)} ${t('km')}`;
}

function findCar(query){
  if (!query) return null;
  const q = query.toLowerCase();
  // relaxed matching: check if any car key or name appears in query
  for (const key of Object.keys(cars)){
    const normalizedKey = key.toLowerCase();
    if (q.includes(normalizedKey.replace(/\s+/g, '')) || q.includes(normalizedKey)) return key;
    // also check common model names like "prius" etc.
    const parts = normalizedKey.split(' ');
    for (const p of parts){
      if (p && q.includes(p)) return key;
    }
  }
  return null;
}

// RENDER
function renderReport(carKey, mileage){
  const car = cars[carKey];
  if (!car) return;
  // compute next service based on car.intervals (default fallback)
  const baseInterval = car.intervals || 10000;
  const nextTO = Math.ceil(mileage / baseInterval) * baseInterval || baseInterval;
  const diff = nextTO - mileage;
  const isOverdue = diff < 0;

  let html = `
    <div class="card" style="border-left: 4px solid var(--accent);">
      <h2>${t('nextTO')}</h2>
      <p class="next-to-subtitle">${t('recommendedByManufacturer')}</p>
      <p class="next-to-value">${human(nextTO)}</p>
      <p class="next-to-diff">${isOverdue ? t('overdue') : t('dueIn')} ${Math.abs(diff)} ${t('km')}</p>
    </div>
  `;

  // Oil
  if (car.oil){
    html += `<div class="card"><h3>${t('oil')}</h3><p>${car.oil.type} — ${t('every')} ${human(car.oil.every || car.oil.every)}</p>`;
    if (car.oil.brands && car.oil.brands.length) html += `<p class="small">${car.oil.brands.join(', ')}</p>`;
    html += `</div>`;
  }

  // Filters
  if (car.filters){
    html += `<div class="card"><h3>${t('filters')}</h3><ul>`;
    if (car.filters.oil) html += `<li>${t('oilFilter')} — ${t('at')} ${human(car.filters.oil.interval)}<br><span class="small">${(car.filters.oil.parts||[]).join(', ')}</span></li>`;
    if (car.filters.air) html += `<li>${t('airFilter')} — ${t('at')} ${human(car.filters.air.interval)}<br><span class="small">${(car.filters.air.parts||[]).join(', ')}</span></li>`;
    if (car.filters.cabin) html += `<li>${t('cabinFilter')} — ${t('at')} ${human(car.filters.cabin.interval)}<br><span class="small">${(car.filters.cabin.parts||[]).join(', ')}</span></li>`;
    if (car.filters.fuel) html += `<li>${t('fuelFilter')} — ${t('at')} ${human(car.filters.fuel.interval)}<br><span class="small">${(car.filters.fuel.parts||[]).join(', ')}</span></li>`;
    html += `</ul></div>`;
  }

  // Brakes
  if (car.brakePads){
    html += `
      <div class="card">
        <h3>${t('brakes')}</h3>
        <h4>${t('brakeFront')}</h4>
        <p>${t('replaceAt')} ${human(car.brakePads.front.interval)}</p>
        <p class="small">${(car.brakePads.front.parts||[]).join(', ')}</p>
        <h4>${t('brakeRear')}</h4>
        <p>${t('replaceAt')} ${human(car.brakePads.rear.interval)}</p>
        <p class="small">${(car.brakePads.rear.parts||[]).join(', ')}</p>
      </div>
    `;
  }

  // Spark plugs
  if (car.sparkPlugs){
    html += `<div class="card"><h3>${t('sparkPlugs')}</h3><p>${t('replaceAt')} ${human(car.sparkPlugs.interval)}</p><p class="small">${(car.sparkPlugs.parts||[]).join(', ')}</p></div>`;
  }

  // Timing
  if (car.timing){
    const type = car.timing.type === "chain" ? t('chain') : t('belt');
    html += `<div class="card"><h3>${t('timing')} (${type})</h3><p>${t('inspectAt')} ${human(car.timing.check)}`;
    if (car.timing.replace) html += `<br>${t('replaceAt')} ${human(car.timing.replace)}`;
    html += `</p></div>`;
  }

  // Tires
  if (car.tires){
    html += `
      <div class="card">
        <h3>${t('wheels')}</h3>
        <ul>
          <li>${t('tireSize')}: <b>${car.tires.size}</b></li>
          <li>${t('pressure')}: ${t('front')} — <b>${car.tires.pressure.front}</b>, ${t('rear')} — <b>${car.tires.pressure.rear}</b></li>
        </ul>
      </div>
    `;
  }

  // Notes
  if (car.notes && car.notes[currentLang] && car.notes[currentLang].length){
    html += `<div class="card"><h3>${t('recommendations')}</h3><ul>`;
    car.notes[currentLang].forEach(n => html += `<li>${n}</li>`);
    html += `</ul></div>`;
  }

  resultEl.innerHTML = html;
  resultEl.style.display = "block";
  lastQuery = { carKey, mileage };
  resultEl.scrollIntoView({ behavior: "smooth" });
}

// LOAD CARS (cars.json)
function loadCars(){
  return fetch("assets/cars.json").then(r=>{
    if (!r.ok) throw new Error("network");
    return r.json();
  }).then(data=>{ cars = data; }).catch(err=>{ showError(currentLang==='ru' ? 'Ошибка загрузки данных автомобилей' : 'Failed to load cars data'); });
}

// EVENTS
document.getElementById("langToggle").addEventListener("click", ()=>{ toggleLang(); });
document.getElementById("themeToggle").addEventListener("click", ()=>{ toggleTheme(); });
document.getElementById("submitBtn").addEventListener("click", ()=>{
  clearError();
  const vin = document.getElementById("vin").value.trim();
  const mileage = parseInt(document.getElementById("mileage").value) || 0;
  if (!vin) return alert(t('labelVin') + '?');
  if (mileage < 0 || mileage > 500000) return alert(t('labelMileage') + ': 0–500,000 km');
  const carKey = findCar(vin);
  if (carKey && cars[carKey]){
    renderReport(carKey, mileage);
  } else {
    const msg = currentLang === 'ru' 
      ? `<h2>${t('notFoundTitle')}</h2><p>${t('supportedList')}</p>` 
      : `<h2>${t('notFoundTitle')}</h2><p>${t('supportedList')}</p>`;
    resultEl.innerHTML = `<div class="card">${msg}</div>`;
    resultEl.style.display = 'block';
    lastQuery = { carKey: null, mileage: 0 };
  }
});
document.addEventListener("keypress", e => { if (e.key === "Enter") document.getElementById("submitBtn").click(); });

// INIT
setTheme(currentTheme);
setLanguage(currentLang);
loadCars();
