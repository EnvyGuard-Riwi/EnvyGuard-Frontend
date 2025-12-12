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
        console.log('Service Worker registrado exitosamente:', registration);
      })
      .catch((error) => {
        console.error('Error al registrar Service Worker:', error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
