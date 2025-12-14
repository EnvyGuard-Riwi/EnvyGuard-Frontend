/**
 * Services Index
 * Exporta centralizado todos los servicios de la aplicación
 * Facilita las importaciones en los componentes
 */

export { default as AuthService } from './AuthService';
export { default as userService } from './userService';
export { default as deviceService } from './DeviceService';
export { default as incidentService, INCIDENT_STATUS, INCIDENT_SEVERITY } from './IncidentService';
export { default as controlService, CONTROL_ACTIONS } from './ControlService';
export { default as commandService, COMMAND_ACTIONS } from './CommandService';
export { default as WebSocketService } from './WebSocketService';
export { default as RabbitMQService } from './RabbitMQService';

// Exportar la instancia de axios para uso directo si es necesario
export { default as axiosInstance } from './api/axiosInstance';
