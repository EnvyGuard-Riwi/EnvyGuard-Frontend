const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras a React
contextBridge.exposeInMainWorld('electronAPI', {
  // Información de la app
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getAppPath: () => ipcRenderer.invoke('get-app-path'),
  
  // Listeners para eventos del main process
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', callback);
  },
  
  // Datos del sistema
  getSystemInfo: () => ({
    platform: process.platform,
    arch: process.arch,
    nodeVersion: process.versions.node,
    electronVersion: process.versions.electron
  }),
  
  // Enviar mensajes al main process
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },
  
  // Invocar funciones en main process
  invoke: (channel, args) => {
    return ipcRenderer.invoke(channel, args);
  }
});
