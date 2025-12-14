import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
AlertTriangle,
Shield,
Monitor,
Plus,
ChevronDown,
Search,
Trash2,
Lock,
Zap,
Loader,
Send,
CheckCircle,
XCircle
} from 'lucide-react';

import { Toast, ScrollArea } from '../components';
import { commandService } from '../../../services';

// Configuración de salas con sus PCs (dbId = ID en base de datos)
const SALAS_CONFIG = {
1: { name: 'Sala 1', pcs: Array.from({ length: 36 }, (_, i) => ({ dbId: i + 1, label: `PC ${i + 1}` })) },
2: { name: 'Sala 2', pcs: Array.from({ length: 32 }, (_, i) => ({ dbId: i + 1, label: `PC ${i + 1}` })) },
3: { name: 'Sala 3', pcs: Array.from({ length: 38 }, (_, i) => ({ dbId: i + 1, label: `PC ${i + 1}` })) },
4: { name: 'Sala 4', pcs: Array.from({ length: 32 }, (_, i) => ({ dbId: i + 1, label: `PC ${i + 1}` })) },
};

const BlockingSitesSection = () => {
const [blockedSites, setBlockedSites] = useState([
    { id: 1, url: "facebook.com", category: "Redes Sociales", blocked: true, dateAdded: "2025-11-20", devices: 15, sala: 4, pcIds: [1, 2, 3] },
    { id: 2, url: "youtube.com", category: "Video", blocked: true, dateAdded: "2025-11-20", devices: 18, sala: 4, pcIds: [1, 2, 3, 4, 5] },
    { id: 3, url: "instagram.com", category: "Redes Sociales", blocked: true, dateAdded: "2025-11-21", devices: 12, sala: 3, pcIds: [1, 2] },
    { id: 4, url: "tiktok.com", category: "Video", blocked: true, dateAdded: "2025-11-21", devices: 10, sala: 2, pcIds: [1] },
    { id: 5, url: "gaming.com", category: "Entretenimiento", blocked: false, dateAdded: "2025-11-22", devices: 0, sala: 1, pcIds: [] },
]);

// Estado para envío de comandos
const [isSubmitting, setIsSubmitting] = useState(false);
const [selectedSala, setSelectedSala] = useState(4);
const [selectedPCs, setSelectedPCs] = useState([]);
const [openSalaMenu, setOpenSalaMenu] = useState(false);
const [selectAllPCs, setSelectAllPCs] = useState(false);

const [newSite, setNewSite] = useState("");
const [searchTerm, setSearchTerm] = useState("");
const [filterCategory, setFilterCategory] = useState("all");
const [selectedCategory, setSelectedCategory] = useState("Redes Sociales");
const [toast, setToast] = useState(null);
const [openCategoryMenu, setOpenCategoryMenu] = useState(false);

const categories = ["Redes Sociales", "Video", "Entretenimiento", "Compras", "Otro"];

// Efecto para seleccionar todos los PCs
useEffect(() => {
    if (selectAllPCs && selectedSala) {
    const allPcIds = SALAS_CONFIG[selectedSala]?.pcs.map(pc => pc.dbId) || [];
    setSelectedPCs(allPcIds);
    }
}, [selectAllPCs, selectedSala]);

// Cuando cambia la sala, resetear selección
useEffect(() => {
    setSelectedPCs([]);
    setSelectAllPCs(false);
}, [selectedSala]);

const filteredSites = blockedSites.filter(site => {
    const matchesSearch = site.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || site.category === filterCategory;
    return matchesSearch && matchesCategory;
});

const handleAddSite = async () => {
    if (!newSite.trim()) {
    setToast({ type: "warn", msg: "Ingresa una URL" });
    setTimeout(() => setToast(null), 2000);
    return;
    }

    if (selectedPCs.length === 0) {
    setToast({ type: "warn", msg: "Selecciona al menos un PC" });
    setTimeout(() => setToast(null), 2000);
    return;
    }
    
    const siteExists = blockedSites.some(s => s.url.toLowerCase() === newSite.toLowerCase() && s.sala === selectedSala);
    if (siteExists) {
    setToast({ type: "warn", msg: "Este sitio ya está bloqueado en esta sala" });
    setTimeout(() => setToast(null), 2000);
    return;
    }

    setIsSubmitting(true);
    
    try {
    // Enviar comando de bloqueo a cada PC seleccionado
    const results = await Promise.allSettled(
        selectedPCs.map(pcId => 
        commandService.sendBlockWebsite(selectedSala, pcId, newSite.toLowerCase())
        )
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled').length;
    const failCount = results.filter(r => r.status === 'rejected').length;

    if (successCount > 0) {
        const newBlockedSite = {
        id: Math.max(...blockedSites.map(s => s.id), 0) + 1,
        url: newSite.toLowerCase(),
        category: selectedCategory,
        blocked: true,
        dateAdded: new Date().toISOString().split('T')[0],
        devices: successCount,
        sala: selectedSala,
        pcIds: selectedPCs
        };

        setBlockedSites([...blockedSites, newBlockedSite]);
        setNewSite("");
        setSelectedPCs([]);
        setSelectAllPCs(false);
        
        if (failCount > 0) {
        setToast({ type: "warn", msg: `${newSite} bloqueado en ${successCount} PCs, ${failCount} fallaron` });
        } else {
        setToast({ type: "success", msg: `${newSite} bloqueado en ${successCount} PCs de Sala ${selectedSala}` });
        }
    } else {
        setToast({ type: "error", msg: "Error al bloquear sitio en todos los PCs" });
    }
    } catch (error) {
    console.error('[BlockingSitesSection] Error:', error);
    setToast({ type: "error", msg: error.message || "Error al bloquear sitio" });
    } finally {
    setIsSubmitting(false);
    setTimeout(() => setToast(null), 3000);
    }
};

const handleRemoveSite = (id) => {
    const site = blockedSites.find(s => s.id === id);
    setBlockedSites(blockedSites.filter(s => s.id !== id));
    setToast({ type: "success", msg: `${site.url} eliminado de la lista` });
    setTimeout(() => setToast(null), 2000);
};

const handleToggleSite = (id) => {
    setBlockedSites(blockedSites.map(site =>
    site.id === id ? { ...site, blocked: !site.blocked } : site
    ));
};

const stats = {
    total: blockedSites.length,
    active: blockedSites.filter(s => s.blocked).length,
    devices: blockedSites.reduce((sum, s) => sum + s.devices, 0),
};

return (
    <div className="flex flex-col h-full space-y-2 md:space-y-4">
    {/* Toast Reutilizable */}
    <Toast toast={toast} onClose={() => setToast(null)} />

    {/* Header */}
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 pb-6 border-b border-white/5">
        <div>
        <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/10 rounded-lg border border-red-500/20">
            <AlertTriangle className="text-red-400" size={24} />
            </div>
            <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Bloqueo de Sitios Web</h2>
            <p className="text-gray-500 text-sm font-sans">Gestiona y controla el acceso a sitios web en tu red.</p>
            </div>
        </div>
        </div>
    </div>

    {/* Stats Grid */}
    <motion.div 
        initial="hidden" animate="visible" 
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    >
        {[
        { label: "Sitios Bloqueados", value: stats.active, icon: AlertTriangle, color: "text-red-400", bg: "from-red-500/10 to-transparent", border: "border-red-500/20" },
        { label: "Total en Lista", value: stats.total, icon: Shield, color: "text-cyan-400", bg: "from-cyan-500/10 to-transparent", border: "border-cyan-500/20" },
        { label: "Dispositivos", value: stats.devices, icon: Monitor, color: "text-green-400", bg: "from-green-500/10 to-transparent", border: "border-green-500/20" },
        ].map((stat, idx) => (
        <motion.div
            key={idx}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
            whileHover={{ scale: 1.02, y: -5 }}
            className={`relative p-5 rounded-xl border ${stat.border} bg-gradient-to-b ${stat.bg} backdrop-blur-sm group overflow-hidden`}
        >
            <div className={`absolute -right-4 -top-4 opacity-10 group-hover:opacity-20 transition-opacity ${stat.color}`}>
            <stat.icon size={80} />
            </div>
            <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-black/40 border border-white/5 ${stat.color}`}>
                <stat.icon size={20} />
            </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</h3>
            <p className="text-xs text-gray-400 font-mono uppercase tracking-wider">{stat.label}</p>
        </motion.div>
        ))}
    </motion.div>

    {/* Add New Site Form */}
    <div className="bg-black/40 p-2 md:p-6 rounded-xl border border-white/5 space-y-2 md:space-y-4 shrink-0">
        <h3 className="text-sm md:text-lg font-bold text-white flex items-center gap-2">
        <Plus size={16} className="text-cyan-400" />
        Agregar Sitio
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-3">
        <div className="sm:col-span-2 lg:col-span-2">
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5 md:mb-2 block">URL del Sitio</label>
            <input
            type="text"
            placeholder="ej: example.com"
            value={newSite}
            onChange={(e) => setNewSite(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddSite()}
            className="w-full px-3 py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs md:text-sm focus:border-cyan-500/50 focus:outline-none placeholder-gray-700"
            />
        </div>

        <div className="relative sm:col-span-1">
            <label className="text-[10px] md:text-xs font-bold text-gray-400 uppercase mb-1.5 md:mb-2 block">Categoría</label>
            <button
            className="w-full px-3 py-2 md:py-2.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs md:text-sm hover:border-white/20 transition-all flex justify-between items-center cursor-pointer group"
            onClick={() => setOpenCategoryMenu(!openCategoryMenu)}
            >
            <span className="font-medium truncate">{selectedCategory}</span>
            <motion.div animate={{ rotate: openCategoryMenu ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={14} className="text-gray-500 group-hover:text-gray-300 flex-shrink-0" />
            </motion.div>
            </button>
            
            <AnimatePresence>
            {openCategoryMenu && (
                <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0a] border border-cyan-500/30 rounded-lg shadow-2xl z-50 max-h-56 overflow-y-auto overflow-x-hidden"
                >
                {categories.map((cat) => (
                    <motion.button
                    key={cat}
                    onClick={() => {
                        setSelectedCategory(cat);
                        setOpenCategoryMenu(false);
                    }}
                    className={`w-full px-4 py-2 md:py-3 text-left text-xs md:text-sm transition-all border-b border-white/5 last:border-0 flex items-center gap-3 ${
                        selectedCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                        : 'text-gray-300 hover:bg-white/5'
                    }`}
                    whileHover={{ paddingLeft: '20px' }}
                    >
                    <div className={`w-2 h-2 rounded-full transition-all ${selectedCategory === cat ? 'bg-cyan-400' : 'bg-transparent'}`} />
                    {cat}
                    </motion.button>
                ))}
                </motion.div>
            )}
            </AnimatePresence>
        </div>

        <div className="sm:col-span-1 flex items-end">
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddSite}
            className="w-full px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-bold rounded-lg text-[10px] md:text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-cyan-400/50 hover:border-cyan-300"
            >
            <Plus size={14} />
            Agregar
            </motion.button>
        </div>
        </div>
    </div>

    {/* Filters */}
    <div className="flex flex-col sm:flex-row gap-2 md:gap-4 justify-between items-start sm:items-center bg-[#0a0a0a] p-1.5 md:p-2 rounded-xl border border-white/5 shrink-0">
        <div className="flex p-1 bg-black/40 rounded-lg border border-white/5 w-full sm:w-auto overflow-x-auto">
        {[
            { id: "all", label: "Todos" },
            { id: "active", label: "Activos" },
            { id: "inactive", label: "Inactivos" },
        ].map(f => (
            <button
            key={f.id}
            onClick={() => setFilterCategory(f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive')}
            className={`flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-md text-[10px] md:text-xs font-medium transition-all whitespace-nowrap ${
                filterCategory === (f.id === 'all' ? 'all' : f.id === 'active' ? 'active' : 'inactive') ? 
                "bg-white/10 text-white shadow-sm border border-white/10" : 
                "text-gray-500 hover:text-gray-300 hover:bg-white/5"
            }`}
            >
            {f.label}
            </button>
        ))}
        </div>

        <div className="flex items-center gap-2 md:gap-3 bg-black/40 px-2 md:px-3 py-1 md:py-2 rounded-lg border border-white/5 w-full sm:w-auto focus-within:border-cyan-500/50 transition-colors">
        <Search size={12} className="text-gray-500 shrink-0" />
        <input 
            type="text" 
            placeholder="Buscar..." 
            className="bg-transparent border-none outline-none text-[10px] md:text-xs text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
        </div>
    </div>

    {/* Blocked Sites Table - Desktop */}
        <ScrollArea className="hidden md:flex flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden shadow-inner min-h-[300px]">
        <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
            <tr>
            <th className="p-4 font-normal">Sitio Web</th>
            <th className="p-4 font-normal">Categoría</th>
            <th className="p-4 font-normal">Agregado</th>
            <th className="p-4 font-normal">Dispositivos</th>
            <th className="p-4 font-normal">Estado</th>
            <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
            {filteredSites.map((site) => (
            <tr key={site.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                <div className="font-bold text-gray-200 font-mono">{site.url}</div>
                </td>
                <td className="p-4">
                <span className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10 text-gray-300">
                    {site.category}
                </span>
                </td>
                <td className="p-4">
                <span className="text-xs text-gray-500 font-mono">{site.dateAdded}</span>
                </td>
                <td className="p-4">
                <span className="text-xs font-bold text-cyan-400">{site.devices}</span>
                </td>
                <td className="p-4">
                <div className="flex items-center gap-2">
                    <div className={`relative w-2 h-2 rounded-full ${site.blocked ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" : "bg-green-500"}`} />
                    <span className={`text-xs font-bold ${site.blocked ? "text-red-400" : "text-green-400"}`}>
                    {site.blocked ? "BLOQUEADO" : "PERMITIDO"}
                    </span>
                </div>
                </td>
                <td className="p-4 text-right">
                <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleSite(site.id)}
                    className={`p-2 rounded-lg transition-colors ${
                        site.blocked 
                        ? "hover:bg-green-500/10 hover:text-green-400" 
                        : "hover:bg-red-500/10 hover:text-red-400"
                    }`}
                    title={site.blocked ? "Permitir" : "Bloquear"}
                    >
                    {site.blocked ? <Zap size={14} /> : <Lock size={14} />}
                    </motion.button>
                    <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveSite(site.id)}
                    className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
                    title="Eliminar"
                    >
                    <Trash2 size={14} />
                    </motion.button>
                </div>
                </td>
            </tr>
            ))}
        </tbody>
        </table>
    </ScrollArea>

    {/* Blocked Sites Mobile Cards - Mobile */}
        <div className="md:hidden flex-1 flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden min-h-[200px]">
        <div className="flex-1 overflow-y-auto flex flex-col">
        {filteredSites.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 text-xs">
            No hay sitios bloqueados
            </div>
        ) : (
            <div className="flex flex-col gap-2 p-2">
            {filteredSites.map((site) => (
                <div 
                key={site.id} 
                className="p-2.5 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-colors"
                >
                {/* URL and Category Row */}
                <div className="flex flex-col gap-1.5 mb-2.5">
                    <div className="font-bold text-[11px] text-gray-200 font-mono truncate">
                    {site.url}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-300 whitespace-nowrap">
                        {site.category}
                    </span>
                    <span className="text-[9px] text-gray-500 whitespace-nowrap">{site.dateAdded}</span>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="flex items-center justify-between mb-2 py-1.5 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-500">Disp:</span>
                    <span className="text-[10px] font-bold text-cyan-400">{site.devices}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                    <div className={`relative w-1.5 h-1.5 rounded-full ${site.blocked ? "bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.6)]" : "bg-green-500"}`} />
                    <span className={`text-[9px] font-bold ${site.blocked ? "text-red-400" : "text-green-400"}`}>
                        {site.blocked ? "BLOQ" : "PERM"}
                    </span>
                    </div>
                </div>

                {/* Actions Row */}
                <div className="flex justify-end gap-1">
                    <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleToggleSite(site.id)}
                    className={`p-1.5 rounded-lg transition-colors text-xs ${
                        site.blocked 
                        ? "hover:bg-green-500/10 hover:text-green-400 text-green-400/60" 
                        : "hover:bg-red-500/10 hover:text-red-400 text-red-400/60"
                    }`}
                    title={site.blocked ? "Permitir" : "Bloquear"}
                    >
                    {site.blocked ? <Zap size={12} /> : <Lock size={12} />}
                    </motion.button>
                    <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleRemoveSite(site.id)}
                    className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-red-400/60 rounded-lg transition-colors text-xs"
                    title="Eliminar"
                    >
                    <Trash2 size={12} />
                    </motion.button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    </div>
    </div>
);
};

export default BlockingSitesSection;
