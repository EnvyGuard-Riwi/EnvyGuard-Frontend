/**
 * Control Service
 * Maneja todas las operaciones de control remoto de dispositivos
 * Incluye: shutdown, restart, lock, etc.
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

// Acciones disponibles para control remoto
export const CONTROL_ACTIONS = {
  SHUTDOWN: 'shutdown',
  RESTART: 'restart',
  LOCK: 'lock',
  UNLOCK: 'unlock',
  SLEEP: 'sleep',
  WAKE: 'wake',
};

const controlService = {
  /**
   * Enviar una accion de control remoto
   * @param {string} action - Accion a ejecutar (shutdown, restart, lock, etc)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  sendAction: async (action) => {
    try {
      apiLog('log', 'Enviando control: ' + action);
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.CONTROL.SEND_ACTION, { action });
      const response = await axiosInstance.post(url);
      apiLog('log', 'Orden ' + action + ' enviada correctamente', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al enviar control ' + action, error.message);
      throw new Error(
        error.response?.data?.message || 'Error al enviar control ' + action
      );
    }
  },

  /**
   * Apagar dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  shutdown: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.SHUTDOWN);
  },

  /**
   * Reiniciar dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  restart: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.RESTART);
  },

  /**
   * Bloquear dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  lock: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.LOCK);
  },

  /**
   * Desbloquear dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  unlock: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.UNLOCK);
  },

  /**
   * Poner en suspension dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  sleep: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.SLEEP);
  },

  /**
   * Despertar dispositivo(s)
   * @returns {Promise<Object>} Respuesta del servidor
   */
  wake: async () => {
    return controlService.sendAction(CONTROL_ACTIONS.WAKE);
  },
};

export default controlService;
