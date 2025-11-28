import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, 
  MoreVertical, 
  ChevronRight, 
  Monitor, 
  FileText, 
  Settings, 
  LogOut, 
  Download,
  AlertTriangle,
  User,
  Shield,
  Activity,
  TrendingUp,
  CheckCircle2,
  Zap,
  UserPlus,
  Mail,
  Lock,
  Trash2,
  Edit2,
  Power,
  RotateCw,
  HardDrive,
  Package,
  History,
  Cpu,
  ChevronDown,
  Search,
  Filter,
  Terminal,
  Wifi,
  WifiOff,
  Server,
  Clock
} from "lucide-react";
import iconLogo from "../assets/icons/icon.png";

// --- UTILS & COMPONENTS ---

// Componente para el Scrollbar personalizado (CSS-in-JS simple)
const ScrollArea = ({ children, className = "" }) => (
  <div className={`overflow-y-auto pr-2 ${className} scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent hover:scrollbar-thumb-cyan-700`}>
    {children}
  </div>
);

// --- SIDEBAR ---

const SidebarContext = createContext(undefined);

const Sidebar = ({ children, open, setOpen }) => {
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.div
        className="relative flex h-full flex-col bg-[#0f0f0f] border-r border-gray-900 overflow-hidden w-[80px] z-50 shrink-0"
        animate={{ width: open ? 280 : 80 }}
        transition={{ duration: 0.3, type: "tween" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>
    </SidebarContext.Provider>
  );
};

const SidebarBody = (props) => (
  <div className="flex h-full w-full flex-1 flex-col justify-between overflow-hidden p-3" {...props} />
);

const SidebarLink = ({ link, className = "", isActive = false, onClick, ...props }) => {
  const { open } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      onClick={(e) => { e.preventDefault(); if (onClick) onClick(link.page); }}
      className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group cursor-pointer mb-1 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Fondo hover sutil */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 rounded-lg bg-gray-700/10" />
      )}

      {/* Indicador de línea para items activos */}
      {isActive && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 rounded-r-lg"
        />
      )}

      <div className={`relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center transition-colors duration-300 ${isActive ? 'text-blue-400' : 'text-gray-500 group-hover:text-gray-300'}`}>
        {link.icon}
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className={`relative z-10 whitespace-nowrap text-sm font-medium transition-colors font-sans ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`}
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

