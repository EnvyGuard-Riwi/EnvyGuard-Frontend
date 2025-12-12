import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Verificar si está en iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Verificar si la app ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Evento beforeinstallprompt
    const handleBeforeInstallPrompt = (event) => {
      // Prevenir que el navegador muestre el prompt automático
      event.preventDefault();
      setInstallPrompt(event);
    };

    // Evento appinstalled
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      console.log('Aplicación instalada exitosamente');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      return;
    }

    try {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      console.log(`El usuario ${outcome} la instalación`);
      setInstallPrompt(null);
    } catch (error) {
      console.error('Error al instalar la app:', error);
    }
  };

  return {
    installPrompt,
    isInstalled,
    isIOS,
    handleInstall,
    canInstall: installPrompt !== null && !isInstalled
  };
};
