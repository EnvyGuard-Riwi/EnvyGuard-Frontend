import { useEffect, useState, useCallback } from 'react';
import WebSocketService from '../services/WebSocketService';

const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [logs, setLogs] = useState([]);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const handleConnected = () => setConnected(true);
    const handleDisconnected = () => setConnected(false);
    const handleMessage = (data) => {
      setLastMessage(data);
      setLogs((prevLogs) => [...prevLogs, JSON.stringify(data)]);
    };
    const handleError = (error) => {
      setLogs((prevLogs) => [...prevLogs, `❌ Error: ${error.message}`]);
    };

    WebSocketService.on('connected', handleConnected);
    WebSocketService.on('disconnected', handleDisconnected);
    WebSocketService.on('message', handleMessage);
    WebSocketService.on('error', handleError);

    // Conectar al montar el hook
    WebSocketService.connect().catch((error) => {
      console.error('No se pudo conectar al WebSocket:', error);
    });

    // Limpiar al desmontar
    return () => {
      WebSocketService.off('connected', handleConnected);
      WebSocketService.off('disconnected', handleDisconnected);
      WebSocketService.off('message', handleMessage);
      WebSocketService.off('error', handleError);
      WebSocketService.disconnect();
    };
  }, []);

  const send = useCallback((data) => {
    WebSocketService.send(data);
  }, []);

  return {
    connected,
    logs,
    lastMessage,
    send,
  };
};

export default useWebSocket;
