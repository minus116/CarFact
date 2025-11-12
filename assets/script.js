// ... остальной код без изменений до renderReport ...

function renderReport(carKey, mileage) {
  const car = carsData[carKey];
  const nextTO = Math.ceil(mileage / car.intervals) * car.intervals;
  const diff = nextTO - mileage;
  const isOverdue = diff < 0;

  const nowText = diff === 0 ? t('now') : (isOverdue ? `${t('overdue')} ${Math.abs(diff)} ${t('km')}` : `${t('dueIn')} ${Math.abs(diff)} ${t('km')}`);
  
  const tireRegions = car.tires.regions;
  
  let html = `
    <div class="card next-to-card">
      <h2>${t('nextTO')} <span class="service-distance">${human(nextTO)}</span></h2>
      <p class="next-to-diff">${diff === 0 ? t('now') : nowText}</p>
    </div>

    <!-- остальные блоки без изменений -->
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

    <!-- Блок "Колёса и давление" — полное выравнивание по левому краю -->
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

  // ... остальной код без изменений ...
}