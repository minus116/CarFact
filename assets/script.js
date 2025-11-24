// Глобальные переменные
let carDatabase = null;
let vinDecoder = null;
let sampleData = null;
let currentLang = 'ru';
let currentTheme = 'light';
let lastQuery = { carKey: null, mileage: 0 };

// Загрузка базы данных
async function loadCarDatabase() {
  try {
    console.log('🔍 Загрузка базы данных...');
    
    const indexResponse = await fetch('assets/db/index.json');
    carDatabase = await indexResponse.json();
    
    const vinResponse = await fetch('assets/db/vin_decoder.json');
    vinDecoder = await vinResponse.json();
    
    const sampleResponse = await fetch('assets/db/sample_data.json');
    sampleData = await sampleResponse.json();
    
    console.log('✅ База данных загружена:', 
      `${carDatabase.statistics.manufacturers} производителей,`,
      `${carDatabase.statistics.models} моделей,`,
      `${carDatabase.statistics.modifications} модификаций`
    );
    
    return true;
  } catch (error) {
    console.error('❌ Ошибка загрузки базы данных:', error);
    
    // Fallback к встроенным данным
    sampleData = {
      "toyota_prius_2021": carsData["prius 2021"],
      "honda_fit_2020": carsData["fit 2020"]
    };
    return false;
  }
}

// Валидация VIN
function validateVIN(vin) {
  if (!vin) return false;
  
  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  return cleanVIN.length === 17;
}

// Расшифровка VIN
function decodeVIN(vin) {
  if (!validateVIN(vin)) return null;
  
  const cleanVIN = vin.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Извлекаем части VIN
  const wmi = cleanVIN.substring(0, 3);
  const vds = cleanVIN.substring(3, 8);
  const checkDigit = cleanVIN.charAt(8);
  const modelYearCode = cleanVIN.charAt(9);
  const plantCode = cleanVIN.charAt(10);
  const vis = cleanVIN.substring(11);
  
  // Проверяем WMI
  const wmiInfo = vinDecoder.wmi[wmi];
  if (!wmiInfo) {
    return {
      type: 'error',
      message: `Неизвестный производитель: ${wmi}`
    };
  }
  
  // Определяем год
  const year = vinDecoder.model_years[modelYearCode] || modelYearCode;
  
  // Определяем завод
  const plant = vinDecoder.plants[wmiInfo.manufacturer]?.[plantCode] || 
                `Код завода: ${plantCode}`;
  
  // Ищем совпадение в sample_data
  let matchedCar = null;
  
  // Проверяем по префиксам VIN
  for (let carId in sampleData) {
    const car = sampleData[carId];
    if (car.identification?.vin_prefixes?.some(prefix => 
        cleanVIN.startsWith(prefix))) {
      matchedCar = {
        id: carId,
        data: car,
        match_type: 'vin_prefix'
      };
      break;
    }
  }
  
  // Если не нашли по VIN, ищем по WMI и году
  if (!matchedCar) {
    for (let carId in sampleData) {
      const car = sampleData[carId];
      if (car.manufacturer === wmiInfo.manufacturer && 
          car.year.toString().endsWith(year.toString().slice(-2))) {
        matchedCar = {
          id: carId,
          data: car,
          match_type: 'manufacturer_year'
        };
        break;
      }
    }
  }
  
  return {
    type: 'decoded',
    vin: cleanVIN,
    manufacturer: wmiInfo,
    year: year,
    plant: plant,
    matched_car: matchedCar,
    raw: {
      wmi: wmi,
      vds: vds,
      check_digit: checkDigit,
      model_year: modelYearCode,
      plant_code: plantCode,
      vis: vis
    }
  };
}

// Расшифровка кода кузова
function decodeBodyCode(bodyCode) {
  if (!bodyCode) return null;
  
  const cleanCode = bodyCode.toUpperCase().replace(/[^A-Z0-9]/g, '');
  
  // Ищем в sample_data
  for (let carId in sampleData) {
    const car = sampleData[carId];
    if (car.identification?.body_codes?.includes(cleanCode)) {
      return {
        type: 'decoded',
        body_code: cleanCode,
        matched_car: {
          id: carId,
          data: car,
          match_type: 'exact_match'
        }
      };
    }
  }
  
  // Ищем по частичному совпадению
  for (let carId in sampleData) {
    const car = sampleData[carId];
    if (car.identification?.body_codes?.some(code => 
        code.includes(cleanCode) || cleanCode.includes(code))) {
      return {
        type: 'decoded',
        body_code: cleanCode,
        matched_car: {
          id: carId,
          data: car,
          match_type: 'partial_match'
        }
      };
    }
  }
  
  return {
    type: 'not_found',
    body_code: cleanCode,
    message: 'Код кузова не найден в базе'
  };
}