const SidebarLogo = () => {
  const { open } = useContext(SidebarContext);
  return (
    <div className="relative z-20 flex items-center gap-3 px-2 py-3 mb-4 border-b border-gray-900">
      <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg flex-shrink-0">
        <img src={iconLogo} alt="EnvyGuard" className="w-8 h-8 object-contain" />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.15 }}
            className="flex flex-col min-w-0"
          >
            <span className="font-bold text-sm tracking-wide font-mono text-gray-100">ENVYGUARD</span>
            <span className="text-[9px] text-gray-600 font-mono tracking-wider uppercase">SISTEMA DE SEGURIDAD</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserProfile = ({ user }) => {
  const { open } = useContext(SidebarContext);
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <>
      <div className="border-t border-gray-900 pt-4 pb-3 flex flex-col gap-2">
        {/* Profile Button */}
        <button 
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30 group w-full h-14"
        >
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 p-[1px] shrink-0 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors">
            {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-md" /> : <span className="font-bold text-sm text-cyan-400">{user?.name?.charAt(0)}</span>}
          </div>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.15 }} className="flex flex-col min-w-0 text-left flex-1">
                <span className="text-sm font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{user?.name}</span>
                <span className="text-[10px] text-gray-500 truncate font-mono group-hover:text-cyan-400/70 transition-colors">{user?.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {open && <Settings className="ml-auto text-gray-600 w-4 h-4 group-hover:text-cyan-400 group-hover:rotate-90 transition-all duration-500 shrink-0" />}
        </button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-lg border-2 border-gray-700 hover:border-red-500 bg-gray-900/20 hover:bg-red-900/20 text-gray-500 hover:text-red-400 transition-all group"
          onClick={() => console.log("Cerrando sesión...")}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence mode="wait">
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="text-sm font-medium text-center"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-gray-900/95 to-black/95 border border-cyan-500/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-800/50 bg-gradient-to-r from-cyan-900/20 to-transparent">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 blur-[60px]" />
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 border border-cyan-500/30 flex items-center justify-center">
                      {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover rounded-md" /> : <span className="font-bold text-lg text-cyan-400">{user?.name?.charAt(0)}</span>}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{user?.name}</h3>
                      <p className="text-xs text-cyan-400 font-mono uppercase tracking-wide">{user?.role}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-600 hover:text-gray-300 transition-colors p-1"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Email</label>
                    <p className="text-sm text-gray-300 mt-1 break-all">{user?.email || "correo@envyguard.com"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Estado</label>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="relative w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full bg-green-500 z-10" />
                        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
                      </div>
                      <span className="text-sm text-gray-300">Activo</span>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Departamento</label>
                    <p className="text-sm text-gray-300 mt-1">Administración del Sistema</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-mono text-gray-500 uppercase tracking-wider">Último Acceso</label>
                    <p className="text-sm text-gray-300 mt-1">27 de Noviembre, 2025 - 14:02 PM</p>
                  </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent" />

                {/* Modal Footer Button */}
                <button className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-all flex items-center justify-center gap-2 text-sm">
                  <Edit2 size={14} />
                  Editar Perfil
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// --- DASHBOARD SECTIONS ---

// 1. OVERVIEW SECTION (PANEL PRINCIPAL)
const OverviewSection = () => {
  const fadeInUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString('es-ES', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full p-6 rounded-2xl bg-gradient-to-r from-cyan-900/20 via-black to-black border border-cyan-500/20 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[80px]" />
        <div className="flex justify-between items-end relative z-10">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Bienvenido, Agente.</h2>
            <p className="text-cyan-400/80 font-mono text-sm flex items-center gap-2">
              <div className="relative w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-green-500 z-10" />
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
              </div>
              SISTEMA OPERATIVO Y SEGURO.
            </p>
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Agentes Activos", value: "12", icon: Shield, color: "text-cyan-400", bg: "from-cyan-500/10 to-transparent", border: "border-cyan-500/20" },
          { label: "Alertas Críticas", value: "03", icon: AlertTriangle, color: "text-red-400", bg: "from-red-500/10 to-transparent", border: "border-red-500/20" },
          { label: "Ancho de Banda", value: "1.2 GB/s", icon: Activity, color: "text-purple-400", bg: "from-purple-500/10 to-transparent", border: "border-purple-500/20" },
          { label: "Uptime Global", value: "99.9%", icon: Server, color: "text-green-400", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        
        {/* Logs Terminal */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 rounded-2xl border border-cyan-500/20 bg-black/60 backdrop-blur-md flex flex-col overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
            <h3 className="font-bold text-cyan-400 flex items-center gap-2 font-mono text-sm">
              <Terminal size={16} /> TERMINAL_LOGS
            </h3>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div className="p-4 font-mono text-xs space-y-3 overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-white/10">
            {[
              { time: "14:01:22", type: "WARN", msg: "Intento de acceso bloqueado [IP: 192.168.1.45]", color: "text-yellow-400" },
              { time: "14:00:15", type: "INFO", msg: "Sincronización de agentes completada", color: "text-blue-400" },
              { time: "13:58:44", type: "CRIT", msg: "Servicio 'Orquestador' reiniciado automáticamente", color: "text-red-400" },
              { time: "13:55:10", type: "INFO", msg: "Despliegue de parche v2.1 iniciado", color: "text-gray-400" },
              { time: "13:42:01", type: "INFO", msg: "Usuario 'Admin' inició sesión", color: "text-green-400" },
            ].map((log, i) => (
              <div key={i} className="flex gap-3 hover:bg-white/5 p-1 rounded transition-colors">
                <span className="text-gray-600">[{log.time}]</span>
                <span className={`font-bold ${log.color}`}>{log.type}:</span>
                <span className="text-gray-300">{log.msg}</span>
              </div>
            ))}
            <div className="animate-pulse text-cyan-500">_</div>
          </div>
        </motion.div>

        {/* System Health */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
          className="rounded-2xl border border-purple-500/20 bg-black/60 backdrop-blur-md p-6 flex flex-col"
        >
          <h3 className="font-bold text-purple-400 mb-6 flex items-center gap-2 font-sans">
            <Activity size={18} /> Salud del Sistema
          </h3>
          <div className="space-y-6 flex-1">
            {[
              { label: "CPU Core", value: 45, color: "from-purple-600 to-cyan-500" },
              { label: "Memoria RAM", value: 72, color: "from-pink-600 to-purple-500" },
              { label: "Almacenamiento", value: 28, color: "from-cyan-600 to-blue-500" },
            ].map((metric, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-mono mb-2 text-gray-400">
                  <span>{metric.label}</span>
                  <span className="text-white">{metric.value}%</span>
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
          <button className="mt-6 w-full py-2 border border-purple-500/30 text-purple-300 text-xs font-mono rounded hover:bg-purple-500/10 transition-colors">
            VER REPORTE COMPLETO
          </button>
        </motion.div>
      </div>
    </div>
  );
};

// 2. MONITORING SECTION (SALAS)
const ComputerMonitoringSection = () => {
  const [selectedPC, setSelectedPC] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedSala, setSelectedSala] = useState("sala1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  // Configuración de Salas - DATOS COMPLETOS
  const salas = {
    sala1: {
      nombre: "Sala 1",
      stats: { total: 36, online: 34, power: "4.2kW" },
      layout: [
        // Grupo 1: 2 columnas (COL-A, COL-B)
        { 
          col: 1, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col1-pc${i + 1}`, status: i === 3 ? "offline" : "online", ip: `192.168.3.${10 + i}` })),
          paired: true,
          pairedCol: 2
        },
        { 
          col: 2, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col2-pc${i + 1}`, status: "online", ip: `192.168.3.${20 + i}` }))
        },
        // Grupo 2: 2 columnas (COL-C, COL-D)
        { 
          col: 3, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col3-pc${i + 1}`, status: "online", ip: `192.168.3.${30 + i}` })),
          paired: true,
          pairedCol: 4
        },
        { 
          col: 4, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col4-pc${i + 1}`, status: "online", ip: `192.168.3.${40 + i}` }))
        },
        // Grupo 3: 2 columnas (COL-E, COL-F)
        { 
          col: 5, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col5-pc${i + 1}`, status: "online", ip: `192.168.3.${50 + i}` })),
          paired: true,
          pairedCol: 6
        },
        { 
          col: 6, 
          pcs: Array(4).fill(null).map((_, i) => ({ id: `s1-col6-pc${i + 1}`, status: "online", ip: `192.168.3.${60 + i}` }))
        },
        // Fila 1 (Horizontal) - 6 PCs
        { row: 1, pcs: Array(6).fill(null).map((_, i) => ({ id: `s1-row1-pc${i + 1}`, status: "online", ip: `192.168.3.${70 + i}` })) },
        // Fila 2 (Horizontal) - 6 PCs
        { row: 2, pcs: Array(6).fill(null).map((_, i) => ({ id: `s1-row2-pc${i + 1}`, status: "online", ip: `192.168.3.${80 + i}` })) }
      ]
    },
    sala2: {
      nombre: "Sala 2",
      stats: { total: 32, online: 32, power: "3.1kW" },
      layout: [
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s2-iz-pc${i + 1}`, status: "online", ip: `192.168.2.${30 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s2-der-pc${i + 1}`, status: "online", ip: `192.168.2.${40 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s2-iz2-pc${i + 1}`, status: "online", ip: `192.168.2.${50 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s2-der2-pc${i + 1}`, status: "online", ip: `192.168.2.${60 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s2-iz3-pc${i + 1}`, status: "online", ip: `192.168.2.${70 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s2-der3-pc${i + 1}`, status: "online", ip: `192.168.2.${80 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s2-iz4-pc${i + 1}`, status: "online", ip: `192.168.2.${90 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s2-der4-pc${i + 1}`, status: "online", ip: `192.168.2.${100 + i}` })) }
      ]
    },
    sala3: { 
      nombre: "Sala 3", 
      stats: { total: 20, online: 15, power: "1.8kW" }, 
      layout: [
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s3-iz-pc${i + 1}`, status: "online", ip: `192.168.1.${30 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s3-der-pc${i + 1}`, status: "online", ip: `192.168.1.${40 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s3-iz2-pc${i + 1}`, status: "online", ip: `192.168.1.${50 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s3-der2-pc${i + 1}`, status: "online", ip: `192.168.1.${60 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s3-iz3-pc${i + 1}`, status: "online", ip: `192.168.1.${70 + i}` })), derecha: Array(3).fill(null).map((_, i) => ({ id: `s3-der3-pc${i + 1}`, status: "online", ip: `192.168.1.${80 + i}` })) },
        { izquierda: Array(2).fill(null).map((_, i) => ({ id: `s3-iz4-pc${i + 1}`, status: "online", ip: `192.168.1.${90 + i}` })), derecha: Array(3).fill(null).map((_, i) => ({ id: `s3-der4-pc${i + 1}`, status: "online", ip: `192.168.1.${100 + i}` })) }
      ] 
    },
    sala4: { 
      nombre: "Sala 4", 
      stats: { total: 25, online: 24, power: "2.5kW" }, 
      layout: [
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s4-iz-pc${i + 1}`, status: "online", ip: `192.168.4.${30 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s4-der-pc${i + 1}`, status: "online", ip: `192.168.4.${40 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s4-iz2-pc${i + 1}`, status: "online", ip: `192.168.4.${50 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s4-der2-pc${i + 1}`, status: "online", ip: `192.168.4.${60 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s4-iz3-pc${i + 1}`, status: "online", ip: `192.168.4.${70 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s4-der3-pc${i + 1}`, status: "online", ip: `192.168.4.${80 + i}` })) },
        { izquierda: Array(4).fill(null).map((_, i) => ({ id: `s4-iz4-pc${i + 1}`, status: "online", ip: `192.168.4.${90 + i}` })), derecha: Array(4).fill(null).map((_, i) => ({ id: `s4-der4-pc${i + 1}`, status: "online", ip: `192.168.4.${100 + i}` })) }
      ] 
    }
  };

  const handleAction = async (action, pcId) => {
    setActionLoading(`${pcId}-${action}`);
    setTimeout(() => setActionLoading(null), 1000);
  };

  const PCCard = ({ pc }) => {
    if (filter === "online" && pc.status !== "online") return null;
    if (filter === "offline" && pc.status === "offline") return null;

    const isOnline = pc.status === "online";
    return (
      <motion.div
        layout
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={() => setSelectedPC(pc)}
        className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex-shrink-0 backdrop-blur-sm min-w-[120px] ${
          isOnline 
            ? "border-green-500/20 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
            : "border-red-500/20 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} z-10 relative`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-ping" : "bg-red-500"}`} />
          </div>
          <span className="text-xs font-mono text-gray-200 font-bold tracking-tight">{pc.id.split('-').pop().toUpperCase()}</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">{pc.ip}</div>
      </motion.div>
    );
  };

  const currentRoom = salas[selectedSala];

  return (
    <div className="space-y-6 h-full flex flex-col">
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
        <div className="flex gap-6 text-xs font-mono text-gray-400">
          <div className="flex items-center gap-2">
            <Monitor size={14} className="text-cyan-500" />
            <span>Total: <b className="text-white">{currentRoom.stats.total}</b></span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi size={14} className="text-green-500" />
            <span>Online: <b className="text-white">{currentRoom.stats.online}</b></span>
          </div>

        </div>

        {/* Filters */}
        <div className="flex bg-black/50 p-1 rounded-lg border border-white/10">
          {[
            { id: "all", label: "Todos", icon: Server },
            { id: "online", label: "Online", icon: Wifi },
            { id: "offline", label: "Offline", icon: WifiOff },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.id ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <f.icon size={12} /> {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Canvas - LOWERED Z-INDEX */}
      <ScrollArea className="flex-1 rounded-2xl border border-white/5 bg-black/20 p-6 relative z-0 overflow-hidden">
        {/* Grid Background */}
        <div className="absolute inset-0 z-0 opacity-20" 
            style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
        />
        
        <div className="relative z-10">
          {selectedSala === 'sala1' ? (
            <div className="space-y-12 flex flex-col items-center w-full">
              {/* 3 Pares de Columnas Verticales - Centradas */}
              <div className="flex justify-center gap-8 w-full">
                {/* Grupo 1 */}
                <div className="flex gap-1">
                  {currentRoom.layout.slice(0, 2).map((col, idx) => (
                    <div key={idx} className="flex flex-col gap-4 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-2">COL-{String.fromCharCode(65 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
                </div>
                
                {/* Grupo 2 */}
                <div className="flex gap-1">
                  {currentRoom.layout.slice(2, 4).map((col, idx) => (
                    <div key={idx + 2} className="flex flex-col gap-4 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-2">COL-{String.fromCharCode(67 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
                </div>
                
                {/* Grupo 3 */}
                <div className="flex gap-1">
                  {currentRoom.layout.slice(4, 6).map((col, idx) => (
                    <div key={idx + 4} className="flex flex-col gap-4 p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-2">COL-{String.fromCharCode(69 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Filas Horizontales */}
              <div className="w-full flex flex-col gap-8">
                {currentRoom.layout.slice(6, 8).map((row, idx) => (
                  <div key={idx + 6} className="flex justify-center">
                    <div className="w-full max-w-4xl p-5 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden">
                      {/* Grid Background */}
                      <div className="absolute inset-0 z-0 opacity-10" 
                            style={{ backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '80px 80px' }} 
                      />
                      <div className="relative z-10">
                        <div className="text-xs text-cyan-500 font-mono mb-4 border-b border-cyan-500/20 pb-2">FILA {idx + 1}</div>
                        <div className="flex flex-wrap justify-center gap-3">{row.pcs && row.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            // LÓGICA DE RENDERIZADO ESTÁNDAR PARA SALAS 2, 3 Y 4
            <div className="space-y-6">
                {currentRoom.layout.map((fila, i) => (
                  <div key={i} className="flex flex-col md:flex-row gap-6 p-4 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                    {/* Fila Izquierda */}
                    <div className="flex-1">
                        <div className="text-[10px] text-cyan-500/70 font-mono mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector A</div>
                        <div className="flex flex-wrap gap-3">
                          {fila.izquierda.map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                    
                    {/* Separador vertical decorativo */}
                    <div className="hidden md:block w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent" />

                    {/* Fila Derecha */}
                    <div className="flex-1">
                        <div className="text-[10px] text-purple-500/70 font-mono mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector B</div>
                        <div className="flex flex-wrap gap-3">
                          {fila.derecha.map(pc => <PCCard key={pc.id} pc={pc} />)}
                        </div>
                    </div>
                  </div>
                ))}
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
                  {selectedPC.status.toUpperCase()}
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-3">
                {[
                  { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400' },
                  { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400' },
                  { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                  { id: 'format', label: 'Formatear', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
                  { id: 'install', label: 'Instalar Apps', icon: Package, color: 'col-span-2 hover:bg-purple-500/20 hover:text-purple-400' },
                  { id: 'logs', label: 'Ver Logs', icon: FileText, color: 'col-span-2 hover:bg-gray-500/20 hover:text-gray-300' },
                ].map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id, selectedPC.id)}
                    disabled={actionLoading !== null}
                    className={`p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium ${action.color} ${action.id === 'install' || action.id === 'logs' ? 'col-span-2' : ''}`}
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
    </div>
  );
};

// 3. USERS SECTION
const CreateUsersSection = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@envyguard.com", role: "Admin", status: "Activo", createdAt: "2025-11-20" },
    { id: 2, name: "María García", email: "maria@envyguard.com", role: "Operador", status: "Activo", createdAt: "2025-11-18" },
    { id: 3, name: "Carlos López", email: "carlos@envyguard.com", role: "Visualizador", status: "Inactivo", createdAt: "2025-11-15" },
    { id: 4, name: "Ana Torres", email: "ana@envyguard.com", role: "Agente", status: "Activo", createdAt: "2025-11-22" },
  ]);
  const [showForm, setShowForm] = useState(false);
  
  // Filter logic
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 font-sans flex items-center gap-3">
            <UserPlus className="text-cyan-500" /> Gestión de Accesos
          </h2>
          <p className="text-gray-500 text-sm mt-1 font-mono">Control de credenciales y niveles de privilegio.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all flex items-center gap-2 text-sm"
        >
          {showForm ? <ChevronDown size={16} /> : <UserPlus size={16} />}
          {showForm ? "Cerrar Panel" : "Nuevo Usuario"}
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 bg-gradient-to-b from-cyan-900/10 to-transparent border border-cyan-500/20 rounded-xl mb-6">
              <h3 className="text-cyan-400 font-mono text-sm mb-4 flex items-center gap-2"><Lock size={14}/> NUEVA CREDENCIAL</h3>
              <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" placeholder="Nombre Completo" className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                <input type="email" placeholder="Correo Corporativo" className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 outline-none" />
                <select className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm text-gray-300 focus:border-cyan-500 outline-none">
                    <option>Rol: Operador</option>
                    <option>Rol: Admin</option>
                </select>
                <button className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg font-bold hover:bg-cyan-500/40 transition-colors">GUARDAR</button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-white/5 w-full md:w-96">
        <Search size={16} className="text-gray-500 ml-2" />
        <input 
          type="text" 
          placeholder="Buscar usuario por nombre o ID..." 
          className="bg-transparent border-none outline-none text-sm text-white w-full placeholder-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-black/20 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-xs uppercase font-mono text-gray-400 sticky top-0 backdrop-blur-md z-10">
            <tr>
              <th className="p-4 font-normal">Usuario</th>
              <th className="p-4 font-normal">Rol</th>
              <th className="p-4 font-normal">Estado</th>
              <th className="p-4 font-normal">Fecha Registro</th>
              <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-white">{user.name}</div>
                  <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                    user.role === 'Admin' ? 'border-red-500/30 text-red-400 bg-red-500/5' : 'border-blue-500/30 text-blue-400 bg-blue-500/5'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Activo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-500'}`} />
                    <span className="text-gray-300">{user.status}</span>
                  </div>
                </td>
                <td className="p-4 text-gray-500 font-mono text-xs">{user.createdAt}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-cyan-500/20 rounded text-cyan-400 transition-colors"><Edit2 size={14} /></button>
                    <button className="p-2 hover:bg-red-500/20 rounded text-red-400 transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollArea>
    </div>
  );
};

