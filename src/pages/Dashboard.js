import React, { useState, createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  Copy,
  Menu,
  Eye,
  RefreshCw,
  Maximize2,
  AlertTriangle as AlertIcon,
  Bell,
} from "lucide-react";
import iconLogo from "../assets/icons/icon.png";
import { deviceService, WebSocketService, RabbitMQService, AuthService, userService } from "../services";

// ============================================
// 🔧 FUNCIONES DE DEBUG (Para consola)
// ============================================
if (typeof window !== 'undefined') {
  window.debugEnvyGuard = {
    getUserData: () => {
      console.log('%c🔍 DATOS DEL USUARIO ACTUAL', 'font-size: 14px; color: #00ff88; font-weight: bold;');
      const user = AuthService.getCurrentUser();
      console.log('Usuario completo:', user);
      if (user) {
        console.table(user);
        console.log('Nombre resuelto:', (user.firstName || user.nombre) + ' ' + (user.lastName || user.apellido));
        console.log('Rol resuelto:', user.role || user.rol);
      }
      return user;
    },
    
    getLocalStorage: () => {
      console.log('%c📦 CONTENIDO DE LOCALSTORAGE', 'font-size: 14px; color: #00d4ff; font-weight: bold;');
      console.log('authToken:', localStorage.getItem('authToken') ? 'Presente ✅' : 'No encontrado ❌');
      const userStr = localStorage.getItem('user');
      console.log('user (string):', userStr);
      if (userStr) {
        try {
          console.log('user (parseado):', JSON.parse(userStr));
        } catch (e) {
          console.error('Error al parsear:', e);
        }
      }
      return { token: localStorage.getItem('authToken'), user: userStr };
    },
    
    clearData: () => {
      console.log('%c🗑️  LIMPIANDO DATOS', 'font-size: 14px; color: #ff006e; font-weight: bold;');
      localStorage.clear();
      console.log('✅ localStorage limpiado. Recarga la página.');
    },
    
    help: () => {
      console.log('%c📚 FUNCIONES DE DEBUG DISPONIBLES:', 'font-size: 14px; color: #ffbe0b; font-weight: bold;');
      console.log('window.debugEnvyGuard.getUserData() - Ver datos del usuario actual');
      console.log('window.debugEnvyGuard.getLocalStorage() - Ver localStorage');
      console.log('window.debugEnvyGuard.clearData() - Limpiar localStorage');
      console.log('window.debugEnvyGuard.help() - Mostrar esta ayuda');
    }
  };
  console.log('%c✨ Debug tools disponibles. Escribe: window.debugEnvyGuard.help()', 'color: #00ff88; font-weight: bold;');
}

// --- UTILS & COMPONENTS ---

// Componente para el Scrollbar personalizado (CSS-in-JS simple)
const ScrollArea = ({ children, className = "" }) => (
  <div className={`overflow-y-auto pr-2 ${className} scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent hover:scrollbar-thumb-cyan-700`}>
    {children}
  </div>
);

