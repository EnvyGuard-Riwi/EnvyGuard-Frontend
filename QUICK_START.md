# 🚀 QUICK START - Vigilancia de Pantallas

## ✅ Status: LISTO PARA USAR

El frontend está **100% implementado y compilado** ✨

---

## 📍 Ubicación en el Dashboard

**Menú Lateral → "Vigilancia de Pantallas"** (ícono 👁️)

---

## 📦 Lo que el Backend DEBE proporcionar

### 1️⃣ Cola RabbitMQ: `pc_spy_screens`

**Formato de mensaje (JSON):**
```json
{
  "PcId": "SALA-01-PC1",
  "Timestamp": "2025-12-02T18:00:00Z",
  "ImageBase64": "/9j/4AAQSkZJRg..."
}
```

**⚠️ IMPORTANTE:**
- `ImageBase64` = String JPEG Base64 **SIN** prefijo `data:image/jpeg;base64,`
- `PcId` = Debe coincidir con PCs registrados en sistema
- `Timestamp` = Formato ISO 8601

---

### 2️⃣ Endpoint: `GET /api/screens/latest`

**Response esperado (Array):**
```json
[
  {
    "PcId": "SALA-01-PC1",
    "Timestamp": "2025-12-02T18:00:00Z",
    "ImageBase64": "/9j/4AAQSkZJRg..."
  }
]
```

**Frecuencia de polling:** Cada 500ms (configurable)

---

### 3️⃣ Endpoints Opcionales

**POST `/api/screens/capture`** - Solicitar captura de PC
```json
{
  "pcId": "SALA-01-PC1",
  "timestamp": "2025-12-02T18:00:00Z"
}
```

**POST `/api/commands/send`** - Enviar comando a PC
```json
{
  "pcId": "SALA-01-PC1",
  "command": { ... },
  "timestamp": "2025-12-02T18:00:00Z"
}
```

---

## 🔧 Integración Backend (Node.js Express)

```javascript
const express = require('express');
const amqp = require('amqplib');
const app = express();

app.use(express.json());

// Almacenar capturas en caché
let screenCache = {};

// Consumidor RabbitMQ
(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  
  await ch.assertQueue('pc_spy_screens', { durable: true });
  
  ch.consume('pc_spy_screens', (msg) => {
    const data = JSON.parse(msg.content.toString());
    screenCache[data.PcId] = data;
    ch.ack(msg);
  });
})();

// Endpoint para Frontend
app.get('/api/screens/latest', (req, res) => {
  res.json(Object.values(screenCache));
});

app.listen(3001);
```

---

## 🎨 Vista Frontend

```
┌─────────────────────────────────────────┐
│ 👁️ Vigilancia de Pantallas    2/3 en línea
├─────────────────────────────────────────┤
│ Dispositivos: 3 │ En Línea: 2 │ Actualizaciones: 36/min
├─────────────────────────────────────────┤
│ ┌──────────┐  ┌──────────┐  ┌──────────┐
│ │ ✅ LÍNEA │  │ ✅ LÍNEA │  │ ❌ DESC. │
│ │ [SCREEN] │  │ [SCREEN] │  │ [SCREEN] │
│ │ SALA-PC1 │  │ SALA-PC2 │  │ SALA-PC3 │
│ └──────────┘  └──────────┘  └──────────┘
└─────────────────────────────────────────┘
```

---

## 💻 Cómo Testear Localmente

### Paso 1: Instalar RabbitMQ
```bash
# Windows (con chocolatey)
choco install rabbitmq

# O Docker
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:management
```

### Paso 2: Crear consumidor backend
Ver archivo `TESTING_EXAMPLES.js` en el proyecto

### Paso 3: Publicar mensaje de prueba
```javascript
const amqp = require('amqplib');

(async () => {
  const conn = await amqp.connect('amqp://localhost');
  const ch = await conn.createChannel();
  
  const msg = {
    PcId: "SALA-01-PC1",
    Timestamp: new Date().toISOString(),
    ImageBase64: "/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgG..." // JPEG válido
  };
  
  ch.sendToQueue('pc_spy_screens', Buffer.from(JSON.stringify(msg)));
  console.log('✅ Mensaje enviado');
})();
```