// Поиск по названию
function searchByName(query) {
  if (!query) return [];
  
  const q = query.toLowerCase();
  const results = [];
  
  // Поиск по sample_data
  for (let carId in sampleData) {
    const car = sampleData[carId];
    const fullName = `${car.name.ru} ${car.year}`.toLowerCase();
    const manufacturer = car.manufacturer.toLowerCase();
    
    if (fullName.includes(q) || manufacturer.includes(q)) {
      results.push({
        type: 'car',
        id: carId,
        data: car
      });
    }
  }
  
  return results;
}

// Основная функция поиска
function findCar(query) {
  if (!query) return null;
  
  const q = query.trim();
  
  // Сначала пробуем как VIN
  if (q.length >= 10 && validateVIN(q)) {
    return decodeVIN(q);
  }
  
  // Потом как код кузова (3-8 символов)
  if (q.length >= 3 && q.length <= 8) {
    const bodyResult = decodeBodyCode(q);
    if (bodyResult.type === 'decoded') {
      return bodyResult;
    }
  }
  
  // Затем по названию
  const nameResults = searchByName(q);
  if (nameResults.length > 0) {
    return {
      type: 'name_search',
      results: nameResults
    };
  }
  
  return null;
}

// Функции перевода и рендеринга (без изменений от предыдущей версии)
const translations = {
  ru: {
    title: "CarFact.",
    labelVin: "VIN или номер кузова",
    labelMileage: "Пробег (км) — опционально",
    btnSubmit: "Показать ТО",
    nextTO: "Ближайшее техническое обслуживание",
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
    wheels: "Колёса и давление",
    tireSize: "Размер шин",
    pressure: "Давление (бар)",
    front: "перед",
    rear: "зад",
    japan: "Япония",
    china: "Китай",
    korea: "Корея",
    europe: "Европа",
    tireBrands: "Марки резины",
    vinDecoded: "Расшифровка VIN",
    bodyCodeDecoded: "Расшифровка кода кузова",
    manufacturer: "Производитель",
    model: "Модель",
    year: "Год выпуска",
    plant: "Завод",
    vinPrefix: "Префикс VIN",
    bodyCode: "Код кузова",
    maintenance: "Обслуживание",
    parts: "Запчасти",
    fluids: "Жидкости"
  },
  en: {
    title: "CarFact.",
    labelVin: "VIN or body number",
    labelMileage: "Mileage (km) — optional",
    btnSubmit: "Show Maintenance",
    nextTO: "Next Service",
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
    wheels: "Wheels & Tire Pressure",
    tireSize: "Tire size",
    pressure: "Pressure (bar)",
    front: "Front",
    rear: "Rear",
    japan: "Japan",
    china: "China",
    korea: "Korea",
    europe: "Europe",
    tireBrands: "Tire Brands",
    vinDecoded: "VIN Decoded",
    bodyCodeDecoded: "Body Code Decoded",
    manufacturer: "Manufacturer",
    model: "Model",
    year: "Year",
    plant: "Plant",
    vinPrefix: "VIN Prefix",
    bodyCode: "Body Code",
    maintenance: "Maintenance",
    parts: "Parts",
    fluids: "Fluids"
  }
};

function t(key) { 
  return translations[currentLang][key] || key; 
}

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

// Обновленная функция рендеринга с поддержкой расшифровки
function renderReport(result, mileage = 0) {
  if (!result) return;
  
  let html = '';
  
  switch (result.type) {
    case 'decoded':
      if (result.matched_car) {
        // Рендерим стандартный отчет для найденного авто
        html = renderCarReport(result.matched_car.data, mileage);
      } else {
        // Рендерим информацию о расшифровке
        html = renderVINInfo(result);
      }
      break;
      
    case 'name_search':
      html = renderSearchResults(result.results, mileage);
      break;
      
    case 'error':
      html = renderError(result.message);
      break;
      
    case 'not_found':
      html = renderError(result.message);
      break;
      
    default:
      // Стандартный отчет (для обратной совместимости)
      const carKey = typeof result === 'string' ? result : null;
      const carData = carKey ? carsData[carKey] : result;
      html = renderCarReport(carData, mileage);
  }
  
  document.getElementById('result').innerHTML = html;
  document.getElementById('result').style.display = 'block';
  
  // Подключаем обработчики для кругляшков
  setupToggleListeners();
}

