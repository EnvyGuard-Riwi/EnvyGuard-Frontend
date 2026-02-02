/**
 * Auth Service
 * Maneja todas las operaciones relacionadas con autenticación
 * Incluye: login, logout, register, validación de token
 */

import axiosInstance from './api/axiosInstance';
import { API_CONFIG, apiLog } from '../config/apiConfig';

const AuthService = {
  /**
   * Login de usuario
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña del usuario
   * @returns {Promise<Object>} Datos del usuario y token
   */
  login: async (email, password) => {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        email,
        password,
      });

      apiLog('log', 'Respuesta de login recibida', response.data);

      // Intentar obtener el usuario - Manejo flexible de respuestas
      let userData = null;
      let token = null;

      // Opción 1: response.data tiene estructura {token, user}
      if (response.data.token && response.data.user) {
        token = response.data.token;
        userData = response.data.user;
        apiLog('log', 'Estructura detectada: {token, user}');
      }
      // Opción 2: response.data es directamente el usuario con token
      else if (response.data.token && !response.data.user && Object.keys(response.data).length > 1) {
        token = response.data.token;
        userData = { ...response.data };
        delete userData.token;
        delete userData.type;
        apiLog('log', 'Estructura detectada: usuario + token en mismo objeto');
      }
      // Opción 3: response.data.token existe directamente (sin estructura user)
      else if (response.data.token) {
        token = response.data.token;
        userData = response.data;
        apiLog('log', 'Estructura detectada: token en response.data');
      }
      // Fallback
      else {
        token = response.data.token;
        userData = response.data;
      }

      // Asegurar que userData tenga el role
      if (userData && !userData.role) {
        userData.role = userData.rol || userData.type || 'OPERATOR';
        apiLog('warn', 'Role no encontrado, asignando valor por defecto', userData.role);
      }

      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTime', new Date().toISOString());

        apiLog('log', 'Datos guardados en localStorage');

        // Obtener el rol desde /auth/users ya que /auth/login no lo devuelve
        try {
          apiLog('log', 'Obteniendo rol desde /auth/users...');
          const usersResponse = await axiosInstance.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL);

          const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
          const foundUser = users.find(u => u.email === userData.email);

          if (foundUser && foundUser.role) {
            apiLog('log', 'Rol obtenido desde /auth/users', foundUser.role);
            userData.role = foundUser.role;
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            apiLog('warn', 'Usuario encontrado pero sin role, usando OPERATOR');
            userData.role = 'OPERATOR';
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          apiLog('error', 'Error al obtener rol desde /auth/users', error.message);
          userData.role = 'OPERATOR';
          localStorage.setItem('user', JSON.stringify(userData));
        }
      } else {
        apiLog('error', 'No hay token en la respuesta');
      }

      return response.data;
    } catch (error) {
      apiLog('error', 'Error en login', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Registro de nuevo usuario
   * @param {Object} userData - Datos del usuario a registrar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'OPERATOR',
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Health check del servidor de autenticación
   * @returns {Promise<Object>} Estado del servidor
   */
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.HEALTH);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  /**
   * Logout - Limpia la sesión del usuario
   */
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
    apiLog('log', 'Sesión cerrada correctamente');
  },

  /**
   * Obtener usuario actual desde localStorage
   * @returns {Object|null} Datos del usuario o null
   */
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      if (!user || typeof user !== 'string') {
        return null;
      }

      const parsed = JSON.parse(user);

      // Asegurar que el role siempre existe
      if (!parsed.role) {
        parsed.role = parsed.rol || 'OPERATOR';
      }

      return parsed;
    } catch (error) {
      apiLog('error', 'Error al obtener usuario', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  /**
   * Verificar si el usuario está autenticado
   * @returns {boolean} true si está autenticado
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token && token.length > 0;
  },

  /**
   * Obtener token de autenticación
   * @returns {string|null} Token o null
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  /**
   * Validar token con el backend
   * @returns {Promise<boolean>} true si el token es válido
   */
  validateToken: async () => {
    try {
      await axiosInstance.get(API_CONFIG.ENDPOINTS.AUTH.HEALTH);
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Obtener tiempo de login
   * @returns {string|null} Timestamp del login
   */
  getLoginTime: () => {
    return localStorage.getItem('loginTime');
  },

  /**
   * Obtener el rol del usuario desde la API si es necesario
   * @returns {Promise<string>} Rol del usuario
   */
  getUserRole: async () => {
    try {
      const currentUser = AuthService.getCurrentUser();

      if (currentUser?.role && currentUser.role !== 'Bearer') {
        return currentUser.role;
      }

      apiLog('log', 'Obteniendo rol real desde la API...');
      const response = await axiosInstance.get(API_CONFIG.ENDPOINTS.USERS.GET_ALL);
      const users = Array.isArray(response.data) ? response.data : [];

      const userEmail = currentUser?.email;
      const foundUser = users.find(u => u.email === userEmail);

      if (foundUser) {
        const actualRole = foundUser.role || 'OPERATOR';

        if (currentUser) {
          currentUser.role = actualRole;
          localStorage.setItem('user', JSON.stringify(currentUser));
          apiLog('log', 'Rol actualizado en localStorage', actualRole);
        }

        return actualRole;
      }

      apiLog('warn', 'Usuario NO encontrado en la API');
      return 'OPERATOR';
    } catch (error) {
      apiLog('error', 'Error al obtener rol', error);
      return 'OPERATOR';
    }
  },
};

export default AuthService;
