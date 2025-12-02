import { useState, useEffect } from 'react';

/**
 * Hook para obtener la hora actual en tiempo real
 * Se actualiza cada segundo
 * @param {string} locale - Locale para formato de hora (ej: 'es-ES')
 * @param {object} options - Opciones de toLocaleTimeString
 * @returns {string} Hora formateada
 */
export function useCurrentTime(locale = 'es-ES', options = {}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const defaultOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    ...options
  };

  return currentTime.toLocaleTimeString(locale, defaultOptions);
}
