import React, { useState, createContext, useContext, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import iconLogo from "../assets/icons/icon.png";
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
  Zap
} from "lucide-react";

// --- CONTEXT & SIDEBAR COMPONENTS ---

const SidebarContext = createContext(undefined);

// 1. Sidebar Component
const Sidebar = ({ children, open, setOpen }) => {
  return (
    <SidebarContext.Provider value={{ open, setOpen }}>
      <motion.div
        className="relative flex h-full flex-col bg-[#050505] border-r border-white/10 overflow-hidden w-[80px] transition-colors duration-300 z-50 shrink-0"
        animate={{
          width: open ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
        {children}
      </motion.div>
    </SidebarContext.Provider>
  );
};

// 2. SidebarBody Component
const SidebarBody = (props) => {
  return (
    <div
      className="flex h-full w-full flex-1 flex-col overflow-hidden overflow-y-auto p-4"
      {...props}
    />
  );
};

// 3. SidebarLink Component
const SidebarLink = ({ link, className = "", ...props }) => {
  const { open } = useContext(SidebarContext);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all group cursor-pointer ${className}`}
      whileHover={{
        backgroundColor: "rgba(6, 182, 212, 0.1)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {(isHovered || link.active) && (
        <motion.div
          layoutId="active-nav-line"
          className={`absolute left-0 top-0 bottom-0 w-1 ${link.active ? 'bg-purple-500' : 'bg-cyan-500'} rounded-r-full`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}

      <div className="relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors">
        {link.icon}
      </div>

      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 whitespace-nowrap text-sm font-medium text-gray-300 group-hover:text-white transition-colors font-sans"
          >
            {link.label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.a>
  );
};

// 4. SidebarLogo Component
const SidebarLogo = () => {
  const { open } = useContext(SidebarContext);
  
  return (
    <div className="relative z-20 flex items-center gap-3 px-2 py-4 mb-4 border-b border-white/5">
      <div className="w-10 h-10 flex items-center justify-center shrink-0">
        <img src={iconLogo} alt="EnvyGuard" className="w-full h-full object-contain" />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col"
          >
            <span className="font-bold text-lg tracking-wider font-mono text-white">ENVYGUARD</span>
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Sistema V2.0</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// 5. UserProfile Component
const UserProfile = ({ user }) => {
  const { open } = useContext(SidebarContext);

  return (
    <div className="border-t border-white/5 pt-4 mt-2">
      <motion.div
        className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors"
        layout
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
          {user?.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover" />
          ) : (
            user?.name?.charAt(0) || "A"
          )}
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col overflow-hidden"
            >
              <span className="text-sm font-medium text-gray-200 truncate">
                {user?.name || "Administrador"}
              </span>
              <span className="text-xs text-gray-500 truncate font-mono">
                {user?.role || "Nivel: Root"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        
        {open && <MoreVertical className="ml-auto text-gray-500 w-4 h-4" />}
      </motion.div>
      <SidebarLink link={{ label: "Cerrar Sesión", href: "#logout", icon: <LogOut /> }} className="mt-2 text-red-400" />
    </div>
  );
};

// --- DASHBOARD CONTENT ---

const DashboardContent = () => {
  // Animación base para la aparición de elementos
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="flex flex-1 flex-col gap-6 rounded-tl-2xl border border-cyan-500/20 bg-[#050505] p-4 md:p-8 backdrop-blur-xl overflow-y-auto">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
          Panel de Control
        </h1>
        <p className="text-sm text-cyan-500/70 font-mono">
          Sistema de monitoreo y comando en tiempo real ENVYGUARD
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ 
          visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } 
        }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Agentes Activos", value: "12", icon: Shield, color: "from-cyan-600 to-cyan-400" },
          { label: "Comandos Ejecutados", value: "48", icon: Activity, color: "from-purple-600 to-purple-400" },
          { label: "Incidentes Resueltos", value: "87%", icon: CheckCircle2, color: "from-green-600 to-green-400" },
          { label: "Uptime Promedio", value: "99.8%", icon: TrendingUp, color: "from-cyan-600 to-cyan-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            variants={fadeInUp}
            whileHover={{
              borderColor: "rgba(34, 211, 238, 0.6)",
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
              y: -5,
            }}
            className="group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm transition-all cursor-pointer"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-400 font-mono">{stat.label}</span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-black`}
                >
                  <stat.icon size={20} />
                </motion.div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } } }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Actividad de Sistemas */}
        <motion.div
          variants={fadeInUp}
          className="rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4 font-sans">Estado de Servicios Críticos</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "Agente Principal", status: true },
              { name: "Orquestador Java", status: true },
              { name: "Gateway de API", status: true },
              { name: "Servidor RabbitMQ", status: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-transparent border border-cyan-500/10"
              >
                <span className="text-sm text-cyan-300 font-mono">{item.name}</span>
                <div className="flex items-center gap-2">
                  {item.status ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-500 font-mono">Activo</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-xs text-red-500 font-mono">Inactivo</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alertas Recientes */}
        <motion.div
          variants={fadeInUp}
          className="rounded-xl border border-purple-500/20 bg-black/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-purple-400 mb-4 font-sans">Bloqueos de Tráfico Recientes</h3>
          <div className="flex flex-col gap-3">
            {[
              { message: "Bloqueo DNS: tiktok.com", severity: "warning" },
              { message: "Comando: REINICIO_REMOTO (PC-04)", severity: "success" },
              { message: "Bloqueo Hosts: facebook.com", severity: "warning" },
              { message: "Instalación: Firefox.exe (PC-12)", severity: "success" },
            ].map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alert.severity === "warning"
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-cyan-500/5 border-cyan-500/20"
                }`}
              >
                {alert.severity === "warning" ? (
                  <AlertTriangle size={16} className="text-yellow-400 shrink-0" />
                ) : (
                  <CheckCircle2 size={16} className="text-cyan-400 shrink-0" />
                )}
                <span className={`text-sm font-mono ${
                  alert.severity === "warning" ? "text-yellow-300" : "text-cyan-300"
                }`}>
                  {alert.message}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Performance Chart */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.6 }}
        className="rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-cyan-400 mb-6 font-sans">Rendimiento Promedio de Flota</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "CPU", value: 45, unit: "%" },
            { label: "Memoria", value: 62, unit: "%" },
            { label: "Red (Latencia)", value: 28, unit: "ms" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-500 font-mono">{metric.label}</span>
                <span className="text-2xl font-bold text-white">{metric.value}{metric.unit}</span>
              </div>
              <div className="h-2 rounded-full bg-cyan-500/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);
  
  const currentUser = {
    name: "Juan Pérez",
    role: "Admin Principal",
  };

  const links = [
    { label: "Panel Principal", href: "#dashboard", icon: <LayoutGrid />, active: true },
    { label: "Agentes", href: "#agents", icon: <Shield /> },
    { label: "Monitoreo Remoto", href: "#monitoring", icon: <Monitor /> },
    { label: "Despliegue de Apps", href: "#deploy", icon: <Download /> },
    { label: "Logs y Tráfico", href: "#logs", icon: <FileText /> },
    { label: "Configuración", href: "#settings", icon: <Settings /> },
  ];

  return (
    <div className="flex w-full min-h-screen bg-black overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody>
          {/* Top Section */}
          <div className="flex flex-col w-full">
            <SidebarLogo />
            
            {/* Navigation Links */}
            <nav className="flex flex-col gap-0 w-full mt-8 px-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>
          </div>

          {/* Bottom Section - User Profile */}
          <UserProfile user={currentUser} />
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <DashboardContent />
    </div>
  );
}

export default DashboardLayout;