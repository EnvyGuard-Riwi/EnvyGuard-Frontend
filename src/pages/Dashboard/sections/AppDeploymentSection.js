import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Loader,
  Mail,
  BookOpen,
  Trash2,
  History
} from 'lucide-react';

import { ScrollArea } from '../components';

const AppDeploymentSection = ({ targetPCs = [], isModal = false }) => {
  const [deploymentCode, setDeploymentCode] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(targetPCs.length > 0 ? targetPCs[0].id : 'all');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [savedCommands, setSavedCommands] = useState([
    { label: 'Actualizar', cmd: 'apt-get update && apt-get upgrade -y' },
    { label: 'Docker', cmd: 'curl -fsSL https://get.docker.com | sh' },
    { label: 'Git', cmd: 'apt-get install -y git' },
    { label: 'Limpiar', cmd: 'apt-get clean && apt-get autoclean' },
  ]);
  const [deploymentHistory, setDeploymentHistory] = useState([
    { id: 1, date: '2025-12-01 14:32', device: 'server-01', command: 'apt-get update && apt-get install -y docker.io', status: 'success' },
    { id: 2, date: '2025-11-30 09:15', device: 'server-02', command: 'curl -fsSL https://get.docker.com | sh', status: 'success' },
    { id: 3, date: '2025-11-29 16:48', device: 'server-03', command: 'npm install -g @angular/cli', status: 'error' },
    { id: 4, date: '2025-11-28 11:22', device: 'all', command: 'apt-get install -y git', status: 'success' },
  ]);

  const devices = targetPCs.length > 0 
    ? [
        ...targetPCs.map(pc => ({ id: pc.id, name: pc.id, online: true })),
      ]
    : [
        { id: 'all', name: 'Todos los dispositivos', online: true },
        { id: 'server-01', name: 'server-01 (Ubuntu 22.04)', online: true },
        { id: 'server-02', name: 'server-02 (Ubuntu 20.04)', online: true },
        { id: 'server-03', name: 'server-03 (Ubuntu 22.04)', online: false },
        { id: 'workstation-01', name: 'workstation-01 (Ubuntu 22.04)', online: true },
      ];

  const handleExecuteDeploy = () => {
    if (!deploymentCode.trim()) {
      alert('Por favor ingresa un comando o script');
      return;
    }

    const commandExists = savedCommands.some(cmd => cmd.cmd === deploymentCode.trim());
    if (!commandExists) {
      const label = deploymentCode.substring(0, 20) + (deploymentCode.length > 20 ? '...' : '');
      setSavedCommands([...savedCommands, { label, cmd: deploymentCode.trim() }]);
    }

    setIsExecuting(true);
    setExecutionOutput('Conectando con el servidor...\n');
    setShowOutput(true);

    setTimeout(() => {
      const targetName = selectedDevice === 'all' 
        ? 'todos los dispositivos' 
        : devices.find(d => d.id === selectedDevice)?.name || selectedDevice;
      setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString()}] Ejecutando en ${targetName}...\n`);
    }, 500);

    setTimeout(() => {
      setExecutionOutput(prev => prev + `$ ${deploymentCode}\n`);
    }, 1000);

    setTimeout(() => {
      setExecutionOutput(prev => prev + `Procesando instalación...\n`);
    }, 1500);

    setTimeout(() => {
      setExecutionOutput(prev => prev + `✓ Instalación completada exitosamente\n`);
      setIsExecuting(false);
      
      const newEntry = {
        id: deploymentHistory.length + 1,
        date: new Date().toLocaleString('es-ES'),
        device: selectedDevice === 'all' ? 'all' : selectedDevice,
        command: deploymentCode,
        status: 'success'
      };
      setDeploymentHistory([newEntry, ...deploymentHistory]);
    }, 3000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentCode);
  };

  const removeCommand = (index) => {
    setSavedCommands(savedCommands.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col ${isModal ? 'h-full' : 'h-full'} ${isModal ? 'space-y-5 p-0' : 'space-y-6 p-0'}`}>
      <style>{`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.25rem;
          padding-right: 2.5rem;
          appearance: none;
        }
        select option {
          background: #0f0f0f;
          color: #ffffff;
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        select option:checked {
          background: #0d9488;
          color: #ffffff;
        }
      `}</style>
      {!isModal && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Terminal className="text-cyan-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Despliegue de Apps</h2>
                <p className="text-gray-500 text-xs font-sans">
                  {targetPCs.length > 0 
                    ? `Ejecutando en ${targetPCs.length === 1 ? '1 equipo' : targetPCs.length + ' equipos'}` 
                    : 'Ejecuta comandos y scripts directamente en tus servidores Linux.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 ${isModal ? 'flex flex-col gap-4 overflow-hidden' : 'grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden'}`}>
        
        {/* ESTRUCTURA VERTICAL PARA MODAL */}
        {isModal ? (
          <>
            {/* Dispositivo */}
            <div className={`bg-black/40 rounded-lg border border-white/5 p-3 space-y-1.5 flex-shrink-0`}>
              <label className={`font-bold text-gray-400 uppercase block text-xs`}>Dispositivo</label>
              <select 
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 outline-none transition-colors`}
              >
                {devices.map(device => (
                  <option key={device.id} value={device.id}>
                    {device.name} {device.online ? '● Online' : '● Offline'}
                  </option>
                ))}
              </select>
            </div>

            {/* Comando */}
            <div className={`flex flex-col gap-1.5 flex-1 min-h-0`}>
              <div className="flex justify-between items-center gap-2">
                <label className={`font-bold text-gray-400 uppercase text-xs`}>Comando</label>
                <button
                  onClick={copyToClipboard}
                  disabled={!deploymentCode}
                  className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <Mail size={10} />
                  Copiar
                </button>
              </div>
              <textarea
                value={deploymentCode}
                onChange={(e) => setDeploymentCode(e.target.value)}
                placeholder="apt-get update&#10;apt-get install -y docker.io"
                className={`flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono focus:border-cyan-500/50 outline-none placeholder-gray-700 resize-none text-xs`}
              />
            </div>

            {/* Botón Ejecutar */}
            <button
              onClick={handleExecuteDeploy}
              disabled={!deploymentCode.trim() || isExecuting}
              className={`w-full px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm flex-shrink-0 ${
                isExecuting
                  ? 'bg-yellow-600 text-black'
                  : deploymentCode.trim()
                  ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isExecuting ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Ejecutando...
                </>
              ) : (
                <>
                  <Play size={14} />
                  Ejecutar
                </>
              )}
            </button>

            {/* Comandos Rápidos y Salida lado a lado */}
            <div className={`grid grid-cols-2 gap-4 flex-shrink-0 min-h-[150px] max-h-[200px]`}>
              
              <div className={`bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5 overflow-hidden flex flex-col`}>
                <h3 className={`text-xs font-bold text-cyan-400 flex items-center gap-2 flex-shrink-0`}>
                  <BookOpen size={12} />
                  Comandos Rápidos
                </h3>
                <div className={`space-y-0.5 overflow-y-auto flex-1`} style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#1f1f1f transparent'
                }}>
                  <style>{`
                    .quick-commands-scroll::-webkit-scrollbar {
                      width: 6px;
                    }
                    .quick-commands-scroll::-webkit-scrollbar-track {
                      background: transparent;
                    }
                    .quick-commands-scroll::-webkit-scrollbar-thumb {
                      background: #1f1f1f;
                      border-radius: 3px;
                    }
                    .quick-commands-scroll::-webkit-scrollbar-thumb:hover {
                      background: #333333;
                    }
                  `}</style>
              {savedCommands.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 group flex-shrink-0">
                  <button
                    onClick={() => setDeploymentCode(item.cmd)}
                    className={`flex-1 text-left px-2 py-1 bg-black/40 hover:bg-black/60 border border-white/10 rounded text-xs text-gray-400 hover:text-cyan-300 transition-colors`}
                    title={item.cmd}
                  >
                    <span className={`block font-bold text-gray-200 text-xs truncate`}>{item.label}</span>
                  </button>
                  <button
                    onClick={() => removeCommand(idx)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded flex-shrink-0"
                    title="Eliminar comando"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

              <div className={`bg-black/40 flex flex-col min-h-0 rounded-lg border border-white/5 overflow-hidden`}>
                <h3 className={`text-xs font-bold text-green-400 p-3 pb-1.5`}>Salida</h3>
                <div className={`flex-1 bg-[#0a0a0a] border border-green-500/20 rounded-lg m-3 mt-1 p-3 font-mono text-[10px] text-green-400 overflow-y-auto border-dashed`}>
                  {executionOutput ? (
                    <pre className="whitespace-pre-wrap break-words">{executionOutput}</pre>
                  ) : (
                    <p className="text-gray-600">Salida aquí...</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ESTRUCTURA NO-MODAL (original) */}
            <div className={`lg:col-span-2 flex flex-col gap-3 h-full overflow-hidden`}>
              
              <div className={`bg-black/40 rounded-lg border border-white/5 p-3 space-y-1.5`}>
                <label className={`font-bold text-gray-400 uppercase block text-xs`}>Dispositivo</label>
                <select 
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 outline-none transition-colors`}
                >
                  {devices.map(device => (
                    <option key={device.id} value={device.id}>
                      {device.name} {device.online ? '● Online' : '● Offline'}
                    </option>
                  ))}
                </select>
              </div>

              <div className={`flex-1 flex flex-col gap-1.5 min-h-0`}>
                <div className="flex justify-between items-center gap-2">
                  <label className={`font-bold text-gray-400 uppercase text-xs`}>Comando</label>
                  <button
                    onClick={copyToClipboard}
                    disabled={!deploymentCode}
                    className="px-2 py-1 text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Mail size={10} />
                    Copiar
                  </button>
                </div>
                <textarea
                  value={deploymentCode}
                  onChange={(e) => setDeploymentCode(e.target.value)}
                  placeholder="apt-get update&#10;apt-get install -y docker.io"
                  className={`flex-1 px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono focus:border-cyan-500/50 outline-none placeholder-gray-700 resize-none min-h-0 text-xs`}
                />
              </div>

              <button
                onClick={handleExecuteDeploy}
                disabled={!deploymentCode.trim() || isExecuting}
                className={`w-full px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                  isExecuting
                    ? 'bg-yellow-600 text-black'
                    : deploymentCode.trim()
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isExecuting ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Ejecutar
                  </>
                )}
              </button>
            </div>

            <div className={`flex flex-col gap-3 h-full overflow-hidden lg:col-span-1`}>
              
              <div className={`bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5 flex-shrink-0 overflow-hidden flex flex-col`}>
                <h3 className={`text-xs font-bold text-cyan-400 flex items-center gap-2`}>
                  <BookOpen size={12} />
                  Comandos Rápidos
                </h3>
                <div className={`space-y-0.5 overflow-y-auto max-h-28`}>
                  {savedCommands.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <button
                        onClick={() => setDeploymentCode(item.cmd)}
                        className={`flex-1 text-left px-2 py-1 bg-black/40 hover:bg-black/60 border border-white/10 rounded text-xs text-gray-400 hover:text-cyan-300 transition-colors`}
                        title={item.cmd}
                      >
                        <span className={`block font-bold text-gray-200 text-xs truncate`}>{item.label}</span>
                      </button>
                      <button
                        onClick={() => removeCommand(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded"
                        title="Eliminar comando"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <h3 className={`text-xs font-bold text-green-400 mb-1.5`}>Salida</h3>
                <div className={`flex-1 bg-[#0a0a0a] border border-green-500/20 rounded-lg p-3 font-mono text-[10px] text-green-400 overflow-y-auto min-h-0 border-dashed`}>
                  {executionOutput ? (
                    <pre className="whitespace-pre-wrap break-words">{executionOutput}</pre>
                  ) : (
                    <p className="text-gray-600">Salida aquí...</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isModal && (
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History size={16} className="text-purple-400" />
            Historial de Despliegues
          </h3>
          <ScrollArea className="w-full rounded-lg border border-white/5 bg-[#0a0a0a] overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-white/5 text-[9px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
                <tr>
                  <th className="p-2 font-normal">Fecha</th>
                  <th className="p-2 font-normal">Dispositivo</th>
                  <th className="p-2 font-normal">Comando</th>
                  <th className="p-2 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deploymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-2 text-xs text-gray-400 font-mono">{item.date}</td>
                    <td className="p-2 text-xs text-gray-300 font-mono">{item.device === 'all' ? 'Todos' : item.device}</td>
                    <td className="p-2 text-xs text-gray-300 truncate max-w-xs" title={item.command}>{item.command}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-bold ${item.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.status === 'success' ? 'ÉXITO' : 'ERROR'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default AppDeploymentSection;
