/**
 * API Configuration
 * Configuración centralizada para todas las conexiones a APIs
 * Define: URLs base, timeouts, headers globales, etc.
 */

export const API_CONFIG = {
// URL base de la API
BASE_URL: process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com',

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
    BASE: '/users',
    GET_ALL: '/users',
    GET_BY_ID: '/users/:id',
    CREATE: '/auth/register',
    UPDATE: '/users/:id',
    DELETE: '/users/:id',
    TOGGLE_STATUS: '/users/:id/status',
    CHANGE_PASSWORD: '/users/:id/password',
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
    // Estado en tiempo real de computadores (Radar)
    COMPUTERS: {
    LIST: '/computers',  // GET - Lista todos los computadores con status ONLINE/OFFLINE
    },
    COMMANDS: {
    GET_ALL: '/commands',
    GET_BY_ID: '/commands/:id',
    GET_BY_STATUS: '/commands/status/:status',
    GET_BY_COMPUTER: '/commands/computer/:computerName',
    CREATE: '/commands',
    // Endpoints específicos por acción (usan query params: ?salaNumber=X&pcId=Y)
    TEST: '/commands/test',
    SHUTDOWN: '/commands/shutdown',
    REBOOT: '/commands/reboot',
    WAKE_ON_LAN: '/commands/wake-on-lan',
    LOCK_SESSION: '/commands/lock-session',
    BLOCK_WEBSITE: '/commands/block-website',
    UNBLOCK_WEBSITE: '/commands/unblock-website',
    INSTALL_APP: '/commands/install-app',
    INSTALL_SNAP: '/commands/install-snap',
    FORMAT: '/commands/format',
    UPDATE_STATUS: '/commands/:id/status',
    },
    // Gestión global de sitios bloqueados
    BLOCKED_WEBSITES: {
    LIST: '/blocked-websites',           // GET - Listar todos los sitios bloqueados
    ADD: '/blocked-websites',             // POST - Agregar sitio (broadcast a todos los PCs)
    COUNT: '/blocked-websites/count',     // GET - Contar sitios bloqueados
    DELETE: '/blocked-websites/:id',      // DELETE - Eliminar sitio bloqueado
    },
    INCIDENTS: {
    BASE: '/api/incidents',
    GET_ALL: '/api/incidents/all',
    GET_BY_STATUS: '/api/incidents',
    CREATE: '/api/incidents',
    COMPLETE: '/api/incidents/:id/complete',
    },
    CONTROL: {
    EXAM_MONITORING: '/control/:action',  // POST - START o STOP para vigilancia de exámenes
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
