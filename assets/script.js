const carsData = {
  "prius 2021": {
    name: { ru: "Toyota Prius (2021)", en: "Toyota Prius (2021)" },
    intervals: 10000,
    oil: { every: 10000, type: "0W-20", parts: ["Toyota 04152-YZZA1", "Mann W 719/77"] },
    filters: {
      oil: { interval: 10000, parts: ["Toyota 04152-YZZA1", "Mann W 719/77"] },
      air: { interval: 20000, parts: ["Toyota 17801-YZZ050", "Mann C 25 017"] },
      cabin: { interval: 20000, parts: ["Toyota 87139-YZZ010", "Mann CU 2755"] },
      fuel: { interval: 40000, parts: ["Toyota 23390-0L010"] }
    },
    sparkPlugs: { interval: 100000, parts: ["NGK LFR6AIX-11", "Denso SK20HR11"] },
    brakePads: {
      front: { interval: 40000, parts: ["Toyota 04465-0K060", "TRW GDB3469"] },
      rear: { interval: 60000, parts: ["Toyota 04466-0K060", "TRW GDB3470"] }
    },
    timing: { type: "chain", check: 100000, replace: 200000 },
    tires: { size: "195/65 R15", pressure: { front: "2.3", rear: "2.2" } },
    notes: {
      ru: ["HV-батарея: проверка каждые 40 000 км"],
      en: ["HV battery: inspect every 40,000 km"]
    }
  }
};

