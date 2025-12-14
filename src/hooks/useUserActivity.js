import { useState, useEffect, useRef } from 'react';

/**
 * Hook para detectar si el usuario está activo o inactivo
 * @param {number} inactivityTimeout - Tiempo en ms para considerar al usuario inactivo (default: 60000 = 1 minuto)
 * @returns {boolean} - true si el usuario está activo, false si está inactivo
 */
export const useUserActivity = (inactivityTimeout = 60000) => {
  const [isActive, setIsActive] = useState(true);
  const lastActivityRef = useRef(Date.now());

  useEffect(() => {
    let inactivityTimer;
    let throttleTimer = null;
    
    const resetTimer = () => {
      // Throttle para evitar demasiadas actualizaciones con mousemove
      const now = Date.now();
      if (now - lastActivityRef.current < 1000) return; // Ignorar si pasó menos de 1 segundo
      lastActivityRef.current = now;
      
      setIsActive(true);
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        console.log('⏰ Usuario marcado como INACTIVO');
        setIsActive(false);
      }, inactivityTimeout);
    };
    
    // Eventos que consideramos como actividad (sin mousemove para evitar falsos positivos)
    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'];
    
    // Agregar listeners
    activityEvents.forEach(event => {
      document.addEventListener(event, resetTimer, { passive: true });
    });
    
    // Iniciar el timer
    resetTimer();
    
    console.log(`🟢 Hook useUserActivity iniciado. Timeout: ${inactivityTimeout}ms`);
    
    // Cleanup
    return () => {
      clearTimeout(inactivityTimer);
      clearTimeout(throttleTimer);
      activityEvents.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [inactivityTimeout]);

  return isActive;
};

export default useUserActivity;
