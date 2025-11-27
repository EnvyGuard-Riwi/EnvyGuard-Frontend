import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import iconLogo from '../assets/icons/icon.png';
import { 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Wifi, 
  Server, 
  Download,
  Lock,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';

// --- UTILS & HOOKS ---

function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener("mousemove", updateMousePosition);
    return () => window.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return mousePosition;
}

// Hook para efecto de texto "Matrix/Desencriptado"
const useScrambleText = (text) => {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

  useEffect(() => {
    let interval;
    if (isHovering) {
      let iteration = 0;
      interval = setInterval(() => {
        setDisplayText(prev => 
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) {
                return text[index];
              }
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
    } else {
      setDisplayText(text);
    }

    return () => clearInterval(interval);
  }, [isHovering, text]);

  return { displayText, setIsHovering };
};

// --- VISUAL COMPONENTS ---

// 0. Custom Cursor
const CustomCursor = () => {
  const mouse = useMousePosition();
  
  return (
    <>
      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 border border-cyan-500 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center mix-blend-difference"
        animate={{ x: mouse.x - 16, y: mouse.y - 16 }}
        transition={{ type: "spring", stiffness: 500, damping: 28 }}
      >
        <div className="w-2 h-2 bg-cyan-400 rounded-full shadow-lg shadow-cyan-500/80" />
      </motion.div>
      <motion.div 
         className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[9999] hidden md:block mix-blend-difference"
         animate={{ x: mouse.x - 4, y: mouse.y - 4 }}
         transition={{ type: "spring", stiffness: 1500, damping: 28 }}
      />
    </>
  );
};

// 1. Boot Sequence Overlay
const BootSequence = ({ onComplete }) => {
  const [lines, setLines] = useState([]);
  
  useEffect(() => {
    const bootLines = [
      "INITIALIZING_KERNEL...",
      "LOADING_MODULES [OK]",
      "CHECKING_INTEGRITY...",
      "ESTABLISHING_SECURE_UPLINK...",
      "DECRYPTING_INTERFACE...",
      "ACCESS_GRANTED"
    ];

    let delay = 0;
    bootLines.forEach((line, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, line]);
        if (index === bootLines.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 bg-black z-[999] flex items-center justify-center font-mono text-cyan-500"
      exit={{ opacity: 0, filter: "blur(10px)" }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-96">
        {lines.map((line, i) => (
          <div key={i} className="mb-1 text-sm">
            <span className="opacity-50 mr-2">{`>0x${(100 + i).toString(16).toUpperCase()}`}</span>
            {line}
          </div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-3 h-5 bg-cyan-500 mt-2"
        />
      </div>
      
      {/* Scanline for Boot */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-50" />
    </motion.div>
  );
};

// 2. Glitch Text Title
const GlitchTitle = ({ text }) => {
  return (
    <div className="relative inline-block group">
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight relative z-10">
        {text}
      </h1>
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight absolute top-0 left-0 -z-10 text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[2px]">
        {text}
      </h1>
      <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight absolute top-0 left-0 -z-10 text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse -translate-x-[2px]">
        {text}
      </h1>
    </div>
  );
};

// 3. Cipher Text Badge
const CipherBadge = ({ label, icon: Icon }) => {
  const { displayText, setIsHovering } = useScrambleText(label);
  
  return (
    <div 
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      className="group relative flex items-center gap-2 px-4 py-2 rounded-full bg-black border border-white/10 overflow-hidden cursor-crosshair transition-all hover:border-cyan-500/50 hover:bg-cyan-950/20"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
      {Icon && <Icon size={16} className="text-gray-400 group-hover:text-cyan-400 transition-colors z-10" />}
      <span className="text-xs font-mono text-gray-300 z-10 min-w-[80px]">{displayText}</span>
    </div>
  );
};

// 4. Enhanced Retro Background (Moving Grid)
const RetroGrid = () => {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-[#050505]" />
      
      {/* Global Scanline */}
      <div className="fixed inset-0 z-50 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <motion.div 
        className="fixed inset-0 z-40 pointer-events-none bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent h-[10vh]"
        animate={{ top: ['-10%', '110%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      
      {/* Moving Grid Perspective */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, #222 1px, transparent 1px), linear-gradient(to bottom, #222 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'linear-gradient(to bottom, transparent 5%, black 40%, transparent 95%)',
          transform: 'perspective(500px) rotateX(60deg) translateY(-100px) scale(2)',
          transformOrigin: 'top center',
        }}
      >
        <motion.div 
          className="w-full h-full"
          animate={{ y: [0, 40] }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        />
      </div>

      {/* Floating Particles/Stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-cyan-500 rounded-full box-shadow-[0_0_10px_cyan]"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random() * 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100 + "%"],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            style={{ width: Math.random() * 2 + 1 + 'px', height: Math.random() * 2 + 1 + 'px' }}
          />
        ))}
      </div>
    </div>
  );
};

// 6. Enhanced Terminal (CRT Effect)
const TerminalPreview = () => {
  const [lines, setLines] = useState([
    "> SYSTEM_INIT...",
    "> CONNECTING_TO_ORCHESTRATOR...",
  ]);

  useEffect(() => {
    const commands = [
      "> NODE_DETECTED: [192.168.1.45]",
      "> PKG_INSTALL: 'chrome_installer.msi'",
      "> SUCCESS: DEPLOYMENT_COMPLETE",
      "> UPLOADING_LOGS...",
      "> HEARTBEAT_ACK"
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLines(prev => {
        const newLines = [...prev, commands[i % commands.length]];
        if (newLines.length > 7) newLines.shift();
        return newLines;
      });
      i++;
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-[#050505] group">
      
      {/* CRT Screen Glow */}
      <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />

      {/* Header */}
      <div className="bg-[#0f0f0f] px-4 py-2 flex items-center justify-between border-b border-white/5 relative z-10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
        </div>
        <span className="text-xs text-gray-600 font-mono">root@mission-control:~</span>
      </div>

      {/* Content */}
      <div className="p-5 h-64 flex flex-col justify-end font-mono text-xs relative overflow-hidden">
        {/* Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_4px,3px_100%] pointer-events-none" />
        <div className="absolute inset-0 bg-cyan-500/5 blur-[0.5px] z-10 pointer-events-none" />

        <div className="relative z-30 space-y-1">
          {lines.map((line, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, x: -5 }} 
              animate={{ opacity: 1, x: 0 }}
              className={`${line.includes("SUCCESS") ? "text-green-400" : line.includes("PKG") ? "text-yellow-400" : "text-gray-400"}`}
            >
              <span className="opacity-50 mr-2">{(new Date()).toLocaleTimeString('en-US', {hour12: false})}</span>
              {line}
            </motion.div>
          ))}
          <motion.div 
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-cyan-500 mt-2 font-bold"
          >
            _
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// --- LOGIN MODAL COMPONENT ---
const LoginModal = ({ isOpen, onClose, buttonRef }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Obtener posición del botón para la animación de origen
  const getButtonPosition = () => {
    if (buttonRef && buttonRef.current) {
      return buttonRef.current.getBoundingClientRect();
    }
    return { top: 0, right: 0, width: 120, height: 40 };
  };

  const buttonPos = getButtonPosition();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop con efecto de contracción hacia el botón */}
          <motion.div
            initial={{ 
              scale: 1, 
              opacity: 0,
              originX: 1,
              originY: 0
            }}
            animate={{ 
              scale: 1, 
              opacity: 0.5,
              originX: 1,
              originY: 0
            }}
            exit={{ 
              scale: 1, 
              opacity: 0,
              originX: 1,
              originY: 0,
              transition: { duration: 0.4, delay: 0.2 }
            }}
            transition={{ duration: 0.5 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[200] cursor-pointer"
          />

          {/* Contenedor del modal con animación */}
          <motion.div
            initial={{ 
              opacity: 0,
              x: 0,
              originX: 1,
              originY: 0,
              scale: 0.3,
              transformOrigin: `${buttonPos.right}px ${buttonPos.top}px`
            }}
            animate={{ 
              opacity: 1,
              x: 0,
              scale: 1,
              transition: { delay: 0.05, duration: 0.35, ease: "easeOut" }
            }}
            exit={{ 
              opacity: 0,
              x: 600,
              scale: 0.3,
              transformOrigin: `${buttonPos.right}px ${buttonPos.top}px`,
              transition: { duration: 0.2, ease: "easeIn" }
            }}
            className="fixed top-0 right-0 h-screen w-full md:w-[500px] z-[300]"
          >
            {/* Panel del modal */}
            <div className="w-full h-full bg-gradient-to-br from-black via-black to-cyan-950/20 border-l border-cyan-500/50 backdrop-blur-2xl flex flex-col p-8 relative overflow-hidden shadow-2xl shadow-cyan-500/20">
              
              {/* Efecto de línea de escaneo */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none" />
              
              {/* Glow effects - Mejorados */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/15 blur-[140px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-[120px] pointer-events-none" />
              
              {/* Borde luminoso animado */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ repeat: Infinity, duration: 3 }}
              />

              {/* Contenido */}
              <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
                    <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 drop-shadow-lg">
                      Acceso Seguro
                    </h2>
                    <p className="text-xs text-cyan-500/80 font-mono mt-2 flex items-center gap-2">
                      <span className="inline-block w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
                      Sistema Restringido
                    </p>
                  </motion.div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="text-gray-400 hover:text-cyan-300 transition-colors flex-shrink-0 hover:shadow-lg hover:shadow-cyan-500/50"
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Divider animado */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="h-px bg-gradient-to-r from-cyan-500/30 via-cyan-500/60 to-transparent mb-8 origin-left shadow-lg shadow-cyan-500/30"
                />

                {/* Form */}
                <motion.form 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  className="flex-1 flex flex-col gap-6"
                >
                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <label className="block text-sm font-mono text-cyan-300 mb-2 flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">#</span> Correo Electrónico
                    </label>
                    <motion.input
                      whileFocus={{ 
                        borderColor: "rgb(34, 211, 238)", 
                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.1)",
                        scale: 1.02
                      }}
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@envyguard.com"
                      className="w-full bg-black/60 border-2 border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-mono text-sm hover:border-cyan-500/50"
                    />
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25, duration: 0.3 }}
                  >
                    <label className="block text-sm font-mono text-cyan-300 mb-2 flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">#</span> Contraseña
                    </label>
                    <motion.input
                      whileFocus={{ 
                        borderColor: "rgb(34, 211, 238)", 
                        boxShadow: "0 0 30px rgba(34, 211, 238, 0.5), inset 0 0 10px rgba(34, 211, 238, 0.1)",
                        scale: 1.02
                      }}
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••"
                      className="w-full bg-black/60 border-2 border-cyan-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none transition-all font-mono text-sm hover:border-cyan-500/50"
                    />
                  </motion.div>

                  {/* Remember Me */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="flex items-center gap-3 p-3 bg-cyan-950/20 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
                  >
                    <input
                      type="checkbox"
                      id="remember"
                      className="w-5 h-5 accent-cyan-500 cursor-pointer rounded"
                    />
                    <label htmlFor="remember" className="text-sm text-cyan-300 cursor-pointer font-mono flex-1">
                      Recuérdame en este dispositivo
                    </label>
                  </motion.div>

                  {/* Login Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.3 }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 0 40px rgba(34, 211, 238, 0.8), 0 0 60px rgba(59, 130, 246, 0.4)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    className="w-full bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-600 text-black font-bold py-3 rounded-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 mt-4 hover:from-cyan-400 hover:to-blue-500"
                  >
                    <Lock size={18} />
                    INICIAR SESIÓN
                  </motion.button>
                </motion.form>

                {/* Footer mejorado */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-center text-xs text-cyan-500/80 pt-6 border-t border-cyan-500/20 mt-8 font-mono space-y-2"
                >
                  <p className="font-bold tracking-widest">█ SISTEMA SEGURO █</p>
                  <p>Acceso restringido a usuarios autorizados</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- MAIN APP ---

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const loginButtonRef = useRef(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans cursor-none">
      
      {/* Boot Sequence */}
      <AnimatePresence>
        {loading && <BootSequence onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <CustomCursor />
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.04] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-none">
            <img src={iconLogo} alt="EnvyGuard" className="w-9 h-9 object-contain group-hover:scale-110 transition-transform" />
            <span className="font-bold text-lg tracking-wider font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">EnvyGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <motion.button
              ref={loginButtonRef}
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white px-4 py-2 rounded-full text-xs font-mono transition-all hover:bg-cyan-500/10 flex items-center gap-3 group cursor-none"
            >
              PANEL DE ACCESO
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                <ChevronRight size={14} className="group-hover:text-cyan-400 transition-colors"/>
              </motion.div>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
        <RetroGrid />
        
        <div className="max-w-7xl w-full mx-auto relative z-10 grid lg:grid-cols-2 gap-16 items-center mt-10">
          <div className="order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: loading ? 0 : 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-xs font-mono mb-6 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                ESTADO DEL SISTEMA: EN LÍNEA
              </div>
              
              <GlitchTitle text="Control Total." />
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">Sin Latencia.</span>
              </h1>
              
              <p className="text-gray-400 text-lg mb-8 max-w-lg leading-relaxed border-l-2 border-cyan-900/50 pl-6">
                Orquesta agentes remotos con precisión de nivel militar. 
                Telemetría en tiempo real, despliegue silencioso y control absoluto sobre tu infraestructura.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="relative px-8 py-4 bg-cyan-500 text-black font-bold rounded-lg overflow-hidden group cursor-none">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    <Download size={20} /> Desplegar Agente
                  </span>
                </button>
                <button className="px-8 py-4 bg-transparent border border-gray-800 hover:border-cyan-500/50 text-white rounded-lg transition-all flex items-center justify-center gap-2 group hover:bg-cyan-950/10 cursor-none">
                  <Terminal size={20} className="group-hover:text-cyan-400" />
                  <span>Documentación</span>
                </button>
              </div>

              <div className="mt-12 flex flex-wrap gap-3">
                <CipherBadge label="C# .NET" icon={Terminal} />
                <CipherBadge label="Spring Boot" icon={Server} />
                <CipherBadge label="RabbitMQ" icon={Activity} />
                <CipherBadge label="React" icon={LayoutGrid} />
              </div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="order-1 lg:order-2 relative perspective-1000"
          >
            {/* Glow behind terminal */}
            <div className="absolute inset-0 bg-cyan-500/10 blur-[100px] rounded-full" />
            
            <div className="relative transform transition-transform hover:scale-[1.02] duration-500">
              <TerminalPreview />
              
              {/* Floating Widgets */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -right-8 top-12 bg-black/80 border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl w-40"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Wifi className="text-green-400" size={16} />
                  <span className="text-[10px] font-mono text-gray-400">RED</span>
                </div>
                <div className="text-2xl font-bold text-white font-mono tracking-tighter">98.2%</div>
                <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-green-500" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -left-20 -bottom-14 bg-black/80 border border-gray-800 p-4 rounded-xl shadow-2xl backdrop-blur-xl w-48"
              >
                <div className="flex items-center gap-3 mb-2">
                  <ShieldAlert className="text-purple-400" size={16} />
                  <span className="text-[10px] font-mono text-gray-400">AMENAZAS</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">142 BLOQUEADOS</div>
                <div className="text-[10px] text-gray-500 mt-1">Últimas 24 horas</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        buttonRef={loginButtonRef}
      />
    </div>
  );
}
