import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

window.global = window;

// Registrar Service Worker para funcionalidad PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('✅ Service Worker registrado exitosamente:', registration);
        console.log('📱 PWA está listo para ser instalado');
        
        // Notificar al SW que puede actualizar
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      })
      .catch((error) => {
        console.error('❌ Error al registrar Service Worker:', error);
      });

    // Detectar actualizaciones del SW
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  });
} else {
  console.warn('⚠️ Service Worker no soportado en este navegador');
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
