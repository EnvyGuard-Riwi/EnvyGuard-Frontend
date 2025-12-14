import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import './styles/global.css';
import { routes } from './config/routes';
import ProtectedRoute from './components/ProtectedRoute';
import { DeviceProvider } from './context/DeviceContext';
import { AuthProvider } from './context/AuthContext';
import SpyWall from './pages/SpyWall';
import InstallPrompt from './components/InstallPrompt';

/**
 * Componente principal de la aplicación
 * 
 * Estructura:
 * - Proveedor de tema (Material-UI)
 * - Proveedor de autenticación (contexto)
 * - Proveedor de dispositivos (contexto)
 * - Router con rutas centralizadas
 */
function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DeviceProvider>
          <BrowserRouter>
            <Routes>
            {/* Renderizar todas las rutas desde config/routes.js */}
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  route.protected ? (
                    <ProtectedRoute requiresAdmin={route.requiresAdmin}>
                      {route.element}
                    </ProtectedRoute>
                  ) : (
                    route.element
                  )
                }
              />
            ))}

            {/* 2. AGREGAR LA RUTA DEL ESPÍA AQUÍ */}
            {/* La envolvemos en ProtectedRoute para que alumnos no entren */}
            <Route 
              path="/spy" 
              element={
                <ProtectedRoute requiresAdmin={true}> 
                  <SpyWall /> 
                </ProtectedRoute>
              } 
            />

            {/* Ruta 404 - Redirige a home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
            <InstallPrompt />
          </BrowserRouter>
        </DeviceProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;