import { useState, useEffect } from 'react';

/**
 * Hook para obtener la posición actual del mouse
 * @returns {Object} { x: number, y: number } - Posición del mouse en píxeles
 */
export function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    
    window.addEventListener("mousemove", updateMousePosition);
    
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
}
