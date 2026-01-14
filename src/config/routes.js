import React from 'react';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';

/**
 * Configuración centralizada de rutas
 * 
 * Estructura:
 * - path: Ruta URL
 * - element: Componente a renderizar
 * - protected: ¿Requiere autenticación?
 * - requiresAdmin: ¿Requiere rol de Admin?
 * - label: Etiqueta para menús (opcional)
 * - icon: Icono para menús (opcional)
 */

export const routes = [
  // ===== RUTAS PÚBLICAS =====
  {
    path: '/',
    element: <Home />,
    public: true,
    label: 'Inicio',
    protected: false,
  },

  // ===== RUTAS PROTEGIDAS =====
  {
    path: '/dashboard',
    element: <Dashboard />,
    protected: true,
    requiresAdmin: false,
    label: 'Dashboard',
    description: 'Panel principal del sistema',
  },

  // ===== RUTAS FUTURAS (DESCOMENTAR CUANDO EXISTAN) =====
  
  // {
  //   path: '/usuarios',
  //   element: <Usuarios />,
  //   protected: true,
  //   requiresAdmin: true,
  //   label: 'Gestión de Usuarios',
  //   description: 'Administrar usuarios del sistema',
  // },
  
  // {
  //   path: '/reportes',
  //   element: <Reportes />,
  //   protected: true,
  //   requiresAdmin: false,
  //   label: 'Reportes',
  //   description: 'Ver reportes del sistema',
  // },
  
  // {
  //   path: '/configuracion',
  //   element: <Configuracion />,
  //   protected: true,
  //   requiresAdmin: true,
  //   label: 'Configuración',
  //   description: 'Configuración del sistema',
  // },

  // {
  //   path: '/perfil',
  //   element: <Perfil />,
  //   protected: true,
  //   requiresAdmin: false,
  //   label: 'Mi Perfil',
  //   description: 'Ver y editar mi perfil',
  // },
];

/**
 * Obtener rutas públicas (para menús, etc.)
 */
export const getPublicRoutes = () => {
  return routes.filter((route) => route.public);
};

/**
 * Obtener rutas protegidas
 */
export const getProtectedRoutes = () => {
  return routes.filter((route) => route.protected);
};

/**
 * Obtener rutas solo para admin
 */
export const getAdminRoutes = () => {
  return routes.filter((route) => route.requiresAdmin);
};

/**
 * Obtener ruta por path
 */
export const getRouteByPath = (path) => {
  return routes.find((route) => route.path === path);
};

/**
 * Validar si una ruta es accesible para un usuario
 */
export const canAccessRoute = (path, userRole) => {
  const route = getRouteByPath(path);
  
  if (!route) return false;
  if (!route.protected) return true; // Rutas públicas siempre accesibles
  if (route.requiresAdmin && userRole !== 'ADMIN') return false; // Admin-only
  
  return true; // Ruta protegida y usuario autenticado
};

export default routes;
