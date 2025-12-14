/**
 * Auth Context
 * Contexto global para manejar el estado de autenticación
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AuthService } from '../services';

// Crear el contexto
const AuthContext = createContext(null);

/**
 * Provider de autenticación
 * Envuelve la aplicación para proveer estado de auth global
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Inicializar estado desde localStorage al montar
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = AuthService.getCurrentUser();
        const hasToken = AuthService.isAuthenticated();

        console.log('🔐 Inicializando Auth:', { hasUser: !!currentUser, hasToken });

        if (currentUser && hasToken) {
          // CAMBIO: Confiar en el token local primero, sin validar con el backend
          // Esto evita que errores de red o CORS cierren la sesión
          setUser(currentUser);
          setIsAuthenticated(true);
          console.log('✅ Usuario restaurado desde localStorage:', currentUser.email);
          
          // Validar en background (opcional, no bloquea la UI)
          AuthService.validateToken().then(isValid => {
            if (!isValid) {
              console.warn('⚠️ Token no validado por el backend, pero manteniendo sesión local');
              // NO cerrar sesión automáticamente, dejar que el interceptor de axios maneje 401
            }
          }).catch(() => {
            console.warn('⚠️ Error validando token, manteniendo sesión local');
          });
        } else {
          console.log('❌ No hay sesión guardada');
        }
      } catch (err) {
        console.error('Error inicializando auth:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Iniciar sesión
   * @param {string} email - Email del usuario
   * @param {string} password - Contraseña
   * @returns {Promise<Object>} Datos del usuario
   */
  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await AuthService.login(email, password);
      const currentUser = AuthService.getCurrentUser();
      
      setUser(currentUser);
      setIsAuthenticated(true);
      
      return currentUser;
    } catch (err) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Cerrar sesión
   */
  const logout = useCallback(() => {
    AuthService.logout();
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  }, []);

  /**
   * Actualizar datos del usuario
   * @param {Object} userData - Nuevos datos del usuario
   */
  const updateUser = useCallback((userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }, [user]);

  /**
   * Obtener el rol del usuario
   * @returns {string} Rol del usuario
   */
  const getUserRole = useCallback(() => {
    return user?.role || user?.rol || 'OPERATOR';
  }, [user]);

  /**
   * Verificar si el usuario es admin
   * @returns {boolean}
   */
  const isAdmin = useCallback(() => {
    const role = getUserRole();
    return role === 'ADMIN' || role === 'SUPERADMIN';
  }, [getUserRole]);

  /**
   * Verificar si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean}
   */
  const hasRole = useCallback((role) => {
    const userRole = getUserRole();
    if (role === 'Admin') return userRole === 'ADMIN' || userRole === 'SUPERADMIN';
    if (role === 'ADMIN') return userRole === 'ADMIN' || userRole === 'SUPERADMIN';
    return userRole === role;
  }, [getUserRole]);

  /**
   * Refrescar datos del usuario desde la API
   */
  const refreshUser = useCallback(async () => {
    try {
      const role = await AuthService.getUserRole();
      if (user) {
        updateUser({ role });
      }
    } catch (err) {
      console.error('Error refrescando usuario:', err);
    }
  }, [user, updateUser]);

  // Valor del contexto
  const value = {
    // Estado
    user,
    isAuthenticated,
    loading: isLoading, // Alias para compatibilidad con ProtectedRoute
    isLoading,
    error,
    
    // Acciones
    login,
    logout,
    updateUser,
    refreshUser,
    
    // Helpers
    getUserRole,
    isAdmin,
    hasRole,
    
    // Datos derivados
    token: AuthService.getToken(),
    loginTime: AuthService.getLoginTime(),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para usar el contexto de autenticación
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  
  return context;
};

export default AuthContext;
