import axios from 'axios';

// URL del backend Java
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';

const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token a requests
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token inválido o expirado - limpiar sesión
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // Redirigir a home
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

const AuthService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await authAPI.post('/auth/login', {
        email,
        password,
      });
      
      console.log('=== RESPUESTA DEL BACKEND CRUDA ===');
      console.log('response.data:', response.data);
      
      // Intentar obtener el usuario - Manejo flexible de respuestas
      let userData = null;
      let token = null;
      
      // Opción 1: response.data tiene estructura {token, user}
      if (response.data.token && response.data.user) {
        token = response.data.token;
        userData = response.data.user;
        console.log('✅ Estructura detectada: {token, user}');
      }
      // Opción 2: response.data es directamente el usuario con token
      else if (response.data.token && !response.data.user && Object.keys(response.data).length > 1) {
        token = response.data.token;
        // El usuario es todo response.data minus el token
        userData = { ...response.data };
        delete userData.token;
        console.log('✅ Estructura detectada: usuario + token en mismo objeto');
      }
      // Opción 3: response.data.token existe directamente (sin estructura user)
      else if (response.data.token) {
        token = response.data.token;
        userData = response.data;
        console.log('✅ Estructura detectada: token en response.data');
      }
      // Fallback
      else {
        token = response.data.token;
        userData = response.data;
      }
      
      console.log('Token extraído:', token ? '✅ Presente' : '❌ No presente');
      console.log('User data extraído:', userData);
      console.log('Campos del usuario:', Object.keys(userData || {}));
      
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTime', new Date().toISOString());
        
        console.log('=== DATOS GUARDADOS EN LOCALSTORAGE ===');
        console.log('authToken guardado: ✅');
        console.log('user guardado:', localStorage.getItem('user'));
        console.log('---');
      } else {
        console.error('❌ ERROR: No hay token en la respuesta');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error en login:', error.response?.data || error.message);
      throw error.response?.data || { message: error.message };
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await authAPI.post('/auth/register', {
        email: userData.email,
        password: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await authAPI.get('/auth/health');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  // Logout - Limpiar sesión
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginTime');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const user = localStorage.getItem('user');
      // Validar que existe y que es un string válido
      if (!user || typeof user !== 'string') {
        console.warn('⚠️ No hay user en localStorage o no es string');
        return null;
      }
      
      const parsed = JSON.parse(user);
      console.log('✅ User parseado correctamente:', parsed);
      return parsed;
    } catch (error) {
      // Si hay error al parsear, limpiar y retornar null
      console.error('❌ Error al obtener usuario:', error);
      console.log('user en localStorage era:', localStorage.getItem('user'));
      localStorage.removeItem('user');
      return null;
    }
  },

  // Check if authenticated - Valida que exista token
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    return !!token && token.length > 0;
  },

  // Get token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Validate token (useful para verificar si el token es válido con el backend)
  validateToken: async () => {
    try {
      // Hacer un health check para validar que el token sea válido
      await authAPI.get('/auth/health');
      return true;
    } catch (error) {
      // Si falla, el token no es válido
      return false;
    }
  },

  // Get login time
  getLoginTime: () => {
    return localStorage.getItem('loginTime');
  },
};

export default AuthService;

