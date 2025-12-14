import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {
Eye,
Monitor,
Wifi,
History,
Play,
Pause,
Download,
Maximize2,
X
} from 'lucide-react';

import { controlService } from '../../../services';

const ScreenMonitoringSection = () => {
const [screens, setScreens] = useState({});
const [isConnected, setIsConnected] = useState(false);
const [selectedScreen, setSelectedScreen] = useState(null);
const [showFullscreen, setShowFullscreen] = useState(false);
const [isLoading, setIsLoading] = useState(false);

const clientRef = useRef(null);
const historyRef = useRef({});
const MAX_HISTORY_SIZE = 100;
const BACKEND_URL = 'https://api.envyguard.crudzaso.com';

// CONTROL REMOTO - Usando controlService centralizado
const sendControl = async (action) => {
    setIsLoading(true);
    try {
    console.log('🎮 Enviando control:', action);
    await controlService.sendAction(action);
    console.log(`✅ Orden ${action} enviada correctamente.`);
    } catch (e) { 
    console.error('❌ Error:', e);
    alert("Error contactando al servidor. Verifica la conexión."); 
    } finally {
    setIsLoading(false);
    }
};

const downloadEvidence = (pcId) => {
    const history = historyRef.current[pcId];
    if (!history || history.length === 0) {
    alert("Aún no hay historial suficiente para descargar.");
    return;
    }
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EVIDENCIA_${pcId}_${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
};

useEffect(() => {
    if (clientRef.current) return;

    const client = new Client({
    webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws-spy`),
    debug: () => {},
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    });

    client.onConnect = () => {
    console.log("✅ Conectado al sistema de vigilancia remoto");
    setIsConnected(true);
    
    client.subscribe('/topic/screens', (msg) => {
        try {
        const data = JSON.parse(msg.body);
        const pcId = data.PcId || data.pcId;
        const img = data.ImageBase64 || data.image;

        if (pcId && img) {
            setScreens(prev => ({ 
            ...prev, 
            [pcId]: {
                image: img,
                timestamp: data.Timestamp || new Date().toISOString(),
                lastUpdate: new Date()
            }
            }));

            if (!historyRef.current[pcId]) historyRef.current[pcId] = [];
            historyRef.current[pcId].push({ timestamp: data.Timestamp, image: img });
            if (historyRef.current[pcId].length > MAX_HISTORY_SIZE) historyRef.current[pcId].shift();
        }
        } catch (e) { 
        console.error("Error procesando datos:", e); 
        }
    });
    };

    client.onStompError = (frame) => {
    console.error("Error STOMP:", frame.headers['message']);
    setIsConnected(false);
    };

    client.onWebSocketClose = () => {
    console.log("🔌 WebSocket desconectado");
    setIsConnected(false);
    };

    client.activate();
    clientRef.current = client;

    return () => {
    if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
    }
    };
}, []);

const screenEntries = Object.entries(screens);

return (
    <div className="flex flex-col h-full space-y-6">
    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
        <div className="flex items-center gap-3">
        <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <Eye className="text-purple-400" size={24} />
        </div>
        <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Centro de Vigilancia</h2>
            <p className="text-gray-500 text-sm font-sans">Monitoreo de pantallas en tiempo real</p>
        </div>
        </div>
        
        {/* Status & Controls */}
        <div className="flex items-center gap-3">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${isConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className={`text-xs font-bold ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
            {isConnected ? 'CONECTADO' : 'DESCONECTADO'}
            </span>
        </div>
        </div>
    </div>

    {/* Control Panel */}
    <div className="bg-black/40 border border-white/10 rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Control de Clase</h3>
            <span className="text-xs text-gray-600">|</span>
            <span className="text-xs text-gray-500">{screenEntries.length} pantallas activas</span>
        </div>
        <div className="flex gap-3">
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => sendControl('START')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/20"
            >
            <Play size={16} />
            INICIAR CLASE
            </motion.button>
            <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => sendControl('STOP')}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/20"
            >
            <Pause size={16} />
            TERMINAR CLASE
            </motion.button>
        </div>
        </div>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
        { label: "Pantallas Activas", value: screenEntries.length, icon: Monitor, color: "text-purple-400", bg: "from-purple-500/10 to-transparent", border: "border-purple-500/20" },
        { label: "Estado", value: isConnected ? "En Línea" : "Offline", icon: Wifi, color: isConnected ? "text-green-400" : "text-red-400", bg: isConnected ? "from-green-500/10 to-transparent" : "from-red-500/10 to-transparent", border: isConnected ? "border-green-500/20" : "border-red-500/20" },
        { label: "Historial/PC", value: MAX_HISTORY_SIZE, icon: History, color: "text-blue-400", bg: "from-blue-500/10 to-transparent", border: "border-blue-500/20" },
        ].map((stat, idx) => (
        <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`p-5 rounded-xl border ${stat.border} bg-gradient-to-b ${stat.bg} backdrop-blur-sm`}
        >
            <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${stat.color}`}>
                <stat.icon size={20} />
            </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
        </motion.div>
        ))}
    </div>

    {/* Screen Grid */}
    <div className="flex-1 overflow-y-auto">
        {screenEntries.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Monitor size={48} className="mb-4 opacity-30" />
            <h3 className="text-lg font-bold mb-2">Esperando señal de video...</h3>
            <p className="text-sm text-gray-600">Presiona "INICIAR CLASE" para despertar a los agentes.</p>
            <p className="text-xs text-gray-700 mt-2">Servidor: {BACKEND_URL}</p>
        </div>
        ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {screenEntries.map(([pcId, data]) => (
            <motion.div
                key={pcId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
                className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-purple-500/30 transition-all cursor-pointer"
                onClick={() => {
                setSelectedScreen({ pcId, ...data });
                setShowFullscreen(true);
                }}
            >
                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-bold text-green-400">EN LÍNEA</span>
                </div>

                {/* Screen Preview */}
                <div className="aspect-video bg-gradient-to-br from-black/80 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
                <img
                    src={`data:image/jpeg;base64,${data.image}`}
                    alt={pcId}
                    className="w-full h-full object-cover"
                />
                {/* Overlay on Hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <Maximize2 size={24} className="text-white" />
                </div>
                </div>

                {/* Info Footer */}
                <div className="p-3 space-y-2 border-t border-white/5">
                <h3 className="font-bold text-sm text-white font-mono truncate">🖥️ {pcId}</h3>
                <div className="flex justify-between items-center">
                    <span className="text-[10px] text-gray-500">
                    Actualizado: {data.lastUpdate ? new Date(data.lastUpdate).toLocaleTimeString() : 'N/A'}
                    </span>
                    <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                        e.stopPropagation();
                        downloadEvidence(pcId);
                    }}
                    className="p-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg border border-blue-500/30 transition-all"
                    title="Descargar evidencia"
                    >
                    <Download size={14} />
                    </motion.button>
                </div>
                </div>
            </motion.div>
            ))}
        </div>
        )}
    </div>

    {/* Fullscreen Modal */}
    <AnimatePresence>
        {showFullscreen && selectedScreen && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
            onClick={() => setShowFullscreen(false)}
        >
            <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="relative w-full max-w-5xl rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            >
            {/* Close Button */}
            <button
                onClick={() => setShowFullscreen(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors"
            >
                <X size={20} />
            </button>

            {/* Image */}
            <img
                src={`data:image/jpeg;base64,${selectedScreen.image}`}
                alt={selectedScreen.pcId}
                className="w-full h-auto"
            />

            {/* Footer Info */}
            <div className="bg-black/80 border-t border-white/10 p-4 flex justify-between items-center">
                <div>
                <h3 className="text-white font-bold font-mono text-lg">🖥️ {selectedScreen.pcId}</h3>
                <p className="text-xs text-gray-400 mt-1">
                    Última actualización: {selectedScreen.lastUpdate ? new Date(selectedScreen.lastUpdate).toLocaleString() : 'N/A'}
                </p>
                </div>
                <div className="flex items-center gap-3">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => downloadEvidence(selectedScreen.pcId)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all"
                >
                    <Download size={16} />
                    DESCARGAR EVIDENCIA
                </motion.button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/20 border border-green-500/30">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-bold text-green-400">EN LÍNEA</span>
                </div>
                </div>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
    </div>
);
};

export default ScreenMonitoringSection;
