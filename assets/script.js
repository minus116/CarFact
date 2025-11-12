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
    tires: { 
      size: "195/65 R15", 
      pressure: { front: "2.3", rear: "2.2" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    },
    notes: {
      ru: ["HV-батарея: проверка каждые 40 000 км"],
      en: ["HV battery: inspect every 40,000 km"]
    }
  },
  "fit 2020": {
    name: { ru: "Honda Fit (2020)", en: "Honda Fit (2020)" },
    intervals: 10000,
    oil: { every: 10000, type: "0W-20", parts: ["Honda 15400-PLM-A02", "Mann W 701/61"] },
    filters: {
      oil: { interval: 10000, parts: ["Honda 15400-PLM-A02", "Mann W 701/61"] },
      air: { interval: 20000, parts: ["Honda 17220-PLM-A01", "Mann C 25 016"] },
      cabin: { interval: 20000, parts: ["Honda 17641-PLM-A01", "Mann CU 2750"] }
    },
    sparkPlugs: { interval: 100000, parts: ["NGK SILZKR7B11", "Denso SIKR8B11"] },
    brakePads: {
      front: { interval: 35000, parts: ["Honda 45022-TG5-A01", "TRW GDB2278"] },
      rear: { interval: 50000, parts: ["Honda 43022-TG5-A01", "Textar 2400301"] }
    },
    timing: { type: "belt", check: 60000, replace: 120000 },
    tires: { 
      size: "185/60 R15", 
      pressure: { front: "2.3", rear: "2.2" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    },
    notes: {
      ru: ["CVT-жидкость: замена через 100 000 км"],
      en: ["CVT fluid: replace at 100,000 km"]
    }
  },
  "escudo 2015": {
    name: { ru: "Suzuki Escudo (2015)", en: "Suzuki Vitara (2015)" },
    intervals: 15000,
    oil: { every: 15000, type: "5W-30", parts: ["Suzuki 16510-85G00", "Mann W 9004"] },
    filters: {
      oil: { interval: 15000, parts: ["Suzuki 16510-85G00", "Mann W 9004"] },
      air: { interval: 30000, parts: ["Suzuki 13780-87J00", "Mann C 35 005"] },
      cabin: { interval: 30000, parts: ["Suzuki 15530-87J00", "Mann CU 2555"] }
    },
    sparkPlugs: { interval: 60000, parts: ["NGK LKAR8AIX-9", "Denso K20HR-U9"] },
    brakePads: {
      front: { interval: 45000, parts: ["Suzuki 52021-85G00", "TRW GDB4418"] },
      rear: { interval: 65000, parts: ["Suzuki 52022-85G00", "Textar 2400401"] }
    },
    timing: { type: "belt", check: 60000, replace: 100000 },
    tires: { 
      size: "215/60 R17", 
      pressure: { front: "2.3", rear: "2.3" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    },
    notes: {
      ru: ["Полный привод: проверка раздатки каждые 30 000 км"],
      en: ["4WD: inspect transfer case every 30,000 km"]
    }
  },
  "xv 2019": {
    name: { ru: "Subaru XV (2019)", en: "Subaru XV (2019)" },
    intervals: 10000,
    oil: { every: 10000, type: "0W-20", parts: ["Subaru 15208AA160", "Mann W 701/60"] },
    filters: {
      oil: { interval: 10000, parts: ["Subaru 15208AA160", "Mann W 701/60"] },
      air: { interval: 20000, parts: ["Subaru 16546AA060", "Mann C 35 003"] },
      cabin: { interval: 20000, parts: ["Subaru H7110AC000", "Mann CU 2964"] }
    },
    sparkPlugs: { interval: 100000, parts: ["NGK SILZFR6A11", "Denso SIKR8B11"] },
    brakePads: {
      front: { interval: 40000, parts: ["Subaru 26295FG000", "TRW GDB3788"] },
      rear: { interval: 55000, parts: ["Subaru 26625FG000", "Textar 2400501"] }
    },
    timing: { type: "chain", check: 100000 },
    tires: { 
      size: "225/55 R18", 
      pressure: { front: "2.4", rear: "2.3" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    },
    notes: {
      ru: ["Проверка подвески каждые 20 000 км"],
      en: ["Inspect suspension every 20,000 km"]
    }
  },
  "c200 2019": {
    name: { ru: "Mercedes C200 (2019)", en: "Mercedes-Benz C200 (2019)" },
    intervals: 15000,
    oil: { every: 15000, type: "0W-30 (MB 229.52)", parts: ["Mercedes A 001 184 66 02", "Mann W 913/2"] },
    filters: {
      oil: { interval: 15000, parts: ["Mercedes A 001 184 66 02", "Mann W 913/2"] },
      air: { interval: 30000, parts: ["Mercedes A 000 094 20 04", "Mann C 36 010"] },
      cabin: { interval: 30000, parts: ["Mercedes A 000 830 62 05", "Mann CU 3238"] }
    },
    sparkPlugs: { interval: 60000, parts: ["Bosch FQR8LE2+", "NGK SILZKR7B11"] },
    brakePads: {
      front: { interval: 50000, parts: ["Mercedes A 006 420 76 20", "Bosch 0 986 AB4 274"] },
      rear: { interval: 70000, parts: ["Mercedes A 006 420 25 20", "TRW GDB4420"] }
    },
    timing: { type: "chain", check: 120000 },
    tires: { 
      size: "225/50 R17 (F), 245/45 R17 (R)", 
      pressure: { front: "2.3", rear: "2.4" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    },
    notes: {
      ru: ["Охлаждающая жидкость: замена 150 000 км"],
      en: ["Coolant: replace at 150,000 km"]
    }
  }
};

const translations = {
  ru: {
    title: "CarFact.",
    labelVin: "VIN / Номер кузова / Модель",
    labelMileage: "Пробег (км)",
    btnSubmit: "Показать ТО",
    nextTO: "ближайшее техническое обслуживание",
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
    at: "на",
    japan: "Япония",
    china: "Китай",
    korea: "Корея",
    europe: "Европа",
    tireBrands: "Марки резины"
  },
  en: {
    title: "CarFact.",
    labelVin: "VIN / Body No. / Model",
    labelMileage: "Mileage (km)",
    btnSubmit: "Show Maintenance",
    nextTO: "next service",
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
    at: "at",
    japan: "Japan",
    china: "China",
    korea: "Korea",
    europe: "Europe",
    tireBrands: "Tire Brands"
  }
};

let currentLang = 'ru';
let currentTheme = 'light';
let lastQuery = { carKey: null, mileage: 0 };

function t(key) { return translations[currentLang][key] || key; }

function human(km) {
  const k = Math.floor(km / 1000);
  return currentLang === 'ru' ? `${k} тыс. км` : `${k}k km`;
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

  const nowText = diff === 0 ? t('now') : (isOverdue ? `${t('overdue')} ${Math.abs(diff)} ${t('km')}` : `${t('dueIn')} ${Math.abs(diff)} ${t('km')}`);
  
  const tireRegions = car.tires.regions;
  
  let html = `
    <div class="card next-to-card">
      <h2>${t('nextTO')} ${human(nextTO)}</h2>
      <p class="next-to-diff">${diff === 0 ? t('now') : nowText}</p>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="oil">
        <h3>${t('oil')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <p>${t('every')} ${human(car.oil.every)}</p>
      <div id="oil" class="parts">
        <div class="dropdown-content">${car.oil.parts.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="filters">
        <h3>${t('filters')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('oilFilter')} — ${human(car.filters.oil.interval)}</li>
        <li>${t('airFilter')} — ${human(car.filters.air.interval)}</li>
        <li>${t('cabinFilter')} — ${human(car.filters.cabin.interval)}</li>
        ${car.filters.fuel ? `<li>${t('fuelFilter')} — ${human(car.filters.fuel.interval)}</li>` : ''}
      </ul>
      <div id="filters" class="parts">
        <div class="dropdown-content">
          <strong>${t('oilFilter')}:</strong> ${car.filters.oil.parts.join(', ')}<br>
          <strong>${t('airFilter')}:</strong> ${car.filters.air.parts.join(', ')}<br>
          <strong>${t('cabinFilter')}:</strong> ${car.filters.cabin.parts.join(', ')}<br>
          ${car.filters.fuel ? `<strong>${t('fuelFilter')}:</strong> ${car.filters.fuel.parts.join(', ')}` : ''}
        </div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="spark">
        <h3>${t('sparkPlugs')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <p>${t('replaceAt')} ${human(car.sparkPlugs.interval)}</p>
      <div id="spark" class="parts">
        <div class="dropdown-content">${car.sparkPlugs.parts.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="brakes">
        <h3>${t('brakes')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('brakeFront')} — ${human(car.brakePads.front.interval)}</li>
        <li>${t('brakeRear')} — ${human(car.brakePads.rear.interval)}</li>
      </ul>
      <div id="brakes" class="parts">
        <div class="dropdown-content">
          <strong>${t('brakeFront')}:</strong> ${car.brakePads.front.parts.join(', ')}<br>
          <strong>${t('brakeRear')}:</strong> ${car.brakePads.rear.parts.join(', ')}
        </div>
      </div>
    </div>

    <div class="card wheels-card">
      <div class="toggle-container" data-toggle="wheels">
        <h3>${t('wheels')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('tireSize')}: <b>${car.tires.size}</b></li>
        <li>${t('pressure')}: ${t('front')} — <b>${car.tires.pressure.front}</b>, ${t('rear')} — <b>${car.tires.pressure.rear}</b></li>
      </ul>
      <div id="wheels" class="parts">
        <h4>${t('tireBrands')}</h4>
        <div class="regions-list">
          <div class="region-item"><strong>${t('japan')}:</strong> ${tireRegions.japan.join(', ')}</div>
          <div class="region-item"><strong>${t('china')}:</strong> ${tireRegions.china.join(', ')}</div>
          <div class="region-item"><strong>${t('korea')}:</strong> ${tireRegions.korea.join(', ')}</div>
          <div class="region-item"><strong>${t('europe')}:</strong> ${tireRegions.europe.join(', ')}</div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('result').innerHTML = html;
  document.getElementById('result').style.display = 'block';
  lastQuery = { carKey, mileage };

  function setupToggleListeners() {
    document.querySelectorAll('[data-toggle]').forEach(el => {
      const originalHandler = el.onclick;
      
      if (originalHandler) {
        el.onclick = null;
      }
      
      el.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const targetId = this.getAttribute('data-toggle');
        const target = document.getElementById(targetId);
        const circle = this.querySelector('.toggle-circle');
        
        if (target && circle) {
          target.classList.toggle('show');
          circle.classList.toggle('open');
        }
      });
    });
  }

  setupToggleListeners();
  attachScrollEffect();
}

function attachScrollEffect() {
  const cards = document.querySelectorAll('.card');
  if (!cards.length) return;

  let ticking = false;

  function updateSpacing() {
    const scrollTop = window.scrollY;
    if (scrollTop < 100) {
      cards.forEach(card => card.style.marginBottom = '10px');
      ticking = false;
      return;
    }

    const baseGap = 10;
    const maxExtra = 14;
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
        ? '<h2>Авто не найдено</h2><p>Поддерживаемые: Prius 2021, Fit 2020, Escudo 2015, XV 2019, C200 2019</p>' 
        : '<h2>Not found</h2><p>Supported: Prius 2021, Fit 2020, Escudo 2015, XV 2019, C200 2019</p>';
      document.getElementById('result').innerHTML = `<div class="card">${msg}</div>`;
      document.getElementById('result').style.display = 'block';
      lastQuery = { carKey: null, mileage: 0 };
    }
  });

  document.addEventListener('keypress', e => {
    if (e.key === 'Enter') document.getElementById('submitBtn').click();
  });
}

document.addEventListener('DOMContentLoaded', init);