/**
 * User Service
 * Maneja todas las operaciones relacionadas con usuarios
 * Incluye: crear, leer, actualizar, eliminar y cambiar estado
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

const userService = {
  generateRandomPassword: () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#\$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  },

  getAllUsers: async () => {
    try {
      apiLog('log', 'Obteniendo usuarios...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
      apiLog('log', 'Usuarios obtenidos: ' + response.data.length + ' usuarios');
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener usuarios', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener usuarios');
    }
  },

  getUserById: async (userId) => {
    try {
      apiLog('log', 'Obteniendo usuario ' + userId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.GET_BY_ID, { id: userId });
      const response = await axiosInstance.get(url);
      apiLog('log', 'Usuario obtenido', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener usuario ' + userId, error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener usuario');
    }
  },

  createUser: async (userData) => {
    try {
      apiLog('log', 'Creando nuevo usuario: ' + userData.email);
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'ADMIN',
      });
      apiLog('log', 'Usuario creado exitosamente', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al crear usuario', error.message);
      throw new Error(error.response?.data?.message || 'Error al crear usuario');
    }
  },

  updateUser: async (userId, userData) => {
    try {
      apiLog('log', 'Actualizando usuario ' + userId + '...');
      let passwordToSend = userData.password && userData.password.trim().length > 0 
        ? userData.password 
        : userService.generateRandomPassword();
      const payload = {
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        role: userData.role || 'OPERATOR',
        enabled: userData.enabled !== undefined ? userData.enabled : true,
        password: passwordToSend
      };
      apiLog('log', 'Payload enviado (password oculto)', { ...payload, password: '[HIDDEN]' });
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.UPDATE, { id: userId });
      const response = await axiosInstance.put(url, payload);
      apiLog('log', 'Usuario actualizado', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al actualizar usuario ' + userId, error.message);
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para actualizar este usuario');
      }
      throw new Error(error.response?.data?.message || 'Error al actualizar usuario');
    }
  },

  deleteUser: async (userId) => {
    try {
      apiLog('log', 'Eliminando usuario ' + userId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.DELETE, { id: userId });
      const response = await axiosInstance.delete(url);
      apiLog('log', 'Usuario eliminado', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al eliminar usuario ' + userId, error.message);
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar este usuario');
      }
      throw new Error(error.response?.data?.message || 'Error al eliminar usuario');
    }
  },

  toggleUserStatus: async (userId, enabled, userData = null) => {
    try {
      const status = enabled ? 'activar' : 'desactivar';
      apiLog('log', status + ' usuario ' + userId + '...');
      
      // Si tenemos datos del usuario, usar PUT para actualizar
      if (userData) {
        const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.UPDATE, { id: userId });
        const response = await axiosInstance.put(url, {
          email: userData.email,
          firstName: userData.firstName || userData.name?.split(' ')[0] || '',
          lastName: userData.lastName || userData.name?.split(' ').slice(1).join(' ') || '',
          role: userData.role,
          enabled: enabled,
          password: userService.generateRandomPassword(),
        });
        apiLog('log', 'Usuario ' + status + 'do', response.data);
        return response.data;
      }
      
      // Si no tenemos datos, intentar PATCH directo (puede fallar por CORS)
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.TOGGLE_STATUS, { id: userId });
      const response = await axiosInstance.patch(url, { enabled });
      apiLog('log', 'Usuario ' + status + 'do', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al cambiar estado del usuario', error.message);
      if (error.response?.status === 403) {
        const backendMsg = error.response?.data?.message;
        throw new Error(backendMsg || 'No tienes permisos para cambiar el estado de este usuario.');
      }
      throw new Error(error.response?.data?.message || error.message || 'Error al cambiar estado del usuario');
    }
  },

  changePassword: async (userId, newPassword) => {
    try {
      apiLog('log', 'Cambiando password del usuario ' + userId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.USERS.CHANGE_PASSWORD, { id: userId });
      const response = await axiosInstance.patch(url, { password: newPassword });
      apiLog('log', 'Password cambiada');
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al cambiar password', error.message);
      throw new Error(error.response?.data?.message || 'Error al cambiar password');
    }
  },

  searchUsers: async (searchTerm) => {
    try {
      if (!searchTerm.trim()) return [];
      apiLog('log', 'Buscando usuarios: ' + searchTerm + '...');
      const allUsers = await userService.getAllUsers();
      const filtered = allUsers.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      apiLog('log', filtered.length + ' usuarios encontrados');
      return filtered;
    } catch (error) {
      apiLog('error', 'Error al buscar usuarios', error.message);
      throw error;
    }
  },
};

export default userService;
