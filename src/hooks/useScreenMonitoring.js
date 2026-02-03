import { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { controlService } from '../services';

export const useScreenMonitoring = () => {
    const [screens, setScreens] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    const [isMonitoringActive, setIsMonitoringActive] = useState(() => localStorage.getItem('monitoring_active') === 'true');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const clientRef = useRef(null);
    const historyRef = useRef({});
    const MAX_HISTORY_SIZE = 100;
    const BACKEND_URL = process.env.REACT_APP_WS_URL || 'https://api.andrescortes.dev';

    // Función para descargar evidencia
    const downloadEvidence = useCallback((pcId) => {
        const history = historyRef.current[pcId];
        if (!history || history.length === 0) {
            alert("Aún no hay historial suficiente para descargar.");
            return;
        }
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EVIDENCIA_${pcId}_${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }, []);

    // Control de monitoreo (Start/Stop)
    const sendControl = useCallback(async (action) => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('🎮 Enviando control de monitoreo:', action);

            if (action === 'START') {
                setIsMonitoringActive(true);
                localStorage.setItem('monitoring_active', 'true');
                await controlService.startExamMonitoring();
            } else if (action === 'STOP') {
                setIsMonitoringActive(false);
                localStorage.removeItem('monitoring_active');
                await controlService.stopExamMonitoring();
            }

            console.log(`✅ Comando ${action} enviado correctamente.`);
            return { success: true, message: `Monitoreo ${action === 'START' ? 'INICIADO' : 'DETENIDO'}` };
        } catch (e) {
            console.error('❌ Error:', e);
            const msg = e.message || 'Error al enviar comando';
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Conexión WebSocket
    useEffect(() => {
        if (clientRef.current) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(`${BACKEND_URL}/ws-spy`),
            debug: () => { }, // Desactivar log ruidoso en consola
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        client.onConnect = () => {
            console.log("✅ Conectado al sistema de vigilancia remoto");
            setIsConnected(true);

            client.subscribe('/topic/screens', (msg) => {
                try {
                    const data = JSON.parse(msg.body);
                    const pcId = data.PcId || data.pcId;
                    const img = data.ImageBase64 || data.image;
                    const ip = data.IpAddress || data.ip; // Intentar capturar IP

                    if (pcId && img) {
                        const screenData = {
                            image: img,
                            timestamp: data.Timestamp || new Date().toISOString(),
                            lastUpdate: new Date(),
                            originalId: pcId,
                            ip: ip
                        };

                        setScreens(prev => {
                            const next = { ...prev, [pcId]: screenData };
                            if (ip) next[ip] = screenData; // Indexación dual por IP para fallback
                            return next;
                        });

                        if (!historyRef.current[pcId]) historyRef.current[pcId] = [];
                        historyRef.current[pcId].push({ timestamp: data.Timestamp, image: img });
                        if (historyRef.current[pcId].length > MAX_HISTORY_SIZE) historyRef.current[pcId].shift();
                    }
                } catch (e) {
                    console.error("Error procesando datos de pantalla:", e);
                }
            });
        };

        client.onStompError = (frame) => {
            console.error("Error STOMP:", frame.headers['message']);
            setIsConnected(false);
        };

        client.onWebSocketClose = () => {
            console.log("🔌 WebSocket desconectado");
            setIsConnected(false);
        };

        client.activate();
        clientRef.current = client;

        return () => {
            if (clientRef.current) {
                clientRef.current.deactivate();
                clientRef.current = null;
            }
        };
    }, [BACKEND_URL]);

    return {
        screens,
        isConnected,
        isMonitoringActive,
        isLoading,
        error,
        sendControl,
        downloadEvidence
    };
};
