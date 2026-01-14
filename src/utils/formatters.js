/**
 * Formatters Utilities
 * Funciones de formateo para la aplicación
 */

/**
 * Formatea bytes a formato legible (KB, MB, GB, etc)
 * @param {number} bytes - Cantidad de bytes
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Formato legible (ej: "1.5 GB")
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Formatea un número como porcentaje
 * @param {number} value - Valor a formatear
 * @param {number} decimals - Decimales a mostrar
 * @returns {string} Porcentaje formateado (ej: "75%")
 */
export function formatPercent(value, decimals = 0) {
  return parseFloat(value).toFixed(decimals) + '%';
}

/**
 * Formatea una fecha a formato legible
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale para formato (default: 'es-ES')
 * @returns {string} Fecha formateada
 */
export function formatDate(date, locale = 'es-ES') {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * Formatea una fecha con hora
 * @param {string|Date} date - Fecha a formatear
 * @param {string} locale - Locale para formato (default: 'es-ES')
 * @returns {string} Fecha y hora formateada
 */
export function formatDateTime(date, locale = 'es-ES') {
  if (!date) return 'N/A';
  const d = new Date(date);
  return d.toLocaleString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Formatea un tiempo relativo (hace X minutos, etc)
 * @param {string|Date} date - Fecha a comparar
 * @returns {string} Tiempo relativo
 */
export function formatRelativeTime(date) {
  if (!date) return 'N/A';
  
  const now = new Date();
  const d = new Date(date);
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'hace unos segundos';
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  
  return formatDate(date);
}
