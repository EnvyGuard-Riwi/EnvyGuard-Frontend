import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, RotateCw } from 'lucide-react';

/**
 * ReportProblemModal Component - Modal para reportar problemas en equipos
 */
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

export default ReportProblemModal;
