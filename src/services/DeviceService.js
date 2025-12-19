/**
 * Device Service
 * Maneja todas las operaciones relacionadas con dispositivos
 * Incluye: crear, leer, actualizar, eliminar y ejecutar acciones
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

const deviceService = {
  getAllDevices: async () => {
    try {
      apiLog('log', 'Obteniendo dispositivos...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.DEVICES.GET_ALL);
      apiLog('log', 'Dispositivos obtenidos: ' + response.data.length + ' dispositivos');
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener dispositivos', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener dispositivos');
    }
  },

  getDeviceById: async (deviceId) => {
    try {
      apiLog('log', 'Obteniendo dispositivo ' + deviceId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.DEVICES.GET_BY_ID, { id: deviceId });
      const response = await axiosInstance.get(url);
      apiLog('log', 'Dispositivo obtenido', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener dispositivo ' + deviceId, error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener dispositivo');
    }
  },

  executeAction: async (deviceId, action) => {
    try {
      apiLog('log', 'Ejecutando accion ' + action + ' en dispositivo ' + deviceId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.DEVICES.EXECUTE_ACTION, { id: deviceId, action: action });
      const response = await axiosInstance.post(url);
      apiLog('log', 'Accion ' + action + ' ejecutada', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al ejecutar accion ' + action, error.message);
      throw new Error(error.response?.data?.message || 'Error al ejecutar accion ' + action);
    }
  },

  executeBatchAction: async (deviceIds, action) => {
    try {
      apiLog('log', 'Ejecutando accion batch ' + action + ' en ' + deviceIds.length + ' dispositivos...');
      const promises = deviceIds.map(deviceId =>
        deviceService.executeAction(deviceId, action)
          .then(() => ({ id: deviceId, status: 'success' }))
          .catch(() => ({ id: deviceId, status: 'error' }))
      );
      const results = await Promise.all(promises);
      const successCount = results.filter(r => r.status === 'success').length;
      apiLog('log', 'Accion batch completada: ' + successCount + '/' + deviceIds.length + ' exitosas');
      return results;
    } catch (error) {
      apiLog('error', 'Error en accion batch', error.message);
      throw new Error(error.response?.data?.message || 'Error en accion batch');
    }
  },

  getDeviceStatus: async (deviceId) => {
    try {
      apiLog('log', 'Obteniendo estado del dispositivo ' + deviceId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.DEVICES.GET_STATUS, { id: deviceId });
      const response = await axiosInstance.get(url);
      apiLog('log', 'Estado obtenido', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener estado', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener estado del dispositivo');
    }
  },

  getDeviceMetrics: async (deviceId) => {
    try {
      apiLog('log', 'Obteniendo metricas del dispositivo ' + deviceId + '...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.DEVICES.GET_METRICS, { id: deviceId });
      const response = await axiosInstance.get(url);
      apiLog('log', 'Metricas obtenidas', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener metricas', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener metricas');
    }
  },

  getDevicesByStatus: async (status) => {
    try {
      apiLog('log', 'Buscando dispositivos con estado ' + status + '...');
      const allDevices = await deviceService.getAllDevices();
      const filtered = allDevices.filter(device => device.status === status);
      apiLog('log', filtered.length + ' dispositivos encontrados con estado ' + status);
      return filtered;
    } catch (error) {
      apiLog('error', 'Error al filtrar dispositivos', error.message);
      throw error;
    }
  },

  sendCommand: async (deviceId, command, params = {}) => {
    return deviceService.executeAction(deviceId, command);
  },

  // ============================================
  // COMPUTERS STATUS (Radar en tiempo real)
  // ============================================

  /**
   * Obtener lista de todos los computadores con su estado actual
   * GET /api/computers
   * @returns {Promise<Array>} Lista de computadores con status ONLINE/OFFLINE
   * Cada computador tiene: id, name, ipAddress, macAddress, status, lastSeen, 
   * labName, roomNumber, positionInRoom, createdAt, updatedAt
   */
  getComputersStatus: async () => {
    try {
      apiLog('log', 'Obteniendo estado de computadores...', null);

      // Usar el endpoint público para obtener estado de computadores
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.COMPUTERS.LIST);

      apiLog('log', `${response.data?.length || 0} computadores obtenidos`);
      return response.data || [];
    } catch (error) {
      apiLog('error', 'Error al obtener estado de computadores', error.message);

      // Manejar errores específicos
      if (error.response?.status === 403) {
        throw new Error('Sin permisos para ver computadores. Verifica tu rol de usuario.');
      }
      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }

      throw new Error(error.response?.data?.message || 'Error al obtener estado de computadores');
    }
  },

  /**
   * Obtener computadores filtrados por estado
   * @param {string} status - 'ONLINE' o 'OFFLINE'
   * @returns {Promise<Array>} Lista filtrada de computadores
   */
  getComputersByStatus: async (status) => {
    try {
      const computers = await deviceService.getComputersStatus();
      return computers.filter(c => c.status?.toUpperCase() === status.toUpperCase());
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtener computadores por sala (roomNumber)
   * @param {number} roomNumber - Número de sala
   * @returns {Promise<Array>} Lista de computadores de esa sala
   */
  getComputersByRoom: async (roomNumber) => {
    try {
      const computers = await deviceService.getComputersStatus();
      return computers.filter(c => c.roomNumber === roomNumber);
    } catch (error) {
      throw error;
    }
  },
};

export default deviceService;
