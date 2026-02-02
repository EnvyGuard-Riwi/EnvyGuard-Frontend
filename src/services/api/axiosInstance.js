/**
 * Axios Instance
 * Instancia centralizada de axios para toda la aplicación
 * Incluye: interceptors para autenticación y manejo de errores
 */

import axios from 'axios';
import { API_CONFIG, apiLog } from '../../config/apiConfig';

// Crear instancia única de axios
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.AXIOS_CONFIG.timeout,
  headers: API_CONFIG.AXIOS_CONFIG.headers,
});

// Interceptor para agregar token automáticamente a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log en desarrollo
    apiLog('log', `Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token,
    });

    return config;
  },
  (error) => {
    apiLog('error', 'Request error', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores globales
axiosInstance.interceptors.response.use(
  (response) => {
    apiLog('log', `Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const status = error.response?.status;

    apiLog('error', `Response error: ${status} ${error.config?.url}`, {
      message: error.message,
      data: error.response?.data,
    });

    // Manejar errores de autenticación
    if (status === API_CONFIG.ERRORS.UNAUTHORIZED) {
      // Verificar si el error viene de un intento de login
      const isLoginAttempt = error.config?.url?.includes('/auth/login') ||
        error.config?.url?.includes('/login') ||
        error.config?.url?.includes('/auth/users');

      if (!isLoginAttempt) {
        // Solo limpiar sesión y redireccionar si NO es un intento de login
        apiLog('warn', 'Token inválido o expirado - Limpiando sesión');
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');

        // Solo redirigir si no estamos ya en la página de login
        if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
          window.location.href = '/';
        }
      } else {
        // Es un intento de login fallido, no redireccionar
        apiLog('warn', 'Login fallido - Credenciales incorrectas');
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
