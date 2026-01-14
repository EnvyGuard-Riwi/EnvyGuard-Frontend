import React, { useState } from 'react';
import { Download, X, Loader } from 'lucide-react';
import { useInstallPrompt } from '../hooks/useInstallPrompt';

const InstallPrompt = () => {
  const { canInstall, isIOS, handleInstall, isInstalled, isInstalling } = useInstallPrompt();
  const [showPrompt, setShowPrompt] = useState(false); // Cambiar a false para ocultarlo

  if (!showPrompt || isInstalled || (!canInstall && !isIOS)) {
    return null;
  }

  const handleInstallClick = async () => {
    await handleInstall();
    // Solo cerrar después de confirmar la instalación
    setTimeout(() => {
      setShowPrompt(false);
    }, 1000);
  };

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
                onClick={handleInstallClick}
                disabled={isInstalling}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-500 text-white font-medium text-xs md:text-sm py-2 px-3 rounded-md transition-colors w-full justify-center md:w-auto"
              >
                {isInstalling ? (
                  <>
                    <Loader size={16} className="animate-spin" />
                    Instalando...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Instalar App
                  </>
                )}
              </button>
            )}
          </div>

          <button
            onClick={() => setShowPrompt(false)}
            disabled={isInstalling}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0 disabled:opacity-50"
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
