import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import iconLogo from '../assets/icons/icon.png';
import { useNavigate } from 'react-router-dom';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { 
  Terminal, 
  Activity, 
  ShieldAlert, 
  Wifi, 
  Server, 
  Download,
  Lock,
  LayoutGrid,
  ChevronRight,
  Mail,
  Key,
  Eye,
  EyeOff
} from 'lucide-react';

// Importar hooks desde la carpeta correcta
import { useMousePosition } from '../hooks/useMousePosition';
import { useScrambleText } from '../hooks/useScrambleText';
import AuthService from '../services/AuthService';

// --- VISUAL COMPONENTS ---

// 0. Custom Cursor
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
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight relative z-10 break-words">
        {text}
      </h1>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight absolute top-0 left-0 -z-10 text-red-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse translate-x-[2px] break-words">
        {text}
      </h1>
      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 tracking-tight absolute top-0 left-0 -z-10 text-cyan-500 opacity-0 group-hover:opacity-70 group-hover:animate-pulse -translate-x-[2px] break-words">
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
    <div className="relative w-full max-w-lg sm:max-w-md rounded-lg overflow-hidden border border-white/10 shadow-2xl bg-[#050505] group">
      
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
      <div className="p-3 sm:p-5 h-48 sm:h-64 flex flex-col justify-end font-mono text-xs relative overflow-hidden">
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
const LoginModal = ({ isOpen, onClose, buttonRef, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mouse = useMousePosition();
  const navigate = useNavigate();

  // 1. Calcular la posición del botón para la animación de origen/destino
  const getButtonPosition = () => {
    if (buttonRef && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      return { top: rect.top, right: window.innerWidth - rect.right, width: rect.width, height: rect.height };
    }
    return { top: 20, right: 20, width: 120, height: 40 };
  };

  const buttonPos = getButtonPosition();

  // Animación del contenedor del modal
  const modalVariants = {
    hidden: { 
      opacity: 0,
      scale: 0.3,
      transformOrigin: `${window.innerWidth - buttonPos.right}px ${buttonPos.top + (buttonPos.height / 2)}px`,
      x: 0,
      y: 0
    },
    visible: { 
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      transition: { 
        delay: 0.05, 
        duration: 0.4, 
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: { 
      opacity: 0,
      scale: 0.3,
      transformOrigin: `${window.innerWidth - buttonPos.right}px ${buttonPos.top + (buttonPos.height / 2)}px`,
      transition: { duration: 0.3, ease: "easeIn" }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setIsSubmitting(true);
    
    try {
      // Validar que los campos no estén vacíos
      if (!email || !password) {
        setError('Por favor completa todos los campos');
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      // Validar formato de email básico
      if (!email.includes('@')) {
        setError('Por favor ingresa un correo electrónico válido');
        setLoading(false);
        setIsSubmitting(false);
        return;
      }

      // Llamar a AuthService.login
      const response = await AuthService.login(email, password);
      
      console.log('=== LOGIN EXITOSO ===');
      console.log('Response completa:', response);
      console.log('Response.user:', response.user);
      
      // Limpiar error
      setError('');
      setLoading(false);
      
      // Cerrar modal y mostrar toast de éxito
      onClose();
      if (onSuccess) {
        onSuccess('¡Bienvenido! Inicio de sesión exitoso');
      }
      
      // Después de 1.5 segundos, redirigir al dashboard
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/dashboard');
      }, 1500);
      
    } catch (err) {
      console.error('Error de login:', err);
      
      // Traducir mensajes de error comunes
      let errorMessage = 'Error al iniciar sesión. Verifica tus credenciales.';
      
      const errorText = err.message?.toLowerCase() || '';
      const errorData = err.response?.data?.message?.toLowerCase() || '';
      
      if (errorText.includes('invalid') || errorText.includes('incorrect') || 
          errorText.includes('wrong') || errorData.includes('invalid') ||
          errorText.includes('unauthorized') || errorData.includes('unauthorized') ||
          err.response?.status === 401) {
        errorMessage = 'Correo o contraseña incorrectos. Por favor verifica tus datos.';
      } else if (errorText.includes('not found') || errorData.includes('not found') ||
                 err.response?.status === 404) {
        errorMessage = 'Usuario no encontrado. Verifica tu correo electrónico.';
      } else if (errorText.includes('network') || errorText.includes('timeout')) {
        errorMessage = 'Error de conexión. Por favor verifica tu conexión a internet.';
      } else if (errorText.includes('too many') || err.response?.status === 429) {
        errorMessage = 'Demasiados intentos. Por favor espera unos minutos.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Error del servidor. Por favor intenta más tarde.';
      } else if (err.response?.data?.message) {
        // Si el backend envía un mensaje específico, usarlo
        errorMessage = err.response.data.message;
      }
      
      setError(errorMessage);
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Resetear estados cuando se cierra el modal
  React.useEffect(() => {
    if (!isOpen) {
      setShowPassword(false);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop mejorado */}
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 0.7, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] cursor-pointer"
          />

          {/* Contenedor del modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 sm:w-96 md:w-[500px] z-[300] overflow-y-auto"
          >
            {/* Panel del modal */}
            <div className="w-full h-full bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 border-0 sm:border-l border-gray-700/50 backdrop-blur-2xl flex flex-col p-6 sm:p-10 relative overflow-hidden shadow-2xl shadow-gray-600/10">
              
              {/* Cuadrícula de fondo animada - ACORDE CON EL DISEÑO DE LA PÁGINA */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, rgba(107, 114, 128, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(107, 114, 128, 0.15) 1px, transparent 1px)`,
                  backgroundSize: '50px 50px',
                  backgroundPosition: `${(mouse.x % 50)}px ${(mouse.y % 50)}px`,
                  transition: 'background-position 0.1s linear'
                }}
              />

              {/* Líneas de escaneo CRT */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(107,114,128,0.03),rgba(107,114,128,0.02),rgba(107,114,128,0.03))] z-0 bg-[length:100%_4px,3px_100%] pointer-events-none opacity-60" />
              
              {/* Glow effects mejorados */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gray-600/8 blur-[120px] pointer-events-none rounded-full" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-500/8 blur-[120px] pointer-events-none rounded-full" />
              
              {/* Borde superior animado con más intensidad */}
              <motion.div 
                className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent"
                animate={{ opacity: [0.4, 1, 0.4], boxShadow: ["0 0 10px rgba(107, 114, 128, 0.5)", "0 0 30px rgba(107, 114, 128, 1)", "0 0 10px rgba(107, 114, 128, 0.5)"] }}
                transition={{ repeat: Infinity, duration: 4 }}
              />

                {/* Partículas decorativas */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-1 h-1 bg-gray-500 rounded-full"
                      initial={{ x: Math.random() * 100 + "%", y: Math.random() * 100 + "%" }}
                      animate={{ 
                        x: [null, Math.random() * 100 + "%"],
                        y: [null, Math.random() * 100 + "%"],
                        opacity: [0.5, 0.8, 0.5]
                      }}
                      transition={{ 
                        duration: Math.random() * 8 + 6, 
                        repeat: Infinity, 
                        ease: "linear" 
                      }}
                    />
                  ))}
                </div>

              {/* Contenido principal */}
              <div className="relative z-10 flex flex-col h-full">
                
                {/* Header */}
                <div className="flex items-center justify-between mb-8 sm:mb-10 flex-col sm:flex-row gap-4">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15, duration: 0.4 }}
                    className="flex-1"
                  >
                    <h2 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-lg font-sans">
                      Acceso de Root
                    </h2>
                    <p className="text-[10px] sm:text-xs text-cyan-500/70 font-mono mt-2 sm:mt-3 flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span>
                      ENVYGUARD ORQUESTADOR v1.2.5
                    </p>
                  </motion.div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.15 }}
                    whileTap={{ scale: 0.85 }}
                    onClick={onClose}
                    className="text-gray-400 hover:text-cyan-400 transition-colors flex-shrink-0 relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-cyan-500/20 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 3, opacity: [0.5, 0, 0.5] }}
                    />
                    <svg className="w-6 sm:w-7 h-6 sm:h-7 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Divider animado */}
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6 sm:mb-10 origin-left shadow-lg shadow-gray-600/50"
                />

                {/* Formulario */}
                <motion.form 
                  onSubmit={handleSubmit}
                  className="flex-1 flex flex-col gap-4 sm:gap-6 mb-6 sm:mb-8"
                >
                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/20 border border-red-500/50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-red-400 text-xs sm:text-sm font-mono"
                    >
                      ❌ {error}
                    </motion.div>
                  )}

                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="group"
                  >
                    <label className="block text-[11px] sm:text-xs font-mono text-cyan-400 mb-2 sm:mb-3 flex items-center gap-2 tracking-wider">
                      <Mail size={14} className="text-cyan-400 flex-shrink-0" /> 
                      USUARIO / CORREO
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@envyguard"
                        disabled={loading}
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500/30 group-focus-within:text-cyan-500/60 transition-colors">
                        <Terminal size={16} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.4 }}
                    className="group"
                  >
                    <label className="block text-[11px] sm:text-xs font-mono text-cyan-400 mb-2 sm:mb-3 flex items-center gap-2 tracking-wider">
                      <Key size={14} className="text-cyan-400 flex-shrink-0" /> 
                      CONTRASEÑA
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••••••"
                        disabled={loading}
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono group-focus-within:shadow-[0_0_20px_rgba(6,182,212,0.2)] disabled:opacity-50 disabled:cursor-not-allowed pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyan-500/30 group-focus-within:text-cyan-500/60 hover:text-cyan-500/80 transition-colors"
                        title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </motion.div>

                  {/* Login Button */}
                  <motion.button
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    whileHover={!loading ? { 
                      scale: 1.02,
                      boxShadow: "0 0 40px rgba(6, 182, 212, 1), inset 0 0 20px rgba(34, 211, 238, 0.3)"
                    } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white font-bold py-2 sm:py-3 px-4 rounded-lg hover:shadow-2xl transition-all flex items-center justify-center gap-2 sm:gap-3 mt-2 sm:mt-4 font-sans text-sm sm:text-base tracking-wider border border-cyan-400/50 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    {loading ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="relative"
                        >
                          <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </motion.div>
                        <span className="relative">CONECTANDO...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} className="sm:w-[18px] sm:h-[18px] relative" />
                        <span className="relative">INICIAR SESIÓN</span>
                      </>
                    )}
                  </motion.button>

                </motion.form>

                {/* Footer de seguridad */}
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                  className="text-center text-[10px] sm:text-xs text-cyan-500/60 pt-6 sm:pt-8 border-t border-cyan-500/20 mt-auto font-mono space-y-1 sm:space-y-2"
                >
                  <p className="font-bold tracking-widest text-cyan-500/80">🔒 PUERTA SEGURA</p>
                  <p>Acceso restringido - Solo personal autorizado</p>
                  <p className="text-[9px] sm:text-[10px] text-cyan-600/50">Sesión registrada y monitoreada</p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- TOAST COMPONENT ---
const Toast = ({ toast, onClose }) => {
  React.useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => onClose(), 4000);
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

// --- MAIN APP ---

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [toast, setToast] = useState(null);
  const loginButtonRef = useRef(null);
  const { handleInstall, canInstall, isInstalling } = useInstallPrompt();
  
  // Función para mostrar toast
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden font-sans">
      
      {/* Boot Sequence */}
      <AnimatePresence>
        {loading && <BootSequence onComplete={() => setLoading(false)} />}
      </AnimatePresence>
      
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-[60] pointer-events-none opacity-[0.04] mix-blend-overlay" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3 group">
            <img src={iconLogo} alt="EnvyGuard" className="w-7 sm:w-9 h-7 sm:h-9 object-contain group-hover:scale-110 transition-transform" />
            <span className="font-bold text-sm sm:text-lg tracking-wider font-mono text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">EnvyGuard</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <motion.button
              ref={loginButtonRef}
              onClick={() => setShowLoginModal(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white px-3 sm:px-4 py-2 rounded-full text-xs font-mono transition-all hover:bg-cyan-500/10 flex items-center gap-2 sm:gap-3 group"
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
          {/* Mobile Login Button */}
          <motion.button
            ref={loginButtonRef}
            onClick={() => setShowLoginModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="md:hidden bg-white/5 border border-white/10 hover:border-cyan-500/50 text-white px-3 py-1.5 rounded-full text-[10px] font-mono transition-all hover:bg-cyan-500/10 flex items-center gap-1 group"
          >
            ACCESO
            <ChevronRight size={12} className="group-hover:text-cyan-400 transition-colors"/>
          </motion.button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6 overflow-hidden">
        <RetroGrid />
        
        <div className="max-w-7xl w-full mx-auto relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-16 items-center mt-6 sm:mt-10">
          <div className="order-2 lg:order-1">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: loading ? 0 : 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] sm:text-xs font-mono mb-4 sm:mb-6 shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                ESTADO DEL SISTEMA: EN LÍNEA
              </div>
              
              <GlitchTitle text="Control Total." />
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 tracking-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-gradient">Sin Latencia.</span>
              </h1>
              
              <p className="text-gray-400 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg leading-relaxed border-l-2 border-cyan-900/50 pl-4">
                Orquesta agentes remotos con precisión de nivel militar. 
                Telemetría en tiempo real, despliegue silencioso y control absoluto sobre tu infraestructura.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button 
                  onClick={() => canInstall && handleInstall()}
                  disabled={isInstalling && !canInstall}
                  className="relative px-6 sm:px-8 py-3 sm:py-4 bg-cyan-500 disabled:bg-cyan-600/50 text-black font-bold rounded-lg overflow-hidden group text-sm sm:text-base transition-all disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  <span className="relative flex items-center justify-center gap-2">
                    {isInstalling ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Download size={18} />
                        </motion.div>
                        Instalando...
                      </>
                    ) : (
                      <>
                        <Download size={18} /> Descargar
                      </>
                    )}
                  </span>
                </button>
                <button className="px-6 sm:px-8 py-3 sm:py-4 bg-transparent border border-gray-800 hover:border-cyan-500/50 text-white rounded-lg transition-all flex items-center justify-center gap-2 group hover:bg-cyan-950/10 text-sm sm:text-base">
                  <Terminal size={18} className="group-hover:text-cyan-400" />
                  <span>Documentación</span>
                </button>
              </div>

              <div className="mt-8 sm:mt-12 flex flex-wrap gap-2 sm:gap-3">
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
                className="absolute -right-4 sm:-right-8 top-8 sm:top-12 bg-black/80 border border-gray-800 p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-xl w-32 sm:w-40"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <Wifi className="text-green-400 flex-shrink-0" size={14} />
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-400">RED</span>
                </div>
                <div className="text-xl sm:text-2xl font-bold text-white font-mono tracking-tighter">98.2%</div>
                <div className="w-full h-1 bg-gray-800 mt-2 rounded-full overflow-hidden">
                  <div className="h-full w-[98%] bg-green-500" />
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute -left-12 sm:-left-20 -bottom-10 sm:-bottom-14 bg-black/80 border border-gray-800 p-3 sm:p-4 rounded-xl shadow-2xl backdrop-blur-xl w-40 sm:w-48"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <ShieldAlert className="text-purple-400 flex-shrink-0" size={14} />
                  <span className="text-[9px] sm:text-[10px] font-mono text-gray-400">AMENAZAS</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white font-mono">142 BLOQUEADOS</div>
                <div className="text-[9px] sm:text-[10px] text-gray-500 mt-1">Últimas 24 horas</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => {
          setShowLoginModal(false);
        }}
        buttonRef={loginButtonRef}
        onSuccess={(msg) => showToast(msg, 'success')}
      />
      
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
