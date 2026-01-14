/**
 * Helper Utilities
 * Funciones de ayuda generales para la aplicación
 */

/**
 * Combina clases CSS condicionalmente
 * Similar a clsx o classnames library
 * @param {...string} classes - Clases a combinar
 * @returns {string} Clases combinadas
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Crea una función debounced que retrasa la ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} delay - Delay en milisegundos
 * @returns {Function} Función debounced
 */
export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Crea una función throttled que limita la ejecución
 * @param {Function} func - Función a ejecutar
 * @param {number} limit - Límite en milisegundos
 * @returns {Function} Función throttled
 */
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Genera un ID único
 * @returns {string} ID único
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

/**
 * Copia texto al portapapeles
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} True si se copió correctamente
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error al copiar:', error);
    return false;
  }
}

/**
 * Descarga un archivo JSON
 * @param {Object} data - Datos a descargar
 * @param {string} filename - Nombre del archivo
 */
export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Espera un tiempo determinado
 * @param {number} ms - Milisegundos a esperar
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Capitaliza la primera letra de un string
 * @param {string} str - String a capitalizar
 * @returns {string} String capitalizado
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Verifica si un valor es vacío (null, undefined, '', [], {})
 * @param {any} value - Valor a verificar
 * @returns {boolean} True si está vacío
 */
export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
