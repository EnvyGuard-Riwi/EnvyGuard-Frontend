# Integración RabbitMQ - Vigilancia de Pantallas

## 🎯 Estado Actual
✅ **Frontend completamente implementado** - Listo para recibir mensajes de RabbitMQ

## 📦 Arquitectura Frontend

### 1. Componentes Implementados

#### **ScreenMonitoringSection** (`src/pages/Dashboard.js` línea 3093)
- Grid responsivo de pantallas (1 columna mobile → 2 tablets → 3 desktop)
- Visualización en tiempo real de capturas Base64
- Modal fullscreen para ver en grande
- Indicadores de estado (EN LÍNEA/DESCONECTADO)
- Timestamps de última actualización

#### **RabbitMQService** (`src/services/RabbitMQService.js`)
- Gestor de conexión a RabbitMQ
- Sistema de callbacks para mensajes
- Reintentos automáticos de conexión
- Métodos para enviar comandos

### 2. Flujo de Datos

```
RabbitMQ Queue (pc_spy_screens)
        ↓
RabbitMQService.connect()
        ↓
Receive messages: { PcId, Timestamp, ImageBase64 }
        ↓
handleScreenMessage() parses JSON
        ↓
setScreens() updates state with new image
        ↓
Re-render with `data:image/jpeg;base64,${imageBase64}`
```

## 🔧 Formato de Mensaje Esperado

Cada mensaje en la cola `pc_spy_screens` debe ser un JSON válido:

```json
{
  "PcId": "SALA-01-PC1",
  "Timestamp": "2025-12-02T18:00:00Z",
  "ImageBase64": "/9j/4AAQSkZJRg..."
}
```

### Campos Requeridos:
- **PcId**: Identificador único del PC (string) - Debe coincidir con los PCs en la base de datos
- **Timestamp**: Marca de tiempo ISO 8601 (string)
- **ImageBase64**: String Base64 de la imagen JPEG (sin prefijo `data:image/jpeg;base64,`)

### Notas Importantes:
- Las imágenes JPEG Base64 típicamente inician con `/9j/` o `iVBO...` (si es PNG)
- El prefijo `data:image/jpeg;base64,` se añade automáticamente en el frontend
- Enviar solo el string Base64 crudo

## 📡 Endpoints Backend Requeridos

El `RabbitMQService.js` espera los siguientes endpoints (configurable):

### 1. **GET `/api/screens/latest`**
Obtiene los últimos mensajes de pantalla

**Respuesta esperada:**
```json
[
  {
    "PcId": "SALA-01-PC1",
    "Timestamp": "2025-12-02T18:00:00Z",
    "ImageBase64": "/9j/4AAQSkZJRg..."
  },
  {
    "PcId": "SALA-02-PC3",
    "Timestamp": "2025-12-02T18:00:05Z",
    "ImageBase64": "/9j/4AAQSkZJRg..."
  }
]
```

**Usado por:** Polling cada 500ms para obtener actualizaciones

### 2. **POST `/api/screens/capture`**
Solicita una captura de pantalla de un PC específico

**Payload esperado:**
```json
{
  "pcId": "SALA-01-PC1",
  "timestamp": "2025-12-02T18:00:00Z"
}
```

**Respuesta:** `{ success: true }`

### 3. **POST `/api/commands/send`**
Envía comandos a PCs específicos

**Payload esperado:**
```json
{
  "pcId": "SALA-01-PC1",
  "command": { ... },
  "timestamp": "2025-12-02T18:00:00Z"
}
```

## 🚀 Configuración RabbitMQ en Backend

### Requisitos:
1. Instalar `amqplib` en el backend: `npm install amqplib`
2. Crear una cola llamada `pc_spy_screens`
3. Consumir mensajes de esa cola
4. Enviar mensajes a través del endpoint `/api/screens/latest`

### Ejemplo de Consumidor RabbitMQ (Node.js):

```javascript
const amqp = require('amqplib');

async function consumeScreenUpdates() {
  try {
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();
    
    const queue = 'pc_spy_screens';
    await channel.assertQueue(queue, { durable: true });
    
    console.log('Esperando mensajes en la cola:', queue);
    
    await channel.consume(queue, async (msg) => {
      if (msg) {
        const messageContent = msg.content.toString();
        const data = JSON.parse(messageContent);
        
        console.log('📷 Captura recibida:', data.PcId);
        
        // Guardar en base de datos o almacenar en caché
        await saveScreenCapture(data);
        
        // Confirmar mensaje procesado
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error('Error en consumidor RabbitMQ:', error);
  }
}

consumeScreenUpdates();
```

## 🔄 Ciclo de Actualización

1. **Frontend conecta** → `RabbitMQService.connect()`
2. **Inicia polling** → Poll a `/api/screens/latest` cada 500ms
3. **Recibe JSON** → `{ PcId, Timestamp, ImageBase64 }`
4. **Procesa mensaje** → `handleScreenMessage()` parsea y actualiza state
5. **Renderiza** → Grid se actualiza con nueva imagen
6. **Modal fullscreen** → Click en card abre vista ampliada

## 🛠️ Optimizaciones Futuras

### Recomendaciones:
1. **WebSocket en lugar de polling** - Cambiar de polling HTTP a WebSocket para menor latencia
2. **Compresión de imágenes** - Considerar enviar imágenes más pequeñas o con menor calidad
3. **Rate limiting** - Limitar a máximo N capturas por segundo
4. **Caché de imágenes** - Almacenar última captura para cada PC
5. **Reconexión automática** - Ya implementado en `RabbitMQService`

## 📋 Checklist de Implementación Backend

- [ ] Cola RabbitMQ `pc_spy_screens` creada
- [ ] Consumidor RabbitMQ procesando mensajes
- [ ] Endpoint GET `/api/screens/latest` implementado
- [ ] Endpoint POST `/api/screens/capture` implementado
- [ ] Endpoint POST `/api/commands/send` implementado
- [ ] Imágenes se envían como Base64 JPEG
- [ ] Formato JSON coincide con especificación
- [ ] Prueba: Enviar mensaje de prueba
- [ ] Verificar en Dashboard → "Vigilancia de Pantallas"

## 🐛 Troubleshooting

### Problema: No aparecen imágenes
- ✓ Verificar que `/api/screens/latest` retorna datos
- ✓ Verificar consola del navegador (F12) para logs
- ✓ Comprobar que ImageBase64 es un string válido

### Problema: Conexión a RabbitMQ falla
- ✓ Verificar que RabbitMQ está corriendo
- ✓ Verificar credenciales y puerto
- ✓ Revisar logs del RabbitMQService

### Problema: Imágenes se ven distorsionadas
- ✓ Verificar que ImageBase64 es JPEG válido
- ✓ Comprobar que NO incluye el prefijo `data:image/jpeg;base64,`
- ✓ Decodificar Base64 localmente para validar

## 📞 Contacto para Preguntas

**Frontend está listo. Necesitamos que el backend proporcione:**
1. Cola RabbitMQ con formato especificado
2. Endpoints HTTP para polling de datos
3. Imágenes JPEG en Base64

¡El resto ya está implementado y funcionando! 🎉
