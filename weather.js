/* ═══════════════════════════════════════════════════════════
   SkyWatch — Weather Dashboard  |  script.js
   Features: OpenWeatherMap API, Geolocation, AQI, AI tips,
             Farmer Advisory, Multi-language, Particles, Animations
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════
   CONFIGURATION
══════════════════════════════════ */
// 🔑 Replace with your OpenWeatherMap API key
const API_KEY = '59c19a47068137ec8f8b2cb9bf21f12e';
const BASE    = 'https://api.openweathermap.org';

/* ══════════════════════════════════
   STATE
══════════════════════════════════ */
let state = {
  unit:     'metric',   // 'metric' | 'imperial'
  lang:     'en',
  city:     'Mumbai',
  lat:      null,
  lon:      null,
  weather:  null,
  forecast: null,
  aqi:      null,
};

/* ══════════════════════════════════
   TRANSLATIONS
══════════════════════════════════ */
const T = {
  en: {
    aiRec: 'AI Recommendations', farmer: 'Farmer Advisory',
    forecast: '5-Day Forecast',  aqi: 'Air Quality',
    humidity: 'Humidity',        pressure: 'Pressure',
    visibility: 'Visibility',    wind: 'Wind',
    sun: 'Sun Schedule',         hourly: 'Hourly Forecast',
    sunrise: 'Sunrise',          sunset: 'Sunset',
    feelsLike: 'Feels like',     today: 'Today',
    loading: 'Fetching weather...',
    good:'Good', moderate:'Moderate', uss:'Unhealthy for Sensitive',
    unhealthy:'Unhealthy', veryUnhealthy:'Very Unhealthy', hazardous:'Hazardous',
    clearView:'Clear view', hazy:'Hazy', foggy:'Foggy', veryFoggy:'Very Foggy',
    normal:'Normal', high:'High', low:'Low',
  },
  hi: {
    aiRec: 'AI सुझाव', farmer: 'किसान सलाह',
    forecast: '5-दिन पूर्वानुमान', aqi: 'वायु गुणवत्ता',
    humidity: 'आर्द्रता', pressure: 'दबाव',
    visibility: 'दृश्यता', wind: 'हवा',
    sun: 'सूर्य समय', hourly: 'प्रति घंटा',
    sunrise: 'सूर्योदय', sunset: 'सूर्यास्त',
    feelsLike: 'महसूस', today: 'आज',
    loading: 'मौसम लाया जा रहा है...',
    good:'अच्छा', moderate:'मध्यम', uss:'संवेदनशीलों के लिए',
    unhealthy:'अस्वस्थ', veryUnhealthy:'बहुत अस्वस्थ', hazardous:'खतरनाक',
    clearView:'साफ दृश्य', hazy:'धुंधला', foggy:'कोहरा', veryFoggy:'घना कोहरा',
    normal:'सामान्य', high:'अधिक', low:'कम',
  },
  te: {
    aiRec: 'AI సూచనలు', farmer: 'రైతు సలహా',
    forecast: '5-రోజుల అంచనా', aqi: 'వాయు నాణ్యత',
    humidity: 'తేమ', pressure: 'పీడనం',
    visibility: 'దృశ్యమానత', wind: 'గాలి',
    sun: 'సూర్య సమయం', hourly: 'గంటవారీ',
    sunrise: 'సూర్యోదయం', sunset: 'సూర్యాస్తమయం',
    feelsLike: 'అనిపిస్తుంది', today: 'ఈరోజు',
    loading: 'వాతావరణం తెస్తున్నాం...',
    good:'మంచిది', moderate:'మధ్యమం', uss:'సున్నితులకు',
    unhealthy:'అనారోగ్యకర', veryUnhealthy:'చాలా అనారోగ్యకర', hazardous:'ప్రమాదకర',
    clearView:'స్పష్టం', hazy:'మసకగా', foggy:'పొగమంచు', veryFoggy:'దట్టమైన పొగమంచు',
    normal:'సాధారణ', high:'అధిక', low:'తక్కువ',
  },
  ta: {
    aiRec: 'AI பரிந்துரைகள்', farmer: 'விவசாயி ஆலோசனை',
    forecast: '5-நாள் முன்னறிவிப்பு', aqi: 'காற்று தரம்',
    humidity: 'ஈரப்பதம்', pressure: 'அழுத்தம்',
    visibility: 'தெரிவுத்திறன்', wind: 'காற்று',
    sun: 'சூரிய நேரம்', hourly: 'மணிநேர',
    sunrise: 'சூரிய உதயம்', sunset: 'சூரிய அஸ்தமனம்',
    feelsLike: 'உணர்வு', today: 'இன்று',
    loading: 'வானிலை கொண்டுவருகிறோம்...',
    good:'நல்லது', moderate:'மிதமானது', uss:'உணர்திறனுள்ளவர்களுக்கு',
    unhealthy:'ஆரோக்கியமற்றது', veryUnhealthy:'மிகவும் ஆரோக்கியமற்றது', hazardous:'ஆபத்தானது',
    clearView:'தெளிவான காட்சி', hazy:'மங்கலாக', foggy:'மூடுபனி', veryFoggy:'அடர் மூடுபனி',
    normal:'சாதாரண', high:'அதிக', low:'குறைவான',
  },
  kn: {
    aiRec: 'AI ಶಿಫಾರಸುಗಳು', farmer: 'ರೈತ ಸಲಹೆ',
    forecast: '5-ದಿನ ಮುನ್ಸೂಚನೆ', aqi: 'ಗಾಳಿ ಗುಣಮಟ್ಟ',
    humidity: 'ಆರ್ದ್ರತೆ', pressure: 'ಒತ್ತಡ',
    visibility: 'ದೃಶ್ಯತೆ', wind: 'ಗಾಳಿ',
    sun: 'ಸೂರ್ಯ ಸಮಯ', hourly: 'ಗಂಟೆ ಮುನ್ಸೂಚನೆ',
    sunrise: 'ಸೂರ್ಯೋದಯ', sunset: 'ಸೂರ್ಯಾಸ್ತ',
    feelsLike: 'ಅನುಭವ', today: 'ಇಂದು',
    loading: 'ಹವಾಮಾನ ತರುತ್ತಿದ್ದೇವೆ...',
    good:'ಉತ್ತಮ', moderate:'ಮಧ್ಯಮ', uss:'ಸೂಕ್ಷ್ಮ ವ್ಯಕ್ತಿಗಳಿಗೆ',
    unhealthy:'ಅನಾರೋಗ್ಯಕರ', veryUnhealthy:'ತುಂಬಾ ಅನಾರೋಗ್ಯಕರ', hazardous:'ಅಪಾಯಕಾರಿ',
    clearView:'ಸ್ಪಷ್ಟ ದೃಶ್ಯ', hazy:'ಮಂಜುಮುಸುಕು', foggy:'ಮಂಜು', veryFoggy:'ದಟ್ಟ ಮಂಜು',
    normal:'ಸಾಮಾನ್ಯ', high:'ಹೆಚ್ಚು', low:'ಕಡಿಮೆ',
  },
};
const t = () => T[state.lang] || T.en;

