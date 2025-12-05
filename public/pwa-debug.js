// Script de debug para PWA - Ejecutar en la consola del navegador

console.log('%c=== PWA DEBUG ===', 'color: cyan; font-size: 16px; font-weight: bold');

// 1. Verificar Service Worker
console.log('%c1. Service Worker', 'color: yellow; font-weight: bold');
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    console.log(`✓ ${registrations.length} Service Worker(s) registrado(s):`);
    registrations.forEach(reg => {
      console.log(`  - Scope: ${reg.scope}`);
      console.log(`  - Active: ${reg.active ? 'Sí' : 'No'}`);
    });
  });
} else {
  console.warn('✗ Service Worker no soportado');
}

// 2. Verificar Manifest
console.log('%c2. Manifest', 'color: yellow; font-weight: bold');
fetch('/manifest.json')
  .then(r => r.json())
  .then(manifest => {
    console.log('✓ Manifest encontrado:');
    console.log(`  - Nombre: ${manifest.name}`);
    console.log(`  - Display: ${manifest.display}`);
    console.log(`  - Iconos: ${manifest.icons.length}`);
    console.log(`  - Start URL: ${manifest.start_url}`);
  })
  .catch(e => console.warn('✗ Error cargando manifest:', e));

// 3. Verificar beforeinstallprompt
console.log('%c3. beforeinstallprompt Event', 'color: yellow; font-weight: bold');
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('✓ beforeinstallprompt event DISPARADO');
  deferredPrompt = e;
  console.log('  - Puedes instalar la app ahora');
});

if (deferredPrompt) {
  console.log('✓ beforeinstallprompt disponible');
} else {
  console.warn('✗ beforeinstallprompt no ha sido disparado (normal en desarrollo)');
}

// 4. Verificar Display Mode
console.log('%c4. Display Mode', 'color: yellow; font-weight: bold');
const displayMode = window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser';
console.log(`  - Modo actual: ${displayMode}`);
const isInstalled = window.navigator.standalone === true || displayMode === 'standalone';
console.log(`  - ¿Instalada? ${isInstalled ? 'Sí' : 'No'}`);

// 5. Verificar HTTPS/HTTPS
console.log('%c5. Seguridad', 'color: yellow; font-weight: bold');
console.log(`  - Protocol: ${window.location.protocol}`);
console.log(`  - HTTPS: ${window.location.protocol === 'https:' ? 'Sí' : 'No (dev ok en localhost)'}`);

// 6. Función para instalar manualmente (testing)
console.log('%c6. Testing Manual', 'color: yellow; font-weight: bold');
window.testInstall = () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(choice => {
      console.log('Usuario eligió:', choice.outcome);
      deferredPrompt = null;
    });
  } else {
    console.warn('No hay prompt disponible. Necesitas acceder desde HTTPS o después del beforeinstallprompt');
  }
};
console.log('Ejecuta: window.testInstall() para probar la instalación');

// 7. Cache status
console.log('%c7. Cache', 'color: yellow; font-weight: bold');
if ('caches' in window) {
  caches.keys().then(names => {
    console.log(`✓ ${names.length} cache(s) encontrado(s):`);
    names.forEach(name => console.log(`  - ${name}`));
  });
} else {
  console.warn('✗ Cache API no soportada');
}

console.log('%c=== FIN DEBUG ===', 'color: cyan; font-size: 16px; font-weight: bold');
