// assets/main.js - modular, readable, no external libraries
const qInput = document.getElementById('qInput');
const mileageInput = document.getElementById('mileageInput');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const statusEl = document.getElementById('status');
const resultsEl = document.getElementById('results');
const qError = document.getElementById('qError');
const mError = document.getElementById('mError');

function setStatus(text='') {
  statusEl.textContent = text;
}

function validateVinLike(value) {
  // Basic heuristic: VIN is 17 chars (letters+digits, excluding I,O,Q).
  if(!value) return {ok:false, msg:'Поле не должно быть пустым'};
  const v = value.replace(/\s+/g,'').toUpperCase();
  if(/^[A-HJ-NPR-Z0-9]{17}$/.test(v)) return {ok:true, normalized:v};
  // If not VIN, allow short chassis numbers or model names (len >=3)
  if(v.length >= 3) return {ok:true, normalized:v};
  return {ok:false, msg:'Некорректный VIN/номер кузова. VIN обычно 17 символов.'};
}

function validateMileage(value) {
  if(!value) return {ok:true, normalized:null}; // optional
  const v = value.replace(/\s+/g,'');
  if(/^[0-9]{1,7}$/.test(v)) return {ok:true, normalized:parseInt(v,10)};
  return {ok:false, msg:'Некорректный пробег. Только цифры.'};
}

function clearErrors(){
  qError.textContent = '';
  mError.textContent = '';
}

function renderResultCard(data){
  // data: an object with fields we expect; render gracefully if missing
  const card = document.createElement('article');
  card.className = 'card';
  const title = document.createElement('h3');
  title.textContent = data.title || (data.vin ? `VIN: ${data.vin}` : 'Результат');
  card.appendChild(title);

  const kv = document.createElement('div');
  kv.className = 'keyline';
  const items = [
    ['Модель', data.model],
    ['Пробег (км)', data.mileage],
    ['Следующее ТО', data.nextService],
    ['Примечание', data.note],
  ];
  items.forEach(([k,v])=>{
    const el = document.createElement('div');
    el.className = 'kv';
    el.innerHTML = `<strong>${k}:</strong> ${v ?? '<span style="color:#999">—</span>'}`;
    kv.appendChild(el);
  });
  card.appendChild(kv);
  return card;
}

async function fakeApiLookup(query, mileage) {
  // Placeholder: simulate network latency and return example structure.
  // Replace this with real fetch(...) to your backend/API.
  await new Promise(r=>setTimeout(r, 700));
  // If query contains '404' return empty
  if(String(query).toLowerCase().includes('404')) return null;
  return {
    vin: query,
    model: 'Toyota RAV4 2016',
    mileage: mileage ?? 120000,
    nextService: 'Замена масла через 5500 км',
    note: 'Данные демонстрационные — замените fakeApiLookup реальным запросом'
  };
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
  setStatus('Идёт поиск...');

  try {
    // Replace fakeApiLookup with actual API call, e.g.:
    // const resp = await fetch(`/api/check?q=${encodeURIComponent(vRes.normalized)}&m=${mRes.normalized||''}`);
    // const json = await resp.json();
    const json = await fakeApiLookup(vRes.normalized, mRes.normalized);

    if(!json){
      setStatus('Результаты не найдены.');
      return;
    }

    setStatus('');
    const card = renderResultCard(json);
    resultsEl.appendChild(card);

    // Optionally, keep history in localStorage (simple enhancement)
    try{
      const history = JSON.parse(localStorage.getItem('cf_history')||'[]');
      history.unshift({q:vRes.normalized, when:new Date().toISOString()});
      localStorage.setItem('cf_history', JSON.stringify(history.slice(0,30)));
    }catch(e){/*ignore*/}
  } catch(err){
    console.error(err);
    setStatus('Ошибка при выполнении запроса. Проверьте подключение или логи сервера.');
  } finally {
    submitBtn.disabled = false;
  }
});

clearBtn.addEventListener('click', ()=>{
  qInput.value=''; mileageInput.value=''; resultsEl.innerHTML=''; setStatus('');
  clearErrors();
});