import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Monitor,
    Wifi,
    History,
    Play,
    Pause,
    Download,
    Maximize2,
    X,
    Loader,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

import { findPCAndLocation } from '../../../utils/monitorUtils';
import { useScreenMonitoring } from '../../../hooks/useScreenMonitoring';

const ScreenMonitoringSection = () => {
    // Usar el hook compartido
    const { screens, isConnected, isMonitoringActive, isLoading, error, sendControl, downloadEvidence } = useScreenMonitoring();

    // Estados locales para validación visual (toast)
    const [selectedScreen, setSelectedScreen] = useState(null);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [toast, setToast] = useState(null);

    // Efecto para sincronizar mensajes de error/éxito del hook si fuera necesario, 
    // pero por ahora manejamos el toast localmente en los handlers
    const handleControl = async (action) => {
        const result = await sendControl(action);
        setToast({
            type: result.success ? 'success' : 'error',
            msg: result.message
        });
        setTimeout(() => setToast(null), 3000);
    };

    const screenEntries = Object.entries(screens);
    const MAX_HISTORY_SIZE = 100; // Constante visual
    // BACKEND_URL se maneja internamente en el hook

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
                        <span className="text-xs text-gray-600">|</span>
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isMonitoringActive ? 'bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-500'}`} />
                            <span className={`text-xs font-bold ${isMonitoringActive ? 'text-green-400' : 'text-gray-500'}`}>
                                {isMonitoringActive ? 'MONITOREANDO' : 'INACTIVO'}
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleControl('START')}
                            disabled={isLoading || isMonitoringActive}
                            className={`group flex items-center gap-2.5 px-5 py-2.5 bg-transparent border rounded-lg font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isMonitoringActive
                                ? 'border-green-500/20 text-green-500/50'
                                : 'border-green-500/40 hover:border-green-400 text-green-400 hover:text-green-300 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]'
                                }`}
                        >
                            <span className="p-1 rounded-md bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                {isLoading ? <Loader size={14} className="animate-spin" /> : <Play size={14} />}
                            </span>
                            {isMonitoringActive ? 'EN PROGRESO' : 'INICIAR CLASE'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleControl('STOP')}
                            disabled={isLoading || !isMonitoringActive}
                            className={`group flex items-center gap-2.5 px-5 py-2.5 bg-transparent border rounded-lg font-medium text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${!isMonitoringActive
                                ? 'border-red-500/20 text-red-500/50'
                                : 'border-red-500/40 hover:border-red-400 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]'
                                }`}
                        >
                            <span className="p-1 rounded-md bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                                {isLoading ? <Loader size={14} className="animate-spin" /> : <Pause size={14} />}
                            </span>
                            TERMINAR CLASE
                        </motion.button>
                    </div>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {(toast || error) && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-4 right-4 z-[200] flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg ${(toast?.type === 'success') ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
                            (toast?.type === 'error' || error) ? 'bg-red-500/20 border border-red-500/30 text-red-400' :
                                'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400'
                            }`}
                    >
                        {(toast?.type === 'success') ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span className="text-sm font-medium">{toast?.msg || error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        <p className="text-xs text-gray-700 mt-2">Servidor: {process.env.REACT_APP_WS_URL || 'https://api.andrescortes.dev'}</p>
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
