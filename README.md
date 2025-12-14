<p align="center">
  <img src="./src/assets/icons/icon.png" alt="EnvyGuard Logo" width="150" height="150"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/EnvyGuard-v1.0.0-22d3ee?style=for-the-badge&logo=shield&logoColor=white" alt="Version"/>
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"/>
  <img src="https://img.shields.io/badge/Status-Production-22c55e?style=for-the-badge" alt="Status"/>
  <img src="https://img.shields.io/badge/License-Privado-ef4444?style=for-the-badge" alt="License"/>
</p>

<h1 align="center">EnvyGuard Frontend</h1>

<p align="center">
  <strong>Sistema Integral de Monitoreo y Control Remoto para Laboratorios de Cómputo</strong>
</p>

<p align="center">
  Plataforma empresarial de vigilancia y gestión de dispositivos en tiempo real, diseñada para instituciones educativas y entornos corporativos.
</p>

---

## Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación y Configuración](#instalación-y-configuración)
- [Guía de Uso](#guía-de-uso)
- [Sistema de Autenticación](#sistema-de-autenticación)
- [Conexión con el Backend](#conexión-con-el-backend)
- [Personalización](#personalización)
- [Equipo de Desarrollo](#equipo-de-desarrollo)
- [Licencia](#licencia)

---

## Descripción General

**EnvyGuard** es una solución integral de monitoreo y control remoto diseñada específicamente para administrar laboratorios de cómputo en instituciones educativas. Permite a los administradores supervisar, controlar y gestionar múltiples equipos de forma simultánea desde una interfaz web moderna y elegante.

### Propuesta de Valor

| Característica | Descripción |
|----------------|-------------|
| **Control Centralizado** | Gestiona todas las salas de cómputo desde un único panel de control |
| **Tiempo Real** | Monitoreo en vivo de pantallas y estados de equipos |
| **Seguridad** | Bloqueo de sitios web y control de acceso por roles |
| **Automatización** | Comandos remotos para encender, apagar, reiniciar y bloquear equipos |
| **Auditoría** | Registro completo de todas las acciones ejecutadas |

---

## Características Principales

### Panel de Control (Dashboard)
- Vista general de estadísticas del sistema
- Indicadores de equipos activos, alertas y usuarios
- Gráficos de actividad en tiempo real
- Acceso rápido a todas las secciones

### Monitoreo Remoto de Equipos
- Visualización de todas las salas de cómputo
- Estado en tiempo real de cada PC (activo, inactivo, en mantenimiento)
- Selección individual o masiva de equipos
- Ejecución de comandos remotos:
  - **Apagar** - Shutdown inmediato
  - **Reiniciar** - Reboot del sistema
  - **Bloquear Sesión** - Lock de la sesión actual
  - **Wake-on-LAN** - Encendido remoto

### Vigilancia de Pantallas
- Captura de pantallas en tiempo real vía WebSocket
- Historial de capturas por equipo
- Vista en cuadrícula de todas las pantallas activas
- Controles de inicio/parada de clase
- Indicadores de conexión en vivo

### Bloqueo de Sitios Web
- Lista de sitios bloqueados por categoría
- Categorías predefinidas (Redes Sociales, Entretenimiento, Juegos, etc.)
- Activación/desactivación individual
- Bloqueo masivo por categoría
- Gestión en tiempo real

### Gestión de Usuarios (Solo Administradores)
- Creación de nuevos usuarios
- Edición de credenciales existentes
- Asignación de roles (ADMIN / OPERATOR)
- Avatares personalizados con DiceBear
- Activación/desactivación de cuentas
- Eliminación de usuarios

### Sistema de Novedades e Incidentes
- Reportes de problemas desde cualquier PC
- Estados: Pendiente, En Progreso, Resuelto
- Marcado de incidentes como completados
- Historial de reportes

### Logs y Auditoría
- Registro completo de comandos ejecutados
- Filtros por estado (Pendiente, Enviado, Ejecutado, Fallido)
- Filtros por equipo específico
- Búsqueda en tiempo real
- Detalles de cada comando

### Interfaz de Usuario
- Diseño oscuro estilo cyberpunk/terminal
- Animaciones fluidas con Framer Motion
- Diseño responsivo para móviles y tablets
- Efectos de glassmorphism y neon
- Indicadores de actividad del usuario

---

## Tecnologías Utilizadas

### Frontend Core

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **React** | 18.2.0 | Framework principal |
| **React Router DOM** | 6.30.2 | Navegación SPA |
| **Framer Motion** | 12.23.24 | Animaciones |
| **Axios** | 1.5.0 | Cliente HTTP |

### UI/UX

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Tailwind CSS** | 3.x | Estilos utilitarios |
| **Lucide React** | 0.555.0 | Iconografía |
| **Material UI** | 5.14.0 | Componentes base |
| **DiceBear** | 9.2.4 | Avatares generados |

### Comunicación en Tiempo Real

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **WebSocket** | Nativo | Streaming de pantallas |
| **STOMP.js** | 7.2.1 | Protocolo de mensajería |
| **SockJS** | 1.6.1 | Fallback de WebSocket |

### 3D y Efectos

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Three.js** | 0.181.2 | Fondos 3D interactivos |
| **Postprocessing** | 6.38.0 | Efectos visuales |

---

## Estructura del Proyecto

```
EnvyGuard-Frontend/
├── public/
│   ├── index.html
│   ├── manifest.json
│   └── service-worker.js
│
├── src/
│   ├── assets/
│   │   └── icons/                 # Iconos de la aplicación
│   │
│   ├── components/
│   │   ├── common/                # Componentes reutilizables
│   │   ├── layout/                # Layouts base
│   │   ├── InstallPrompt.js       # Prompt de instalación PWA
│   │   ├── ProtectedRoute.js      # Rutas protegidas
│   │   └── UpdateNotification.js
│   │
│   ├── config/
│   │   ├── apiConfig.js           # Configuración de API y endpoints
│   │   └── routes.js              # Definición de rutas
│   │
│   ├── context/
│   │   ├── AuthContext.js         # Estado global de autenticación
│   │   └── DeviceContext.js       # Estado de dispositivos
│   │
│   ├── hooks/
│   │   ├── useAuth.js             # Hook de autenticación
│   │   ├── useCurrentTime.js      # Hook de tiempo actual
│   │   ├── useDevices.js          # Hook de dispositivos
│   │   ├── useInstallPrompt.js    # Hook para PWA
│   │   ├── useMousePosition.js    # Posición del mouse
│   │   ├── useScrambleText.js     # Efecto de texto scramble
│   │   └── useUserActivity.js     # Detección de inactividad
│   │
│   ├── pages/
│   │   ├── Home.js                # Página de login
│   │   ├── SpyWall.js             # Vista de espionaje legacy
│   │   └── Dashboard/
│   │       ├── index.js           # Layout principal del dashboard
│   │       ├── components/
│   │       │   ├── Sidebar.js         # Barra lateral de navegación
│   │       │   ├── ScrollArea.js      # Área de scroll personalizada
│   │       │   ├── Toast.js           # Notificaciones toast
│   │       │   └── ReportProblemModal.js  # Modal de reportar problemas
│   │       └── sections/
│   │           ├── OverviewSection.js          # Panel principal
│   │           ├── ComputerMonitoringSection.js # Monitoreo de PCs
│   │           ├── ScreenMonitoringSection.js   # Vigilancia de pantallas
│   │           ├── BlockingSitesSection.js      # Bloqueo de sitios
│   │           ├── CreateUsersSection.js        # Gestión de usuarios
│   │           ├── NovedadesSection.js          # Incidentes
│   │           ├── LogsAndTrafficSection.js     # Logs y auditoría
│   │           └── AppDeploymentSection.js      # Despliegue de apps
│   │
│   ├── services/
│   │   ├── api/
│   │   │   └── axiosInstance.js       # Instancia configurada de Axios
│   │   ├── AuthService.js             # Servicio de autenticación
│   │   ├── CommandService.js          # Servicio de comandos remotos
│   │   ├── ControlService.js          # Control de clase (START/STOP)
│   │   ├── DeviceService.js           # Gestión de dispositivos
│   │   ├── IncidentService.js         # Gestión de incidentes
│   │   ├── userService.js             # CRUD de usuarios
│   │   ├── WebSocketService.js        # Conexión WebSocket
│   │   └── RabbitMQService.js         # Mensajería RabbitMQ
│   │
│   ├── styles/
│   │   ├── global.css             # Estilos globales + Tailwind
│   │   └── theme.js               # Tema de la aplicación
│   │
│   ├── utils/
│   │   ├── formatters.js          # Formateadores de datos
│   │   └── helpers.js             # Funciones auxiliares
│   │
│   ├── App.js                     # Componente raíz
│   └── index.js                   # Punto de entrada
│
├── .env                           # Variables de entorno (no commitear)
├── .env.example                   # Ejemplo de variables
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── Dockerfile
└── README.md
```

---

## Requisitos Previos

Antes de instalar el proyecto, asegúrate de tener:

| Requisito | Versión Mínima | Verificar |
|-----------|----------------|-----------|
| **Node.js** | 18.x o superior | `node --version` |
| **npm** | 9.x o superior | `npm --version` |
| **Git** | 2.x | `git --version` |

### Variables de Entorno Requeridas

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Backend
REACT_APP_API_URL=https://api.envyguard.crudzaso.com

# WebSocket para pantallas
REACT_APP_WEBSOCKET_URL=wss://api.envyguard.crudzaso.com/ws

# Entorno
NODE_ENV=development
```

---

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/EnvyGuard-Riwi/EnvyGuard-Frontend.git
cd EnvyGuard-Frontend
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

```bash
# Copiar el ejemplo
cp .env.example .env

# Editar con tus valores
nano .env  # o code .env
```

### 4. Iniciar en Modo Desarrollo

```bash
npm start
```

La aplicación estará disponible en: `http://localhost:3000`

### 5. Construir para Producción

```bash
npm run build
```

Los archivos optimizados estarán en la carpeta `build/`

---

## Guía de Uso

### Inicio de Sesión

1. Accede a la URL de la aplicación
2. Ingresa tu correo electrónico y contraseña
3. Espera la animación de transición
4. Serás redirigido al Dashboard

### Navegación Principal

| Sección | Descripción | Acceso |
|---------|-------------|--------|
| **Panel Principal** | Estadísticas y resumen | Todos |
| **Monitoreo Remoto** | Control de equipos | Todos |
| **Vigilancia de Pantallas** | Ver pantallas en vivo | Todos |
| **Bloqueo de Sitios** | Gestionar restricciones | Todos |
| **Gestión de Usuarios** | Administrar cuentas | Solo ADMIN |
| **Novedades** | Incidentes reportados | Todos |
| **Logs** | Historial de comandos | Todos |

### Ejecutar Comandos Remotos

1. Ve a **Monitoreo Remoto**
2. Selecciona la sala deseada
3. Haz clic en uno o varios PCs
4. Usa la barra de acciones o el botón "Panel de Acciones"
5. Selecciona el comando a ejecutar
6. Confirma la acción

### Monitorear Pantallas

1. Ve a **Vigilancia de Pantallas**
2. Haz clic en **"INICIAR CLASE"**
3. Las pantallas comenzarán a llegar en tiempo real
4. Usa **"TERMINAR CLASE"** para detener

---

## Sistema de Autenticación

### Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **ADMIN** | Acceso completo + Gestión de usuarios |
| **OPERATOR** | Monitoreo y control básico |

### Flujo de Autenticación

```
1. Usuario envía credenciales
         |
         v
2. Backend valida y retorna JWT
         |
         v
3. Token se guarda en localStorage
         |
         v
4. Axios intercepta todas las peticiones
         |
         v
5. Token se adjunta automáticamente
         |
         v
6. Si el token expira -> Logout automático
```

### Detección de Inactividad

- El sistema detecta inactividad del usuario
- Indicador visual: Activo / Inactivo
- Tiempo configurable (por defecto: 10 segundos para testing)

---

## Conexión con el Backend

### Endpoints Principales

```javascript
// Autenticación
POST   /auth/login              // Iniciar sesión
POST   /auth/register           // Registrar usuario

// Usuarios
GET    /users                   // Listar usuarios
PUT    /users/:id               // Actualizar usuario
DELETE /users/:id               // Eliminar usuario

// Comandos
POST   /commands                // Crear comando
GET    /commands                // Listar comandos
GET    /commands/status/:status // Filtrar por estado
GET    /commands/computer/:name // Filtrar por PC

// Incidentes
GET    /api/incidents/all       // Listar incidentes
PATCH  /api/incidents/:id/complete  // Marcar completo

// Control de Clase
POST   /api/control/START       // Iniciar monitoreo
POST   /api/control/STOP        // Detener monitoreo
```

### WebSocket para Pantallas

```javascript
// URL de conexión
ws://api.envyguard.crudzaso.com/ws/screens

// Formato de mensaje recibido
{
  "pcId": "SALA1-PC01",
  "timestamp": 1702567890123,
  "image": "data:image/jpeg;base64,..."
}
```

---

## Personalización

### Colores del Tema

Los colores principales están definidos en Tailwind:

```css
/* Paleta de colores */
Primary:    cyan-500    (#06b6d4)
Success:    green-500   (#22c55e)
Warning:    yellow-500  (#eab308)
Danger:     red-500     (#ef4444)
Info:       blue-500    (#3b82f6)
Purple:     purple-500  (#a855f7)
Orange:     orange-500  (#f97316)
Background: #0a0a0a
```

### Colores por Sección

| Sección | Color | Código |
|---------|-------|--------|
| Panel Principal | Cyan | `#22d3ee` |
| Monitoreo Remoto | Azul | `#3b82f6` |
| Vigilancia de Pantallas | Púrpura | `#a855f7` |
| Bloqueo de Sitios | Rojo | `#ef4444` |
| Gestión de Usuarios | Verde | `#22c55e` |
| Novedades | Naranja | `#f97316` |
| Logs | Amarillo | `#eab308` |

---

## Scripts Disponibles

```bash
# Desarrollo
npm start           # Inicia servidor de desarrollo en puerto 3000

# Producción
npm run build       # Construye la aplicación optimizada

# Testing
npm test            # Ejecuta tests con Jest

# Otros
npm run eject       # Expone configuración (irreversible)
```

---

## Docker

### Construir Imagen

```bash
docker build -t envyguard-frontend .
```

### Ejecutar Contenedor

```bash
docker run -p 3000:3000 -e REACT_APP_API_URL=https://api.envyguard.crudzaso.com envyguard-frontend
```

### Docker Compose (ejemplo)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=https://api.envyguard.crudzaso.com
    restart: unless-stopped
```

---

## Solución de Problemas

### Error: "CORS bloqueado"

```bash
# Verificar que la URL del backend sea correcta en .env
REACT_APP_API_URL=https://api.envyguard.crudzaso.com
```

### Error: "Token inválido"

1. Cierra sesión manualmente
2. Limpia localStorage: 
   ```javascript
   localStorage.clear()
   ```
3. Inicia sesión nuevamente

### WebSocket no conecta

1. Verifica que el backend esté corriendo
2. Revisa la URL en `REACT_APP_WEBSOCKET_URL`
3. Comprueba que no haya bloqueos de firewall
4. Revisa la consola del navegador para errores

### Las pantallas no se muestran

1. Asegúrate de haber presionado "INICIAR CLASE"
2. Verifica que los agentes estén instalados en los PCs
3. Revisa la conexión WebSocket en Network > WS

### No puedo crear usuarios

1. Verifica que tu rol sea **ADMIN**
2. Los OPERATOR no tienen acceso a esta sección

---

## Métricas de Rendimiento

| Métrica | Valor Objetivo |
|---------|----------------|
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Time to Interactive | < 3.0s |
| Bundle Size (gzipped) | < 500KB |

---

## Seguridad

- Autenticación JWT
- Rutas protegidas
- Tokens con expiración
- Sanitización de inputs
- HTTPS obligatorio en producción
- Variables de entorno para secretos

---

## Roadmap Futuro

- [ ] Modo claro/oscuro configurable
- [ ] Notificaciones push
- [ ] Exportar logs a CSV/PDF
- [ ] Dashboard de analytics
- [ ] Integración con Active Directory
- [ ] App móvil nativa

---

## Equipo de Desarrollo

<table>
  <tr>
    <td align="center">
      <strong>EnvyGuard Team</strong><br/>
      <sub>RIWI - Cohorte 2025</sub>
    </td>
  </tr>
</table>

### Contribuidores

- Desarrollo Frontend
- Diseño UI/UX
- Arquitectura de Software

---

## Licencia

```
Copyright 2025 EnvyGuard - RIWI
Todos los derechos reservados.

Este software es de uso privado y su distribución
está prohibida sin autorización expresa.
```

---

<p align="center">
  <strong>EnvyGuard v1.0.0</strong><br/>
  <em>Monitoreo Inteligente para Entornos Educativos</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Made%20with-Love-red?style=flat-square" alt="Made with Love"/>
  <img src="https://img.shields.io/badge/Powered%20by-React-61DAFB?style=flat-square&logo=react" alt="Powered by React"/>
  <img src="https://img.shields.io/badge/Styled%20with-Tailwind-38B2AC?style=flat-square&logo=tailwind-css" alt="Styled with Tailwind"/>
</p>

<p align="center">
  <sub>Desarrollado con cafe y musica en Colombia</sub>
</p>