// 4. PLACEHOLDER SECTIONS
const PlaceholderSection = ({ title, icon: Icon, description }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-60">
    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
      <Icon size={40} className="text-cyan-500" />
    </div>
    <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
    <p className="text-gray-400 max-w-md font-mono text-sm">{description}</p>
    <button className="mt-6 px-6 py-2 border border-cyan-500/30 text-cyan-400 rounded hover:bg-cyan-500/10 transition-colors text-sm font-bold">
      INICIALIZAR MÓDULO
    </button>
  </div>
);


// --- MAIN LAYOUT LOGIC ---

const DashboardContent = ({ currentPage }) => {
  const containerClass = "flex flex-1 flex-col gap-6 rounded-tl-3xl border-l border-t border-white/10 bg-[#080808] p-4 md:p-8 backdrop-blur-xl overflow-hidden shadow-[-20px_-20px_50px_rgba(0,0,0,0.5)] relative z-10 h-full w-full";
  
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard': return <OverviewSection />;
      case 'computers': return <ComputerMonitoringSection />;
      case 'users': return <CreateUsersSection />;
      case 'agents': return <PlaceholderSection title="Gestión de Agentes" icon={Shield} description="Monitoreo de agentes instalados en puntos finales. Configure políticas de seguridad y despliegue remoto." />;
      case 'deploy': return <PlaceholderSection title="Despliegue de Apps" icon={Download} description="Repositorio de software y scripts para instalación masiva en la red local." />;
      case 'logs': return <PlaceholderSection title="Auditoría y Logs" icon={FileText} description="Registro inmutable de todas las acciones realizadas dentro del sistema EnvyGuard." />;
      case 'settings': return <PlaceholderSection title="Configuración del Sistema" icon={Settings} description="Ajustes globales, conexiones a bases de datos y preferencias de interfaz." />;
      default: return <OverviewSection />;
    }
  }

  return (
    <div className={containerClass}>
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentPage}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="h-full flex flex-col"
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  
  const currentUser = { name: "Juan Pérez", role: "Admin Principal", avatar: null };

  const links = [
    { label: "Panel Principal", href: "#dashboard", icon: <LayoutGrid />, page: "dashboard" },
    { label: "Agentes", href: "#agents", icon: <Shield />, page: "agents" },
    { label: "Monitoreo Remoto", href: "#computers", icon: <Monitor />, page: "computers" },
    { label: "Despliegue de Apps", href: "#deploy", icon: <Download />, page: "deploy" },
    { label: "Gestión de Usuarios", href: "#users", icon: <UserPlus />, page: "users" },
    { label: "Logs y Tráfico", href: "#logs", icon: <FileText />, page: "logs" },
    { label: "Configuración", href: "#settings", icon: <Settings />, page: "settings" },
  ];

  return (
    <div className="flex w-full h-screen bg-[#020202] overflow-hidden font-sans text-gray-200 selection:bg-cyan-500/30">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          <div className="flex flex-col w-full">
            <SidebarLogo />
            <nav className="flex flex-col gap-1 w-full px-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} link={link} 
                  isActive={currentPage === link.page} 
                  onClick={setCurrentPage}
                />
              ))}
            </nav>
          </div>
          <UserProfile user={currentUser} />
        </SidebarBody>
      </Sidebar>

      <DashboardContent currentPage={currentPage} />
    </div>
  );
}

export default DashboardLayout;