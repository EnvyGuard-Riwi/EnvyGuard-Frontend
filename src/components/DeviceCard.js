import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
  Chip,
} from '@mui/material';

const DeviceCard = ({ device, onSendCommand }) => {
  return (
    <Card sx={{ maxWidth: 345, m: 2 }}>
      <CardContent>
        <Typography color="textSecondary" gutterBottom>
          {device.name}
        </Typography>
        <Typography variant="h5" component="div">
          {device.status}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Chip
            label={device.online ? 'Conectado' : 'Desconectado'}
            color={device.online ? 'success' : 'error'}
            variant="outlined"
          />
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => onSendCommand(device.id, 'start')}>
          Iniciar
        </Button>
        <Button size="small" onClick={() => onSendCommand(device.id, 'stop')}>
          Detener
        </Button>
      </CardActions>
    </Card>
  );
};

export default DeviceCard;
