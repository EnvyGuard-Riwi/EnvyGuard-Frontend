import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, MoreVertical, ChevronRight } from "lucide-react";

// Contexto para manejar el estado del sidebar si es necesario compartirlo
const SidebarContext = createContext(undefined);

export const Sidebar = ({ children, open, setOpen, animate = true }) => {
return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
    <motion.div
        className="relative flex h-full flex-col bg-[#050505] border-r border-white/10 overflow-hidden w-[80px]" // Base width styles
        animate={{
        width: open ? 280 : 80,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
    >
        {/* Decorative Glow inside Sidebar */}
        <div className="absolute top-0 left-0 w-full h-32 bg-cyan-500/5 blur-3xl pointer-events-none" />
        
        {children}
    </motion.div>
    </SidebarContext.Provider>
);
};

export const SidebarBody = (props) => {
return (
    <div
    className="flex h-full w-full flex-1 flex-col overflow-hidden overflow-y-auto justify-between p-4"
    {...props}
    />
);
};

export const SidebarLink = ({ link, className = "", ...props }) => {
const { open, animate } = useContext(SidebarContext);
const [isHovered, setIsHovered] = useState(false);

return (
    <motion.a
    href={link.href}
    className={`relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all group cursor-pointer ${className}`}
    whileHover={{
        backgroundColor: "rgba(6, 182, 212, 0.1)", // Cyan-500 with low opacity
    }}
    onHoverStart={() => setIsHovered(true)}
    onHoverEnd={() => setIsHovered(false)}
    {...props}
    >
    {/* Active Indicator Line */}
    {isHovered && (
        <motion.div
        layoutId="active-nav-line"
        className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 rounded-r-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        />
    )}

    {/* Icon */}
    <div className="relative z-10 flex-shrink-0 w-6 h-6 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors">
        {link.icon}
    </div>

    {/* Label */}
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

export const SidebarLogo = () => {
const { open } = useContext(SidebarContext);

return (
    <div className="relative z-20 flex items-center gap-3 px-2 py-4 mb-4 border-b border-white/5">
    {/* Icono siempre visible */}
    <div className="w-8 h-8 flex items-center justify-center bg-cyan-500/10 border border-cyan-500/20 rounded-lg shrink-0">
        <LayoutGrid className="text-cyan-500 w-5 h-5" />
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

export const UserProfile = ({ user }) => {
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
            user?.name?.charAt(0) || "U"
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
    </div>
);
};