import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutGrid, 
  Monitor, 
  FileText, 
  Settings, 
  AlertTriangle,
  UserPlus,
  Lock,
  Edit2,
  Eye,
  Bell,
  Terminal,
  X
} from "lucide-react";
import iconLogo from "../../assets/icons/icon.png";
import { AuthService, incidentService } from "../../services";
import { useUserActivity } from "../../hooks/useUserActivity";

// Importar componentes del Dashboard
import { 
  Sidebar, 
  SidebarBody, 
  SidebarLink, 
  SidebarLogo, 
  UserProfile 
} from "./components";

// Importar secciones del Dashboard
import {
  OverviewSection,
  ComputerMonitoringSection,
  CreateUsersSection,
  BlockingSitesSection,
  NovedadesSection,
  LogsAndTrafficSection,
  ScreenMonitoringSection,
  AppDeploymentSection,
  PlaceholderSection
} from "./sections";

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
    
    testLoginFlow: async (email = "admin@test.com", password = "test123") => {
      console.log('%c🧪 PROBANDO FLUJO DE LOGIN', 'font-size: 14px; color: #ff6b00; font-weight: bold;');
      try {
        const result = await AuthService.login({ email, password });
        console.log('Resultado:', result);
        return result;
      } catch (error) {
        console.error('Error:', error);
        return { error };
      }
    }
  };
}

// ============================================
// DEPLOYMENT MODAL COMPONENT
// ============================================
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

