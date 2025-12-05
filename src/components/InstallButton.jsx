import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download } from 'lucide-react';
import useInstallPrompt from '../hooks/useInstallPrompt';

/**
 * Componente para mostrar botón de instalación PWA
 * Se muestra automáticamente cuando la app es instalable
 */
const InstallButton = () => {
  const { isInstallable, isInstalled, handleInstall } = useInstallPrompt();

  if (!isInstallable || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={handleInstall}
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-white text-sm font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/50 active:scale-95"
        title="Instalar EnvyGuard como aplicación"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Instalar</span>
      </motion.button>
    </AnimatePresence>
  );
};

export default InstallButton;