function renderVINInfo(decoded) {
  return `
    <div class="card">
      <h2>${t('vinDecoded')}</h2>
      <div class="part-item"><strong>${t('manufacturer')}:</strong> ${decoded.manufacturer.name}</div>
      <div class="part-item"><strong>${t('year')}:</strong> ${decoded.year}</div>
      <div class="part-item"><strong>${t('plant')}:</strong> ${decoded.plant}</div>
      ${decoded.matched_car ? `
        <div class="part-item"><strong>${t('model')}:</strong> ${decoded.matched_car.data.name.ru}</div>
        <div class="part-item"><strong>${t('vinPrefix')}:</strong> ${decoded.matched_car.data.identification?.vin_prefixes?.join(', ') || '—'}</div>
        <div class="part-item"><strong>${t('bodyCode')}:</strong> ${decoded.matched_car.data.identification?.body_codes?.join(', ') || '—'}</div>
      ` : `
        <div class="part-item"><strong>Статус:</strong> Автомобиль найден в базе производителей, но нет данных для ТО</div>
        <div class="part-item">Рекомендуем уточнить модель и год выпуска</div>
      `}
    </div>
    
    <div class="card">
      <h3>${t('maintenance')}</h3>
      <div class="part-item">Для получения рекомендаций по ТО укажите точную модель автомобиля</div>
    </div>
  `;
}

function renderSearchResults(results, mileage) {
  let html = `
    <div class="card">
      <h2>Найдено совпадений: ${results.length}</h2>
    </div>
  `;
  
  results.forEach(result => {
    html += `
      <div class="card">
        <h3>${result.data.name.ru} ${result.data.year}</h3>
        <button class="primary search-select-btn" data-car-id="${result.id}">
          Показать ТО для этого автомобиля
        </button>
      </div>
    `;
  });
  
  return html;
}

function renderError(message) {
  return `
    <div class="card">
      <h2>Ошибка расшифровки</h2>
      <div class="part-item">${message}</div>
      <div class="part-item">Попробуйте:</div>
      <div class="part-item">• Проверить правильность VIN (17 символов)</div>
      <div class="part-item">• Указать полное название модели (например: "Toyota Prius 2021")</div>
      <div class="part-item">• Использовать код кузова (например: "ZVW50")</div>
    </div>
  `;
}

function renderCarReport(carData, mileage) {
  const nextTO = Math.ceil(mileage / carData.maintenance?.intervals?.oil_change || 10000) * 
                 (carData.maintenance?.intervals?.oil_change || 10000);
  const diff = nextTO - mileage;
  const isOverdue = diff < 0;

  const nowText = diff === 0 ? t('now') : (isOverdue ? t('overdue') : t('dueIn'));
  const diffValue = diff !== 0 ? Math.abs(diff) : '';
  const diffUnit = diff !== 0 ? t('km') : '';

  // Используем части из данных автомобиля
  const parts = carData.parts || {
    oil_filter: ["Toyota 04152-YZZA1", "Mann W 719/77"],
    air_filter: ["Toyota 17801-YZZ050", "Mann C 25 017"],
    cabin_filter: ["Toyota 87139-YZZ010", "Mann CU 2755"],
    fuel_filter: ["Toyota 23390-0L010"],
    spark_plugs: ["NGK LFR6AIX-11", "Denso SK20HR11"],
    brake_pads_front: ["Toyota 04465-0K060", "TRW GDB3469"],
    brake_pads_rear: ["Toyota 04466-0K060", "TRW GDB3470"]
  };

  // Используем шины из данных автомобиля
  const tires = carData.parts?.tires || {
    sizes: ["195/65 R15"],
    regions: {
      japan: ["Bridgestone", "Yokohama", "Toyo"],
      china: ["Triangle", "Sailun", "Double Coin"],
      korea: ["Kumho", "Nexen", "Hankook"],
      europe: ["Michelin", "Continental", "Goodyear"]
    }
  };

  let html = `
    <div class="card next-to-card">
      <h2>${t('nextTO')} <span class="service-distance">${human(nextTO)}</span></h2>
      <p class="next-to-diff">${nowText} ${diffValue} ${diffUnit}</p>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="oil">
        <h3>${t('oil')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <p>${t('every')} ${human(carData.maintenance?.intervals?.oil_change || 10000)}</p>
      <div id="oil" class="parts">
        <div class="part-item">${parts.oil_filter.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="filters">
        <h3>${t('filters')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('oilFilter')} — ${human(carData.maintenance?.intervals?.filters?.oil || 10000)}</li>
        <li>${t('airFilter')} — ${human(carData.maintenance?.intervals?.filters?.air || 20000)}</li>
        <li>${t('cabinFilter')} — ${human(carData.maintenance?.intervals?.filters?.cabin || 20000)}</li>
        ${parts.fuel_filter ? `<li>${t('fuelFilter')} — ${human(carData.maintenance?.intervals?.filters?.fuel || 40000)}</li>` : ''}
      </ul>
      <div id="filters" class="parts">
        <div class="part-item">${t('oilFilter')}: ${parts.oil_filter.join(', ')}</div>
        <div class="part-item">${t('airFilter')}: ${parts.air_filter.join(', ')}</div>
        <div class="part-item">${t('cabinFilter')}: ${parts.cabin_filter.join(', ')}</div>
        ${parts.fuel_filter ? `<div class="part-item">${t('fuelFilter')}: ${parts.fuel_filter.join(', ')}</div>` : ''}
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="spark">
        <h3>${t('sparkPlugs')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <p>${t('replaceAt')} ${human(carData.maintenance?.intervals?.spark_plugs || 100000)}</p>
      <div id="spark" class="parts">
        <div class="part-item">${parts.spark_plugs.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="brakes">
        <h3>${t('brakes')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('brakeFront')} — ${human(carData.maintenance?.intervals?.brake_pads?.front || 40000)}</li>
        <li>${t('brakeRear')} — ${human(carData.maintenance?.intervals?.brake_pads?.rear || 60000)}</li>
      </ul>
      <div id="brakes" class="parts">
        <div class="part-item">${t('brakeFront')}: ${parts.brake_pads_front.join(', ')}</div>
        <div class="part-item">${t('brakeRear')}: ${parts.brake_pads_rear.join(', ')}</div>
      </div>
    </div>

    <div class="card">
      <div class="toggle-container" data-toggle="wheels">
        <h3>${t('wheels')}</h3>
        <span class="toggle-circle"></span>
      </div>
      <ul>
        <li>${t('tireSize')}: <b>${tires.sizes[0]}</b></li>
        <li>${t('pressure')}: ${t('front')} — <b>2.3</b>, ${t('rear')} — <b>2.2</b></li>
      </ul>
      <div id="wheels" class="parts">
        <h4>${t('tireBrands')}</h4>
        <div class="regions-list">
          <div class="part-item">${t('japan')}: ${tires.regions.japan.join(', ')}</div>
          <div class="part-item">${t('china')}: ${tires.regions.china.join(', ')}</div>
          <div class="part-item">${t('korea')}: ${tires.regions.korea.join(', ')}</div>
          <div class="part-item">${t('europe')}: ${tires.regions.europe.join(', ')}</div>
        </div>
      </div>
    </div>
  `;

  return html;
}

