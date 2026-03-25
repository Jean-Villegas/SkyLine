# Skyline - Inteligencia Meteorológica

Una aplicación web moderna para consultar pronósticos del clima utilizando la API de OpenWeatherMap.

## 🚀 Características

- **Búsqueda inteligente** con autocompletado y debounce
- **Datos en tiempo real** de clima, pronóstico extendido y calidad del aire
- **Tema claro/oscuro** con detección automática del sistema
- **Diseño responsive** y moderno
- **Manejo robusto de errores** y timeouts
- **Código modular** y mantenible

## 📁 Estructura del Proyecto

```
hola/
├── index.html              # Página principal
├── css/
│   └── style.css          # Estilos de la aplicación
├── js/
│   ├── app.js             # Aplicación principal
│   ├── config.js          # Configuración y constantes
│   ├── api.js             # Módulo de API
│   ├── ui.js              # Módulo de interfaz
│   ├── theme.js           # Gestión de temas
│   └── search.js          # Módulo de búsqueda
├── utils/
│   └── helpers.js         # Funciones utilitarias
├── assets/                # Recursos estáticos
└── README.md             # Este archivo
```

## 🛠️ Mejoras Implementadas

### 1. **Modularización del Código**
- Separación del código monolítico en módulos especializados
- Cada módulo tiene una responsabilidad única
- Mejor mantenibilidad y escalabilidad

### 2. **Optimización de Rendimiento**
- **Timeouts** en todas las llamadas a la API (10 segundos)
- **Debounce** optimizado para búsquedas (400ms)
- **Promise.allSettled** para manejar respuestas parciales
- **Fetch con timeout** para evitar cargas infinitas

### 3. **Manejo de Errores Robusto**
- Captura específica de diferentes tipos de errores
- Mensajes de error amigables para el usuario
- Manejo de estados offline/online
- Logging detallado para debugging

### 4. **Experiencia de Usuario Mejorada**
- Loader con estados de accesibilidad
- Indicadores visuales claros
- Retroalimentación inmediata
- Cierre automático de sugerencias

### 5. **Organización de Carpetas**
- Estructura clara y semántica
- Separación de responsabilidades
- Fácil navegación del código

## 🌐 API Utilizada

- **OpenWeatherMap API** para datos meteorológicos
- **Geocodificación** para búsqueda de ciudades
- **Datos actuales**, pronóstico extendido y calidad del aire

## 🎨 Tecnologías

- **JavaScript ES6+** con módulos
- **CSS3** con variables y animaciones
- **HTML5** semántico y accesible
- **OpenWeatherMap API**

## 🚀 Uso

1. Abre `index.html` en tu navegador
2. Busca cualquier ciudad usando el campo de búsqueda
3. Explora los datos meteorológicos en tiempo real
4. Cambia entre tema claro y oscuro con el botón correspondiente

## 🔧 Configuración

La clave de API está configurada en `js/config.js`. Para producción:

```javascript
export const API_CONFIG = {
    KEY: 'tu-api-key-aqui',
    BASE_URL: 'https://api.openweathermap.org',
    TIMEOUT: 10000,
    DEBOUNCE_DELAY: 400
};
```

## 📝 Notas de Desarrollo

- El código ahora es modular y sigue principios SOLID
- Se implementaron patrones de diseño modernos
- Mejoras significativas en rendimiento y UX
- Manejo completo de errores y edge cases
