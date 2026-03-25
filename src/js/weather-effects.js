/**
 * Módulo de efectos visuales dinámicos según el clima mejorado (Glassmorphism & Animaciones Premium)
 */

export function setupWeatherBackground(weatherMain, weatherDescription, icon = '01d') {
    console.log(`Configurando fondo premium para: ${weatherMain} - ${weatherDescription} (${icon})`);

    const isNight = icon.includes('n');
    clearWeatherEffects();

    if (isNight) {
        document.body.classList.add('weather-night-mode');
    }

    const type = weatherMain.toLowerCase();

    switch (type) {
        case 'clear':
            setupClearCondition(isNight);
            break;
        case 'clouds':
            setupCloudyCondition(weatherDescription, isNight);
            break;
        case 'rain':
        case 'drizzle':
            setupRainyCondition(isNight);
            break;
        case 'thunderstorm':
            setupStormyCondition(isNight);
            break;
        case 'snow':
            setupSnowyCondition(isNight);
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            setupFoggyCondition(isNight);
            break;
        default:
            setupClearCondition(isNight);
    }
}

<<<<<<< HEAD
export function clearWeatherEffects() {
=======
function clearWeatherEffects() {
>>>>>>> 830b9d1b8993e200baa0eef89eb623a3581f7f75
    document.body.className = document.body.className.replace(/weather-\w+/g, '');
    document.body.className = document.body.className.replace('weather-night-mode', '');

    const existingEffects = document.querySelectorAll('.weather-layer-bg, .weather-layer-fg');
    existingEffects.forEach(el => el.remove());
}

function setupClearCondition(isNight) {
    document.body.classList.add(isNight ? 'weather-clear-night' : 'weather-clear-day');
    createBackgroundLayer(isNight ? 'night-sky' : 'sunny-sky');

    const fg = createForegroundLayer();
    if (isNight) {
        createStars(fg, 100);
        createMoon(fg);
    } else {
        createSun(fg);
        createLightFlares(fg);
    }
}

function setupCloudyCondition(desc, isNight) {
    const isPartly = desc.includes('few') || desc.includes('scattered');
    document.body.classList.add(isNight ? 'weather-cloudy-night' : (isPartly ? 'weather-partly-cloudy' : 'weather-cloudy-day'));
    createBackgroundLayer(isNight ? 'cloudy-night-sky' : 'cloudy-day-sky');

    const fg = createForegroundLayer();
    if (isPartly && !isNight) createSun(fg, true);
    if (isPartly && isNight) createMoon(fg, true);

    createClouds(fg, isPartly ? 3 : 8, isNight);
}

function setupRainyCondition(isNight) {
    document.body.classList.add(isNight ? 'weather-rainy-night' : 'weather-rainy-day');
    createBackgroundLayer(isNight ? 'dark-rain-sky' : 'rain-sky');

    const fg = createForegroundLayer();
    createClouds(fg, 6, true); // Darker clouds
    createRain(fg, 120);
}

function setupStormyCondition(isNight) {
    document.body.classList.add('weather-stormy');
    createBackgroundLayer('storm-sky');

    const fg = createForegroundLayer();
    createClouds(fg, 8, true);
    createRain(fg, 200, true);
    createLightning(fg);
}

function setupSnowyCondition(isNight) {
    document.body.classList.add(isNight ? 'weather-snowy-night' : 'weather-snowy-day');
    createBackgroundLayer(isNight ? 'night-snow-sky' : 'snow-sky');

    const fg = createForegroundLayer();
    createClouds(fg, 4, isNight);
    createSnow(fg, 150);
}

function setupFoggyCondition(isNight) {
    document.body.classList.add(isNight ? 'weather-foggy-night' : 'weather-foggy-day');
    createBackgroundLayer(isNight ? 'fog-night-sky' : 'fog-day-sky');

    const fg = createForegroundLayer();
    createFog(fg);
}

<<<<<<< HEAD
export function setupDefaultBackground() {
    clearWeatherEffects();
    const fg = createForegroundLayer();

    // Mix nublado y neutro: sin sol brillante ni estrellas
    createClouds(fg, 7, false);
    createClouds(fg, 3, true); // Nubes más oscuras al fondo
    createFog(fg);
}

=======
>>>>>>> 830b9d1b8993e200baa0eef89eb623a3581f7f75
/* --- Element Generators --- */

function createBackgroundLayer(themeClass) {
    const bg = document.createElement('div');
    bg.className = `weather-layer-bg gradient-${themeClass}`;
    document.body.appendChild(bg);
}

function createForegroundLayer() {
    const fg = document.createElement('div');
    fg.className = 'weather-layer-fg';
    document.body.appendChild(fg);
    return fg;
}

function createSun(container, partial = false) {
    const sun = document.createElement('div');
    sun.className = `celestial-body premium-sun ${partial ? 'partial-sun' : ''}`;
    container.appendChild(sun);
}

function createMoon(container, partial = false) {
    const moon = document.createElement('div');
    moon.className = `celestial-body premium-moon ${partial ? 'partial-moon' : ''}`;
    container.appendChild(moon);
}

function createStars(container, count) {
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'premium-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        star.style.opacity = Math.random();
        container.appendChild(star);
    }
}

