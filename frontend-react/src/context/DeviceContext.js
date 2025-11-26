import React, { createContext, useContext, useState } from 'react';

const DeviceContext = createContext();

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

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context) {
    throw new Error('useDevices debe ser usado dentro de un DeviceProvider');
  }
  return context;
};

export default DeviceContext;
