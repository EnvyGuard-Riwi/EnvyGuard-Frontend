/**
 * API Configuration
 * Configuración centralizada para todas las conexiones a APIs
 * Define: URLs base, timeouts, headers globales, etc.
 */

export const API_CONFIG = {
// URL base de la API
BASE_URL: process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api',

// Endpoints específicos
ENDPOINTS: {
    AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    HEALTH: '/auth/health',
    REFRESH: '/auth/refresh',
    VALIDATE: '/auth/validate',
    },
    USERS: {
    BASE: '/auth/users',
    GET_ALL: '/auth/users',
    GET_BY_ID: '/auth/users/:id',
    CREATE: '/auth/users',
    UPDATE: '/auth/users/:id',
    DELETE: '/auth/users/:id',
    TOGGLE_STATUS: '/auth/users/:id/status',
    CHANGE_PASSWORD: '/auth/users/:id/password',
    },
    DEVICES: {
    BASE: '/devices',
    GET_ALL: '/devices',
    GET_BY_ID: '/devices/:id',
    CREATE: '/devices',
    UPDATE: '/devices/:id',
    DELETE: '/devices/:id',
    EXECUTE_ACTION: '/devices/:id/actions/:action',
    GET_STATUS: '/devices/:id/status',
    GET_METRICS: '/devices/:id/metrics',
    },
},

// Configuración de axios
AXIOS_CONFIG: {
    timeout: 10000, // 10 segundos
    headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    },
},

// Tipos de errores
ERRORS: {
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
},

// Reintentos automáticos
RETRY_CONFIG: {
    maxRetries: 3,
    retryDelay: 1000, // ms
    retryableStatusCodes: [408, 429, 500, 502, 503, 504],
},

// Logs
DEBUG: process.env.NODE_ENV === 'development',
};

/**
 * Utilidad para reemplazar parámetros en URLs
 * @param {string} url - URL con parámetros (:id, :action, etc)
 * @param {Object} params - Objeto con los valores a reemplazar
 * @returns {string} URL con parámetros reemplazados
 */
export const replaceUrlParams = (url, params = {}) => {
let result = url;
Object.keys(params).forEach(key => {
    result = result.replace(`:${key}`, params[key]);
});
return result;
};

/**
 * Utilidad para logging
 * @param {string} level - Nivel de log (log, warn, error)
 * @param {string} message - Mensaje a loguear
 * @param {*} data - Datos adicionales
 */
export const apiLog = (level, message, data = null) => {
if (!API_CONFIG.DEBUG && level === 'log') return;

const timestamp = new Date().toISOString();
const prefix = `[${timestamp}] [API]`;

if (level === 'error') {
    console.error(`${prefix} ❌ ${message}`, data);
} else if (level === 'warn') {
    console.warn(`${prefix} ⚠️ ${message}`, data);
} else {
    console.log(`${prefix} ✅ ${message}`, data);
}
};

export default API_CONFIG;
