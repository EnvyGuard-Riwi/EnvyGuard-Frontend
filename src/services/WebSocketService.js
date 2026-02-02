import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.client = null;
    this.listeners = {};
    this.connected = false;
    // URL del WebSocket STOMP del backend Java
    // URL del WebSocket STOMP del backend Java
    const baseUrl = process.env.REACT_APP_WS_URL || 'https://api.andrescortes.dev';
    this.wsUrl = `${baseUrl}/ws-spy`;
  }

  // Conectar a WebSocket usando STOMP/SockJS
  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.client = new Client({
          webSocketFactory: () => new SockJS(this.wsUrl),
          debug: (str) => {
            console.log('🔌 STOMP:', str);
          },
          reconnectDelay: 5000,
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000,
        });

        this.client.onConnect = () => {
          console.log('✅ Conectado a WebSocket STOMP');
          this.connected = true;
          this.emit('connected');

          // Suscribirse al topic de actualizaciones de estado de PCs (Sala4 entity)
          this.client.subscribe('/topic/computers', (message) => {
            const rawData = JSON.parse(message.body);

            // Normalizar datos para que el frontend los entienda
            const data = {
              type: 'device_status',
              ip: rawData.ip,
              status: rawData.status,
              id: rawData.id,
              latencyMs: rawData.latencyMs // Si el backend lo envía (quizás no, pero no está de más)
            };

            this.emit('message', data);
            this.emit('pc-status', data);
            console.log('📨 Estado de PC recibido (Tiempo Real):', data);
          });

          // Suscribirse al topic de screenshots
          this.client.subscribe('/topic/screenshots', (message) => {
            const data = JSON.parse(message.body);
            this.emit('screenshot', data);
            console.log('📸 Screenshot recibido');
          });

          resolve();
        };

        this.client.onStompError = (frame) => {
          console.error('❌ Error STOMP:', frame.headers['message']);
          this.emit('error', frame);
          reject(new Error(frame.headers['message']));
        };

        this.client.onDisconnect = () => {
          console.log('🔌 WebSocket STOMP desconectado');
          this.connected = false;
          this.emit('disconnected');
        };

        this.client.activate();
      } catch (error) {
        console.error('❌ Error al conectar WebSocket:', error);
        reject(error);
      }
    });
  }

  // Enviar mensaje a un destino específico
  send(destination, data) {
    if (this.client && this.connected) {
      this.client.publish({
        destination: destination,
        body: JSON.stringify(data),
      });
    } else {
      console.warn('WebSocket STOMP no está conectado');
    }
  }

  // Suscribirse a eventos locales
  on(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  // Desuscribirse de eventos
  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
    }
  }

  // Emitir eventos locales
  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach((callback) => callback(data));
    }
  }

  // Desconectar
  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  // Verificar si está conectado
  isConnected() {
    return this.connected;
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