// ============================================
// DASHBOARD CONTENT COMPONENT
// ============================================
const DashboardContent = ({ 
  currentPage, 
  avatarOptions, 
  getAvatarUrl, 
  showDeployModal, 
  setShowDeployModal, 
  deployTargetPCs, 
  setDeployTargetPCs, 
  problemReports, 
  setProblemReports 
}) => {
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
      case 'dashboard': return <OverviewSection problemReports={problemReports} />;
      case 'computers': return <ComputerMonitoringSection showDeployModal={showDeployModal} setShowDeployModal={setShowDeployModal} deployTargetPCs={deployTargetPCs} setDeployTargetPCs={setDeployTargetPCs} problemReports={problemReports} setProblemReports={setProblemReports} />;
      case 'screens': return <ScreenMonitoringSection />;
      case 'users': return <CreateUsersSection avatarOptions={avatarOptions} getAvatarUrl={getAvatarUrl} />;
      case 'blocking': return <BlockingSitesSection />;
      case 'novedades': return <NovedadesSection problemReports={problemReports} setProblemReports={setProblemReports} />;
      case 'logs': return <LogsAndTrafficSection problemReports={problemReports} />;
      default: return <OverviewSection problemReports={problemReports} />;
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

// ============================================
// MAIN DASHBOARD LAYOUT
// ============================================
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
  
  // Hook para detectar actividad del usuario (10 segundos de inactividad)
  const isUserActive = useUserActivity(10000);
  
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

  // Cargar novedades desde la API al iniciar
  useEffect(() => {
    console.log('🚀🚀🚀 INICIANDO CARGA DE NOVEDADES 🚀🚀🚀');
    
    const loadIncidents = async () => {
      try {
        console.log('🔄 Cargando novedades desde API...');
        const incidents = await incidentService.getAllIncidents();
        console.log('📦 Datos recibidos:', incidents);
        
        // Función para parsear la descripción y extraer datos
        const parseDescription = (description) => {
          // Formato nuevo: [sala1] [0365] [IP: 10.0.20.31] [PC: s4-iz4-pc1] - descripción real
          // Formato viejo: [sala1] [0365] [IP: 10.0.20.31] - descripción real
          const regexNew = /^\[([^\]]+)\]\s*\[([^\]]+)\]\s*\[IP:\s*([^\]]+)\]\s*\[PC:\s*([^\]]+)\]\s*-\s*(.*)$/;
          const regexOld = /^\[([^\]]+)\]\s*\[([^\]]+)\]\s*\[IP:\s*([^\]]+)\]\s*-\s*(.*)$/;
          
          let match = description?.match(regexNew);
          if (match) {
            return {
              sala: match[1],
              cpuCode: match[2],
              ip: match[3].trim(),
              pcId: match[4].trim(),
              realDescription: match[5].trim()
            };
          }
          
          match = description?.match(regexOld);
          if (match) {
            return {
              sala: match[1],
              cpuCode: match[2],
              ip: match[3].trim(),
              pcId: null,
              realDescription: match[4].trim()
            };
          }
          
          // Si no coincide con el formato, devolver valores por defecto
          return {
            sala: 'N/A',
            cpuCode: 'N/A',
            ip: 'N/A',
            pcId: null,
            realDescription: description || 'Sin descripción'
          };
        };
        
        // Transformar los datos del backend al formato del frontend
        const formattedReports = incidents.map(incident => {
          const parsed = parseDescription(incident.description);
          
          // Buscar el campo de fecha en varios lugares posibles
          const dateField = incident.createdAt || incident.created_at || incident.date || incident.timestamp || incident.fechaCreacion;
          console.log('📅 Fecha del incidente', incident.id, ':', dateField, 'Objeto completo:', incident);
          
          return {
            id: incident.id,
            description: parsed.realDescription,
            severity: incident.severity?.toLowerCase() || 'low',
            status: incident.status === 'COMPLETED' ? 'closed' : 'open',
            timestamp: dateField,
            displayTimestamp: dateField ? new Date(dateField).toLocaleString('es-ES') : 'Sin fecha',
            completedAt: incident.completedAt || incident.completed_at,
            device: `PC-${parsed.cpuCode}`,
            ip: parsed.ip,
            sala: parsed.sala,
            cpuCode: parsed.cpuCode,
            pcId: parsed.pcId,
            type: 'Reporte',
            sector: 'General',
            ubicacion: parsed.sala !== 'N/A' ? parsed.sala.replace('sala', 'Sala ') : 'N/A',
            posicion: 'N/A'
          };
        });
        
        setProblemReports(formattedReports);
        console.log('✅ Novedades cargadas:', formattedReports.length);
      } catch (error) {
        console.error('❌ Error cargando novedades:', error);
      }
    };

    loadIncidents();
  }, []);
  
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
    { label: "Panel Principal", href: "#dashboard", icon: <LayoutGrid />, page: "dashboard", color: "cyan" },
    { label: "Monitoreo Remoto", href: "#computers", icon: <Monitor />, page: "computers", color: "blue" },
    { label: "Vigilancia de Pantallas", href: "#screens", icon: <Eye />, page: "screens", color: "purple" },
    { label: "Bloqueo de Sitios", href: "#blocking", icon: <AlertTriangle />, page: "blocking", color: "red" },
    ...((userRole === 'ADMIN') ? [{ label: "Gestión de Usuarios", href: "/usuarios", icon: <UserPlus />, page: "users", color: "green" }] : []),
    { label: "Novedades", href: "#novedades", icon: <Bell />, page: "novedades", color: "orange" },
    { label: "Logs", href: "#logs", icon: <FileText />, page: "logs", color: "yellow" },
  ];

  console.log('🔐 userRole en Dashboard:', userRole);
  console.log('🔐 Links incluyen Gestión de Usuarios:', links.some(l => l.page === 'users'));

  // Calcular currentAvatarUrl para el modal
  const selectedAvatarData = avatarOptions.find(a => a.id === selectedAvatar);
  const currentAvatarUrl = selectedAvatar ? getAvatarUrl(selectedAvatarData) : null;

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

      {/* Profile Modal - Nivel superior para que aparezca sobre el sidebar */}
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
              className="bg-gradient-to-b from-gray-900/95 to-black/95 border border-white/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              {/* Header con gradiente */}
              <div className="relative p-4 border-b border-white/10 bg-gradient-to-r from-gray-800/40 via-transparent to-gray-800/40 overflow-hidden">
                {/* Glow background */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none" />
                
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Avatar con lápiz */}
                    <div className="relative group flex-shrink-0">
                      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-600/30 to-gray-700/30 border-2 border-white/20 flex items-center justify-center shadow-lg transition-all duration-300 overflow-hidden">
                        {currentUser && currentAvatarUrl ? (
                          <img src={currentAvatarUrl} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="font-bold text-xl text-gray-300">{currentUser?.name?.charAt(0)}</span>
                        )}
                      </div>
                      {/* Botón de lápiz flotante */}
                      <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                        className="absolute -bottom-1 -right-1 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full p-1.5 shadow-lg border border-white/30 hover:border-white/50 transition-all"
                      >
                        <Settings className="w-3 h-3 text-white" />
                      </motion.button>
                    </div>

                    <div className="flex flex-col min-w-0">
                      <h2 className="text-lg font-bold text-white truncate">{currentUser?.name}</h2>
                      <span className="text-green-400 font-mono text-xs uppercase tracking-widest font-bold">{currentUser?.role}</span>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowProfileModal(false)}
                    className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
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
                      className="space-y-4 p-4 rounded-xl bg-white/5 border border-white/10"
                    >
                      <div className="flex items-center gap-2 mb-6">
                        <div className="h-1.5 w-10 bg-gradient-to-r from-gray-400 via-gray-500 to-gray-400 rounded-full" />
                        <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">Personalizá tu Avatar</p>
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
                                ? `border-white shadow-xl bg-white/10`
                                : "bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-700/50 hover:border-white/50 hover:shadow-lg"
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
                                <svg className="w-4 h-4 text-gray-800 font-bold" fill="currentColor" viewBox="0 0 20 20">
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
                >
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-colors">
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mb-1">Correo</p>
                    <p className="text-sm text-gray-200 font-mono break-all">{currentUser?.email || "admin@envyguard.com"}</p>
                  </div>
                </motion.div>

                {/* Detalles */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-3 p-4 rounded-lg bg-white/5 border border-white/10"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Estado</span>
                    <span className="text-sm text-gray-300 font-mono flex items-center gap-2">
                      {isUserActive ? (
                        <>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                          </span>
                          <span className="text-green-400">Activo</span>
                        </>
                      ) : (
                        <>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                          <span className="text-yellow-400">Inactivo</span>
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">Nivel de acceso</span>
                    <span className="inline-block px-2 py-1 text-[10px] font-bold text-gray-300 bg-white/10 border border-white/20 rounded uppercase">
                      {authenticatedUser?.role || authenticatedUser?.rol || 'ADMIN'}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default DashboardLayout;

// Exportar componentes para uso externo si es necesario
export * from './components';
export * from './sections';
