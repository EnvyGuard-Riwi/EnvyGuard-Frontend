import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { controlService } from '../services';

// --- CONFIGURACIÓN DE CONEXIÓN ---
const BACKEND_URL = 'https://api.envyguard.crudzaso.com'; 
// ---------------------------------

const SpyWall = () => {
    const [screens, setScreens] = useState({});
    const [isConnected, setIsConnected] = useState(false);
    
    const clientRef = useRef(null);
    const historyRef = useRef({});
    const MAX_HISTORY_SIZE = 100;

    // CONTROL REMOTO - Usando controlService centralizado
    const sendControl = async (action) => {
        try {
            console.log('🎮 Enviando control:', action);
            await controlService.sendAction(action);
            console.log(`✅ Orden ${action} enviada correctamente.`);
        } catch (e) { 
            alert("Error contactando al servidor. Verifica la conexión."); 
            console.error('❌ Error:', e);
        }
    };

    const downloadEvidence = (pcId) => {
        const history = historyRef.current[pcId];
        if (!history || history.length === 0) return alert("Aún no hay historial suficiente.");
        const blob = new Blob([JSON.stringify(history, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `EVIDENCIA_${pcId}_${new Date().toISOString()}.json`;
        a.click();
    };

    useEffect(() => {
        if (clientRef.current) return;

        // AQUÍ USAMOS LA IP DEL SERVIDOR PARA EL SOCKET
        const socket = new SockJS(`${BACKEND_URL}/ws-spy`);
        const stompClient = window.Stomp.over(socket);
        stompClient.debug = () => {}; 

        stompClient.connect({}, () => {
            console.log("✅ Conectado al sistema de vigilancia remoto");
            setIsConnected(true);
            clientRef.current = stompClient;
            
            stompClient.subscribe('/topic/screens', (msg) => {
                try {
                    const data = JSON.parse(msg.body);
                    // Aseguramos compatibilidad con mayúsculas/minúsculas
                    const pcId = data.PcId || data.pcId;
                    const img = data.ImageBase64 || data.image;

                    if (pcId && img) {
                        setScreens(prev => ({ ...prev, [pcId]: img }));

                        if (!historyRef.current[pcId]) historyRef.current[pcId] = [];
                        historyRef.current[pcId].push({ timestamp: data.Timestamp, image: img });
                        if (historyRef.current[pcId].length > MAX_HISTORY_SIZE) historyRef.current[pcId].shift();
                    }
                } catch (e) { console.error("Error datos:", e); }
            });
        }, (err) => {
            console.error("Error socket:", err);
            setIsConnected(false);
        });

        return () => {
            if (clientRef.current && clientRef.current.connected) {
                try { clientRef.current.disconnect(); } catch (e) {}
            }
            clientRef.current = null;
        };
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.controlPanel}>
                <div style={{display:'flex', alignItems:'center'}}>
                    <h2 style={{margin:0, marginRight: 20, color: '#0f0'}}>👁️ Centro de Control</h2>
                    <span style={{
                        padding: '5px 10px', 
                        borderRadius: '4px', 
                        background: isConnected ? 'green' : 'red', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold'
                    }}>
                        {isConnected ? 'ONLINE' : 'OFFLINE'}
                    </span>
                </div>
                
                <div style={{marginTop: 10}}>
                    <button style={styles.btnStart} onClick={() => sendControl('START')}>▶ INICIAR CLASE</button>
                    <button style={styles.btnStop} onClick={() => sendControl('STOP')}>⏹ TERMINAR CLASE</button>
                </div>
            </div>
            
            <div style={styles.grid}>
                {Object.keys(screens).length === 0 && (
                    <div style={{color: '#555', width: '100%', textAlign: 'center', marginTop: 50}}>
                        <h3>Esperando señal de video...</h3>
                        <p>Presiona "INICIAR CLASE" para despertar a los agentes.</p>
                        <p style={{fontSize: '0.8rem'}}>Conectado a: {BACKEND_URL}</p>
                    </div>
                )}

                {Object.entries(screens).map(([id, img]) => (
                    <div key={id} style={styles.card}>
                        <div style={styles.cardHeader}>🖥️ {id}</div>
                        <img src={`data:image/jpeg;base64,${img}`} style={styles.image} alt={id}/>
                        <button style={styles.btnEvidence} onClick={() => downloadEvidence(id)}>
                            💾 EVIDENCIA
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: { background: '#111', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: 'sans-serif' },
    controlPanel: { background: '#222', padding: '15px', borderRadius: '8px', border: '1px solid #333', marginBottom: '20px', display:'flex', flexDirection:'column', gap: 10 },
    grid: { display: 'flex', flexWrap: 'wrap', gap: '15px' },
    card: { width: '320px', border: '1px solid #444', borderRadius: '5px', overflow: 'hidden', background: '#000' },
    cardHeader: { padding: '8px', background: '#1a1a1a', color: '#0f0', fontSize: '0.9rem', fontWeight: 'bold', borderBottom: '1px solid #333' },
    image: { width: '100%', display: 'block' },
    btnStart: { background: '#008000', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', marginRight: '10px', borderRadius: '4px', fontWeight: 'bold', fontSize:'1rem' },
    btnStop: { background: '#b00', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold', fontSize:'1rem' },
    btnEvidence: { width: '100%', padding: '10px', background: '#0044cc', color: '#fff', border: 'none', cursor: 'pointer', borderTop: '1px solid #333' }
};

export default SpyWall;