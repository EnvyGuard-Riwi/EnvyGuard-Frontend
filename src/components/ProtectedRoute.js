import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

/**
 * ProtectedRoute Component
 * Verifica si el usuario está autenticado antes de permitir acceso a una ruta
 * Si no está autenticado, redirige a la página de login
 * 
 * Props:
 * - children: Componente a renderizar si está autenticado
 * - requiresAdmin: ¿Requiere que sea Admin? (default: false)
 */
const ProtectedRoute = ({ children, requiresAdmin = false }) => {
  // Verificar si hay un token válido en localStorage
  const isAuthenticated = AuthService.isAuthenticated();
  
  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si requiere Admin, validar el rol del usuario
  if (requiresAdmin) {
    const user = AuthService.getCurrentUser();
    
    // Validación segura del usuario y su rol
    if (!user || user.role !== 'Admin') {
      console.warn(
        `Acceso denegado: Se requiere rol de Admin. Usuario actual: ${user?.role || 'sin rol'}`
      );
      return <Navigate to="/dashboard" replace />;
    }
  }

  // Si está autenticado y cumple requisitos, renderizar el componente
  return children;
};

export default ProtectedRoute;
