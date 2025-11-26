import React, { useState, useEffect } from 'react';
import { Container, Grid, CircularProgress, Box } from '@mui/material';
import DeviceCard from '../components/DeviceCard';
import LogConsole from '../components/LogConsole';
import AlertSnackbar from '../components/AlertSnackbar';

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    // TODO: Cargar dispositivos desde DeviceService
    setLoading(false);
  }, []);

  const handleSendCommand = (deviceId, command) => {
    // TODO: Enviar comando vía DeviceService
    setAlert({
      open: true,
      message: `Comando "${command}" enviado al dispositivo ${deviceId}`,
      severity: 'success',
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Grid container>
            {devices.length > 0 ? (
              devices.map((device) => (
                <Grid item xs={12} sm={6} md={4} key={device.id}>
                  <DeviceCard device={device} onSendCommand={handleSendCommand} />
                </Grid>
              ))
            ) : (
              <p>No hay dispositivos disponibles</p>
            )}
          </Grid>
        </Grid>
        <Grid item xs={12} md={4}>
          <LogConsole logs={logs} />
        </Grid>
      </Grid>
      <AlertSnackbar
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Container>
  );
};

export default DeviceList;
