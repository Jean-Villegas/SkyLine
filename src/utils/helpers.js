/**
 * Utilidades helper para la aplicación Skyline
 */

/**
 * Función debounce para limitar la frecuencia de llamadas
 * @param {Function} func - Función a ejecutar
 * @param {number} wait - Tiempo de espera en ms
 * @returns {Function} Función con debounce aplicado
 */
export function debounce(func, wait) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

/**
 * Fetch con timeout integrado
 * @param {string} url - URL a consultar
 * @param {number} timeout - Tiempo máximo de espera en ms
 * @returns {Promise} Promise con los datos de la respuesta
 */
export function fetchWithTimeout(url, timeout = 5000) {
    console.log(`Iniciando fetch a: ${url} con timeout: ${timeout}ms`);
    
    const fetchPromise = fetch(url).then(response => {
        console.log(`Respuesta recibida: ${response.status} ${response.statusText}`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response;
    });

    const timeoutPromise = new Promise((_, reject) => {
        const timeoutId = setTimeout(() => {
            console.log(`Timeout alcanzado para: ${url}`);
            reject(new Error('Tiempo de espera agotado'));
        }, timeout);
        
        // Limpiar timeout si la promesa se resuelve
        fetchPromise.finally(() => clearTimeout(timeoutId));
    });

    return Promise.race([fetchPromise, timeoutPromise]);
}

/**
 * Manejo de errores robusto
 * @param {Error} error - Error capturado
 * @param {string} context - Contexto donde ocurrió el error
 * @returns {string} Mensaje de error amigable
 */
export function handleError(error, context) {
    console.error(`Error en ${context}:`, error);
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return 'Error de conexión. Verifica tu internet.';
    }
    
    if (error.message === 'Tiempo de espera agotado') {
        return 'La respuesta tardó demasiado. Intenta de nuevo.';
    }
    
    if (error.message.includes('401')) {
        return 'Error de autenticación con el servicio.';
    }
    
    if (error.message.includes('404')) {
        return 'Recurso no encontrado. Intenta con otra ciudad.';
    }
    
    return 'Ocurrió un error inesperado. Intenta de nuevo.';
}

/**
 * Formatear timestamp a hora local
 * @param {number} timestamp - Timestamp Unix
 * @param {number} timezone - Offset de zona horaria en segundos
 * @returns {string} Hora formateada
 */
export function formatLocalTime(timestamp, timezone) {
    const date = new Date((timestamp + timezone + (new Date().getTimezoneOffset() * 60)) * 1000);
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
}

/**
 * Formatear fecha y hora local
 * @param {number} timezone - Offset de zona horaria en segundos
 * @returns {string} Fecha y hora formateada
 */
export function formatLocalDateTime(timezone) {
    const now = new Date();
    const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
    const localTime = new Date(utcTime + (timezone * 1000));
    
    return localTime.toLocaleTimeString('es-ES', {
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

/**
 * Formatear offset de zona horaria
 * @param {number} timezone - Offset en segundos
 * @returns {string} Texto de zona horaria
 */
export function formatTimezone(timezone) {
    const offset = timezone / 3600;
    return offset >= 0 ? `UTC +${offset}` : `UTC ${offset}`;
}
