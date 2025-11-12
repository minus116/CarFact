let currentLang = 'ru';
let currentTheme = 'light';
let lastQuery = { carKey: null, mileage: 0 };
let carsData = {};

const translations = {
  ru: {
    title: "CarFact.",
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
    at: "на"
  },
  en: {
    title: "CarFact.",
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
    at: "at"
  }
};

function t(key) {
  return translations[currentLang][key] || key;
}

function human(km) {
  const k = Math.floor(km / 1000);
  if (km >= 1000) {
    return currentLang === 'ru' ? `${k} тыс. ${t('km')}` : `${k}k ${t('km')}`;
  }
  return `${km} ${t('km')}`;
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.getElementById('langToggle').textContent = lang === 'ru' ? 'RU' : 'EN';
  updateUITexts();
  if (lastQuery.carKey) {
    renderReport(lastQuery.carKey, lastQuery.mileage);
  }
}

function setTheme(theme) {
  if (document.body.classList.contains('theme-switching')) return;
  if (currentTheme === theme) return;

  document.body.classList.add('theme-switching');

  setTimeout(() => {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);

    const icon = document.getElementById('themeIcon');
    const newSrc = theme === 'dark' ? 'icons/moon.svg' : 'icons/sun.svg';

    const newImg = new Image();
    newImg.src = newSrc;
    newImg.onload = () => {
      icon.classList.add('hidden');
      setTimeout(() => {
        icon.src = newSrc;
        icon.classList.remove('hidden');
      }, 150);
    };

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#000000' : '#ffffff');

    setTimeout(() => {
      document.body.classList.remove('theme-switching');
    }, 300);
  }, 50);
}

function updateUITexts() {
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('pageSubtitle').textContent = t('subtitle');
  document.getElementById('labelVin').textContent = t('labelVin');
  document.getElementById('labelMileage').textContent = t('labelMileage');
  document.getElementById('submitBtn').textContent = t('btnSubmit');
  document.title = t('title');
}

function findCar(query) {
  const q = query.toLowerCase();
  if (q.includes('prius') && (q.includes('2021') || q.includes('21'))) return 'prius 2021';
  if (q.includes('fit') && q.includes('2020')) return 'fit 2020';
  if ((q.includes('escudo') || q.includes('vitara')) && q.includes('2015')) return 'escudo 2015';
  if (q.includes('xv') && q.includes('2019')) return 'xv 2019';
  if (q.includes('c200') && q.includes('2019')) return 'c200 2019';
  return null;
}

function renderReport(carKey, mileage) {
  const car = carsData[carKey];
  const nextTO = Math.ceil(mileage / car.intervals) * car.intervals;
  const diff = nextTO - mileage;
  const isOverdue = diff < 0;

  let html = `
    <div class="card" style="border-left: 4px solid var(--accent);">
      <h2>${t('nextTO')}</h2>
      <p class="next-to-subtitle">${t('recommendedByManufacturer')}</p>
      <p class="next-to-value">${human(nextTO)}</p>
      <p class="next-to-diff">
        ${isOverdue ? t('overdue') : t('dueIn')} ${Math.abs(diff)} ${t('km')}
      </p>
    </div>
  `;

  // Масло
  html += `
    <div class="card" data-block="oil">
      <h3>${t('oil')}</h3>
      <p>${car.oil.type} — ${t('every')} ${human(car.oil.every)}</p>
      <div class="parts">
        <p class="small">${car.oil.brands.join(', ')}</p>
      </div>
    </div>
  `;

  // Фильтры
  html += `<div class="card" data-block="filters"><h3>${t('filters')}</h3><ul>`;
  html += `<li>${t('oilFilter')} — ${t('at')} ${human(car.filters.oil.interval)}</li>`;
  html += `<li>${t('airFilter')} — ${t('at')} ${human(car.filters.air.interval)}</li>`;
  html += `<li>${t('cabinFilter')} — ${t('at')} ${human(car.filters.cabin.interval)}</li>`;
  if (car.filters.fuel) {
    html += `<li>${t('fuelFilter')} — ${t('at')} ${human(car.filters.fuel.interval)}</li>`;
  }
  html += `</ul><div class="parts"><ul>`;
  html += `<li><span class="small">${car.filters.oil.parts.join(', ')}</span></li>`;
  html += `<li><span class="small">${car.filters.air.parts.join(', ')}</span></li>`;
  html += `<li><span class="small">${car.filters.cabin.parts.join(', ')}</span></li>`;
  if (car.filters.fuel) {
    html += `<li><span class="small">${car.filters.fuel.parts.join(', ')}</span></li>`;
  }
  html += `</ul></div></div>`;

  // Тормоза
  html += `
    <div class="card" data-block="brakes">
      <h3>${t('brakes')}</h3>
      <h4>${t('brakeFront')}</h4>
      <p>${t('replaceAt')} ${human(car.brakePads.front.interval)}</p>
      <div class="parts">
        <p class="small">${car.brakePads.front.parts.join(', ')}</p>
      </div>
      
      <h4>${t('brakeRear')}</h4>
      <p>${t('replaceAt')} ${human(car.brakePads.rear.interval)}</p>
      <div class="parts">
        <p class="small">${car.brakePads.rear.parts.join(', ')}</p>
      </div>
    </div>
  `;

  // Свечи
  if (car.sparkPlugs) {
    html += `
      <div class="card" data-block="sparkPlugs">
        <h3>${t('sparkPlugs')}</h3>
        <p>${t('replaceAt')} ${human(car.sparkPlugs.interval)}</p>
        <div class="parts">
          <p class="small">${car.sparkPlugs.parts.join(', ')}</p>
        </div>
      </div>
    `;
  }

  // ГРМ
  if (car.timing) {
    const type = car.timing.type === "chain" ? t('chain') : t('belt');
    html += `
      <div class="card" data-block="timing">
        <h3>${t('timing')} (${type})</h3>
        <p>${t('inspectAt')} ${human(car.timing.check)}`;
    if (car.timing.replace) {
      html += `<br>${t('replaceAt')} ${human(car.timing.replace)}`;
    }
    html += `</p></div>`;
  }

  // Колёса
  if (car.tires) {
    html += `
      <div class="card" data-block="wheels">
        <h3>${t('wheels')}</h3>
        <ul>
          <li>${t('tireSize')}: <b>${car.tires.size}</b></li>
          <li>${t('pressure')}: ${t('front')} — <b>${car.tires.pressure.front}</b>, ${t('rear')} — <b>${car.tires.pressure.rear}</b></li>
        </ul>
      </div>
    `;
  }

  // Рекомендации
  if (car.notes && car.notes[currentLang] && car.notes[currentLang].length) {
    html += `<div class="card"><h3>${t('recommendations')}</h3><ul>`;
    car.notes[currentLang].forEach(n => html += `<li>${n}</li>`);
    html += `</ul></div>`;
  }

  document.getElementById('result').innerHTML = html;
  document.getElementById('result').style.display = 'block';
  lastQuery = { carKey, mileage };

  // Подключаем обработчики ПОСЛЕ вставки HTML
  attachPartToggleListeners();
  attachScrollEffect();
}

