import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const LogConsole = ({ logs }) => {
  return (
    <Paper sx={{ p: 2, bgcolor: '#1e1e1e', color: '#00ff00', maxHeight: 400, overflow: 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#00ff00' }}>
        📋 Consola de Logs
      </Typography>
      <Box
        component="pre"
        sx={{
          fontFamily: 'monospace',
          fontSize: '0.875rem',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </Box>
    </Paper>
  );
};

export default LogConsole;
