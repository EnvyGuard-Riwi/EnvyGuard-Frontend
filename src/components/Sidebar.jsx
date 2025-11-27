import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export const Sidebar = ({ open, setOpen, children }) => {
  return (
    <motion.div
      animate={{
        width: open ? 280 : 80,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="relative flex h-full flex-col bg-gradient-to-b from-black via-black/95 to-cyan-950/20 border-r border-cyan-500/30 overflow-hidden pt-6"
    >
      <button
        onClick={() => setOpen(!open)}
        className="absolute right-4 top-6 z-50 inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:text-cyan-400 transition-colors"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>
      {children}
    </motion.div>
  );
};

export const SidebarBody = (props) => {
  return (
    <div
      className="flex h-full w-full flex-1 flex-col overflow-hidden overflow-y-auto gap-8"
      {...props}
    />
  );
};

export const SidebarLink = ({ link, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={link.href}
      className={`relative flex items-center gap-4 px-4 py-3 rounded-lg transition-all group text-sm font-medium ${className}`}
      whileHover={{
        backgroundColor: "rgba(34, 211, 238, 0.1)",
        borderColor: "rgba(34, 211, 238, 0.5)",
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Icon */}
      <div className="relative z-10 flex-shrink-0 w-5 h-5 flex items-center justify-center">
        {typeof link.icon === "string" ? (
          <img
            src={link.icon}
            className="h-full w-full rounded-full object-cover"
            alt={link.label}
          />
        ) : (
          <motion.div
            animate={{
              color: isHovered ? "#22d3ee" : "#94a3b8",
            }}
            transition={{ duration: 0.2 }}
          >
            {link.icon}
          </motion.div>
        )}
      </div>

      {/* Label */}
      <motion.span
        animate={{
          opacity: 1,
          x: 0,
        }}
        className="relative z-10 whitespace-nowrap text-neutral-300 group-hover:text-cyan-300 transition-colors"
      >
        {link.label}
      </motion.span>
    </motion.a>
  );
};

export const Logo = () => {
  return (
    <motion.a
      href="/"
      className="relative z-20 flex items-center gap-3 py-2 px-4"
      whileHover={{ scale: 1.05 }}
    >
      <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="whitespace-nowrap text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-300"
      >
        EnvyGuard
      </motion.span>
    </motion.a>
  );
};

export const LogoIcon = () => {
  return (
    <motion.a
      href="/"
      className="relative z-20 flex items-center justify-center py-2 px-4"
      whileHover={{ scale: 1.1 }}
    >
      <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 shadow-lg shadow-cyan-500/50" />
    </motion.a>
  );
};