/* ══════════════════════════════════
   WEATHER ICON EMOJIS
══════════════════════════════════ */
const WEATHER_ICONS = {
  '01d': '☀️', '01n': '🌙',
  '02d': '🌤️', '02n': '🌤️',
  '03d': '☁️', '03n': '☁️',
  '04d': '🌥️', '04n': '🌥️',
  '09d': '🌧️', '09n': '🌧️',
  '10d': '🌦️', '10n': '🌧️',
  '11d': '⛈️', '11n': '⛈️',
  '13d': '🌨️', '13n': '🌨️',
  '50d': '🌫️', '50n': '🌫️',
};

/* ══════════════════════════════════
   DOM REFS
══════════════════════════════════ */
const $ = id => document.getElementById(id);
const dom = {
  body:           document.body,
  cityInput:      $('city-input'),
  searchBtn:      $('search-btn'),
  locateBtn:      $('locate-btn'),
  langSelect:     $('lang-select'),
  unitToggle:     $('unit-toggle'),
  toggleThumb:    $('toggle-thumb'),
  toggleC:        $('toggle-c'),
  toggleF:        $('toggle-f'),
  autocomplete:   $('autocomplete-dropdown'),
  loadingOverlay: $('loading-overlay'),
  loadingText:    $('loading-text'),
  toast:          $('toast'),
  toastMsg:       $('toast-msg'),
  // Current weather
  cityName:       $('city-name'),
  countryName:    $('country-name'),
  currentDate:    $('current-date'),
  weatherIcon:    $('weather-anim-icon'),
  mainTemp:       $('main-temp'),
  feelsLike:      $('feels-like'),
  weatherDesc:    $('weather-desc'),
  tempHigh:       $('temp-high'),
  tempLow:        $('temp-low'),
  qsHumidity:     $('qs-humidity'),
  qsWind:         $('qs-wind'),
  qsVis:          $('qs-visibility'),
  qsPressure:     $('qs-pressure'),
  // Widgets
  aiRecs:         $('ai-recommendations'),
  advisoryText:   $('advisory-text'),
  forecastList:   $('forecast-list'),
  aqiCard:        $('aqi-card'),
  aqiValue:       $('aqi-value'),
  aqiLabel:       $('aqi-label'),
  aqiFill:        $('aqi-bar-fill'),
  humidityArc:    $('humidity-arc'),
  humidityVal:    $('humidity-val'),
  pressureValue:  $('pressure-value'),
  pressureTrend:  $('pressure-trend'),
  pressureFill:   $('pressure-fill'),
  visValue:       $('visibility-value'),
  visDesc:        $('visibility-desc'),
  windSpeed:      $('wind-speed-display'),
  windDir:        $('wind-dir-display'),
  compassNeedle:  $('compass-needle'),
  sunriseTime:    $('sunrise-time'),
  sunsetTime:     $('sunset-time'),
  sunDot:         $('sun-dot'),
  sunArcPath:     $('sun-arc-path'),
  hourlyScroll:   $('hourly-scroll'),
  lastUpdated:    $('last-updated'),
  canvas:         $('particles-canvas'),
};

/* ══════════════════════════════════
   LOCAL STORAGE
══════════════════════════════════ */
function saveSettings() {
  localStorage.setItem('skywatch-settings', JSON.stringify({
    unit: state.unit, lang: state.lang, city: state.city
  }));
}
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem('skywatch-settings') || '{}');
    if (s.unit) state.unit = s.unit;
    if (s.lang) state.lang = s.lang;
    if (s.city) state.city = s.city;
  } catch(e) {}
}

/* ══════════════════════════════════
   API CALLS
══════════════════════════════════ */
async function fetchWeather(query) {
  showLoading(true);
  try {
    let weatherUrl, forecastUrl;
    if (typeof query === 'object' && query.lat) {
      const { lat, lon } = query;
      weatherUrl  = `${BASE}/data/2.5/weather?lat=${lat}&lon=${lon}&units=${state.unit}&appid=${API_KEY}`;
      forecastUrl = `${BASE}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${state.unit}&appid=${API_KEY}`;
    } else {
      weatherUrl  = `${BASE}/data/2.5/weather?q=${encodeURIComponent(query)}&units=${state.unit}&appid=${API_KEY}`;
      forecastUrl = `${BASE}/data/2.5/forecast?q=${encodeURIComponent(query)}&units=${state.unit}&appid=${API_KEY}`;
    }

    const [wRes, fRes] = await Promise.all([
      fetch(weatherUrl), fetch(forecastUrl)
    ]);

    if (!wRes.ok) throw new Error(wRes.status === 404 ? 'City not found.' : 'Weather API error.');
    if (!fRes.ok) throw new Error('Forecast API error.');

    const [weather, forecast] = await Promise.all([wRes.json(), fRes.json()]);

    state.weather  = weather;
    state.forecast = forecast;
    state.lat      = weather.coord.lat;
    state.lon      = weather.coord.lon;
    state.city     = weather.name;

    await fetchAQI(state.lat, state.lon);
    renderAll();
    saveSettings();

  } catch (err) {
    showToast(err.message || 'Could not fetch weather.');
  } finally {
    showLoading(false);
  }
}

