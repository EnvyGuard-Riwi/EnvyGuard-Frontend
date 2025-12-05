import { useState, useEffect } from 'react';

/**
 * Hook para detectar si la PWA es instalable
 * Proporciona función para mostrar el prompt de instalación
 * Compatible con todos los navegadores modernos
 */
export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada en modo standalone
    const checkInstalledMode = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                          window.navigator.standalone === true;
      if (isStandalone) {
        setIsInstalled(true);
        setIsInstallable(false);
        return true;
      }
      return false;
    };

    // Verificar instalación inicial
    checkInstalledMode();

    const handleBeforeInstallPrompt = (e) => {
      console.log('✓ beforeinstallprompt event fired');
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
      setIsInstalled(false);
    };

    const handleAppInstalled = () => {
      console.log('✓ App instalada exitosamente');
      setInstallPrompt(null);
      setIsInstallable(false);
      setIsInstalled(true);
      
      // Guardar en localStorage para persistencia
      localStorage.setItem('envyguard-app-installed', 'true');
    };

    const handleAppUninstalled = () => {
      console.log('✓ App desinstalada');
      setIsInstalled(false);
      setInstallPrompt(null);
      localStorage.removeItem('envyguard-app-installed');
    };

    // Escuchar eventos de instalación
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('beforeuninstall', handleAppUninstalled);

    // Escuchar cambios en display-mode
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleDisplayModeChange = (e) => {
      if (e.matches) {
        setIsInstalled(true);
        setIsInstallable(false);
      } else {
        setIsInstalled(false);
      }
    };
    mediaQuery.addListener(handleDisplayModeChange);

    // Verificar si fue instalada previamente
    if (localStorage.getItem('envyguard-app-installed')) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('beforeuninstall', handleAppUninstalled);
      mediaQuery.removeListener(handleDisplayModeChange);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) {
      console.warn('No hay prompt de instalación disponible');
      return;
    }
    
    try {
      console.log('Mostrando prompt de instalación...');
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      
      console.log(`Usuario eligió: ${outcome}`);
      
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        setIsInstallable(false);
      } else if (outcome === 'dismissed') {
        console.log('Usuario rechazó la instalación');
      }
    } catch (error) {
      console.error('Error durante la instalación:', error);
    }
  };

  return {
    isInstallable,
    isInstalled,
    handleInstall,
  };
};

export default useInstallPrompt;
