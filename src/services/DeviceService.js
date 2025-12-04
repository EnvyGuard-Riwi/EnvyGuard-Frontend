/**
 * Device Service
 * Maneja todas las operaciones relacionadas con dispositivos
 * Incluye: crear, leer, actualizar, eliminar y ejecutar acciones
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';

// Configurar instancia de axios para dispositivos
const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/devices`,
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

// Interceptor para manejar errores globales
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('❌ No autorizado - Token inválido');
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const deviceService = {
  /**
   * Obtener todos los dispositivos
   * @returns {Promise<Array>} Array de dispositivos
   */
  getAllDevices: async () => {
    try {
      console.log('🔄 Obteniendo dispositivos...');
      const response = await axiosInstance.get('/');
      console.log('✅ Dispositivos obtenidos:', response.data.length, 'dispositivos');
      return response.data;
    } catch (error) {
      console.error('❌ Error al obtener dispositivos:', error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener dispositivos'
      );
    }
  },

  /**
   * Obtener un dispositivo por ID
   * @param {string|number} deviceId - ID del dispositivo
   * @returns {Promise<Object>} Datos del dispositivo
   */
  getDeviceById: async (deviceId) => {
    try {
      console.log(`🔄 Obteniendo dispositivo ${deviceId}...`);
      const response = await axiosInstance.get(`/${deviceId}`);
      console.log('✅ Dispositivo obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener dispositivo ${deviceId}:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener dispositivo'
      );
    }
  },

  /**
   * Ejecutar comando en dispositivo (shutdown, restart, etc)
   * @param {string|number} deviceId - ID del dispositivo
   * @param {string} action - Acción a ejecutar (shutdown, restart, etc)
   * @returns {Promise<Object>} Respuesta de la acción
   */
  executeAction: async (deviceId, action) => {
    try {
      console.log(`🔄 Ejecutando acción "${action}" en dispositivo ${deviceId}...`);
      const response = await axiosInstance.post(`/${deviceId}/actions/${action}`);
      console.log(`✅ Acción "${action}" ejecutada:`, response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al ejecutar acción ${action}:`, error.message);
      throw new Error(
        error.response?.data?.message || `Error al ejecutar acción ${action}`
      );
    }
  },

  /**
   * Ejecutar múltiples acciones en dispositivos
   * @param {Array<string|number>} deviceIds - IDs de dispositivos
   * @param {string} action - Acción a ejecutar
   * @returns {Promise<Object>} Resultados de las acciones
   */
  executeBatchAction: async (deviceIds, action) => {
    try {
      console.log(`🔄 Ejecutando acción batch "${action}" en ${deviceIds.length} dispositivos...`);
      
      const promises = deviceIds.map(deviceId =>
        deviceService.executeAction(deviceId, action)
          .then(() => ({ id: deviceId, status: 'success' }))
          .catch(() => ({ id: deviceId, status: 'error' }))
      );

      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.status === 'success').length;
      
      console.log(`✅ Acción batch completada: ${successCount}/${deviceIds.length} exitosas`);
      return results;
    } catch (error) {
      console.error('❌ Error en acción batch:', error.message);
      throw new Error(
        error.response?.data?.message || 'Error en acción batch'
      );
    }
  },

  /**
   * Obtener estado de un dispositivo
   * @param {string|number} deviceId - ID del dispositivo
   * @returns {Promise<Object>} Estado del dispositivo
   */
  getDeviceStatus: async (deviceId) => {
    try {
      console.log(`🔄 Obteniendo estado del dispositivo ${deviceId}...`);
      const response = await axiosInstance.get(`/${deviceId}/status`);
      console.log('✅ Estado obtenido:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener estado:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener estado del dispositivo'
      );
    }
  },

  /**
   * Obtener métricas de un dispositivo
   * @param {string|number} deviceId - ID del dispositivo
   * @returns {Promise<Object>} Métricas (CPU, RAM, disco, etc)
   */
  getDeviceMetrics: async (deviceId) => {
    try {
      console.log(`📊 Obteniendo métricas del dispositivo ${deviceId}...`);
      const response = await axiosInstance.get(`/${deviceId}/metrics`);
      console.log('✅ Métricas obtenidas:', response.data);
      return response.data;
    } catch (error) {
      console.error(`❌ Error al obtener métricas:`, error.message);
      throw new Error(
        error.response?.data?.message || 'Error al obtener métricas'
      );
    }
  },

  /**
   * Filtrar dispositivos por estado
   * @param {string} status - Estado (online, offline, etc)
   * @returns {Promise<Array>} Array de dispositivos filtrados
   */
  getDevicesByStatus: async (status) => {
    try {
      console.log(`🔍 Buscando dispositivos con estado "${status}"...`);
      const allDevices = await deviceService.getAllDevices();
      
      const filtered = allDevices.filter(device => device.status === status);
      console.log(`✅ ${filtered.length} dispositivos encontrados con estado "${status}"`);
      
      return filtered;
    } catch (error) {
      console.error('❌ Error al filtrar dispositivos:', error.message);
      throw error;
    }
  },

  /**
   * Enviar comando a un dispositivo (para compatibilidad con código antiguo)
   * @deprecated Usar executeAction en su lugar
   */
  sendCommand: async (deviceId, command, params = {}) => {
    return deviceService.executeAction(deviceId, command);
  },
};

export default deviceService;
