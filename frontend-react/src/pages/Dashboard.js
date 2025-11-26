import React, { useState } from 'react';
import { Container, Grid, Box, Paper, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import DeviceCard from '../components/DeviceCard';
import LogConsole from '../components/LogConsole';
import AlertSnackbar from '../components/AlertSnackbar';
import PixelBlast from '../components/PixelBlast';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';

const Dashboard = () => {
  const navigate = useNavigate();
  const [devices] = useState([]);
  const [logs, setLogs] = useState(['✅ Sistema iniciado', '📡 Esperando conexión...']);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });
  const [openDialog, setOpenDialog] = useState(false);

  const handleSendCommand = (deviceId, command) => {
    setAlert({
      open: true,
      message: `Comando "${command}" enviado al dispositivo ${deviceId}`,
      severity: 'success',
    });
    setLogs((prev) => [...prev, `📤 Comando enviado: ${command} → Dispositivo ${deviceId}`]);
  };

  const handleAddDevice = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

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
      }}
    >
      {/* Fondo PixelBlast */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
        <PixelBlast
          variant="circle"
          pixelSize={6}
          color="#B19EEF"
          patternScale={3}
          patternDensity={1.2}
          pixelSizeJitter={0.5}
          enableRipples
          rippleSpeed={0.4}
          rippleThickness={0.12}
          rippleIntensityScale={1.5}
          liquid
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={0.6}
          edgeFade={0.25}
          transparent
          style={{ width: '100%', height: '100%' }}
        />
      </Box>

      {/* Contenido superpuesto */}
      <Box sx={{ position: 'relative', zIndex: 1 }}>
        <Header onLogout={handleLogout} />
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              📊 Dashboard
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddDevice}
                sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 'bold',
                }}
              >
                Añadir Dispositivo
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper sx={{ 
                p: 3, 
                backdropFilter: 'blur(10px)',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
                  📱 Dispositivos
                </Typography>
                {devices.length > 0 ? (
                  <Grid container spacing={2}>
                    {devices.map((device) => (
                      <Grid item xs={12} sm={6} md={4} key={device.id}>
                        <DeviceCard device={device} onSendCommand={handleSendCommand} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box sx={{ textAlign: 'center', py: 4, color: 'textSecondary' }}>
                    <Typography variant="body1">
                      No hay dispositivos registrados. ¡Añade uno para comenzar!
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleAddDevice}
                      sx={{ 
                        mt: 2,
                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      }}
                    >
                      Añadir Dispositivo
                    </Button>
                  </Box>
                )}
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <LogConsole logs={logs} />
            </Grid>
          </Grid>

          {/* Dialog para añadir dispositivo */}
          <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ color: '#667eea', fontWeight: 'bold' }}>Añadir Nuevo Dispositivo</DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <Typography color="textSecondary">
                Formulario para añadir un nuevo dispositivo. Esta funcionalidad se implementará próximamente.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancelar</Button>
              <Button variant="contained" sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
                Crear
              </Button>
            </DialogActions>
          </Dialog>

          <AlertSnackbar
            open={alert.open}
            message={alert.message}
            severity={alert.severity}
            onClose={() => setAlert({ ...alert, open: false })}
          />
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
