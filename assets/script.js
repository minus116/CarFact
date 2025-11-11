"use strict";

let currentLang = localStorage.getItem("lang") || "ru";
let currentTheme = localStorage.getItem("theme") || (window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light");
let cars = {};

const resultEl = document.getElementById("result");
const errorMsg = document.getElementById("errorMsg");

const translations = {
  ru: {
    title: "CarFact",
    subtitle: "Введите VIN или номер кузова — узнайте, что менять и какие запчасти использовать",
    labelVin: "VIN / Номер кузова / Модель",
    labelMileage: "Пробег (км)",
    btnSubmit: "Показать ТО",
    notFound: "Авто не найдено",
    supported: "Поддерживаемые:",
  },
  en: {
    title: "CarFact",
    subtitle: "Enter VIN or body number — see what to service and which parts to use",
    labelVin: "VIN / Body No. / Model",
    labelMileage: "Mileage (km)",
    btnSubmit: "Show Maintenance",
    notFound: "Car not found",
    supported: "Supported:",
  },
};

function t(key){return translations[currentLang][key]||key;}
function setTheme(theme){currentTheme=theme;document.documentElement.setAttribute("data-theme",theme);document.getElementById("themeToggle").textContent=theme==="dark"?"🌙":"☀️";localStorage.setItem("theme",theme);}
function toggleTheme(){setTheme(currentTheme==="light"?"dark":"light");}
function setLanguage(lang){currentLang=lang;localStorage.setItem("lang",lang);document.documentElement.lang=lang;document.getElementById("langToggle").textContent=lang==="ru"?"RU":"EN";document.getElementById("pageTitle").textContent=t("title");document.getElementById("pageSubtitle").textContent=t("subtitle");document.getElementById("labelVin").textContent=t("labelVin");document.getElementById("labelMileage").textContent=t("labelMileage");document.getElementById("submitBtn").textContent=t("btnSubmit");}
function toggleLang(){setLanguage(currentLang==="ru"?"en":"ru");}
function showError(msg){errorMsg.textContent=msg;errorMsg.hidden=false;}
function clearError(){errorMsg.hidden=true;}
function human(km){const k=Math.floor(km/1000);return km>=1000?`${k}k km`:`${km} km`;}
function findCar(query){const normalized=query.toLowerCase().replace(/\s+/g,"");for(const key in cars){if(normalized.includes(key.replace(/\s+/g,"")))return key;}return null;}
function renderReport(carKey,mileage){const car=cars[carKey];if(!car)return;const nextTO=Math.ceil(mileage/car.intervals)*car.intervals;const diff=nextTO-mileage;const isOverdue=diff<0;let html=`<div class="card" style="border-left:4px solid var(--accent)"><h2>${currentLang==="ru"?"Следующее ТО":"Next Service"}</h2><p>${human(nextTO)} (${isOverdue?"overdue":"due in"} ${Math.abs(diff)} km)</p></div>`;html+=`<div class="card"><h3>Oil</h3><p>${car.oil.type} — ${car.oil.every} km</p></div>`;resultEl.innerHTML=html;resultEl.classList.add("fade-in");resultEl.scrollIntoView({behavior:"smooth"});}
fetch("assets/cars.json").then(r=>r.json()).then(d=>cars=d).catch(()=>showError("Ошибка загрузки данных автомобилей"));
document.getElementById("langToggle").addEventListener("click",toggleLang);
document.getElementById("themeToggle").addEventListener("click",toggleTheme);
document.getElementById("submitBtn").addEventListener("click",()=>{clearError();const vin=document.getElementById("vin").value.trim();const mileage=parseInt(document.getElementById("mileage").value)||0;if(!vin)return showError(t("labelVin")+"?");if(mileage<0||mileage>500000)return showError("Некорректный пробег");const carKey=findCar(vin);if(carKey)renderReport(carKey,mileage);else resultEl.innerHTML=`<div class="card"><h2>${t("notFound")}</h2><p>${t("supported")} Prius 2021, Fit 2020...</p></div>`;});
document.addEventListener("keypress",e=>{if(e.key==="Enter")document.getElementById("submitBtn").click();});
setTheme(currentTheme);
setLanguage(currentLang);
