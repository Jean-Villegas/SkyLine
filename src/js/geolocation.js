/**
 * Módulo de geolocalización para Skyline Weather
 */

import { fetchWeatherData } from './api.js';
import { setLoader, showError } from './ui.js';

/**
 * Obtener ubicación actual del usuario
 * @returns {Promise<Object>} Coordenadas {lat, lon}
 */
export function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocalización no soportada por tu navegador'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                });
            },
            (error) => {
                let errorMessage = 'No se pudo obtener tu ubicación';

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errorMessage = 'Permiso de geolocalización denegado';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errorMessage = 'Información de ubicación no disponible';
                        break;
                    case error.TIMEOUT:
                        errorMessage = 'Tiempo de espera agotado para obtener ubicación';
                        break;
                }

                reject(new Error(errorMessage));
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutos de caché
            }
        );
    });
}

/**
 * Cargar clima para ubicación actual
 * @param {Object} elements - Elementos del DOM
 */
export async function loadCurrentLocationWeather(elements) {
    try {
        console.log('Obteniendo ubicación actual...');
        const coords = await getCurrentLocation();
        console.log('Ubicación obtenida:', coords);

        // Obtener nombre de la ciudad usando reverse geocoding
        const cityName = await getCityName(coords.lat, coords.lon);

        // Cargar datos del clima
        await loadWeatherDataForLocation(coords.lat, coords.lon, cityName, elements);

    } catch (error) {
        console.error('Error en geolocalización:', error);
        const errorMessage = error.message || 'No se pudo obtener tu ubicación automáticamente';
        showError(elements, errorMessage);
    }
}

/**
 * Obtener nombre de ciudad a partir de coordenadas
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<string>} Nombre de la ciudad
 */
async function getCityName(lat, lon) {
    try {
        const API_KEY = '4cdea4f60da94c792bdaf01f031effbf';
        const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Error al obtener nombre de ciudad');

        const data = await response.json();
        if (data.length === 0) return 'Tu ubicación';

        const city = data[0];
        return city.name || city.locality || 'Tu ubicación';
    } catch (error) {
        console.error('Error obteniendo nombre de ciudad:', error);
        return 'Tu ubicación';
    }
}

/**
 * Cargar datos del clima para ubicación específica
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @param {string} cityName - Nombre de la ciudad
 * @param {Object} elements - Elementos del DOM
 */
async function loadWeatherDataForLocation(lat, lon, cityName, elements) {
    setLoader(elements, true);

    try {
        const data = await fetchWeatherData(lat, lon);
        console.log('Datos recibidos para ubicación actual:', data);

        if (!data.current) {
            throw new Error('No se pudieron obtener los datos del clima');
        }

        // Importar dinámicamente las funciones de UI
        const { renderWeather, renderAirQuality, renderForecast, setupWeatherBackground } = await import('./ui.js');

        renderWeather(elements, data.current, cityName, '');

        if (data.pollution) {
            renderAirQuality(elements, data.pollution);
        }

        if (data.forecast) {
            renderForecast(elements, data.forecast);
        }

        // Configurar fondo dinámico según el clima
        if (data.current.weather && data.current.weather[0]) {
            setupWeatherBackground(data.current.weather[0].main, data.current.weather[0].description, data.current.weather[0].icon);
        }

        // Mostrar sección del clima
        if (elements.weatherSection) {
            elements.weatherSection.classList.remove('hidden');
        }

        if (elements.welcomeSection) {
            elements.welcomeSection.classList.add('hidden');
        }

        if (elements.errorMessage) {
            elements.errorMessage.classList.add('hidden');
        }

    } catch (error) {
        console.error('Error cargando clima de ubicación actual:', error);
        const errorMessage = error.message || 'No se pudo cargar el clima de tu ubicación';
        showError(elements, errorMessage);
    } finally {
        setLoader(elements, false);
    }
}
