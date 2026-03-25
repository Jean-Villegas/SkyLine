/**
 * Skyline - Inteligencia Meteorológica
 * Aplicación principal modular
 */

// Import CSS
import '../css/main.css';

import { setupSearch, setupCityChips, setupClickOutside } from './search.js';
import { loadCurrentLocationWeather } from './geolocation.js';
import { setupWeatherBackground, clearWeatherEffects, setupDefaultBackground } from './weather-effects.js';
import { UI_SELECTORS } from './config.js';
import { getElements } from './ui.js';

/**
 * Inicializar la aplicación
 */
async function initApp() {
    try {
        // Obtener elementos del DOM
        const elements = getElements();

        // Verificar elementos críticos
        if (!elements.cityInput || !elements.searchBtn) {
            console.error('Elementos críticos no encontrados en el DOM');
            return;
        }

        // Inicializar tema
        // Tema eliminado - solo modo claro

        // Configurar búsqueda
        setupSearch(elements);
        setupCityChips(elements);
        setupClickOutside(elements);

        // Configurar logo para volver al inicio
        setupLogo(elements);

        // Configurar manejo de errores globales
        setupErrorHandling();

        // Configurar botón principal de ubicación en el Hero
        const btnHeroLocation = document.getElementById('btn-hero-location');
        if (btnHeroLocation) {
            btnHeroLocation.addEventListener('click', () => {
                loadCurrentLocationWeather(elements);
            });
        }

        // Cargar animaciones mágicas para la pantalla principal por defecto
        setupDefaultBackground();

        console.log('Skyline Weather inicializado correctamente');

    } catch (error) {
        console.error('Error al inicializar la aplicación:', error);
        showErrorGlobal('No se pudo inicializar la aplicación');
    }
}

/**
 * Configurar el logo para volver al inicio
 * @param {Object} elements - Elementos del DOM
 */
function setupLogo(elements) {
    if (!elements.logo) return;

    elements.logo.addEventListener('click', () => {
        if (elements.weatherSection) {
            elements.weatherSection.classList.add('hidden');
        }

        if (elements.welcomeSection) {
            elements.welcomeSection.classList.remove('hidden');
            setupDefaultBackground(); // <-- Activar el aura mágica al regresar
        }

        if (elements.cityInput) {
            elements.cityInput.value = '';
        }

        if (elements.errorMessage) {
            elements.errorMessage.classList.add('hidden');
        }
    });
}

/**
 * Configurar manejo de errores globales
 */
function setupErrorHandling() {
    // Manejar errores de red
    window.addEventListener('online', () => {
        console.log('Conexión restaurada');
    });

    window.addEventListener('offline', () => {
        showErrorGlobal('Sin conexión a internet');
    });

    // Manejar promesas no capturadas
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Promesa no manejada:', event.reason);
        event.preventDefault();
    });
}

/**
 * Mostrar error global
 * @param {string} message - Mensaje de error
 */
function showErrorGlobal(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        const errorText = errorElement.querySelector('p');
        if (errorText) {
            errorText.textContent = message;
        }
        errorElement.classList.remove('hidden');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

// Exportar para testing
export { initApp };
