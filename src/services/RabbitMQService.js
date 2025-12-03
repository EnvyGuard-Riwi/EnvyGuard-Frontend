/**
 * RabbitMQ Service for Real-time Screen Monitoring
 * Connects to RabbitMQ queue 'pc_spy_screens' to receive screen capture updates
 */

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queue = 'pc_spy_screens';
    this.isConnected = false;
    this.messageCallbacks = [];
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 3000; // 3 seconds
  }

  /**
   * Register a callback to be called when messages are received
   * @param {Function} callback - Function to call with message data
   */
  onMessage(callback) {
    if (typeof callback === 'function') {
      this.messageCallbacks.push(callback);
    }
  }

  /**
   * Remove a message callback
   * @param {Function} callback - Callback to remove
   */
  offMessage(callback) {
    this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback);
  }

  /**
   * Emit message to all registered callbacks
   * @param {Object} data - Message data
   */
  _emitMessage(data) {
    this.messageCallbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error('Error in RabbitMQ message callback:', error);
      }
    });
  }

  /**
   * Connect to RabbitMQ server
   * Note: In a real implementation, this would connect to your backend API endpoint
   * that manages the RabbitMQ connection
   */
  async connect() {
    try {
      console.log('🔗 Iniciando conexión a RabbitMQ...');
      
      // Establish connection to backend WebSocket that streams RabbitMQ messages
      // This should point to your backend server with RabbitMQ integration
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/rabbitmq-streams`;
      
      // For now, we'll use a polling mechanism to backend API
      // In production, you'd use WebSocket for real-time updates
      this._startPolling();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      console.log('✅ Conexión a RabbitMQ establecida');
      return true;
    } catch (error) {
      console.error('❌ Error conectando a RabbitMQ:', error);
      this._attemptReconnect();
      return false;
    }
  }

  /**
   * Start polling for new screen messages from backend
   */
  _startPolling() {
    // Poll every 500ms for new screen updates
    this.pollInterval = setInterval(() => {
      this._pollForMessages();
    }, 500);
  }

  /**
   * Poll backend API for screen messages
   */
  async _pollForMessages() {
    try {
      const response = await fetch('/api/screens/latest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const messages = await response.json();
        if (Array.isArray(messages)) {
          messages.forEach(message => {
            this._emitMessage(message);
          });
        }
      }
    } catch (error) {
      console.error('Error polling for RabbitMQ messages:', error);
    }
  }

  /**
   * Send a command/message to a specific PC
   * @param {String} pcId - PC identifier
   * @param {Object} command - Command object to send
   */
  async sendCommand(pcId, command) {
    try {
      const response = await fetch('/api/commands/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pcId,
          command,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error sending command via RabbitMQ:', error);
      return false;
    }
  }

  /**
   * Request a screen capture from a specific PC
   * @param {String} pcId - PC identifier
   */
  async requestScreenCapture(pcId) {
    try {
      const response = await fetch('/api/screens/capture', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pcId,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Error requesting screen capture:', error);
      return false;
    }
  }

  /**
   * Attempt to reconnect to RabbitMQ
   */
  _attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`🔄 Reintentando conexión (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      
      setTimeout(() => {
        this.connect();
      }, this.reconnectDelay * this.reconnectAttempts);
    } else {
      console.error('❌ Falló conexión a RabbitMQ después de múltiples intentos');
      this.isConnected = false;
    }
  }

  /**
   * Disconnect from RabbitMQ
   */
  disconnect() {
    try {
      if (this.pollInterval) {
        clearInterval(this.pollInterval);
      }
      this.isConnected = false;
      this.messageCallbacks = [];
      console.log('🔌 Desconectado de RabbitMQ');
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
    }
  }

  /**
   * Get connection status
   */
  getStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queue: this.queue,
    };
  }

  /**
   * Parse RabbitMQ message data
   * Expected format: { PcId, Timestamp, ImageBase64 }
   */
  static parseMessage(messageJson) {
    try {
      const data = typeof messageJson === 'string' ? JSON.parse(messageJson) : messageJson;
      return {
        pcId: data.PcId || data.pcId,
        timestamp: new Date(data.Timestamp || data.timestamp),
        imageBase64: data.ImageBase64 || data.imageBase64,
        status: 'online',
      };
    } catch (error) {
      console.error('Error parsing RabbitMQ message:', error);
      return null;
    }
  }
}

// Export singleton instance
const rabbitmqService = new RabbitMQService();
export default rabbitmqService;
