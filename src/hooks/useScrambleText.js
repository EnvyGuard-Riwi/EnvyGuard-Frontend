import { useState, useEffect } from 'react';

/**
 * Hook para efecto de texto "Matrix/Desencriptado"
 * Anima el texto como si se estuviera desencriptando
 * @param {string} text - Texto a animar
 * @returns {Object} { displayText: string, setIsHovering: function }
 */
export const useScrambleText = (text) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    let interval;
    
    if (isHovering) {
      let iteration = 0;
      
      interval = setInterval(() => {
        setDisplayText(prev => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [isHovering, text]);

  return { displayText, setIsHovering };
};
