import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertCircle,
    CheckCircle2,
    Search,
    Archive,
    RefreshCw,
    Monitor,
    Clock,
    Filter,
    Loader,
    AlertTriangle,
    Eye,
    X,
    MapPin,
    Calendar,
    Tag
} from 'lucide-react';
import incidentService from '../../../services/IncidentService';
import { Toast } from '../components';

const NovedadesSection = ({ problemReports = [], setProblemReports }) => {
    const [filterSeverity, setFilterSeverity] = useState('all');
    const [viewTab, setViewTab] = useState('pendientes');
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingId, setLoadingId] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null); // Para el modal de detalles
    const [toast, setToast] = useState(null); // Para mostrar mensajes

    // Separar reportes
    const pendingReports = problemReports.filter(r => r.status !== 'COMPLETED');
    const completedReports = problemReports.filter(r => r.status === 'COMPLETED');

    // Ordenar reportes (más recientes primero)
    const getSortedReports = (reports) => {
        return [...reports].sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );
    };

    const sortedPendingReports = getSortedReports(pendingReports);
    const sortedCompletedReports = getSortedReports(completedReports);

    // Filtrado final
    let displayReports = viewTab === 'pendientes' ? sortedPendingReports : sortedCompletedReports;

    // Filtro por severidad
    if (filterSeverity !== 'all') {
        displayReports = displayReports.filter(r => r.severity === filterSeverity);
    }

    // Filtro por búsqueda
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        displayReports = displayReports.filter(r =>
            r.description?.toLowerCase().includes(term) ||
            r.device?.toLowerCase().includes(term) ||
            r.cpuCode?.toLowerCase().includes(term)
        );
    }

    // Estadísticas
    const stats = {
        total: problemReports.length,
        pending: pendingReports.length,
        completed: completedReports.length,
        high: problemReports.filter(r => r.severity === 'high' && r.status !== 'COMPLETED').length,
        medium: problemReports.filter(r => r.severity === 'medium' && r.status !== 'COMPLETED').length,
        low: problemReports.filter(r => r.severity === 'low' && r.status !== 'COMPLETED').length,
    };

    // Marcar como completado llamando a la API
    const handleToggleStatus = async (reportId, currentStatus) => {
        console.log('🔄 handleToggleStatus llamado:', { reportId, currentStatus });

        // Determinar si está pendiente (no completado)
        const isPending = currentStatus !== 'COMPLETED';

        if (isPending) {
            setLoadingId(reportId);
            try {
                console.log('📤 Enviando petición PATCH para completar incidente:', reportId);
                // Llamar a la API para marcar como completado
                const result = await incidentService.completeIncident(reportId);
                console.log('📥 Respuesta del servidor:', result);

                // Solo actualizar estado local si la API respondió correctamente
                setProblemReports(prev =>
                    prev.map(report =>
                        report.id === reportId
                            ? { ...report, status: 'COMPLETED', completedAt: new Date().toISOString() }
                            : report
                    )
                );

                setToast({ type: 'success', msg: 'Incidente marcado como completado' });
                setTimeout(() => setToast(null), 3000);
                console.log(`✅ Incidente ${reportId} marcado como completado`);
            } catch (error) {
                console.error(`❌ Error al completar incidente ${reportId}:`, error);
                console.error('Detalles del error:', error.response?.data || error.message);

                // Mostrar error al usuario - NO actualizar localmente
                const errorMsg = error.response?.status === 403
                    ? 'Sin permisos para completar este incidente'
                    : 'Error al completar incidente. Intenta de nuevo.';
                setToast({ type: 'error', msg: errorMsg });
                setTimeout(() => setToast(null), 4000);
            } finally {
                setLoadingId(null);
            }
        } else {
            // Para reabrir, solo actualizamos localmente (la API no tiene endpoint para reabrir)
            setProblemReports(prev =>
                prev.map(report =>
                    report.id === reportId ? { ...report, status: 'open' } : report
                )
            );
        }
    };

    // Configuración Visual de Severidad - Estilo con Naranja
    const getSeverityConfig = (severity) => {
        const configs = {
            high: { color: 'text-red-400', bg: 'bg-red-500', label: 'ALTA' },
            medium: { color: 'text-yellow-400', bg: 'bg-yellow-500', label: 'MEDIA' },
            low: { color: 'text-orange-400', bg: 'bg-orange-500', label: 'BAJA' },
        };
        return configs[severity] || configs.low;
    };

    return (
        <div id="novedades-section" className="flex flex-col h-full bg-[#0a0a0a] overflow-hidden">

            {/* Toast para mensajes */}
            {toast && <Toast type={toast.type} msg={toast.msg} onClose={() => setToast(null)} />}

            {/* Title Header */}
            <div className="px-6 py-5 flex items-center gap-4 border-b border-white/10">
                <div className="p-3 bg-orange-500/10 rounded-xl border border-orange-500/30">
                    <AlertTriangle size={22} className="text-orange-400" />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-white">Novedades</h2>
                    <p className="text-sm text-gray-500">Registro de incidencias reportadas en los dispositivos.</p>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="px-6 py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5">

                {/* Tabs */}
                <div className="flex items-center gap-2">
                    {[
                        { id: 'pendientes', label: 'Pendientes', icon: AlertCircle, count: pendingReports.length },
                        { id: 'completadas', label: 'Historial', icon: Archive, count: completedReports.length }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setViewTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${viewTab === tab.id
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                    : 'text-gray-500 hover:text-gray-300 border border-transparent hover:bg-white/5'}
            `}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${viewTab === tab.id ? 'bg-orange-500/30 text-orange-300' : 'bg-white/10 text-gray-400'}`}>
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search & Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-600" />
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-orange-500/50"
                        />
                    </div>

                    <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-orange-500/50 cursor-pointer appearance-none pr-8"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'right 8px center',
                            backgroundSize: '16px'
                        }}
                    >
                        <option value="all" className="bg-[#0a0a0a] text-gray-300">Todas</option>
                        <option value="high" className="bg-[#0a0a0a] text-red-400">🔴 Alta</option>
                        <option value="medium" className="bg-[#0a0a0a] text-orange-400">🟠 Media</option>
                        <option value="low" className="bg-[#0a0a0a] text-yellow-400">🟡 Baja</option>
                    </select>
                </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-[11px] font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5">
                <div className="col-span-3 lg:col-span-2">Timestamp</div>
                <div className="col-span-4 lg:col-span-4">Dispositivo</div>
                <div className="col-span-3 lg:col-span-4">Estado</div>
                <div className="col-span-2 lg:col-span-2 text-right">Detalles</div>
            </div>

            {/* Content List */}
            <div className="flex-1 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {displayReports.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center py-20 text-gray-600"
                        >
                            <Filter size={40} className="text-gray-700 mb-3" />
                            <p className="text-sm">No hay incidencias para mostrar</p>
                        </motion.div>
                    ) : (
                        displayReports.map(report => {
                            const isClosed = report.status === 'COMPLETED';
                            // Parsear timestamp correctamente - manejar diferentes formatos
                            let timestamp;
                            if (report.timestamp) {
                                // Si es string ISO o formato de fecha válido
                                timestamp = new Date(report.timestamp);
                                // Verificar si es fecha válida
                                if (isNaN(timestamp.getTime())) {
                                    timestamp = new Date(); // Fallback a fecha actual si no es válida
                                }
                            } else {
                                timestamp = new Date();
                            }
                            const dateStr = timestamp.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
                            const timeStr = timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
                            const config = getSeverityConfig(report.severity);

                            return (
                                <motion.div
                                    layout
                                    key={report.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className={`grid grid-cols-12 gap-4 items-center px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors ${isClosed ? 'opacity-50' : ''}`}
                                >
                                    {/* Timestamp */}
                                    <div className="col-span-3 lg:col-span-2">
                                        <p className="text-sm text-gray-300 font-mono">{dateStr}, {timeStr}</p>
                                    </div>

                                    {/* Device */}
                                    <div className="col-span-4 lg:col-span-4 flex items-center gap-3">
                                        <Monitor size={16} className="text-gray-600 flex-shrink-0" />
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-white truncate">{report.pcId || report.device || 'PC Generico'}</p>
                                            <p className="text-xs text-gray-500 truncate">
                                                IP: {report.ip || 'N/A'} • {report.cpuCode ? `PC-${report.cpuCode}` : 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Status */}
                                    <div className="col-span-3 lg:col-span-4 flex items-center gap-3">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                    ${isClosed
                                                ? 'bg-green-500/10 text-green-400'
                                                : 'bg-orange-500/10 text-orange-400'}
                    `}>
                                            {isClosed ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                            {isClosed ? 'Resuelto' : 'Pendiente'}
                                        </div>
                                        <div className={`hidden lg:flex items-center gap-1.5 px-2 py-1 rounded ${config.bg}/10`}>
                                            <AlertTriangle size={12} className={config.color} />
                                            <span className="text-xs text-gray-400">Ver descripción en detalles</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-2 lg:col-span-2 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(report.id, report.status)}
                                            disabled={loadingId === report.id}
                                            className={`p-2 rounded-lg transition-all
                        ${loadingId === report.id
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : isClosed
                                                        ? 'text-gray-500 hover:text-orange-400 hover:bg-orange-500/10'
                                                        : 'text-gray-500 hover:text-green-400 hover:bg-green-500/10'}
                    `}
                                            title={isClosed ? "Reabrir" : "Marcar como resuelto"}
                                        >
                                            {loadingId === report.id ? (
                                                <Loader size={16} className="animate-spin" />
                                            ) : isClosed ? (
                                                <RefreshCw size={16} />
                                            ) : (
                                                <CheckCircle2 size={16} />
                                            )}
                                        </button>
                                        <button
                                            onClick={() => setSelectedReport(report)}
                                            className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                            title="Ver detalles"
                                        >
                                            <Eye size={16} />
                                        </button>
                                    </div>

                                    {/* Mobile: Ver descripción en detalles */}
                                    <div className="lg:hidden col-span-12 mt-2 flex items-center gap-2">
                                        <AlertTriangle size={12} className={config.color} />
                                        <p className="text-xs text-gray-400">Toca el ojo para ver la descripción</p>
                                    </div>
                                </motion.div>
                            );
                        })
                    )}
                </AnimatePresence>
            </div>

            {/* Modal de Detalles */}
            <AnimatePresence>
                {selectedReport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
                        onClick={() => setSelectedReport(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg ${getSeverityConfig(selectedReport.severity).bg}/20`}>
                                        <AlertTriangle size={18} className={getSeverityConfig(selectedReport.severity).color} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white">Detalles de Incidencia</h3>
                                        <p className="text-xs text-gray-500">ID: #{selectedReport.id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 space-y-4">
                                {/* Descripción */}
                                <div className="p-3 bg-white/5 rounded-lg">
                                    <label className="text-xs text-gray-500 uppercase tracking-wider mb-2 block">Descripción</label>
                                    <p className="text-gray-200">{selectedReport.description || 'Sin descripción'}</p>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <Monitor size={14} />
                                            <span className="text-xs uppercase">Dispositivo</span>
                                        </div>
                                        <p className="text-white font-semibold">{selectedReport.pcId || selectedReport.device || 'N/A'}</p>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <MapPin size={14} />
                                            <span className="text-xs uppercase">ID del PC</span>
                                        </div>
                                        <p className="text-white font-semibold">{selectedReport.cpuCode ? `PC-${selectedReport.cpuCode}` : 'N/A'}</p>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <Calendar size={14} />
                                            <span className="text-xs uppercase">Fecha</span>
                                        </div>
                                        <p className="text-white font-semibold">
                                            {selectedReport.timestamp
                                                ? new Date(selectedReport.timestamp).toLocaleString('es-ES')
                                                : 'N/A'}
                                        </p>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <Tag size={14} />
                                            <span className="text-xs uppercase">Severidad</span>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getSeverityConfig(selectedReport.severity).bg}/20 ${getSeverityConfig(selectedReport.severity).color}`}>
                                            {getSeverityConfig(selectedReport.severity).label}
                                        </span>
                                    </div>
                                </div>

                                {/* IP */}
                                {selectedReport.ip && selectedReport.ip !== 'N/A' && (
                                    <div className="p-3 bg-white/5 rounded-lg">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <span className="text-xs uppercase">Dirección IP</span>
                                        </div>
                                        <p className="text-white font-mono">{selectedReport.ip}</p>
                                    </div>
                                )}

                                {/* Estado */}
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <span className="text-gray-500 text-sm">Estado actual</span>
                                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium
                    ${selectedReport.status === 'COMPLETED'
                                            ? 'bg-green-500/10 text-green-400'
                                            : 'bg-orange-500/10 text-orange-400'}
                `}>
                                        {selectedReport.status === 'COMPLETED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                                        {selectedReport.status === 'COMPLETED' ? 'Resuelto' : 'Pendiente'}
                                    </div>
                                </div>

                                {/* Fecha de resolución si aplica */}
                                {selectedReport.completedAt && (
                                    <div className="p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                                        <p className="text-xs text-green-400">
                                            Resuelto el {new Date(selectedReport.completedAt).toLocaleString('es-ES')}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="px-6 py-4 border-t border-white/10 flex justify-end gap-3">
                                <button
                                    onClick={() => setSelectedReport(null)}
                                    className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                                >
                                    Cerrar
                                </button>
                                {selectedReport.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => {
                                            handleToggleStatus(selectedReport.id, selectedReport.status);
                                            setSelectedReport(null);
                                        }}
                                        className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-medium hover:bg-green-500/30 transition-colors flex items-center gap-2"
                                    >
                                        <CheckCircle2 size={16} />
                                        Marcar como resuelto
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NovedadesSection;