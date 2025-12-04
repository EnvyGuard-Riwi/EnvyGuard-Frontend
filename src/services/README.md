# 📚 Documentación de Servicios - EnvyGuard Frontend

## 📁 Estructura de Carpetas

```
src/
├── config/
│   ├── apiConfig.js          ← Configuración centralizada de APIs
│   └── routes.js
├── context/
│   ├── DeviceContext.js
│   ├── UserContext.js
│   └── AuthContext.js
├── hooks/
│   └── ...
├── services/                  ← 🔑 SERVICIOS DE API
│   ├── index.js              ← Exporta todos los servicios
│   ├── AuthService.js        ← Autenticación
│   ├── userService.js        ← Gestión de usuarios
│   ├── deviceService.js      ← Gestión de dispositivos
│   ├── WebSocketService.js   ← WebSocket (tiempo real)
│   └── RabbitMQService.js    ← Mensajería
├── pages/
│   └── Dashboard.js
└── ...
```

## 🚀 Cómo Usar los Servicios

### 1. **Importar el servicio**

```javascript
import { userService, deviceService, AuthService } from '../services';

// O importar individual
import userService from '../services/userService';
```

### 2. **Usar en componentes**

```javascript
import { userService } from '../services';

export function UsersComponent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await userService.getAllUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return <div>{/* componente */}</div>;
}
```

## 📋 Servicios Disponibles

### 1. **AuthService** - Autenticación

```javascript
import { AuthService } from '../services';

// Login
await AuthService.login(email, password);

// Register
await AuthService.register(userData);

// Logout
AuthService.logout();

// Obtener usuario actual
const user = AuthService.getCurrentUser();

// Validar si está autenticado
const isAuth = AuthService.isAuthenticated();

// Obtener token
const token = AuthService.getToken();

// Validar token con backend
await AuthService.validateToken();

// Obtener hora de login
const loginTime = AuthService.getLoginTime();
```

### 2. **userService** - Gestión de Usuarios

```javascript
import { userService } from '../services';

// Obtener todos los usuarios
await userService.getAllUsers();

// Obtener usuario por ID
await userService.getUserById(userId);

// Crear usuario
await userService.createUser({
  email: 'user@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
  role: 'Admin'
});

// Actualizar usuario
await userService.updateUser(userId, {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  password: 'newPassword123' // opcional
});

// Actualizar con PATCH (alternativa)
await userService.patchUser(userId, {
  firstName: 'Jane'
});

// Eliminar usuario
await userService.deleteUser(userId);

// Cambiar estado (activar/desactivar)
await userService.toggleUserStatus(userId, true); // true = activo

// Cambiar contraseña
await userService.changePassword(userId, 'newPassword123');

// Buscar usuarios
await userService.searchUsers('john');
```

### 3. **deviceService** - Gestión de Dispositivos

```javascript
import { deviceService } from '../services';

// Obtener todos los dispositivos
await deviceService.getAllDevices();

// Obtener dispositivo por ID
await deviceService.getDeviceById(deviceId);

// Crear dispositivo
await deviceService.createDevice({
  name: 'PC-01',
  type: 'desktop',
  // ... otros campos
});

// Actualizar dispositivo
await deviceService.updateDevice(deviceId, {
  name: 'PC-01 Updated'
});

// Eliminar dispositivo
await deviceService.deleteDevice(deviceId);

// Ejecutar acción en dispositivo
await deviceService.executeAction(deviceId, 'shutdown'); // shutdown, restart, etc

// Ejecutar acción en múltiples dispositivos
await deviceService.executeBatchAction([id1, id2, id3], 'restart');

// Obtener estado del dispositivo
await deviceService.getDeviceStatus(deviceId);

// Obtener métricas
await deviceService.getDeviceMetrics(deviceId);

// Filtrar por estado
await deviceService.getDevicesByStatus('online');
```

## ⚙️ Configuración

Edita `src/config/apiConfig.js` para cambiar:

```javascript
// URL base de la API
BASE_URL: 'https://api.envyguard.crudzaso.com/api'

// Endpoints
ENDPOINTS: { ... }

// Configuración de axios
AXIOS_CONFIG: {
  timeout: 10000,
  headers: { ... }
}

// Reintentos automáticos
RETRY_CONFIG: {
  maxRetries: 3,
  retryDelay: 1000
}
```

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=https://api.envyguard.crudzaso.com/api
REACT_APP_DEBUG=true
REACT_APP_ENVIRONMENT=development
```

## 📊 Características de los Servicios

### ✅ Manejo de Errores Robusto

```javascript
try {
  const users = await userService.getAllUsers();
} catch (error) {
  console.error(error.message);
  // Error automáticamente parseado y documentado
}
```

### ✅ Interceptores Automáticos

- ✔️ Agregar token a todas las requests automáticamente
- ✔️ Manejar 401 (no autorizado) automáticamente
- ✔️ Reintentos automáticos en errores de red

### ✅ Logging Detallado

Todos los servicios tienen logs con emojis:
- 🔄 Operaciones en progreso
- ✅ Éxitos
- ❌ Errores
- 📊 Datos obtenidos
- 🗑️ Eliminaciones

### ✅ Documentación JSDoc

Cada función tiene documentación clara:

```javascript
/**
 * Obtener todos los usuarios
 * @returns {Promise<Array>} Array de usuarios
 * @throws {Error} Si hay error en la API
 */
await userService.getAllUsers();
```

## 🚦 Flujo de Datos

```
Componente React
       ↓
  useEffect() / Event Handler
       ↓
  Importar servicio
       ↓
  Llamar método del servicio
       ↓
  axios instance (con interceptores)
       ↓
  API Backend
       ↓
  Response ← Error Handling ← Logging
       ↓
  Return al componente
       ↓
  setState() / Toast / UI Update
```

## 💡 Mejores Prácticas

### ✅ Hacer

```javascript
// ✅ Usar los servicios centralizados
import { userService } from '../services';
const users = await userService.getAllUsers();
```

### ❌ No Hacer

```javascript
// ❌ NO hacer llamadas directas en componentes
const response = await fetch('https://api.envyguard.crudzaso.com/api/auth/users', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 📝 Agregar un Nuevo Servicio

1. **Crear archivo** `src/services/newService.js`

```javascript
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://api.envyguard.crudzaso.com/api';

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/endpoint`,
});

// Agregar interceptores...

const newService = {
  method1: async () => { /* ... */ },
  method2: async () => { /* ... */ },
};

export default newService;
```

2. **Exportar en** `src/services/index.js`

```javascript
export { default as newService } from './newService';
```

3. **Usar en componentes**

```javascript
import { newService } from '../services';
```

## 🐛 Debugging

Habilita logs detallados editando `.env`:

```env
REACT_APP_DEBUG=true
```

O en la consola del navegador:

```javascript
import { API_CONFIG } from '../config/apiConfig';
API_CONFIG.DEBUG = true;
```

## 📞 Soporte

Para problemas con servicios:
1. Verifica que la URL base es correcta
2. Revisa que el token está en localStorage
3. Mira los logs en la consola del navegador
4. Verifica que el backend está corriendo

---

**Creado:** 3 de diciembre de 2025
**Versión:** 1.0.0
