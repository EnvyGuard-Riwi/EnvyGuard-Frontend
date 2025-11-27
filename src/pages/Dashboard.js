import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink, Logo, LogoIcon } from "../components/Sidebar";
import {
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  Shield,
  Activity,
  Zap,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const DashboardContent = () => {
  return (
    <div className="flex flex-1 flex-col gap-6 rounded-tl-2xl border border-cyan-500/30 bg-gradient-to-br from-black via-black to-cyan-950/20 p-4 md:p-8 backdrop-blur-xl overflow-y-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-2"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300">
          Dashboard
        </h1>
        <p className="text-sm text-cyan-500/60 font-mono">
          Sistema de monitoreo y control en tiempo real
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: "Agentes Activos", value: "12", icon: Shield, color: "from-cyan-600 to-cyan-400" },
          { label: "Sistemas Monitoreados", value: "48", icon: Activity, color: "from-cyan-500 to-cyan-300" },
          { label: "Incidentes Resueltos", value: "87%", icon: CheckCircle2, color: "from-blue-600 to-blue-400" },
          { label: "Uptime", value: "99.8%", icon: TrendingUp, color: "from-cyan-600 to-cyan-400" },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + idx * 0.1 }}
            whileHover={{
              borderColor: "rgba(34, 211, 238, 0.6)",
              boxShadow: "0 0 30px rgba(34, 211, 238, 0.3)",
              y: -5,
            }}
            className="group relative overflow-hidden rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm transition-all"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-cyan-500/60 font-mono">{stat.label}</span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 10 }}
                  className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} text-black`}
                >
                  <stat.icon size={20} />
                </motion.div>
              </div>
              <p className="text-2xl md:text-3xl font-bold text-cyan-400">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Actividad de Sistemas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Actividad de Sistemas</h3>
          <div className="flex flex-col gap-3">
            {[
              { name: "Web Server", status: true },
              { name: "Database", status: true },
              { name: "API Gateway", status: true },
              { name: "Cache Server", status: true },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-500/5 border border-cyan-500/10"
              >
                <span className="text-sm text-cyan-300 font-mono">{item.name}</span>
                <div className="flex items-center gap-2">
                  {item.status ? (
                    <>
                      <div className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                      <span className="text-xs text-cyan-500">Activo</span>
                    </>
                  ) : (
                    <>
                      <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      <span className="text-xs text-red-500">Inactivo</span>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Alertas Recientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm"
        >
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">Alertas Recientes</h3>
          <div className="flex flex-col gap-3">
            {[
              { message: "Pico de CPU detectado", severity: "warning" },
              { message: "Backup completado correctamente", severity: "success" },
              { message: "Conexión restaurada", severity: "success" },
              { message: "Memoria en 75%", severity: "warning" },
            ].map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                className={`flex items-center gap-3 p-3 rounded-lg border ${
                  alert.severity === "warning"
                    ? "bg-yellow-500/5 border-yellow-500/20"
                    : "bg-cyan-500/5 border-cyan-500/20"
                }`}
              >
                {alert.severity === "warning" ? (
                  <AlertCircle size={16} className="text-yellow-400 shrink-0" />
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="rounded-xl border border-cyan-500/20 bg-black/50 p-6 backdrop-blur-sm"
      >
        <h3 className="text-lg font-semibold text-cyan-400 mb-6">Rendimiento del Sistema</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "CPU", value: 45, unit: "%" },
            { label: "Memoria", value: 62, unit: "%" },
            { label: "Red", value: 28, unit: "%" },
          ].map((metric, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
              className="flex flex-col gap-3"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm text-cyan-500 font-mono">{metric.label}</span>
                <span className="text-lg font-bold text-cyan-400">{metric.value}{metric.unit}</span>
              </div>
              <div className="h-2 rounded-full bg-cyan-500/20 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.6 + idx * 0.1 }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default function Dashboard() {
  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Agentes",
      href: "/dashboard/agents",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      label: "Perfil",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      label: "Configuración",
      href: "/dashboard/settings",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      label: "Cerrar Sesión",
      href: "/",
      icon: <LogOut className="h-5 w-5" />,
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div className="flex w-full h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-start px-2">
          <div className="flex flex-col w-full gap-4">
            {open ? <Logo /> : <LogoIcon />}
            <div className="border-t border-cyan-500/20" />
            <nav className="flex flex-col gap-1 w-full">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </nav>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <DashboardContent />
    </div>
  );
}
