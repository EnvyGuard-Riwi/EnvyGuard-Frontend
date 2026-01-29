/**
 * Control Service
 * Maneja todas las operaciones de control remoto de dispositivos
 * Incluye: shutdown, restart, lock, etc.
 */

import axios from 'axios';
import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

// URL base SIN /api - Nginx ya añade /api automáticamente en el proxy
const BASE_URL_API = 'https://api.andrescortes.dev';

// Acciones disponibles para control remoto
export const CONTROL_ACTIONS = {
  SHUTDOWN: 'shutdown',
  RESTART: 'restart',
  LOCK: 'lock',
  UNLOCK: 'unlock',
  SLEEP: 'sleep',
  WAKE: 'wake',
};

// Acciones de monitoreo de exámenes
export const EXAM_CONTROL_ACTIONS = {
  START: 'START',
  STOP: 'STOP',
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

  // ============================================
  // CONTROL DE MONITOREO DE EXÁMENES
  // ============================================

  /**
   * Enviar comando de control de examen (START/STOP) a todos los agentes
   * POST /control/{action} (sin prefijo /api)
   * @param {string} action - 'START' o 'STOP'
   * @returns {Promise<string>} Mensaje de confirmación
   */
  sendExamControl: async (action) => {
    try {
      const validActions = ['START', 'STOP'];
      if (!validActions.includes(action.toUpperCase())) {
        throw new Error(`Acción inválida. Use: ${validActions.join(' o ')}`);
      }

      apiLog('log', `Enviando control de examen: ${action}...`);

      // Endpoint con prefijo /api
      const endpoint = `${BASE_URL_API}/control/${action.toUpperCase()}`;

      // Obtener token para autenticación
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      console.log('[ControlService] Token presente:', !!token);
      console.log('[ControlService] Usuario:', user.email, '- Rol:', user.role);
      console.log('[ControlService] Endpoint:', endpoint);

      const response = await axios.post(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      apiLog('log', `Control de examen ${action} enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar control de examen ${action}`, error.message);
      console.error('[ControlService] Exam control error:', error.response?.data);
      console.error('[ControlService] Status:', error.response?.status);

      const backendMessage = error.response?.data?.message || error.response?.data;

      if (error.response?.status === 400) {
        throw new Error('Acción inválida (use START o STOP)');
      }

      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para controlar el monitoreo de exámenes');
      }

      if (error.response?.status === 401) {
        throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente');
      }

      throw new Error(backendMessage || `Error al enviar control de examen: ${action}`);
    }
  },

  /**
   * Iniciar monitoreo de examen en todos los agentes
   * Envía comando START via RabbitMQ fanout exchange
   * @returns {Promise<string>} Mensaje de confirmación
   */
  startExamMonitoring: async () => {
    return controlService.sendExamControl(EXAM_CONTROL_ACTIONS.START);
  },

  /**
   * Detener monitoreo de examen en todos los agentes
   * Envía comando STOP via RabbitMQ fanout exchange
   * @returns {Promise<string>} Mensaje de confirmación
   */
  stopExamMonitoring: async () => {
    return controlService.sendExamControl(EXAM_CONTROL_ACTIONS.STOP);
  },
};

export default controlService;
