import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import Header from '../components/Header';
import LiquidEther from '../components/LiquidEther';

const Home = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000000',
      }}
    >
      <Header />
      {/* Fondo LiquidEther */}
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
        <LiquidEther
          colors={[ '#29ffDB', '#9effd2', '#a3f0b2' ]}
          mouseForce={35}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={40}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </Box>

      {/* Contenido centrado minimalista */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        {/* Título principal */}
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontSize: { xs: '2.5rem', md: '4rem' },
            fontWeight: 800,
            lineHeight: 1.2,
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
            Bienvenido a EnvyGuard
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;