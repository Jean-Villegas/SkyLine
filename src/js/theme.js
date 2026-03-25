/**
 * Módulo de gestión de temas para Skyline Weather
 */

/**
 * Inicializar el tema de la aplicación
 */
export function initTheme() {
    // Solo tema light disponible
    applyTheme('light');
}

/**
 * Aplicar tema a la aplicación
 * @param {string} theme - Tema a aplicar ('light')
 */
export function applyTheme(theme) {
    // Siempre aplica tema light
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('skyline-theme', 'light');
}

/**
 * Configurar el toggle de tema
 */
export function setupThemeToggle() {
    // Función desactivada - solo tema light disponible
    return;
}
