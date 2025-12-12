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
        // El usuario es todo response.data (incluyendo role, email, etc.) minus el token y type
        userData = { ...response.data };
        delete userData.token;
        delete userData.type; // Remover el tipo de token (Bearer)
        console.log('✅ Estructura detectada: usuario + token en mismo objeto');
        console.log('   userData con role:', userData);
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
      console.log('👤 userData.role:', userData?.role);
      console.log('👤 userData.email:', userData?.email);
      
      // Asegurar que userData tenga el role (buscar en diferentes campos)
      if (userData && !userData.role) {
        userData.role = userData.rol || userData.type || 'OPERATOR';
        console.log('⚠️ Role no encontrado, asignando valor por defecto:', userData.role);
      }
      
      if (token) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('loginTime', new Date().toISOString());
        
        console.log('=== DATOS GUARDADOS EN LOCALSTORAGE ===');
        console.log('authToken guardado: ✅');
        console.log('user guardado:', localStorage.getItem('user'));
        console.log('---');
        
        // Obtener el rol desde /auth/users ya que /auth/login no lo devuelve
        try {
          console.log('🔍 Obteniendo rol desde /auth/users...');
          const usersResponse = await authAPI.get('/auth/users');
          console.log('📋 Respuesta completa de /auth/users:', usersResponse.data);
          
          const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
          console.log('📊 Usuarios como array:', users);
          console.log('🔎 Buscando email:', userData.email);
          console.log('📧 Emails disponibles:', users.map(u => u.email));
          
          const foundUser = users.find(u => u.email === userData.email);
          console.log('👤 Usuario encontrado:', foundUser);
          
          if (foundUser && foundUser.role) {
            console.log('✅ Rol obtenido desde /auth/users:', foundUser.role);
            userData.role = foundUser.role;
            localStorage.setItem('user', JSON.stringify(userData));
            console.log('✅ Usuario guardado con rol:', foundUser.role);
          } else {
            console.warn('⚠️ Usuario encontrado pero sin role:', foundUser);
            userData.role = 'OPERATOR';
            localStorage.setItem('user', JSON.stringify(userData));
          }
        } catch (error) {
          console.error('⚠️ Error al obtener rol desde /auth/users:', error.message);
          userData.role = 'OPERATOR'; // Valor por defecto
          localStorage.setItem('user', JSON.stringify(userData));
        }
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
        role: userData.role || 'OPERATOR',
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
      
      // Asegurar que el role siempre existe
      if (!parsed.role) {
        parsed.role = parsed.rol || 'OPERATOR';
        console.log('⚠️ Role asignado por defecto:', parsed.role);
      }
      
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

  // Obtener el rol del usuario desde la API si es necesario
  getUserRole: async () => {
    try {
      // Primero intentar obtener desde localStorage
      const currentUser = AuthService.getCurrentUser();
      console.log('🔐 currentUser desde localStorage:', currentUser);
      
      if (currentUser?.role && currentUser.role !== 'Bearer') {
        console.log('✅ Usando rol de localStorage:', currentUser.role);
        return currentUser.role;
      }

      // Si no está o es 'Bearer', obtener de la API
      console.log('🔍 Obteniendo rol real desde la API...');
      const response = await authAPI.get('/auth/users');
      const users = Array.isArray(response.data) ? response.data : [];
      console.log('📋 Usuarios obtenidos de la API:', users);
      
      // Buscar el usuario actual por email
      const userEmail = currentUser?.email;
      console.log('🔎 Buscando usuario con email:', userEmail);
      
      const foundUser = users.find(u => u.email === userEmail);
      
      if (foundUser) {
        console.log('✅ Usuario encontrado en la API:', foundUser);
        const actualRole = foundUser.role || 'OPERATOR';
        
        // Guardar el rol correcto en localStorage
        if (currentUser) {
          currentUser.role = actualRole;
          localStorage.setItem('user', JSON.stringify(currentUser));
          console.log('✅ Rol actualizado en localStorage:', actualRole);
        }
        
        return actualRole;
      }
      
      console.log('⚠️ Usuario NO encontrado en la API');
      console.log('   Email buscado:', userEmail);
      console.log('   Emails en API:', users.map(u => u.email));
      return 'OPERATOR'; // Valor por defecto
    } catch (error) {
      console.error('❌ Error al obtener rol:', error);
      return 'OPERATOR'; // Valor por defecto en caso de error
    }
  },
};

export default AuthService;