// 🎨 COMPONENTE TOAST ESTANDARIZADO Y REUTILIZABLE
const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="toast"
        initial={{ x: 400, opacity: 0, y: 0 }} 
        animate={{ x: 0, opacity: 1, y: 0 }} 
        exit={{ x: 400, opacity: 0, y: -100 }}
        transition={{ type: "spring", stiffness: 400, damping: 30, exit: { duration: 0.5 } }}
        className={`fixed top-6 right-6 max-w-md p-4 rounded-xl text-sm font-semibold border-2 shadow-2xl backdrop-blur-md z-[99999] flex items-center gap-3 ${
          toast.type === 'success' 
            ? 'text-green-100 border-green-500/60 bg-green-500/20' 
            : toast.type === 'warn' 
            ? 'text-yellow-100 border-yellow-500/60 bg-yellow-500/20' 
            : 'text-red-100 border-red-500/60 bg-red-500/20'
        }`}
      >
        {toast.type === 'success' && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {toast.type === 'warn' && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        {toast.type === 'error' && (
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
        )}
        <span className="flex-1">{toast.msg}</span>
        <button
          onClick={onClose}
          className="flex-shrink-0 ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

// --- SIDEBAR ---

const SidebarContext = createContext(undefined);

const Sidebar = ({ children, open, setOpen }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {/* Hamburger Menu - Solo visible en móvil */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-[110] md:hidden p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30 text-cyan-400 transition-all"
      >
        <Menu size={24} />
      </button>

      {/* Overlay móvil */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar - Desktop normal, Mobile deslizable */}
      <motion.div
        className="relative flex h-full flex-col bg-[#0f0f0f] border-r border-gray-900 overflow-hidden z-50 shrink-0 hidden md:flex w-[80px]"
        animate={{ width: open ? 280 : 80 }}
        transition={{ duration: 0.2, type: "tween", ease: "easeOut" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        {children}
      </motion.div>

      {/* Sidebar móvil - Menú deslizable */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3, type: "tween", ease: "easeOut" }}
            className="fixed left-0 top-0 h-full w-[280px] bg-[#0f0f0f] border-r border-gray-900 overflow-hidden z-50 md:hidden flex flex-col"
            onClick={(e) => {
              if (e.target.closest('a') || e.target.closest('button:not(.fixed)')) {
                setIsMobileOpen(false);
              }
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </SidebarContext.Provider>
  );
};

const SidebarBody = (props) => (
  <div className="flex h-full w-full flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-3 md:px-3 py-3 md:py-3" {...props} />
);

const SidebarLink = ({ link, className = "", isActive = false, onClick, ...props }) => {
  const { open } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      onClick={(e) => { e.preventDefault(); if (onClick) onClick(link.page); }}
      className={`relative flex items-center justify-center md:justify-start gap-3 px-3 md:px-3 py-2.5 md:py-2.5 rounded-lg transition-all group cursor-pointer mb-2 md:mb-1.5 ${className}`}
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

      <div className={`relative z-10 flex-shrink-0 w-5 h-5 md:w-5 md:h-5 flex items-center justify-center transition-all duration-300 ${isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-200'}`}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          {link.icon}
        </svg>
      </div>

      {/* Desktop: mostrar en AnimatePresence con open state */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className={`relative z-10 text-sm font-medium whitespace-nowrap transition-colors hidden md:inline-block ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Móvil: siempre mostrar */}
      <span className="relative z-10 text-sm font-medium whitespace-nowrap md:hidden">
        {link.label}
      </span>
    </motion.a>
  );
};

const SidebarLogo = () => {
  const { open } = useContext(SidebarContext);
  return (
    <div className="relative z-20 flex items-center justify-center md:justify-start gap-3 px-3 md:px-2 py-4 md:py-4 mb-8 md:mb-8 border-b border-gray-800 pb-4 md:pb-4 w-full">
      <div className="w-10 md:w-10 h-10 md:h-10 flex items-center justify-center shrink-0 rounded-lg flex-shrink-0 bg-cyan-500/10 border border-cyan-500/30">
        <img src={iconLogo} alt="EnvyGuard" className="w-8 md:w-8 h-8 md:h-8 object-contain" />
      </div>
      
      {/* Desktop: mostrar en AnimatePresence con open state */}
      <AnimatePresence mode="wait">
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="flex flex-col min-w-0 hidden md:flex"
          >
            <span className="font-bold text-sm tracking-wide font-mono text-gray-50">ENVYGUARD</span>
            <span className="text-[8px] text-gray-500 font-mono tracking-wider uppercase">V1.0</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Móvil: siempre mostrar */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="flex flex-col min-w-0 md:hidden"
      >
        <span className="font-bold text-sm md:text-sm tracking-wide font-mono text-gray-50">ENVYGUARD</span>
        <span className="text-[9px] md:text-[8px] text-gray-500 font-mono tracking-wider uppercase">V1.0</span>
      </motion.div>
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
  getAvatarUrl,
  onLogout
}) => {
  const { open } = useContext(SidebarContext);
  const selectedAvatarData = avatarOptions.find(a => a.id === selectedAvatar);
  const currentAvatarUrl = selectedAvatar ? getAvatarUrl(selectedAvatarData) : null;
  
  // Estado para el tiempo de último acceso
  const [lastAccessTime, setLastAccessTime] = useState("");

  // Función para calcular el tiempo transcurrido
  const calculateLastAccessTime = () => {
    try {
      const loginTime = localStorage.getItem('loginTime');
      if (!loginTime) return "Sin registrar";
      
      const loginDate = new Date(loginTime);
      const now = new Date();
      const diffMs = now - loginDate;
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);
      
      if (diffSecs < 60) return "Hace unos segundos";
      if (diffMins < 60) return `Hace ${diffMins} ${diffMins === 1 ? 'minuto' : 'minutos'}`;
      if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
      if (diffDays === 1) return "Ayer";
      if (diffDays < 30) return `Hace ${diffDays} días`;
      
      // Mostrar fecha exacta si es más antiguo
      return loginDate.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      console.error('Error calculando tiempo de acceso:', e);
      return "Sin registrar";
    }
  };

  // Actualizar tiempo de último acceso cuando el modal se abre
  useEffect(() => {
    if (showProfileModal) {
      setLastAccessTime(calculateLastAccessTime());
      // Actualizar cada 10 segundos
      const interval = setInterval(() => {
        setLastAccessTime(calculateLastAccessTime());
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [showProfileModal]);

  return (
    <>
      <div className="border-t border-gray-900 pt-3 md:pt-4 pb-2 md:pb-3 flex flex-col gap-2 md:gap-3">
        {/* Profile Button */}
        <button 
          onClick={() => setShowProfileModal(true)}
          className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-2 md:py-2.5 rounded-lg cursor-pointer hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30 group w-full"
        >
          <div className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 p-[1px] shrink-0 flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors overflow-hidden">
            {currentAvatarUrl ? (
              <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="font-bold text-xs md:text-sm text-cyan-400">{user?.name?.charAt(0)}</span>
            )}
          </div>
          <AnimatePresence mode="wait">
            {open && (
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.1, ease: "easeOut" }} className="flex flex-col min-w-0 text-left flex-1 hidden md:flex">
                <span className="text-sm font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{user?.name?.split(' ')[0]}</span>
                <span className="text-[10px] text-gray-500 truncate font-mono group-hover:text-cyan-400/70 transition-colors">{user?.role}</span>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Siempre mostrar en móvil */}
          <div className="flex flex-col min-w-0 text-left flex-1 md:hidden">
            <span className="text-xs font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{user?.name?.split(' ')[0]}</span>
            <span className="text-[7px] text-gray-500 truncate font-mono group-hover:text-cyan-400/70 transition-colors">{user?.role}</span>
          </div>
          {open && <Settings className="ml-auto text-gray-600 w-3 md:w-4 h-3 md:h-4 group-hover:text-cyan-400 transition-all duration-300 shrink-0 hidden md:block" />}
        </button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center justify-center gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded text-xs md:text-sm text-gray-500 hover:text-red-400 transition-all group"
          onClick={onLogout}
        >
          <LogOut size={14} className="shrink-0 md:w-4 md:h-4" />
          <AnimatePresence mode="wait">
            {open && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
                className="text-xs md:text-sm font-medium text-center hidden md:inline"
              >
                Cerrar Sesión
              </motion.span>
            )}
          </AnimatePresence>
          {/* Siempre mostrar en móvil */}
          <span className="text-xs font-medium text-center md:hidden">Salir</span>
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

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Correo</p>
                    <p className="text-sm text-gray-200 font-mono break-all">{user?.email || "admin@envyguard.com"}</p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors">
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
                    <span className="text-sm text-gray-300 font-mono flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      {lastAccessTime || "Cargando..."}
                    </span>
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

// --- COMPONENTE: MODAL DE REPORTE DE PROBLEMAS ---
const ReportProblemModal = ({ isOpen, onClose, selectedPC, selectedSala, onSubmit }) => {
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!description.trim() || description.length < 10) {
      alert('La descripción debe tener al menos 10 caracteres');
      return;
    }

    if (description.length > 500) {
      alert('La descripción no puede exceder 500 caracteres');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        description: description.trim(),
        severity,
        timestamp: new Date().toISOString(),
        device: selectedPC.id,
        ip: selectedPC.ip,
        sala: selectedSala,
        cpuCode: selectedPC.cpuCode
      });
      
      setDescription('');
      setSeverity('medium');
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !selectedPC) return null;

  const severityStyles = {
    low: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: '🟡 Baja' },
    medium: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', label: '🟠 Media' },
    high: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', label: '🔴 Alta' },
  };

  const styles = severityStyles[severity];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[150] p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-[#0f0f0f] border border-orange-500/30 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-900/20 to-transparent p-6 border-b border-white/5">
            <h3 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              <AlertCircle size={20} className="text-orange-400" />
              Reportar Problema
            </h3>
            <div className="mt-2 space-y-1 text-xs text-orange-400 font-mono">
              <p><strong>Sala:</strong> {selectedSala.replace('sala', 'Sala ')}</p>
              <p><strong>ID:</strong> {selectedPC.cpuCode}</p>
              <p><strong>IP:</strong> {selectedPC.ip}</p>
            </div>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Descripción */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Descripción del Problema</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe brevemente qué problema experimentas con este equipo..."
                disabled={isSubmitting}
                maxLength={500}
                className="w-full h-24 px-4 py-3 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder-gray-600 focus:border-orange-500/50 focus:bg-orange-900/10 outline-none transition-all resize-none disabled:opacity-50"
              />
              <div className="mt-1 text-xs text-gray-500 text-right">
                {description.length}/500 caracteres
              </div>
            </div>

            {/* Severidad */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Severidad</label>
              <div className="grid grid-cols-3 gap-2">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverity(level)}
                    className={`px-3 py-2 rounded-lg text-xs font-bold uppercase transition-all border ${
                      severity === level
                        ? `${severityStyles[level].bg} ${severityStyles[level].border} ${severityStyles[level].text}`
                        : 'border-white/10 bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    {severityStyles[level].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="bg-black/40 p-3 rounded-lg border border-white/5 text-xs text-gray-400 space-y-1">
              <p><strong>IP:</strong> {selectedPC.ip}</p>
              <p><strong>Hora:</strong> {new Date().toLocaleTimeString('es-ES')}</p>
            </div>

            {/* Botones */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 border border-gray-500/30 text-gray-300 rounded-lg hover:bg-gray-500/10 transition-colors disabled:opacity-50 text-sm font-bold"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || description.length < 10}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-50 text-sm font-bold flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <RotateCw size={14} className="animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <AlertCircle size={14} />
                    Reportar
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 h-full">
        
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

  // Configuración de Salas - DATOS COMPLETOS
  const salas = {
    sala1: {
      nombre: "Sala 1",
      stats: { total: 36, online: 34, power: "4.2kW" },
      layout: [
        // Columna A
        { 
          col: 1, 
          pcs: [
            { id: "s1-col1-pc1", status: "online", ip: "10.0.20.35", cpuCode: "0374" },
            { id: "s1-col1-pc2", status: "no_internet", ip: "10.0.20.34", cpuCode: "0371" },
            { id: "s1-col1-pc3", status: "online", ip: "10.0.20.24", cpuCode: "0368" },
            { id: "s1-col1-pc4", status: "offline", ip: "10.0.20.31", cpuCode: "0365" }
          ],
          paired: true,
          pairedCol: 2
        },
        // Columna B
        { 
          col: 2, 
          pcs: [
            { id: "s1-col2-pc1", status: "online", ip: "10.0.20.20", cpuCode: "0353" },
            { id: "s1-col2-pc2", status: "online", ip: "10.0.20.13", cpuCode: "0356" },
            { id: "s1-col2-pc3", status: "online", ip: "10.0.20.36", cpuCode: "0943" },
            { id: "s1-col2-pc4", status: "online", ip: "10.0.20.32", cpuCode: "0442" }
          ]
        },
        // Columna C
        { 
          col: 3, 
          pcs: [
            { id: "s1-col3-pc1", status: "online", ip: "10.0.20.12", cpuCode: "0350" },
            { id: "s1-col3-pc2", status: "online", ip: "10.0.20.39", cpuCode: "0347" },
            { id: "s1-col3-pc3", status: "no_internet", ip: "10.0.20.33", cpuCode: "0344" },
            { id: "s1-col3-pc4", status: "offline", ip: "10.0.20.43", cpuCode: "0341" }
          ],
          paired: true,
          pairedCol: 4
        },
        // Columna D
        { 
          col: 4, 
          pcs: [
            { id: "s1-col4-pc1", status: "online", ip: "10.0.20.41", cpuCode: "0329" },
            { id: "s1-col4-pc2", status: "online", ip: "10.0.20.42", cpuCode: "0332" },
            { id: "s1-col4-pc3", status: "online", ip: "10.0.20.17", cpuCode: "0335" },
            { id: "s1-col4-pc4", status: "online", ip: "10.0.20.37", cpuCode: "0338" }
          ]
        },
        // Columna E
        { 
          col: 5, 
          pcs: [
            { id: "s1-col5-pc1", status: "online", ip: "10.0.20.46", cpuCode: "0326" },
            { id: "s1-col5-pc2", status: "online", ip: "10.0.20.14", cpuCode: "0323" },
            { id: "s1-col5-pc3", status: "online", ip: "10.0.20.38", cpuCode: "0320" },
            { id: "s1-col5-pc4", status: "online", ip: "10.0.20.16", cpuCode: "0317" }
          ],
          paired: true,
          pairedCol: 6
        },
        // Columna F
        { 
          col: 6, 
          pcs: [
            { id: "s1-col6-pc1", status: "online", ip: "10.0.20.5", cpuCode: "0308" },
            { id: "s1-col6-pc2", status: "online", ip: "10.0.20.11", cpuCode: "0311" },
            { id: "s1-col6-pc3", status: "online", ip: "10.0.20.44", cpuCode: "0305" },
            { id: "s1-col6-pc4", status: "online", ip: "10.0.20.21", cpuCode: "0314" }
          ]
        },
        // Fila 1 (Horizontal) - 6 PCs
        { 
          row: 1, 
          pcs: [
            { id: "s1-row1-pc1", status: "online", ip: "10.0.20.19", cpuCode: "0377" },
            { id: "s1-row1-pc2", status: "online", ip: "10.0.20.53", cpuCode: "0380" },
            { id: "s1-row1-pc3", status: "online", ip: "10.0.20.49", cpuCode: "0363" },
            { id: "s1-row1-pc4", status: "online", ip: "10.0.20.9", cpuCode: "0386" },
            { id: "s1-row1-pc5", status: "online", ip: "10.0.20.52", cpuCode: "0389" },
            { id: "s1-row1-pc6", status: "online", ip: "10.0.20.51", cpuCode: "0392" }
          ]
        },
        // Fila 2 (Horizontal) - 6 PCs
        { 
          row: 2, 
          pcs: [
            { id: "s1-row2-pc1", status: "online", ip: "10.0.20.40", cpuCode: "0411" },
            { id: "s1-row2-pc2", status: "online", ip: "10.0.20.45", cpuCode: "0407" },
            { id: "s1-row2-pc3", status: "online", ip: "10.0.20.56", cpuCode: "0404" },
            { id: "s1-row2-pc4", status: "online", ip: "10.0.20.50", cpuCode: "0401" },
            { id: "s1-row2-pc5", status: "online", ip: "10.0.20.48", cpuCode: "0398" },
            { id: "s1-row2-pc6", status: "online", ip: "10.0.20.48", cpuCode: "0395" }
          ]
        }
      ]
    },
    salaAdicional: { 
      nombre: "Sala Adicional - Piso 1", 
      stats: { total: 18, online: 18, power: "1.8kW" }, 
      layout: [
        { 
          col: 1, 
          pcs: [
            { id: "sa-col1-pc1", status: "online", ip: "192.168.4.10", cpuCode: "0650" },
            { id: "sa-col1-pc2", status: "online", ip: "192.168.4.11", cpuCode: "0651" },
            { id: "sa-col1-pc3", status: "online", ip: "192.168.4.12", cpuCode: "0652" }
          ]
        },
        { 
          col: 2, 
          pcs: [
            { id: "sa-col2-pc1", status: "online", ip: "192.168.4.20", cpuCode: "0653" },
            { id: "sa-col2-pc2", status: "online", ip: "192.168.4.21", cpuCode: "0654" },
            { id: "sa-col2-pc3", status: "online", ip: "192.168.4.22", cpuCode: "0655" }
          ]
        },
        { 
          col: 3, 
          pcs: [
            { id: "sa-col3-pc1", status: "online", ip: "192.168.4.30", cpuCode: "0656" },
            { id: "sa-col3-pc2", status: "online", ip: "192.168.4.31", cpuCode: "0657" },
            { id: "sa-col3-pc3", status: "online", ip: "192.168.4.32", cpuCode: "0658" }
          ]
        },
        { 
          col: 4, 
          pcs: [
            { id: "sa-col4-pc1", status: "online", ip: "192.168.4.40", cpuCode: "0659" },
            { id: "sa-col4-pc2", status: "online", ip: "192.168.4.41", cpuCode: "0660" },
            { id: "sa-col4-pc3", status: "online", ip: "192.168.4.42", cpuCode: "0661" }
          ]
        },
        { 
          col: 5, 
          pcs: [
            { id: "sa-col5-pc1", status: "online", ip: "192.168.4.50", cpuCode: "0662" },
            { id: "sa-col5-pc2", status: "online", ip: "192.168.4.51", cpuCode: "0663" },
            { id: "sa-col5-pc3", status: "online", ip: "192.168.4.52", cpuCode: "0664" }
          ]
        },
        { 
          col: 6, 
          pcs: [
            { id: "sa-col6-pc1", status: "online", ip: "192.168.4.60", cpuCode: "0665" },
            { id: "sa-col6-pc2", status: "online", ip: "192.168.4.61", cpuCode: "0666" },
            { id: "sa-col6-pc3", status: "online", ip: "192.168.4.62", cpuCode: "0667" }
          ]
        }
      ]
    },
    sala2: {
      nombre: "Sala 2",
      stats: { total: 32, online: 32, power: "3.1kW" },
      layout: [
        { 
          izquierda: [
            { id: "s2-iz-pc1", status: "online", ip: "192.168.2.30", cpuCode: "0552" },
            { id: "s2-iz-pc2", status: "no_internet", ip: "192.168.2.31", cpuCode: "0551" },
            { id: "s2-iz-pc3", status: "online", ip: "192.168.2.32", cpuCode: "0546" },
            { id: "s2-iz-pc4", status: "offline", ip: "192.168.2.33", cpuCode: "0543" }
          ],
          derecha: [
            { id: "s2-der-pc1", status: "online", ip: "192.168.2.40", cpuCode: "0557" },
            { id: "s2-der-pc2", status: "online", ip: "192.168.2.41", cpuCode: "0584" },
            { id: "s2-der-pc3", status: "no_internet", ip: "192.168.2.42", cpuCode: "0581" },
            { id: "s2-der-pc4", status: "online", ip: "192.168.2.43", cpuCode: "0578" }
          ]
        },
        { 
          izquierda: [
            { id: "s2-iz2-pc1", status: "online", ip: "192.168.2.50", cpuCode: "0531" },
            { id: "s2-iz2-pc2", status: "online", ip: "192.168.2.51", cpuCode: "0534" },
            { id: "s2-iz2-pc3", status: "online", ip: "192.168.2.52", cpuCode: "0537" },
            { id: "s2-iz2-pc4", status: "online", ip: "192.168.2.53", cpuCode: "0564" }
          ],
          derecha: [
            { id: "s2-der2-pc1", status: "online", ip: "192.168.2.60", cpuCode: "0589" },
            { id: "s2-der2-pc2", status: "online", ip: "192.168.2.61", cpuCode: "0592" },
            { id: "s2-der2-pc3", status: "online", ip: "192.168.2.62", cpuCode: "0518" },
            { id: "s2-der2-pc4", status: "online", ip: "192.168.2.63", cpuCode: "0598" }
          ]
        },
        { 
          izquierda: [
            { id: "s2-iz3-pc1", status: "online", ip: "192.168.2.70", cpuCode: "0528" },
            { id: "s2-iz3-pc2", status: "online", ip: "192.168.2.71", cpuCode: "0525" },
            { id: "s2-iz3-pc3", status: "online", ip: "192.168.2.72", cpuCode: "0522" },
            { id: "s2-iz3-pc4", status: "online", ip: "192.168.2.73", cpuCode: "0540" }
          ],
          derecha: [
            { id: "s2-der3-pc1", status: "online", ip: "192.168.2.80", cpuCode: "0610" },
            { id: "s2-der3-pc2", status: "online", ip: "192.168.2.81", cpuCode: "0616" },
            { id: "s2-der3-pc3", status: "online", ip: "192.168.2.82", cpuCode: "0604" },
            { id: "s2-der3-pc4", status: "online", ip: "192.168.2.83", cpuCode: "0601" }
          ]
        },
        { 
          izquierda: [
            { id: "s2-iz4-pc1", status: "online", ip: "192.168.2.90", cpuCode: "0558" },
            { id: "s2-iz4-pc2", status: "online", ip: "192.168.2.91", cpuCode: "0561" },
            { id: "s2-iz4-pc3", status: "online", ip: "192.168.2.92", cpuCode: "0555" },
            { id: "s2-iz4-pc4", status: "online", ip: "192.168.2.93", cpuCode: "0480" }
          ],
          derecha: [
            { id: "s2-der4-pc1", status: "online", ip: "192.168.2.100", cpuCode: "0566" },
            { id: "s2-der4-pc2", status: "online", ip: "192.168.2.101", cpuCode: "0576" },
            { id: "s2-der4-pc3", status: "online", ip: "192.168.2.102", cpuCode: "0572" },
            { id: "s2-der4-pc4", status: "online", ip: "192.168.2.103", cpuCode: "0569" }
          ]
        }
      ]
    },
    salaAdicional2: { 
      nombre: "Sala Adicional - Piso 2", 
      stats: { total: 16, online: 16, power: "1.6kW" }, 
      layout: [
        { 
          col: 1, 
          pcs: [
            { id: "sa2-col1-pc1", status: "online", ip: "192.168.5.10", cpuCode: "0670" },
            { id: "sa2-col1-pc2", status: "online", ip: "192.168.5.11", cpuCode: "0671" },
            { id: "sa2-col1-pc3", status: "online", ip: "192.168.5.12", cpuCode: "0672" },
            { id: "sa2-col1-pc4", status: "online", ip: "192.168.5.13", cpuCode: "0673" }
          ]
        },
        { 
          col: 2, 
          pcs: [
            { id: "sa2-col2-pc1", status: "online", ip: "192.168.5.20", cpuCode: "0674" },
            { id: "sa2-col2-pc2", status: "online", ip: "192.168.5.21", cpuCode: "0675" },
            { id: "sa2-col2-pc3", status: "online", ip: "192.168.5.22", cpuCode: "0676" },
            { id: "sa2-col2-pc4", status: "online", ip: "192.168.5.23", cpuCode: "0677" }
          ]
        },
        { 
          col: 3, 
          pcs: [
            { id: "sa2-col3-pc1", status: "online", ip: "192.168.5.30", cpuCode: "0678" },
            { id: "sa2-col3-pc2", status: "online", ip: "192.168.5.31", cpuCode: "0679" },
            { id: "sa2-col3-pc3", status: "online", ip: "192.168.5.32", cpuCode: "0680" },
            { id: "sa2-col3-pc4", status: "online", ip: "192.168.5.33", cpuCode: "0681" }
          ]
        },
        { 
          col: 4, 
          pcs: [
            { id: "sa2-col4-pc1", status: "online", ip: "192.168.5.40", cpuCode: "0682" },
            { id: "sa2-col4-pc2", status: "online", ip: "192.168.5.41", cpuCode: "0683" },
            { id: "sa2-col4-pc3", status: "online", ip: "192.168.5.42", cpuCode: "0684" },
            { id: "sa2-col4-pc4", status: "online", ip: "192.168.5.43", cpuCode: "0685" }
          ]
        }
      ]
    },
    sala3: { 
      nombre: "Sala 3", 
      stats: { total: 38, online: 36, power: "3.2kW" }, 
      layout: [
        { 
          izquierda: [
            { id: "s3-iz-pc1", status: "online", ip: "192.168.1.30", cpuCode: "0821" },
            { id: "s3-iz-pc2", status: "online", ip: "192.168.1.31", cpuCode: "0824" },
            { id: "s3-iz-pc3", status: "online", ip: "192.168.1.32", cpuCode: "0827" },
            { id: "s3-iz-pc4", status: "online", ip: "192.168.1.33", cpuCode: "0830" }
          ],
          derecha: [
            { id: "s3-der-pc1", status: "online", ip: "192.168.1.40", cpuCode: "0769" },
            { id: "s3-der-pc2", status: "online", ip: "192.168.1.41", cpuCode: "0465" },
            { id: "s3-der-pc3", status: "online", ip: "192.168.1.42", cpuCode: "0833" },
            { id: "s3-der-pc4", status: "online", ip: "192.168.1.43", cpuCode: "0715" }
          ]
        },
        { 
          izquierda: [
            { id: "s3-iz2-pc1", status: "online", ip: "192.168.1.50", cpuCode: "0775" },
            { id: "s3-iz2-pc2", status: "online", ip: "192.168.1.51", cpuCode: "0778" },
            { id: "s3-iz2-pc3", status: "online", ip: "192.168.1.52", cpuCode: "0781" },
            { id: "s3-iz2-pc4", status: "online", ip: "192.168.1.53", cpuCode: "0784" }
          ],
          derecha: [
            { id: "s3-der2-pc1", status: "online", ip: "192.168.1.60", cpuCode: "0712" },
            { id: "s3-der2-pc2", status: "online", ip: "192.168.1.61", cpuCode: "0790" },
            { id: "s3-der2-pc3", status: "online", ip: "192.168.1.62", cpuCode: "0793" },
            { id: "s3-der2-pc4", status: "online", ip: "192.168.1.63", cpuCode: "0772" }
          ]
        },
        { 
          izquierda: [
            { id: "s3-iz3-pc1", status: "online", ip: "192.168.1.70", cpuCode: "0806" },
            { id: "s3-iz3-pc2", status: "online", ip: "192.168.1.71", cpuCode: "0803" },
            { id: "s3-iz3-pc3", status: "online", ip: "192.168.1.72", cpuCode: "0800" },
            { id: "s3-iz3-pc4", status: "online", ip: "192.168.1.73", cpuCode: "0796" }
          ],
          derecha: [
            { id: "s3-der3-pc1", status: "online", ip: "192.168.1.80", cpuCode: "0812" },
            { id: "s3-der3-pc2", status: "online", ip: "192.168.1.81", cpuCode: "0815" },
            { id: "s3-der3-pc3", status: "online", ip: "192.168.1.82", cpuCode: "0818" },
            { id: "s3-der3-pc4", status: "online", ip: "192.168.1.83", cpuCode: "0809" }
          ]
        },
        { 
          izquierda: [
            { id: "s3-iz4-pc1", status: "online", ip: "192.168.1.90", cpuCode: "0763" },
            { id: "s3-iz4-pc2", status: "online", ip: "192.168.1.91", cpuCode: "0766" },
            { id: "s3-iz4-pc3", status: "online", ip: "192.168.1.92", cpuCode: "0759" },
            { id: "s3-iz4-pc4", status: "online", ip: "192.168.1.93", cpuCode: "0787" }
          ],
          derecha: [
            { id: "s3-der4-pc1", status: "online", ip: "192.168.1.100", cpuCode: "0996" },
            { id: "s3-der4-pc2", status: "online", ip: "192.168.1.101", cpuCode: "0993" },
            { id: "s3-der4-pc3", status: "online", ip: "192.168.1.102", cpuCode: "0990" },
            { id: "s3-der4-pc4", status: "online", ip: "192.168.1.103", cpuCode: "0787" }
          ]
        },
        { 
          izquierda: [
            { id: "s3-iz5-pc1", status: "online", ip: "192.168.1.110", cpuCode: "0860" },
            { id: "s3-iz5-pc2", status: "online", ip: "192.168.1.111", cpuCode: "0718" },
            { id: "s3-iz5-pc3", status: "online", ip: "192.168.1.112", cpuCode: "0766" }
          ],
          derecha: [
            { id: "s3-der5-pc1", status: "online", ip: "192.168.1.120", cpuCode: "0934" },
            { id: "s3-der5-pc2", status: "online", ip: "192.168.1.121", cpuCode: "0931" },
            { id: "s3-der5-pc3", status: "online", ip: "192.168.1.122", cpuCode: "0928" }
          ]
        }
      ] 
    },
    sala4: { 
      nombre: "Sala 4", 
      stats: { total: 25, online: 24, power: "2.5kW" }, 
      layout: [
        { 
          izquierda: [
            { id: "s4-iz-pc1", status: "online", ip: "192.168.4.30", cpuCode: "O697" },
            { id: "s4-iz-pc2", status: "no_internet", ip: "192.168.4.31", cpuCode: "O700" },
            { id: "s4-iz-pc3", status: "online", ip: "192.168.4.32", cpuCode: "O703" },
            { id: "s4-iz-pc4", status: "offline", ip: "192.168.4.33", cpuCode: "O706" }
          ],
          derecha: [
            { id: "s4-der-pc1", status: "online", ip: "192.168.4.40", cpuCode: "O622" },
            { id: "s4-der-pc2", status: "online", ip: "192.168.4.41", cpuCode: "O619" },
            { id: "s4-der-pc3", status: "online", ip: "192.168.4.42", cpuCode: "O616" },
            { id: "s4-der-pc4", status: "online", ip: "192.168.4.43", cpuCode: "O613" }
          ]
        },
        { 
          izquierda: [
            { id: "s4-iz2-pc1", status: "online", ip: "192.168.4.50", cpuCode: "O694" },
            { id: "s4-iz2-pc2", status: "online", ip: "192.168.4.51", cpuCode: "O691" },
            { id: "s4-iz2-pc3", status: "online", ip: "192.168.4.52", cpuCode: "O688" },
            { id: "s4-iz2-pc4", status: "online", ip: "192.168.4.53", cpuCode: "O685" }
          ],
          derecha: [
            { id: "s4-der2-pc1", status: "online", ip: "192.168.4.60", cpuCode: "O625" },
            { id: "s4-der2-pc2", status: "online", ip: "192.168.4.61", cpuCode: "O628" },
            { id: "s4-der2-pc3", status: "online", ip: "192.168.4.62", cpuCode: "O631" },
            { id: "s4-der2-pc4", status: "online", ip: "192.168.4.63", cpuCode: "O634" }
          ]
        },
        { 
          izquierda: [
            { id: "s4-iz3-pc1", status: "online", ip: "192.168.4.70", cpuCode: "O673" },
            { id: "s4-iz3-pc2", status: "online", ip: "192.168.4.71", cpuCode: "O676" },
            { id: "s4-iz3-pc3", status: "online", ip: "192.168.4.72", cpuCode: "O679" },
            { id: "s4-iz3-pc4", status: "online", ip: "192.168.4.73", cpuCode: "O682" }
          ],
          derecha: [
            { id: "s4-der3-pc1", status: "online", ip: "192.168.4.80", cpuCode: "O646" },
            { id: "s4-der3-pc2", status: "online", ip: "192.168.4.81", cpuCode: "O643" },
            { id: "s4-der3-pc3", status: "online", ip: "192.168.4.82", cpuCode: "O640" },
            { id: "s4-der3-pc4", status: "online", ip: "192.168.4.83", cpuCode: "O637" }
          ]
        },
        { 
          izquierda: [
            { id: "s4-iz4-pc1", status: "online", ip: "192.168.4.90", cpuCode: "O670" },
            { id: "s4-iz4-pc2", status: "online", ip: "192.168.4.91", cpuCode: "O667" },
            { id: "s4-iz4-pc3", status: "online", ip: "192.168.4.92", cpuCode: "O664" },
            { id: "s4-iz4-pc4", status: "online", ip: "192.168.4.93", cpuCode: "O661" }
          ],
          derecha: [
            { id: "s4-der4-pc1", status: "online", ip: "192.168.4.100", cpuCode: "O492" },
            { id: "s4-der4-pc2", status: "online", ip: "192.168.4.101", cpuCode: "O450" },
            { id: "s4-der4-pc3", status: "online", ip: "192.168.4.102", cpuCode: "O655" },
            { id: "s4-der4-pc4", status: "online", ip: "192.168.4.103", cpuCode: "O658" }
          ]
        }
      ] 
    }
  };

  const handleReportSubmit = (reportData) => {
    const location = getLocationFromPC(reportData.device, reportData.sala);
    const newReport = {
      id: Math.random().toString(36).substr(2, 9),
      ...reportData,
      displayTimestamp: new Date(reportData.timestamp).toLocaleString('es-ES'),
      status: 'open',
      type: 'Reporte',
      sector: location.sector,
      ubicacion: location.ubicacion,
      posicion: location.posicion
    };
    setProblemReports(prev => [newReport, ...prev]);
    setShowReportModal(false);
    setSelectedPCForReport(null);
    setToast({ type: 'success', msg: `Problema reportado en ${reportData.device}` });
  };

  const handleAction = async (action, pcId, ip) => {
    // Si la acción es reportar problema, abre el modal
    if (action === 'report') {
      setSelectedPCForReport({ id: pcId, ip });
      setShowReportModal(true);
      setSelectedPC(null);
      return;
    }

    // Si la acción es instalar apps, abre el modal de despliegue
    if (action === 'install') {
      setDeployTargetPCs([{ id: pcId, ip }]);
      setShowDeployModal(true);
      setSelectedPC(null);
      return;
    }

    setActionLoading(`${pcId}-${action}`);
    try {
      await deviceService.sendCommand(pcId, action, ip ? { ip } : {});
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
        items.map(({ id, ip }) => deviceService.sendCommand(id, action, ip ? { ip } : {}))
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

    // Determinar color del indicador según estado
    const getStatusColor = () => {
      if (effectiveStatus === "online") return { bg: "bg-green-500", border: "border-green-500/20", hover: "hover:border-green-500/50 hover:bg-green-500/10 hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]", dotColor: "bg-green-500" };
      if (effectiveStatus === "no_internet") return { bg: "bg-yellow-500", border: "border-yellow-500/20", hover: "hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)]", dotColor: "bg-yellow-500" };
      return { bg: "bg-red-500", border: "border-red-500/20", hover: "hover:border-red-500/50 hover:bg-red-500/10 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]", dotColor: "bg-red-500" };
    };

    const statusStyle = getStatusColor();
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
        className={`group relative p-3 rounded-lg border cursor-pointer transition-all flex-shrink-0 backdrop-blur-sm min-w-[120px] ${statusStyle.border} ${statusStyle.hover} ${statusStyle.bg}/5 ${isSelected ? "ring-2 ring-cyan-400/60" : ""}`}
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
            <div className={`w-2 h-2 rounded-full ${statusStyle.dotColor} z-10 relative`} />
            <div className={`absolute inset-0 w-2 h-2 rounded-full ${statusStyle.dotColor} ${effectiveStatus !== "offline" ? "animate-ping" : ""}`} />
          </div>
          <span className="text-xs font-mono text-gray-200 font-bold tracking-tight">{pc.id.split('-').pop().toUpperCase()}</span>
        </div>
        {pc.cpuCode && (
          <div className="text-[10px] font-mono text-gray-400">{pc.cpuCode}</div>
        )}
        <div className="text-[10px] text-gray-500 font-mono group-hover:text-cyan-400 transition-colors">{pc.ip}</div>
        {override?.latencyMs !== undefined && (
          <div className="mt-1 text-[10px] font-mono text-gray-600">{override.latencyMs} ms</div>
        )}
      </motion.div>
    );
  };

  // Función para obtener la ubicación completa del PC basándose en los mapas de las salas
  const getLocationFromPC = (pcId, sala) => {
    const salaData = salas[sala];
    if (!salaData) return { sector: 'Desconocido', ubicacion: 'No disponible' };

    // Buscar en el layout de la sala
    for (const section of salaData.layout) {
      for (const pc of section.pcs) {
        if (pc.id === pcId) {
          let sectorName = '';
          if (section.col) {
            const colLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
            sectorName = `Columna ${colLetters[section.col - 1] || section.col}`;
          } else if (section.row) {
            sectorName = `Fila ${section.row}`;
          }
          
          // Determinar la posición dentro del sector (1, 2, 3, 4...)
          const posInSector = section.pcs.indexOf(pc) + 1;
          
          return {
            sector: sectorName,
            posicion: posInSector,
            ubicacion: `${sectorName} - Posición ${posInSector}`
          };
        }
      }
    }

    return { sector: 'Desconocido', ubicacion: 'No disponible' };
  };

  const currentRoom = salas[selectedSala] || salas.sala1;

  // Cargar dispositivos desde API y poblar overrides por IP
  useEffect(() => {
    let cancelled = false;
    const fetchDevices = async () => {
      setLoadingDevices(true);
      try {
        const data = await deviceService.getDevices();
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
              const isSingleColumn = selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2';
              if (isSingleColumn) {
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
              selectedList.size > 0 && (selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2'
                ? currentRoom.layout.every(col => !col.pcs || col.pcs.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                : currentRoom.layout.every(fila => 
                    (!fila.izquierda || fila.izquierda.every(pc => Array.from(selectedList).some(s => s.id === pc.id))) &&
                    (!fila.derecha || fila.derecha.every(pc => Array.from(selectedList).some(s => s.id === pc.id)))
                  ))
                ? 'border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'border-blue-500/40 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20'
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
              if (isSingleColumn) {
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
          {(selectedSala === 'sala1' || selectedSala === 'salaAdicional' || selectedSala === 'salaAdicional2') ? (
            <div className="space-y-6 md:space-y-12 flex flex-col items-center w-full">
              {/* 3 Pares de Columnas Verticales - Responsivas */}
              <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 w-full flex-wrap md:flex-nowrap">
                {/* Grupo 1 */}
                <div className="flex gap-1 w-full md:w-auto justify-center">
                  {currentRoom.layout.slice(0, 2).map((col, idx) => (
                    <div key={idx} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(65 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
                </div>
                
                {/* Grupo 2 */}
                <div className="flex gap-1 w-full md:w-auto justify-center">
                  {currentRoom.layout.slice(2, 4).map((col, idx) => (
                    <div key={idx + 2} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(67 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
                </div>
                
                {/* Grupo 3 */}
                <div className="flex gap-1 w-full md:w-auto justify-center">
                  {currentRoom.layout.slice(4, 6).map((col, idx) => (
                    <div key={idx + 4} className="flex flex-col gap-2 md:gap-4 p-3 md:p-6 rounded-xl bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-colors">
                      <div className="text-[9px] md:text-[10px] text-cyan-500 font-mono text-center uppercase tracking-wider mb-1 md:mb-2">COL-{String.fromCharCode(69 + idx)}</div>
                      {col.pcs && col.pcs.map(pc => <PCCard key={pc.id} pc={pc} />)}
                    </div>
                  ))}
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
                  { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                  { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: true },
                  { id: 'logs', label: 'Ver Logs', icon: FileText, color: 'hover:bg-gray-500/20 hover:text-gray-300', span: true },
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
                        handleAction(action.id, selectedPC.id, selectedPC.ip);
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
              <div className="p-3 md:p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-2 md:gap-3">
                {[
                  { id: 'power', label: 'Apagar', icon: Power, color: 'hover:bg-red-500/20 hover:text-red-400', span: false },
                  { id: 'start', label: 'Encender (WOL)', icon: Zap, color: 'hover:bg-green-500/20 hover:text-green-400', span: false },
                  { id: 'restart', label: 'Reiniciar', icon: RotateCw, color: 'hover:bg-blue-500/20 hover:text-blue-400', span: false },
                  { id: 'format', label: 'Limpiar', icon: HardDrive, color: 'hover:bg-yellow-500/20 hover:text-yellow-400', span: false },
                  { id: 'install', label: 'Instalar Apps', icon: Package, color: 'hover:bg-purple-500/20 hover:text-purple-400', span: true },
                  { id: 'logs', label: 'Ver Logs', icon: FileText, color: 'hover:bg-gray-500/20 hover:text-gray-300', span: true },
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
    </div>
  );
};

// 3. USERS SECTION
const CreateUsersSection = ({ avatarOptions, getAvatarUrl }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newUserAvatarId, setNewUserAvatarId] = useState(1);
  const [roleFilter, setRoleFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = useState(true);
  
  // Estado para el formulario
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OPERATOR'
  });

  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showMoreOptions, setShowMoreOptions] = useState(null);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  // Traer usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      setIsFetchingUsers(true);
      try {
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';
        const token = localStorage.getItem('authToken');
        
        console.log('🔍 Intentando traer usuarios de:', `${API_BASE_URL}/auth/users`);
        console.log('📌 Token presente:', token ? '✅' : '❌');

        const response = await fetch(`${API_BASE_URL}/auth/users`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('📊 Respuesta status:', response.status);
        console.log('📊 Content-Type:', response.headers.get('content-type'));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Respuesta error:', errorText);
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        let data;
        
        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          const text = await response.text();
          console.error('❌ Respuesta no es JSON:', text.substring(0, 200));
          throw new Error('La respuesta del servidor no es JSON válido');
        }

        console.log('✅ Usuarios traídos de la API:', data);

        // Mapear los usuarios de la API a la estructura de la tabla
        const mappedUsers = Array.isArray(data) ? data.map((user, index) => ({
          id: user.id || index + 1,
          name: `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim() || 'Usuario sin nombre',
          email: user.email || '',
          role: user.role || user.rol || 'ADMIN', // Rol por defecto es ADMIN
          status: user.enabled === false ? 'Inactivo' : 'Activo',
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          avatarId: (index % 8) + 1, // Distribuir avatares entre los usuarios
        })) : [];

        console.log('✅ Usuarios mapeados:', mappedUsers);
        setUsers(mappedUsers);
      } catch (error) {
        console.error('❌ Error completo al traer usuarios:', error);
        setToast({ type: 'error', msg: `Error al cargar usuarios: ${error.message}` });
        setUsers([]); // Mostrar lista vacía en caso de error
      } finally {
        setIsFetchingUsers(false);
      }
    };

    fetchUsers();
  }, []); // Se ejecuta una sola vez al montar el componente
  
  // Validar formulario
  const validateForm = () => {
    // Validación para CREAR nuevo usuario (todos los campos obligatorios)
    if (!editingUser) {
      if (!formData.firstName.trim()) {
        setToast({ type: 'warn', msg: 'El nombre es requerido' });
        return false;
      }
      if (!formData.lastName.trim()) {
        setToast({ type: 'warn', msg: 'El apellido es requerido' });
        return false;
      }
      if (!formData.email.trim() || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setToast({ type: 'warn', msg: 'Email válido es requerido' });
        return false;
      }
      if (!formData.password || formData.password.length < 8) {
        setToast({ type: 'warn', msg: 'La contraseña debe tener al menos 8 caracteres' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setToast({ type: 'warn', msg: 'Las contraseñas no coinciden' });
        return false;
      }
      return true;
    }

    // Validación para EDITAR usuario (todos opcionales)
    // Si el usuario proporciona email, validar formato
    if (formData.email.trim() && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setToast({ type: 'warn', msg: 'Email inválido' });
      return false;
    }

    // Si cambio la contraseña, debe cumplir con requisitos
    if (formData.password && formData.password.trim().length > 0) {
      if (formData.password.length < 8) {
        setToast({ type: 'warn', msg: 'La contraseña debe tener al menos 8 caracteres' });
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setToast({ type: 'warn', msg: 'Las contraseñas no coinciden' });
        return false;
      }
    }
    // Si no cambio contraseña, no hay validación de contraseña
    return true;
  };

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Crear usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Si estamos editando, llamar a la función de actualización
    if (editingUser) {
      return handleSaveUserChanges(e);
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // 1. Crear usuario en el backend
      const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
      });

      console.log('✅ Usuario creado desde servidor:', response);

      // 2. Obtener la lista actualizada de usuarios para tener el ID real
      try {
        const allUsers = await userService.getAllUsers();
        console.log('📋 Lista de usuarios actualizada, total:', allUsers.length);
        
        // 3. Encontrar el usuario recién creado por email
        const createdUser = allUsers.find(u => u.email === formData.email);
        
        if (createdUser) {
          console.log('✅ Usuario creado encontrado en lista:', createdUser);
          
          // Crear objeto para la UI
          const newUser = {
            id: createdUser.id,
            name: `${createdUser.firstName} ${createdUser.lastName}`,
            email: createdUser.email,
            role: createdUser.role,
            enabled: createdUser.enabled !== undefined ? createdUser.enabled : true,
            status: createdUser.enabled ? 'Activo' : 'Inactivo',
            createdAt: createdUser.createdAt ? createdUser.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            avatarId: newUserAvatarId,
          };
          
          setUsers([...users, newUser]);
        } else {
          console.warn('⚠️ No se encontró el usuario creado en la lista, agregando con datos temporales');
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),  // ID temporal único
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            enabled: true,
            status: 'Activo',
            createdAt: new Date().toISOString().split('T')[0],
            avatarId: newUserAvatarId,
          };
          setUsers([...users, newUser]);
        }
      } catch (err) {
        console.error('❌ Error al obtener lista de usuarios:', err.message);
        // Fallback si no se puede obtener la lista
        const newUser = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          role: formData.role,
          enabled: true,
          status: 'Activo',
          createdAt: new Date().toISOString().split('T')[0],
          avatarId: newUserAvatarId,
        };
        setUsers([...users, newUser]);
      }

      setToast({ type: 'success', msg: 'Usuario creado exitosamente' });
      
      // Limpiar formulario
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'OPERATOR'
      });
      setNewUserAvatarId(1);
      setShowForm(false);
    } catch (error) {
      const errorMsg = error.message || 'Error al crear usuario';
      setToast({ type: 'error', msg: errorMsg });
      console.error('❌ Error al crear usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ').slice(1).join(' '),
      email: user.email,
      password: '',
      confirmPassword: '',
      role: user.role
    });
    setShowForm(true);
  };

  // Función para guardar cambios de usuario (actualizar)
  const handleSaveUserChanges = async (e) => {
    e.preventDefault();
    
    if (!editingUser) {
      // Si no hay usuario en edición, es crear nuevo
      return handleCreateUser(e);
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      console.log(`🔄 Actualizando usuario ${editingUser.id}...`);

      // Construir payload con TODOS los campos requeridos por PUT
      const payload = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        role: formData.role || 'OPERATOR',
        enabled: editingUser.enabled !== undefined ? editingUser.enabled : true
      };

      // Solo agregar password si se cambió
      if (formData.password && formData.password.trim().length > 0) {
        payload.password = formData.password;
      }

      console.log('📦 Payload enviando:', JSON.stringify(payload, null, 2));

      // Usar userService para actualizar
      const updatedUser = await userService.updateUser(editingUser.id, payload);
      console.log('✅ Usuario actualizado:', updatedUser);

      // Actualizar en la lista local
      setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role
      } : u));

      setToast({ type: 'success', msg: 'Usuario actualizado exitosamente' });
      clearForm();
      setShowForm(false);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      setToast({ type: 'error', msg: `Error al actualizar: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar usuario
  const handleDeleteUser = async (userId) => {
    setShowDeleteConfirm(null);
    setIsLoading(true);
    try {
      console.log(`🗑️ Eliminando usuario ${userId}...`);

      // Usar el servicio userService que ya maneja todo
      await userService.deleteUser(userId);

      console.log('✅ Usuario eliminado');
      setUsers(users.filter(u => u.id !== userId));
      setToast({ type: 'success', msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
      console.error('❌ Error al eliminar usuario:', error);
      setToast({ type: 'error', msg: `Error al eliminar usuario: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Función para desactivar/activar usuario
  const handleToggleStatus = async (userId, currentStatus) => {
    setShowMoreOptions(null);
    setIsLoading(true);
    try {
      const newEnabled = currentStatus === 'Activo' ? false : true;

      console.log(`🔄 Cambiando estado del usuario ${userId} a enabled=${newEnabled}...`);

      // Usar el servicio userService que ya maneja todo
      await userService.toggleUserStatus(userId, newEnabled);

      console.log('✅ Estado actualizado en la API');
      
      // Actualizar localmente y refrescar desde la API
      setUsers(users.map(u => u.id === userId ? { ...u, status: newEnabled ? 'Activo' : 'Inactivo' } : u));
      
      // Refrescar la lista de usuarios desde la API para asegurar sincronización
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/auth/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        const mappedUsers = Array.isArray(data) ? data.map((user, index) => ({
          id: user.id || index + 1,
          name: `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim() || 'Usuario sin nombre',
          email: user.email || '',
          role: user.role || user.rol || 'ADMIN',
          status: user.enabled === false ? 'Inactivo' : 'Activo',
          createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          avatarId: (index % 8) + 1,
        })) : [];
        setUsers(mappedUsers);
      }
      
      const newStatus = newEnabled ? 'Activo' : 'Inactivo';
      setToast({ type: 'success', msg: `Usuario marcado como ${newStatus}` });
    } catch (error) {
      console.error('❌ Error al cambiar estado:', error);
      setToast({ type: 'error', msg: `Error al cambiar estado: ${error.message}` });
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar formulario
  const clearForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'OPERATOR'
    });
    setEditingUser(null);
    setShowRoleDropdown(false);
  };

  // Filter logic
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Toast Reutilizable */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header with improved styling */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 pb-4 md:pb-6 border-b border-white/5">
        <div>
           <div className="flex items-start sm:items-center gap-2 md:gap-3">
                <div className="p-2 md:p-2.5 bg-cyan-500/10 rounded-lg border border-cyan-500/20 shrink-0">
                    <UserPlus className="text-cyan-400" size={20} />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Gestión de Accesos</h2>
                    <p className="text-gray-500 text-xs md:text-sm font-sans">Control de credenciales y privilegios.</p>
                </div>
           </div>
        </div>
        <button 
          onClick={() => {
            if (showForm) {
              clearForm();
            } else {
              // Resetear completamente el estado cuando se abre nuevo usuario
              setEditingUser(null);
              setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'OPERATOR'
              });
              setNewUserAvatarId(1);
              setShowRoleDropdown(false);
            }
            setShowForm(!showForm);
          }}
          className="group relative px-3 md:px-5 py-2 md:py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 text-xs md:text-sm overflow-hidden w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          <span className="relative z-10 flex items-center gap-2">
            {showForm ? <ChevronDown size={16} /> : <UserPlus size={16} />}
            <span className="hidden sm:inline">{showForm ? "Cerrar Panel" : "Nuevo Usuario"}</span>
            <span className="sm:hidden">{showForm ? "Cerrar" : "Nuevo"}</span>
          </span>
          {/* Shine Effect */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12" />
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            {/* Overlay - Cubre toda la pantalla y centra */}
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => {
                clearForm();
                setShowForm(false);
              }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
            />
            {/* Modal - Centrado como el del perfil */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
            >
              <div className={`bg-[#0a0a0a] rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden max-h-[95vh] pointer-events-auto border ${
                editingUser ? 'border-yellow-500/30' : 'border-cyan-500/30'
              }`}
              >
              <div className="p-8 md:p-10 relative overflow-y-auto max-h-[95vh] custom-scrollbar">
               {/* Decorative bg */}
               <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] pointer-events-none ${
                 editingUser ? 'bg-yellow-500/5' : 'bg-cyan-500/5'
               }`} />
               
               {/* Close Button */}
               <motion.button
                 onClick={() => {
                   clearForm();
                   setShowForm(false);
                 }}
                 className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all z-50"
                 whileHover={{ scale: 1.1 }}
                 whileTap={{ scale: 0.95 }}
               >
                 <X size={20} />
               </motion.button>
               
               <h3 className={`font-mono text-sm md:text-base font-bold uppercase tracking-widest mb-6 flex items-center gap-3 relative z-10 ${
                 editingUser ? 'text-yellow-400' : 'text-cyan-400'
               }`}>
                   {editingUser ? <Edit2 size={16}/> : <UserPlus size={16}/> } {editingUser ? 'EDITAR CREDENCIAL DE ACCESO' : 'NUEVA CREDENCIAL DE ACCESO'}
               </h3>
               
               <form onSubmit={editingUser ? handleSaveUserChanges : handleCreateUser} className="flex flex-col gap-5 md:gap-6 relative z-10">
                 {/* Avatar y Datos Principales */}
                 <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
                    {/* Avatar Selection - Solo para Nuevo Usuario */}
                    {!editingUser && (
                      <div className="shrink-0">
                          <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2.5 uppercase tracking-wide font-semibold">Avatar</label>
                          <div className="w-28 h-28 rounded-xl border-2 border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 p-2 relative overflow-hidden group hover:border-cyan-500/60 transition-colors">
                              <img 
                                  src={getAvatarUrl(avatarOptions.find(a => a.id === newUserAvatarId))} 
                                  alt="avatar preview" 
                                  className="w-full h-full rounded-lg object-cover" 
                              />
                              <button 
                                  type="button"
                                  onClick={() => setNewUserAvatarId(prev => prev >= 8 ? 1 : prev + 1)}
                                  disabled={isLoading}
                                  className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-white cursor-pointer disabled:opacity-50"
                              >
                                  CAMBIAR
                              </button>
                          </div>
                      </div>
                    )}

                    <div className={`flex-1 grid gap-4 md:gap-5 w-full ${editingUser ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                        <div>
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">Nombre</label>
                            <input 
                              type="text" 
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              placeholder="Ej: Juan" 
                              disabled={isLoading}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">Apellido</label>
                            <input 
                              type="text" 
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              placeholder="Ej: Pérez" 
                              disabled={isLoading}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">Correo Electrónico</label>
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="usuario@envyguard.com" 
                              disabled={isLoading}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">Rol de Usuario</label>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20 flex items-center justify-between"
                                disabled={isLoading}
                              >
                                <span>{formData.role || 'Seleccionar rol...'}</span>
                                <ChevronDown 
                                  size={16} 
                                  className={`transition-transform ${showRoleDropdown ? 'rotate-180' : ''}`}
                                />
                              </button>
                              <AnimatePresence>
                                {showRoleDropdown && (
                                  <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50 overflow-hidden"
                                  >
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, role: 'ADMIN' });
                                        setShowRoleDropdown(false);
                                      }}
                                      className="w-full px-4 py-2.5 text-sm text-white hover:bg-cyan-600/20 hover:text-cyan-400 text-left transition-colors border-b border-white/5"
                                    >
                                      ADMIN
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormData({ ...formData, role: 'OPERATOR' });
                                        setShowRoleDropdown(false);
                                      }}
                                      className="w-full px-4 py-2.5 text-sm text-white hover:bg-purple-600/20 hover:text-purple-400 text-left transition-colors"
                                    >
                                      OPERATOR
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                        </div>
                    </div>
                 </div>

                 {/* Separador */}
                 <div className="border-t border-white/10" />

                 {/* Credenciales de Seguridad */}
                 <div>
                    <h4 className="text-xs md:text-sm font-mono text-cyan-400 mb-4 uppercase tracking-wide font-semibold flex items-center gap-2">
                        <Lock size={14} /> Credenciales de Seguridad
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div>
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                              Contraseña 
                              {editingUser ? (
                                <span className="text-yellow-400 ml-1">(Opcional)</span>
                              ) : (
                                <span className="text-cyan-400 ml-1">(Mínimo 8 caracteres)</span>
                              )}
                            </label>
                            <input 
                              type="password" 
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder={editingUser ? "Dejar vacío para no cambiar" : "••••••••••••"} 
                              disabled={isLoading}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs md:text-sm font-mono text-gray-500 mb-2 uppercase tracking-wide font-semibold">
                              Confirmar Contraseña
                              {editingUser && formData.password && (
                                <span className="text-yellow-400 ml-1">(Requerido si cambias contraseña)</span>
                              )}
                            </label>
                            <input 
                              type="password" 
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              placeholder={editingUser ? "Dejar vacío para no cambiar" : "••••••••••••"} 
                              disabled={isLoading}
                              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-cyan-500 focus:bg-cyan-900/10 outline-none transition-all disabled:opacity-50 hover:border-white/20" 

                            />
                        </div>
                    </div>
                 </div>

                 {/* Separador */}
                 <div className="border-t border-white/10" />
                 
                 {/* Botones de Acción */}
                 <div className="flex flex-col-reverse sm:flex-row justify-end gap-4">
                    <motion.button 
                        type="button" 
                        onClick={() => {
                          setShowForm(false);
                          clearForm();
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                        className="px-6 py-2.5 text-xs md:text-sm font-bold uppercase tracking-wider rounded-lg border-2 border-red-500/40 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all disabled:opacity-50"
                    >
                        CANCELAR
                    </motion.button>
                    <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.08, y: -3 }}
                        whileTap={{ scale: 0.92 }}
                        disabled={isLoading}
                        className="px-8 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 border-2 border-cyan-400/50 hover:border-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                        {isLoading ? (
                          <>
                            <RotateCw size={16} className="animate-spin" />
                            {editingUser ? 'GUARDANDO...' : 'CREANDO USUARIO...'}
                          </>
                        ) : (
                          <>
                            {editingUser ? <Edit2 size={16} /> : <UserPlus size={16} />}
                            {editingUser ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
                          </>
                        )}
                    </motion.button>
                 </div>
               </form>
              </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toolbar & Filters */}
      <div className="flex flex-col gap-3 md:gap-4 bg-[#0a0a0a] p-2 md:p-3 rounded-xl border border-white/5">
         {/* Search */}
         <div className="flex items-center gap-2 md:gap-3 bg-black/40 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-white/5 w-full focus-within:border-cyan-500/50 transition-colors">
            <Search size={14} className="text-gray-500 shrink-0" />
            <input 
            type="text" 
            placeholder="Buscar por nombre, email o ID..." 
            className="bg-transparent border-none outline-none text-xs md:text-sm text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden custom-scrollbar shadow-inner hidden md:flex">
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
            {isFetchingUsers ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Loader size={16} className="text-cyan-400 animate-spin" />
                    <span className="text-gray-400 font-mono text-sm">Cargando usuarios...</span>
                  </div>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center">
                  <span className="text-gray-500 font-mono text-sm">No hay usuarios disponibles</span>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
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
                       user.role === 'ADMIN' 
                          ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                          : user.role === 'OPERATOR'
                              ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                              : 'border-white/20 text-gray-400 bg-white/5'
                     }`}>
                       {user.role === 'ADMIN' && <Shield size={10} />}
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
                      <button 
                        onClick={() => handleEditUser(user)}
                        disabled={isLoading}
                        className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors disabled:opacity-50" 
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(user.id)}
                        disabled={isLoading}
                        className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50" 
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                      <div className="relative">
                        <button 
                          onClick={() => setShowMoreOptions(showMoreOptions === user.id ? null : user.id)}
                          disabled={isLoading}
                          className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <MoreVertical size={14} />
                        </button>
                        <AnimatePresence>
                          {showMoreOptions === user.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 top-full mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50 p-3 min-w-max"
                            >
                              {/* Toggle Switch */}
                              <div className="flex items-center gap-3">
                                <label className="text-xs text-gray-400">
                                  {user.status === 'Activo' ? 'Activo' : 'Inactivo'}
                                </label>
                                <button
                                  onClick={() => handleToggleStatus(user.id, user.status)}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    user.status === 'Activo'
                                      ? 'bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                      : 'bg-gray-600'
                                  }`}
                                  disabled={isLoading}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      user.status === 'Activo' ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>

      {/* Users Mobile Cards - Mobile */}
      <div className="flex md:hidden flex-1 flex-col gap-3 overflow-y-auto">
        {isFetchingUsers ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex items-center gap-3">
              <Loader size={16} className="text-cyan-400 animate-spin" />
              <span className="text-gray-400 font-mono text-sm">Cargando usuarios...</span>
            </div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500 text-xs">
            No hay usuarios
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div 
              key={user.id} 
              className="p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-colors"
            >
              {/* User Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-white/5 p-0.5 border border-white/10 overflow-hidden shrink-0">
                    <img 
                        src={getAvatarUrl(avatarOptions.find(a => a.id === user.avatarId) || avatarOptions[0])} 
                        alt={user.name}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-200 text-xs md:text-sm truncate">{user.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-tight truncate">{user.email}</div>
                </div>
              </div>

              {/* Role and Status Row */}
              <div className="flex items-center gap-2 justify-between mb-3 py-2 border-t border-white/5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                  user.role === 'ADMIN' 
                    ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' 
                    : user.role === 'OPERATOR'
                        ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                        : 'border-white/20 text-gray-400 bg-white/5'
                }`}>
                  {user.role === 'ADMIN' && <Shield size={8} />}
                  {user.role}
                </span>
                <div className="flex items-center gap-1.5">
                  <div className={`relative w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}>
                    {user.status === 'Activo' && <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                  </div>
                  <span className={`text-xs font-medium ${user.status === 'Activo' ? 'text-gray-300' : 'text-gray-600'}`}>{user.status}</span>
                </div>
              </div>

              {/* Activity Row */}
              <div className="flex items-center justify-between text-[10px] mb-3 pb-2 border-b border-white/5">
                <span className="text-gray-500">Registrado:</span>
                <span className="text-gray-400 font-mono">{user.createdAt}</span>
              </div>

              {/* Actions Row */}
              <div className="flex justify-end gap-2">
                <motion.button
                  onClick={() => handleEditUser(user)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors disabled:opacity-50"
                  title="Editar"
                >
                  <Edit2 size={14} />
                </motion.button>
                <motion.button
                  onClick={() => setShowDeleteConfirm(user.id)}
                  disabled={isLoading}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                  title="Eliminar"
                >
                  <Trash2 size={14} />
                </motion.button>
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMoreOptions(showMoreOptions === user.id ? null : user.id)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <MoreVertical size={14} />
                  </motion.button>
                  <AnimatePresence>
                    {showMoreOptions === user.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50"
                      >
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
                        >
                          {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#0f0f0f] border border-red-500/30 rounded-2xl shadow-2xl max-w-sm w-full"
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Confirmar eliminación</h3>
                <p className="text-gray-400 text-sm mb-6">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 rounded-lg border border-gray-500/30 text-gray-300 hover:bg-gray-500/10 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? <RotateCw size={14} className="animate-spin" /> : null}
                    Eliminar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    <div className="flex flex-col h-full space-y-2 md:space-y-4">
      {/* Toast Reutilizable */}
      <Toast toast={toast} onClose={() => setToast(null)} />

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
      <div className="bg-black/40 p-2 md:p-6 rounded-xl border border-white/5 space-y-2 md:space-y-4 shrink-0">
        <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2">
          <Plus size={16} className="text-cyan-400" />
          Agregar Sitio
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
          <div className="sm:col-span-2 lg:col-span-2">
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5 md:mb-2 block">URL del Sitio</label>
            <input
              type="text"
              placeholder="ej: example.com"
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
              className="w-full px-3 py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-cyan-500/50 focus:outline-none placeholder-gray-700"
            />
          </div>

          <div className="relative sm:col-span-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5 md:mb-2 block">Categoría</label>
            <button
              className="w-full px-3 py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs md:text-sm hover:border-white/20 transition-all flex justify-between items-center cursor-pointer group"
              onClick={() => setOpenCategoryMenu(!openCategoryMenu)}
            >
              <span className="font-medium truncate">{selectedCategory}</span>
              <motion.div animate={{ rotate: openCategoryMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
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
                      className={`w-full px-4 py-2 md:py-3 text-left text-xs md:text-sm transition-all border-b border-white/5 last:border-0 flex items-center gap-3 ${
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

          <div className="sm:col-span-1 flex items-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddSite}
              className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-cyan-400/50 hover:border-cyan-300"
            >
              <Plus size={14} />
              Agregar
            </motion.button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-between items-start sm:items-center bg-[#0a0a0a] p-1.5 md:p-2 rounded-xl border border-white/5 shrink-0">
        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5 w-full sm:w-auto overflow-x-auto">
          {[
            { id: "all", label: "Todos" },
            { id: "active", label: "Activos" },
            { id: "inactive", label: "Inactivos" },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilterCategory(f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive')}
              className={`flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
                filterCategory === (f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive') ? 
                  "bg-white/10 text-white shadow-sm border border-white/10" : 
                  "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 bg-black/40 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-white/5 w-full sm:w-auto focus-within:border-cyan-500/50 transition-colors">
          <Search size={12} className="text-gray-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none text-[10px] md:text-xs text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Blocked Sites Table - Desktop */}
        <ScrollArea className="hidden md:flex flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-inner min-h-[300px]">
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

      {/* Blocked Sites Mobile Cards - Mobile */}
        <div className="md:hidden flex-1 flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden min-h-[200px]">
        <div className="flex-1 overflow-y-auto flex flex-col">
          {filteredSites.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-xs">
              No hay sitios bloqueados
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-2">
              {filteredSites.map((site) => (
                <div 
                  key={site.id} 
                  className="p-2.5 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-colors"
                >
                  {/* URL and Category Row */}
                  <div className="flex flex-col gap-1.5 mb-2.5">
                    <div className="font-bold text-[11px] text-gray-200 font-mono truncate">
                      {site.url}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                        {site.category}
                      </span>
                      <span className="text-[9px] text-gray-500 whitespace-nowrap">{site.dateAdded}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-2 py-1.5 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] text-gray-500">Disp:</span>
                      <span className="text-[10px] font-bold text-cyan-400">{site.devices}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className={`relative w-1.5 h-1.5 rounded-full ${site.blocked ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" : "bg-green-500"}`} />
                      <span className={`text-[9px] font-bold ${site.blocked ? "text-red-400" : "text-green-400"}`}>
                        {site.blocked ? "BLOQ" : "PERM"}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex justify-end gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleToggleSite(site.id)}
                      className={`p-1.5 rounded-lg transition-colors text-xs ${
                        site.blocked 
                          ? "hover:bg-green-500/10 hover:text-green-400 text-green-400/60" 
                          : "hover:bg-red-500/10 hover:text-red-400 text-red-400/60"
                      }`}
                      title={site.blocked ? "Permitir" : "Bloquear"}
                    >
                      {site.blocked ? <Zap size={12} /> : <Lock size={12} />}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleRemoveSite(site.id)}
                      className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-red-400/60 rounded-lg transition-colors text-xs"
                      title="Eliminar"
                    >
                      <Trash2 size={12} />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 3.5 NOVEDADES SECTION
const NovedadesSection = ({ problemReports = [], setProblemReports }) => {
  const [filterSeverity, setFilterSeverity] = useState('all');
  const [viewTab, setViewTab] = useState('pendientes'); // 'pendientes' o 'completadas'

  // Separar reportes en pendientes y completados
  const pendingReports = problemReports.filter(r => r.status !== 'closed');
  const completedReports = problemReports.filter(r => r.status === 'closed');

  // Ordenar reportes por timestamp (más recientes primero)
  const getSortedReports = (reports) => {
    return [...reports].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  const sortedPendingReports = getSortedReports(pendingReports);
  const sortedCompletedReports = getSortedReports(completedReports);

  // Aplicar filtro de severidad solo a reportes pendientes
  const displayReports = viewTab === 'pendientes'
    ? filterSeverity === 'all'
      ? sortedPendingReports
      : sortedPendingReports.filter(r => r.severity === filterSeverity)
    : sortedCompletedReports;

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'low': return { 
        bg: 'bg-yellow-500/5', 
        border: 'border-yellow-500/20', 
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/30',
        icon: '🟡' 
      };
      case 'medium': return { 
        bg: 'bg-orange-500/5', 
        border: 'border-orange-500/20', 
        text: 'text-orange-400',
        badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/30',
        icon: '🟠' 
      };
      case 'high': return { 
        bg: 'bg-red-500/5', 
        border: 'border-red-500/20', 
        text: 'text-red-400',
        badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
        icon: '🔴' 
      };
      default: return { 
        bg: 'bg-gray-500/5', 
        border: 'border-gray-500/20', 
        text: 'text-gray-400',
        badge: 'bg-gray-500/15 text-gray-300 border border-gray-500/30',
        icon: '⚪' 
      };
    }
  };

  const handleMarkAsDone = (reportId) => {
    setProblemReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: 'closed' } : report
      )
    );
  };

  const handleMarkAsOpen = (reportId) => {
    setProblemReports(prev => 
      prev.map(report => 
        report.id === reportId ? { ...report, status: 'open' } : report
      )
    );
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 bg-gradient-to-br from-orange-500/15 to-orange-500/5 rounded-xl border border-orange-500/25 shadow-lg shadow-orange-500/10">
            <AlertCircle className="text-orange-400" size={32} />
          </div>
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-white tracking-tight">Novedades</h2>
            <p className="text-gray-400 text-sm mt-2">Gestión centralizada de reportes y problemas en equipos</p>
          </div>
        </div>

        {/* Tabs para cambiar entre Pendientes y Completadas */}
        <div className="flex gap-2 items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setViewTab('pendientes');
              setFilterSeverity('all');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm ${
              viewTab === 'pendientes'
                ? "bg-gradient-to-r from-orange-500/30 to-orange-500/15 text-orange-300 border border-orange-500/50 shadow-lg shadow-orange-500/20"
                : "text-gray-400 hover:text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
          >
            Pendientes {sortedPendingReports.length > 0 && `(${sortedPendingReports.length})`}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setViewTab('completadas');
              setFilterSeverity('all');
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all backdrop-blur-sm ${
              viewTab === 'completadas'
                ? "bg-gradient-to-r from-green-500/30 to-green-500/15 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/20"
                : "text-gray-400 hover:text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10"
            }`}
          >
            Completadas {sortedCompletedReports.length > 0 && `(${sortedCompletedReports.length})`}
          </motion.button>
        </div>

        {/* Filter Section - Solo mostrar si está en vista de Pendientes */}
        {viewTab === 'pendientes' && (
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div></div>
            <div className="flex gap-2 flex-wrap justify-end">
              {[
                { id: 'all', label: 'Todos', count: sortedPendingReports.length },
                { id: 'low', label: 'Baja', count: sortedPendingReports.filter(r => r.severity === 'low').length },
                { id: 'medium', label: 'Media', count: sortedPendingReports.filter(r => r.severity === 'medium').length },
                { id: 'high', label: 'Alta', count: sortedPendingReports.filter(r => r.severity === 'high').length },
              ].map(f => (
                <motion.button
                  key={f.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setFilterSeverity(f.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all backdrop-blur-sm ${
                    filterSeverity === f.id 
                      ? "bg-gradient-to-r from-orange-500/30 to-orange-500/15 text-orange-300 border border-orange-500/50 shadow-lg shadow-orange-500/20" 
                      : "text-gray-400 hover:text-gray-300 bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  {f.label} {f.count > 0 && <span className="ml-2 text-[10px] opacity-70">({f.count})</span>}
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reports Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide pr-2">
        {displayReports.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="p-4 bg-white/5 rounded-full w-20 h-20 flex items-center justify-center mx-auto">
                <AlertCircle size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium">
                {viewTab === 'pendientes' ? 'No hay reportes pendientes' : 'No hay reportes completados'}
              </p>
              <p className="text-gray-600 text-xs">
                {viewTab === 'pendientes' ? 'Los nuevos reportes aparecerán aquí' : 'Los reportes marcados como completados aparecerán aquí'}
              </p>
            </div>
          </div>
        ) : (
          displayReports.map(report => {
            const severity = getSeverityColor(report.severity);
            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className={`p-5 rounded-xl border ${severity.border} ${severity.bg} hover:shadow-xl transition-all backdrop-blur-sm overflow-hidden relative`}
                style={{
                  boxShadow: report.severity === 'high' 
                    ? '0 0 25px rgba(239, 68, 68, 0.08)' 
                    : report.severity === 'medium'
                    ? '0 0 25px rgba(249, 115, 22, 0.08)'
                    : '0 0 25px rgba(234, 179, 8, 0.08)'
                }}
              >
                {/* Gradient accent line */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                  report.severity === 'high' ? 'from-red-500 to-red-500/30'
                  : report.severity === 'medium' ? 'from-orange-500 to-orange-500/30'
                  : 'from-yellow-500 to-yellow-500/30'
                }`} />
                {/* Header del reporte */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{severity.icon}</span>
                      <span className={`text-xs font-bold uppercase ${severity.badge} px-2.5 py-1 rounded-md`}>
                        {report.severity === 'low' ? 'Baja' : report.severity === 'medium' ? 'Media' : 'Alta'}
                      </span>
                      <span className="text-xs text-white font-mono font-bold ml-3">ID: {report.cpuCode}</span>
                      <span className="text-xs text-gray-500 ml-auto">{report.displayTimestamp}</span>
                    </div>
                  </div>
                </div>
                <div className="mb-4 p-3.5 bg-white/[0.02] rounded-lg border border-white/10 space-y-2">
                  <div className="space-y-1">
                    <p className="text-gray-600 text-[10px] uppercase tracking-widest font-bold">Ubicación</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-white font-bold font-mono text-sm">{report.sala.replace('sala', 'Sala ')}</p>
                      <span className="text-gray-600 text-xs">•</span>
                      <p className="text-orange-300 font-bold font-mono text-sm">{report.ubicacion}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs">
                    <div>
                      <p className="text-gray-600 uppercase tracking-widest font-bold text-[10px]">IP</p>
                      <p className="text-gray-400 font-mono mt-0.5">{report.ip}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                <div className="p-3.5 bg-white/[0.02] rounded-lg border border-white/10 mb-4">
                  <p className="text-sm text-gray-300 break-words leading-relaxed">{report.description}</p>
                </div>

                {/* Footer con estado y botón */}
                <div className="flex justify-between items-center gap-3 text-xs pt-4 border-t border-white/5">
                  <span className={`px-3 py-1.5 rounded-full font-semibold transition-all ${report.status === 'open' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-green-500/20 text-green-300 border border-green-500/30'}`}>
                    {report.status === 'open' ? '🔴 Abierto' : '✅ Resuelto'}
                  </span>
                  {report.status === 'open' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAsDone(report.id)}
                      className="ml-auto px-4 py-1.5 bg-gradient-to-r from-green-500/30 to-green-500/10 hover:from-green-500/40 hover:to-green-500/20 text-green-300 rounded-lg border border-green-500/40 font-semibold transition-all shadow-lg shadow-green-500/10 hover:shadow-green-500/20 flex items-center gap-2 text-xs"
                    >
                      <CheckCircle size={14} className="drop-shadow" />
                      Marcar Hecho
                    </motion.button>
                  )}
                  {report.status === 'closed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleMarkAsOpen(report.id)}
                      className="ml-auto px-4 py-1.5 bg-gradient-to-r from-orange-500/30 to-orange-500/10 hover:from-orange-500/40 hover:to-orange-500/20 text-orange-300 rounded-lg border border-orange-500/40 font-semibold transition-all shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 flex items-center gap-2 text-xs"
                    >
                      <AlertCircle size={14} className="drop-shadow" />
                      Reabrir
                    </motion.button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

// 3.6 LOGS & TRAFFIC SECTION
const LogsAndTrafficSection = ({ problemReports = [] }) => {
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

  const filteredLogs = (() => {
    // Combinar logs del sistema con reportes de problemas
    const combinedLogs = [
      ...logs,
      ...problemReports.map(report => ({
        id: report.id,
        timestamp: report.displayTimestamp,
        device: report.device,
        action: `Problema reportado: ${report.description}`,
        type: 'Reporte',
        status: report.status === 'open' ? 'warning' : 'success'
      }))
    ];
    
    // Aplicar filtros
    return combinedLogs.filter(log => {
      const matchesSearch = log.device.toLowerCase().includes(searchLog.toLowerCase()) || 
                           log.action.toLowerCase().includes(searchLog.toLowerCase());
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
                  <th className="p-4 font-normal">Severidad</th>
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
                        log.type === 'Reporte' ? 'bg-orange-500/10 text-orange-400' :
                        'bg-cyan-500/10 text-cyan-400'
                      }`}>
                        {log.type}
                      </span>
                    </td>
                    <td className="p-4">
                      {log.severity ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-mono font-bold ${
                          log.severity === 'low' ? 'bg-yellow-500/10 text-yellow-400' :
                          log.severity === 'medium' ? 'bg-orange-500/10 text-orange-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                          {log.severity === 'low' ? '🟡 Baja' : log.severity === 'medium' ? '🟠 Media' : '🔴 Alta'}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">-</span>
                      )}
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

// 3.8 SCREEN MONITORING SECTION
const ScreenMonitoringSection = () => {
  const [screens, setScreens] = useState([
    {
      id: 1,
      pcId: "SALA-01-PC1",
      imageBase64: null,
      timestamp: new Date(Date.now() - 5000),
      status: "online",
      lastUpdate: new Date(Date.now() - 2000),
    },
    {
      id: 2,
      pcId: "SALA-02-PC3",
      imageBase64: null,
      timestamp: new Date(Date.now() - 8000),
      status: "online",
      lastUpdate: new Date(Date.now() - 3000),
    },
    {
      id: 3,
      pcId: "SALA-03-PC5",
      imageBase64: null,
      timestamp: new Date(Date.now() - 12000),
      status: "offline",
      lastUpdate: new Date(Date.now() - 15000),
    },
  ]);

  const [selectedScreen, setSelectedScreen] = useState(null);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const handleScreenMessage = (messageData) => {
    try {
      // messageData viene del RabbitMQService, ya parseado
      const parsedData = typeof messageData === 'string' ? JSON.parse(messageData) : messageData;
      setScreens(prev => prev.map(screen =>
        screen.pcId === parsedData.PcId || screen.pcId === parsedData.pcId
          ? {
              ...screen,
              imageBase64: parsedData.ImageBase64 || parsedData.imageBase64,
              timestamp: new Date(parsedData.Timestamp || parsedData.timestamp),
              lastUpdate: new Date(),
              status: 'online'
            }
          : screen
      ));
    } catch (e) {
      console.error('Error parsing screen message:', e);
    }
  };

  // RabbitMQ Connection useEffect
  useEffect(() => {
    const initRabbitMQ = async () => {
      try {
        // Conectar al servicio RabbitMQ
        await RabbitMQService.connect();
        
        // Registrar callback para recibir mensajes
        RabbitMQService.onMessage(handleScreenMessage);

        console.log('✅ ScreenMonitoringSection conectada a RabbitMQ');
      } catch (error) {
        console.error('❌ Error inicializando RabbitMQ en ScreenMonitoringSection:', error);
      }
    };

    initRabbitMQ();

    // Cleanup en desmontaje
    return () => {
      RabbitMQService.offMessage(handleScreenMessage);
    };
  }, []);

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Monitor className="text-purple-400" size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Vigilancia de Pantallas</h2>
              <p className="text-gray-500 text-sm font-sans">Monitorea las pantallas de los dispositivos en tiempo real.</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-400 font-mono">
          {screens.filter(s => s.status === 'online').length}/{screens.length} en línea
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Dispositivos Monitoreados", value: screens.length, icon: Monitor, color: "text-purple-400", bg: "from-purple-500/10 to-transparent", border: "border-purple-500/20" },
          { label: "En Línea", value: screens.filter(s => s.status === 'online').length, icon: Eye, color: "text-green-400", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
          { label: "Actualizaciones/min", value: screens.length * 12, icon: RefreshCw, color: "text-blue-400", bg: "from-blue-500/10 to-transparent", border: "border-blue-500/20" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`p-5 rounded-xl border ${stat.border} bg-gradient-to-b ${stat.bg} backdrop-blur-sm group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${stat.color}`}>
                <stat.icon size={20} />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Screen Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto">
        {screens.map((screen) => (
          <motion.div
            key={screen.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            className="relative group rounded-xl overflow-hidden border border-white/10 bg-black/40 hover:border-purple-500/30 transition-all cursor-pointer"
            onClick={() => {
              setSelectedScreen(screen);
              setShowFullscreen(true);
            }}
          >
            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <div className={`w-2 h-2 rounded-full ${screen.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className={`text-xs font-bold ${screen.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                {screen.status === 'online' ? 'EN LÍNEA' : 'DESCONECTADO'}
              </span>
            </div>

            {/* Screen Preview */}
            <div className="aspect-video bg-gradient-to-br from-black/80 to-purple-900/20 flex items-center justify-center relative overflow-hidden">
              {screen.imageBase64 ? (
                <motion.img
                  src={`data:image/jpeg;base64,${screen.imageBase64}`}
                  alt={screen.pcId}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Monitor size={32} className="mb-2 opacity-50" />
                  <span className="text-xs">Sin captura</span>
                </div>
              )}
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                <Maximize2 size={24} className="text-white" />
              </div>
            </div>

            {/* Info Footer */}
            <div className="p-3 space-y-2 border-t border-white/5">
              <h3 className="font-bold text-sm text-white font-mono truncate">{screen.pcId}</h3>
              <div className="text-[10px] text-gray-500 space-y-1">
                <div className="flex justify-between">
                  <span>Captura:</span>
                  <span className="text-cyan-400">{screen.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Actualización:</span>
                  <span className="text-cyan-400">hace {Math.round((new Date() - screen.lastUpdate) / 1000)}s</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
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
              className="relative w-full max-w-4xl rounded-xl overflow-hidden border border-purple-500/30 shadow-2xl"
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
              {selectedScreen.imageBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${selectedScreen.imageBase64}`}
                  alt={selectedScreen.pcId}
                  className="w-full h-auto"
                />
              ) : (
                <div className="aspect-video bg-gradient-to-br from-black to-purple-900/40 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Monitor size={64} className="mb-4 opacity-30 mx-auto" />
                    <p className="text-lg">Sin captura disponible</p>
                  </div>
                </div>
              )}

              {/* Footer Info */}
              <div className="bg-black/80 border-t border-white/10 p-4 flex justify-between items-center">
                <div>
                  <h3 className="text-white font-bold font-mono">{selectedScreen.pcId}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Capturado: {selectedScreen.timestamp.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${selectedScreen.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                  <span className={`text-xs font-bold ${selectedScreen.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                    {selectedScreen.status === 'online' ? 'EN LÍNEA' : 'DESCONECTADO'}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 4. DEPLOYMENT MODAL
const DeploymentModal = ({ showDeployModal, setShowDeployModal, deployTargetPCs, setDeployTargetPCs }) => (
  <AnimatePresence>
    {showDeployModal && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4"
        onClick={() => setShowDeployModal(false)}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-[#0f0f0f] border border-cyan-500/30 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-cyan-900/20 to-transparent p-6 border-b border-white/5 flex justify-between items-center sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <Terminal size={24} className="text-cyan-400" />
              <h2 className="text-xl font-bold text-white font-mono">Despliegue de Aplicaciones</h2>
            </div>
            <button
              onClick={() => setShowDeployModal(false)}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content with better organization */}
          <div className="flex-1 overflow-y-auto flex flex-col lg:flex-row gap-4 p-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <AppDeploymentSection targetPCs={deployTargetPCs} isModal={true} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

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

const DashboardContent = ({ currentPage, avatarOptions, getAvatarUrl, showDeployModal, setShowDeployModal, deployTargetPCs, setDeployTargetPCs, problemReports, setProblemReports }) => {
  const containerClass = "flex flex-1 flex-col gap-4 md:gap-6 rounded-tl-3xl border-l border-t border-white/10 bg-[#080808] p-3 md:p-8 backdrop-blur-xl overflow-y-auto shadow-[-20px_-20px_50px_rgba(0,0,0,0.5)] relative z-10 h-full w-full scrollbar-hide md:rounded-tl-3xl rounded-none";
  
  // Obtener el usuario autenticado para verificar permisos
  const authenticatedUser = AuthService.getCurrentUser();
  const userRole = authenticatedUser?.role || 'OPERATOR';
  
  const renderContent = () => {
    // Verificar si el usuario tiene permiso para acceder a esta sección
    if (currentPage === 'users' && userRole === 'OPERATOR') {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <Lock size={48} className="text-red-500" />
          <h2 className="text-xl font-bold text-white">Acceso Denegado</h2>
          <p className="text-gray-400 text-center">No tienes permisos para acceder a la Gestión de Accesos.</p>
          <p className="text-gray-500 text-sm">Solo administradores pueden gestionar usuarios.</p>
        </div>
      );
    }
    
    switch(currentPage) {
      case 'dashboard': return <OverviewSection />;
      case 'computers': return <ComputerMonitoringSection showDeployModal={showDeployModal} setShowDeployModal={setShowDeployModal} deployTargetPCs={deployTargetPCs} setDeployTargetPCs={setDeployTargetPCs} problemReports={problemReports} setProblemReports={setProblemReports} />;
      case 'screens': return <ScreenMonitoringSection />;
      case 'users': return <CreateUsersSection avatarOptions={avatarOptions} getAvatarUrl={getAvatarUrl} />;
      case 'blocking': return <BlockingSitesSection />;
      case 'novedades': return <NovedadesSection problemReports={problemReports} setProblemReports={setProblemReports} />;
      case 'logs': return <LogsAndTrafficSection problemReports={problemReports} />;
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
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [userRole, setUserRole] = useState('OPERATOR');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [deployTargetPCs, setDeployTargetPCs] = useState([]);
  const [problemReports, setProblemReports] = useState([]);
  
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
  
  // Obtener datos del usuario autenticado
  const authenticatedUser = AuthService.getCurrentUser();

  // Obtener el rol del usuario de forma asíncrona si es necesario
  useEffect(() => {
    const fetchRole = async () => {
      const role = await AuthService.getUserRole();
      setUserRole(role);
      console.log('🔐 Rol obtenido:', role);
    };
    
    if (!authenticatedUser?.role) {
      fetchRole();
    } else {
      setUserRole(authenticatedUser.role);
    }
  }, [authenticatedUser]);
  
  // Construir objeto del usuario actual - MEJORADO
  const getFullName = () => {
    if (!authenticatedUser) return "Usuario";
    
    // Intentar firstName + lastName
    const firstName = (authenticatedUser.firstName || "").trim();
    const lastName = (authenticatedUser.lastName || "").trim();
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    // Intentar nombre + apellido (Spanish)
    const nombre = (authenticatedUser.nombre || "").trim();
    const apellido = (authenticatedUser.apellido || "").trim();
    if (nombre && apellido) {
      return `${nombre} ${apellido}`;
    }
    
    // Intentar solo firstName o nombre
    if (firstName) return firstName;
    if (nombre) return nombre;
    
    // Fallback a email
    const email = (authenticatedUser.email || "").trim();
    if (email) return email;
    
    // Último recurso
    return "Usuario";
  };
  
  const currentUser = { 
    name: getFullName(),
    role: authenticatedUser?.role || authenticatedUser?.rol || "Admin Principal", 
    email: authenticatedUser?.email || "",
    avatar: selectedAvatar 
  };
  
  // Debug log en el montaje del componente
  useEffect(() => {
    console.log('=== DASHBOARD MONTADO ===');
    console.log('Datos de AuthService.getCurrentUser():', authenticatedUser);
    console.log('localStorage.getItem("user"):', localStorage.getItem('user'));
    console.log('Nombre resuelto:', currentUser.name);
    console.log('currentUser completo:', currentUser);
  }, []);

  // 🚪 Función para cerrar sesión
  const handleLogout = () => {
    // Limpiar datos de sesión (preservar avatar seleccionado)
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    // Redirigir a login
    navigate('/');
  };

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
    { label: "Vigilancia de Pantallas", href: "#screens", icon: <Eye />, page: "screens" },
    { label: "Bloqueo de Sitios", href: "#blocking", icon: <AlertTriangle />, page: "blocking" },
    ...((userRole === 'ADMIN') ? [{ label: "Gestión de Usuarios", href: "/usuarios", icon: <UserPlus />, page: "users" }] : []),
    { label: "Novedades", href: "#novedades", icon: <Bell />, page: "novedades" },
    { label: "Logs y Tráfico", href: "#logs", icon: <FileText />, page: "logs" },
    { label: "Configuración", href: "#settings", icon: <Settings />, page: "settings" },
  ];

  console.log('🔐 userRole en Dashboard:', userRole);
  console.log('🔐 Links incluyen Gestión de Usuarios:', links.some(l => l.page === 'users'));

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
            onLogout={handleLogout}
          />
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 flex flex-col md:pt-0 pt-16">
        <DashboardContent 
          currentPage={currentPage} 
          avatarOptions={avatarOptions} 
          getAvatarUrl={getAvatarUrl}
          showDeployModal={showDeployModal}
          setShowDeployModal={setShowDeployModal}
          deployTargetPCs={deployTargetPCs}
          setDeployTargetPCs={setDeployTargetPCs}
          problemReports={problemReports}
          setProblemReports={setProblemReports}
        />
        <DeploymentModal 
          showDeployModal={showDeployModal}
          setShowDeployModal={setShowDeployModal}
          deployTargetPCs={deployTargetPCs}
          setDeployTargetPCs={setDeployTargetPCs}
        />
      </div>
    </div>
  );
}

export default DashboardLayout;