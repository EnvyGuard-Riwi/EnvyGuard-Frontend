import React, { useState, useContext, createContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Settings, LogOut } from 'lucide-react';
import iconLogo from '../../../assets/icons/icon.png';
import { useUserActivity } from '../../../hooks/useUserActivity';

// Context para el Sidebar
export const SidebarContext = createContext(undefined);

/**
 * Sidebar Component - Barra lateral principal
 */
export const Sidebar = ({ children, open, setOpen }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      {/* Hamburger Menu - Solo visible en móvil */}
      <motion.button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-5 left-5 z-[110] md:hidden p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 hover:bg-cyan-500/30 text-cyan-400 transition-all shadow-lg"
        aria-label="Abrir menú"
      >
        <Menu size={20} />
      </motion.button>

      {/* Overlay móvil */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden backdrop-blur-sm"
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
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.35, type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] max-w-[75vw] bg-gradient-to-b from-[#0f0f0f] to-[#050505] border-r border-gray-800 overflow-y-auto overflow-x-hidden z-50 md:hidden flex flex-col shadow-2xl"
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

/**
 * SidebarBody Component - Contenedor del cuerpo del sidebar
 */
export const SidebarBody = (props) => (
  <div className="flex h-full w-full flex-1 flex-col justify-between overflow-y-auto overflow-x-hidden px-2 md:px-3 py-4 md:py-3 space-y-1" {...props} />
);

/**
 * SidebarLink Component - Link individual del sidebar
 */
export const SidebarLink = ({ link, className = "", isActive = false, onClick, ...props }) => {
  const { open } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  // Mapa de colores para cada sección
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-500/15',
      border: 'border-cyan-500',
      line: 'bg-cyan-400',
      text: 'text-cyan-400',
      hover: 'group-hover:text-cyan-300'
    },
    blue: {
      bg: 'bg-blue-500/15',
      border: 'border-blue-500',
      line: 'bg-blue-400',
      text: 'text-blue-400',
      hover: 'group-hover:text-blue-300'
    },
    purple: {
      bg: 'bg-purple-500/15',
      border: 'border-purple-500',
      line: 'bg-purple-400',
      text: 'text-purple-400',
      hover: 'group-hover:text-purple-300'
    },
    red: {
      bg: 'bg-red-500/15',
      border: 'border-red-500',
      line: 'bg-red-400',
      text: 'text-red-400',
      hover: 'group-hover:text-red-300'
    },
    green: {
      bg: 'bg-green-500/15',
      border: 'border-green-500',
      line: 'bg-green-400',
      text: 'text-green-400',
      hover: 'group-hover:text-green-300'
    },
    orange: {
      bg: 'bg-orange-500/15',
      border: 'border-orange-500',
      line: 'bg-orange-400',
      text: 'text-orange-400',
      hover: 'group-hover:text-orange-300'
    },
    yellow: {
      bg: 'bg-yellow-500/15',
      border: 'border-yellow-500',
      line: 'bg-yellow-400',
      text: 'text-yellow-400',
      hover: 'group-hover:text-yellow-300'
    },
    gray: {
      bg: 'bg-gray-500/15',
      border: 'border-gray-500',
      line: 'bg-gray-400',
      text: 'text-gray-400',
      hover: 'group-hover:text-gray-300'
    }
  };

  const colors = colorMap[link.color] || colorMap.cyan;

  return (
    <motion.a
      href={link.href}
      onClick={(e) => { e.preventDefault(); if (onClick) onClick(link.page); }}
      className={`relative flex items-center justify-start gap-3 px-2 md:px-3 py-3 md:py-2.5 rounded-lg transition-all group cursor-pointer mb-1 md:mb-1.5 touch-manipulation active:scale-95 ${className}`}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      {/* Fondo para items activos */}
      {isActive && (
        <div className={`absolute inset-0 rounded-lg ${colors.bg} border-l-2 ${colors.border}`} />
      )}

      {/* Fondo hover sutil */}
      {isHovered && !isActive && (
        <div className="absolute inset-0 rounded-lg bg-white/5" />
      )}

      {/* Indicador de línea para items activos */}
      {isActive && (
        <div
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 md:h-6 ${colors.line} rounded-r-lg`}
        />
      )}

      <div className={`relative z-10 flex-shrink-0 w-5 h-5 md:w-5 md:h-5 flex items-center justify-center transition-all duration-300 ${isActive ? colors.text : 'text-gray-500 group-hover:text-gray-200'}`}>
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
            className={`relative z-10 text-sm md:text-sm font-medium whitespace-nowrap transition-colors hidden md:inline-block ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'}`}
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Móvil: siempre mostrar */}
      <span className="relative z-10 text-xs md:text-sm font-medium whitespace-nowrap md:hidden text-center px-1">
        {link.label}
      </span>
    </motion.a>
  );
};

/**
 * SidebarLogo Component - Logo del sidebar
 */
export const SidebarLogo = () => {
  const { open } = useContext(SidebarContext);
  return (
    <div className="relative z-20 flex items-center justify-center md:justify-start gap-3 px-2 md:px-2 py-4 md:py-4 mb-6 md:mb-8 border-b border-gray-800 pb-4 md:pb-4 w-full">
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
            <span className="font-bold text-sm md:text-sm tracking-wide font-mono text-gray-50">ENVYGUARD</span>
            <span className="text-[8px] text-gray-500 font-mono tracking-wider uppercase">V1.0</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Móvil: siempre mostrar */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="flex flex-col min-w-0 md:hidden text-left"
      >
        <span className="font-bold text-xs md:text-sm tracking-wide font-mono text-gray-50">ENVYGUARD</span>
        <span className="text-[7px] md:text-[8px] text-gray-500 font-mono tracking-wider uppercase">V1.0</span>
      </motion.div>
    </div>
  );
};

/**
 * UserProfile Component - Perfil de usuario en sidebar
 */
export const UserProfile = ({ 
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
  
  // Hook para detectar actividad del usuario (10 segundos de inactividad)
  const isUserActive = useUserActivity(10000);

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
      <div className="border-t border-gray-900 pt-3 md:pt-4 pb-3 md:pb-3 flex flex-col gap-2 md:gap-3 px-2 md:px-0">
        {/* Profile Button */}
        <motion.button 
          onClick={() => setShowProfileModal(true)}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 md:gap-3 px-2 md:px-3 py-3 md:py-2.5 rounded-lg cursor-pointer hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/30 group w-full touch-manipulation active:scale-95"
        >
          <div className="relative shrink-0">
            <div className="h-8 md:h-10 w-8 md:w-10 rounded-full bg-gradient-to-br from-cyan-500/20 to-cyan-900/20 p-[1px] flex items-center justify-center border border-cyan-500/20 group-hover:border-cyan-500/50 transition-colors overflow-hidden">
              {currentAvatarUrl ? (
                <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="font-bold text-xs md:text-sm text-cyan-400">{user?.name?.charAt(0)}</span>
              )}
            </div>
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
            <span className="text-xs md:text-xs font-semibold text-gray-100 truncate group-hover:text-cyan-400 transition-colors">{user?.name?.split(' ')[0]}</span>
            <span className="text-[8px] text-gray-500 truncate font-mono group-hover:text-cyan-400/70 transition-colors">{user?.role}</span>
          </div>
          {open && <Settings className="ml-auto text-gray-600 w-3 md:w-4 h-3 md:h-4 group-hover:text-cyan-400 transition-all duration-300 shrink-0 hidden md:block" />}
        </motion.button>

        {/* Logout Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          className="w-full flex items-center justify-center md:justify-start gap-2 px-2 md:px-3 py-2 md:py-2 rounded text-xs md:text-sm text-gray-500 hover:text-red-400 transition-all group touch-manipulation active:scale-95"
          onClick={onLogout}
        >
          <LogOut size={16} className="shrink-0 md:w-4 md:h-4" />
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
    </>
  );
};

export default Sidebar;
