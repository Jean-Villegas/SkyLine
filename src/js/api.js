/**
 * Módulo de API para Skyline Weather
 */

import { API_CONFIG } from './config.js';
import { fetchWithTimeout, handleError } from '../utils/helpers.js';

/**
 * Geocodificación de ciudades
 * @param {string} query - Nombre de ciudad a buscar
 * @returns {Promise<Array>} Array de resultados de geocodificación
 */
export async function geocodeCity(query) {
    if (!query || query.length < 2) return [];
    
    try {
        const url = `${API_CONFIG.BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_CONFIG.KEY}`;
        const response = await fetchWithTimeout(url, API_CONFIG.TIMEOUT);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Geocode Error:', error);
        return [];
    }
}

/**
 * Obtener datos meteorológicos completos
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} Objeto con datos del clima, pronóstico y contaminación
 */
export async function fetchWeatherData(lat, lon) {
    try {
        const urls = [
            `${API_CONFIG.BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_CONFIG.KEY}`,
            `${API_CONFIG.BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_CONFIG.KEY}`,
            `${API_CONFIG.BASE_URL}/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_CONFIG.KEY}`
        ];

        const promises = urls.map(url => 
            fetchWithTimeout(url, API_CONFIG.TIMEOUT)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }
                    return response.json();
                })
        );

        const [current, forecast, pollution] = await Promise.allSettled(promises);
        
        return {
            current: current.status === 'fulfilled' ? current.value : null,
            forecast: forecast.status === 'fulfilled' ? forecast.value : null,
            pollution: pollution.status === 'fulfilled' ? pollution.value : null,
            errors: {
                current: current.status === 'rejected' ? current.reason : null,
                forecast: forecast.status === 'rejected' ? forecast.reason : null,
                pollution: pollution.status === 'rejected' ? pollution.reason : null
            }
        };
    } catch (error) {
        console.error('Weather API Error:', error);
        throw error;
    }
}

/**
 * Obtener clima actual (versión simplificada)
 * @param {number} lat - Latitud
 * @param {number} lon - Longitud
 * @returns {Promise<Object>} Datos del clima actual
 */
export async function fetchCurrentWeather(lat, lon) {
    try {
        const url = `${API_CONFIG.BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${API_CONFIG.KEY}`;
        const response = await fetchWithTimeout(url, API_CONFIG.TIMEOUT);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Current Weather Error:', error);
        throw error;
    }
}