function createLightFlares(container) {
    for (let i = 0; i < 3; i++) {
        const flare = document.createElement('div');
        flare.className = 'premium-flare';
        flare.style.left = `${Math.random() * 60 + 20}%`;
        flare.style.animationDelay = `${i * 3}s`;
        container.appendChild(flare);
    }
}

function createClouds(container, count, isDark) {
    for (let i = 0; i < count; i++) {
        const cloud = document.createElement('div');
        cloud.className = `premium-cloud ${isDark ? 'dark-cloud' : 'light-cloud'}`;
        const scale = 0.5 + Math.random() * 1.5;
        cloud.style.transform = `scale(${scale})`;
        cloud.style.opacity = isDark ? 0.8 : (0.4 + Math.random() * 0.4);
        cloud.style.top = `${Math.random() * 50 - 10}%`; // Top half mainly
        cloud.style.left = `-${30 + Math.random() * 20}%`; // Start offscreen left
        cloud.style.animationDuration = `${40 + Math.random() * 60}s`; // Slow drift
        cloud.style.animationDelay = `-${Math.random() * 60}s`; // Stagger start
        container.appendChild(cloud);
    }
}

function createRain(container, count, stormy = false) {
    for (let i = 0; i < count; i++) {
        const drop = document.createElement('div');
        drop.className = `premium-rain ${stormy ? 'heavy-rain' : ''}`;
        drop.style.left = `${Math.random() * 120 - 10}%`; // angle compensation
        drop.style.animationDelay = `${Math.random() * 2}s`;
        drop.style.animationDuration = stormy ? `${0.4 + Math.random() * 0.3}s` : `${0.6 + Math.random() * 0.4}s`;
        container.appendChild(drop);
    }
}

function createSnow(container, count) {
    for (let i = 0; i < count; i++) {
        const flake = document.createElement('div');
        flake.className = 'premium-snow';
        flake.style.left = `${Math.random() * 100}%`;
        flake.style.animationDelay = `${Math.random() * 10}s`;
        flake.style.animationDuration = `${5 + Math.random() * 10}s`;

        const size = 3 + Math.random() * 6;
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.opacity = 0.3 + Math.random() * 0.7;

        container.appendChild(flake);
    }
}

function createFog(container) {
    for (let i = 0; i < 5; i++) {
        const mist = document.createElement('div');
        mist.className = 'premium-mist';
        mist.style.bottom = `${i * 10}%`;
        mist.style.animationDuration = `${20 + Math.random() * 15}s`;
        mist.style.animationDelay = `-${Math.random() * 10}s`;
        mist.style.opacity = 0.2 + Math.random() * 0.4;
        container.appendChild(mist);
    }
}

function createLightning(container) {
    setInterval(() => {
        if (Math.random() > 0.6) {
            const flash = document.createElement('div');
            flash.className = 'premium-lightning-flash';
            container.appendChild(flash);
            setTimeout(() => flash.remove(), 300);
        }
    }, 4000);
}
