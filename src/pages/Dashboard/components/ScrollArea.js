import React from 'react';

/**
 * ScrollArea Component - Contenedor con scroll personalizado
 */
const ScrollArea = ({ children, className = "" }) => (
  <div className={`overflow-y-auto pr-2 ${className} scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent hover:scrollbar-thumb-cyan-700`}>
    {children}
  </div>
);

export default ScrollArea;
