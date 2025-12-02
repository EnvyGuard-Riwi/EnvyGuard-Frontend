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
  X,
  CheckCircle,
  BookOpen,
  Clock,
  AlertCircle,
  Plus,
  BarChart3,
  TrendingDown,
  MapPin,
  Globe,
  Gauge,
  ArrowUp,
  ArrowDown,
  Disc3,
  Code2,
  Play,
  Pause,
  Loader,
  Copy
} from "lucide-react";
import iconLogo from "../assets/icons/icon.png";
import DeviceService from "../services/DeviceService";
import WebSocketService from "../services/WebSocketService";

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
        transition={{ duration: 0.2, type: "tween", ease: "easeOut" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>
    </SidebarContext.Provider>
  );
};

const SidebarBody = (props) => (
  <div className="flex h-full w-full flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden p-3" {...props} />
);

const SidebarLink = ({ link, className = "", isActive = false, onClick, ...props }) => {
  const { open } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      onClick={(e) => { e.preventDefault(); if (onClick) onClick(link.page); }}
      className={`relative flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all group cursor-pointer mb-1.5 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Fondo para items activos */}
      {isActive && (
        <div className="absolute inset-0 rounded-lg bg-cyan-500/15 border-l-2 border-cyan-500" />
      )}

      {/* Fondo hover sutil */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 rounded-lg bg-white/5" />
      )}

      {/* Indicador de línea para items activos */}
      {isActive && (
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-lg"
        />
      )}

      <div className={`relative z-10 flex-shrink-0 w-5 h-5 flex items-center justify-center transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-200'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          {link.icon}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`relative z-10 whitespace-nowrap text-sm font-medium transition-colors font-sans ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
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
    <div className="relative z-20 flex items-center justify-center lg:justify-start gap-3 px-2 py-4 mb-8 border-b border-gray-800 pb-4">
      <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded-lg flex-shrink-0 bg-cyan-500/10 border border-cyan-500/30">
        <img src={iconLogo} alt="EnvyGuard" className="w-8 h-8 object-contain" />
      </div>
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="flex flex-col min-w-0"
          >
            <span className="font-bold text-sm tracking-wide font-mono text-gray-50">ENVYGUARD</span>
            <span className="text-[8px] text-gray-500 font-mono tracking-wider uppercase">V1.0</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const UserProfile = ({ 
  user, 
  showProfileModal, 
  setShowProfileModal,
  showAvatarSelector,
  setShowAvatarSelector,
  avatarOptions,
  selectedAvatar,
  setSelectedAvatar,
  getAvatarUrl
}) => {
  const { open } = useContext(SidebarContext);
  const selectedAvatarData = avatarOptions.find(a => a.id === selectedAvatar);
  const currentAvatarUrl = selectedAvatar ? getAvatarUrl(selectedAvatarData) : null;

  return (
    <>
      <div className="border-t border-gray-900 pt-4 pb-3 flex flex-col gap-3">
        {/* Profile Button */}
        <button 
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30 group w-full"
        >
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 p-[1px] shrink-0 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors overflow-hidden">
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="font-bold text-sm text-cyan-400">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.1, ease: "easeOut" }} className="flex flex-col min-w-0 text-left flex-1">
                <span className="text-sm font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{user?.name}</span>
                <span className="text-[10px] text-gray-500 truncate font-mono group-hover:text-cyan-400/70 transition-colors">{user?.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {open && <Settings className="ml-auto text-gray-600 w-4 h-4 group-hover:text-cyan-400 transition-all duration-300 shrink-0" />}
        </button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm text-gray-500 hover:text-red-400 transition-all group"
          onClick={() => console.log("Cerrando sesión...")}
        >
          <LogOut size={16} className="shrink-0" />
          <AnimatePresence mode="wait">
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="text-sm font-medium text-center"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Profile Modal Global */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowProfileModal(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-b from-gray-900/95 to-black/95 border border-cyan-500/30 rounded-2xl shadow-2xl shadow-cyan-500/10 w-full max-w-lg overflow-hidden"
            >
              {/* Header con gradiente */}
              <div className="relative p-4 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-900/20 via-transparent to-blue-900/20 overflow-hidden">
                {/* Glow background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar con lápiz */}
                    <div className="relative group flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-600/30 border-2 border-cyan-500/50 flex items-center justify-center shadow-lg shadow-cyan-500/20 transition-all duration-300 overflow-hidden">
                        {currentAvatarUrl ? (
                          <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-xl text-cyan-400">{user?.name?.charAt(0)}</span>
                        )}
                      </div>
                      {/* Botón de lápiz flotante */}
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="absolute -bottom-1 -right-1 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full p-1.5 shadow-lg shadow-cyan-500/50 border border-cyan-300/50 hover:shadow-cyan-500/70 transition-all"
                      >
                        <Settings className="w-3 h-3 text-white" />
                      </motion.button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h2 className="text-lg font-bold text-white truncate">{user?.name}</h2>
                      <span className="text-cyan-400 font-mono text-xs uppercase tracking-widest font-bold">{user?.role}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Selector de Avatares - Aparece cuando se hace click en el lápiz */}
                <AnimatePresence>
                  {showAvatarSelector && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-500/10 border border-cyan-500/20"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-1.5 w-10 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full" />
                        <p className="text-sm font-bold text-cyan-300 uppercase tracking-widest">Personalizá tu Avatar</p>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        {avatarOptions.map((avatar, idx) => (
                          <motion.button
                            key={avatar.id}
                            initial={{ opacity: 0, scale: 0.6, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ delay: idx * 0.08, duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
                            whileHover={{ scale: 1.12, y: -4 }}
                            whileTap={{ scale: 0.90 }}
                            onClick={() => {
                              setSelectedAvatar(avatar.id);
                              setShowAvatarSelector(false);
                            }}
                            className={`relative group overflow-hidden rounded-2xl transition-all duration-300 border-3 flex items-center justify-center cursor-pointer w-full aspect-square ${
                              selectedAvatar === avatar.id
                                ? `border-white shadow-2xl shadow-cyan-500/70 bg-gradient-to-br from-cyan-500/20 to-blue-600/20`
                                : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-cyan-500/70 hover:shadow-xl hover:shadow-cyan-500/40"
                            }`}
                            title={avatar.label}
                          >
                            {/* Fondo brillante */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300 rounded-2xl" />
                            
                            <div className="relative z-10 flex items-center justify-center w-full h-full">
                              <img 
                                src={getAvatarUrl(avatar)} 
                                alt={avatar.label}
                                className="w-full h-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>

                            {/* Checkmark para seleccionado con animación */}
                            {selectedAvatar === avatar.id && (
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg z-20"
                              >
                                <svg className="w-4 h-4 text-cyan-600 font-bold" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </motion.div>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Información Principal */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Correo</p>
                    <p className="text-sm text-gray-200 font-mono break-all">{user?.email || "admin@envyguard.com"}</p>
                  </div>
                  <div className="col-span-2 sm:col-span-1 p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                    <div className="flex items-center gap-2">
                      <div className="relative w-2.5 h-2.5">
                        <span className="absolute inset-0 rounded-full bg-green-500 z-10" />
                        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping" />
                      </div>
                      <span className="text-sm text-green-400 font-mono">Activo en línea</span>
                    </div>
                  </div>
                </motion.div>

                {/* Detalles */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 p-4 rounded-lg bg-gradient-to-r from-cyan-500/5 to-blue-500/5 border border-cyan-500/10"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Departamento</span>
                    <span className="text-sm text-gray-300 font-semibold">TI & Seguridad</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Último acceso</span>
                    <span className="text-sm text-gray-300">Hace 5 minutos</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Nivel de acceso</span>
                    <span className="inline-block px-2 py-1 text-[10px] font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 rounded">ADMINISTRADOR</span>
                  </div>
                </motion.div>

                {/* Action Button */}
                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 hover:border-cyan-500/50 text-cyan-300 hover:text-cyan-100 font-semibold transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={16} />
                    Editar Perfil
                  </motion.button>
                </div>
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
          {/* ... */}

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
  const [selectedList, setSelectedList] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployTargetPCs, setDeployTargetPCs] = useState([]);
  const [toast, setToast] = useState(null);
  const [loadingDevices, setLoadingDevices] = useState(false);
  const [deviceStatusOverrides, setDeviceStatusOverrides] = useState({}); // ip -> {status, meta}

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

  const handleAction = async (action, pcId, ip) => {
    // Si la acción es instalar apps, abre el modal de despliegue
    if (action === 'install') {
      setDeployTargetPCs([{ id: pcId, ip }]);
      setShowDeployModal(true);
      setSelectedPC(null);
      return;
    }

    setActionLoading(`${pcId}-${action}`);
    try {
      await DeviceService.sendCommand(pcId, action, ip ? { ip } : {});
      setToast({ type: "success", msg: `Comando ${action} enviado a ${pcId}` });
    } catch (e) {
      setToast({ type: "error", msg: `Error enviando ${action} a ${pcId}` });
    } finally {
      setTimeout(() => setActionLoading(null), 600);
      setTimeout(() => setToast(null), 2500);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedList.size === 0) return;
    
    // Si la acción es instalar apps, abre el modal de despliegue
    if (action === 'install') {
      setDeployTargetPCs(Array.from(selectedList));
      setShowDeployModal(true);
      setShowBulkModal(false);
      return;
    }

    const items = Array.from(selectedList);
    setActionLoading(`bulk-${action}`);
    try {
      const results = await Promise.allSettled(
        items.map(({ id, ip }) => DeviceService.sendCommand(id, action, ip ? { ip } : {}))
      );
      const ok = results.filter(r => r.status === 'fulfilled').length;
      const fail = results.length - ok;
      setToast({ type: fail ? "warn" : "success", msg: `Acción ${action}: ${ok} ok, ${fail} error(es)` });
    } catch (e) {
      setToast({ type: "error", msg: `Error ejecutando acción masiva ${action}` });
    } finally {
      setTimeout(() => setActionLoading(null), 600);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const PCCard = ({ pc }) => {
    // Resuelve estado efectivo con overrides (WebSocket/API) por IP si existe
    const override = deviceStatusOverrides[pc.ip];
    const effectiveStatus = override?.status || pc.status;
    if (filter === "online" && effectiveStatus !== "online") return null;
  if (filter === "offline" && effectiveStatus === "offline") return null;

    const isOnline = effectiveStatus === "online";
    const isSelected = Array.from(selectedList).some(s => s.id === pc.id);
    return (
      <motion.div
        layout
        whileHover={{ scale: 1.05, y: -2 }}
        onClick={(e) => {
          if (e.shiftKey || e.ctrlKey || e.metaKey) {
            // selección múltiple
            setSelectedList(prev => {
              const next = new Set(prev);
              const exists = Array.from(next).some(s => s.id === pc.id);
              if (exists) {
                next.forEach(s => { if (s.id === pc.id) next.delete(s); });
              } else {
                next.add({ id: pc.id, ip: pc.ip });
              }
              return next;
            });
          } else {
            setSelectedPC({ ...pc, status: effectiveStatus });
          }
        }}
        className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex-shrink-0 backdrop-blur-sm min-w-[120px] ${
          isOnline 
            ? "border-green-500/20 bg-green-500/5 hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]" 
            : "border-red-500/20 bg-red-500/5 hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        } ${isSelected ? "ring-2 ring-cyan-400/60" : ""}`}
      >
        {/* Checkbox en esquina superior derecha */}
        <div className="absolute top-2 right-2 z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedList(prev => {
                const next = new Set(prev);
                const exists = Array.from(next).some(s => s.id === pc.id);
                if (exists) {
                  next.forEach(s => { if (s.id === pc.id) next.delete(s); });
                } else {
                  next.add({ id: pc.id, ip: pc.ip });
                }
                return next;
              });
            }}
            className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
              isSelected 
                ? 'bg-cyan-500/80 border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                : 'border-gray-400/40 hover:border-cyan-400/60'
            }`}
          >
            {isSelected && <div className="w-2 h-2 bg-white rounded-[2px]" />}
          </button>
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="relative">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"} z-10 relative`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${isOnline ? "bg-green-500 animate-ping" : "bg-red-500"}`} />
          </div>
          <span className="text-xs font-mono text-gray-200 font-bold tracking-tight">{pc.id.split('-').pop().toUpperCase()}</span>
        </div>
        <div className="text-[10px] text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">{pc.ip}</div>
        {override?.latencyMs !== undefined && (
          <div className="mt-1 text-[10px] font-mono text-gray-600">{override.latencyMs} ms</div>
        )}
      </motion.div>
    );
  };

  const currentRoom = salas[selectedSala];

  // Cargar dispositivos desde API y poblar overrides por IP
  useEffect(() => {
    let cancelled = false;
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const data = await DeviceService.getDevices();
        if (cancelled) return;
        // Esperamos array de dispositivos: { id, ip, status, latencyMs? }
        const map = {};
        data?.forEach(d => {
          if (d?.ip) map[d.ip] = { status: d.status || 'online', latencyMs: d.latencyMs };
        });
        setDeviceStatusOverrides(prev => ({ ...prev, ...map }));
      } catch (e) {
        // Silencioso: permanecer con datos mock
      } finally {
        if (!cancelled) setLoadingDevices(false);
      }
    };
    fetchDevices();
    const id = setInterval(fetchDevices, 30000);
    return () => { cancelled = true; clearInterval(id); };
  }, []);

  // Conexión WebSocket para estado en vivo (sin indicador visual)
  useEffect(() => {
    let mounted = true;
    const onMessage = (data) => {
      if (!mounted || !data) return;
      if (data.type === 'device_status' && (data.ip || data.id)) {
        setDeviceStatusOverrides(prev => ({
          ...prev,
          ...(data.ip ? { [data.ip]: { status: data.status, latencyMs: data.latencyMs } } : {})
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

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Toast liviano */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className={`self-center px-4 py-2 rounded-md text-sm font-mono border ${toast.type === 'success' ? 'text-green-300 border-green-500/30 bg-green-500/10' : toast.type === 'warn' ? 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10' : 'text-red-300 border-red-500/30 bg-red-500/10'}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
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
            <span>Online: <b className="text-white">{currentRoom.stats.online}</b></span>
          </div>
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
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f.id ? "bg-cyan-500/20 text-cyan-400 shadow-sm" : "text-gray-500 hover:text-gray-300"
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
              if (selectedSala === 'sala1') {
                currentRoom.layout.forEach(col => {
                  if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                });
              } else {
                currentRoom.layout.forEach(fila => {
                  if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                  if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                });
              }
              // Toggle: si todos están seleccionados, deselecciona; si no, selecciona todos
              const allSelected = allPCs.length > 0 && selectedList.size === allPCs.length;
              setSelectedList(allSelected ? new Set() : new Set(allPCs));
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-2 ${
              selectedList.size > 0 && (selectedSala === 'sala1' 
                ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                : currentRoom.layout.every(fila => 
                    (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                    (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                  ))
                ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
            }`}
          >
            {selectedList.size > 0 && (selectedSala === 'sala1' 
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
              if (selectedSala === 'sala1') {
                currentRoom.layout.forEach(col => {
                  if (col.pcs) col.pcs.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                });
              } else {
                currentRoom.layout.forEach(fila => {
                  if (fila.izquierda) fila.izquierda.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                  if (fila.derecha) fila.derecha.forEach(pc => allPCs.push({ id: pc.id, ip: pc.ip }));
                });
              }
              setSelectedList(new Set(allPCs));
              setTimeout(() => setShowBulkModal(true), 100);
            }}
            className="px-3 py-1.5 text-xs font-bold rounded-lg border border-purple-500/40 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-all flex items-center gap-2"
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
                  {actionLoading === `bulk-${a.id}` ? <RotateCw size={12} className="animate-spin"/> : <a.icon size={12}/>}
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
                        <div className={`flex flex-wrap gap-3 ${i === currentRoom.layout.length - 1 ? 'justify-center' : (fila.izquierda?.length <= 2 ? 'justify-start' : 'justify-center')}`}>
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
                        <div className="text-[10px] text-purple-500/70 font-mono mb-3 uppercase tracking-wider border-b border-white/5 pb-1">Fila {i + 1} - Sector B</div>
                        <div className={`flex flex-wrap gap-3 ${fila.derecha?.length <= 2 ? 'justify-start' : 'justify-center'}`}>
                          {i >= 2 && fila.derecha?.length === 3 && (
                            <div className="min-w-[120px] opacity-0 pointer-events-none" />
                          )}
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
                  {selectedPC.status?.toUpperCase?.()}
                </div>
              </div>
              
              <div className="p-6 grid grid-cols-2 gap-3">
                {[
                  { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400' },
                  { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400' },
                  { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                  { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
                  { id: 'install', label: 'Instalar Apps', icon: Package, color: 'col-span-2 hover:bg-purple-500/20 hover:text-purple-400' },
                  { id: 'logs', label: 'Ver Logs', icon: FileText, color: 'col-span-2 hover:bg-gray-500/20 hover:text-gray-300' },
                ].map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleAction(action.id, selectedPC.id, selectedPC.ip)}
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
                  <div className="grid grid-cols-2 gap-2">
                    {Array.from(selectedList).map((pcItem) => {
                      const status = deviceStatusOverrides[pcItem.ip]?.status || 'unknown';
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
              <div className="p-6 grid grid-cols-2 gap-3">
                {[
                  { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400' },
                  { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400' },
                  { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400' },
                  { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400' },
                  { id: 'install', label: 'Instalar Apps', icon: Package, color: 'col-span-2 hover:bg-purple-500/20 hover:text-purple-400' },
                  { id: 'logs', label: 'Ver Logs', icon: FileText, color: 'col-span-2 hover:bg-gray-500/20 hover:text-gray-300' },
                ].map(action => (
                  <button
                    key={action.id}
                    onClick={() => handleBulkAction(action.id)}
                    disabled={actionLoading !== null}
                    className={`p-3 rounded-lg border border-white/5 bg-black/40 text-gray-400 transition-all flex items-center justify-center gap-2 text-sm font-medium ${action.color} ${action.id === 'install' || action.id === 'logs' ? 'col-span-2' : ''}`}
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

      {/* App Deployment Modal */}
      <AnimatePresence>
        {showDeployModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeployModal(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[100] p-2"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-7xl rounded-2xl shadow-2xl overflow-hidden max-h-[97vh] flex flex-col"
            >
              <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-gradient-to-r from-cyan-900/20 to-transparent">
                <div className="flex items-center gap-4 flex-1">
                  <Terminal className="text-cyan-400" size={24} />
                  <div className="min-w-0">
                    <h3 className="text-2xl font-bold text-white truncate">Despliegue de Apps</h3>
                    <p className="text-xs text-cyan-400 font-mono mt-1 truncate">
                      {deployTargetPCs.length === 1 
                        ? `Equipo: ${deployTargetPCs[0].id}`
                        : `${deployTargetPCs.length} equipos seleccionados`}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDeployModal(false)}
                  className="text-gray-500 hover:text-white transition-colors flex-shrink-0 ml-4"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-8">
                <AppDeploymentSection targetPCs={deployTargetPCs} isModal={true} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 3. USERS SECTION
const CreateUsersSection = ({ avatarOptions, getAvatarUrl }) => {
  const [searchTerm, setSearchTerm] = useState("");
  // Estado para el avatar seleccionado en el formulario de creación
  const [newUserAvatarId, setNewUserAvatarId] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");

  const [users, setUsers] = useState([
    { id: 1, name: "Juan Pérez", email: "juan@envyguard.com", role: "Admin", status: "Activo", createdAt: "2025-11-20", avatarId: 1 },
    { id: 2, name: "María García", email: "maria@envyguard.com", role: "Operador", status: "Activo", createdAt: "2025-11-18", avatarId: 2 },
    { id: 3, name: "Carlos López", email: "carlos@envyguard.com", role: "Visualizador", status: "Inactivo", createdAt: "2025-11-15", avatarId: 3 },
    { id: 4, name: "Ana Torres", email: "ana@envyguard.com", role: "Agente", status: "Activo", createdAt: "2025-11-22", avatarId: 4 },
  ]);
  const [showForm, setShowForm] = useState(false);
  
  // Filter logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header with improved styling */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
           <div className="flex items-center gap-3">
                <div className="p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <UserPlus className="text-cyan-400" size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">Gestión de Accesos</h2>
                    <p className="text-gray-500 text-sm font-sans">Control de credenciales y privilegios.</p>
                </div>
           </div>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="group relative px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center gap-2 text-sm overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {showForm ? <ChevronDown size={16} /> : <UserPlus size={16} />}
            {showForm ? "Cerrar Panel" : "Nuevo Usuario"}
          </span>
          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="p-6 bg-[#0a0a0a] border border-cyan-500/20 rounded-xl mb-6 shadow-xl relative overflow-hidden">
               {/* Decorative bg */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none" />
               
               <h3 className="text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2">
                   <Lock size={12}/> NUEVA CREDENCIAL DE ACCESO
               </h3>
               
               <form className="flex flex-col gap-6">
                 <div className="flex items-start gap-6">
                    {/* Avatar Selection for New User */}
                    <div className="shrink-0">
                        <label className="block text-xs font-mono text-gray-500 mb-2">AVATAR</label>
                        <div className="w-20 h-20 rounded-xl border border-white/10 bg-white/5 p-1 relative overflow-hidden group">
                            <img 
                                src={getAvatarUrl(avatarOptions.find(a => a.id === newUserAvatarId))} 
                                alt="avatar preview" 
                                className="w-full h-full rounded-lg object-cover" 
                            />
                            <button 
                                type="button"
                                onClick={() => setNewUserAvatarId(prev => prev >= 8 ? 1 : prev + 1)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white cursor-pointer"
                            >
                                CAMBIAR
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 ml-1">NOMBRE COMPLETO</label>
                            <input type="text" placeholder="Ej: John Doe" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:bg-cyan-900/5 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 ml-1">CORREO CORPORATIVO</label>
                            <input type="email" placeholder="user@envyguard.com" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:bg-cyan-900/5 outline-none transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 mb-1.5 ml-1">ROL DEL SISTEMA</label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-gray-300 focus:border-cyan-500 outline-none transition-all appearance-none cursor-pointer">
                                <option>Admin</option>
                            </select>
                        </div>
                    </div>
                 </div>

                 {/* Contraseña y Confirmación */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1.5 ml-1">CONTRASEÑA</label>
                        <input type="password" placeholder="Contraseña segura" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:bg-cyan-900/5 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-1.5 ml-1">CONFIRMAR CONTRASEÑA</label>
                        <input type="password" placeholder="Confirmar contraseña" className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:bg-cyan-900/5 outline-none transition-all" />
                    </div>
                 </div>
                 
                 <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                    <motion.button 
                        type="button" 
                        onClick={() => setShowForm(false)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-lg border border-red-500/40 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
                    >
                        CANCELAR
                    </motion.button>
                    <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.92 }}
                        className="px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-xs uppercase tracking-widest transition-all flex items-center gap-2 border border-cyan-400/50 hover:border-cyan-300"
                    >
                        <UserPlus size={16} />
                        CREAR USUARIO
                    </motion.button>
                 </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbar & Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0a0a] p-2 rounded-xl border border-white/5">
         {/* Role Tabs */}
         <div className="flex p-1 bg-black/40 rounded-lg border border-white/5 w-full md:w-auto overflow-x-auto">
            {[
                { id: "all", label: "Todos" }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setRoleFilter(tab.id)}
                    className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
                        roleFilter === tab.id 
                        ? "bg-white/10 text-white shadow-sm border border-white/10" 
                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                    }`}
                >
                    {tab.label}
                </button>
            ))}
         </div>

         {/* Search */}
         <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-white/5 w-full md:w-80 focus-within:border-cyan-500/50 transition-colors">
            <Search size={14} className="text-gray-500" />
            <input 
            type="text" 
            placeholder="Buscar por nombre, email o ID..." 
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden custom-scrollbar shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
            <tr>
              <th className="p-4 font-normal">Identidad</th>
              <th className="p-4 font-normal">Rol / Permisos</th>
              <th className="p-4 font-normal">Estado</th>
              <th className="p-4 font-normal">Actividad</th>
              <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 p-0.5 border border-white/10 overflow-hidden">
                        <img 
                            src={getAvatarUrl(avatarOptions.find(a => a.id === user.avatarId) || avatarOptions[0])} 
                            alt={user.name}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div>
                        <div className="font-bold text-gray-200 text-sm">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-tight">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                   <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                     user.role === 'Admin' 
                        ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : user.role === 'Agente'
                            ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                            : 'border-white/20 text-gray-400 bg-white/5'
                   }`}>
                     {user.role === 'Admin' && <Shield size={10} />}
                     {user.role}
                   </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`relative w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}>
                        {user.status === 'Activo' && <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                    </div>
                    <span className={`text-xs ${user.status === 'Activo' ? 'text-gray-300' : 'text-gray-600'}`}>{user.status}</span>
                  </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-mono text-xs">{user.createdAt}</span>
                        <span className="text-[10px] text-gray-600">Registro</span>
                    </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors" title="Editar"><Edit2 size={14} /></button>
                    <button className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors" title="Eliminar"><Trash2 size={14} /></button>
                    <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"><MoreVertical size={14} /></button>
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

// 3.5 BLOCKING SITES SECTION
const BlockingSitesSection = () => {
  const [blockedSites, setBlockedSites] = useState([
    { id: 1, url: "facebook.com", category: "Redes Sociales", blocked: true, dateAdded: "2025-11-20", devices: 15 },
    { id: 2, url: "youtube.com", category: "Video", blocked: true, dateAdded: "2025-11-20", devices: 18 },
    { id: 3, url: "instagram.com", category: "Redes Sociales", blocked: true, dateAdded: "2025-11-21", devices: 12 },
    { id: 4, url: "tiktok.com", category: "Video", blocked: true, dateAdded: "2025-11-21", devices: 10 },
    { id: 5, url: "gaming.com", category: "Entretenimiento", blocked: false, dateAdded: "2025-11-22", devices: 0 },
  ]);
  
  const [newSite, setNewSite] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Redes Sociales");
  const [toast, setToast] = useState(null);
  const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

  const categories = ["Redes Sociales", "Video", "Entretenimiento", "Compras", "Otro"];
  
  const filteredSites = blockedSites.filter(site => {
    const matchesSearch = site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || site.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddSite = () => {
    if (!newSite.trim()) {
      setToast({ type: "warn", msg: "Ingresa una URL" });
      setTimeout(() => setToast(null), 2000);
      return;
    }
    
    const siteExists = blockedSites.some(s => s.url.toLowerCase() === newSite.toLowerCase());
    if (siteExists) {
      setToast({ type: "error", msg: "Este sitio ya está en la lista" });
      setTimeout(() => setToast(null), 2000);
      return;
    }

    const newBlockedSite = {
      id: Math.max(...blockedSites.map(s => s.id), 0) + 1,
      url: newSite.toLowerCase(),
      category: selectedCategory,
      blocked: true,
      dateAdded: new Date().toISOString().split('T')[0],
      devices: 0
    };

    setBlockedSites([...blockedSites, newBlockedSite]);
    setNewSite("");
    setToast({ type: "success", msg: `${newSite} agregado a la lista de bloqueo` });
    setTimeout(() => setToast(null), 2000);
  };

  const handleRemoveSite = (id) => {
    const site = blockedSites.find(s => s.id === id);
    setBlockedSites(blockedSites.filter(s => s.id !== id));
    setToast({ type: "success", msg: `${site.url} eliminado de la lista` });
    setTimeout(() => setToast(null), 2000);
  };

  const handleToggleSite = (id) => {
    setBlockedSites(blockedSites.map(site =>
      site.id === id ? { ...site, blocked: !site.blocked } : site
    ));
  };

  const stats = {
    total: blockedSites.length,
    active: blockedSites.filter(s => s.blocked).length,
    devices: blockedSites.reduce((sum, s) => sum + s.devices, 0),
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} 
            className={`self-center px-4 py-2 rounded-md text-sm font-mono border ${
              toast.type === 'success' ? 'text-green-300 border-green-500/30 bg-green-500/10' : 
              toast.type === 'warn' ? 'text-yellow-300 border-yellow-500/30 bg-yellow-500/10' : 
              'text-red-300 border-red-500/30 bg-red-500/10'
            }`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20">
              <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Bloqueo de Sitios Web</h2>
              <p className="text-gray-500 text-sm font-sans">Gestiona y controla el acceso a sitios web en tu red.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        initial="hidden" animate="visible" 
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { label: "Sitios Bloqueados", value: stats.active, icon: AlertTriangle, color: "text-red-400", bg: "from-red-500/10 to-transparent", border: "border-red-500/20" },
          { label: "Total en Lista", value: stats.total, icon: Shield, color: "text-cyan-400", bg: "from-cyan-500/10 to-transparent", border: "border-cyan-500/20" },
          { label: "Dispositivos", value: stats.devices, icon: Monitor, color: "text-green-400", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
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
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Add New Site Form */}
      <div className="bg-black/40 p-6 rounded-xl border border-white/5 space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Plus size={20} className="text-cyan-400" />
          Agregar Sitio a Bloquear
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">URL del Sitio</label>
            <input
              type="text"
              placeholder="ej: example.com"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 focus:outline-none placeholder-gray-700"
            />
          </div>

          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">Categoría</label>
            <button
              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm hover:border-white/20 transition-all flex justify-between items-center cursor-pointer group"
              onClick={() => setOpenCategoryMenu(!openCategoryMenu)}
            >
              <span className="font-medium">{selectedCategory}</span>
              <motion.div animate={{ rotate: openCategoryMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-300" />
              </motion.div>
            </button>
            
            <AnimatePresence>
              {openCategoryMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto overflow-x-hidden"
                >
                  {categories.map((cat) => (
                    <motion.button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setOpenCategoryMenu(false);
                      }}
                      className={`w-full px-4 py-3 text-left text-sm transition-all border-b border-white/5 last:border-0 flex items-center gap-3 ${
                        selectedCategory === cat
                          ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                          : 'text-gray-300 hover:bg-white/5'
                      }`}
                      whileHover={{ paddingLeft: '20px' }}
                    >
                      <div className={`w-2 h-2 rounded-full transition-all ${selectedCategory === cat ? 'bg-cyan-400' : 'bg-transparent'}`} />
                      {cat}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSite}
              className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-cyan-400/50 hover:border-cyan-300"
            >
              <Plus size={14} />
              Agregar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0a0a0a] p-2 rounded-xl border border-white/5">
        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5 w-full md:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Todos" },
            { id: "active", label: "Activos" },
            { id: "inactive", label: "Inactivos" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                filterCategory === (f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive') ? 
                  "bg-white/10 text-white shadow-sm border border-white/10" : 
                  "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 bg-black/40 px-3 py-2 rounded-lg border border-white/5 w-full md:w-64 focus-within:border-cyan-500/50 transition-colors">
          <Search size={14} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Buscar sitios..." 
            className="bg-transparent border-none outline-none text-xs text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blocked Sites Table */}
      <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
            <tr>
              <th className="p-4 font-normal">Sitio Web</th>
              <th className="p-4 font-normal">Categoría</th>
              <th className="p-4 font-normal">Agregado</th>
              <th className="p-4 font-normal">Dispositivos</th>
              <th className="p-4 font-normal">Estado</th>
              <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredSites.map((site) => (
              <tr key={site.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-gray-200 font-mono">{site.url}</div>
                </td>
                <td className="p-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {site.category}
                  </span>
                </td>
                <td className="p-4">
                  <span className="text-xs text-gray-500 font-mono">{site.dateAdded}</span>
                </td>
                <td className="p-4">
                  <span className="text-xs font-bold text-cyan-400">{site.devices}</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <div className={`relative w-2 h-2 rounded-full ${site.blocked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-green-500"}`} />
                    <span className={`text-xs font-bold ${site.blocked ? "text-red-400" : "text-green-400"}`}>
                      {site.blocked ? "BLOQUEADO" : "PERMITIDO"}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleSite(site.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        site.blocked 
                          ? "hover:bg-green-500/10 hover:text-green-400" 
                          : "hover:bg-red-500/10 hover:text-red-400"
                      }`}
                      title={site.blocked ? "Permitir" : "Bloquear"}
                    >
                      {site.blocked ? <Zap size={14} /> : <Lock size={14} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveSite(site.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 size={14} />
                    </motion.button>
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

// 3.6 LOGS & TRAFFIC SECTION
const LogsAndTrafficSection = () => {
  const [activeTab, setActiveTab] = useState('traffic');
  const [dateRange, setDateRange] = useState('24h');
  const [filterType, setFilterType] = useState('all');
  const [searchLog, setSearchLog] = useState('');
  const [trafficData] = useState([
    { time: '00:00', upload: 12, download: 45 },
    { time: '04:00', upload: 15, download: 38 },
    { time: '08:00', upload: 28, download: 62 },
    { time: '12:00', upload: 42, download: 78 },
    { time: '16:00', upload: 35, download: 71 },
    { time: '20:00', upload: 48, download: 85 },
  ]);

  const [logs] = useState([
    { id: 1, timestamp: '2025-12-01 14:32:15', device: 'PC-ADMIN-01', action: 'Login exitoso', type: 'Seguridad', status: 'success' },
    { id: 2, timestamp: '2025-12-01 14:28:42', device: 'PC-OFFICE-05', action: 'Intento de acceso denegado', type: 'Seguridad', status: 'error' },
    { id: 3, timestamp: '2025-12-01 14:15:08', device: 'LAPTOP-SALES-02', action: 'Archivo descargado', type: 'Sistema', status: 'success' },
    { id: 4, timestamp: '2025-12-01 14:05:33', device: 'PC-OFFICE-03', action: 'Sitio bloqueado: facebook.com', type: 'Seguridad', status: 'warning' },
    { id: 5, timestamp: '2025-12-01 13:58:21', device: 'PRINTER-FLOOR1', action: 'Conexión restaurada', type: 'Red', status: 'success' },
    { id: 6, timestamp: '2025-12-01 13:45:10', device: 'PC-ADMIN-01', action: 'Cambio de política aplicado', type: 'Sistema', status: 'success' },
    { id: 7, timestamp: '2025-12-01 13:32:44', device: 'SERVER-PRIMARY', action: 'Alto uso de CPU detectado', type: 'Sistema', status: 'warning' },
    { id: 8, timestamp: '2025-12-01 13:15:22', device: 'LAPTOP-HR-01', action: 'Sincronización completada', type: 'Sistema', status: 'success' },
  ]);

  const trafficStats = {
    totalUpload: 183,
    totalDownload: 479,
    avgBandwidth: 66.2,
    peakTime: '20:00',
    activeDevices: 24,
  };

  const topDevices = [
    { name: 'SERVER-PRIMARY', usage: 145, color: 'bg-red-500' },
    { name: 'PC-ADMIN-01', usage: 89, color: 'bg-orange-500' },
    { name: 'LAPTOP-SALES-02', usage: 67, color: 'bg-yellow-500' },
    { name: 'PC-OFFICE-05', usage: 54, color: 'bg-cyan-500' },
    { name: 'PRINTER-FLOOR1', usage: 32, color: 'bg-green-500' },
  ];

  const protocols = [
    { name: 'HTTPS', percentage: 45, color: 'bg-blue-500' },
    { name: 'HTTP', percentage: 25, color: 'bg-cyan-500' },
    { name: 'DNS', percentage: 15, color: 'bg-purple-500' },
    { name: 'SSH', percentage: 10, color: 'bg-green-500' },
    { name: 'Otros', percentage: 5, color: 'bg-gray-500' },
  ];

  const topBlockedSites = [
    { site: 'facebook.com', blocks: 124 },
    { site: 'youtube.com', blocks: 89 },
    { site: 'instagram.com', blocks: 67 },
    { site: 'tiktok.com', blocks: 45 },
    { site: 'twitter.com', blocks: 32 },
  ];

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.device.toLowerCase().includes(searchLog.toLowerCase()) || 
                         log.action.toLowerCase().includes(searchLog.toLowerCase());
    const matchesType = filterType === 'all' || log.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <BarChart3 className="text-blue-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Logs y Tráfico</h2>
              <p className="text-gray-500 text-sm font-sans">Monitoreo de actividad y análisis de tráfico de red.</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {[
            { id: 'traffic', label: '📊 Tráfico' },
            { id: 'logs', label: '📋 Logs' },
          ].map(tab => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* TAB: TRAFFIC */}
      {activeTab === 'traffic' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 flex-1 overflow-y-auto">
          {/* Stats Cards */}
          <motion.div 
            initial="hidden" animate="visible" 
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {[
              { label: 'Upload Total', value: `${trafficStats.totalUpload} MB`, icon: ArrowUp, color: 'text-green-400', bg: 'from-green-500/10' },
              { label: 'Download Total', value: `${trafficStats.totalDownload} MB`, icon: ArrowDown, color: 'text-blue-400', bg: 'from-blue-500/10' },
              { label: 'Ancho Promedio', value: `${trafficStats.avgBandwidth} Mbps`, icon: Gauge, color: 'text-cyan-400', bg: 'from-cyan-500/10' },
              { label: 'Hora Pico', value: trafficStats.peakTime, icon: Clock, color: 'text-yellow-400', bg: 'from-yellow-500/10' },
              { label: 'Dispositivos', value: trafficStats.activeDevices, icon: Monitor, color: 'text-purple-400', bg: 'from-purple-500/10' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
                whileHover={{ scale: 1.02, y: -5 }}
                className={`relative p-4 rounded-xl border border-white/5 bg-gradient-to-b ${stat.bg} to-transparent backdrop-blur-sm group overflow-hidden`}
              >
                <div className={`flex items-start justify-between`}>
                  <div>
                    <p className="text-xs text-gray-400 font-mono uppercase mb-2">{stat.label}</p>
                    <h3 className="text-2xl font-bold text-white font-mono">{stat.value}</h3>
                  </div>
                  <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${stat.color}`}>
                    <stat.icon size={18} />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Traffic Chart */}
          <div className="bg-black/40 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6">Tráfico (Últimas 24 horas)</h3>
            <div className="flex items-end gap-2 h-48 rounded-lg bg-black/20 p-4 border border-white/5">
              {trafficData.map((data, idx) => {
                const maxValue = 100;
                const uploadHeight = (data.upload / maxValue) * 100;
                const downloadHeight = (data.download / maxValue) * 100;
                return (
                  <div key={idx} className="flex-1 flex items-end gap-1 group">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${uploadHeight}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="flex-1 bg-green-500/70 rounded-t-lg hover:bg-green-500 transition-colors relative group/bar cursor-pointer"
                      title={`Upload: ${data.upload}MB`}
                    >
                      <div className="absolute -top-6 left-0 right-0 text-xs text-white font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity text-center">{data.upload}MB</div>
                    </motion.div>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${downloadHeight}%` }}
                      transition={{ duration: 0.5, delay: idx * 0.05 }}
                      className="flex-1 bg-blue-500/70 rounded-t-lg hover:bg-blue-500 transition-colors relative group/bar cursor-pointer"
                      title={`Download: ${data.download}MB`}
                    >
                      <div className="absolute -top-6 left-0 right-0 text-xs text-white font-mono opacity-0 group-hover/bar:opacity-100 transition-opacity text-center">{data.download}MB</div>
                    </motion.div>
                    <div className="text-xs text-gray-500 font-mono w-8 text-center opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-6">{data.time}</div>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-gray-300">Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-gray-300">Download</span>
              </div>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Devices */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Monitor size={18} className="text-cyan-400" />
                Top Dispositivos
              </h3>
              <div className="space-y-4">
                {topDevices.map((device, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300 font-mono">{device.name}</span>
                      <span className="text-sm font-bold text-white">{device.usage} MB</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(device.usage / 145) * 100}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${device.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Distribution */}
            <div className="bg-black/40 p-6 rounded-xl border border-white/5">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Globe size={18} className="text-purple-400" />
                Protocolos
              </h3>
              <div className="space-y-4">
                {protocols.map((proto, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300 font-mono">{proto.name}</span>
                      <span className="text-sm font-bold text-white">{proto.percentage}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${proto.percentage}%` }}
                        transition={{ duration: 0.8, delay: idx * 0.1 }}
                        className={`h-full ${proto.color} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Blocked Sites */}
          <div className="bg-black/40 p-6 rounded-xl border border-white/5">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-400" />
              Top Sitios Bloqueados
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs uppercase text-gray-500 font-mono border-b border-white/5">
                  <tr>
                    <th className="pb-3">Sitio</th>
                    <th className="pb-3 text-right">Bloqueos</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {topBlockedSites.map((site, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 font-mono text-gray-200">{site.site}</td>
                      <td className="py-3 text-right">
                        <div className="flex justify-end gap-2 items-center">
                          <span className="font-bold text-red-400">{site.blocks}</span>
                          <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div style={{ width: `${(site.blocks / 124) * 100}%` }} className="h-full bg-red-500 rounded-full" />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB: LOGS */}
      {activeTab === 'logs' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 flex-1 flex flex-col">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 bg-[#0a0a0a] p-4 rounded-xl border border-white/5">
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
                { id: 'Seguridad', label: 'Seguridad' },
                { id: 'Sistema', label: 'Sistema' },
                { id: 'Red', label: 'Red' },
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
                  <th className="p-4 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4 font-mono text-gray-400 text-xs">{log.timestamp}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-gray-600" />
                        <span className="font-bold text-gray-200 font-mono">{log.device}</span>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{log.action}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-mono font-bold ${
                        log.type === 'Seguridad' ? 'bg-red-500/10 text-red-400' :
                        log.type === 'Sistema' ? 'bg-blue-500/10 text-blue-400' :
                        'bg-cyan-500/10 text-cyan-400'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {log.status === 'success' && <CheckCircle size={14} className="text-green-400" />}
                        {log.status === 'error' && <X size={14} className="text-red-400" />}
                        {log.status === 'warning' && <AlertCircle size={14} className="text-yellow-400" />}
                        <span className={`text-xs font-bold ${
                          log.status === 'success' ? 'text-green-400' :
                          log.status === 'error' ? 'text-red-400' :
                          'text-yellow-400'
                        }`}>
                          {log.status === 'success' ? 'Exitoso' : log.status === 'error' ? 'Error' : 'Advertencia'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </motion.div>
      )}
    </div>
  );
};

// 3.7 APP DEPLOYMENT SECTION
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

  // Si hay PCs específicos pasados como props, usa esos; si no, usa los predefinidos
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

    // Guardar comando en la lista de comandos rápidos si no existe
    const commandExists = savedCommands.some(cmd => cmd.cmd === deploymentCode.trim());
    if (!commandExists) {
      // Generar una etiqueta automática basada en el comando
      const label = deploymentCode.substring(0, 20) + (deploymentCode.length > 20 ? '...' : '');
      setSavedCommands([...savedCommands, { label, cmd: deploymentCode.trim() }]);
    }

    setIsExecuting(true);
    setExecutionOutput('Conectando con el servidor...\n');
    setShowOutput(true);

    // Simular ejecución
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
      
      // Agregar al historial
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
      {/* Header - Solo mostrar si NO es modal */}
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

      {/* Main Content Area */}
      <div className={`flex-1 grid ${isModal ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 lg:grid-cols-3'} ${isModal ? 'gap-4' : 'gap-4'} overflow-hidden`}>
        
        {/* Code Editor Section */}
        <div className={`${isModal ? 'lg:col-span-1' : 'lg:col-span-2'} flex flex-col gap-3 h-full overflow-hidden`}>
          
          {/* Device Selector */}
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

          {/* Code Input */}
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

          {/* Execute Button */}
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

        {/* Info Panel */}
        <div className={`flex flex-col gap-3 h-full overflow-hidden lg:col-span-1`}>
          
          {/* Quick Commands */}
          <div className={`bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5 flex-shrink-0`}>
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

          {/* Output Panel */}
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
      </div>

      {/* History - Solo si NO es modal */}
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

const DashboardContent = ({ currentPage, avatarOptions, getAvatarUrl }) => {
  const containerClass = "flex flex-1 flex-col gap-6 rounded-tl-3xl border-l border-t border-white/10 bg-[#080808] p-4 md:p-8 backdrop-blur-xl overflow-y-auto shadow-[-20px_-20px_50px_rgba(0,0,0,0.5)] relative z-10 h-full w-full scrollbar-hide";
  
  const renderContent = () => {
    switch(currentPage) {
      case 'dashboard': return <OverviewSection />;
      case 'computers': return <ComputerMonitoringSection />;
      case 'users': return <CreateUsersSection avatarOptions={avatarOptions} getAvatarUrl={getAvatarUrl} />;
      case 'blocking': return <BlockingSitesSection />;
      case 'deploy': return <AppDeploymentSection />;
      case 'logs': return <LogsAndTrafficSection />;
      case 'settings': return <PlaceholderSection title="Configuración del Sistema" icon={Settings} description="Ajustes globales, conexiones a bases de datos y preferencias de interfaz." />;
      default: return <OverviewSection />;
    }
  }

  return (
    <div className={containerClass} style={{
      scrollbarColor: '#1f1f1f #0a0a0a',
      scrollbarWidth: 'thin'
    }}>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          width: 8px;
        }
        .scrollbar-hide::-webkit-scrollbar-track {
          background: #0a0a0a;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb {
          background: #1f1f1f;
          border-radius: 4px;
        }
        .scrollbar-hide::-webkit-scrollbar-thumb:hover {
          background: #333333;
        }
      `}</style>
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
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  
  // Estado del avatar con persistencia en localStorage
  const [selectedAvatar, setSelectedAvatarState] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('selectedAvatar');
      return saved ? parseInt(saved) : null;
    }
    return null;
  });

  // Wrapper para setSelectedAvatar que persiste en localStorage
  const setSelectedAvatar = (avatarId) => {
    setSelectedAvatarState(avatarId);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedAvatar', avatarId.toString());
    }
  };
  
  const currentUser = { name: "Juan Pérez", role: "Admin Principal", avatar: selectedAvatar };

  // Lista de avatares con tema cibernético para EnvyGuard
  const avatarOptions = [
    { 
      id: 1, 
      label: "Administrador", 
      style: "lorelei",
      seed: "Admin-1",
      desc: "Control Total del Sistema",
      bgColor: "ff006e"
    },
    { 
      id: 2, 
      label: "Robot IA", 
      style: "adventurer",
      seed: "Robot-2",
      desc: "Automatización Inteligente",
      bgColor: "00d4ff"
    },
    { 
      id: 3, 
      label: "Ingeniero de Red", 
      style: "big-smile",
      seed: "Engineer-3",
      desc: "Infraestructura y Conectividad",
      bgColor: "8338ec"
    },
    { 
      id: 4, 
      label: "Técnico Hardware", 
      style: "pixel-art",
      seed: "Technic-4",
      desc: "Especialista en Equipos",
      bgColor: "00ff88"
    },
    { 
      id: 5, 
      label: "Gestor de Base de Datos", 
      style: "personas",
      seed: "Server-5",
      desc: "Administración de Datos",
      bgColor: "ffbe0b"
    },
    { 
      id: 6, 
      label: "Monitor de Seguridad", 
      style: "notionists",
      seed: "Security-6",
      desc: "Vigilancia Constante",
      bgColor: "e60023"
    },
    { 
      id: 7, 
      label: "Especialista Firewall", 
      style: "fun-emoji",
      seed: "Firewall-7",
      desc: "Protección de Red Avanzada",
      bgColor: "1b1b3f"
    },
    { 
      id: 8, 
      label: "Desarrollador", 
      style: "avataaars",
      seed: "Developer-8",
      desc: "Programación y Desarrollo",
      bgColor: "0099ff"
    },
  ];

  // Función para generar URL de avatar de DiceBear
  const getAvatarUrl = (avatar) => {
    return `https://api.dicebear.com/7.x/${avatar.style}/svg?seed=${avatar.seed}&backgroundColor=${avatar.bgColor}`;
  };

  const links = [
    { label: "Panel Principal", href: "#dashboard", icon: <LayoutGrid />, page: "dashboard" },
    { label: "Servidores Linux", href: "#computers", icon: <Monitor />, page: "computers" },
    { label: "Bloqueo de Sitios", href: "#blocking", icon: <AlertTriangle />, page: "blocking" },
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
          <UserProfile 
            user={currentUser} 
            showProfileModal={showProfileModal} 
            setShowProfileModal={setShowProfileModal}
            showAvatarSelector={showAvatarSelector}
            setShowAvatarSelector={setShowAvatarSelector}
            avatarOptions={avatarOptions}
            selectedAvatar={selectedAvatar}
            setSelectedAvatar={setSelectedAvatar}
            getAvatarUrl={getAvatarUrl}
          />
        </SidebarBody>
      </Sidebar>

      <DashboardContent currentPage={currentPage} avatarOptions={avatarOptions} getAvatarUrl={getAvatarUrl} />
    </div>
  );
}

export default DashboardLayout;