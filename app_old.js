/**
 * Skyline - Inteligencia Meteorológica
 * Consumo de OpenWeatherMap API con JavaScript puro
 */

// CONFIGURACIÓN
const API_KEY = '4cdea4f60da94c792bdaf01f031effbf';
const BASE_URL = 'https://api.openweathermap.org';

// SELECTORES
const elements = {
    cityInput: document.getElementById('city-input'),
    searchBtn: document.getElementById('search-btn'),
    suggestionsList: document.getElementById('suggestions-list'),
    themeToggle: document.getElementById('theme-toggle'),
    loader: document.getElementById('loader'),
    errorMessage: document.getElementById('error-message'),
    weatherSection: document.getElementById('weather-section'),
    welcomeSection: document.getElementById('welcome-section'),
    forecastContainer: document.getElementById('forecast-container'),
    logo: document.querySelector('.logo'),
    searchWrapper: document.querySelector('.search-wrapper'),
    // Weather Data Display
    cityName: document.getElementById('city-name'),
    localTime: document.getElementById('local-time'),
    currentTemp: document.getElementById('current-temp'),
    weatherDesc: document.getElementById('weather-desc'),
    weatherIcon: document.getElementById('weather-icon'),
    humidityVal: document.getElementById('humidity-val'),
    windVal: document.getElementById('wind-val'),
    feelsLikeVal: document.getElementById('feels-like-val'),
    aqiBadge: document.getElementById('aqi-badge'),
    aqiDesc: document.getElementById('aqi-desc'),
    sunriseVal: document.getElementById('sunrise-val'),
    sunsetVal: document.getElementById('sunset-val'),
    timezoneVal: document.getElementById('timezone-val')
};

// --- GESTIÓN DE TEMAS ---
function initTheme() {
    const savedTheme = localStorage.getItem('skyline-theme');
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemPreference;

    applyTheme(initialTheme);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('skyline-theme', theme);

    // Actualizar iconos
    const sunIcon = elements.themeToggle.querySelector('.sun-icon');
    const moonIcon = elements.themeToggle.querySelector('.moon-icon');

    if (theme === 'dark') {
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
    } else {
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
    }
}

elements.themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

// --- FUNCIONES DE CLIMA ---
function setLoader(isLoading) {
    if (isLoading) {
        elements.loader.classList.remove('hidden');
        elements.loader.setAttribute('aria-hidden', 'false');
    } else {
        elements.loader.classList.add('hidden');
        elements.loader.setAttribute('aria-hidden', 'true');
    }
}

