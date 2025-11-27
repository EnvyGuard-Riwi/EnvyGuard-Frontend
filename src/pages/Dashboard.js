import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#050505',
      }}
    >
      {/* Contenido */}

      {/* Contenido superpuesto */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header onLogout={handleLogout} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            📊 Panel de Control
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', mt: 2 }}>
            Bienvenido a EnvyGuard. La gestión de dispositivos está en desarrollo.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
