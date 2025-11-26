import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

class DeviceService {
  // Obtener lista de dispositivos
  async getDevices() {
    try {
      const response = await axios.get(`${API_URL}/api/devices`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener dispositivos:', error);
      throw error;
    }
  }

  // Enviar comando a un dispositivo
  async sendCommand(deviceId, command, params = {}) {
    try {
      const response = await axios.post(`${API_URL}/api/devices/${deviceId}/command`, {
        command,
        ...params,
      });
      return response.data;
    } catch (error) {
      console.error(`Error al enviar comando "${command}" al dispositivo ${deviceId}:`, error);
      throw error;
    }
  }

  // Obtener estado de un dispositivo
  async getDeviceStatus(deviceId) {
    try {
      const response = await axios.get(`${API_URL}/api/devices/${deviceId}/status`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener estado del dispositivo ${deviceId}:`, error);
      throw error;
    }
  }
}

export default new DeviceService();
