    import React from 'react';
import { Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import logoIcon from '../assets/icons/icon.png';

const Header = ({ onLogout }) => {
  const navigate = useNavigate();

  return (
    
    <>
      {/* Logo - Esquina Superior Izquierda */}
      <Box
        sx={{
          position: 'fixed',
          top: -20,
          left: -200,
          zIndex: 9999,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            opacity: 0.8,
          },
        }}
        onClick={() => navigate('/')}
      >
        <Box
          component="img"
          src={logoIcon}
          sx={{
            width: '120px',
            height: '120px',
            objectFit: 'contain',
          }}
          alt="Logo"
        />
      </Box>

      {/* Botón Iniciar - Esquina Superior Derecha */}
      <Box
        sx={{
          position: 'fixed',
          top: { xs: 15, md: 25 },
          right: { xs: 15, md: 30 },
          zIndex: 9999,
        }}
      >
        {/* Efecto de brillo de fondo */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120%',
            height: '120%',
            background: 'radial-gradient(circle, rgba(41, 255, 219, 0.1) 0%, transparent 70%)',
            borderRadius: '25px',
            animation: 'glowPulse 3s ease-in-out infinite',
            pointerEvents: 'none',
          }}
        />

        <Button
          onClick={() => navigate('/login')}
          sx={{
            position: 'relative',
            backgroundColor: 'rgba(41, 255, 219, 0.05)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            border: '1.5px solid rgba(41, 255, 219, 0.4)',
            borderRadius: '25px',
            px: { xs: 2, md: 3 },
            py: { xs: 0.8, md: 1 },
            textTransform: 'none',
            fontSize: { xs: '0.9rem', md: '1rem' },
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0.75,
            boxShadow: '0 0 20px rgba(41, 255, 219, 0.15)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: 'rgba(41, 255, 219, 0.15)',
              borderColor: 'rgba(41, 255, 219, 0.8)',
              boxShadow: '0 0 30px rgba(41, 255, 219, 0.4), inset 0 0 20px rgba(41, 255, 219, 0.1)',
              transform: 'translateY(-2px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          Iniciar
          <ArrowRightIcon
            sx={{
              fontSize: { xs: '1rem', md: '1.1rem' },
              animation: 'slideRight 2s infinite',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.3s ease',
            }}
          />
        </Button>
      </Box>
    </>
  );
};

export default Header;
