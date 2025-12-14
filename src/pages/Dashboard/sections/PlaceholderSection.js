import React from 'react';
import { motion } from 'framer-motion';
import { Construction, Wrench, Clock } from 'lucide-react';

const PlaceholderSection = ({ title = "Sección en Desarrollo" }) => {
return (
    <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center h-full min-h-[400px] p-8"
    >
    {/* Icono principal animado */}
    <motion.div
        animate={{ 
        rotate: [0, -10, 10, -10, 0],
        scale: [1, 1.05, 1]
        }}
        transition={{ 
        duration: 2,
        repeat: Infinity,
        repeatDelay: 3
        }}
        className="mb-6"
    >
        <div className="relative">
        <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
        <div className="relative bg-zinc-800/50 border border-zinc-700/50 rounded-2xl p-6">
            <Construction size={48} className="text-cyan-400" />
        </div>
        </div>
    </motion.div>

    {/* Título */}
    <h2 className="text-2xl font-bold text-white mb-2 text-center">
        {title}
    </h2>

    {/* Descripción */}
    <p className="text-zinc-400 text-center max-w-md mb-6">
        Esta sección está actualmente en desarrollo. Pronto estará disponible con nuevas funcionalidades.
    </p>

    {/* Indicadores de estado */}
    <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-2 text-zinc-500">
        <Wrench size={16} className="text-amber-400" />
        <span>En construcción</span>
        </div>
        <div className="flex items-center gap-2 text-zinc-500">
        <Clock size={16} className="text-cyan-400" />
        <span>Próximamente</span>
        </div>
    </div>

    {/* Barra de progreso decorativa */}
    <div className="mt-8 w-64">
        <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>Progreso</span>
        <span>En desarrollo</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
            initial={{ width: 0 }}
            animate={{ width: '45%' }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
        />
        </div>
    </div>
    </motion.div>
);
};

export default PlaceholderSection;
