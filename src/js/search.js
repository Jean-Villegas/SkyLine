/**
 * Módulo de búsqueda para Skyline Weather
 */

import { API_CONFIG } from './config.js';
import { geocodeCity, fetchWeatherData } from './api.js';
import { debounce, handleError } from '../utils/helpers.js';
import { setLoader, showError, renderSuggestions, hideSuggestions } from './ui.js';

/**
 * Configurar la funcionalidad de búsqueda
 * @param {Object} elements - Elementos del DOM
 */
export function setupSearch(elements) {
    if (!elements.cityInput) return;

    // Configurar input con debounce
    const debouncedSearch = debounce(handleSearchInput, API_CONFIG.DEBOUNCE_DELAY);
    elements.cityInput.addEventListener('input', (e) => debouncedSearch(e, elements));

    // Configurar búsqueda con Enter
    elements.cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            triggerSearch(elements);
        }
    });

    // Configurar botón de búsqueda
    if (elements.searchBtn) {
        elements.searchBtn.addEventListener('click', () => triggerSearch(elements));
    }

    // Configurar evento personalizado para selección de ciudad
    document.addEventListener('citySelected', async (e) => {
        const { lat, lon, name, country } = e.detail;
        await loadWeatherData(lat, lon, name, country, elements);
    });
}

/**
 * Manejar entrada de búsqueda
 * @param {Event} event - Evento de input
 * @param {Object} elements - Elementos del DOM
 */
async function handleSearchInput(event, elements) {
    const query = event.target.value.trim();

    if (query.length < 2) {
        hideSuggestions(elements);
        return;
    }

    try {
        const suggestions = await geocodeCity(query);
        renderSuggestions(elements, suggestions);
    } catch (error) {
        console.error('Search input error:', error);
        hideSuggestions(elements);
    }
}

/**
 * Disparar búsqueda manual
 * @param {Object} elements - Elementos del DOM
 */
async function triggerSearch(elements) {
    const query = elements.cityInput?.value.trim();
    if (!query) return;

    hideSuggestions(elements);
    setLoader(elements, true);

    try {
        const results = await geocodeCity(query);

        if (results.length > 0) {
            const city = results[0];
            await loadWeatherData(city.lat, city.lon, city.name, city.country, elements);
        } else {
            // Fallback: Si el geocoder directo falla, usar búsqueda general de Weather API
            try {
                const fallbackUrl = `${API_CONFIG.BASE_URL}/data/2.5/weather?q=${encodeURIComponent(query)}&units=metric&lang=es&appid=${API_CONFIG.KEY}`;
                const fallbackResponse = await fetch(fallbackUrl);
                if (fallbackResponse.ok) {
                    const fdata = await fallbackResponse.json();
                    await loadWeatherData(fdata.coord.lat, fdata.coord.lon, fdata.name, fdata.sys.country, elements);
                    return;
                }
            } catch (fallbackError) {
                console.error('Error en búsqueda de fallback:', fallbackError);
            }

            showError(elements, 'No se encontró la ciudad. Intenta con un nombre más general o asegúrate de escribirlo bien.');
        }
    } catch (error) {
        const errorMessage = handleError(error, 'búsqueda de ciudad');
        showError(elements, errorMessage);
    } finally {
        setLoader(elements, false);
    }
}

/**
 * Cargar datos meteorológicos
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {string} cityName - Nombre de la ciudad
 * @param {string} country - País
 * @param {Object} elements - Elementos del DOM
 */
async function loadWeatherData(lat, lon, cityName, country, elements) {
    console.log(`Cargando datos para: ${cityName}, ${country} (${lat}, ${lon})`);
    setLoader(elements, true);

    try {
        const data = await fetchWeatherData(lat, lon);
        console.log('Datos recibidos:', data);

        // Verificar si tenemos datos válidos
        if (!data.current) {
            console.error('No se recibieron datos actuales');
            throw new Error('No se pudieron obtener los datos actuales del clima');
        }

        // Renderizar datos
        const { renderWeather, renderAirQuality, renderForecast } = await import('./ui.js');

        renderWeather(elements, data.current, cityName, country);

        if (data.pollution) {
            renderAirQuality(elements, data.pollution);
        }

        if (data.forecast) {
            renderForecast(elements, data.forecast);
        }

        // Mostrar sección del clima
        if (elements.weatherSection) {
            elements.weatherSection.classList.remove('hidden');
        }

        if (elements.welcomeSection) {
            elements.welcomeSection.classList.add('hidden');
        }

        // Ocultar mensaje de error si estaba visible
        if (elements.errorMessage) {
            elements.errorMessage.classList.add('hidden');
        }

    } catch (error) {
        console.error('Error en loadWeatherData:', error);
        const errorMessage = handleError(error, 'carga de datos meteorológicos');
        showError(elements, errorMessage);
    } finally {
        setLoader(elements, false);
    }
}

/**
 * Configurar chips de ciudades rápidas
 * @param {Object} elements - Elementos del DOM
 */
export function setupCityChips(elements) {
    const chips = document.querySelectorAll('.city-chip');

    chips.forEach(chip => {
        chip.addEventListener('click', async () => {
            const cityName = chip.dataset.city;
            if (!cityName || !elements.cityInput) return;

            elements.cityInput.value = cityName;
            await triggerSearch(elements);
        });
    });
}

/**
 * Configurar cierre de sugerencias al hacer click fuera
 * @param {Object} elements - Elementos del DOM
 */
export function setupClickOutside(elements) {
    if (!elements.searchWrapper) return;

    document.addEventListener('click', (e) => {
        if (!elements.searchWrapper.contains(e.target)) {
            hideSuggestions(elements);
        }
    });
}
