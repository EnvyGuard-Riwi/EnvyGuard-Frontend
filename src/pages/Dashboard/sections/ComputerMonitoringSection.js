import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Monitor,
    ChevronDown,
    Wifi,
    WifiOff,
    Server,
    X,
    CheckCircle2,
    Power,
    RotateCw,
    HardDrive,
    Package,
    FileText,
    Zap,
    Terminal,
    AlertCircle,
    Lock,
    Activity,
    Eye,
    Loader,
    Download
} from 'lucide-react';
import { deviceService, WebSocketService, incidentService, INCIDENT_SEVERITY, commandService, COMMAND_ACTIONS } from '../../../services';
import Toast from '../components/Toast';
import ScrollArea from '../components/ScrollArea';
import ReportProblemModal from '../components/ReportProblemModal';
import { salas, getLocationFromPC, getSalaNumber, findPCAndLocation } from '../../../utils/monitorUtils';
import { useScreenMonitoring } from '../../../hooks/useScreenMonitoring';

const ComputerMonitoringSection = ({ showDeployModal, setShowDeployModal, deployTargetPCs, setDeployTargetPCs, problemReports, setProblemReports }) => {
    const [selectedPC, setSelectedPC] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [selectedSala, setSelectedSala] = useState("sala1");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [filter, setFilter] = useState("all");
    const [selectedList, setSelectedList] = useState(new Set());
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [toast, setToast] = useState(null);
    const [loadingDevices, setLoadingDevices] = useState(false);
    const [deviceStatusOverrides, setDeviceStatusOverrides] = useState({}); // ip -> {status, meta}
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedPCForReport, setSelectedPCForReport] = useState(null);
    const [isCheckingStatus, setIsCheckingStatus] = useState(false);
    const [lastStatusCheck, setLastStatusCheck] = useState(null);
    // Estado para PCs con novedades pendientes (IPs de PCs con incidentes activos)
    const [pcsWithIncidents, setPcsWithIncidents] = useState(new Set());
    // Estados para vigilancia de pantallas
    const { screens, isConnected: isScreenConnected, isMonitoringActive, isLoading: isMonitorLoading, sendControl, downloadEvidence } = useScreenMonitoring();
    const [selectedScreenPC, setSelectedScreenPC] = useState(null); // PC seleccionado para ver pantalla

    // Configuración de Salas - DATOS COMPLETOS (Importados de utils)


    const handleReportSubmit = async (reportData) => {
        const location = getLocationFromPC(reportData.device, reportData.sala);

        // Mapear severidad del frontend (low/medium/high) al backend (LOW/MEDIUM/HIGH)
        const severityMap = {
            'low': INCIDENT_SEVERITY.LOW,
            'medium': INCIDENT_SEVERITY.MEDIUM,
            'high': INCIDENT_SEVERITY.HIGH,
        };

        try {
            // Crear el incidente en el backend
            const createdIncident = await incidentService.createIncident({
                description: `[${reportData.sala}] [${reportData.cpuCode}] [IP: ${reportData.ip}] [PC: ${reportData.pcId || reportData.device}] - ${reportData.description}`,
                severity: severityMap[reportData.severity] || INCIDENT_SEVERITY.LOW,
            });

            console.log('✅ Incidente creado en el backend:', createdIncident);

            // 🔥 ACTUALIZAR INMEDIATAMENTE el estado de PCs con novedades (sin recargar)
            if (reportData.ip) {
                setPcsWithIncidents(prev => {
                    const newSet = new Set(prev);
                    newSet.add(reportData.ip);
                    console.log(`[Incidents] PC ${reportData.ip} marcado con novedad inmediatamente`);
                    return newSet;
                });
            }

            // También guardar localmente para mostrar en la UI
            const newReport = {
                id: createdIncident.id || Math.random().toString(36).substr(2, 9),
                ...reportData,
                displayTimestamp: new Date(reportData.timestamp).toLocaleString('es-ES'),
                status: 'open',
                type: 'Reporte',
                sector: location.sector,
                ubicacion: location.ubicacion,
                posicion: location.posicion,
                pcId: reportData.pcId || reportData.device
            };
            setProblemReports(prev => [newReport, ...prev]);
            setShowReportModal(false);
            setSelectedPCForReport(null);
            setToast({ type: 'success', msg: `Problema reportado exitosamente en ${reportData.device}` });
        } catch (error) {
            console.error('❌ Error al crear incidente:', error);
            setToast({ type: 'error', msg: `Error al reportar problema: ${error.message}` });
        }
    };

    // Mapeo de salas a números para el backend
    const getSalaNumber = (salaName) => {
        const salaMap = {
            'sala1': 1,
            'sala2': 2,
            'sala3': 3,
            'sala4': 4,
            'salaAdicional': 5,
            'salaAdicional2': 6,
        };
        return salaMap[salaName] || 1;
    };

    // Obtener todos los PCs de una sala
    const getAllPCsFromSala = (salaKey) => {
        const salaData = salas[salaKey];
        if (!salaData) return [];

        const allPCs = [];
        const isSingleColumn = salaKey === 'sala1' || salaKey === 'salaAdicional' || salaKey === 'salaAdicional2';

        if (isSingleColumn) {
            salaData.layout.forEach(section => {
                if (section.pcs) {
                    section.pcs.forEach(pc => allPCs.push(pc));
                }
            });
        } else {
            salaData.layout.forEach(fila => {
                if (fila.izquierda) {
                    fila.izquierda.forEach(pc => allPCs.push(pc));
                }
                if (fila.derecha) {
                    fila.derecha.forEach(pc => allPCs.push(pc));
                }
            });
        }

        return allPCs;
    };

    // Verificar estado de todos los PCs usando el endpoint /computers
    const checkAllPCsStatus = async () => {
        setIsCheckingStatus(true);
        console.log('[Status Check] Obteniendo estado de computadores...');

        try {
            // Usar el nuevo endpoint GET /computers para estado en tiempo real
            const computers = await deviceService.getComputersStatus();

            // Mapear por IP para actualizar el estado visual
            const newOverrides = { ...deviceStatusOverrides };
            let online = 0, offline = 0;

            computers?.forEach(computer => {
                const ip = computer?.ipAddress || computer?.ip;
                const id = computer?.id;

                if (ip || id) {
                    const isOnline = computer.status?.toUpperCase() === 'ONLINE';
                    const statusData = {
                        status: isOnline ? 'online' : 'offline',
                        name: computer.name,
                        macAddress: computer.macAddress,
                        lastSeen: computer.lastSeen,
                        roomNumber: computer.roomNumber,
                        positionInRoom: computer.positionInRoom,
                        lastCheck: new Date()
                    };

                    if (ip) newOverrides[ip] = statusData;
                    if (id) newOverrides[`id_${id}`] = statusData;

                    if (isOnline) online++; else offline++;
                }
            });

            setDeviceStatusOverrides(newOverrides);
            setLastStatusCheck(new Date());

            console.log(`[Status Check] Completado: ${online} online, ${offline} offline de ${computers?.length || 0} totales`);

            // Mostrar toast con resultado
            setToast({
                type: online > 0 ? 'success' : 'warn',
                msg: `Estado actualizado: ${online} online, ${offline} offline`
            });
            setTimeout(() => setToast(null), 3000);

        } catch (error) {
            console.error('[Status Check] Error:', error);
            setToast({ type: 'error', msg: 'Error al obtener estado de computadores' });
            setTimeout(() => setToast(null), 3000);
        } finally {
            setIsCheckingStatus(false);
        }
    };

    // Función para cargar novedades pendientes y extraer IPs de PCs afectados
    const loadPendingIncidents = async () => {
        try {
            console.log('[Incidents] Cargando novedades pendientes...');
            const incidents = await incidentService.getAllIncidents();

            // Filtrar solo los pendientes (no completados)
            const pending = incidents.filter(inc => inc.status !== 'COMPLETED');

            // Extraer IPs de la descripción de cada incidente
            // Formato esperado: [Sala] [CpuCode] [IP: x.x.x.x] [PC: id] - descripción
            const ipsWithIncidents = new Set();

            pending.forEach(incident => {
                if (incident.description) {
                    // Buscar patrón [IP: x.x.x.x]
                    const ipMatch = incident.description.match(/\[IP:\s*([\d.]+)\]/);
                    if (ipMatch && ipMatch[1]) {
                        ipsWithIncidents.add(ipMatch[1]);
                        console.log(`[Incidents] PC con novedad: IP ${ipMatch[1]}`);
                    }
                }
            });

            setPcsWithIncidents(ipsWithIncidents);
            console.log(`[Incidents] Total PCs con novedades: ${ipsWithIncidents.size}`);

        } catch (error) {
            console.error('[Incidents] Error cargando novedades:', error);
        }
    };

    // Verificar estado al cargar y cuando cambia la sala
    useEffect(() => {
        // Verificar estado inicial
        checkAllPCsStatus();
        // Cargar novedades pendientes
        loadPendingIncidents();

        // Configurar verificación periódica cada 30 segundos
        const intervalId = setInterval(() => {
            checkAllPCsStatus();
            loadPendingIncidents(); // También refrescar novedades
        }, 30000);

        return () => clearInterval(intervalId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSala]);

    // 🔄 Sincronizar pcsWithIncidents cuando cambia problemReports (desde otras secciones)
    // Esto permite que cuando se marque un incidente como completado en NovedadesSection,
    // el color del PC se actualice automáticamente sin recargar la página
    useEffect(() => {
        if (problemReports && problemReports.length >= 0) {
            const pendingReports = problemReports.filter(r => r.status !== 'COMPLETED' && r.status !== 'closed');
            const ipsWithIncidents = new Set();

            pendingReports.forEach(report => {
                if (report.ip && report.ip !== 'N/A') {
                    ipsWithIncidents.add(report.ip);
                }
            });

            setPcsWithIncidents(ipsWithIncidents);
            console.log(`[Sync] PCs con novedades actualizadas desde problemReports: ${ipsWithIncidents.size}`);
        }
    }, [problemReports]);

    const handleAction = async (action, pcId, ip, dbId) => {
        // Si la acción es reportar problema, abre el modal
        if (action === 'report') {
            setSelectedPCForReport({ id: pcId, ip });
            setShowReportModal(true);
            setSelectedPC(null);
            return;
        }

        // Si la acción es instalar apps, abre el modal de despliegue
        if (action === 'install') {
            // Extraer número de sala del ID
            const salaMatch = pcId.match(/s(\d+)/i);
            const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);

            console.log('[handleAction install] Creating deploy target:', { id: pcId, ip, dbId, salaNumber });

            setDeployTargetPCs([{ id: pcId, ip, dbId, salaNumber }]);
            setShowDeployModal(true);
            setSelectedPC(null);
            return;
        }

        setActionLoading(`${pcId}-${action}`);

        // Extraer número de sala del ID
        const salaMatch = pcId.match(/s(\d+)/i);
        const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);

        // Usar dbId si está disponible, sino extraer del ID del PC
        let numericPcId;
        if (dbId) {
            numericPcId = dbId;
        } else {
            const pcMatch = pcId.match(/pc(\d+)/i);
            numericPcId = pcMatch ? parseInt(pcMatch[1]) : 1;
        }

        try {
            // Mapear acciones del frontend a acciones del backend
            const actionMap = {
                'power': COMMAND_ACTIONS.SHUTDOWN,
                'shutdown': COMMAND_ACTIONS.SHUTDOWN,
                'restart': COMMAND_ACTIONS.REBOOT,
                'reboot': COMMAND_ACTIONS.REBOOT,
                'wake': COMMAND_ACTIONS.WAKE_ON_LAN,
                'wol': COMMAND_ACTIONS.WAKE_ON_LAN,
                'start': COMMAND_ACTIONS.WAKE_ON_LAN,  // Encender PC
                'lock': COMMAND_ACTIONS.LOCK_SESSION,
                'format': 'FORMAT',
                'clean': 'FORMAT',
                'cleanup': 'FORMAT',
            };

            const backendAction = actionMap[action.toLowerCase()];

            if (!backendAction) {
                console.error(`[handleAction] Acción no reconocida: ${action}`);
                setToast({ type: "error", msg: `Acción no soportada: ${action}` });
                return;
            }

            console.log(`[handleAction] Enviando: salaNumber=${salaNumber}, pcId=${numericPcId}, action=${backendAction}, dbId=${dbId || 'no disponible'}`);

            // Usar endpoints específicos con query params según la acción
            if (backendAction === COMMAND_ACTIONS.WAKE_ON_LAN) {
                await commandService.sendWakeOnLan(salaNumber, numericPcId);
            } else if (backendAction === COMMAND_ACTIONS.SHUTDOWN) {
                await commandService.sendShutdown(salaNumber, numericPcId);
            } else if (backendAction === COMMAND_ACTIONS.REBOOT) {
                await commandService.sendReboot(salaNumber, numericPcId);
            } else if (backendAction === COMMAND_ACTIONS.LOCK_SESSION) {
                await commandService.sendLockSession(salaNumber, numericPcId);
            } else if (backendAction === 'FORMAT') {
                await commandService.sendFormat(salaNumber, numericPcId);
            } else {
                // Enviar comando con body JSON para otras acciones
                await commandService.sendCommand({
                    salaNumber,
                    pcId: numericPcId,
                    action: backendAction,
                });
            }

            setToast({ type: "success", msg: `Comando ${action} enviado a PC ${numericPcId}` });
        } catch (e) {
            console.error('Error al enviar comando:', e);
            setToast({ type: "error", msg: e.message || `Error enviando ${action} a ${pcId}` });
        } finally {
            setTimeout(() => setActionLoading(null), 600);
            setTimeout(() => setToast(null), 2500);
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedList.size === 0) return;

        // Función auxiliar para obtener los datos completos del PC desde el layout
        const findPCData = (pcItem) => {
            const pcId = typeof pcItem === 'string' ? pcItem : pcItem.id;
            const currentSalaData = salas[selectedSala];
            if (!currentSalaData) return null;

            for (const section of currentSalaData.layout) {
                // Para salas con estructura de filas (row)
                if (section.row && section.pcs) {
                    const found = section.pcs.find(pc => pc.id === pcId);
                    if (found) return found;
                }
                // Para salas con estructura de columnas (col)
                if (section.col && section.pcs) {
                    const found = section.pcs.find(pc => pc.id === pcId);
                    if (found) return found;
                }
                // Para salas con estructura izquierda/derecha
                if (section.izquierda) {
                    const found = section.izquierda.find(pc => pc.id === pcId);
                    if (found) return found;
                }
                if (section.derecha) {
                    const found = section.derecha.find(pc => pc.id === pcId);
                    if (found) return found;
                }
            }
            return null;
        };

        // Si la acción es instalar apps, abre el modal de despliegue con objetos completos
        if (action === 'install') {
            const items = Array.from(selectedList);
            const fullPCData = items.map(item => {
                // Si item ya es un objeto con datos completos
                if (typeof item === 'object' && item.dbId) {
                    return item;
                }

                // Buscar datos completos del PC
                const pcId = typeof item === 'string' ? item : item.id;
                const pcData = findPCData(pcId);

                // Extraer número de sala
                const salaMatch = pcId.match(/s(\d+)/i);
                const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);

                if (pcData && pcData.dbId) {
                    return {
                        id: pcId,
                        ip: pcData.ip || (typeof item === 'object' ? item.ip : ''),
                        dbId: pcData.dbId,
                        salaNumber
                    };
                }

                // Fallback: construir con lo que tengamos
                return {
                    id: pcId,
                    ip: typeof item === 'object' ? item.ip : '',
                    dbId: typeof item === 'object' ? item.dbId : null,
                    salaNumber
                };
            }).filter(pc => pc.dbId); // Filtrar los que no tienen dbId

            console.log('[handleBulkAction install] PCs completos:', fullPCData);

            if (fullPCData.length === 0) {
                setToast({ type: "error", msg: "No se encontraron datos de los PCs seleccionados" });
                return;
            }

            setDeployTargetPCs(fullPCData);
            setShowDeployModal(true);
            setShowBulkModal(false);
            return;
        }

        const items = Array.from(selectedList);
        setActionLoading(`bulk-${action}`);

        // Mapear acciones del frontend a acciones del backend
        const actionMap = {
            'power': COMMAND_ACTIONS.SHUTDOWN,
            'shutdown': COMMAND_ACTIONS.SHUTDOWN,
            'restart': COMMAND_ACTIONS.REBOOT,
            'reboot': COMMAND_ACTIONS.REBOOT,
            'wake': COMMAND_ACTIONS.WAKE_ON_LAN,
            'wol': COMMAND_ACTIONS.WAKE_ON_LAN,
            'start': COMMAND_ACTIONS.WAKE_ON_LAN,
            'lock': COMMAND_ACTIONS.LOCK_SESSION,
            'format': 'FORMAT',
            'clean': 'FORMAT',
            'cleanup': 'FORMAT',
        };
        const backendAction = actionMap[action.toLowerCase()];

        if (!backendAction) {
            console.error(`[handleBulkAction] Acción no reconocida: ${action}`);
            setToast({ type: "error", msg: `Acción no soportada: ${action}` });
            setActionLoading(null);
            return;
        }

        try {
            // Enviar comando a cada PC seleccionado usando los endpoints específicos
            const results = await Promise.allSettled(
                items.map(async ({ id, ip, dbId }) => {
                    // Buscar los datos completos del PC si no tenemos dbId
                    const pcData = !dbId ? findPCData(id) : null;

                    // Extraer número de sala del ID (s1 = sala 1, s2 = sala 2, etc.) o usar sala actual
                    const salaMatch = id.match(/s(\d+)/i);
                    const salaNumber = salaMatch ? parseInt(salaMatch[1]) : getSalaNumber(selectedSala);

                    // Usar dbId directo, del PC data, o extraer del ID
                    let numericPcId;
                    if (dbId) {
                        numericPcId = dbId;
                    } else if (pcData && pcData.dbId) {
                        numericPcId = pcData.dbId;
                    } else {
                        const pcMatch = id.match(/pc(\d+)/i);
                        numericPcId = pcMatch ? parseInt(pcMatch[1]) : 1;
                    }

                    console.log(`[handleBulkAction] Enviando ${backendAction} a: salaNumber=${salaNumber}, pcId=${numericPcId}, id=${id}, dbId=${dbId}`);

                    // Usar el endpoint específico según la acción
                    if (backendAction === COMMAND_ACTIONS.WAKE_ON_LAN) {
                        return commandService.sendWakeOnLan(salaNumber, numericPcId);
                    } else if (backendAction === COMMAND_ACTIONS.SHUTDOWN) {
                        return commandService.sendShutdown(salaNumber, numericPcId);
                    } else if (backendAction === COMMAND_ACTIONS.REBOOT) {
                        return commandService.sendReboot(salaNumber, numericPcId);
                    } else if (backendAction === COMMAND_ACTIONS.LOCK_SESSION) {
                        return commandService.sendLockSession(salaNumber, numericPcId);
                    } else if (backendAction === 'FORMAT') {
                        return commandService.sendFormat(salaNumber, numericPcId);
                    } else {
                        // Fallback a sendCommand para otras acciones
                        return commandService.sendCommand({
                            salaNumber,
                            pcId: numericPcId,
                            action: backendAction,
                        });
                    }
                })
            );

            const ok = results.filter(r => r.status === 'fulfilled').length;
            const fail = results.length - ok;

            // Log de errores para debugging
            results.forEach((r, i) => {
                if (r.status === 'rejected') {
                    console.error(`[handleBulkAction] Error en PC ${items[i].id}:`, r.reason);
                }
            });

            setToast({ type: fail ? "warn" : "success", msg: `Acción ${action}: ${ok} ok, ${fail} error(es)` });
        } catch (e) {
            console.error('[handleBulkAction] Error general:', e);
            setToast({ type: "error", msg: `Error ejecutando acción masiva ${action}` });
        } finally {
            setTimeout(() => setActionLoading(null), 600);
            setTimeout(() => setToast(null), 3000);
        }
    };

    const PCCard = ({ pc }) => {
        // Obtener estado real desde overrides (API) o estado base del layout
        const override = deviceStatusOverrides[pc.ip] || deviceStatusOverrides[`id_${pc.dbId || pc.id}`];
        const effectiveStatus = override?.status || 'offline';

        // Verificar si este PC tiene una novedad pendiente
        const hasIncident = pcsWithIncidents.has(pc.ip);

        // Filtrar según el estado seleccionado
        if (filter === "online" && effectiveStatus !== "online") return null;
        if (filter === "offline" && effectiveStatus === "online" && !hasIncident) return null;

        // Determinar color del indicador según estado
        // PRIORIDAD: Naranja si tiene novedad > Verde si online > Amarillo si no_internet > Rojo si offline
        const getStatusColor = () => {
            // Si tiene novedad pendiente, mostrar en NARANJA
            if (hasIncident) {
                return {
                    bg: "bg-orange-500",
                    border: "border-orange-500/30",
                    hover: "hover:border-orange-400 hover:bg-orange-500/15 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]",
                    dotColor: "bg-orange-500",
                    label: "CON NOVEDAD"
                };
            }
            // Ensure background opacity starts at 0 (handled by class assignment) or matches user style
            if (effectiveStatus === "online") return { bg: "bg-green-500/0", border: "border-green-500/20", hover: "hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]", dotColor: "bg-green-500" };
            if (effectiveStatus === "no_internet") return { bg: "bg-yellow-500/0", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]", dotColor: "bg-yellow-500" };
            return { bg: "bg-red-500/0", border: "border-red-500/20", hover: "hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]", dotColor: "bg-red-500" };
        };

        const statusStyle = getStatusColor();
        const isOnline = effectiveStatus === "online";
        const isSelected = Array.from(selectedList).some(s => s.id === pc.id);
        const pcScreenData = screens[pc.id]; // Datos de pantalla si existen

        return (
            <div className="flex flex-col items-center gap-2">
                <motion.div
                    layout
                    whileHover={{ scale: 1.05, y: -2 }}
                    onClick={(e) => {
                        if (e.shiftKey || e.ctrlKey || e.metaKey) {
                            // selección múltiple
                            const salaNum = getSalaNumber(selectedSala);
                            setSelectedList(prev => {
                                const next = new Set(prev);
                                const exists = Array.from(next).some(s => s.id === pc.id);
                                if (exists) {
                                    next.forEach(s => { if (s.id === pc.id) next.delete(s); });
                                } else {
                                    next.add({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum });
                                }
                                return next;
                            });
                        } else {
                            setSelectedPC({ ...pc, status: effectiveStatus });
                        }
                    }}
                    className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex-shrink-0 backdrop-blur-sm min-w-[120px] ${statusStyle.border} ${statusStyle.hover} ${pcScreenData ? 'shadow-[0_0_15px_rgba(168,85,247,0.25)] border-purple-500/40' : statusStyle.bg + '/5'
                        } ${isSelected ? "ring-2 ring-cyan-400/60" : ""}`}
                >
                    {/* Checkbox en esquina superior derecha */}
                    <div className="absolute top-2 right-2 z-20">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                const salaNum = getSalaNumber(selectedSala);
                                setSelectedList(prev => {
                                    const next = new Set(prev);
                                    const exists = Array.from(next).some(s => s.id === pc.id);
                                    if (exists) {
                                        next.forEach(s => { if (s.id === pc.id) next.delete(s); });
                                    } else {
                                        next.add({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum });
                                    }
                                    return next;
                                });
                            }}
                            className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${isSelected
                                ? 'bg-cyan-500/80 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                                : 'border-gray-500/30 hover:border-gray-400/60'
                                }`}
                        >
                            {isSelected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
                        </button>
                    </div>

                    {/* Header: Dot + Name */}
                    <div className="flex items-center gap-2 mb-1.5 mt-1">
                        <div className="relative flex-shrink-0">
                            <div className={`w-2.5 h-2.5 rounded-full ${statusStyle.dotColor} z-10 relative shadow-sm`} />
                            <div className={`absolute inset-0 w-2.5 h-2.5 rounded-full ${statusStyle.dotColor} ${effectiveStatus !== "offline" || hasIncident ? "animate-ping opacity-75" : "hidden"}`} />
                        </div>
                        <span className="text-sm font-bold text-white tracking-tight">{pc.id.split('-').pop().toUpperCase()}</span>
                        {hasIncident && (
                            <span className="text-[8px] font-bold text-orange-400 bg-orange-500/20 px-1.5 py-0.5 rounded-full border border-orange-500/30 animate-pulse ml-1">⚠️</span>
                        )}
                    </div>

                    {/* Body Info */}
                    <div className="flex flex-col items-start gap-0.5 pl-0.5">
                        {pc.cpuCode && (
                            <div className="text-[10px] font-mono text-gray-500">{pc.cpuCode}</div>
                        )}
                        <div className="text-[11px] text-cyan-200/90 font-mono tracking-tight">{pc.ip}</div>
                    </div>
                </motion.div>

                {/* Botón Ver Pantalla (MOVIDO FUERA DEL CARD) */}
                {isMonitoringActive && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            // Abrir modal SIEMPRE
                            setSelectedScreenPC({
                                ...pc,
                                initialScreenData: screens[pc.id] || screens[pc.ip] || Object.values(screens).find(s => s.ip === pc.ip)
                            });
                        }}
                        className={`flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[9px] font-bold transition-all border shadow-lg ${(screens[pc.id] || screens[pc.ip])
                            ? 'bg-purple-600 border-purple-400 text-white hover:bg-purple-500 hover:scale-110 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                            : 'bg-gray-800/90 border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-200'
                            }`}
                        title={`Ver Pantalla (${pc.id})`}
                    >
                        <Eye size={10} />
                        <span>VER</span>
                    </button>
                )}
            </div>
        );
    };

    // Función getLocationFromPC (Importada de utils)


    const currentRoom = salas[selectedSala] || salas.sala1;

    // Cargar estado de computadores desde API y poblar overrides por IP
    // Cargar estado de computadores desde API y poblar overrides por IP
    // Actualización de estado desactivada
    useEffect(() => {
        // checkAllPCsStatus();
        // const interval = setInterval(checkAllPCsStatus, 30000);
        // return () => clearInterval(interval);
        return () => { };
    }, []);

    // Conexión WebSocket para estado en vivo (sin indicador visual)
    // Conexión WebSocket para estado desactivada
    /*
    useEffect(() => {
        let mounted = true;
        const onMessage = (data) => {
            if (!mounted || !data) return;
            if (data.type === 'device_status' && (data.ip || data.id)) {
                setDeviceStatusOverrides(prev => ({
                    ...prev,
                    ...(data.ip ? { [data.ip]: { status: data.status, latencyMs: data.latencyMs } } : {}),
                    ...(data.id ? { [`id_${data.id}`]: { status: data.status, latencyMs: data.latencyMs } } : {})
                }));
            }
        };
        const connect = async () => {
            try {
                await WebSocketService.connect();
            } catch (e) {
                // noop
            }
        };
        WebSocketService.on('message', onMessage);
        connect();
        return () => {
            mounted = false;
            WebSocketService.off('message', onMessage);
            WebSocketService.disconnect();
        };
    }, []);
    */

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Toast Reutilizable */}
            <Toast toast={toast} onClose={() => setToast(null)} />

            {/* Header & Controls - ELEVATED Z-INDEX */}
            <div className="relative z-30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
                <div className="relative z-50">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 px-5 py-2.5 bg-gradient-to-r from-cyan-900/50 to-transparent border border-cyan-500/30 rounded-lg text-cyan-100 hover:border-cyan-400 transition-all min-w-[200px]"
                    >
                        <Monitor size={18} className="text-cyan-400" />
                        <span className="font-mono text-sm font-bold">{currentRoom.nombre}</span>
                        <ChevronDown size={16} className={`ml-auto transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                        {dropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full left-0 mt-2 w-full bg-black border border-cyan-500/50 rounded-lg shadow-2xl shadow-cyan-900/40 z-50 overflow-hidden"
                                >
                                    {Object.entries(salas).map(([key, sala]) => (
                                        <button
                                            key={key}
                                            onClick={() => { setSelectedSala(key); setDropdownOpen(false); }}
                                            className="w-full text-left px-4 py-3 text-sm font-mono text-gray-300 hover:bg-cyan-900/20 hover:text-cyan-400 transition-colors flex justify-between items-center border-b border-white/5 last:border-0"
                                        >
                                            {sala.nombre}
                                            {selectedSala === key && <CheckCircle2 size={16} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Quick Stats Bar */}
                <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-400 items-center">
                    <div className="flex items-center gap-2">
                        <Monitor size={14} className="text-cyan-500" />
                        <span>Total: <b className="text-white">{currentRoom.stats.total}</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Wifi size={14} className="text-green-500" />
                        <span>Online: <b className="text-green-400">{Object.values(deviceStatusOverrides).filter(s => s.status === 'online').length || '...'}</b></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <WifiOff size={14} className="text-red-500" />
                        <span>Offline: <b className="text-red-400">{Object.values(deviceStatusOverrides).filter(s => s.status === 'offline').length || '...'}</b></span>
                    </div>

                    {/* Indicador de verificación de estado */}
                    <div className="flex items-center gap-2 ml-auto">
                        {isCheckingStatus ? (
                            <div className="flex items-center gap-2 text-cyan-400">
                                <Activity size={14} className="animate-pulse" />
                                <span className="text-[10px]">Verificando...</span>
                            </div>
                        ) : (
                            <button
                                onClick={() => checkAllPCsStatus()}
                                className="flex items-center gap-1.5 text-gray-500 hover:text-cyan-400 transition-colors"
                                title="Actualizar estado de PCs"
                            >
                                <RotateCw size={12} />
                                <span className="text-[10px]">
                                    {lastStatusCheck ? `Actualizado ${lastStatusCheck.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}` : 'Actualizar'}
                                </span>
                            </button>
                        )}
                    </div>
                </div>

                {/* CONTROLES DE VIGILANCIA - NUEVO */}
                <div className="flex items-center gap-2 ml-4 border-l border-white/10 pl-4">
                    <div className="flex items-center gap-1.5 mr-2">
                        <div className={`w-2 h-2 rounded-full ${isScreenConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                        {isMonitoringActive && <span className="text-[10px] text-green-400 animate-pulse font-bold">VIGILANDO</span>}
                    </div>
                    {!isMonitoringActive ? (
                        <button
                            onClick={() => {
                                sendControl('START').then(res => setToast({ type: res.success ? 'success' : 'error', msg: res.message }));
                            }}
                            disabled={isMonitorLoading}
                            className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/30 rounded-md text-xs font-bold transition-all"
                        >
                            {isMonitorLoading ? <RotateCw size={12} className="animate-spin" /> : <Monitor size={12} />}
                            INICIAR CLASE
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                sendControl('STOP').then(res => setToast({ type: res.success ? 'success' : 'error', msg: res.message }));
                            }}
                            disabled={isMonitorLoading}
                            className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-md text-xs font-bold transition-all"
                        >
                            {isMonitorLoading ? <RotateCw size={12} className="animate-spin" /> : <Monitor size={12} />}
                            TERMINAR CLASE
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 bg-black/50 p-1 rounded-lg border border-white/10">
                    {[
                        { id: "all", label: "Todos", icon: Server },
                        { id: "online", label: "Online", icon: Wifi },
                        { id: "offline", label: "Offline", icon: WifiOff },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilter(f.id)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${filter === f.id ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            <f.icon size={12} /> {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Indicador de carga dispositivos */}
            <AnimatePresence>
                {loadingDevices && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2 text-xs font-mono text-gray-400">
                        <RotateCw size={14} className="animate-spin text-cyan-400" />
                        Cargando dispositivos...
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Barra de control rápido - siempre visible */}
            <div className="z-20 bg-black/40 border border-cyan-500/10 rounded-lg p-3 flex flex-wrap items-center gap-3 justify-between">
                <div className="flex items-center gap-3">
                    {/* Botón Seleccionar/Deseleccionar Todo */}
                    <button
                        onClick={() => {
                            const allPCs = [];
                            const isSingleColumn = selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2';
                            const salaNum = getSalaNumber(selectedSala);
                            if (isSingleColumn) {
                                currentRoom.layout.forEach(col => {
                                    if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                });
                            } else {
                                currentRoom.layout.forEach(fila => {
                                    if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                    if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                });
                            }
                            // Toggle: si todos están seleccionados, deselecciona; si no, selecciona todos
                            const allSelected = allPCs.length > 0 && selectedList.size === allPCs.length;
                            setSelectedList(allSelected ? new Set() : new Set(allPCs));
                        }}
                        className={`group px-4 py-2 text-xs font-medium rounded-lg border transition-all duration-300 flex items-center gap-2.5 ${selectedList.size > 0 && (selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2'
                            ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                            : currentRoom.layout.every(fila =>
                                (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                                (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                            ))
                            ? 'border-red-500/40 hover:border-red-400 text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            : 'border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                            }`}
                    >
                        {selectedList.size > 0 && (selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2'
                            ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                            : currentRoom.layout.every(fila =>
                                (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                                (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                            ))
                            ? '✕ Deseleccionar Todo'
                            : 'Seleccionar Todo'
                        }
                    </button>

                    {/* Botón Ejecutar en Todos */}
                    <button
                        onClick={() => {
                            const allPCs = [];
                            const isSingleColumn = selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2';
                            const salaNum = getSalaNumber(selectedSala);
                            if (isSingleColumn) {
                                currentRoom.layout.forEach(col => {
                                    if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                });
                            } else {
                                currentRoom.layout.forEach(fila => {
                                    if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                    if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip, dbId: pc.dbId, salaNumber: salaNum }));
                                });
                            }
                            setSelectedList(new Set(allPCs));
                            setTimeout(() => setShowBulkModal(true), 100);
                        }}
                        className="group px-4 py-2 text-xs font-medium rounded-lg border border-purple-500/40 hover:border-purple-400 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-all duration-300 flex items-center gap-2.5 hover:shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                    >
                        Ejecutar en TODOS
                    </button>
                </div>

                {/* Mostrar cantidad seleccionada */}
                {selectedList.size > 0 && (
                    <span className="text-xs font-mono text-gray-400 ml-auto">
                        Seleccionados: <b className="text-cyan-400">{selectedList.size}</b>
                    </span>
                )}
            </div>

            {/* Barra de acciones masivas - solo cuando hay selección */}
            <AnimatePresence>
                {selectedList.size > 0 && (
                    <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="z-20 bg-black/60 border border-cyan-500/20 rounded-lg p-3 flex flex-wrap items-center gap-3">
                        {/* Botón principal para abrir modal */}
                        <button
                            onClick={() => setShowBulkModal(true)}
                            className="px-4 py-1.5 text-xs font-bold rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                        >
                            <Terminal size={14} />
                            Panel de Acciones ({selectedList.size})
                        </button>

                        {/* Acciones rápidas inline */}
                        <div className="flex items-center gap-1">
                            {[
                                { id: 'power', label: 'Apagar', icon: Power, cls: 'hover:bg-red-500/20 hover:text-red-400' },
                                { id: 'start', label: 'Encender', icon: Zap, cls: 'hover:bg-green-500/20 hover:text-green-400' },
                                { id: 'restart', label: 'Reiniciar', icon: RotateCw, cls: 'hover:bg-blue-500/20 hover:text-blue-400' },
                            ].map(a => (
                                <button key={a.id} disabled={!!actionLoading} onClick={() => handleBulkAction(a.id)} title={a.label} className={`p-1.5 text-xs rounded border border-white/5 text-gray-400 flex items-center gap-1 ${a.cls}`}>
                                    {actionLoading === `bulk-${a.id}` ? <RotateCw size={12} className="animate-spin" /> : <a.icon size={12} />}
                                </button>
                            ))}
                        </div>

                        <button onClick={() => setSelectedList(new Set())} className="ml-auto text-xs text-gray-500 hover:text-gray-300">✕ Limpiar</button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Grid Canvas - LOWERED Z-INDEX */}
            <ScrollArea className="flex-1 rounded-2xl border border-white/5 bg-black/20 p-6 relative z-0 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 z-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }}
                />

                <div className="relative z-10">
                    {selectedSala === 'sala1' ? (
                        <div className="flex flex-col gap-8 lg:gap-12 w-full">
                            {/* VENTANA - Título superior */}
                            <div className="w-full text-center">
                                <div className="text-lg font-mono text-cyan-400 uppercase tracking-widest font-bold border-b-2 border-cyan-500/50 pb-3 inline-block px-8">
                                    VENTANA
                                </div>
                            </div>

                            {/* Contenedor principal - Lado Izquierdo y Derecho */}
                            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 w-full justify-center">
                                {/* LADO IZQUIERDO: 3 Pares de Filas de 4 PCs */}
                                <div className="flex flex-col gap-8 w-full lg:w-auto">
                                    {/* Filas 1-2 */}
                                    <div className="flex flex-col gap-3">
                                        {currentRoom.layout.slice(0, 2).map((row, idx) => (
                                            <div key={`row-pair1-${idx}`} className="flex items-center gap-4">
                                                <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                                                    COL {String.fromCharCode(70 - idx)}
                                                </div>
                                                <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                                                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                                                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Filas 3-4 */}
                                    <div className="flex flex-col gap-3">
                                        {currentRoom.layout.slice(2, 4).map((row, idx) => (
                                            <div key={`row-pair2-${idx}`} className="flex items-center gap-4">
                                                <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                                                    COL {String.fromCharCode(68 - idx)}
                                                </div>
                                                <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                                                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                                                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Filas 5-6 */}
                                    <div className="flex flex-col gap-3">
                                        {currentRoom.layout.slice(4, 6).map((row, idx) => (
                                            <div key={`row-pair3-${idx}`} className="flex items-center gap-4">
                                                <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider min-w-12 text-right">
                                                    COL {String.fromCharCode(66 - idx)}
                                                </div>
                                                <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors">
                                                    <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
                                                        {row.pcs && row.pcs.slice(0, 4).map(pc => <PCCard key={pc.id} pc={pc} />)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* LADO DERECHO: 2 Columnas de 6 PCs cada una */}
                                <div className="flex flex-col gap-8 w-full lg:w-auto justify-center lg:justify-center">
                                    <div className="flex gap-6 md:gap-8 justify-center">
                                        {currentRoom.layout.slice(6, 8).map((col, idx) => (
                                            <div key={`col-${idx}`} className="flex flex-col gap-2 md:gap-3">
                                                <div className="text-sm font-mono text-cyan-400 uppercase tracking-wider text-center">FILA {idx + 1}</div>
                                                <div className="p-3 md:p-4 rounded-lg bg-black/30 border border-white/10 hover:border-cyan-500/30 transition-colors flex flex-col gap-2 md:gap-3">
                                                    {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2') ? (
                        <div className="space-y-6 md:space-y-12 flex flex-col items-center w-full">
                            {/* 3 Pares de Columnas Verticales - Responsivas */}
                            <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 w-full flex-wrap md:flex-nowrap items-start">
                                {/* Grupo 1 */}
                                <div className="flex gap-1 w-full md:w-auto justify-center">
                                    {currentRoom.layout.slice(0, 2).map((col, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                                            <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(65 + idx)}</div>
                                            {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                        </div>
                                    ))}
                                </div>

                                {/* TABLERO*/}
                                {selectedSala === 'salaAdicional2' && (
                                    <div className="hidden lg:flex flex-col justify-center items-center gap-2">
                                        <div className="w-60 h-8 bg-gradient-to-br from-yellow-900/40 to-yellow-800/20 border-2 border-yellow-600/50 rounded-lg flex items-center justify-center">
                                            <div className="text-[10px] font-mono text-yellow-500 uppercase tracking-wider font-bold text-center">TABLERO</div>
                                        </div>
                                    </div>
                                )}

                                {/* Grupo 2 */}
                                <div className="flex gap-1 w-full md:w-auto justify-center">
                                    {currentRoom.layout.slice(2, 4).map((col, idx) => (
                                        <div key={idx + 2} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                                            <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(67 + idx)}</div>
                                            {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                        </div>
                                    ))}
                                </div>

                                {/* Grupo 3 + Título SALA 1 */}
                                <div className="flex gap-16 w-full md:w-auto justify-center items-start">
                                    <div className="flex gap-1">
                                        {currentRoom.layout.slice(4, 6).map((col, idx) => (
                                            <div key={idx + 4} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                                                <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(69 + idx)}</div>
                                                {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Línea del porte de la sala - Más grande y visible */}
                                    <div className="hidden lg:flex flex-col items-center gap-4 h-full">
                                        <div className="w-2 bg-gradient-to-b from-transparent via-red-500 to-transparent" style={{ height: '500px' }} />
                                    </div>

                                    {/* Título al lado de Columna F - Más grande y visible */}
                                    <div className="hidden lg:flex flex-col justify-center items-center">
                                        <div className="text-xl font-mono text-red-400 uppercase tracking-widest font-bold py-16 whitespace-nowrap">
                                            {selectedSala === 'salaAdicional' ? (
                                                <>SALA<br />1</>
                                            ) : (
                                                <>SALA<br />2</>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filas Horizontales - Responsivas */}
                            <div className="w-full flex flex-col gap-4 md:gap-8">
                                {currentRoom.layout.slice(6, 8).map((row, idx) => (
                                    <div key={idx + 6} className="flex justify-center">
                                        <div className="w-full max-w-2xl md:max-w-4xl p-3 md:p-5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
                                            {/* Grid Background */}
                                            <div className="absolute inset-0 z-0 opacity-10"
                                                style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '80px 80px' }}
                                            />
                                            <div className="relative z-10">
                                                <div className="text-[9px] md:text-xs text-cyan-500 font-mono mb-3 md:mb-4 border-b border-cyan-500/20 pb-2">FILA {idx + 1}</div>
                                                <div className="flex flex-wrap justify-center gap-2 md:gap-3">{row.pcs && row.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        // LÓGICA DE RENDERIZADO ESTÁNDAR PARA SALAS 2, 3 Y 4 - RESPONSIVA
                        <div className="space-y-6 md:space-y-8 w-full">
                            {/* TV - Adelante de la sala */}
                            <div className="w-full text-center">
                                <div className="text-lg font-mono text-cyan-400 uppercase tracking-widest font-bold border-b-2 border-cyan-500/50 pb-3 inline-block px-8">
                                    TV
                                </div>
                            </div>

                            {/* Filas de la sala */}
                            <div className="space-y-4 md:space-y-6">
                                {currentRoom.layout.map((fila, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-3 md:gap-6 p-3 md:p-4 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                                        {/* Fila Izquierda */}
                                        <div className="flex-1">
                                            <div className="text-[9px] md:text-[10px] text-cyan-500/70 font-mono mb-2 md:mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector A</div>
                                            <div className={`flex flex-wrap gap-2 md:gap-3 ${i === currentRoom.layout.length - 1 ? 'justify-center' : (fila.izquierda?.length <= 2 ? 'justify-start' : 'justify-center')}`}>
                                                {fila.izquierda.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                                {i === currentRoom.layout.length - 1 && fila.izquierda.length < 4 &&
                                                    Array.from({ length: 4 - fila.izquierda.length }).map((_, idxGhost) => (
                                                        <div key={`ghost-left-${i}-${idxGhost}`} className="min-w-[120px] opacity-0 pointer-events-none" />
                                                    ))
                                                }
                                            </div>
                                        </div>

                                        {/* Separador vertical decorativo */}
                                        <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

                                        {/* Fila Derecha */}
                                        <div className="flex-1">
                                            <div className="text-[9px] md:text-[10px] text-purple-500/70 font-mono mb-2 md:mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector B</div>
                                            <div className={`flex flex-wrap gap-2 md:gap-3 ${fila.derecha?.length <= 2 ? 'justify-start' : 'justify-center'}`}>
                                                {i >= 2 && fila.derecha?.length === 3 && (
                                                    <div className="min-w-[120px] opacity-0 pointer-events-none" />
                                                )}
                                                {fila.derecha.map(pc => <PCCard key={pc.id} pc={pc} />)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* SALIDA - Atrás de la sala */}
                            <div className="w-full text-center">
                                <div className="text-lg font-mono text-red-400 uppercase tracking-widest font-bold border-t-2 border-red-500/50 pt-3 inline-block px-8">
                                    SALIDA
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* PC Modal */}
            <AnimatePresence>
                {selectedPC && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                        onClick={() => setSelectedPC(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 border-b border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-white font-mono">{selectedPC.id}</h3>
                                    <p className="text-xs text-cyan-400 font-mono">{selectedPC.ip}</p>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${selectedPC.status === 'online' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {selectedPC.status?.toUpperCase?.()}
                                </div>
                            </div>

                            <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                                {[
                                    { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400', span: false },
                                    { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400', span: false },
                                    { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400', span: false },
                                    { id: 'lock', label: 'Bloquear Sesión', icon: Lock, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: false },
                                    { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                                    { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: false },
                                    { id: 'report', label: 'Reportar Problema', icon: AlertCircle, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: true },
                                ].map(action => (
                                    <button
                                        key={action.id}
                                        onClick={() => {
                                            if (action.id === 'report') {
                                                setSelectedPCForReport(selectedPC);
                                                setShowReportModal(true);
                                                setSelectedPC(null);
                                            } else {
                                                handleAction(action.id, selectedPC.id, selectedPC.ip, selectedPC.dbId);
                                            }
                                        }}
                                        disabled={actionLoading !== null}
                                        className={`p-2 md:p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-xs md:text-sm font-medium ${action.color} ${action.span ? 'col-span-2' : ''}`}
                                    >
                                        {actionLoading === `${selectedPC.id}-${action.id}` ? (
                                            <RotateCw className="animate-spin" size={16} />
                                        ) : (
                                            <action.icon size={16} />
                                        )}
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                                <button onClick={() => setSelectedPC(null)} className="text-xs text-gray-500 hover:text-white transition-colors">CANCELAR OPERACIÓN</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bulk Actions Modal */}
            <AnimatePresence>
                {showBulkModal && selectedList.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                        onClick={() => setShowBulkModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 border-b border-white/5">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-white font-mono">{selectedList.size} Computadores Seleccionados</h3>
                                        <p className="text-xs text-cyan-400 font-mono mt-1">Acciones masivas</p>
                                    </div>
                                    <button
                                        onClick={() => setShowBulkModal(false)}
                                        className="text-gray-500 hover:text-white transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Selected PCs List */}
                                <div className="mt-4 max-h-24 overflow-y-auto">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {Array.from(selectedList).map((pcItem) => {
                                            const status = deviceStatusOverrides[pcItem.ip]?.status || 'offline';
                                            return (
                                                <div key={pcItem.id} className="text-xs bg-black/40 p-2 rounded border border-white/10 flex justify-between items-center">
                                                    <div>
                                                        <div className="text-white font-mono">{pcItem.id}</div>
                                                        <div className="text-gray-500 text-[10px]">{pcItem.ip}</div>
                                                    </div>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Actions Grid */}
                            <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                                {[
                                    { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400', span: false },
                                    { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400', span: false },
                                    { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400', span: false },
                                    { id: 'lock', label: 'Bloquear Sesión', icon: Lock, color: 'hover:bg-orange-500/20 hover:text-orange-400', span: false },
                                    { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                                    { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: false },
                                ].map(action => (
                                    <button
                                        key={action.id}
                                        onClick={() => handleBulkAction(action.id)}
                                        disabled={actionLoading !== null}
                                        className={`p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium ${action.color} ${action.span ? 'col-span-2' : ''}`}
                                    >
                                        {actionLoading === `bulk-${action.id}` ? (
                                            <RotateCw className="animate-spin" size={16} />
                                        ) : (
                                            <action.icon size={16} />
                                        )}
                                        {action.label}
                                    </button>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                                <button onClick={() => setShowBulkModal(false)} className="text-xs text-gray-500 hover:text-white transition-colors">CANCELAR OPERACIÓN</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Report Problem Modal */}
            <ReportProblemModal
                isOpen={showReportModal}
                onClose={() => {
                    setShowReportModal(false);
                    setSelectedPCForReport(null);
                }}
                selectedPC={selectedPCForReport}
                selectedSala={selectedSala}
                onSubmit={handleReportSubmit}
            />

            {/* MODAL DE VIGILANCIA DE PANTALLA INDIVIDUAL */}
            {/* MODAL DE VIGILANCIA DE PANTALLA INDIVIDUAL */}
            <AnimatePresence>
                {selectedScreenPC && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
                        onClick={() => setSelectedScreenPC(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-full max-w-5xl rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl flex flex-col bg-gray-900"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedScreenPC(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/60 hover:bg-black/80 rounded-lg border border-white/10 text-gray-300 hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            {/* Logic to resolve live screen data */}
                            {(() => {
                                // Safe access to ID and IP
                                const currentId = selectedScreenPC.id || selectedScreenPC.pcId || 'UNKNOWN_ID';
                                const currentIp = selectedScreenPC.ip || 'UNKNOWN_IP';
                                const currentCpuCode = selectedScreenPC.cpuCode;

                                // 0. Override Manual (Forzado)
                                // 1. ID exacto
                                // 2. IP exacta
                                // 3. Coincidencia parcial de CPU Code (ej: "0655" en "P5M10-0655")
                                const liveData = (selectedScreenPC.forcedId ? screens[selectedScreenPC.forcedId] : null)
                                    || screens[currentId]
                                    || screens[currentIp]
                                    || (currentCpuCode ? Object.values(screens).find(s => s.originalId && s.originalId.includes(currentCpuCode)) : null)
                                    || selectedScreenPC.initialScreenData;

                                // DEBUG: Obtener IDs disponibles para mostrar al usuario si falla
                                const availableIds = Object.keys(screens);

                                return (
                                    <>
                                        {/* Image Area */}
                                        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
                                            {liveData?.image ? (
                                                <img
                                                    src={`data:image/jpeg;base64,${liveData.image}`}
                                                    alt={currentId}
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center text-gray-500 space-y-4 w-full">
                                                    <div className="relative">
                                                        <Loader size={48} className="animate-spin text-purple-500" />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <Eye size={16} className="text-purple-300 animate-pulse" />
                                                        </div>
                                                    </div>
                                                    <div className="text-center max-w-lg px-4">
                                                        <h3 className="text-lg font-bold text-gray-300 mb-2">Esperando señal de video...</h3>
                                                        <div className="text-sm text-gray-500 font-mono bg-black/40 p-4 rounded border border-white/5 text-left">
                                                            <p className="mb-2 border-b border-gray-700 pb-2">BUSCANDO SEÑAL PARA:</p>
                                                            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-4">
                                                                <span className="text-gray-600">ID Configuración:</span>
                                                                <span className="text-cyan-400">{currentId}</span>
                                                                <span className="text-gray-600">IP Esperada:</span>
                                                                <span className="text-orange-400">{currentIp}</span>
                                                                <span className="text-gray-600">Código CPU:</span>
                                                                <span className="text-purple-400">{currentCpuCode || 'N/A'}</span>
                                                            </div>

                                                            <div className="flex items-center justify-between mb-2 border-b border-gray-700 pb-2">
                                                                <p className="uppercase">SEÑALES ACTIVAS ({availableIds.length}):</p>
                                                                {availableIds.length > 0 && <span className="text-[10px] animate-pulse text-green-500">RECIBIENDO...</span>}
                                                            </div>

                                                            <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                                                {availableIds.length > 0 ? (
                                                                    <div className="space-y-2">
                                                                        <p className="text-[10px] text-gray-400 mb-2 italic">Si el PC está encendido pero no aparece, verifica que el agente esté conectado.</p>
                                                                        {availableIds.map(id => (
                                                                            <div key={id} className="flex items-center justify-between p-2 rounded bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 group transition-all">
                                                                                <div className="flex flex-col">
                                                                                    <span className="text-green-400 font-bold">{id}</span>
                                                                                    <span className="text-[10px] text-gray-500">{screens[id].ip || 'IP Privada/Oculta'}</span>
                                                                                </div>
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        // Forzar esta señal para este PC temporalmente
                                                                                        setSelectedScreenPC(prev => ({
                                                                                            ...prev,
                                                                                            forcedId: id
                                                                                        }));
                                                                                    }}
                                                                                    className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] hover:bg-purple-500 hover:text-white transition-all opacity-0 group-hover:opacity-100 uppercase font-bold"
                                                                                >
                                                                                    VINCULAR
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                ) : (
                                                                    <div className="py-4 text-center">
                                                                        <p className="text-red-400/60 italic mb-1">Sin señales entrantes.</p>
                                                                        <p className="text-[10px] text-gray-600">Asegúrate de haber iniciado el monitoreo.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Footer Info */}
                                        <div className="bg-black/80 border-t border-white/10 p-4 flex justify-between items-center z-20">
                                            <div>
                                                <h3 className="text-white font-bold font-mono text-lg flex items-center gap-2">
                                                    {liveData ? <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> : <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                                                    {currentId.toUpperCase()}
                                                </h3>
                                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                                    <span className="bg-white/10 px-1.5 py-0.5 rounded">{currentIp}</span>
                                                    {liveData && <span>Última actualización: {new Date(liveData.lastUpdate).toLocaleTimeString()}</span>}
                                                </p>
                                            </div>

                                            {liveData && (
                                                <div className="flex items-center gap-3">
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => downloadEvidence(currentId)}
                                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm transition-all"
                                                    >
                                                        <Download size={16} />
                                                        EVIDENCIA
                                                    </motion.button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                );
                            })()}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ComputerMonitoringSection;
