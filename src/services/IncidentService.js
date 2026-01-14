/**
 * Incident Service
 * Maneja todas las operaciones relacionadas con incidentes/novedades
 * Incluye: listar, crear y marcar como completado
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, replaceUrlParams, apiLog } from '../config/apiConfig';

// Estados disponibles para incidentes
export const INCIDENT_STATUS = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
};

// Niveles de severidad disponibles
export const INCIDENT_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
};

const incidentService = {
  /**
   * Obtener todos los incidentes sin filtrar
   * @returns {Promise<Array>} Array de todos los incidentes
   */
  getAllIncidents: async () => {
    try {
      apiLog('log', 'Obteniendo todos los incidentes...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.INCIDENTS.GET_ALL);
      apiLog('log', 'Total incidentes: ' + (Array.isArray(response.data) ? response.data.length : 'No es array'));
      return response.data || [];
    } catch (error) {
      apiLog('error', 'Error al obtener incidentes', error.response?.data || error.message);
      return [];
    }
  },

  /**
   * Obtener todos los incidentes filtrados por estado
   * @param {string} status - Estado del incidente (PENDING/COMPLETED)
   * @returns {Promise<Array>} Array de incidentes
   */
  getIncidentsByStatus: async (status = INCIDENT_STATUS.PENDING) => {
    try {
      apiLog('log', 'Obteniendo incidentes con estado: ' + status + '...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.INCIDENTS.GET_BY_STATUS, {
        params: { status },
      });
      apiLog('log', 'Incidentes obtenidos: ' + response.data.length + ' incidentes');
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al obtener incidentes', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener incidentes');
    }
  },

  /**
   * Obtener todos los incidentes pendientes
   * @returns {Promise<Array>} Array de incidentes pendientes
   */
  getPendingIncidents: async () => {
    return incidentService.getIncidentsByStatus(INCIDENT_STATUS.PENDING);
  },

  /**
   * Obtener todos los incidentes completados
   * @returns {Promise<Array>} Array de incidentes completados
   */
  getCompletedIncidents: async () => {
    return incidentService.getIncidentsByStatus(INCIDENT_STATUS.COMPLETED);
  },

  /**
   * Crear un nuevo incidente
   * @param {Object} incidentData - Datos del incidente
   * @param {string} incidentData.description - Descripcion del incidente (requerido)
   * @param {string} incidentData.severity - Severidad del incidente (LOW/MEDIUM/HIGH/CRITICAL)
   * @returns {Promise<Object>} Incidente creado
   */
  createIncident: async (incidentData) => {
    try {
      apiLog('log', 'Creando nuevo incidente...');
      const body = {
        description: incidentData.description,
        severity: incidentData.severity || INCIDENT_SEVERITY.LOW,
      };
      apiLog('log', 'Datos a enviar', body);
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.INCIDENTS.CREATE, body);
      apiLog('log', 'Incidente creado', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al crear incidente', error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Marcar un incidente como completado
   * @param {number} incidentId - ID del incidente
   * @returns {Promise<Object>} Incidente actualizado
   */
  completeIncident: async (incidentId) => {
    try {
      apiLog('log', 'Marcando incidente ' + incidentId + ' como completado...');
      const url = replaceUrlParams(API_CONFIG.ENDPOINTS.INCIDENTS.COMPLETE, { id: incidentId });
      console.log('🌐 URL completa:', url);
      const response = await axiosInstance.patch(url);
      apiLog('log', 'Incidente completado', response.data);
      console.log('✅ Respuesta exitosa:', response.status, response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al completar incidente ' + incidentId, error.message);
      console.error('❌ Error completo:', error);
      console.error('❌ Response:', error.response);
      console.error('❌ Status:', error.response?.status);
      console.error('❌ Data:', error.response?.data);
      throw error; // Re-lanzar para manejar en el componente
    }
  },

  /**
   * Formatear fecha de incidente para mostrar
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada
   */
  formatIncidentDate: (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Obtener color de badge segun severidad
   * @param {string} severity - Severidad del incidente
   * @returns {string} Clase CSS o color para el badge
   */
  getSeverityColor: (severity) => {
    const colors = {
      LOW: 'green',
      MEDIUM: 'yellow',
      HIGH: 'orange',
      CRITICAL: 'red',
    };
    return colors[severity] || 'gray';
  },

  /**
   * Obtener color de badge segun estado
   * @param {string} status - Estado del incidente
   * @returns {string} Clase CSS o color para el badge
   */
  getStatusColor: (status) => {
    const colors = {
      PENDING: 'yellow',
      COMPLETED: 'green',
    };
    return colors[status] || 'gray';
  },
};

export default incidentService;