const translations = {
  ru: {
    title: "CarFact.",
    labelVin: "VIN / Номер кузова / Модель",
    labelMileage: "Пробег (км)",
    btnSubmit: "Показать ТО",
    nextTO: "Следующее ТО",
    recommendedByManufacturer: "рекомендуемое заводом изготовителем",
    dueIn: "через",
    km: "км",
    overdue: "просрочено на",
    now: "сейчас",
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
    labelVin: "VIN / Body No. / Model",
    labelMileage: "Mileage (km)",
    btnSubmit: "Show Maintenance",
    nextTO: "Next Service",
    recommendedByManufacturer: "as recommended by the manufacturer",
    dueIn: "due in",
    km: "km",
    overdue: "overdue by",
    now: "now",
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

let currentLang = 'ru';
let currentTheme = 'light';

function t(key) { return translations[currentLang][key] || key; }

function human(km) {
  const k = Math.floor(km / 1000);
  return currentLang === 'ru' ? `${k} тыс. ${t('km')}` : `${k}k ${t('km')}`;
}

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.getElementById('langToggle').textContent = lang === 'ru' ? 'RU' : 'EN';
  updateUITexts();
}

function setTheme(theme) {
  if (currentTheme === theme) return;
  currentTheme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeIcon').src = theme === 'dark' ? 'icons/moon.svg' : 'icons/sun.svg';
}

function updateUITexts() {
  document.getElementById('pageTitle').textContent = t('title');
  document.getElementById('labelVin').textContent = t('labelVin');
  document.getElementById('labelMileage').textContent = t('labelMileage');
  document.getElementById('submitBtn').textContent = t('btnSubmit');
  document.title = t('title');
}

function findCar(query) {
  const q = query.toLowerCase();
  if (q.includes('prius') && q.includes('2021')) return 'prius 2021';
  return null;
}

function renderReport(carKey, mileage) {
  const car = carsData[carKey];
  const nextTO = Math.ceil(mileage / car.intervals) * car.intervals;
  const diff = nextTO - mileage;
  const isOverdue = diff < 0;

  // Специальная логика для "сейчас"
  const nowText = diff === 0 ? t('now') : (isOverdue ? t('overdue') : t('dueIn'));
  const diffValue = diff !== 0 ? Math.abs(diff) : '';
  const diffUnit = diff !== 0 ? t('km') : '';

  let html = `
    <div class="card next-to-card">
      <h2>
        ${t('nextTO')} 
        <span class="next-to-subtitle">${t('recommendedByManufacturer')}</span>
      </h2>
      <p class="next-to-value">${human(nextTO)}</p>
      <p class="next-to-diff">${nowText} ${diffValue} ${diffUnit}</p>
    </div>

    <div class="card">
      <h3 data-toggle="oil">${t('oil')} <span class="toggle-icon">+</span></h3>
      <p>${t('every')} ${human(car.oil.every)}</p>
      <div id="oil" class="parts">
        <div class="part-item">${car.oil.parts.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <h3 ${car.filters.fuel ? 'data-toggle="filters"' : ''}>${t('filters')} ${car.filters.fuel ? '<span class="toggle-icon">+</span>' : ''}</h3>
      <ul>
        <li data-toggle="oil-filter">${t('oilFilter')} — ${human(car.filters.oil.interval)} <span class="toggle-icon">+</span>
          <div id="oil-filter" class="parts">
            <div class="part-item">${car.filters.oil.parts.join(', ')}</div>
          </div>
        </li>
        <li data-toggle="air-filter">${t('airFilter')} — ${human(car.filters.air.interval)} <span class="toggle-icon">+</span>
          <div id="air-filter" class="parts">
            <div class="part-item">${car.filters.air.parts.join(', ')}</div>
          </div>
        </li>
        <li data-toggle="cabin-filter">${t('cabinFilter')} — ${human(car.filters.cabin.interval)} <span class="toggle-icon">+</span>
          <div id="cabin-filter" class="parts">
            <div class="part-item">${car.filters.cabin.parts.join(', ')}</div>
          </div>
        </li>
        ${car.filters.fuel ? `<li data-toggle="fuel-filter">${t('fuelFilter')} — ${human(car.filters.fuel.interval)} <span class="toggle-icon">+</span>
          <div id="fuel-filter" class="parts">
            <div class="part-item">${car.filters.fuel.parts.join(', ')}</div>
          </div>
        </li>` : ''}
      </ul>
    </div>

    <div class="card">
      <h3 ${car.sparkPlugs ? 'data-toggle="spark"' : ''}>${t('sparkPlugs')} ${car.sparkPlugs ? '<span class="toggle-icon">+</span>' : ''}</h3>
      <p>${car.sparkPlugs ? `${t('replaceAt')} ${human(car.sparkPlugs.interval)}` : t('noData')}</p>
      ${car.sparkPlugs ? `<div id="spark" class="parts">
        <div class="part-item">${car.sparkPlugs.parts.join(', ')}</div>
      </div>` : ''}
    </div>

    <div class="card">
      <h3>${t('brakes')}</h3>
      <h4 data-toggle="brakes-front">${t('brakeFront')} <span class="toggle-icon">+</span></h4>
      <p>${t('replaceAt')} ${human(car.brakePads.front.interval)}</p>
      <div id="brakes-front" class="parts">
        <div class="part-item">${car.brakePads.front.parts.join(', ')}</div>
      </div>
      
      <h4 data-toggle="brakes-rear">${t('brakeRear')} <span class="toggle-icon">+</span></h4>
      <p>${t('replaceAt')} ${human(car.brakePads.rear.interval)}</p>
      <div id="brakes-rear" class="parts">
        <div class="part-item">${car.brakePads.rear.parts.join(', ')}</div>
      </div>
    </div>
  `;

  document.getElementById('result').innerHTML = html;
  document.getElementById('result').style.display = 'block';

  // Подключаем toggle для всех элементов
  document.querySelectorAll('[data-toggle]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-toggle');
      const target = document.getElementById(targetId);
      const icon = this.querySelector('.toggle-icon');
      if (target && icon) {
        target.classList.toggle('show');
        icon.textContent = target.classList.contains('show') ? '−' : '+';
      }
    });
  });

  // Восстанавливаем анимацию растягивания
  attachScrollEffect();
}

function attachScrollEffect() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  let ticking = false;

  function updateSpacing() {
    const scrollTop = window.scrollY;
    if (scrollTop < 100) {
      cards.forEach(card => card.style.marginBottom = '16px');
      ticking = false;
      return;
    }

    const baseGap = 16;
    const maxExtra = 24;
    const factor = Math.min(1, (scrollTop - 100) / 700);
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

  window.removeEventListener('scroll', onScroll);
  window.addEventListener('scroll', onScroll, { passive: true });
}

function init() {
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
        ? '<h2>Авто не найдено</h2><p>Попробуйте: Prius 2021</p>' 
        : '<h2>Not found</h2><p>Try: Prius 2021</p>';
      document.getElementById('result').innerHTML = `<div class="card">${msg}</div>`;
      document.getElementById('result').style.display = 'block';
    }
  });

  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('submitBtn').click();
  });
}

document.addEventListener('DOMContentLoaded', init);