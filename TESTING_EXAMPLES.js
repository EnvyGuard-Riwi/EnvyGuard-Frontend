/**
 * EJEMPLOS DE PRUEBA - Vigilancia de Pantallas
 * 
 * Usa estos ejemplos para testear la integración del frontend con RabbitMQ
 */

// ============================================
// 1. EJEMPLO: Mensaje RabbitMQ (JSON válido)
// ============================================

const validMessage = {
  "PcId": "SALA-01-PC1",
  "Timestamp": "2025-12-02T18:00:00Z",
  "ImageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
};

// ============================================
// 2. EJEMPLO: Endpoint Backend - GET /api/screens/latest
// ============================================

/**
 * BACKEND: Implementar este endpoint
 * 
 * GET http://localhost:3001/api/screens/latest
 * 
 * Respuesta esperada (Array de mensajes):
 */
const backendResponseExample = [
  {
    "PcId": "SALA-01-PC1",
    "Timestamp": "2025-12-02T18:30:15Z",
    "ImageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/9oADAMBAAIRAxEAPwD5/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
  },
  {
    "PcId": "SALA-02-PC3",
    "Timestamp": "2025-12-02T18:30:18Z",
    "ImageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
  },
  {
    "PcId": "SALA-03-PC5",
    "Timestamp": "2025-12-02T18:30:20Z",
    "ImageBase64": "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/..."
  }
];

// ============================================
// 3. BACKEND: Consumidor RabbitMQ (Node.js)
// ============================================

const amqp = require('amqplib');

async function startRabbitMQConsumer() {
  let connection;
  try {
    // Conectar a RabbitMQ
    connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const queueName = 'pc_spy_screens';
    
    // Asegurar que la cola existe
    await channel.assertQueue(queueName, { durable: true });
    
    console.log('✅ RabbitMQ Consumer iniciado');
    console.log(`📡 Escuchando en cola: ${queueName}`);
    
    // Consumir mensajes
    await channel.consume(queueName, async (msg) => {
      if (msg) {
        try {
          const messageContent = msg.content.toString();
          const data = JSON.parse(messageContent);
          
          console.log('📷 Captura recibida:');
          console.log(`   PC: ${data.PcId}`);
          console.log(`   Timestamp: ${data.Timestamp}`);
          console.log(`   ImageBase64 length: ${data.ImageBase64.length} chars`);
          
          // TODO: Guardar en base de datos o almacenar en caché
          await handleScreenCapture(data);
          
          // Confirmar mensaje procesado
          channel.ack(msg);
        } catch (error) {
          console.error('❌ Error procesando mensaje:', error);
          // Rechazar y reencolar
          channel.nack(msg, false, true);
        }
      }
    });
    
    // Manejar desconexiones
    connection.on('error', (err) => {
      console.error('❌ Error de conexión RabbitMQ:', err);
    });
    
  } catch (error) {
    console.error('❌ Error en RabbitMQ Consumer:', error);
  }
}

async function handleScreenCapture(data) {
  // Aquí guardar en base de datos o caché
  console.log(`✅ Procesando captura de ${data.PcId}`);
  
  // Ejemplo: Almacenar en caché en memoria (para testing)
  // En producción: usar Redis, MongoDB, PostgreSQL, etc.
  screenCaptureCache[data.PcId] = {
    timestamp: new Date(data.Timestamp),
    imageBase64: data.ImageBase64,
    updatedAt: new Date()
  };
}

// Almacenar capturas en caché
let screenCaptureCache = {};

startRabbitMQConsumer();

// ============================================
// 4. BACKEND: Endpoint Express.js
// ============================================

const express = require('express');
const app = express();

app.use(express.json());

/**
 * GET /api/screens/latest
 * Retorna las últimas capturas de todos los PCs
 */
app.get('/api/screens/latest', (req, res) => {
  try {
    // Convertir caché a array
    const screens = Object.entries(screenCaptureCache).map(([pcId, data]) => ({
      PcId: pcId,
      Timestamp: data.timestamp.toISOString(),
      ImageBase64: data.imageBase64
    }));
    
    console.log(`📤 GET /api/screens/latest - Enviando ${screens.length} capturas`);
    res.json(screens);
  } catch (error) {
    console.error('❌ Error en GET /api/screens/latest:', error);
    res.status(500).json({ error: 'Error obteniendo capturas' });
  }
});

/**
 * POST /api/screens/capture
 * Solicita una captura de un PC específico
 */
app.post('/api/screens/capture', (req, res) => {
  try {
    const { pcId } = req.body;
    
    console.log(`📸 Solicitud de captura para: ${pcId}`);
    
    // TODO: Enviar comando al agent del PC vía RabbitMQ
    // Ejemplo: channel.sendToQueue('pc_agent_commands', Buffer.from(JSON.stringify({
    //   command: 'capture_screen',
    //   pcId: pcId
    // })));
    
    res.json({ success: true, message: `Captura solicitada para ${pcId}` });
  } catch (error) {
    console.error('❌ Error en POST /api/screens/capture:', error);
    res.status(500).json({ error: 'Error solicitando captura' });
  }
});

