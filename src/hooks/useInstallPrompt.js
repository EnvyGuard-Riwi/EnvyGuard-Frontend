import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

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
      console.log('📱 beforeinstallprompt capturado - PWA lista para instalar');
    };

    // Evento appinstalled
    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setIsInstalled(true);
      setIsInstalling(false);
      console.log('✅ Aplicación instalada exitosamente');
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
      console.warn('⚠️ No hay prompt de instalación disponible');
      return;
    }

    try {
      setIsInstalling(true);
      
      // Mostrar el prompt
      installPrompt.prompt();
      
      // Esperar la respuesta del usuario
      const { outcome } = await installPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('✅ Usuario aceptó la instalación');
        setInstallPrompt(null);
      } else if (outcome === 'dismissed') {
        console.log('ℹ️ Usuario canceló la instalación');
      }
      
      setIsInstalling(false);
    } catch (error) {
      console.error('❌ Error al instalar la app:', error);
      setIsInstalling(false);
    }
  };

  return {
    installPrompt,
    isInstalled,
    isIOS,
    handleInstall,
    isInstalling,
    canInstall: installPrompt !== null && !isInstalled && !isInstalling
  };
};
