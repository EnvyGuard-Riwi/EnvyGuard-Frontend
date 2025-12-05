import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import useInstallPrompt from '../hooks/useInstallPrompt';

/**
 * Componente para mostrar botón de instalación PWA
 * Se muestra automáticamente cuando la app es instalable
 * Compatible con YouTube, Instagram, y otras PWAs modernas
 */
const InstallButton = () => {
  const { isInstallable, isInstalled, handleInstall } = useInstallPrompt();
  const [showTooltip, setShowTooltip] = useState(false);

  // Debug: mostrar estado en consola
  useEffect(() => {
    console.log('[PWA Debug]', {
      isInstallable,
      isInstalled,
      hasBeforeInstallPrompt: 'beforeinstallprompt' in window,
      isStandalone: window.matchMedia('(display-mode: standalone)').matches,
    });
  }, [isInstallable, isInstalled]);

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative"
      >
        <button
          onClick={handleInstall}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95"
          title="Instalar EnvyGuard como aplicación en tu dispositivo"
          aria-label="Instalar aplicación"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Instalar</span>
        </button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-3 py-2 rounded whitespace-nowrap z-50 pointer-events-none"
            >
              Accede a EnvyGuard desde tu pantalla de inicio
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstallButton;
