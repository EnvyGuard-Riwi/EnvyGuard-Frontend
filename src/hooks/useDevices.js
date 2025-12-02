import { useContext } from 'react';
import DeviceContext from '../context/DeviceContext';

/**
 * Hook para acceder al contexto global de dispositivos
 * DEBE ser usado dentro de un DeviceProvider
 * @returns {object} { devices, setDevices, loading, setLoading, error, setError, addDevice, updateDevice, removeDevice }
 * @throws {Error} Si no está dentro de DeviceProvider
 */
export const useDevices = () => {
  const context = useContext(DeviceContext);
  
  if (!context) {
    throw new Error('useDevices debe ser usado dentro de un DeviceProvider');
  }
  
  return context;
};
