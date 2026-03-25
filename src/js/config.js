/**
 * Configuración de la aplicación Skyline
 */

export const API_CONFIG = {
    KEY: '4cdea4f60da94c792bdaf01f031effbf',
    BASE_URL: 'https://api.openweathermap.org',
    TIMEOUT: 5000, // Reducido a 5 segundos
    DEBOUNCE_DELAY: 400
};

export const UI_SELECTORS = {
    cityInput: 'city-input',
    searchBtn: 'search-btn',
    suggestionsList: 'suggestions-list',
    loader: 'loader',
    errorMessage: 'error-message',
    weatherSection: 'weather-section',
    welcomeSection: 'welcome-section',
    forecastContainer: 'forecast-container',
    cityName: 'city-name',
    localTime: 'local-time',
    currentTemp: 'current-temp',
    weatherDesc: 'weather-desc',
    weatherIcon: 'weather-icon',
    humidityVal: 'humidity-val',
    windVal: 'wind-val',
    feelsLikeVal: 'feels-like-val',
    aqiBadge: 'aqi-badge',
    aqiDesc: 'aqi-desc',
    sunriseVal: 'sunrise-val',
    sunsetVal: 'sunset-val',
    timezoneVal: 'timezone-val'
};

export const AQI_LABELS = {
    1: { text: 'Excelente', class: 'aqi-1' },
    2: { text: 'Bueno', class: 'aqi-2' },
    3: { text: 'Regular', class: 'aqi-3' },
    4: { text: 'Mala', class: 'aqi-4' },
    5: { text: 'Peligrosa', class: 'aqi-5' }
};
