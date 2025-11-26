import React, { useState } from 'react';
import {
  Container,
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LoginIcon from '@mui/icons-material/Login';
import PixelBlast from '../components/PixelBlast';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // TODO: Llamar a API de autenticación
      console.log('Intentando login con:', formData);
      
      // Simulación de autenticación
      if (formData.email && formData.password) {
        // Guardar token en localStorage (cuando se integre con backend)
        localStorage.setItem('authToken', 'token-ejemplo');
        navigate('/dashboard');
      } else {
        setError('Por favor completa todos los campos');
      }
    } catch (err) {
      setError('Error al iniciar sesión. Intenta de nuevo.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        py: 4,
      }}
    >
      {/* Fondo PixelBlast */}
      <Box
        sx={{
          position: 'absolute',
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
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <LoginIcon sx={{ fontSize: 50, color: '#B19EEF', mb: 2 }} />
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
              EnvyGuard
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Inicia sesión en tu cuenta
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
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
              label="Contraseña"
              name="password"
              type="password"
              variant="outlined"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
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

            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{ 
                mt: 3, 
                mb: 2,
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                fontWeight: 'bold',
              }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="textSecondary">
              ¿No tienes cuenta?{' '}
              <Button
                color="primary"
                onClick={() => navigate('/')}
                sx={{ textTransform: 'none' }}
              >
                Volver al inicio
              </Button>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
