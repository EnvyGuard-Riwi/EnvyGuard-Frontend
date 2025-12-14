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
};

export default deviceService;
