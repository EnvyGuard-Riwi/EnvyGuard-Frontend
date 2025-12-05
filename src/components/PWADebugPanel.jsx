import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bug, X, ChevronDown } from 'lucide-react';

/**
 * Componente de Debug para PWA
 * Solo visible en desarrollo (localhost)
 * Muestra estado completo de Service Worker, Manifest, Cache, etc.
 */
const PWADebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState({
    serviceWorkers: 0,
    manifest: null,
    displayMode: 'browser',
    isInstalled: false,
    isStandalone: false,
    protocol: '',
    caches: [],
    beforeInstallPrompt: false,
  });

  const isDevelopment = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1';

  useEffect(() => {
    if (!isDevelopment) return;

    const gatherDebugInfo = async () => {
      try {
        // Service Worker
        let swCount = 0;
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          swCount = registrations.length;
        }

        // Manifest
        let manifestData = null;
        try {
          const response = await fetch('/manifest.json');
          if (response.ok) {
            manifestData = await response.json();
          }
        } catch (e) {
          console.log('Error loading manifest');
        }

        // Display mode
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                            window.navigator.standalone === true;
        const displayMode = isStandalone ? 'standalone' : 'browser';

        // Caches
        let cacheNames = [];
        if ('caches' in window) {
          try {
            cacheNames = await caches.keys();
          } catch (e) {
            console.log('Error loading caches');
          }
        }

        setDebugInfo({
          serviceWorkers: swCount,
          manifest: manifestData,
          displayMode,
          isInstalled: isStandalone,
          isStandalone,
          protocol: window.location.protocol,
          caches: cacheNames,
          beforeInstallPrompt: 'beforeinstallprompt' in window,
        });
      } catch (error) {
        console.error('Debug error:', error);
      }
    };

    gatherDebugInfo();
  }, [isDevelopment]);

  if (!isDevelopment) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed bottom-4 right-4 z-[9000]"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
      >
        {/* Botón flotante */}
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          title="PWA Debug Panel"
        >
          <Bug className="w-6 h-6" />
        </motion.button>

        {/* Panel de Debug */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-16 right-0 w-80 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl p-4 space-y-3 max-h-96 overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-700 pb-3">
                <h3 className="text-sm font-bold text-cyan-400">PWA Debug Panel</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Service Worker */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.serviceWorkers > 0 ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.serviceWorkers > 0 ? '✓' : '✗'}
                  </span>
                  <span className="text-slate-300">
                    Service Worker: <span className="font-mono text-cyan-300">{debugInfo.serviceWorkers}</span>
                  </span>
                </div>
              </div>

              {/* Manifest */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.manifest ? 'text-green-400' : 'text-red-400'}>
                    {debugInfo.manifest ? '✓' : '✗'}
                  </span>
                  <span className="text-slate-300">Manifest</span>
                </div>
                {debugInfo.manifest && (
                  <div className="ml-5 space-y-1 text-slate-400">
                    <div>📦 {debugInfo.manifest.name}</div>
                    <div>🎨 Display: <span className="font-mono">{debugInfo.manifest.display}</span></div>
                    <div>🖼️ Iconos: <span className="font-mono">{debugInfo.manifest.icons?.length || 0}</span></div>
                  </div>
                )}
              </div>

              {/* Display Mode */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.isStandalone ? 'text-green-400' : 'text-yellow-400'}>
                    {debugInfo.isStandalone ? '✓' : '◎'}
                  </span>
                  <span className="text-slate-300">
                    Display Mode: <span className="font-mono text-cyan-300">{debugInfo.displayMode}</span>
                  </span>
                </div>
                <div className="ml-5 text-slate-400">
                  📱 {debugInfo.isInstalled ? '✅ Instalada' : '❌ No instalada'}
                </div>
              </div>

              {/* beforeinstallprompt */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.beforeInstallPrompt ? 'text-green-400' : 'text-yellow-400'}>
                    {debugInfo.beforeInstallPrompt ? '✓' : '◎'}
                  </span>
                  <span className="text-slate-300">
                    beforeinstallprompt: <span className="font-mono text-cyan-300">
                      {debugInfo.beforeInstallPrompt ? 'Disponible' : 'No disponible (normal en dev)'}
                    </span>
                  </span>
                </div>
              </div>

              {/* HTTPS */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.protocol === 'https:' ? 'text-green-400' : 'text-yellow-400'}>
                    {debugInfo.protocol === 'https:' ? '✓' : '◎'}
                  </span>
                  <span className="text-slate-300">
                    Protocol: <span className="font-mono text-cyan-300">{debugInfo.protocol}</span>
                  </span>
                </div>
                {debugInfo.protocol !== 'https:' && (
                  <div className="ml-5 text-slate-400 text-xs">
                    ℹ️ En desarrollo, localhost es permitido
                  </div>
                )}
              </div>

              {/* Cache */}
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className={debugInfo.caches.length > 0 ? 'text-green-400' : 'text-slate-400'}>
                    {debugInfo.caches.length > 0 ? '✓' : '◎'}
                  </span>
                  <span className="text-slate-300">
                    Cache: <span className="font-mono text-cyan-300">{debugInfo.caches.length}</span>
                  </span>
                </div>
                {debugInfo.caches.length > 0 && (
                  <div className="ml-5 space-y-1 text-slate-400">
                    {debugInfo.caches.map((cache, i) => (
                      <div key={i} className="text-xs">💾 {cache}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="text-xs text-slate-400 border-t border-slate-700 pt-3 italic">
                Panel visible solo en desarrollo
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default PWADebugPanel;
