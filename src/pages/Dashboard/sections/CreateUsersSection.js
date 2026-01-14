import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
UserPlus,
ChevronDown,
X,
Edit2,
Lock,
Eye,
EyeOff,
RotateCw,
RefreshCw,
Search,
Shield,
Trash2,
MoreVertical,
Loader
} from 'lucide-react';

import { userService } from '../../../services';
import AuthService from '../../../services/AuthService';
import { Toast, ScrollArea } from '../components';

// 3. USERS SECTION
const CreateUsersSection = ({ avatarOptions, getAvatarUrl }) => {
const [searchTerm, setSearchTerm] = useState("");
const [newUserAvatarId, setNewUserAvatarId] = useState(1);
const [roleFilter, setRoleFilter] = useState("all");
const [toast, setToast] = useState(null);
const [isLoading, setIsLoading] = useState(false);
const [isFetchingUsers, setIsFetchingUsers] = useState(true);

// Estado para el formulario
const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OPERATOR'
});

const [users, setUsers] = useState([]);
const [showForm, setShowForm] = useState(false);
const [editingUser, setEditingUser] = useState(null);
const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
const [showMoreOptions, setShowMoreOptions] = useState(null);
const [showRoleDropdown, setShowRoleDropdown] = useState(false);
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

// Traer usuarios desde la API
useEffect(() => {
    const fetchUsers = async () => {
    setIsFetchingUsers(true);
    try {
        console.log('🔍 Obteniendo usuarios desde userService...');
        
        const data = await userService.getAllUsers();

        console.log('✅ Usuarios traídos de la API:', data);

        // Mapear los usuarios de la API a la estructura de la tabla
        const mappedUsers = Array.isArray(data) ? data.map((user, index) => ({
        id: user.id || index + 1,
        name: `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim() || 'Usuario sin nombre',
        email: user.email || '',
        role: user.role || user.rol || 'ADMIN', // Rol por defecto es ADMIN
        status: user.enabled === false ? 'Inactivo' : 'Activo',
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        avatarId: (index % 8) + 1, // Distribuir avatares entre los usuarios
        })) : [];

        console.log('✅ Usuarios mapeados:', mappedUsers);
        setUsers(mappedUsers);
    } catch (error) {
        console.error('❌ Error completo al traer usuarios:', error);
        setToast({ type: 'error', msg: `Error al cargar usuarios: ${error.message}` });
        setUsers([]); // Mostrar lista vacía en caso de error
    } finally {
        setIsFetchingUsers(false);
    }
    };

    fetchUsers();
}, []); // Se ejecuta una sola vez al montar el componente

// Validar formulario
const validateForm = () => {
    // Validación para CREAR nuevo usuario (todos los campos obligatorios)
    if (!editingUser) {
    if (!formData.firstName.trim()) {
        setToast({ type: 'warn', msg: 'El nombre es requerido' });
        return false;
    }
    if (!formData.lastName.trim()) {
        setToast({ type: 'warn', msg: 'El apellido es requerido' });
        return false;
    }
    if (!formData.email.trim() || !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        setToast({ type: 'warn', msg: 'Email válido es requerido' });
        return false;
    }
    if (!formData.password || formData.password.length < 8) {
        setToast({ type: 'warn', msg: 'La contraseña debe tener al menos 8 caracteres' });
        return false;
    }
    if (formData.password !== formData.confirmPassword) {
        setToast({ type: 'warn', msg: 'Las contraseñas no coinciden' });
        return false;
    }
    return true;
    }

    // Validación para EDITAR usuario (todos opcionales)
    // Si el usuario proporciona email, validar formato
    if (formData.email.trim() && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    setToast({ type: 'warn', msg: 'Email inválido' });
    return false;
    }

    // Si cambio la contraseña, debe cumplir con requisitos
    if (formData.password && formData.password.trim().length > 0) {
    if (formData.password.length < 8) {
        setToast({ type: 'warn', msg: 'La contraseña debe tener al menos 8 caracteres' });
        return false;
    }
    if (formData.password !== formData.confirmPassword) {
        setToast({ type: 'warn', msg: 'Las contraseñas no coinciden' });
        return false;
    }
    }
    // Si no cambio contraseña, no hay validación de contraseña
    return true;
};

// Manejar cambios en inputs
const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
    ...prev,
    [name]: value
    }));
};

// Crear usuario
const handleCreateUser = async (e) => {
    e.preventDefault();
    
    // Si estamos editando, llamar a la función de actualización
    if (editingUser) {
    return handleSaveUserChanges(e);
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
    // 1. Crear usuario en el backend
    const response = await AuthService.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
    });

    console.log('✅ Usuario creado desde servidor:', response);

    // 2. Obtener la lista actualizada de usuarios para tener el ID real
    try {
        const allUsers = await userService.getAllUsers();
        console.log('📋 Lista de usuarios actualizada, total:', allUsers.length);
        
        // 3. Encontrar el usuario recién creado por email
        const createdUser = allUsers.find(u => u.email === formData.email);
        
        if (createdUser) {
        console.log('✅ Usuario creado encontrado en lista:', createdUser);
        
        // Crear objeto para la UI
        const newUser = {
            id: createdUser.id,
            name: `${createdUser.firstName} ${createdUser.lastName}`,
            email: createdUser.email,
            role: createdUser.role,
            enabled: createdUser.enabled !== undefined ? createdUser.enabled : true,
            status: createdUser.enabled ? 'Activo' : 'Inactivo',
            createdAt: createdUser.createdAt ? createdUser.createdAt.split('T')[0] : new Date().toISOString().split('T')[0],
            avatarId: newUserAvatarId,
        };
        
        setUsers([...users, newUser]);
        } else {
        console.warn('⚠️ No se encontró el usuario creado en la lista, agregando con datos temporales');
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),  // ID temporal único
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            role: formData.role,
            enabled: true,
            status: 'Activo',
            createdAt: new Date().toISOString().split('T')[0],
            avatarId: newUserAvatarId,
        };
        setUsers([...users, newUser]);
        }
    } catch (err) {
        console.error('❌ Error al obtener lista de usuarios:', err.message);
        // Fallback si no se puede obtener la lista
        const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role,
        enabled: true,
        status: 'Activo',
        createdAt: new Date().toISOString().split('T')[0],
        avatarId: newUserAvatarId,
        };
        setUsers([...users, newUser]);
    }

    setToast({ type: 'success', msg: 'Usuario creado exitosamente' });
    
    // Limpiar formulario
    setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'OPERATOR'
    });
    setNewUserAvatarId(1);
    setShowForm(false);
    } catch (error) {
    const errorMsg = error.message || 'Error al crear usuario';
    setToast({ type: 'error', msg: errorMsg });
    console.error('❌ Error al crear usuario:', error);
    } finally {
    setIsLoading(false);
    }
};

// Función para editar usuario
const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
    firstName: user.name.split(' ')[0],
    lastName: user.name.split(' ').slice(1).join(' '),
    email: user.email,
    password: '',
    confirmPassword: '',
    role: user.role
    });
    setShowForm(true);
};

// Función para guardar cambios de usuario (actualizar)
const handleSaveUserChanges = async (e) => {
    e.preventDefault();
    
    if (!editingUser) {
    // Si no hay usuario en edición, es crear nuevo
    return handleCreateUser(e);
    }

    if (!validateForm()) return;

    setIsLoading(true);
    try {
    console.log(`🔄 Actualizando usuario ${editingUser.id}...`);

    // Construir payload con TODOS los campos requeridos por PUT
    const payload = {
        firstName: formData.firstName || '',
        lastName: formData.lastName || '',
        email: formData.email || '',
        role: formData.role || 'OPERATOR',
        enabled: editingUser.enabled !== undefined ? editingUser.enabled : true
    };

    // Solo agregar password si se cambió
    if (formData.password && formData.password.trim().length > 0) {
        payload.password = formData.password;
    }

    console.log('📦 Payload enviando:', JSON.stringify(payload, null, 2));

    // Usar userService para actualizar
    const updatedUser = await userService.updateUser(editingUser.id, payload);
    console.log('✅ Usuario actualizado:', updatedUser);

    // Actualizar en la lista local
    setUsers(users.map(u => u.id === editingUser.id ? {
        ...u,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        role: formData.role
    } : u));

    setToast({ type: 'success', msg: 'Usuario actualizado exitosamente' });
    clearForm();
    setShowForm(false);
    } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    setToast({ type: 'error', msg: `Error al actualizar: ${error.message}` });
    } finally {
    setIsLoading(false);
    }
};

// Función para eliminar usuario
const handleDeleteUser = async (userId) => {
    setShowDeleteConfirm(null);
    setIsLoading(true);
    try {
    console.log(`🗑️ Eliminando usuario ${userId}...`);

    // Usar el servicio userService que ya maneja todo
    await userService.deleteUser(userId);

    console.log('✅ Usuario eliminado');
    setUsers(users.filter(u => u.id !== userId));
    setToast({ type: 'success', msg: 'Usuario eliminado exitosamente' });
    } catch (error) {
    console.error('❌ Error al eliminar usuario:', error);
    setToast({ type: 'error', msg: `Error al eliminar usuario: ${error.message}` });
    } finally {
    setIsLoading(false);
    }
};

// Función para desactivar/activar usuario
const handleToggleStatus = async (userId, currentStatus) => {
    setShowMoreOptions(null);
    setIsLoading(true);
    try {
    const newEnabled = currentStatus === 'Activo' ? false : true;
    
    // Encontrar el usuario en la lista local para obtener sus datos
    const userToUpdate = users.find(u => u.id === userId);
    if (!userToUpdate) {
        throw new Error('Usuario no encontrado');
    }

    console.log(`🔄 Cambiando estado del usuario ${userId} a enabled=${newEnabled}...`);

    // Pasar los datos del usuario al servicio para evitar llamar a getUserById
    await userService.toggleUserStatus(userId, newEnabled, {
        email: userToUpdate.email,
        firstName: userToUpdate.name?.split(' ')[0] || '',
        lastName: userToUpdate.name?.split(' ').slice(1).join(' ') || '',
        role: userToUpdate.role,
    });

    console.log('✅ Estado actualizado en la API');
    
    // Actualizar localmente y refrescar desde la API
    setUsers(users.map(u => u.id === userId ? { ...u, status: newEnabled ? 'Activo' : 'Inactivo' } : u));
    
    // Refrescar la lista de usuarios desde la API para asegurar sincronización
    try {
        const data = await userService.getAllUsers();
        const mappedUsers = Array.isArray(data) ? data.map((user, index) => ({
        id: user.id || index + 1,
        name: `${user.firstName || user.nombre || ''} ${user.lastName || user.apellido || ''}`.trim() || 'Usuario sin nombre',
        email: user.email || '',
        role: user.role || user.rol || 'ADMIN',
        status: user.enabled === false ? 'Inactivo' : 'Activo',
        createdAt: user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        avatarId: (index % 8) + 1,
        })) : [];
        setUsers(mappedUsers);
    } catch (refreshError) {
        console.warn('⚠️ No se pudo refrescar la lista de usuarios:', refreshError);
    }
    
    const newStatus = newEnabled ? 'Activo' : 'Inactivo';
    setToast({ type: 'success', msg: `Usuario marcado como ${newStatus}` });
    } catch (error) {
    console.error('❌ Error al cambiar estado:', error);
    setToast({ type: 'error', msg: `Error al cambiar estado: ${error.message}` });
    } finally {
    setIsLoading(false);
    }
};

// Limpiar formulario
const clearForm = () => {
    setFormData({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'OPERATOR'
    });
    setEditingUser(null);
    setShowRoleDropdown(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
};

// Filter logic
const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role.toLowerCase() === roleFilter;
    return matchesSearch && matchesRole;
});

return (
    <div className="flex flex-col h-full space-y-6">
    {/* Toast Reutilizable */}
    <Toast toast={toast} onClose={() => setToast(null)} />

    {/* Header with improved styling */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 pb-4 md:pb-6 border-b border-white/5">
        <div>
        <div className="flex items-start sm:items-center gap-2 md:gap-3">
                <div className="p-2 md:p-2.5 bg-green-500/10 rounded-lg border border-green-500/20 shrink-0">
                    <UserPlus className="text-green-400" size={20} />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Gestión de Accesos</h2>
                    <p className="text-gray-500 text-xs md:text-sm font-sans">Control de credenciales y privilegios.</p>
                </div>
        </div>
        </div>
        <button 
        onClick={() => {
            if (showForm) {
            clearForm();
            } else {
            // Resetear completamente el estado cuando se abre nuevo usuario
            setEditingUser(null);
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'OPERATOR'
            });
            setNewUserAvatarId(1);
            setShowRoleDropdown(false);
            }
            setShowForm(!showForm);
        }}
        className="group relative px-4 md:px-6 py-2.5 md:py-3 bg-transparent border border-green-500/50 hover:border-green-400 text-green-400 hover:text-green-300 font-medium rounded-lg hover:bg-green-500/10 transition-all duration-300 flex items-center justify-center gap-2.5 text-xs md:text-sm w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
        disabled={isLoading}
        >
        <span className="relative z-10 flex items-center gap-2.5">
            <span className="p-1 rounded-md bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
              {showForm ? <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" /> : <UserPlus size={14} />}
            </span>
            <span className="hidden sm:inline tracking-wide">{showForm ? "Cerrar Panel" : "Nuevo Usuario"}</span>
            <span className="sm:hidden tracking-wide">{showForm ? "Cerrar" : "Nuevo"}</span>
        </span>
        </button>
    </div>

    <AnimatePresence>
        {showForm && (
        <>
            {/* Overlay - Cubre toda la pantalla y centra */}
            <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={() => {
                clearForm();
                setShowForm(false);
            }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998] flex items-center justify-center p-4"
            />
            {/* Modal - Centrado como el del perfil */}
            <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none"
            >
            <div className={`bg-gradient-to-br from-[#0a0a0a] via-[#0d0d0d] to-[#080808] rounded-xl shadow-2xl w-full max-w-3xl pointer-events-auto border ${
                editingUser ? 'border-blue-500/40' : 'border-green-500/40'
            }`}
            >
            <div className="p-6 md:p-8 relative">
            {/* Decorative bg */}
            <div className={`absolute top-0 right-0 w-64 h-64 blur-[100px] pointer-events-none ${
                editingUser ? 'bg-blue-500/8' : 'bg-green-500/8'
            }`} />
            
            {/* Close Button */}
            <motion.button
                onClick={() => {
                clearForm();
                setShowForm(false);
                }}
                className="absolute top-3 right-3 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-all z-50"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
            >
                <X size={16} />
            </motion.button>
            
            <h3 className={`font-mono text-xs md:text-sm font-bold uppercase tracking-[0.15em] mb-5 flex items-center gap-2.5 relative z-10 ${
                editingUser ? 'text-blue-400' : 'text-green-400'
            }`}>
                <span className={`p-1.5 rounded-md ${editingUser ? 'bg-blue-500/10' : 'bg-green-500/10'}`}>
                  {editingUser ? <Edit2 size={14}/> : <UserPlus size={14}/> }
                </span>
                {editingUser ? 'EDITAR CREDENCIAL DE ACCESO' : 'NUEVA CREDENCIAL DE ACCESO'}
            </h3>
            
            <form onSubmit={editingUser ? handleSaveUserChanges : handleCreateUser} className="flex flex-col gap-4 relative z-10">
                {/* Avatar y Datos Principales */}
                <div className="flex flex-col lg:flex-row items-start gap-4 lg:gap-6">
                    {/* Avatar Selection - Solo para Nuevo Usuario */}
                    {!editingUser && (
                    <div className="shrink-0">
                        <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider font-semibold">Avatar</label>
                        <div className="w-20 h-20 rounded-lg border-2 border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/10 p-1.5 relative overflow-hidden group hover:border-green-400/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]">
                            <img 
                                src={getAvatarUrl(avatarOptions.find(a => a.id === newUserAvatarId))} 
                                alt="avatar preview" 
                                className="w-full h-full rounded-lg object-cover" 
                            />
                            <button 
                                type="button"
                                onClick={() => setNewUserAvatarId(prev => prev >= 8 ? 1 : prev + 1)}
                                disabled={isLoading}
                                className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-xs font-bold text-green-400 cursor-pointer disabled:opacity-50 backdrop-blur-sm"
                            >
                                <span className="flex items-center gap-1.5"><RefreshCw size={12} /> CAMBIAR</span>
                            </button>
                        </div>
                    </div>
                    )}

                    <div className={`flex-1 grid gap-3 w-full ${editingUser ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2'}`}>
                        <div>
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Nombre</label>
                            <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            placeholder="Ej: Juan" 
                            disabled={isLoading}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Apellido</label>
                            <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            placeholder="Ej: Pérez" 
                            disabled={isLoading}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Correo Electrónico</label>
                            <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="usuario@envyguard.com" 
                            disabled={isLoading}
                            className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20" 
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">Rol de Usuario</label>
                            <div className="relative">
                            <button
                                type="button"
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20 flex items-center justify-between"
                                disabled={isLoading}
                            >
                                <span>{formData.role || 'Seleccionar rol...'}</span>
                                <ChevronDown 
                                size={14} 
                                className={`transition-transform duration-300 text-gray-500 ${showRoleDropdown ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <AnimatePresence>
                                {showRoleDropdown && (
                                <motion.div
                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                    transition={{ duration: 0.12 }}
                                    className="absolute top-full left-0 right-0 mt-1 bg-[#0a0a0a] border border-white/10 rounded-lg shadow-2xl z-50 overflow-hidden"
                                >
                                    <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, role: 'ADMIN' });
                                        setShowRoleDropdown(false);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-white hover:bg-green-500/10 hover:text-green-400 text-left transition-all duration-200 border-b border-white/5 flex items-center gap-2"
                                    >
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    ADMIN
                                    </button>
                                    <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, role: 'OPERATOR' });
                                        setShowRoleDropdown(false);
                                    }}
                                    className="w-full px-3 py-2 text-sm text-white hover:bg-purple-500/10 hover:text-purple-400 text-left transition-all duration-200 flex items-center gap-2"
                                    >
                                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                                    OPERATOR
                                    </button>
                                </motion.div>
                                )}
                            </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-white/5" />

                {/* Credenciales de Seguridad */}
                <div>
                    <h4 className="text-[10px] md:text-xs font-mono text-green-400 mb-3 uppercase tracking-wider font-semibold flex items-center gap-2">
                        <span className="p-1 rounded bg-green-500/10"><Lock size={10} /></span> Credenciales de Seguridad
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">
                            Contraseña 
                            {editingUser ? (
                                <span className="text-blue-400/80 ml-1 font-normal">(Opcional)</span>
                            ) : (
                                <span className="text-green-400/80 ml-1 font-normal">(Mín. 8 car.)</span>
                            )}
                            </label>
                            <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder={editingUser ? "Dejar vacío para no cambiar" : "••••••••••••"} 
                                disabled={isLoading}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20 pr-10" 
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors p-1 rounded hover:bg-white/5"
                                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs font-mono text-gray-500 mb-1.5 uppercase tracking-wider font-semibold">
                            Confirmar Contraseña
                            {editingUser && formData.password && (
                                <span className="text-blue-400/80 ml-1 font-normal">(Requerido)</span>
                            )}
                            </label>
                            <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder={editingUser ? "Dejar vacío para no cambiar" : "••••••••••••"} 
                                disabled={isLoading}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:border-green-500/50 focus:bg-green-900/5 outline-none transition-all duration-300 disabled:opacity-50 hover:border-white/20 pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-green-400 transition-colors p-1 rounded hover:bg-white/5"
                                title={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                            >
                                {showConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separador */}
                <div className="border-t border-white/5" />
                
                {/* Botones de Acción */}
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 pt-1">
                    <motion.button 
                        type="button" 
                        onClick={() => {
                        setShowForm(false);
                        clearForm();
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="px-5 py-2 text-xs font-medium uppercase tracking-wider rounded-lg border border-red-500/40 hover:border-red-400 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    >
                        CANCELAR
                    </motion.button>
                    <motion.button 
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                        className="group px-6 py-2 bg-transparent border border-green-500/40 hover:border-green-400 text-green-400 hover:text-green-300 font-medium rounded-lg text-xs uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(34,197,94,0.15)]"
                    >
                        {isLoading ? (
                        <>
                            <RotateCw size={14} className="animate-spin" />
                            {editingUser ? 'GUARDANDO...' : 'CREANDO...'}
                        </>
                        ) : (
                        <>
                            <span className="p-1 rounded bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                              {editingUser ? <Edit2 size={12} /> : <UserPlus size={12} />}
                            </span>
                            {editingUser ? 'GUARDAR CAMBIOS' : 'CREAR USUARIO'}
                        </>
                        )}
                    </motion.button>
                </div>
            </form>
            </div>
            </div>
            </motion.div>
        </>
        )}
    </AnimatePresence>

    {/* Toolbar & Filters */}
    <div className="flex flex-col gap-3 md:gap-4 bg-[#0a0a0a] p-2 md:p-3 rounded-xl border border-white/5">
        {/* Search */}
        <div className="flex items-center gap-2 md:gap-3 bg-black/40 px-2 md:px-3 py-1.5 md:py-2 rounded-lg border border-white/5 w-full focus-within:border-green-500/50 transition-colors">
            <Search size={14} className="text-gray-500 shrink-0" />
            <input 
            type="text" 
            placeholder="Buscar por nombre, email o ID..." 
            className="bg-transparent border-none outline-none text-xs md:text-sm text-white w-full placeholder-gray-600"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    </div>

    <ScrollArea className="flex-1 rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden custom-scrollbar shadow-inner hidden md:flex">
        <table className="w-full text-left border-collapse">
        <thead className="bg-white/5 text-[10px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
            <tr>
            <th className="p-4 font-normal">Identidad</th>
            <th className="p-4 font-normal">Rol / Permisos</th>
            <th className="p-4 font-normal">Estado</th>
            <th className="p-4 font-normal">Actividad</th>
            <th className="p-4 font-normal text-right">Acciones</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-white/5 text-sm">
            {isFetchingUsers ? (
            <tr>
                <td colSpan="5" className="p-8 text-center">
                <div className="flex items-center justify-center gap-3">
                    <Loader size={16} className="text-cyan-400 animate-spin" />
                    <span className="text-gray-400 font-mono text-sm">Cargando usuarios...</span>
                </div>
                </td>
            </tr>
            ) : filteredUsers.length === 0 ? (
            <tr>
                <td colSpan="5" className="p-8 text-center">
                <span className="text-gray-500 font-mono text-sm">No hay usuarios disponibles</span>
                </td>
            </tr>
            ) : (
            filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/5 p-0.5 border border-white/10 overflow-hidden">
                        <img 
                            src={getAvatarUrl(avatarOptions.find(a => a.id === user.avatarId) || avatarOptions[0])} 
                            alt={user.name}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div>
                        <div className="font-bold text-gray-200 text-sm">{user.name}</div>
                        <div className="text-[10px] text-gray-500 font-mono tracking-tight">{user.email}</div>
                    </div>
                    </div>
                </td>
                <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
                    user.role === 'ADMIN' 
                        ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5 shadow-[0_0_10px_rgba(6,182,212,0.1)]' 
                        : user.role === 'OPERATOR'
                            ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                            : 'border-white/20 text-gray-400 bg-white/5'
                    }`}>
                    {user.role === 'ADMIN' && <Shield size={10} />}
                    {user.role}
                    </span>
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-2">
                    <div className={`relative w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}>
                        {user.status === 'Activo' && <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                    </div>
                    <span className={`text-xs ${user.status === 'Activo' ? 'text-gray-300' : 'text-gray-600'}`}>{user.status}</span>
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-col">
                        <span className="text-gray-400 font-mono text-xs">{user.createdAt}</span>
                        <span className="text-[10px] text-gray-600">Registro</span>
                    </div>
                </td>
                <td className="p-4 text-right">
                    <div className="flex justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleEditUser(user)}
                        disabled={isLoading}
                        className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors disabled:opacity-50" 
                        title="Editar"
                    >
                        <Edit2 size={14} />
                    </button>
                    <button 
                        onClick={() => setShowDeleteConfirm(user.id)}
                        disabled={isLoading}
                        className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50" 
                        title="Eliminar"
                    >
                        <Trash2 size={14} />
                    </button>
                    <div className="relative">
                        <button 
                        onClick={() => setShowMoreOptions(showMoreOptions === user.id ? null : user.id)}
                        disabled={isLoading}
                        className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                        <MoreVertical size={14} />
                        </button>
                        <AnimatePresence>
                        {showMoreOptions === user.id && (
                            <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 top-full mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50 p-3 min-w-max"
                            >
                            {/* Toggle Switch */}
                            <div className="flex items-center gap-3">
                                <label className="text-xs text-gray-400">
                                {user.status === 'Activo' ? 'Activo' : 'Inactivo'}
                                </label>
                                <button
                                onClick={() => handleToggleStatus(user.id, user.status)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    user.status === 'Activo'
                                    ? 'bg-green-600 shadow-[0_0_10px_rgba(34,197,94,0.4)]'
                                    : 'bg-gray-600'
                                }`}
                                disabled={isLoading}
                                >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                    user.status === 'Activo' ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                />
                                </button>
                            </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                    </div>
                </td>
                </tr>
            ))
            )}
        </tbody>
        </table>
    </ScrollArea>

    {/* Users Mobile Cards - Mobile */}
    <div className="flex md:hidden flex-1 flex-col gap-3 overflow-y-auto">
        {isFetchingUsers ? (
        <div className="flex items-center justify-center h-40">
            <div className="flex items-center gap-3">
            <Loader size={16} className="text-cyan-400 animate-spin" />
            <span className="text-gray-400 font-mono text-sm">Cargando usuarios...</span>
            </div>
        </div>
        ) : filteredUsers.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-gray-500 text-xs">
            No hay usuarios
        </div>
        ) : (
        filteredUsers.map((user) => (
            <div 
            key={user.id} 
            className="p-4 rounded-lg border border-white/10 bg-black/40 hover:bg-black/60 transition-colors"
            >
            {/* User Header */}
            <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 rounded-lg bg-white/5 p-0.5 border border-white/10 overflow-hidden shrink-0">
                    <img 
                        src={getAvatarUrl(avatarOptions.find(a => a.id === user.avatarId) || avatarOptions[0])} 
                        alt={user.name}
                        className="w-full h-full object-cover rounded-md"
                    />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-200 text-xs md:text-sm truncate">{user.name}</div>
                    <div className="text-[10px] text-gray-500 font-mono tracking-tight truncate">{user.email}</div>
                </div>
            </div>

            {/* Role and Status Row */}
            <div className="flex items-center gap-2 justify-between mb-3 py-2 border-t border-white/5">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider shrink-0 ${
                user.role === 'ADMIN' 
                    ? 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5' 
                    : user.role === 'OPERATOR'
                        ? 'border-purple-500/30 text-purple-400 bg-purple-500/5'
                        : 'border-white/20 text-gray-400 bg-white/5'
                }`}>
                {user.role === 'ADMIN' && <Shield size={8} />}
                {user.role}
                </span>
                <div className="flex items-center gap-1.5">
                <div className={`relative w-2 h-2 rounded-full ${user.status === 'Activo' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-600'}`}>
                    {user.status === 'Activo' && <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" />}
                </div>
                <span className={`text-xs font-medium ${user.status === 'Activo' ? 'text-gray-300' : 'text-gray-600'}`}>{user.status}</span>
                </div>
            </div>

            {/* Activity Row */}
            <div className="flex items-center justify-between text-[10px] mb-3 pb-2 border-b border-white/5">
                <span className="text-gray-500">Registrado:</span>
                <span className="text-gray-400 font-mono">{user.createdAt}</span>
            </div>

            {/* Actions Row */}
            <div className="flex justify-end gap-2">
                <motion.button
                onClick={() => handleEditUser(user)}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-cyan-500/10 hover:text-cyan-400 rounded-lg transition-colors disabled:opacity-50"
                title="Editar"
                >
                <Edit2 size={14} />
                </motion.button>
                <motion.button
                onClick={() => setShowDeleteConfirm(user.id)}
                disabled={isLoading}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors disabled:opacity-50"
                title="Eliminar"
                >
                <Trash2 size={14} />
                </motion.button>
                <div className="relative">
                <motion.button
                    onClick={() => setShowMoreOptions(showMoreOptions === user.id ? null : user.id)}
                    disabled={isLoading}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <MoreVertical size={14} />
                </motion.button>
                <AnimatePresence>
                    {showMoreOptions === user.id && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-full mt-2 bg-black border border-white/10 rounded-lg shadow-lg z-50"
                    >
                        <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        className="block w-full text-left px-4 py-2 text-xs text-gray-300 hover:text-cyan-400 hover:bg-white/5 rounded-lg"
                        >
                        {user.status === 'Activo' ? 'Desactivar' : 'Activar'}
                        </button>
                    </motion.div>
                    )}
                </AnimatePresence>
                </div>
            </div>
            </div>
        ))
        )}
    </div>

    {/* Modal de confirmación para eliminar */}
    <AnimatePresence>
        {showDeleteConfirm && (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteConfirm(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        >
            <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0f0f0f] border border-red-500/30 rounded-2xl shadow-2xl max-w-sm w-full"
            >
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-2">Confirmar eliminación</h3>
                <p className="text-gray-400 text-sm mb-6">¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.</p>
                <div className="flex gap-3 justify-end">
                <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-4 py-2 rounded-lg border border-gray-500/30 text-gray-300 hover:bg-gray-500/10 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={() => handleDeleteUser(showDeleteConfirm)}
                    disabled={isLoading}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                    {isLoading ? <RotateCw size={14} className="animate-spin" /> : null}
                    Eliminar
                </button>
                </div>
            </div>
            </motion.div>
        </motion.div>
        )}
    </AnimatePresence>
    </div>
);
};

export default CreateUsersSection;