function setupToggleListeners() {
  document.querySelectorAll('[data-toggle]').forEach(el => {
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
  
  // Обработчик для кнопок выбора из поиска
  document.querySelectorAll('.search-select-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const carId = this.getAttribute('data-car-id');
      const carData = sampleData[carId];
      const mileage = parseInt(document.getElementById('mileage').value) || 0;
      renderCarReport(carData, mileage);
      lastQuery = { carKey: carId, mileage: mileage };
    });
  });
}

// Исходные данные автомобилей (для обратной совместимости)
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
    tires: { 
      size: "195/65 R15", 
      pressure: { front: "2.3", rear: "2.2" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
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
    tires: { 
      size: "185/60 R15", 
      pressure: { front: "2.3", rear: "2.2" },
      regions: {
        japan: ["Bridgestone", "Yokohama", "Toyo"],
        china: ["Triangle", "Sailun", "Double Coin"],
        korea: ["Kumho", "Nexen", "Hankook"],
        europe: ["Michelin", "Continental", "Goodyear"]
      }
    }
  }
};

// Инициализация
function init() {
  // Сначала загружаем базу данных
  loadCarDatabase().then(success => {
    setLanguage(currentLang);
    setTheme(currentTheme);

    // Обработчики для кнопок
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
      
      const result = findCar(vin);
      if (result) {
        renderReport(result, mileage);
        lastQuery = { carKey: result, mileage: mileage };
      } else {
        const msg = currentLang === 'ru' 
          ? '<h2>Авто не найдено</h2><p>Попробуйте: Prius, Fit, ZVW50, JTDKN3E</p>' 
          : '<h2>Not found</h2><p>Try: Prius, Fit, ZVW50, JTDKN3E</p>';
        document.getElementById('result').innerHTML = `<div class="card">${msg}</div>`;
        document.getElementById('result').style.display = 'block';
        lastQuery = { carKey: null, mileage: 0 };
      }
    });

    document.getElementById('clearBtn').addEventListener('click', () => {
      document.getElementById('vin').value = '';
      document.getElementById('mileage').value = '';
      document.getElementById('result').innerHTML = '';
      document.getElementById('result').style.display = 'none';
    });

    document.addEventListener('keypress', e => {
      if (e.key === 'Enter') document.getElementById('submitBtn').click();
    });
  });
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', init);