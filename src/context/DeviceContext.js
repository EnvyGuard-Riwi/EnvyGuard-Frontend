import React, { createContext, useState } from 'react';

const DeviceContext = createContext();

/**
 * DeviceProvider - Proporciona contexto global de dispositivos
 * Envuelve la aplicación para acceder al estado global desde cualquier componente
 * @param {object} props
 * @param {JSX.Element} props.children - Componentes hijos
 */
export const DeviceProvider = ({ children }) => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDevice = (device) => {
    setDevices((prev) => [...prev, device]);
  };

  const updateDevice = (deviceId, updatedData) => {
    setDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, ...updatedData } : device
      )
    );
  };

  const removeDevice = (deviceId) => {
    setDevices((prev) => prev.filter((device) => device.id !== deviceId));
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        setDevices,
        loading,
        setLoading,
        error,
        setError,
        addDevice,
        updateDevice,
        removeDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DeviceContext;