async function fetchAQI(lat, lon) {
  try {
    const res = await fetch(`${BASE}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (res.ok) {
      const data = await res.json();
      state.aqi = data.list?.[0] || null;
    }
  } catch(e) { state.aqi = null; }
}

/* ══════════════════════════════════
   RENDER — MAIN ORCHESTRATOR
══════════════════════════════════ */
function renderAll() {
  if (!state.weather) return;
  renderCurrentWeather();
  renderForecast();
  renderHourly();
  renderMetrics();
  renderAI();
  renderFarmerAdvisory();
  applyWeatherTheme();
  updateLabels();
  dom.lastUpdated.textContent = 'Updated just now';
}

/* ── Current Weather ── */
function renderCurrentWeather() {
  const w    = state.weather;
  const main = w.main;
  const unit = state.unit === 'metric' ? '°C' : '°F';
  const wSpd = state.unit === 'metric'
    ? `${Math.round(w.wind.speed * 3.6)} km/h`
    : `${Math.round(w.wind.speed)} mph`;

  dom.cityName.textContent    = w.name;
  dom.countryName.textContent = w.sys.country;
  dom.currentDate.textContent = formatDate(new Date());
  dom.weatherIcon.textContent = WEATHER_ICONS[w.weather[0].icon] || '🌡️';
  dom.mainTemp.textContent    = `${Math.round(main.temp)}${unit}`;
  dom.feelsLike.textContent   = `${t().feelsLike} ${Math.round(main.feels_like)}${unit}`;
  dom.weatherDesc.textContent = w.weather[0].description;
  dom.tempHigh.innerHTML      = `<i class="fa-solid fa-arrow-up"></i> ${Math.round(main.temp_max)}${unit}`;
  dom.tempLow.innerHTML       = `<i class="fa-solid fa-arrow-down"></i> ${Math.round(main.temp_min)}${unit}`;

  dom.qsHumidity.textContent  = `${main.humidity}%`;
  dom.qsWind.textContent      = wSpd;
  dom.qsVis.textContent       = `${(w.visibility / 1000).toFixed(1)} km`;
  dom.qsPressure.textContent  = `${main.pressure} hPa`;
}

/* ── 5-Day Forecast ── */
function renderForecast() {
  const fc  = state.forecast.list;
  const unit = state.unit === 'metric' ? '°C' : '°F';

  // Group by day: pick noon slot
  const days = {};
  fc.forEach(item => {
    const d = new Date(item.dt * 1000);
    const key = d.toDateString();
    const hour = d.getHours();
    if (!days[key] || Math.abs(hour - 12) < Math.abs(new Date(days[key].dt * 1000).getHours() - 12)) {
      days[key] = item;
    }
  });

  const dayArr = Object.values(days).slice(0, 5);
  const temps  = dayArr.map(d => d.main.temp);
  const minAll = Math.min(...temps);
  const maxAll = Math.max(...temps);

  dom.forecastList.innerHTML = dayArr.map((item, i) => {
    const d       = new Date(item.dt * 1000);
    const dayName = i === 0 ? `<span class="fc-day today">${t().today}</span>` : `<span class="fc-day">${shortDay(d)}</span>`;
    const icon    = WEATHER_ICONS[item.weather[0].icon] || '🌡️';
    const pct     = maxAll > minAll
      ? Math.round(((item.main.temp - minAll) / (maxAll - minAll)) * 100)
      : 50;
    return `
      <div class="forecast-item">
        ${dayName}
        <div class="fc-icon">${icon}</div>
        <div class="fc-bar-wrap">
          <span class="fc-low">${Math.round(item.main.temp_min)}${unit}</span>
          <div class="fc-temp-bar"><div class="fc-temp-fill" style="width:${pct}%"></div></div>
          <span class="fc-high">${Math.round(item.main.temp_max)}${unit}</span>
        </div>
        <div class="fc-desc">${item.weather[0].description}</div>
      </div>`;
  }).join('');
}

/* ── Hourly Forecast ── */
function renderHourly() {
  const items = state.forecast.list.slice(0, 12);
  const unit  = state.unit === 'metric' ? '°C' : '°F';
  const now   = Date.now() / 1000;

  dom.hourlyScroll.innerHTML = items.map((item, i) => {
    const isNow  = i === 0;
    const d      = new Date(item.dt * 1000);
    const hrStr  = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    const icon   = WEATHER_ICONS[item.weather[0].icon] || '🌡️';
    const rainPct= item.pop ? `${Math.round(item.pop * 100)}%` : '';
    return `
      <div class="hourly-item${isNow ? ' now' : ''}">
        <span class="hr-time${isNow ? ' now-label' : ''}">${isNow ? 'Now' : hrStr}</span>
        <span class="hr-icon">${icon}</span>
        <span class="hr-temp">${Math.round(item.main.temp)}${unit}</span>
        ${rainPct ? `<span class="hr-rain">💧${rainPct}</span>` : '<span class="hr-rain"></span>'}
      </div>`;
  }).join('');
}

/* ── Metrics ── */
function renderMetrics() {
  const w    = state.weather;
  const main = w.main;
  const unit = state.unit === 'metric' ? '°C' : '°F';

  // --- AQI ---
  if (state.aqi) {
    const aqi = state.aqi.main.aqi; // 1-5
    const aqiData = [
      { label: t().good,         class: 'aqi-good',      pct: 15 },
      { label: t().moderate,     class: 'aqi-moderate',  pct: 35 },
      { label: t().uss,          class: 'aqi-poor',      pct: 55 },
      { label: t().unhealthy,    class: 'aqi-poor',      pct: 70 },
      { label: t().veryUnhealthy,class: 'aqi-very-poor', pct: 90 },
    ];
    const d = aqiData[aqi - 1] || aqiData[0];
    dom.aqiValue.textContent = aqi * 50;
    dom.aqiLabel.textContent = d.label;
    dom.aqiFill.style.width  = d.pct + '%';
    dom.aqiCard.className    = 'card metric-card aqi-card ' + d.class;
  }

  // --- Humidity Arc (SVG stroke-dashoffset) ---
  const hum = main.humidity;
  const arcLen = 141.37;
  const offset = arcLen - (arcLen * hum / 100);
  dom.humidityArc.style.strokeDashoffset = offset;
  dom.humidityVal.textContent = `${hum}%`;

  // --- Pressure ---
  const pres = main.pressure;
  dom.pressureValue.textContent = `${pres} hPa`;
  let pressTrend = '';
  if (pres > 1020)      pressTrend = `<i class="fa-solid fa-arrow-up"></i> ${t().high}`;
  else if (pres < 1000) pressTrend = `<i class="fa-solid fa-arrow-down"></i> ${t().low}`;
  else                  pressTrend = `<i class="fa-solid fa-minus"></i> ${t().normal}`;
  dom.pressureTrend.innerHTML = pressTrend;
  const pressPct = Math.min(100, Math.max(0, ((pres - 950) / 100) * 100));
  dom.pressureFill.style.width = pressPct + '%';

  // --- Visibility ---
  const vis  = (w.visibility / 1000).toFixed(1);
  dom.visValue.textContent = `${vis} km`;
  const visDots = document.querySelectorAll('.vis-dot');
  let visLevel = 0, visDesc = '';
  if (w.visibility >= 10000) { visLevel = 5; visDesc = t().clearView; }
  else if (w.visibility >= 7000) { visLevel = 4; visDesc = t().clearView; }
  else if (w.visibility >= 4000) { visLevel = 3; visDesc = t().hazy; }
  else if (w.visibility >= 1000) { visLevel = 2; visDesc = t().foggy; }
  else                           { visLevel = 1; visDesc = t().veryFoggy; }
  visDots.forEach((dot, i) => dot.classList.toggle('active', i < visLevel));
  dom.visDesc.textContent = visDesc;

  // --- Wind Compass ---
  const speed = state.unit === 'metric'
    ? `${Math.round(w.wind.speed * 3.6)} km/h`
    : `${Math.round(w.wind.speed)} mph`;
  dom.windSpeed.textContent = speed;
  dom.windDir.textContent   = degToCompass(w.wind.deg || 0);
  dom.compassNeedle.style.transform = `rotate(${w.wind.deg || 0}deg)`;

  // --- Sunrise / Sunset ---
  const rise    = new Date(w.sys.sunrise * 1000);
  const set_    = new Date(w.sys.sunset  * 1000);
  const now     = new Date();
  dom.sunriseTime.textContent = rise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  dom.sunsetTime.textContent  = set_.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  animateSunArc(rise, set_, now);
}

/* ── AI Recommendations ── */
function renderAI() {
  const w   = state.weather;
  const tmp = w.main.temp;
  const id  = w.weather[0].id;
  const hum = w.main.humidity;
  const unit = state.unit === 'metric' ? '°C' : '°F';
  const isMetric = state.unit === 'metric';

  const tips  = [];
  const lo = isMetric ? 10 : 50;
  const hi = isMetric ? 35 : 95;
  const warm= isMetric ? 28 : 82;
  const cold= isMetric ? 15 : 59;
  const hot = isMetric ? 32 : 90;

  // Clothing
  if (tmp < lo)         tips.push({ icon:'🧥', text: langTip('heavyJacket'), cls: 'clothing' });
  else if (tmp < cold)  tips.push({ icon:'🧣', text: langTip('jacket'),      cls: 'clothing' });
  else if (tmp < warm)  tips.push({ icon:'👕', text: langTip('light'),       cls: 'clothing' });
  else                  tips.push({ icon:'🩳', text: langTip('shorts'),      cls: 'clothing' });

  // Weather-based
  if (id >= 200 && id < 300) tips.push({ icon:'⛈️', text: langTip('thunder'), cls: 'activity' });
  if (id >= 300 && id < 600) tips.push({ icon:'☂️', text: langTip('umbrella'), cls: 'activity' });
  if (id >= 600 && id < 700) tips.push({ icon:'🥶', text: langTip('snow'),    cls: 'health' });
  if (id >= 700 && id < 800) tips.push({ icon:'😷', text: langTip('mask'),    cls: 'health' });
  if (id === 800)             tips.push({ icon:'😎', text: langTip('sunny'),   cls: 'activity' });
  if (id > 800)               tips.push({ icon:'🌥️', text: langTip('cloudy'), cls: 'activity' });

  // Health tips
  if (tmp > hot)    tips.push({ icon:'💧', text: langTip('hydrate'), cls: 'health' });
  if (hum > 80)     tips.push({ icon:'🌊', text: langTip('humid'),   cls: 'health' });
  if (hum < 30)     tips.push({ icon:'🌵', text: langTip('dry'),     cls: 'health' });

  dom.aiRecs.innerHTML = tips.map((tip, i) => `
    <div class="ai-chip ${tip.cls}" style="animation-delay:${i*0.08}s">
      <span>${tip.icon}</span> ${tip.text}
    </div>`).join('');
}

/* ── Farmer Advisory ── */
function renderFarmerAdvisory() {
  const w      = state.weather;
  const tmp    = w.main.temp;
  const hum    = w.main.humidity;
  const id     = w.weather[0].id;
  const wind   = w.wind.speed * 3.6;
  const isMetric = state.unit === 'metric';
  const tips   = [];

  if (id >= 200 && id < 300)    tips.push(langFarm('thunderNoWork'));
  if (id >= 300 && id < 600)    tips.push(langFarm('rainHarvest'));
  if (id >= 600 && id < 700)    tips.push(langFarm('snowFrost'));
  if (id === 800 && tmp > (isMetric ? 35 : 95)) tips.push(langFarm('hotDrip'));
  if (id === 800)               tips.push(langFarm('sunnySpray'));
  if (hum > 80)                 tips.push(langFarm('highHumFungus'));
  if (hum < 40)                 tips.push(langFarm('lowHumIrrigate'));
  if (wind > 40)                tips.push(langFarm('highWindSpray'));
  if (wind < 15 && id === 800)  tips.push(langFarm('calmSunSpray'));
  if (tmp > (isMetric ? 25 : 77) && hum > 60) tips.push(langFarm('warmHumPest'));

  if (tips.length === 0) tips.push(langFarm('default'));
  dom.advisoryText.innerHTML = tips.map(t => `• ${t}`).join('<br/>');
}

/* ══════════════════════════════════
   LANGUAGE-AWARE TIP HELPERS
══════════════════════════════════ */
function langTip(key) {
  const tips = {
    en: {
      heavyJacket:'Wear a heavy jacket & layers',
      jacket:'Light jacket recommended',
      light:'Light cotton clothes ideal',
      shorts:'T-shirt & shorts weather',
      thunder:'Stay indoors — thunderstorm risk',
      umbrella:'Carry an umbrella',
      snow:'Wear boots & waterproof clothes',
      mask:'Wear a mask — low visibility',
      sunny:'Apply sunscreen SPF 30+',
      cloudy:'Good for outdoor activities',
      hydrate:'Stay hydrated — drink water',
      humid:'Humidity high — wear breathable fabric',
      dry:'Dry air — use lip balm & moisturiser',
    },
    hi: {
      heavyJacket:'भारी जैकेट पहनें',
      jacket:'हल्का जैकेट लें',
      light:'सूती कपड़े पहनें',
      shorts:'हल्के कपड़े पहनें',
      thunder:'घर में रहें — आंधी का खतरा',
      umbrella:'छाता साथ रखें',
      snow:'जलरोधक कपड़े पहनें',
      mask:'मास्क पहनें — कम दृश्यता',
      sunny:'सनस्क्रीन लगाएं',
      cloudy:'बाहरी गतिविधि के लिए अच्छा',
      hydrate:'पानी पीते रहें',
      humid:'नमी अधिक — सांस लेने वाले कपड़े',
      dry:'शुष्क हवा — मॉइस्चराइजर लगाएं',
    },
    te: {
      heavyJacket:'భారీ జాకెట్ వేసుకోండి',
      jacket:'తేలిక జాకెట్ తీసుకోండి',
      light:'సూతి దుస్తులు వేసుకోండి',
      shorts:'తేలిక దుస్తులు',
      thunder:'ఇంట్లో ఉండండి — గాలివాన',
      umbrella:'గొడుగు తీసుకోండి',
      snow:'వాటర్‌ప్రూఫ్ దుస్తులు',
      mask:'మాస్క్ వేయండి',
      sunny:'సన్‌స్క్రీన్ వేసుకోండి',
      cloudy:'బయట కార్యకలాపాలకు మంచిది',
      hydrate:'నీళ్ళు తాగుతూ ఉండండి',
      humid:'తేమ ఎక్కువ — గాలి పీల్చే బట్టలు',
      dry:'పొడి గాలి — మాయిశ్చరైజర్ వాడండి',
    },
    ta: {
      heavyJacket:'கனமான ஜாக்கெட் அணியுங்கள்',
      jacket:'இலகுவான ஜாக்கெட் எடுங்கள்',
      light:'பருத்தி ஆடை அணியுங்கள்',
      shorts:'இலகுவான ஆடைகள் அணியுங்கள்',
      thunder:'உள்ளே இருங்கள் — இடி மின்னல்',
      umbrella:'குடை எடுத்துச் செல்லுங்கள்',
      snow:'நீர் புகா ஆடைகள் அணியுங்கள்',
      mask:'முகக்கவசம் அணியுங்கள்',
      sunny:'சன்ஸ்கிரீன் போடுங்கள்',
      cloudy:'வெளி செயல்பாடுகளுக்கு நல்லது',
      hydrate:'தண்ணீர் குடிங்கள்',
      humid:'ஈரப்பதம் அதிகம் — காற்று புகும் ஆடை',
      dry:'வறண்ட காற்று — மாயிஸ்சரைசர் பயன்படுத்தவும்',
    },
    kn: {
      heavyJacket:'ಭಾರೀ ಜಾಕೆಟ್ ಧರಿಸಿ',
      jacket:'ಲಘು ಜಾಕೆಟ್ ತೆಗೆದುಕೊಳ್ಳಿ',
      light:'ಹತ್ತಿ ಬಟ್ಟೆ ಧರಿಸಿ',
      shorts:'ಲಘು ಬಟ್ಟೆಗಳು',
      thunder:'ಒಳಗೆ ಇರಿ — ಗುಡುಗು ಅಪಾಯ',
      umbrella:'ಛತ್ರಿ ತೆಗೆದುಕೊಳ್ಳಿ',
      snow:'ವಾಟರ್‌ಪ್ರೂಫ್ ಬಟ್ಟೆ ಧರಿಸಿ',
      mask:'ಮಾಸ್ಕ್ ಧರಿಸಿ',
      sunny:'ಸನ್‌ಸ್ಕ್ರೀನ್ ಹಚ್ಚಿ',
      cloudy:'ಹೊರಾಂಗಣ ಚಟುವಟಿಕೆಗಳಿಗೆ ಒಳ್ಳೆಯದು',
      hydrate:'ನೀರು ಕುಡಿಯಿರಿ',
      humid:'ಆರ್ದ್ರತೆ ಹೆಚ್ಚು — ಉಸಿರಾಡಬಲ್ಲ ಬಟ್ಟೆ',
      dry:'ಶುಷ್ಕ ಗಾಳಿ — ಮಾಯಿಸ್ಚರೈಸರ್ ಬಳಸಿ',
    },
  };
  return (tips[state.lang] || tips.en)[key] || (tips.en)[key] || key;
}

function langFarm(key) {
  const farm = {
    en: {
      thunderNoWork:'⚡ Avoid fieldwork — thunderstorm expected',
      rainHarvest:'🌧️ Harvest ready crops before rain arrives',
      snowFrost:'❄️ Protect crops from frost damage',
      hotDrip:'🌡️ Use drip irrigation to minimise water loss in heat',
      sunnySpray:'☀️ Ideal day for pesticide/fertiliser spraying',
      highHumFungus:'🍄 High humidity — watch for fungal diseases',
      lowHumIrrigate:'💧 Low humidity — increase irrigation frequency',
      highWindSpray:'💨 Strong winds — avoid spraying today',
      calmSunSpray:'🌿 Calm & sunny — perfect spraying conditions',
      warmHumPest:'🐛 Warm + humid conditions favour pests — inspect crops',
      default:'🌱 Conditions stable — routine farm activities recommended',
    },
    hi: {
      thunderNoWork:'⚡ खेत में काम न करें — आंधी की संभावना',
      rainHarvest:'🌧️ बारिश से पहले फसल काटें',
      snowFrost:'❄️ पाले से फसल की रक्षा करें',
      hotDrip:'🌡️ गर्मी में टपक सिंचाई करें',
      sunnySpray:'☀️ कीटनाशक छिड़काव के लिए अच्छा दिन',
      highHumFungus:'🍄 नमी ज़्यादा — फफूंदी रोग की जांच करें',
      lowHumIrrigate:'💧 कम नमी — सिंचाई बढ़ाएं',
      highWindSpray:'💨 तेज़ हवा — आज छिड़काव न करें',
      calmSunSpray:'🌿 शांत व धूप — छिड़काव के लिए उत्तम',
      warmHumPest:'🐛 गर्म व नम — कीट की जांच करें',
      default:'🌱 मौसम सामान्य — नियमित कृषि कार्य करें',
    },
    te: {
      thunderNoWork:'⚡ పొలంలో పని చేయవద్దు — ఉరుముల హెచ్చరిక',
      rainHarvest:'🌧️ వర్షానికి ముందు పంటను కోయండి',
      snowFrost:'❄️ పంటను మంచు నుండి కాపాడండి',
      hotDrip:'🌡️ వేడిలో బిందు సేద్యం వాడండి',
      sunnySpray:'☀️ పురుగు మందు పిచికారీకి మంచి రోజు',
      highHumFungus:'🍄 ఆర్ద్రత ఎక్కువ — శిలీంద్ర వ్యాధులు గమనించండి',
      lowHumIrrigate:'💧 తక్కువ ఆర్ద్రత — నీరు ఎక్కువగా ఇవ్వండి',
      highWindSpray:'💨 తేజ గాలులు — నేడు పిచికారీ వద్దు',
      calmSunSpray:'🌿 ప్రశాంతంగా ఉంది — పిచికారీకి మంచి',
      warmHumPest:'🐛 వేడి + తేమ — పురుగుల పరీక్ష చేయండి',
      default:'🌱 వాతావరణం సాధారణం — వ్యవసాయ పనులు చేయండి',
    },
    ta: {
      thunderNoWork:'⚡ வயல் வேலை வேண்டாம் — இடி மின்னல்',
      rainHarvest:'🌧️ மழைக்கு முன் பயிர் அறுவடை செய்யுங்கள்',
      snowFrost:'❄️ பனியில் இருந்து பயிரை பாதுகாத்துக்கொள்ளுங்கள்',
      hotDrip:'🌡️ வெப்பத்தில் சொட்டு நீர்ப்பாசனம் பயன்படுத்துங்கள்',
      sunnySpray:'☀️ பூச்சி மருந்து தெளிக்க நல்ல நாள்',
      highHumFungus:'🍄 அதிக ஈரப்பதம் — பூஞ்சை நோய் கவனிக்கவும்',
      lowHumIrrigate:'💧 குறைந்த ஈரப்பதம் — பாசனம் அதிகரிக்கவும்',
      highWindSpray:'💨 பலத்த காற்று — இன்று தெளிக்க வேண்டாம்',
      calmSunSpray:'🌿 அமைதியான நேரம் — தெளிக்க சிறந்தது',
      warmHumPest:'🐛 வெப்பம் + ஈரம் — பூச்சி ஆய்வு செய்யுங்கள்',
      default:'🌱 வானிலை சாதாரணம் — வழக்கமான பண்ணை வேலைகள்',
    },
    kn: {
      thunderNoWork:'⚡ ಹೊಲದ ಕೆಲಸ ಬೇಡ — ಗುಡುಗು ಎಚ್ಚರಿಕೆ',
      rainHarvest:'🌧️ ಮಳೆ ಮೊದಲು ಬೆಳೆ ಕಟಾವು ಮಾಡಿ',
      snowFrost:'❄️ ಹಿಮದಿಂದ ಬೆಳೆ ರಕ್ಷಿಸಿ',
      hotDrip:'🌡️ ಬಿಸಿಲಿನಲ್ಲಿ ಹನಿ ನೀರಾವರಿ ಬಳಸಿ',
      sunnySpray:'☀️ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಲು ಒಳ್ಳೆಯ ದಿನ',
      highHumFungus:'🍄 ಆರ್ದ್ರತೆ ಹೆಚ್ಚು — ಶಿಲೀಂಧ್ರ ರೋಗ ನೋಡಿ',
      lowHumIrrigate:'💧 ಕಡಿಮೆ ಆರ್ದ್ರತೆ — ನೀರಾವರಿ ಹೆಚ್ಚಿಸಿ',
      highWindSpray:'💨 ತೀವ್ರ ಗಾಳಿ — ಇಂದು ಸಿಂಪಡಿಸಬೇಡಿ',
      calmSunSpray:'🌿 ಶಾಂತ ಮತ್ತು ಬಿಸಿಲು — ಸಿಂಪಡಿಸಲು ಸೂಕ್ತ',
      warmHumPest:'🐛 ಬೆಚ್ಚನೆ + ಆರ್ದ್ರ — ಕೀಟ ತಪಾಸಣೆ ಮಾಡಿ',
      default:'🌱 ವಾತಾವರಣ ಸಾಮಾನ್ಯ — ನಿಯಮಿತ ಕೃಷಿ ಚಟುವಟಿಕೆ',
    },
  };
  return (farm[state.lang] || farm.en)[key] || (farm.en)[key] || key;
}

/* ══════════════════════════════════
   WEATHER THEME (BG + PARTICLES)
══════════════════════════════════ */
function applyWeatherTheme() {
  const w    = state.weather;
  const id   = w.weather[0].id;
  const icon = w.weather[0].icon;
  const isNight = icon.endsWith('n');

  const body  = dom.body;
  const classes = [
    'weather-default','weather-clear','weather-sunny','weather-clouds',
    'weather-rain','weather-drizzle','weather-thunderstorm','weather-snow',
    'weather-mist','weather-night'
  ];
  classes.forEach(c => body.classList.remove(c));

  let theme = 'weather-default';
  if (isNight)                        theme = 'weather-night';
  else if (id === 800)                theme = 'weather-sunny';
  else if (id > 800)                  theme = 'weather-clouds';
  else if (id >= 200 && id < 300)     theme = 'weather-thunderstorm';
  else if (id >= 300 && id < 400)     theme = 'weather-drizzle';
  else if (id >= 500 && id < 600)     theme = 'weather-rain';
  else if (id >= 600 && id < 700)     theme = 'weather-snow';
  else if (id >= 700 && id < 800)     theme = 'weather-mist';

  body.classList.add(theme);
  startParticles(theme, isNight);
}

/* ══════════════════════════════════
   PARTICLE SYSTEM
══════════════════════════════════ */
let particleAnimFrame = null;
let particles = [];

function startParticles(theme, isNight) {
  cancelAnimationFrame(particleAnimFrame);
  particles = [];
  const canvas = dom.canvas;
  const ctx    = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  if (theme === 'weather-rain' || theme === 'weather-drizzle') {
    for (let i = 0; i < 120; i++) particles.push(createRainDrop(canvas));
    animateRain(ctx, canvas);
  } else if (theme === 'weather-snow') {
    for (let i = 0; i < 80; i++) particles.push(createSnowFlake(canvas));
    animateSnow(ctx, canvas);
  } else if (theme === 'weather-thunderstorm') {
    for (let i = 0; i < 80; i++) particles.push(createRainDrop(canvas));
    animateThunder(ctx, canvas);
  } else {
    animateStars(ctx, canvas, isNight);
  }
}

function createRainDrop(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    len: 12 + Math.random() * 18,
    speed: 8 + Math.random() * 12,
    opacity: 0.3 + Math.random() * 0.5,
  };
}

function createSnowFlake(canvas) {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 1.5 + Math.random() * 3,
    speed: 0.5 + Math.random() * 1.5,
    drift: (Math.random() - 0.5) * 0.5,
    opacity: 0.4 + Math.random() * 0.5,
  };
}

function animateRain(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
    ctx.lineTo(p.x - 1, p.y + p.len);
    ctx.strokeStyle = `rgba(174,214,241,${p.opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
    p.y += p.speed;
    if (p.y > canvas.height) { p.y = -p.len; p.x = Math.random() * canvas.width; }
  });
  particleAnimFrame = requestAnimationFrame(() => animateRain(ctx, canvas));
}

function animateSnow(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
    ctx.fill();
    p.y += p.speed;
    p.x += p.drift;
    if (p.y > canvas.height) { p.y = -p.r; p.x = Math.random() * canvas.width; }
  });
  particleAnimFrame = requestAnimationFrame(() => animateSnow(ctx, canvas));
}

