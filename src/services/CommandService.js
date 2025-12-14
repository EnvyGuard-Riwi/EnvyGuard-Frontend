/**
 * Command Service
 * Maneja todas las operaciones relacionadas con comandos remotos
 * Incluye: crear, obtener, filtrar por estado, etc.
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

// Acciones disponibles para comandos remotos
export const COMMAND_ACTIONS = {
  SHUTDOWN: 'SHUTDOWN',       // Apaga el equipo inmediatamente
  REBOOT: 'REBOOT',           // Reinicia el equipo
  WAKE_ON_LAN: 'WAKE_ON_LAN', // Enciende el equipo (solo si está apagado, requiere MAC)
  LOCK_SESSION: 'LOCK_SESSION', // Bloquea la sesión actual del usuario
  BLOCK_WEBSITE: 'BLOCK_WEBSITE', // Bloquea acceso a un sitio (requiere URL en parameters)
};

// Mapeo de acciones a endpoints
const ACTION_ENDPOINTS = {
  SHUTDOWN: API_CONFIG.ENDPOINTS.COMMANDS.SHUTDOWN,
  REBOOT: API_CONFIG.ENDPOINTS.COMMANDS.REBOOT,
  WAKE_ON_LAN: API_CONFIG.ENDPOINTS.COMMANDS.WAKE_ON_LAN,
  LOCK_SESSION: API_CONFIG.ENDPOINTS.COMMANDS.LOCK_SESSION,
  BLOCK_WEBSITE: API_CONFIG.ENDPOINTS.COMMANDS.BLOCK_WEBSITE,
};

const commandService = {
  /**
   * Enviar un comando remoto a un PC usando query params
   * @param {Object} commandData - Datos del comando
   * @param {number} commandData.salaNumber - Número de sala (1-4)
   * @param {number} commandData.pcId - ID del PC (1, 2, 3...)
   * @param {string} commandData.action - Acción a ejecutar (SHUTDOWN, REBOOT, etc.)
   * @returns {Promise<Object>} Comando creado con estado
   */
  sendCommand: async (commandData) => {
    try {
      const { salaNumber, pcId, action, parameters } = commandData;
      apiLog('log', `Enviando comando ${action} a Sala ${salaNumber}, PC ${pcId}...`);
      
      // Construir el body JSON con camelCase como espera el backend
      const payload = {
        salaNumber: parseInt(salaNumber),
        pcId: parseInt(pcId),
        action,
      };
      
      // Agregar parámetros opcionales si existen
      if (parameters) {
        payload.parameters = typeof parameters === 'string' 
          ? parameters 
          : JSON.stringify(parameters);
      }
      
      console.log('[CommandService] Payload:', JSON.stringify(payload));
      
      // Enviar a POST /commands con body JSON
      const response = await axiosInstance.post(
        API_CONFIG.ENDPOINTS.COMMANDS.CREATE, 
        payload
      );
      
      apiLog('log', `Comando ${action} enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar comando ${commandData.action}`, error.message);
      
      // Log más detallado del error
      console.error('[CommandService] Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos: sala o pcId no válidos');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al enviar comando');
    }
  },

  /**
   * Crear y enviar un comando remoto a un PC (método legacy)
   * @deprecated Usar sendCommand en su lugar
   */
  createCommand: async (commandData) => {
    // Redirigir al nuevo método
    return commandService.sendCommand(commandData);
  },

  /**
   * Enviar comando Wake-on-LAN para encender un PC
   * Usa query params como espera el backend
   * @param {number} salaNumber - Número de sala (1-4)
   * @param {number} pcId - ID del PC en la base de datos
   * @returns {Promise<Object>} Comando WoL enviado
   */
  sendWakeOnLan: async (salaNumber, pcId) => {
    try {
      apiLog('log', `Enviando Wake-on-LAN a Sala ${salaNumber}, PC ${pcId}...`);
      
      console.log('[CommandService] WoL Query params:', { salaNumber, pcId });
      
      // POST /commands/wake-on-lan con query params
      const response = await axiosInstance.post(
        `${API_CONFIG.ENDPOINTS.COMMANDS.WAKE_ON_LAN}?salaNumber=${parseInt(salaNumber)}&pcId=${parseInt(pcId)}`
      );
      
      apiLog('log', `Wake-on-LAN enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar Wake-on-LAN`, error.message);
      console.error('[CommandService] WoL Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos para Wake-on-LAN');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al enviar Wake-on-LAN');
    }
  },

  /**
   * Enviar comando SHUTDOWN para apagar un PC
   * Usa query params como espera el backend
   * @param {number} salaNumber - Número de sala (1-4)
   * @param {number} pcId - ID del PC en la base de datos
   * @returns {Promise<Object>} Comando de apagado enviado
   */
  sendShutdown: async (salaNumber, pcId) => {
    try {
      apiLog('log', `Enviando SHUTDOWN a Sala ${salaNumber}, PC ${pcId}...`);
      
      console.log('[CommandService] Shutdown Query params:', { salaNumber, pcId });
      
      // POST /commands/shutdown con query params
      const response = await axiosInstance.post(
        `${API_CONFIG.ENDPOINTS.COMMANDS.SHUTDOWN}?salaNumber=${parseInt(salaNumber)}&pcId=${parseInt(pcId)}`
      );
      
      apiLog('log', `SHUTDOWN enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar SHUTDOWN`, error.message);
      console.error('[CommandService] Shutdown Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos para SHUTDOWN');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al enviar SHUTDOWN');
    }
  },

  /**
   * Enviar comando REBOOT para reiniciar un PC
   * Usa query params como espera el backend
   * @param {number} salaNumber - Número de sala (1-4)
   * @param {number} pcId - ID del PC en la base de datos
   * @returns {Promise<Object>} Comando de reinicio enviado
   */
  sendReboot: async (salaNumber, pcId) => {
    try {
      apiLog('log', `Enviando REBOOT a Sala ${salaNumber}, PC ${pcId}...`);
      
      console.log('[CommandService] Reboot Query params:', { salaNumber, pcId });
      
      // POST /commands/reboot con query params
      const response = await axiosInstance.post(
        `${API_CONFIG.ENDPOINTS.COMMANDS.REBOOT}?salaNumber=${parseInt(salaNumber)}&pcId=${parseInt(pcId)}`
      );
      
      apiLog('log', `REBOOT enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar REBOOT`, error.message);
      console.error('[CommandService] Reboot Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos para REBOOT');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al enviar REBOOT');
    }
  },

  /**
   * Enviar comando LOCK_SESSION para bloquear la sesión de un PC
   * Usa query params como espera el backend
   * @param {number} salaNumber - Número de sala (1-4)
   * @param {number} pcId - ID del PC en la base de datos
   * @returns {Promise<Object>} Comando de bloqueo de sesión enviado
   */
  sendLockSession: async (salaNumber, pcId) => {
    try {
      apiLog('log', `Enviando LOCK_SESSION a Sala ${salaNumber}, PC ${pcId}...`);
      
      console.log('[CommandService] LockSession Query params:', { salaNumber, pcId });
      
      // POST /commands/lock-session con query params
      const response = await axiosInstance.post(
        `${API_CONFIG.ENDPOINTS.COMMANDS.LOCK_SESSION}?salaNumber=${parseInt(salaNumber)}&pcId=${parseInt(pcId)}`
      );
      
      apiLog('log', `LOCK_SESSION enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar LOCK_SESSION`, error.message);
      console.error('[CommandService] LockSession Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos para LOCK_SESSION');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al enviar LOCK_SESSION');
    }
  },

  /**
   * Enviar comando BLOCK_WEBSITE para bloquear un sitio web en un PC
   * Usa query params como espera el backend
   * @param {number} salaNumber - Número de sala (1-4)
   * @param {number} pcId - ID del PC en la base de datos
   * @param {string} url - URL del sitio a bloquear (ej: facebook.com)
   * @returns {Promise<Object>} Comando de bloqueo enviado
   */
  sendBlockWebsite: async (salaNumber, pcId, url) => {
    try {
      apiLog('log', `Enviando BLOCK_WEBSITE a Sala ${salaNumber}, PC ${pcId}, URL: ${url}...`);
      
      console.log('[CommandService] BlockWebsite Query params:', { salaNumber, pcId, url });
      
      // POST /commands/block-website con query params
      const response = await axiosInstance.post(
        `${API_CONFIG.ENDPOINTS.COMMANDS.BLOCK_WEBSITE}?salaNumber=${parseInt(salaNumber)}&pcId=${parseInt(pcId)}&url=${encodeURIComponent(url)}`
      );
      
      apiLog('log', `BLOCK_WEBSITE enviado exitosamente`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar BLOCK_WEBSITE`, error.message);
      console.error('[CommandService] BlockWebsite Error response:', error.response?.data);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      if (error.response?.status === 400) {
        throw new Error('Datos inválidos para bloquear sitio web');
      }
      if (error.response?.status === 404) {
        throw new Error('PC no encontrado en la sala especificada');
      }
      throw new Error(error.response?.data?.message || 'Error al bloquear sitio web');
    }
  },

  /**
   * Crear y enviar un comando remoto usando la IP del PC
   * @param {Object} commandData - Datos del comando
   * @param {string} commandData.ip - IP del PC
   * @param {string} commandData.action - Acción a ejecutar (SHUTDOWN, REBOOT, etc.)
   * @param {string} [commandData.parameters] - Parámetros opcionales
   * @returns {Promise<Object>} Comando creado con estado
   */
  createCommandByIP: async (commandData) => {
    try {
      const { ip, action, parameters } = commandData;
      apiLog('log', `Enviando comando ${action} a IP: ${ip}...`);
      
      const payload = {
        ip,
        action,
      };
      
      if (parameters) {
        payload.parameters = typeof parameters === 'string' 
          ? parameters 
          : JSON.stringify(parameters);
      }
      
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.COMMANDS.CREATE, payload);
      apiLog('log', `Comando ${action} enviado exitosamente a ${ip}`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al enviar comando ${commandData.action} a IP ${commandData.ip}`, error.message);
      
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        throw new Error(backendMessage);
      }
      
      throw new Error(error.response?.data?.message || 'Error al enviar comando');
    }
  },

  /**
   * Apagar un PC remotamente
   * @param {number} salaNumber - Número de sala
   * @param {number} pcId - ID del PC
   * @param {Object} [options] - Opciones adicionales
   * @param {number} [options.delay] - Segundos de espera antes de apagar
   * @param {boolean} [options.force] - Forzar apagado
   */
  shutdownPC: async (salaNumber, pcId, options = {}) => {
    const parameters = options.delay || options.force 
      ? JSON.stringify({ delay: options.delay || 0, force: options.force || false })
      : undefined;
    return commandService.createCommand({
      salaNumber,
      pcId,
      action: COMMAND_ACTIONS.SHUTDOWN,
      parameters,
    });
  },

  /**
   * Reiniciar un PC remotamente
   * @param {number} salaNumber - Número de sala
   * @param {number} pcId - ID del PC
   */
  rebootPC: async (salaNumber, pcId) => {
    return commandService.createCommand({
      salaNumber,
      pcId,
      action: COMMAND_ACTIONS.REBOOT,
    });
  },

  /**
   * Encender un PC remotamente (Wake on LAN)
   * @param {number} salaNumber - Número de sala
   * @param {number} pcId - ID del PC
   */
  wakeOnLan: async (salaNumber, pcId) => {
    return commandService.createCommand({
      salaNumber,
      pcId,
      action: COMMAND_ACTIONS.WAKE_ON_LAN,
    });
  },

  /**
   * Bloquear sesión de un PC remotamente
   * @param {number} salaNumber - Número de sala
   * @param {number} pcId - ID del PC
   */
  lockSession: async (salaNumber, pcId) => {
    return commandService.createCommand({
      salaNumber,
      pcId,
      action: COMMAND_ACTIONS.LOCK_SESSION,
    });
  },

  /**
   * Bloquear un sitio web en un PC
   * @param {number} salaNumber - Número de sala
   * @param {number} pcId - ID del PC
   * @param {string} url - URL a bloquear
   */
  blockWebsite: async (salaNumber, pcId, url) => {
    return commandService.createCommand({
      salaNumber,
      pcId,
      action: COMMAND_ACTIONS.BLOCK_WEBSITE,
      parameters: JSON.stringify({ url }),
    });
  },

  /**
   * Obtener todos los comandos ejecutados
   * @returns {Promise<Array>} Lista de comandos
   */
  getAllCommands: async () => {
    try {
      apiLog('log', 'Obteniendo historial de comandos...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.COMMANDS.GET_ALL);
      apiLog('log', `Comandos obtenidos: ${response.data?.length || 0} comandos`);
      return response.data || [];
    } catch (error) {
      apiLog('error', 'Error al obtener comandos', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener historial de comandos');
    }
  },

  /**
   * Obtener detalles de un comando específico por ID
   * @param {number} commandId - ID del comando
   * @returns {Promise<Object>} Detalles del comando
   */
  getCommandById: async (commandId) => {
    try {
      apiLog('log', `Obteniendo comando ${commandId}...`);
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.COMMANDS.GET_BY_ID, { id: commandId });
      const response = await axiosInstance.get(url);
      apiLog('log', `Comando ${commandId} obtenido`, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', `Error al obtener comando ${commandId}`, error.message);
      if (error.response?.status === 404) {
        throw new Error('Comando no encontrado');
      }
      throw new Error(error.response?.data?.message || 'Error al obtener detalles del comando');
    }
  },

  /**
   * Obtener comandos por estado
   * @param {string} status - Estado del comando (PENDING, SENT, EXECUTED, FAILED)
   * @returns {Promise<Array>} Lista de comandos filtrados
   */
  getCommandsByStatus: async (status) => {
    try {
      apiLog('log', `Obteniendo comandos con estado: ${status}...`);
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.COMMANDS.GET_BY_STATUS, { status });
      const response = await axiosInstance.get(url);
      apiLog('log', `Comandos ${status}: ${response.data?.length || 0} comandos`);
      return response.data || [];
    } catch (error) {
      apiLog('error', `Error al obtener comandos ${status}`, error.message);
      throw new Error(error.response?.data?.message || `Error al obtener comandos ${status}`);
    }
  },

  /**
   * Obtener historial de comandos de un PC específico
   * @param {string} computerName - Nombre del PC (ej: 'PC 1', 'PC 2')
   * @returns {Promise<Array>} Lista de comandos del PC
   */
  getCommandsByComputer: async (computerName) => {
    try {
      apiLog('log', `Obteniendo comandos del PC: ${computerName}...`);
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.COMMANDS.GET_BY_COMPUTER, { computerName });
      const response = await axiosInstance.get(url);
      apiLog('log', `Comandos de ${computerName}: ${response.data?.length || 0} comandos`);
      return response.data || [];
    } catch (error) {
      apiLog('error', `Error al obtener comandos de ${computerName}`, error.message);
      throw new Error(error.response?.data?.message || `Error al obtener comandos del PC ${computerName}`);
    }
  },

  /**
   * Obtener historial de comandos de un PC como logs formateados
   * @param {string} computerName - Nombre del PC
   * @returns {Promise<Array>} Lista de logs formateados
   */
  getComputerCommandsAsLogs: async (computerName) => {
    try {
      const commands = await commandService.getCommandsByComputer(computerName);
      return commands.map(commandService.mapCommandToLog);
    } catch (error) {
      throw error;
    }
  },

  /**
   * Mapear comando de API a formato de log para la UI
   * @param {Object} command - Comando de la API
   * @returns {Object} Log formateado para la UI
   */
  mapCommandToLog: (command) => {
    const actionLabels = {
      'SHUTDOWN': 'Apagado de equipo',
      'REBOOT': 'Reinicio de equipo',
      'WAKE_ON_LAN': 'Encendido remoto (WoL)',
      'LOCK_SESSION': 'Bloqueo de sesión',
      'BLOCK_WEBSITE': 'Bloqueo de sitio web',
    };

    const statusMap = {
      'PENDING': 'warning',
      'SENT': 'info',
      'EXECUTED': 'success',
      'FAILED': 'error',
    };

    const statusLabels = {
      'PENDING': 'Pendiente',
      'SENT': 'Enviado',
      'EXECUTED': 'Ejecutado',
      'FAILED': 'Fallido',
    };

    return {
      id: command.id,
      timestamp: command.createdAt || command.sentAt,
      device: command.computerName || `PC ${command.pcId}`,
      targetIp: command.targetIp,
      macAddress: command.macAddress,
      salaNumber: command.salaNumber,
      action: actionLabels[command.action] || command.action,
      actionType: command.action,
      type: 'Comando',
      status: statusMap[command.status] || 'info',
      statusLabel: statusLabels[command.status] || command.status,
      parameters: command.parameters,
      resultMessage: command.resultMessage,
      userEmail: command.userEmail,
      sentAt: command.sentAt,
      executedAt: command.executedAt,
    };
  },

  /**
   * Obtener todos los comandos mapeados como logs
   * @returns {Promise<Array>} Lista de logs formateados
   */
  getCommandsAsLogs: async () => {
    try {
      const commands = await commandService.getAllCommands();
      return commands.map(commandService.mapCommandToLog);
    } catch (error) {
      throw error;
    }
  },
};

export default commandService;
