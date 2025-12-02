import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

/**
 * MobileMenu - Menú responsive para dispositivos móviles
 * @param {Array} sections - Secciones del menú con links
 * @param {string} currentPage - Página actual activa
 * @param {Function} onNavigate - Callback cuando se navega
 */
export const MobileMenu = ({ sections = [], currentPage = '', onNavigate = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón Hamburguesa - Visible solo en móviles */}
      <motion.button
        className="sm:hidden fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg hover:shadow-xl transition-shadow"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop - Cierra el menú al hacer click */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="sm:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          />
        )}
      </AnimatePresence>

      {/* Menú Desplegable */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="sm:hidden fixed bottom-24 right-6 z-40 w-72 max-w-[calc(100vw-48px)] rounded-2xl bg-gradient-to-b from-gray-900/95 to-black/95 border border-blue-500/20 shadow-2xl overflow-hidden"
          >
            {/* Contenido del menú */}
            <div className="max-h-[60vh] overflow-y-auto">
              {sections.map((section, sectionIdx) => (
                <motion.div
                  key={sectionIdx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIdx * 0.05 }}
                  className="flex flex-col"
                >
                  {/* Encabezado de sección */}
                  <div className="px-4 py-3 first:pt-4">
                    <h3 className="text-xs font-black tracking-widest text-gray-500 uppercase">
                      {section.title}
                    </h3>
                  </div>

                  {/* Links de la sección */}
                  {section.links.map((link, linkIdx) => (
                    <motion.button
                      key={linkIdx}
                      onClick={() => handleNavigate(link.page)}
                      whileHover={{ x: 4, backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all group relative ${
                        currentPage === link.page
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-gray-400 hover:text-gray-200'
                      }`}
                    >
                      {/* Indicador activo */}
                      {currentPage === link.page && (
                        <motion.div
                          layoutId="activeMobileIndicator"
                          className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r"
                        />
                      )}

                      {/* Icono */}
                      <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${
                        currentPage === link.page ? 'text-blue-400' : 'group-hover:text-blue-400/70'
                      }`}>
                        {link.icon}
                      </span>

                      {/* Texto */}
                      <span className="flex-1 text-sm font-medium">{link.label}</span>

                      {/* Badge */}
                      {link.badge && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400 font-mono font-bold"
                        >
                          {link.badge}
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </motion.div>
              ))}
            </div>

            {/* Pie del menú */}
            <div className="border-t border-gray-800/50 p-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50 transition-all text-sm font-medium"
              >
                🚪 Cerrar Sesión
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileMenu;
