import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallPrompt = () => {
  const { canInstall, isIOS, handleInstall, isInstalled } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(true);

  if (!showPrompt || isInstalled || (!canInstall && !isIOS)) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto md:max-w-sm z-50">
      <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-700 rounded-lg shadow-2xl p-4 backdrop-blur-sm">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm md:text-base mb-1">
              EnvyGuard
            </h3>
            <p className="text-gray-300 text-xs md:text-sm mb-3">
              {isIOS
                ? 'Presiona el botón Compartir y selecciona "Añadir a Pantalla de Inicio"'
                : 'Instala nuestra app para acceso rápido y funcionalidad offline'}
            </p>

            {canInstall && (
              <button
                onClick={() => {
                  handleInstall();
                  setShowPrompt(false);
                }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs md:text-sm py-2 px-3 rounded-md transition-colors w-full justify-center md:w-auto"
              >
                <Download size={16} />
                Instalar App
              </button>
            )}
          </div>

          <button
            onClick={() => setShowPrompt(false)}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Cerrar"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
