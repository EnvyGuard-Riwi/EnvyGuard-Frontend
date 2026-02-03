import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Monitor, Power, WifiOff, Globe, TrendingUp, Activity, AlertTriangle } from 'lucide-react';
import blockedWebsitesService from '../../../services/BlockedWebsitesService';
import deviceService from '../../../services/DeviceService';

// 1. OVERVIEW SECTION (PANEL PRINCIPAL)
const OverviewSection = ({ problemReports = [] }) => {
    const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
    const [currentTime, setCurrentTime] = useState(new Date());
    const [blockedSitesCount, setBlockedSitesCount] = useState(0);
    const [pcStats, setPcStats] = useState({ total: 0, online: 0, offline: 0 });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Cargar conteo de sitios bloqueados desde la API
    useEffect(() => {
        const loadBlockedSitesCount = async () => {
            try {
                // Intentar usar getCount primero, si falla usar getAll y contar
                try {
                    const countData = await blockedWebsitesService.getCount();
                    // El endpoint puede devolver un número o un objeto con total
                    const total = typeof countData === 'number' ? countData : (countData.total || countData.count || 0);
                    setBlockedSitesCount(total);
                    console.log('[Overview] Conteo de sitios bloqueados:', total);
                } catch (countError) {
                    // Fallback: obtener lista completa y contar
                    const sites = await blockedWebsitesService.getAll();
                    setBlockedSitesCount(sites.length);
                    console.log('[Overview] Sitios bloqueados (desde lista):', sites.length);
                }
            } catch (error) {
                console.error('[Overview] Error cargando sitios bloqueados:', error);
                setBlockedSitesCount(0);
            }
        };

        loadBlockedSitesCount();

        // Refrescar cada 30 segundos
        const interval = setInterval(loadBlockedSitesCount, 30000);
        return () => clearInterval(interval);
    }, []);

    // Cargar estadísticas de computadores
    useEffect(() => {
        const loadPCStats = async () => {
            try {
                const computers = await deviceService.getComputersStatus();
                const total = computers.length;
                const online = computers.filter(c => c.status?.toUpperCase() === 'ONLINE').length;
                const offline = total - online;

                setPcStats({ total, online, offline });
                console.log('[Overview] Estadísticas de PCs cargadas:', { total, online, offline });
            } catch (error) {
                console.error('[Overview] Error cargando estadísticas de PCs:', error);
            }
        };

        loadPCStats();
        const interval = setInterval(loadPCStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const formattedTime = currentTime.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });

    return (
        <div className="space-y-4 md:space-y-6">
            {/* Welcome Banner */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full p-4 md:p-6 rounded-2xl bg-gradient-to-r from-cyan-900/20 via-black to-black border border-cyan-500/20 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px]" />
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-4">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Bienvenido, Agente.</h2>
                        {/* ... */}

                        <div className="text-cyan-400/80 font-mono text-sm flex items-center gap-2">
                            <div className="relative w-2 h-2">
                                <span className="absolute inset-0 rounded-full bg-green-500 z-10" />
                                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
                            </div>
                            SISTEMA OPERATIVO Y SEGURO.
                        </div>
                    </div>
                    <div className="text-right hidden sm:block">
                        <p className="text-4xl font-mono text-white/10 font-bold">{formattedTime}</p>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial="hidden" animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
                {[
                    { label: "Total Computadores", value: pcStats.total.toString().padStart(2, '0'), icon: Monitor, color: "text-cyan-400", bg: "from-cyan-500/10 to-transparent", border: "border-cyan-500/20" },
                    { label: "Encendidos", value: pcStats.online.toString().padStart(2, '0'), icon: Power, color: "text-green-400", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
                    { label: "Novedades", value: problemReports.filter(r => r.status === "open").length.toString().padStart(2, '0'), icon: AlertTriangle, color: "text-orange-400", bg: "from-orange-500/10 to-transparent", border: "border-orange-500/20" },
                    { label: "Sitios Bloqueados", value: blockedSitesCount.toString(), icon: Globe, color: "text-red-400", bg: "from-red-500/10 to-transparent", border: "border-red-500/20" },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        variants={fadeInUp}
                        whileHover={{ scale: 1.02, y: -5 }}
                        className={`relative p-5 rounded-xl border ${stat.border} bg-gradient-to-b ${stat.bg} backdrop-blur-sm group overflow-hidden`}
                    >
                        <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
                            <stat.icon size={80} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${stat.color}`}>
                                <stat.icon size={20} />
                            </div>
                            <TrendingUp size={16} className="text-green-500" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
                        <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
                    </motion.div>
                ))}
            </motion.div>
            {/* Charts & Logs Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 md:gap-6 h-full">

                {/* Novedades Pendientes - Terminal Style */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                    className="lg:col-span-2 rounded-xl border border-cyan-500/40 bg-black/80 backdrop-blur-md flex flex-col overflow-hidden transition-all duration-300"
                    style={{
                        minHeight: 'auto',
                        maxHeight: window.innerWidth < 768 ? '450px' : `${Math.min(300 + problemReports.filter(r => r.status === "open").length * 80, 800)}px`
                    }}
                >
                    {/* Terminal Header */}
                    <div className="px-6 py-3 border-b border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 to-black/60 flex items-center justify-between flex-shrink-0">
                        <div className="flex items-center gap-3">
                            {/* Mac-style buttons */}
                            <div className="flex gap-2">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <h3 className="font-bold text-cyan-400 font-mono text-xs">
                                NOVEDADES_PENDIENTES              </h3>
                        </div>
                        <div className="text-xs text-cyan-500/70 font-mono">
                            [{problemReports.filter(r => r.status === "open").length} logs]
                        </div>
                    </div>

                    {/* Terminal Content */}
                    <div className="p-0 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-black/40 flex-1">
                        {problemReports.filter(r => r.status === "open").length > 0 ? (
                            <div className="space-y-0">
                                {problemReports.filter(r => r.status === "open")
                                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                                    .map((report, i) => {
                                        const timestamp = report.timestamp ? new Date(report.timestamp) : new Date();
                                        const dateStr = timestamp.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                                        const timeStr = timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                                        const severityLabel = {
                                            high: 'ALTA',
                                            medium: 'MEDIA',
                                            low: 'BAJA',
                                        }[report.severity] || 'BAJA';

                                        const severityColor = {
                                            high: 'text-red-400',
                                            medium: 'text-yellow-400',
                                            low: 'text-cyan-400',
                                        }[report.severity] || 'text-cyan-400';

                                        return (
                                            <div
                                                key={i}
                                                onClick={() => {
                                                    // Scroll a la sección de Novedades
                                                    const novedadesSection = document.getElementById('novedades-section');
                                                    if (novedadesSection) {
                                                        novedadesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                        // Highlight la sección por un momento
                                                        novedadesSection.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) 2';
                                                    }
                                                }}
                                                className="border-b border-cyan-500/10 px-6 py-3 hover:bg-cyan-950/40 hover:border-cyan-500/30 transition-all duration-200 cursor-pointer group"
                                            >
                                                <div className="flex items-start gap-4 text-xs font-mono">
                                                    <span className="text-cyan-500/50 flex-shrink-0">[{dateStr}]</span>
                                                    <span className="text-cyan-500/50 flex-shrink-0">[{timeStr}]</span>
                                                    <span className={`font-bold flex-shrink-0 w-12 ${severityColor}`}>{severityLabel}</span>
                                                    <span className="text-cyan-300 flex-1 group-hover:text-cyan-200 transition-colors">{report.description}</span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs font-mono text-cyan-500/60 mt-2 ml-32 flex-wrap">
                                                    {report.location && (
                                                        <span className="flex items-center gap-1">
                                                            <span>{report.location}</span>
                                                        </span>
                                                    )}
                                                    {report.sala && (
                                                        <span className="flex items-center gap-1">
                                                            <span>{report.sala.replace('sala', 'Sala ')}</span>
                                                        </span>
                                                    )}
                                                    {report.cpuCode && (
                                                        <span className="flex items-center gap-1">
                                                            <span className="font-bold text-cyan-400">PC #{report.cpuCode}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-40 text-cyan-500/40 font-mono text-sm">
                                No hay novedades pendientes
                            </div>
                        )}
                    </div>

                    {/* Terminal Footer */}
                    <div className="border-t border-cyan-500/20 px-6 py-2.5 bg-black/40 text-right flex-shrink-0">
                        <span className="text-xs text-cyan-500/60 font-mono">
                            Total: {problemReports.filter(r => r.status === "open").length} pendientes
                        </span>
                    </div>
                </motion.div>

                {/* System Health */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                    className="rounded-xl border border-purple-500/40 bg-black/80 backdrop-blur-md p-6 flex flex-col overflow-hidden transition-all duration-300"
                    style={{
                        minHeight: 'auto',
                        maxHeight: window.innerWidth < 768 ? '600px' : '300px'
                    }}
                >
                    <h3 className="font-bold text-purple-400 mb-4 flex items-center gap-2 font-mono text-xs flex-shrink-0">
                        <Activity size={16} /> SALUD_SISTEMA
                    </h3>
                    <div className="space-y-3 flex-1">
                        {[
                            {
                                label: "Equipos En Línea",
                                value: Math.min(85, Math.max(20, 100 - (problemReports.filter(r => r.status === "open").length * 5))),
                                color: "from-green-600 to-emerald-500",
                                icon: "✓"
                            },
                            {
                                label: "Problemas Críticos",
                                value: Math.min(100, problemReports.filter(r => r.severity === "high").length * 15),
                                color: "from-red-600 to-orange-500",
                                icon: "!"
                            },
                            {
                                label: "Uso de Ancho de Banda",
                                value: 52,
                                color: "from-cyan-600 to-blue-500",
                                icon: "↔"
                            },
                        ].map((metric, i) => (
                            <div key={i}>
                                <div className="flex justify-between text-xs font-mono mb-1.5 text-gray-400">
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg opacity-60">{metric.icon}</span>
                                        {metric.label}
                                    </span>
                                    <span className="text-white font-bold">{metric.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }} animate={{ width: `${metric.value}%` }}
                                        transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                                        className={`h-full bg-gradient-to-r ${metric.color}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default OverviewSection;