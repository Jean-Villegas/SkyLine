/**
 * Módulo de UI para Skyline Weather
 */

import { UI_SELECTORS, AQI_LABELS } from './config.js';
import { formatLocalTime, formatLocalDateTime, formatTimezone } from '../utils/helpers.js';
import { setupWeatherBackground } from './weather-effects.js';

/**
 * Obtener todos los elementos del DOM
 * @returns {Object} Objeto con todos los selectores
 */
export function getElements() {
    const elements = {};

    Object.keys(UI_SELECTORS).forEach(key => {
        const selector = UI_SELECTORS[key];
        elements[key] = document.getElementById(selector);
    });

    // Selectores adicionales con querySelector
    elements.logo = document.querySelector('.logo');
    elements.searchWrapper = document.querySelector('.search-wrapper');

    return elements;
}

/**
 * Controlar el estado del loader
 * @param {Object} elements - Elementos del DOM
 * @param {boolean} isLoading - Estado de carga
 */
export function setLoader(elements, isLoading) {
    console.log(`setLoader llamado con isLoading: ${isLoading}`);
    if (!elements.loader) {
        console.error('Elemento loader no encontrado');
        return;
    }

    if (isLoading) {
        console.log('Mostrando loader');
        elements.loader.classList.remove('hidden');
        elements.loader.setAttribute('aria-hidden', 'false');
    } else {
        console.log('Ocultando loader');
        elements.loader.classList.add('hidden');
        elements.loader.setAttribute('aria-hidden', 'true');
    }
}

/**
 * Renderizar datos del clima actual
 * @param {Object} elements - Elementos del DOM
 * @param {Object} data - Datos del clima
 * @param {string} city - Nombre de la ciudad
 * @param {string} country - País
 */
export function renderWeather(elements, data, city, country) {
    if (!data || !elements.cityName) return;

    elements.cityName.textContent = `${city}, ${country}`;
    elements.localTime.textContent = formatLocalDateTime(data.timezone);

    elements.currentTemp.textContent = Math.round(data.main.temp);
    elements.weatherDesc.textContent = data.weather[0].description;

    if (elements.weatherIcon) {
        elements.weatherIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`;
        elements.weatherIcon.alt = data.weather[0].description;
    }

    elements.humidityVal.textContent = `${data.main.humidity}%`;
    elements.windVal.textContent = `${Math.round(data.wind.speed * 3.6)} km/h`;
    elements.feelsLikeVal.textContent = `${Math.round(data.main.feels_like)}°`;

    elements.sunriseVal.textContent = formatLocalTime(data.sys.sunrise, data.timezone);
    elements.sunsetVal.textContent = formatLocalTime(data.sys.sunset, data.timezone);
    elements.timezoneVal.textContent = formatTimezone(data.timezone);

    // Configurar fondo dinámico según el clima
    if (data.weather && data.weather[0]) {
        setupWeatherBackground(data.weather[0].main, data.weather[0].description, data.weather[0].icon);
    }
}

// Exportar setupWeatherBackground para uso externo
export { setupWeatherBackground };

/**
 * Renderizar calidad del aire
 * @param {Object} elements - Elementos del DOM
 * @param {Object} data - Datos de contaminación
 */
export function renderAirQuality(elements, data) {
    if (!data || !data.list || !data.list[0] || !elements.aqiBadge) return;

    const aqi = data.list[0].main.aqi;
    const label = AQI_LABELS[aqi];

    if (!label) return;

    elements.aqiBadge.textContent = aqi;
    elements.aqiBadge.className = `badge aqi-${aqi}`;
    elements.aqiDesc.textContent = label.text;
}

/**
 * Renderizar pronóstico extendido
 * @param {Object} elements - Elementos del DOM
 * @param {Object} data - Datos del pronóstico
 */
export function renderForecast(elements, data) {
    if (!data || !data.list || !elements.forecastContainer) return;

    elements.forecastContainer.innerHTML = '';

    // Agrupar por día y omitir el día actual
    const days = {};
    const todayStr = new Date().toISOString().split('T')[0];

    data.list.forEach(item => {
        const dateStr = item.dt_txt.split(' ')[0];
        if (dateStr === todayStr) return;

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

    const dailyForecasts = Object.keys(days).slice(0, 3);

    dailyForecasts.forEach(date => {
        const dayData = days[date];
        const maxTemp = Math.round(Math.max(...dayData.temps));
        const minTemp = Math.round(Math.min(...dayData.temps));

        const iconIndex = Math.floor(dayData.icons.length / 2);
        const icon = dayData.icons[iconIndex];
        const desc = dayData.descriptions[iconIndex];

        const dateObj = new Date(date + 'T00:00:00');
        const dayName = dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' });

        const forecastCol = document.createElement('div');
        forecastCol.className = 'card forecast-column';
        forecastCol.innerHTML = `
            <p class="forecast-day">${dayName}</p>
            <img class="forecast-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="${desc}">
            <div class="forecast-temps">
                <span class="forecast-max">${maxTemp}°</span>
                <span class="forecast-min">${minTemp}°</span>
            </div>
        `;

        elements.forecastContainer.appendChild(forecastCol);
    });
}

/**
 * Mostrar mensaje de error
 * @param {Object} elements - Elementos del DOM
 * @param {string} message - Mensaje de error
 */
export function showError(elements, message) {
    if (!elements.errorMessage) return;

    const errorText = elements.errorMessage.querySelector('p');
    if (errorText) {
        errorText.textContent = message;
    }

    elements.errorMessage.classList.remove('hidden');

    if (elements.weatherSection) {
        elements.weatherSection.classList.add('hidden');
    }

    if (elements.welcomeSection) {
        elements.welcomeSection.classList.remove('hidden');
    }
}

/**
 * Renderizar sugerencias de búsqueda
 * @param {Object} elements - Elementos del DOM
 * @param {Array} suggestions - Array de sugerencias
 */
export function renderSuggestions(elements, suggestions) {
    if (!elements.suggestionsList) return;

    elements.suggestionsList.innerHTML = '';

    if (suggestions.length === 0) {
        elements.suggestionsList.classList.add('hidden');
        return;
    }

    suggestions.forEach(city => {
        const li = document.createElement('li');
        li.role = 'option';
        li.textContent = `${city.name}${city.state ? `, ${city.state}` : ''}, ${city.country}`;

        li.addEventListener('click', () => {
            if (elements.cityInput) {
                elements.cityInput.value = city.name;
            }
            elements.suggestionsList.classList.add('hidden');

            // Disparar evento personalizado para la búsqueda
            const event = new CustomEvent('citySelected', {
                detail: { lat: city.lat, lon: city.lon, name: city.name, country: city.country }
            });
            document.dispatchEvent(event);
        });

        elements.suggestionsList.appendChild(li);
    });

    elements.suggestionsList.classList.remove('hidden');
}

/**
 * Ocultar sugerencias
 * @param {Object} elements - Elementos del DOM
 */
export function hideSuggestions(elements) {
    if (elements.suggestionsList) {
        elements.suggestionsList.classList.add('hidden');
    }
}