/**
 * POST /api/commands/send
 * Envía un comando a un PC específico
 */
app.post('/api/commands/send', (req, res) => {
  try {
    const { pcId, command } = req.body;
    
    console.log(`🎯 Comando enviado a ${pcId}:`, command);
    
    // TODO: Enviar comando a RabbitMQ
    // channel.sendToQueue('pc_agent_commands', Buffer.from(JSON.stringify({
    //   pcId,
    //   command,
    //   timestamp: new Date().toISOString()
    // })));
    
    res.json({ success: true });
  } catch (error) {
    console.error('❌ Error en POST /api/commands/send:', error);
    res.status(500).json({ error: 'Error enviando comando' });
  }
});

app.listen(3001, () => {
  console.log('🚀 Backend corriendo en http://localhost:3001');
});

// ============================================
// 5. EJEMPLO: Mensaje RabbitMQ válido (Formato Real)
// ============================================

/**
 * Este es un ejemplo de mensaje que debería ser publicado
 * en la cola pc_spy_screens por los agentes de cada PC
 */
const exampleRabbitMessage = JSON.stringify({
  PcId: "SALA-01-PC1",
  Timestamp: "2025-12-02T18:30:15.123Z",
  ImageBase64: "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCABAAEADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/8QAHwEAAwEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWm5ybnJ2eoqOkpaanqKmqsrO0tba2uLm6wsPExcbHyMnK0tPU1dbW2Nna4uPk5ebn6Onq8vP09fb2+Pn6/9oADAMBAAIRAxEAPwD5/KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q=="
});

// ============================================
// 6. TESTING: Script para publicar mensaje de prueba
// ============================================

/**
 * Para testear la integración, ejecuta esto desde tu backend:
 * 
 * node publish-test-message.js
 */

const amqp2 = require('amqplib');

async function publishTestMessage() {
  try {
    const connection = await amqp2.connect('amqp://localhost');
    const channel = await connection.createChannel();
    const queue = 'pc_spy_screens';
    
    await channel.assertQueue(queue, { durable: true });
    
    const testMessages = [
      {
        PcId: "SALA-01-PC1",
        Timestamp: new Date().toISOString(),
        ImageBase64: "/9j/4AAQSkZJRgABAQEAYABgAAD/..." // JPEG Base64 aquí
      },
      {
        PcId: "SALA-02-PC3",
        Timestamp: new Date().toISOString(),
        ImageBase64: "/9j/4AAQSkZJRgABAQEAYABgAAD/..." // JPEG Base64 aquí
      }
    ];
    
    for (const msg of testMessages) {
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
      console.log(`✅ Mensaje publicado para ${msg.PcId}`);
    }
    
    await channel.close();
    await connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// publishTestMessage(); // Descomentar para ejecutar

// ============================================
// 7. DEBUGGING: Verificar que el Frontend recibe datos
// ============================================

/**
 * Abrir DevTools del navegador (F12) y pegar en consola:
 * 
 * 1. Ver estado de conexión:
 *    console.log(RabbitMQService.getStatus());
 * 
 * 2. Ver mensajes que llegan:
 *    RabbitMQService.onMessage((data) => console.log('Mensaje recibido:', data));
 * 
 * 3. Ver estado de pantallas:
 *    Buscar "ScreenMonitoringSection conectada" en console
 */

// ============================================
// 8. VALIDACIÓN: Formato de Base64 JPEG
// ============================================

/**
 * Validar que el Base64 es correcto:
 * 
 * 1. Debe empezar con: /9j/ (para JPEG)
 * 2. No debe contener: data:image/jpeg;base64, (el prefijo se agrega en frontend)
 * 3. Longitud típica: 50KB-500KB dependiendo de resolución y compresión
 * 
 * Ejemplo correcto:
 * "/9j/4AAQSkZJRg..." ✅
 * 
 * Ejemplo incorrecto (tiene prefijo):
 * "data:image/jpeg;base64,/9j/4AAQSkZJRg..." ❌
 * 
 * Ejemplo incorrecto (PNG en lugar de JPEG):
 * "iVBORw0KGgo..." ❌
 */

// ============================================
// 9. MONITOREO: Console logs esperados
// ============================================

/**
 * Cuando todo funciona correctamente, deberías ver en el navegador:
 * 
 * ✅ ScreenMonitoringSection conectada a RabbitMQ
 * 🔗 Iniciando conexión a RabbitMQ...
 * 📡 Polling activo cada 500ms
 * 📷 Captura recibida: SALA-01-PC1
 * 
 * Y en el servidor backend:
 * 
 * ✅ RabbitMQ Consumer iniciado
 * 📡 Escuchando en cola: pc_spy_screens
 * 📷 Captura recibida: SALA-01-PC1
 * ✅ Procesando captura de SALA-01-PC1
 */

module.exports = {
  validMessage,
  backendResponseExample,
  exampleRabbitMessage,
  startRabbitMQConsumer,
  handleScreenCapture,
  screenCaptureCache
};
