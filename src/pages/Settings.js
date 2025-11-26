import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Divider,
  Switch,
  FormControlLabel,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PixelBlast from '../components/PixelBlast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';

const Settings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:8080',
    wsUrl: process.env.REACT_APP_WS_URL || 'ws://localhost:8080',
    autoRefresh: true,
    refreshInterval: 5000,
    notifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // TODO: Guardar configuraciones en backend
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate('/dashboard')}
              sx={{ mr: 2, color: 'white', fontWeight: 'bold' }}
            >
              Volver
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              ⚙️ Configuración
            </Typography>
          </Box>

          {saved && (
            <Alert severity="success" sx={{ mb: 3 }}>
              ✅ Configuración guardada correctamente
            </Alert>
          )}

          <Paper sx={{ 
            p: 3, 
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#667eea' }}>
              Conexión
            </Typography>
            <TextField
              fullWidth
              label="URL de la API"
              name="apiUrl"
              value={settings.apiUrl}
              onChange={handleChange}
              margin="normal"
              helperText="URL del servidor backend"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#B19EEF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#B19EEF',
                  },
                },
              }}
            />
            <TextField
              fullWidth
              label="URL WebSocket"
              name="wsUrl"
              value={settings.wsUrl}
              onChange={handleChange}
              margin="normal"
              helperText="URL WebSocket para comunicación en tiempo real"
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#B19EEF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#B19EEF',
                  },
                },
              }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#667eea' }}>
              Preferencias
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  name="autoRefresh"
                  checked={settings.autoRefresh}
                  onChange={handleChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#B19EEF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#B19EEF',
                    },
                  }}
                />
              }
              label="Actualización Automática"
            />
            <TextField
              fullWidth
              label="Intervalo de Actualización (ms)"
              name="refreshInterval"
              type="number"
              value={settings.refreshInterval}
              onChange={handleChange}
              margin="normal"
              disabled={!settings.autoRefresh}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: '#B19EEF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#B19EEF',
                  },
                },
              }}
            />
            <FormControlLabel
              control={
                <Switch
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#B19EEF',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#B19EEF',
                    },
                  }}
                />
              }
              label="Notificaciones Habilitadas"
              sx={{ mt: 2 }}
            />

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  fontWeight: 'bold',
                }}
              >
                Guardar
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
                sx={{
                  color: '#667eea',
                  borderColor: '#667eea',
                  '&:hover': {
                    borderColor: '#764ba2',
                  },
                }}
              >
                Cancelar
              </Button>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default Settings;