async function geocodeCity(query) {
    try {
        const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`);
        if (!response.ok) throw new Error('Error en geolocalización');
        return await response.json();
    } catch (error) {
        console.error('Geocode Error:', error);
        return [];
    }
}

async function fetchWeatherData(lat, lon, cityName, country) {
    setLoader(true);
    elements.errorMessage.classList.add('hidden');

    try {
        const [current, forecast, pollution] = await Promise.all([
            fetch(`${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`).then(r => r.json()),
            fetch(`${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_KEY}`).then(r => r.json()),
            fetch(`${BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`).then(r => r.json())
        ]);

        renderWeather(current, cityName, country);
        renderAirQuality(pollution);
        renderForecast(forecast);

        elements.weatherSection.classList.remove('hidden');
        elements.welcomeSection.classList.add('hidden');

    } catch (error) {
        console.error('Weather Data Error:', error);
        showError('No se pudo obtener la información meteorológica.');
    } finally {
        setLoader(false);
    }
}

function renderWeather(data, city, country) {
    elements.cityName.textContent = `${city}, ${country}`;

    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (data.timezone * 1000));

    elements.localTime.textContent = localTime.toLocaleTimeString('es-ES', {
        weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });

    elements.currentTemp.textContent = Math.round(data.main.temp);
    elements.weatherDesc.textContent = data.weather[0].description;
    elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
    elements.weatherIcon.alt = data.weather[0].description;

    elements.humidityVal.textContent = `${data.main.humidity}%`;
    elements.windVal.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    elements.feelsLikeVal.textContent = `${Math.round(data.main.feels_like)}°`;

    const formatTime = (ts) => {
        const d = new Date((ts + data.timezone + (new Date().getTimezoneOffset() * 60)) * 1000);
        return d.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
    };

    elements.sunriseVal.textContent = formatTime(data.sys.sunrise);
    elements.sunsetVal.textContent = formatTime(data.sys.sunset);

    const timezoneOffset = data.timezone / 3600;
    const timezoneText = timezoneOffset >= 0 ? `UTC +${timezoneOffset}` : `UTC ${timezoneOffset}`;
    elements.timezoneVal.textContent = timezoneText;
}

/**
 * Renderiza la calidad del aire
 */
function renderAirQuality(data) {
    const aqi = data.list[0].main.aqi;
    const labels = {
        1: { text: 'Excelente', class: 'aqi-1' },
        2: { text: 'Bueno', class: 'aqi-2' },
        3: { text: 'Regular', class: 'aqi-3' },
        4: { text: 'Mala', class: 'aqi-4' },
        5: { text: 'Peligrosa', class: 'aqi-5' }
    };

    elements.aqiBadge.textContent = aqi;
    elements.aqiBadge.className = `badge aqi-${aqi}`;
    elements.aqiDesc.textContent = labels[aqi].text;
}

/**
 * Renderiza el pronóstico de 3 días
 */
function renderForecast(data) {
    elements.forecastContainer.innerHTML = '';

    // Agrupar por día y saltar el día actual
    const days = {};
    const todayStr = new Date().toISOString().split('T')[0];

    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0];
        if (dateStr === todayStr) return; // Omitir hoy

        if (!days[dateStr]) {
            days[dateStr] = {
                temps: [],
                icons: [],
                descriptions: []
            };
        }
        days[dateStr].temps.push(item.main.temp);
        days[dateStr].icons.push(item.weather[0].icon);
        days[dateStr].descriptions.push(item.weather[0].description);
    });

    const dailyForecasts = Object.keys(days).slice(0, 3); // Tomar los primeros 3 días

    dailyForecasts.forEach(date => {
        const dayData = days[date];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));

        // Usar el icono del mediodía (aproximadamente en el medio del array)
        const icon = dayData.icons[Math.floor(dayData.icons.length / 2)];
        const desc = dayData.descriptions[Math.floor(dayData.descriptions.length / 2)];

        const dateObj = new Date(date + 'T00:00:00'); // Forzar zona horaria local
        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });

        const forecastCard = document.createElement('article');
        forecastCard.className = 'card forecast-card';
        forecastCard.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
            <p class="forecast-desc" style="font-size: 0.8rem; text-transform: capitalize;">${desc}</p>
            <div class="forecast-temps">
                <span class="forecast-max">${maxTemp}°</span>
                <span class="forecast-min">${minTemp}°</span>
            </div>
        `;
        elements.forecastContainer.appendChild(forecastCard);
    });
}

/**
 * Muestra mensaje de error
 */
function showError(msg) {
    elements.errorMessage.querySelector('p').textContent = msg;
    elements.errorMessage.classList.remove('hidden');
    elements.weatherSection.classList.add('hidden');
    elements.welcomeSection.classList.remove('hidden');
}

// --- BUSQUEDA CON AUTOCOMPLETADO Y DEBOUNCE ---

/**
 * Debounce Utility
 */
function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

const handleSearchInput = async (e) => {
    const query = e.target.value.trim();

    if (query.length < 3) {
        elements.suggestionsList.classList.add('hidden');
        return;
    }

    const suggestions = await geocodeCity(query);

    if (suggestions.length === 0) {
        elements.suggestionsList.classList.add('hidden');
        return;
    }

    elements.suggestionsList.innerHTML = '';
    suggestions.forEach(city => {
        const li = document.createElement('li');
        li.role = 'option';
        li.textContent = `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`;
        li.addEventListener('click', () => {
            elements.cityInput.value = city.name;
            elements.suggestionsList.classList.add('hidden');
            fetchWeatherData(city.lat, city.lon, city.name, city.country);
        });
        elements.suggestionsList.appendChild(li);
    });

    elements.suggestionsList.classList.remove('hidden');
};

elements.cityInput.addEventListener('input', debounce(handleSearchInput, 400));

// Buscar al presionar Enter o botón
const triggerSearch = async () => {
    const query = elements.cityInput.value.trim();
    if (!query) return;

    elements.suggestionsList.classList.add('hidden');
    setLoader(true);

    const results = await geocodeCity(query);
    if (results.length > 0) {
        const city = results[0];
        await fetchWeatherData(city.lat, city.lon, city.name, city.country);
    } else {
        showError('No se encontró la ciudad. Intenta con otro nombre.');
        setLoader(false);
    }
};

elements.searchBtn.addEventListener('click', triggerSearch);
elements.cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') triggerSearch();
});

// Cerrar sugerencias al hacer click fuera
document.addEventListener('click', (e) => {
    if (!elements.searchWrapper.contains(e.target)) {
        elements.suggestionsList.classList.add('hidden');
    }
});

// Chips de ciudades rápidas
document.querySelectorAll('.city-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        elements.cityInput.value = chip.dataset.city;
        triggerSearch();
    });
});

// Logo vuelve a inicio
elements.logo.addEventListener('click', () => {
    elements.weatherSection.classList.add('hidden');
    elements.welcomeSection.classList.remove('hidden');
    elements.cityInput.value = '';
});

// --- INICIALIZACIÓN ---
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
});
