import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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
  const { isAuthenticated, user, loading, hasRole } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-400"></div>
      </div>
    );
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // Si requiere Admin, validar el rol del usuario
  if (requiresAdmin && !hasRole('Admin')) {
    console.warn(
      `Acceso denegado: Se requiere rol de Admin. Usuario actual: ${user?.role || 'sin rol'}`
    );
    return <Navigate to="/dashboard" replace />;
  }

  // Si está autenticado y cumple requisitos, renderizar el componente
  return children;
};

export default ProtectedRoute;
