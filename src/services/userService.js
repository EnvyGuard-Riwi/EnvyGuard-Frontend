/**
 * User Service
 * Maneja todas las operaciones relacionadas con usuarios
 * Incluye: crear, leer, actualizar, eliminar y cambiar estado
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';

// Configurar instancia de axios para usuarios (con /auth)
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Configurar instancia de axios sin /auth (para endpoints que no lo requieren)
const axiosInstanceNoAuth = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para agregar token automáticamente en axiosInstanceNoAuth
axiosInstanceNoAuth.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      console.error('❌ No autorizado - Token inválido');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globales en axiosInstanceNoAuth
axiosInstanceNoAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o no válido
      console.error('❌ No autorizado - Token inválido');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const userService = {
  /**
   * Generar una contraseña aleatoria fuerte
   * @returns {string} Contraseña aleatoria
   */
  generateRandomPassword: () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  /**
   * Obtener todos los usuarios
   * @returns {Promise<Array>} Array de usuarios
   */
  getAllUsers: async () => {
    try {
      console.log('🔄 Obteniendo usuarios...');
      const response = await axiosInstance.get('/users');
      console.log('✅ Usuarios obtenidos:', response.data.length, 'usuarios');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener usuarios:', error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener usuarios'
      );
    }
  },

  /**
   * Obtener un usuario por ID
   * @param {string|number} userId - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  getUserById: async (userId) => {
    try {
      console.log(`🔄 Obteniendo usuario ${userId}...`);
      const response = await axiosInstance.get(`/users/${userId}`);
      console.log('✅ Usuario obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener usuario ${userId}:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener usuario'
      );
    }
  },

  /**
   * Crear nuevo usuario
   * @param {Object} userData - Datos del usuario (email, password, firstName, lastName, role)
   * @returns {Promise<Object>} Datos del usuario creado
   */
  createUser: async (userData) => {
    try {
      console.log('🔄 Creando nuevo usuario:', userData.email);
      const response = await axiosInstance.post('/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'ADMIN',
      });
      console.log('✅ Usuario creado exitosamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al crear usuario:', error.message);
      throw new Error(
        error.response?.data?.message || 'Error al crear usuario'
      );
    }
  },

  /**
   * Actualizar usuario con PUT
   * @param {string|number} userId - ID del usuario
   * @param {Object} userData - Datos a actualizar
   * @returns {Promise<Object>} Datos del usuario actualizado
   */
  updateUser: async (userId, userData) => {
    try {
      console.log(`🔄 Actualizando usuario ${userId}...`);
      
      // Determinar la contraseña a usar
      let passwordToSend = userData.password && userData.password.trim().length > 0 
        ? userData.password 
        : userService.generateRandomPassword();  // Generar una si no la proporciona
      
      // Construir payload con TODOS los campos requeridos
      const payload = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'OPERATOR',
        enabled: userData.enabled !== undefined ? userData.enabled : true,
        password: passwordToSend  // Siempre incluye password válida
      };

      console.log(`📍 URL: PUT /users/${userId}`);
      console.log(`📦 Payload:`, { ...payload, password: '[HIDDEN]' });  // Ocultar password en logs

      // Usar PUT a /users/{id} - requiere TODOS los campos incluido password
      const response = await axiosInstanceNoAuth.put(`/users/${userId}`, payload);
      console.log('✅ Usuario actualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al actualizar usuario ${userId}:`, error.message);
      console.error(`Error response:`, error.response?.data);
      
      if (error.response?.status === 403) {
        throw new Error(
          'No tienes permisos para actualizar este usuario'
        );
      }
      
      throw new Error(
        error.response?.data?.message || 'Error al actualizar usuario'
      );
    }
  },

  /**
   * Eliminar usuario
   * @param {string|number} userId - ID del usuario a eliminar
   * @returns {Promise<void>}
   */
  deleteUser: async (userId) => {
    try {
      console.log(`🗑️ Eliminando usuario ${userId}...`);
      const response = await axiosInstanceNoAuth.delete(`/users/${userId}`);
      console.log('✅ Usuario eliminado:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al eliminar usuario ${userId}:`, error.message);
      
      if (error.response?.status === 403) {
        throw new Error(
          'No tienes permisos para eliminar este usuario'
        );
      }
      
      throw new Error(
        error.response?.data?.message || 'Error al eliminar usuario'
      );
    }
  },

  /**
   * Cambiar estado del usuario (activar/desactivar)
   * @param {string|number} userId - ID del usuario
   * @param {boolean} enabled - true para activar, false para desactivar
   * @returns {Promise<Object>} Datos del usuario actualizado
   */
  toggleUserStatus: async (userId, enabled) => {
    try {
      const status = enabled ? 'activar' : 'desactivar';
      const token = localStorage.getItem('authToken');
      
      console.log(`🔄 ${status} usuario ${userId}...`);
      console.log(`📤 Enviando payload:`, { enabled });
      console.log(`🔐 Token presente:`, !!token);
      console.log(`📍 URL completa:`, `${API_BASE_URL}/users/${userId}`);
      
      // Intentar con PUT en lugar de PATCH
      const response = await axiosInstanceNoAuth.put(
        `/users/${userId}`,
        { enabled }
      );
      
      console.log(`✅ Usuario ${status}do:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al cambiar estado del usuario:`, error);
      console.error(`Error message:`, error.message);
      console.error(`Error status:`, error.response?.status);
      console.error(`Error data:`, error.response?.data);
      
      if (error.response?.status === 403) {
        throw new Error(
          'No tienes permisos para cambiar el estado de este usuario'
        );
      }
      
      throw new Error(
        error.response?.data?.message || 'Error al cambiar estado del usuario'
      );
    }
  },

  /**
   * Cambiar contraseña del usuario
   * @param {string|number} userId - ID del usuario
   * @param {string} newPassword - Nueva contraseña
   * @returns {Promise<Object>} Respuesta del servidor
   */
  changePassword: async (userId, newPassword) => {
    try {
      console.log(`🔄 Cambiando contraseña del usuario ${userId}...`);
      const response = await axiosInstance.patch(`/users/${userId}`, {
        password: newPassword,
      });
      console.log('✅ Contraseña cambiada');
      return response.data;
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error.message);
      throw new Error(
        error.response?.data?.message || 'Error al cambiar contraseña'
      );
    }
  },

  /**
   * Buscar usuarios por término
   * @param {string} searchTerm - Término de búsqueda
   * @returns {Promise<Array>} Array de usuarios que coinciden
   */
  searchUsers: async (searchTerm) => {
    try {
      if (!searchTerm.trim()) {
        return [];
      }
      
      console.log(`🔍 Buscando usuarios: "${searchTerm}"...`);
      const allUsers = await userService.getAllUsers();
      
      const filtered = allUsers.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      console.log(`✅ ${filtered.length} usuarios encontrados`);
      return filtered;
    } catch (error) {
      console.error('❌ Error al buscar usuarios:', error.message);
      throw error;
    }
  },
};

export default userService;