### Paso 4: Verificar en Dashboard
1. Abrir Dashboard → "Vigilancia de Pantallas"
2. Abrir DevTools (F12)
3. Ver console logs
4. Tarjetas se actualizarán en tiempo real

---

## 🔍 Debugging

### Ver logs del Frontend
```javascript
// En DevTools console:
RabbitMQService.getStatus()

// Output esperado:
{
  isConnected: true,
  reconnectAttempts: 0,
  queue: "pc_spy_screens"
}
```

### Verificar que llegan mensajes
```javascript
// En DevTools:
RabbitMQService.onMessage(data => console.log('📷 Nueva captura:', data));
```

---

## 📊 Archivos Creados

| Archivo | Líneas | Propósito |
|---------|--------|----------|
| `src/services/RabbitMQService.js` | 165 | Cliente RabbitMQ + polling |
| `src/pages/Dashboard.js` (modificado) | +250 | ScreenMonitoringSection + integración |
| `RABBITMQ_INTEGRATION.md` | 200+ | Documentación técnica completa |
| `IMPLEMENTATION_SUMMARY.md` | 300+ | Resumen detallado |
| `TESTING_EXAMPLES.js` | 350+ | Ejemplos de código backend |

---

## ✨ Características Implementadas

✅ Grid responsivo (1, 2, 3 columnas)
✅ Imágenes JPEG Base64 en tiempo real
✅ Indicadores de estado (online/offline)
✅ Modal fullscreen con click
✅ Timestamps auto-actualizando
✅ Animaciones suaves (Framer Motion)
✅ RabbitMQ Service completo
✅ Polling HTTP cada 500ms
✅ Reintentos automáticos
✅ Error handling
✅ Cleanup en desmontaje

---

## 🚨 Errores Comunes

### ❌ "Sin captura" en todas las tarjetas
- Verificar que `/api/screens/latest` retorna datos
- Comprobar console.log del navegador
- Backend debe estar corriendo

### ❌ Imágenes no se muestran
- Verificar que ImageBase64 NO tiene prefijo `data:image/jpeg;base64,`
- Validar que es JPEG (empieza con `/9j/`)
- Comprobar que no es PNG o otro formato

### ❌ RabbitMQ desconecta
- Ver console: "🔄 Reintentando conexión..."
- Verificar que RabbitMQ está corriendo
- Revisar credenciales en `RabbitMQService.js`

### ❌ Tarjetas no se actualizan
- Verificar que el backend publica en cola correcta
- Ver console del navegador (F12)
- Comprobar que handleScreenMessage se llama

---

## 📝 Notas Importantes

1. **Polling cada 500ms** - Configurable en `RabbitMQService.js` línea 52
2. **Max 5 reintentos** - Configurable en constructor
3. **Datos en memory** - React state, no persisten entre recargas
4. **Base64 crudo** - Sin prefijo `data:image/jpeg;base64,`
5. **PcId sensible a case** - Debe coincidir exacto con sistema

---

## 🎯 Próximos Pasos

1. ✅ Frontend listo
2. ⏳ Backend implementa RabbitMQ consumer
3. ⏳ Backend expone `/api/screens/latest`
4. ⏳ Agents de PCs publican capturas
5. 🎉 End-to-end working!

---

## 📞 Soporte

**Documentación completa:** `RABBITMQ_INTEGRATION.md`
**Ejemplos de código:** `TESTING_EXAMPLES.js`
**Resumen de cambios:** `IMPLEMENTATION_SUMMARY.md`
**Código frontend:** `src/pages/Dashboard.js` línea 3093
**Servicio:** `src/services/RabbitMQService.js`

---

## ✅ Checklist Final

- [x] Frontend compilado sin errores
- [x] UI responsiva en móvil/tablet/desktop
- [x] RabbitMQ Service creado
- [x] Polling implementado
- [x] Imágenes Base64 renderizadas
- [x] Modal fullscreen funcional
- [x] Animaciones suaves
- [x] Error handling
- [x] Console logs útiles
- [x] Documentación completa

**¡LISTO PARA INTEGRACIÓN! 🚀**
