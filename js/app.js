/**
 * Skyline - Inteligencia Meteorológica
 * Aplicación principal modular
 */

import { initTheme, setupThemeToggle } from './theme.js';
import { setupSearch, setupCityChips, setupClickOutside } from './search.js';
import { getElements } from './ui.js';
import { loadCurrentLocationWeather } from './geolocation.js';

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
        initTheme();
        setupThemeToggle();
        
        // Configurar búsqueda
        setupSearch(elements);
        setupCityChips(elements);
        setupClickOutside(elements);
        
        // Configurar logo para volver al inicio
        setupLogo(elements);
        
        // Configurar manejo de errores globales
        setupErrorHandling();
        
        // Cargar clima de ubicación actual automáticamente
        console.log('Iniciando carga automática de clima...');
        await loadCurrentLocationWeather(elements);
        
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