// ✅ РАБОТАЮЩИЙ обработчик кликов по заголовкам
function attachPartToggleListeners() {
  document.querySelectorAll('.card h3, .card h4').forEach(header => {
    // Убираем предыдущие обработчики (защита от дубликатов)
    const newHeader = header.cloneNode(true);
    header.parentNode.replaceChild(newHeader, header);
    
    newHeader.addEventListener('click', () => {
      const parts = newHeader.nextElementSibling;
      if (parts && parts.classList.contains('parts')) {
        newHeader.classList.toggle('show');
        parts.classList.toggle('show');
      }
    });
  });
}

// ✅ Эффект растягивания при скролле
function attachScrollEffect() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  let ticking = false;

  function updateSpacing() {
    const scrollTop = window.scrollY;
    const baseGap = 16; // базовый отступ в px
    const maxExtra = 24; // макс. дополнительный отступ

    // Эффект: чем ниже скролл — тем больше отступы
    const factor = Math.min(1, scrollTop / 800);
    const dynamicGap = baseGap + factor * maxExtra;

    cards.forEach(card => {
      card.style.marginBottom = `${dynamicGap}px`;
    });

    ticking = false;
  }

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(updateSpacing);
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
}

async function init() {
  try {
    const response = await fetch('assets/cars.json');
    carsData = await response.json();
  } catch (e) {
    console.error('Не удалось загрузить cars.json:', e);
    carsData = {
      "prius 2021": {
        "name": { "ru": "Toyota Prius (2021)", "en": "Toyota Prius (2021)" },
        "intervals": 10000,
        "oil": { "every": 10000, "type": "0W-20", "brands": ["Toyota"] },
        "filters": { "oil": { "interval": 10000, "parts": ["Toyota"] } },
        "brakePads": { "front": { "interval": 40000, "parts": ["Toyota"] } },
        "tires": { "size": "195/65 R15", "pressure": { "front": "2.3", "rear": "2.2" } },
        "notes": { "ru": ["Тестовый авто"], "en": ["Test vehicle"] }
      }
    };
  }

  setTheme(currentTheme);
  setLanguage(currentLang);

  document.getElementById('langToggle').addEventListener('click', () => {
    setLanguage(currentLang === 'ru' ? 'en' : 'ru');
  });

  document.getElementById('themeToggle').addEventListener('click', () => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  });

  document.getElementById('submitBtn').addEventListener('click', () => {
    const vin = document.getElementById('vin').value.trim();
    const mileage = parseInt(document.getElementById('mileage').value) || 0;

    if (!vin) return alert(t('labelVin') + '?');
    if (mileage < 0 || mileage > 500000) return alert(t('labelMileage') + ': 0–500,000 km');

    const carKey = findCar(vin);
    if (carKey && carsData[carKey]) {
      renderReport(carKey, mileage);
    } else {
      const msg = currentLang === 'ru' 
        ? '<h2>Авто не найдено</h2><p>Поддерживаемые: Prius 2021, Fit 2020...</p>' 
        : '<h2>Not found</h2><p>Try: Prius 2021, Fit 2020</p>';
      document.getElementById('result').innerHTML = `<div class="card">${msg}</div>`;
      document.getElementById('result').style.display = 'block';
      lastQuery = { carKey: null, mileage: 0 };
    }
  });

  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('submitBtn').click();
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}