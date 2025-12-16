/**
 * Blocked Websites Service
 * Gestión global de sitios web bloqueados
 * Los bloqueos se aplican a TODOS los computadores via RabbitMQ broadcast
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, apiLog } from '../config/apiConfig';

const blockedWebsitesService = {
  /**
   * Obtener lista de todos los sitios bloqueados
   * GET /blocked-websites
   * @returns {Promise<Array>} Lista de sitios bloqueados [{id, name, url, createdAt}]
   */
  getAll: async () => {
    try {
      apiLog('log', 'Obteniendo lista de sitios bloqueados...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.BLOCKED_WEBSITES.LIST);
      apiLog('log', `${response.data?.length || 0} sitios bloqueados encontrados`);
      return response.data || [];
    } catch (error) {
      apiLog('error', 'Error al obtener sitios bloqueados', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener sitios bloqueados');
    }
  },

  /**
   * Obtener cantidad de sitios bloqueados
   * GET /blocked-websites/count
   * @returns {Promise<Object>} Objeto con contadores por categoría
   */
  getCount: async () => {
    try {
      apiLog('log', 'Obteniendo conteo de sitios bloqueados...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.BLOCKED_WEBSITES.COUNT);
      apiLog('log', 'Conteo obtenido:', response.data);
      return response.data || {};
    } catch (error) {
      apiLog('error', 'Error al obtener conteo', error.message);
      throw new Error(error.response?.data?.message || 'Error al obtener conteo de sitios');
    }
  },

  /**
   * Agregar un sitio a la lista de bloqueados
   * POST /blocked-websites
   * Esto envía el comando de bloqueo a TODOS los computadores via RabbitMQ
   * @param {Object} siteData - Datos del sitio { name?, url, ... }
   * @returns {Promise<Object>} Sitio creado {id, name, url, createdAt}
   */
  add: async (siteData) => {
    try {
      // Normalizar datos
      const payload = {
        name: siteData.name || siteData.url,
        url: siteData.url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, ''),
        ...siteData
      };
      
      apiLog('log', `Bloqueando sitio: ${payload.url}...`);
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.BLOCKED_WEBSITES.ADD, payload);
      apiLog('log', 'Sitio bloqueado exitosamente', response.data);
      return response.data;
    } catch (error) {
      apiLog('error', 'Error al bloquear sitio', error.message);
      
      if (error.response?.status === 409) {
        throw new Error('Este sitio ya está bloqueado');
      }
      
      throw new Error(error.response?.data?.message || 'Error al bloquear sitio');
    }
  },

  /**
   * Eliminar un sitio de la lista de bloqueados
   * DELETE /blocked-websites/{id}
   * Esto envía el comando de desbloqueo a TODOS los computadores via RabbitMQ
   * @param {number} id - ID del sitio a desbloquear
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    try {
      apiLog('log', `Desbloqueando sitio ID: ${id}...`);
      const endpoint = API_CONFIG.ENDPOINTS.BLOCKED_WEBSITES.DELETE.replace(':id', id);
      await axiosInstance.delete(endpoint);
      apiLog('log', `Sitio ${id} desbloqueado exitosamente`);
    } catch (error) {
      apiLog('error', `Error al desbloquear sitio ${id}`, error.message);
      
      if (error.response?.status === 404) {
        throw new Error('Sitio no encontrado');
      }
      
      throw new Error(error.response?.data?.message || 'Error al desbloquear sitio');
    }
  },

  /**
   * Bloquear múltiples sitios a la vez
   * @param {Array<string>} urls - Lista de URLs a bloquear
   * @returns {Promise<{success: number, failed: number, results: Array}>}
   */
  addMultiple: async (urls) => {
    const results = await Promise.allSettled(
      urls.map(url => blockedWebsitesService.add({ url }))
    );
    
    const success = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - success;
    
    return { success, failed, results };
  },
};

export default blockedWebsitesService;