function animateThunder(ctx, canvas) {
  animateRain(ctx, canvas);
  if (Math.random() < 0.002) {
    ctx.fillStyle = 'rgba(200,200,255,0.06)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function animateStars(ctx, canvas, isNight) {
  const numStars = isNight ? 120 : 35;
  const starPs = Array.from({ length: numStars }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.5 + Math.random() * 1.5,
    opacity: 0.2 + Math.random() * 0.6,
    twinkle: Math.random() * Math.PI * 2,
  }));
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starPs.forEach(s => {
      s.twinkle += 0.02;
      const op = s.opacity * (0.7 + 0.3 * Math.sin(s.twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${op})`;
      ctx.fill();
    });
    particleAnimFrame = requestAnimationFrame(draw);
  }
  draw();
}

window.addEventListener('resize', () => {
  if (!dom.canvas) return;
  dom.canvas.width  = window.innerWidth;
  dom.canvas.height = window.innerHeight;
});

/* ══════════════════════════════════
   SUN ARC ANIMATION
══════════════════════════════════ */
function animateSunArc(rise, set_, now) {
  const total   = set_ - rise;
  const elapsed = now - rise;
  const pct     = Math.max(0, Math.min(1, elapsed / total));
  const arcLen  = 200;
  const offset  = arcLen - (pct * arcLen);

  dom.sunArcPath.style.strokeDashoffset = offset;

  // Move the sun dot along the arc path
  // Path: M10 80 Q80 0 150 80
  const t2 = pct;
  const px  = 2*(1-t2)*t2*80 + t2*t2*150 + (1-t2)*(1-t2)*10;
  const py  = 2*(1-t2)*t2*0  + t2*t2*80  + (1-t2)*(1-t2)*80;
  dom.sunDot.setAttribute('cx', px);
  dom.sunDot.setAttribute('cy', py);
}

/* ══════════════════════════════════
   LABEL UPDATES (i18n)
══════════════════════════════════ */
function updateLabels() {
  const l = t();
  $('label-ai-rec').textContent   = l.aiRec;
  $('label-farmer').textContent   = l.farmer;
  $('label-forecast').textContent = l.forecast;
  $('label-aqi').textContent      = l.aqi;
  $('label-humidity').textContent = l.humidity;
  $('label-pressure').textContent = l.pressure;
  $('label-visibility').textContent = l.visibility;
  $('label-wind').textContent     = l.wind;
  $('label-sun').textContent      = l.sun;
  $('label-hourly').textContent   = l.hourly;
  $('label-sunrise').textContent  = l.sunrise;
  $('label-sunset').textContent   = l.sunset;
  dom.loadingText.textContent     = l.loading;
}

/* ══════════════════════════════════
   HELPERS
══════════════════════════════════ */
function formatDate(d) {
  return d.toLocaleDateString(undefined, { weekday:'long', month:'long', day:'numeric' });
}
function shortDay(d) {
  return d.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
}
function degToCompass(deg) {
  const dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}
function showLoading(on) {
  dom.loadingOverlay.classList.toggle('active', on);
}
function showToast(msg, dur = 3500) {
  dom.toastMsg.textContent = msg;
  dom.toast.classList.add('visible');
  setTimeout(() => dom.toast.classList.remove('visible'), dur);
}

/* ══════════════════════════════════
   EVENT LISTENERS
══════════════════════════════════ */

// Search
dom.searchBtn.addEventListener('click', () => {
  const city = dom.cityInput.value.trim();
  if (city) { hideAutocomplete(); fetchWeather(city); }
});
dom.cityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const city = dom.cityInput.value.trim();
    if (city) { hideAutocomplete(); fetchWeather(city); }
  }
});

// Autocomplete (debounced)
let acTimer;
dom.cityInput.addEventListener('input', () => {
  clearTimeout(acTimer);
  const q = dom.cityInput.value.trim();
  if (q.length < 2) { hideAutocomplete(); return; }
  acTimer = setTimeout(() => fetchAutocomplete(q), 350);
});
document.addEventListener('click', e => {
  if (!e.target.closest('.search-wrapper')) hideAutocomplete();
});

async function fetchAutocomplete(q) {
  try {
    const res  = await fetch(`${BASE}/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=5&appid=${API_KEY}`);
    const data = await res.json();
    if (!data.length) { hideAutocomplete(); return; }
    dom.autocomplete.innerHTML = data.map(c => `
      <div class="ac-item" data-name="${c.name}" data-country="${c.country}" data-lat="${c.lat}" data-lon="${c.lon}">
        <i class="fa-solid fa-location-dot"></i>
        <span>${c.name}, ${c.state ? c.state + ', ' : ''}${c.country}</span>
      </div>`).join('');
    dom.autocomplete.classList.add('visible');
    dom.autocomplete.querySelectorAll('.ac-item').forEach(item => {
      item.addEventListener('click', () => {
        dom.cityInput.value = item.dataset.name;
        hideAutocomplete();
        fetchWeather({ lat: item.dataset.lat, lon: item.dataset.lon });
      });
    });
  } catch(e) { hideAutocomplete(); }
}
function hideAutocomplete() {
  dom.autocomplete.classList.remove('visible');
  dom.autocomplete.innerHTML = '';
}

// Geolocation
dom.locateBtn.addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Geolocation not supported.'); return; }
  showLoading(true);
  navigator.geolocation.getCurrentPosition(
    pos => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
    err => { showLoading(false); showToast('Location access denied.'); }
  );
});

// Unit toggle
dom.unitToggle.addEventListener('click', () => {
  state.unit = state.unit === 'metric' ? 'imperial' : 'metric';
  dom.toggleThumb.classList.toggle('fahrenheit', state.unit === 'imperial');
  dom.toggleC.classList.toggle('active', state.unit === 'metric');
  dom.toggleF.classList.toggle('active', state.unit === 'imperial');
  saveSettings();
  if (state.weather) fetchWeather({ lat: state.lat, lon: state.lon });
});

// Language selector
dom.langSelect.addEventListener('change', () => {
  state.lang = dom.langSelect.value;
  saveSettings();
  if (state.weather) renderAll();
  else updateLabels();
});

/* ══════════════════════════════════
   INIT
══════════════════════════════════ */
function init() {
  loadSettings();

  // Restore UI from saved settings
  dom.langSelect.value = state.lang;
  if (state.unit === 'imperial') {
    dom.toggleThumb.classList.add('fahrenheit');
    dom.toggleC.classList.remove('active');
    dom.toggleF.classList.add('active');
  } else {
    dom.toggleC.classList.add('active');
  }
  updateLabels();

  // Show placeholder background particles immediately
  startParticles('weather-default', false);

  // Fetch weather
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      pos => fetchWeather({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => fetchWeather(state.city)
    );
  } else {
    fetchWeather(state.city);
  }
}

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
