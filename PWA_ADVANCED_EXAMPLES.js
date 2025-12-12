/**
 * EJEMPLOS AVANZADOS DE USO DE LA PWA
 * 
 * Estos son ejemplos que puedes usar si quieres funcionalidad adicional
 */

// ============================================
// 1. USAR EL HOOK EN OTROS COMPONENTES
// ============================================

// En cualquier componente de React:
import { useInstallPrompt } from '../hooks/useInstallPrompt';

function MiComponente() {
  const { canInstall, isInstalled, handleInstall } = useInstallPrompt();

  if (isInstalled) {
    return <p>✅ App instalada</p>;
  }

  return (
    <div>
      {canInstall && (
        <button onClick={handleInstall}>
          Instalar ahora
        </button>
      )}
    </div>
  );
}

// ============================================
// 2. MONITOREAR CAMBIOS DEL SERVICE WORKER
// ============================================

// En index.js o App.js, agrega esto para notificar sobre actualizaciones:

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registrado');

        // Verificar actualizaciones cada hora
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);

        // Detectar cuando hay una nueva versión
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // Hay una nueva versión disponible
              console.log('Nueva versión disponible');
              
              // Opcionalmente, mostrar notificación
              alert('Nueva versión de EnvyGuard disponible. Recarga la página.');
            }
          });
        });
      })
      .catch((error) => {
        console.error('Error registrando Service Worker:', error);
      });
  });
}

// ============================================
// 3. CREAR UN COMPONENTE DE ACTUALIZACIÓN
// ============================================

import React, { useState, useEffect } from 'react';

function UpdateAvailable() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registration = navigator.serviceWorker.registration;
      
      if (registration) {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      }
    }
  }, []);

  if (!updateAvailable) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: '#4CAF50',
      color: 'white',
      padding: '16px',
      borderRadius: '8px',
      zIndex: 999
    }}>
      <p>Nueva versión disponible</p>
      <button 
        onClick={() => window.location.reload()}
        style={{
          backgroundColor: 'white',
          color: '#4CAF50',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Actualizar
      </button>
    </div>
  );
}

export default UpdateAvailable;

// ============================================
// 4. DETECTAR CONEXIÓN OFFLINE
// ============================================

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

// Uso:
function MiApp() {
  const isOnline = useOnlineStatus();
  
  return (
    <div>
      {!isOnline && <p>⚠️ Sin conexión - Modo offline</p>}
      {isOnline && <p>✅ Conectado</p>}
    </div>
  );
}

// ============================================
// 5. COMPARTIR LA APP (OPCIONAL)
// ============================================

function ShareApp() {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EnvyGuard',
          text: 'Descarga EnvyGuard - Control de dispositivos en tiempo real',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error compartiendo:', error);
      }
    }
  };

  return (
    <button onClick={handleShare}>
      📤 Compartir App
    </button>
  );
}

// ============================================
// 6. INFORMACIÓN DE LA APP INSTALADA
// ============================================

function AppInfo() {
  const [appInfo, setAppInfo] = useState({
    isInstalled: window.matchMedia('(display-mode: standalone)').matches,
    userAgent: navigator.userAgent,
    online: navigator.onLine,
  });

  return (
    <div>
      <p>App instalada: {appInfo.isInstalled ? '✅ Sí' : '❌ No'}</p>
      <p>Conexión: {appInfo.online ? '✅ Online' : '⚠️ Offline'}</p>
    </div>
  );
}

// ============================================
// 7. FORZAR ACTUALIZACIÓN DEL SERVICE WORKER
// ============================================

function ForceUpdate() {
  const handleForceUpdate = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('Service Worker actualizado');
        }
      } catch (error) {
        console.error('Error actualizando Service Worker:', error);
      }
    }
  };

  return (
    <button onClick={handleForceUpdate}>
      🔄 Forzar actualización
    </button>
  );
}
