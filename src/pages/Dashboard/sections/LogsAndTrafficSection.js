import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Monitor,
  CheckCircle,
  X,
  AlertCircle,
  MapPin,
  RefreshCw,
  Power,
  RotateCcw,
  Wifi,
  Lock,
  Ban,
  Eye,
  Server,
  Terminal,
  User,
  Clock
} from 'lucide-react';

import { ScrollArea } from '../components';
import commandService from '../../../services/CommandService';

// Constantes para estados de comandos
const COMMAND_STATUS = {
  ALL: 'all',
  PENDING: 'PENDING',
  SENT: 'SENT',
  EXECUTED: 'EXECUTED',
  FAILED: 'FAILED',
};

const LogsAndTrafficSection = ({ problemReports = [] }) => {
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState(COMMAND_STATUS.ALL);
  const [computerFilter, setComputerFilter] = useState('');
  const [availableComputers, setAvailableComputers] = useState([]);
  const [searchLog, setSearchLog] = useState('');
  const [isLoadingCommands, setIsLoadingCommands] = useState(false);
  const [commandLogs, setCommandLogs] = useState([]);
  const [selectedCommand, setSelectedCommand] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  // Cargar comandos desde la API (todos, por estado o por PC)
  const loadCommands = async (status = statusFilter, computer = computerFilter) => {
    setIsLoadingCommands(true);
    try {
      let commands;
      
      // Si hay filtro de PC, usar ese endpoint
      if (computer && computer !== '') {
        commands = await commandService.getCommandsByComputer(computer);
        // Si también hay filtro de estado, filtrar localmente
        if (status !== COMMAND_STATUS.ALL) {
          commands = commands.filter(cmd => cmd.status === status);
        }
      } else if (status === COMMAND_STATUS.ALL) {
        commands = await commandService.getAllCommands();
      } else {
        commands = await commandService.getCommandsByStatus(status);
      }
      
      const logs = commands.map(commandService.mapCommandToLog);
      setCommandLogs(logs);
      
      // Extraer lista de PCs únicos para el selector (solo la primera vez)
      if (availableComputers.length === 0 && logs.length > 0) {
        const computers = [...new Set(logs.map(log => log.device).filter(Boolean))];
        setAvailableComputers(computers.sort());
      }
    } catch (error) {
      console.error('Error al cargar comandos:', error);
    } finally {
      setIsLoadingCommands(false);
    }
  };

  // Cambiar filtro de estado y recargar comandos
  const handleStatusFilterChange = (newStatus) => {
    setStatusFilter(newStatus);
    setComputerFilter(''); // Limpiar filtro de PC al cambiar estado
    loadCommands(newStatus, '');
  };

  // Cambiar filtro de PC y recargar comandos
  const handleComputerFilterChange = (computer) => {
    setComputerFilter(computer);
    loadCommands(statusFilter, computer);
  };

  // Cargar detalles de un comando específico
  const loadCommandDetails = async (commandId) => {
    if (!commandId || typeof commandId === 'string' && commandId.startsWith('report-')) {
      return; // No cargar detalles para reportes
    }
    setIsLoadingDetails(true);
    try {
      const details = await commandService.getCommandById(commandId);
      setSelectedCommand(details);
    } catch (error) {
      console.error('Error al cargar detalles del comando:', error);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  // Cargar comandos al montar el componente
  useEffect(() => {
    loadCommands();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Iconos para cada tipo de acción
  const getActionIcon = (actionType) => {
    switch (actionType) {
      case 'SHUTDOWN': return <Power className="w-4 h-4 text-red-400" />;
      case 'REBOOT': return <RotateCcw className="w-4 h-4 text-orange-400" />;
      case 'WAKE_ON_LAN': return <Wifi className="w-4 h-4 text-green-400" />;
      case 'LOCK_SESSION': return <Lock className="w-4 h-4 text-yellow-400" />;
      case 'BLOCK_WEBSITE': return <Ban className="w-4 h-4 text-purple-400" />;
      default: return <Monitor className="w-4 h-4 text-cyan-400" />;
    }
  };

  const filteredLogs = (() => {
    // Combinar comandos de la API con reportes de problemas
    const combinedLogs = [
      ...commandLogs,
      ...problemReports.map(report => ({
        id: `report-${report.id}`,
        timestamp: report.displayTimestamp,
        device: report.device,
        action: `Problema reportado: ${report.description}`,
        type: 'Reporte',
        status: report.status === 'open' ? 'warning' : 'success'
      }))
    ];
    
    // Aplicar filtros
    return combinedLogs.filter(log => {
      const matchesSearch = (log.device?.toLowerCase() || '').includes(searchLog.toLowerCase()) || 
                           (log.action?.toLowerCase() || '').includes(searchLog.toLowerCase());
      const matchesType = filterType === 'all' || log.type === filterType;
      return matchesSearch && matchesType;
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  })();

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Terminal className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Logs de Comandos</h2>
              <p className="text-gray-500 text-sm font-sans">Historial de comandos ejecutados en los dispositivos.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logs Section */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex-1 flex flex-col">
          {/* Filters */}
          <div className="flex flex-col gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
            {/* Búsqueda y filtro de tipo */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-white/5 focus-within:border-blue-500/50 transition-colors">
                <Search size={14} className="text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Buscar dispositivo o acción..." 
                  className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-gray-600"
                  value={searchLog}
                  onChange={(e) => setSearchLog(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'Comando', label: 'Comandos' },
                  { id: 'Reporte', label: 'Reportes' },
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setFilterType(f.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      filterType === f.id ? 
                        "bg-blue-500/20 text-blue-300 border border-blue-500/30" : 
                        "text-gray-400 hover:text-gray-300 bg-white/5"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                
                {/* Botón refrescar */}
                <button
                  onClick={() => loadCommands()}
                  disabled={isLoadingCommands}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-gray-400 hover:text-gray-300 bg-white/5 hover:bg-white/10 flex items-center gap-2"
                >
                  <RefreshCw size={12} className={isLoadingCommands ? 'animate-spin' : ''} />
                  {isLoadingCommands ? 'Cargando...' : 'Actualizar'}
                </button>
              </div>
            </div>

            {/* Filtros por estado del comando */}
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 flex items-center mr-2">Estado:</span>
              {[
                { id: COMMAND_STATUS.ALL, label: 'Todos', color: 'gray' },
                { id: COMMAND_STATUS.PENDING, label: '⏳ Pendiente', color: 'yellow' },
                { id: COMMAND_STATUS.SENT, label: '📤 Enviado', color: 'blue' },
                { id: COMMAND_STATUS.EXECUTED, label: '✅ Ejecutado', color: 'green' },
                { id: COMMAND_STATUS.FAILED, label: '❌ Fallido', color: 'red' },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => handleStatusFilterChange(s.id)}
                  disabled={isLoadingCommands}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === s.id 
                      ? s.color === 'gray' ? 'bg-gray-500/20 text-gray-300 border border-gray-500/30' 
                        : s.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : s.color === 'blue' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : s.color === 'green' ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : 'text-gray-400 hover:text-gray-300 bg-white/5'
                  }`}
                >
                  {s.label}
                </button>
              ))}

              {/* Separador */}
              <div className="w-px h-6 bg-white/10 mx-2" />

              {/* Filtro por PC */}
              <span className="text-xs text-gray-500 flex items-center mr-2">PC:</span>
              <select
                value={computerFilter}
                onChange={(e) => handleComputerFilterChange(e.target.value)}
                disabled={isLoadingCommands}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-gray-300 border border-white/10 focus:border-cyan-500/50 outline-none transition-all cursor-pointer min-w-[120px]"
              >
                <option value="">Todos los PCs</option>
                {availableComputers.map(pc => (
                  <option key={pc} value={pc}>{pc}</option>
                ))}
              </select>

              {/* Limpiar filtros */}
              {(statusFilter !== COMMAND_STATUS.ALL || computerFilter !== '') && (
                <button
                  onClick={() => {
                    setStatusFilter(COMMAND_STATUS.ALL);
                    setComputerFilter('');
                    loadCommands(COMMAND_STATUS.ALL, '');
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 transition-all flex items-center gap-1"
                >
                  <X size={12} />
                  Limpiar
                </button>
              )}
            </div>
          </div>

          {/* Logs Table */}
          <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
                <tr>
                  <th className="p-4 font-normal">Timestamp</th>
                  <th className="p-4 font-normal">Dispositivo</th>
                  <th className="p-4 font-normal">Acción</th>
                  <th className="p-4 font-normal">Tipo</th>
                  <th className="p-4 font-normal">Usuario</th>
                  <th className="p-4 font-normal">Estado</th>
                  <th className="p-4 font-normal text-center">Detalles</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {isLoadingCommands ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Cargando comandos...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No se encontraron registros
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4 font-mono text-gray-400 text-xs">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString('es-CO') : '-'}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <Monitor size={12} className="text-gray-600" />
                            <span className="font-bold text-gray-200 font-mono">{log.device}</span>
                          </div>
                          {log.targetIp && (
                            <span className="text-[10px] text-gray-500 font-mono ml-5">
                              IP: {log.targetIp} {log.salaNumber && `• Sala ${log.salaNumber}`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {log.actionType && getActionIcon(log.actionType)}
                          <span className="text-gray-300">{log.action}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full font-mono font-bold ${
                          log.type === 'Comando' ? 'bg-cyan-500/10 text-cyan-400' :
                          log.type === 'Reporte' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {log.type}
                        </span>
                      </td>
                      <td className="p-4">
                        {log.userEmail ? (
                          <span className="text-xs text-gray-400 font-mono">{log.userEmail}</span>
                        ) : (
                          <span className="text-xs text-gray-600">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {log.status === 'success' && <CheckCircle size={14} className="text-green-400" />}
                          {log.status === 'error' && <X size={14} className="text-red-400" />}
                          {log.status === 'warning' && <AlertCircle size={14} className="text-yellow-400" />}
                          {log.status === 'info' && <Clock size={14} className="text-blue-400" />}
                          <span className={`text-xs font-bold ${
                            log.status === 'success' ? 'text-green-400' :
                            log.status === 'error' ? 'text-red-400' :
                            log.status === 'info' ? 'text-blue-400' :
                            'text-yellow-400'
                          }`}>
                            {log.statusLabel || (log.status === 'success' ? 'Ejecutado' : log.status === 'error' ? 'Fallido' : 'Pendiente')}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {log.type === 'Comando' && (
                          <button
                            onClick={() => loadCommandDetails(log.id)}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-400 transition-all"
                            title="Ver detalles"
                          >
                            <Eye size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </ScrollArea>
        </motion.div>

      {/* Modal de Detalles del Comando */}
      <AnimatePresence>
        {selectedCommand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCommand(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Terminal className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Detalles del Comando</h3>
                    <p className="text-xs text-gray-500">ID: {selectedCommand.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCommand(null)}
                  className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Content */}
              {isLoadingDetails ? (
                <div className="p-8 text-center">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
                  <p className="mt-2 text-gray-500">Cargando detalles...</p>
                </div>
              ) : (
                <div className="p-6 space-y-4">
                  {/* Dispositivo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Monitor size={14} />
                        <span className="text-xs uppercase">Dispositivo</span>
                      </div>
                      <p className="font-mono font-bold text-white">{selectedCommand.computerName}</p>
                      <p className="text-xs text-gray-500 mt-1">PC ID: {selectedCommand.pcId} • Sala {selectedCommand.salaNumber}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Server size={14} />
                        <span className="text-xs uppercase">Red</span>
                      </div>
                      <p className="font-mono font-bold text-white text-sm">{selectedCommand.targetIp}</p>
                      <p className="text-xs text-gray-500 mt-1 font-mono">{selectedCommand.macAddress}</p>
                    </div>
                  </div>

                  {/* Acción y Estado */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Power size={14} />
                        <span className="text-xs uppercase">Acción</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getActionIcon(selectedCommand.action)}
                        <span className="font-bold text-white">{selectedCommand.action}</span>
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <CheckCircle size={14} />
                        <span className="text-xs uppercase">Estado</span>
                      </div>
                      <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                        selectedCommand.status === 'EXECUTED' ? 'bg-green-500/20 text-green-400' :
                        selectedCommand.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                        selectedCommand.status === 'SENT' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {selectedCommand.status}
                      </span>
                    </div>
                  </div>

                  {/* Usuario y Tiempos */}
                  <div className="bg-white/5 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <User size={14} />
                      <span className="text-xs uppercase">Ejecutado por</span>
                    </div>
                    <p className="font-mono text-white">{selectedCommand.userEmail}</p>
                  </div>

                  <div className="bg-white/5 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-3">
                      <Clock size={14} />
                      <span className="text-xs uppercase">Tiempos</span>
                    </div>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Creado:</span>
                        <span className="font-mono text-gray-300">{selectedCommand.createdAt ? new Date(selectedCommand.createdAt).toLocaleString('es-CO') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Enviado:</span>
                        <span className="font-mono text-gray-300">{selectedCommand.sentAt ? new Date(selectedCommand.sentAt).toLocaleString('es-CO') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ejecutado:</span>
                        <span className="font-mono text-gray-300">{selectedCommand.executedAt ? new Date(selectedCommand.executedAt).toLocaleString('es-CO') : '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Resultado */}
                  {selectedCommand.resultMessage && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Terminal size={14} />
                        <span className="text-xs uppercase">Resultado</span>
                      </div>
                      <p className="font-mono text-sm text-gray-300">{selectedCommand.resultMessage}</p>
                    </div>
                  )}

                  {/* Parámetros */}
                  {selectedCommand.parameters && selectedCommand.parameters !== 'string' && (
                    <div className="bg-white/5 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-400 mb-2">
                        <Terminal size={14} />
                        <span className="text-xs uppercase">Parámetros</span>
                      </div>
                      <pre className="font-mono text-xs text-gray-300 bg-black/30 p-2 rounded overflow-x-auto">
                        {typeof selectedCommand.parameters === 'object' 
                          ? JSON.stringify(selectedCommand.parameters, null, 2) 
                          : selectedCommand.parameters}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LogsAndTrafficSection;
