import React, { useState } from 'react';
import {
  Terminal,
  Play,
  Loader,
  Mail,
  BookOpen,
  Trash2,
  History,
  Package,
  Box,
  Search,
  ChevronRight,
  Zap,
  Copy,
  Check
} from 'lucide-react';

import { ScrollArea } from '../components';
import { commandService } from '../../../services';

// Catálogo de aplicaciones disponibles
const APP_CATALOG = {
  ides: {
    name: 'IDEs y Editores',
    icon: '💻',
    apps: [
      { name: 'Visual Studio Code', package: 'code', type: 'snap', description: 'Editor de código ligero' },
      { name: 'IntelliJ IDEA', package: 'intellij-idea-community', type: 'snap', description: 'IDE para Java' },
      { name: 'PyCharm', package: 'pycharm-community', type: 'snap', description: 'IDE para Python' },
      { name: 'Rider', package: 'rider', type: 'snap', description: 'IDE para .NET' },
      { name: 'WebStorm', package: 'webstorm', type: 'snap', description: 'IDE para JavaScript' },
      { name: 'PHPStorm', package: 'phpstorm', type: 'snap', description: 'IDE para PHP' },
      { name: 'Android Studio', package: 'android-studio', type: 'snap', description: 'IDE para Android' },
      { name: 'Eclipse', package: 'eclipse', type: 'snap', description: 'IDE Java clásico' },
    ]
  },
  comunicacion: {
    name: 'Comunicación',
    icon: '💬',
    apps: [
      { name: 'Slack', package: 'slack', type: 'snap', description: 'Mensajería empresarial' },
      { name: 'Discord', package: 'discord', type: 'snap', description: 'Chat para comunidades' },
      { name: 'Zoom', package: 'zoom-client', type: 'snap', description: 'Videoconferencias' },
      { name: 'Telegram', package: 'telegram-desktop', type: 'snap', description: 'Mensajería segura' },
      { name: 'Microsoft Teams', package: 'teams', type: 'snap', description: 'Colaboración Microsoft' },
    ]
  },
  desarrollo: {
    name: 'Desarrollo',
    icon: '🛠️',
    apps: [
      { name: 'Git', package: 'git', type: 'apt', description: 'Control de versiones' },
      { name: 'Docker', package: 'docker.io', type: 'apt', description: 'Contenedores' },
      { name: 'Node.js', package: 'nodejs', type: 'apt', description: 'Runtime JavaScript' },
      { name: 'NPM', package: 'npm', type: 'apt', description: 'Gestor paquetes Node' },
      { name: 'Python 3', package: 'python3', type: 'apt', description: 'Lenguaje Python' },
      { name: 'Python PIP', package: 'python3-pip', type: 'apt', description: 'Gestor paquetes Python' },
      { name: 'Java 17', package: 'openjdk-17-jdk', type: 'apt', description: 'JDK 17 LTS' },
      { name: 'Java 11', package: 'openjdk-11-jdk', type: 'apt', description: 'JDK 11 LTS' },
      { name: 'Maven', package: 'maven', type: 'apt', description: 'Build tool Java' },
      { name: 'Gradle', package: 'gradle', type: 'apt', description: 'Build tool moderno' },
      { name: '.NET SDK 8', package: 'dotnet-sdk-8.0', type: 'apt', description: 'SDK .NET 8' },
      { name: 'Go', package: 'golang-go', type: 'apt', description: 'Lenguaje Go' },
      { name: 'Rust', package: 'rustc', type: 'apt', description: 'Lenguaje Rust' },
      { name: 'PHP', package: 'php', type: 'apt', description: 'Lenguaje PHP' },
      { name: 'Composer', package: 'composer', type: 'apt', description: 'Gestor paquetes PHP' },
      { name: 'Ruby', package: 'ruby', type: 'apt', description: 'Lenguaje Ruby' },
      { name: 'GCC', package: 'gcc', type: 'apt', description: 'Compilador C' },
      { name: 'G++', package: 'g++', type: 'apt', description: 'Compilador C++' },
      { name: 'Build Essential', package: 'build-essential', type: 'apt', description: 'Herramientas compilación' },
      { name: 'CMake', package: 'cmake', type: 'apt', description: 'Sistema de build' },
    ]
  },
  databases: {
    name: 'Bases de Datos',
    icon: '🗄️',
    apps: [
      { name: 'MySQL Server', package: 'mysql-server', type: 'apt', description: 'Base de datos MySQL' },
      { name: 'PostgreSQL', package: 'postgresql', type: 'apt', description: 'Base de datos PostgreSQL' },
      { name: 'MongoDB', package: 'mongodb', type: 'apt', description: 'Base de datos NoSQL' },
      { name: 'Redis', package: 'redis-server', type: 'apt', description: 'Cache en memoria' },
      { name: 'DBeaver', package: 'dbeaver-ce', type: 'snap', description: 'Cliente DB universal' },
      { name: 'DataGrip', package: 'datagrip', type: 'snap', description: 'IDE para bases de datos' },
    ]
  },
  herramientas: {
    name: 'Herramientas API',
    icon: '🔧',
    apps: [
      { name: 'Postman', package: 'postman', type: 'snap', description: 'Testing de APIs' },
      { name: 'Insomnia', package: 'insomnia', type: 'snap', description: 'Cliente REST/GraphQL' },
      { name: 'cURL', package: 'curl', type: 'apt', description: 'Transferencia datos' },
      { name: 'HTTPie', package: 'httpie', type: 'apt', description: 'Cliente HTTP moderno' },
    ]
  },
  navegadores: {
    name: 'Navegadores',
    icon: '🌐',
    apps: [
      { name: 'Chromium', package: 'chromium', type: 'snap', description: 'Navegador open source' },
      { name: 'Firefox', package: 'firefox', type: 'snap', description: 'Navegador Mozilla' },
      { name: 'Brave', package: 'brave', type: 'snap', description: 'Navegador privado' },
      { name: 'Opera', package: 'opera', type: 'snap', description: 'Navegador Opera' },
    ]
  },
  multimedia: {
    name: 'Multimedia',
    icon: '🎬',
    apps: [
      { name: 'VLC', package: 'vlc', type: 'snap', description: 'Reproductor multimedia' },
      { name: 'OBS Studio', package: 'obs-studio', type: 'snap', description: 'Streaming/grabación' },
      { name: 'GIMP', package: 'gimp', type: 'snap', description: 'Editor de imágenes' },
      { name: 'Inkscape', package: 'inkscape', type: 'snap', description: 'Diseño vectorial' },
      { name: 'Blender', package: 'blender', type: 'snap', description: 'Modelado 3D' },
      { name: 'Spotify', package: 'spotify', type: 'snap', description: 'Música streaming' },
    ]
  },
  utilidades: {
    name: 'Utilidades Sistema',
    icon: '⚙️',
    apps: [
      { name: 'htop', package: 'htop', type: 'apt', description: 'Monitor de procesos' },
      { name: 'Neofetch', package: 'neofetch', type: 'apt', description: 'Info del sistema' },
      { name: 'Vim', package: 'vim', type: 'apt', description: 'Editor de texto' },
      { name: 'Nano', package: 'nano', type: 'apt', description: 'Editor simple' },
      { name: 'Tree', package: 'tree', type: 'apt', description: 'Visualizar directorios' },
      { name: 'Unzip', package: 'unzip', type: 'apt', description: 'Descomprimir ZIP' },
      { name: 'Wget', package: 'wget', type: 'apt', description: 'Descargar archivos' },
      { name: 'Net Tools', package: 'net-tools', type: 'apt', description: 'Herramientas de red' },
      { name: 'SSH Server', package: 'openssh-server', type: 'apt', description: 'Servidor SSH' },
    ]
  },
  servidores: {
    name: 'Servidores Web',
    icon: '🖥️',
    apps: [
      { name: 'Nginx', package: 'nginx', type: 'apt', description: 'Servidor web' },
      { name: 'Apache2', package: 'apache2', type: 'apt', description: 'Servidor HTTP' },
      { name: 'FileZilla', package: 'filezilla', type: 'apt', description: 'Cliente FTP' },
    ]
  },
  productividad: {
    name: 'Productividad',
    icon: '📝',
    apps: [
      { name: 'Notion', package: 'notion-snap', type: 'snap', description: 'Notas y docs' },
      { name: 'Draw.io', package: 'drawio', type: 'snap', description: 'Diagramas' },
      { name: 'Figma', package: 'figma-linux', type: 'snap', description: 'Diseño UI/UX' },
      { name: 'LibreOffice', package: 'libreoffice', type: 'snap', description: 'Suite ofimática' },
    ]
  },
};

const AppDeploymentSection = ({ targetPCs = [], isModal = false }) => {
  const [deploymentCode, setDeploymentCode] = useState('');
  const [appName, setAppName] = useState('');
  const [installType, setInstallType] = useState('snap'); // 'snap' o 'apt'
  const [selectedDevice, setSelectedDevice] = useState(targetPCs.length > 0 ? targetPCs[0].id : 'all');
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionOutput, setExecutionOutput] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ides');
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);
  const [savedCommands, setSavedCommands] = useState([
    { label: 'VS Code', cmd: 'code', type: 'snap' },
    { label: 'Slack', cmd: 'slack', type: 'snap' },
    { label: 'Discord', cmd: 'discord', type: 'snap' },
    { label: 'Postman', cmd: 'postman', type: 'snap' },
    { label: 'Git', cmd: 'git', type: 'apt' },
    { label: 'Docker', cmd: 'docker.io', type: 'apt' },
    { label: 'NodeJS', cmd: 'nodejs', type: 'apt' },
    { label: 'Python3', cmd: 'python3', type: 'apt' },
  ]);
  const [deploymentHistory, setDeploymentHistory] = useState([
    { id: 1, date: '2025-12-01 14:32', device: 'server-01', command: 'apt-get update && apt-get install -y docker.io', status: 'success' },
    { id: 2, date: '2025-11-30 09:15', device: 'server-02', command: 'curl -fsSL https://get.docker.com | sh', status: 'success' },
    { id: 3, date: '2025-11-29 16:48', device: 'server-03', command: 'npm install -g @angular/cli', status: 'error' },
    { id: 4, date: '2025-11-28 11:22', device: 'all', command: 'apt-get install -y git', status: 'success' },
  ]);

  // Filtrar apps por búsqueda
  const getFilteredApps = () => {
    if (!searchTerm.trim()) {
      return APP_CATALOG[selectedCategory]?.apps || [];
    }
    // Buscar en todas las categorías
    const allApps = [];
    Object.values(APP_CATALOG).forEach(category => {
      category.apps.forEach(app => {
        if (
          app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.package.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.description.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          allApps.push({ ...app, categoryName: category.name });
        }
      });
    });
    return allApps;
  };

  // Función para ejecutar instalación rápida desde el catálogo
  const handleQuickInstall = (app) => {
    setAppName(app.package);
    setInstallType(app.type);
  };

  // Función para ejecutar instalación directamente desde el botón Run
  const handleDirectInstall = async (app) => {
    if (isExecuting) return;
    
    // Actualizar UI primero
    setAppName(app.package);
    setInstallType(app.type);
    
    // Ejecutar instalación directamente
    setIsExecuting(true);
    setShowOutput(true);
    
    const primaryMethod = app.type === 'snap' ? 'SNAP' : 'APT';
    const fallbackMethod = app.type === 'snap' ? 'APT' : 'SNAP';
    
    // SIEMPRE usar todos los targetPCs cuando vienen como prop
    const targetDevices = targetPCs.length > 0 ? [...targetPCs] : devices.filter(d => d.id !== 'all');
    
    console.log('[handleDirectInstall] targetPCs recibidos:', targetPCs.length);
    console.log('[handleDirectInstall] targetDevices a usar:', targetDevices.length, targetDevices.map(d => d.id));
    
    setExecutionOutput(
      `📦 Instalando: ${app.name} (${app.package})\n` +
      `🔄 Modo: ${primaryMethod} → ${fallbackMethod}\n` +
      `🖥️ Equipos: ${targetDevices.length}\n` +
      `─────────────────────────────────\n`
    );

    try {

      if (targetDevices.length === 0) {
        setExecutionOutput(prev => prev + `❌ No hay dispositivos seleccionados\n`);
        setIsExecuting(false);
        return;
      }

      let successCount = 0;
      let errorCount = 0;
      let snapSuccessCount = 0;
      let aptSuccessCount = 0;

      for (const device of targetDevices) {
        let salaNumber = device.salaNumber;
        if (!salaNumber) {
          const salaMatch = (device.id || '').match(/s(\d+)/i);
          salaNumber = salaMatch ? parseInt(salaMatch[1]) : 1;
        }
        
        let pcId = device.dbId;
        if (!pcId) {
          setExecutionOutput(prev => prev + `❌ ${device.id}: sin dbId\n`);
          errorCount++;
          continue;
        }
        
        const deviceLabel = device.id || `PC-${pcId}`;
        
        let installed = false;
        let usedMethod = '';
        
        if (app.type === 'snap') {
          setExecutionOutput(prev => prev + `⏳ ${deviceLabel}: instalando...\n`);
          try {
            const result = await commandService.installSnap(salaNumber, pcId, app.package);
            setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `✅ ${deviceLabel} [SNAP]`));
            installed = true;
            usedMethod = 'snap';
            snapSuccessCount++;
          } catch (snapError) {
            try {
              const result = await commandService.installApp(salaNumber, pcId, app.package);
              setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `✅ ${deviceLabel} [APT] (fallback)`));
              installed = true;
              usedMethod = 'apt';
              aptSuccessCount++;
            } catch (aptError) {
              setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `❌ ${deviceLabel} [FALLÓ]`));
            }
          }
        } else {
          setExecutionOutput(prev => prev + `⏳ ${deviceLabel}: instalando...\n`);
          try {
            const result = await commandService.installApp(salaNumber, pcId, app.package);
            setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `✅ ${deviceLabel} [APT]`));
            installed = true;
            usedMethod = 'apt';
            aptSuccessCount++;
          } catch (aptError) {
            try {
              const result = await commandService.installSnap(salaNumber, pcId, app.package);
              setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `✅ ${deviceLabel} [SNAP] (fallback)`));
              installed = true;
              usedMethod = 'snap';
              snapSuccessCount++;
            } catch (snapError) {
              setExecutionOutput(prev => prev.replace(`⏳ ${deviceLabel}: instalando...`, `❌ ${deviceLabel} [FALLÓ]`));
            }
          }
        }
        
        if (installed) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      // Resumen final compacto
      setExecutionOutput(prev => prev + `─────────────────────────────────\n`);
      
      if (errorCount === 0) {
        setExecutionOutput(prev => prev + `🎉 Completado: ${successCount}/${targetDevices.length}\n`);
      } else if (successCount > 0) {
        setExecutionOutput(prev => prev + `⚠️ Parcial: ${successCount}✅ ${errorCount}❌\n`);
      } else {
        setExecutionOutput(prev => prev + `❌ Fallido: ${errorCount}/${targetDevices.length}\n`);
      }

    } catch (error) {
      setExecutionOutput(prev => prev + `❌ Error: ${error.message}\n`);
    } finally {
      setIsExecuting(false);
    }
  };

  const devices = targetPCs.length > 0 
    ? [
        ...targetPCs.map(pc => ({ id: pc.id, name: pc.id, online: true })),
      ]
    : [
        { id: 'all', name: 'Todos los dispositivos', online: true },
        { id: 'server-01', name: 'server-01 (Ubuntu 22.04)', online: true },
        { id: 'server-02', name: 'server-02 (Ubuntu 20.04)', online: true },
        { id: 'server-03', name: 'server-03 (Ubuntu 22.04)', online: false },
        { id: 'workstation-01', name: 'workstation-01 (Ubuntu 22.04)', online: true },
      ];

  const handleExecuteDeploy = async () => {
    if (!appName.trim()) {
      alert('Por favor ingresa el nombre de la aplicación');
      return;
    }

    // Guardar comando si no existe
    const commandExists = savedCommands.some(cmd => cmd.cmd === appName.trim() && cmd.type === installType);
    if (!commandExists) {
      const label = appName.substring(0, 15) + (appName.length > 15 ? '...' : '');
      setSavedCommands([...savedCommands, { label, cmd: appName.trim(), type: installType }]);
    }

    setIsExecuting(true);
    setShowOutput(true);
    
    // Header visual mejorado - ahora con fallback
    const primaryMethod = installType === 'snap' ? 'SNAP' : 'APT';
    const fallbackMethod = installType === 'snap' ? 'APT' : 'SNAP';
    
    setExecutionOutput(
      `╔══════════════════════════════════════════════════════════════╗\n` +
      `║  📦 INSTALACIÓN DE APLICACIÓN                                ║\n` +
      `╚══════════════════════════════════════════════════════════════╝\n\n` +
      `📋 Aplicación: ${appName}\n` +
      `🔄 Modo: ${primaryMethod} → ${fallbackMethod} (fallback automático)\n\n` +
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`
    );

    try {
      // Determinar los equipos objetivo
      let targetDevices = [];
      if (selectedDevice === 'all') {
        targetDevices = targetPCs.length > 0 ? targetPCs : devices.filter(d => d.id !== 'all');
      } else {
        const selectedPC = targetPCs.find(pc => pc.id === selectedDevice) || 
                          devices.find(d => d.id === selectedDevice);
        if (selectedPC) targetDevices = [selectedPC];
      }

      if (targetDevices.length === 0) {
        setExecutionOutput(prev => prev + `❌ ERROR: No hay dispositivos seleccionados\n`);
        setIsExecuting(false);
        return;
      }

      const timestamp = new Date().toLocaleTimeString('es-ES');
      setExecutionOutput(prev => prev + `[${timestamp}] 🎯 Dispositivos objetivo: ${targetDevices.length}\n\n`);

      // Contadores de resultados
      let successCount = 0;
      let errorCount = 0;
      let snapSuccessCount = 0;
      let aptSuccessCount = 0;

      // Ejecutar instalación en cada dispositivo con fallback
      for (const device of targetDevices) {
        // Debug: mostrar estructura del device
        console.log('[AppDeployment] Device data:', JSON.stringify(device, null, 2));
        
        // Extraer salaNumber del id del PC si no viene directamente
        let salaNumber = device.salaNumber;
        if (!salaNumber) {
          const salaMatch = (device.id || '').match(/s(\d+)/i);
          salaNumber = salaMatch ? parseInt(salaMatch[1]) : 1;
        }
        
        // El pcId DEBE ser el dbId de la base de datos
        let pcId = device.dbId;
        
        // Debug
        console.log('[AppDeployment] Extracted values - salaNumber:', salaNumber, 'dbId:', device.dbId, 'pcId to use:', pcId);
        
        if (!pcId) {
          console.error('[AppDeployment] ERROR: dbId is missing for device:', device.id);
          setExecutionOutput(prev => prev + `\n❌ ERROR: El PC ${device.id} no tiene dbId configurado.\n`);
          continue;
        }
        
        const deviceLabel = device.id || `PC-${pcId}`;
        
        console.log('[AppDeployment] Final values - salaNumber:', salaNumber, 'pcId:', pcId);
        
        setExecutionOutput(prev => prev + `──────────────────────────────────────────────────────────────\n`);
        setExecutionOutput(prev => prev + `📍 ${deviceLabel}\n`);
        setExecutionOutput(prev => prev + `──────────────────────────────────────────────────────────────\n`);
        
        let installed = false;
        let usedMethod = '';
        
        // Primer intento con el método seleccionado
        const time1 = new Date().toLocaleTimeString('es-ES');
        if (installType === 'snap') {
          setExecutionOutput(prev => prev + `[${time1}] 🟠 Intentando SNAP: snap install ${appName}\n`);
          try {
            const result = await commandService.installSnap(salaNumber, pcId, appName.trim());
            const msg = result?.message || 'Instalado correctamente';
            setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ✅ SNAP exitoso: ${msg}\n`);
            installed = true;
            usedMethod = 'snap';
            snapSuccessCount++;
          } catch (snapError) {
            setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ⚠️ SNAP falló - Intentando fallback con APT...\n`);
            
            // Fallback a APT
            try {
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] 🟢 Intentando APT: apt-get install -y ${appName}\n`);
              const result = await commandService.installApp(salaNumber, pcId, appName.trim());
              const msg = result?.message || 'Instalado correctamente';
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ✅ APT exitoso: ${msg}\n`);
              installed = true;
              usedMethod = 'apt';
              aptSuccessCount++;
            } catch (aptError) {
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ❌ APT también falló: ${aptError.message}\n`);
            }
          }
        } else {
          // Primero APT, luego SNAP como fallback
          setExecutionOutput(prev => prev + `[${time1}] 🟢 Intentando APT: apt-get install -y ${appName}\n`);
          try {
            const result = await commandService.installApp(salaNumber, pcId, appName.trim());
            const msg = result?.message || 'Instalado correctamente';
            setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ✅ APT exitoso: ${msg}\n`);
            installed = true;
            usedMethod = 'apt';
            aptSuccessCount++;
          } catch (aptError) {
            setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ⚠️ APT falló - Intentando fallback con SNAP...\n`);
            
            // Fallback a SNAP
            try {
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] 🟠 Intentando SNAP: snap install ${appName}\n`);
              const result = await commandService.installSnap(salaNumber, pcId, appName.trim());
              const msg = result?.message || 'Instalado correctamente';
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ✅ SNAP exitoso: ${msg}\n`);
              installed = true;
              usedMethod = 'snap';
              snapSuccessCount++;
            } catch (snapError) {
              setExecutionOutput(prev => prev + `[${new Date().toLocaleTimeString('es-ES')}] ❌ SNAP también falló: ${snapError.message}\n`);
            }
          }
        }
        
        if (installed) {
          successCount++;
        } else {
          errorCount++;
        }
        
        setExecutionOutput(prev => prev + `\n`);
      }

      // Resumen final
      const endTime = new Date().toLocaleTimeString('es-ES');
      setExecutionOutput(prev => prev + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      
      if (errorCount === 0) {
        setExecutionOutput(prev => prev + `🎉 INSTALACIÓN COMPLETADA\n`);
      } else if (successCount > 0) {
        setExecutionOutput(prev => prev + `⚠️ INSTALACIÓN PARCIAL\n`);
      } else {
        setExecutionOutput(prev => prev + `❌ INSTALACIÓN FALLIDA\n`);
      }
      
      setExecutionOutput(prev => prev + `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
      setExecutionOutput(prev => prev + `📊 Resultados:\n`);
      setExecutionOutput(prev => prev + `   ✅ Exitosos: ${successCount}\n`);
      setExecutionOutput(prev => prev + `   ❌ Fallidos: ${errorCount}\n`);
      if (snapSuccessCount > 0) {
        setExecutionOutput(prev => prev + `   🟠 Via SNAP: ${snapSuccessCount}\n`);
      }
      if (aptSuccessCount > 0) {
        setExecutionOutput(prev => prev + `   🟢 Via APT: ${aptSuccessCount}\n`);
      }
      setExecutionOutput(prev => prev + `\n⏱️ Finalizado: ${endTime}\n`);

      // Agregar al historial
      const newEntry = {
        id: deploymentHistory.length + 1,
        date: new Date().toLocaleString('es-ES'),
        device: selectedDevice === 'all' ? 'all' : selectedDevice,
        command: `${appName} (${snapSuccessCount > 0 ? 'snap:' + snapSuccessCount : ''}${aptSuccessCount > 0 ? ' apt:' + aptSuccessCount : ''})`,
        status: errorCount === 0 ? 'success' : (successCount > 0 ? 'partial' : 'error')
      };
      setDeploymentHistory([newEntry, ...deploymentHistory]);

    } catch (error) {
      setExecutionOutput(prev => prev + `\n❌ ERROR CRÍTICO: ${error.message}\n`);
    } finally {
      setIsExecuting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(deploymentCode);
  };

  const removeCommand = (index) => {
    setSavedCommands(savedCommands.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-col ${isModal ? 'h-full' : 'h-full'} ${isModal ? 'space-y-5 p-0' : 'space-y-6 p-0'}`}>
      <style>{`
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1.25rem;
          padding-right: 2.5rem;
          appearance: none;
        }
        select option {
          background: #0f0f0f;
          color: #ffffff;
          padding: 0.5rem;
          font-size: 0.875rem;
        }
        select option:checked {
          background: #0d9488;
          color: #ffffff;
        }
      `}</style>
      {!isModal && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Terminal className="text-cyan-400" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Despliegue de Apps</h2>
                <p className="text-gray-500 text-xs font-sans">
                  {targetPCs.length > 0 
                    ? `Ejecutando en ${targetPCs.length === 1 ? '1 equipo' : targetPCs.length + ' equipos'}` 
                    : 'Ejecuta comandos y scripts directamente en tus servidores Linux.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className={`flex-1 ${isModal ? 'flex flex-col gap-4 overflow-hidden' : 'grid grid-cols-1 lg:grid-cols-3 gap-4 overflow-hidden'}`}>
        
        {/* ESTRUCTURA VERTICAL PARA MODAL */}
        {isModal ? (
          <>
            {/* Info de equipos seleccionados */}
            <div className="bg-black/40 rounded-lg border border-white/5 p-3 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                    <Package size={16} className="text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm">
                      {targetPCs.length} equipo{targetPCs.length !== 1 ? 's' : ''} seleccionado{targetPCs.length !== 1 ? 's' : ''}
                    </span>
                    <p className="text-gray-500 text-xs">
                      Instalación automática: SNAP → APT (fallback)
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  {targetPCs.slice(0, 5).map((pc, idx) => (
                    <span key={idx} className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-[10px] rounded font-mono">
                      {pc.id}
                    </span>
                  ))}
                  {targetPCs.length > 5 && (
                    <span className="px-2 py-1 bg-white/5 text-gray-400 text-[10px] rounded">
                      +{targetPCs.length - 5} más
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comandos Rápidos y Salida lado a lado */}
            <div className={`grid grid-cols-2 gap-4 flex-1 min-h-[250px]`}>
              
              {/* Panel de Catálogo de Apps */}
              <div className={`bg-black/40 p-3 rounded-lg border border-white/5 overflow-hidden flex flex-col`}>
                {/* Buscador */}
                <div className="flex items-center gap-2 mb-2 flex-shrink-0">
                  <div className="relative flex-1">
                    <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar aplicación..."
                      className="w-full pl-7 pr-2 py-1.5 bg-black/60 border border-white/10 rounded text-xs text-white placeholder-gray-500 focus:border-cyan-500/50 outline-none"
                    />
                  </div>
                </div>

                {/* Categorías */}
                {!searchTerm && (
                  <div className="flex flex-wrap gap-1 mb-2 flex-shrink-0">
                    {Object.entries(APP_CATALOG).map(([key, category]) => (
                      <button
                        key={key}
                        onClick={() => setSelectedCategory(key)}
                        className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                          selectedCategory === key
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {category.icon} {category.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Lista de Apps */}
                <div className="flex-1 overflow-y-auto space-y-1" style={{ scrollbarWidth: 'thin', scrollbarColor: '#1f1f1f transparent' }}>
                  {searchTerm && (
                    <p className="text-[10px] text-gray-500 mb-1">
                      Resultados para "{searchTerm}": {getFilteredApps().length} apps
                    </p>
                  )}
                  {getFilteredApps().map((app, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 p-2 bg-black/40 hover:bg-black/60 border border-white/5 rounded-lg group transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                            app.type === 'snap' 
                              ? 'bg-orange-500/20 text-orange-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {app.type.toUpperCase()}
                          </span>
                          <span className="text-xs font-medium text-white truncate">{app.name}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 truncate mt-0.5">{app.description}</p>
                        <code className="text-[9px] text-cyan-400/70 font-mono">{app.package}</code>
                      </div>
                      <button
                        onClick={() => handleDirectInstall(app)}
                        disabled={isExecuting}
                        className="flex-shrink-0 px-3 py-1.5 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-black rounded text-xs font-bold transition-all flex items-center gap-1.5 opacity-80 group-hover:opacity-100 disabled:opacity-30"
                        title={`Instalar ${app.name} en ${targetPCs.length} equipo(s)`}
                      >
                        <Zap size={12} />
                        Instalar
                      </button>
                    </div>
                  ))}
                  {getFilteredApps().length === 0 && (
                    <p className="text-center text-gray-500 text-xs py-4">No se encontraron aplicaciones</p>
                  )}
                </div>
              </div>

              {/* Panel Derecho: Comando + Salida */}
              <div className="flex flex-col gap-3 overflow-hidden">
                
                {/* Sección COMANDO */}
                <div className="bg-black/40 rounded-lg border border-white/5 overflow-hidden flex-shrink-0">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Comando</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(appName);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      disabled={!appName}
                      className="text-[10px] text-gray-500 hover:text-cyan-400 transition-colors flex items-center gap-1 disabled:opacity-30"
                    >
                      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                      Copiar
                    </button>
                  </div>
                  <textarea
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="Escribe el nombre del paquete o selecciona del catálogo..."
                    className="w-full p-3 font-mono text-xs text-green-400 bg-[#0a0a0a] min-h-[50px] resize-none outline-none placeholder-gray-600 border-none"
                    rows={2}
                  />
                  <button
                    onClick={() => {
                      // Buscar si existe en el catálogo
                      const selectedApp = Object.values(APP_CATALOG)
                        .flatMap(cat => cat.apps)
                        .find(a => a.package === appName.trim());
                      
                      if (selectedApp) {
                        handleDirectInstall(selectedApp);
                      } else if (appName.trim()) {
                        // Si no está en el catálogo, crear un app object con el nombre
                        handleDirectInstall({
                          name: appName.trim(),
                          package: appName.trim(),
                          type: installType,
                          description: 'Paquete personalizado'
                        });
                      }
                    }}
                    disabled={!appName.trim() || isExecuting}
                    className={`w-full px-4 py-2.5 font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                      isExecuting
                        ? 'bg-yellow-600 text-black'
                        : appName.trim()
                        ? 'bg-gray-700 hover:bg-cyan-600 text-gray-300 hover:text-black'
                        : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                  >
                    {isExecuting ? (
                      <>
                        <Loader size={14} className="animate-spin" />
                        Ejecutando...
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Ejecutar
                      </>
                    )}
                  </button>
                </div>

                {/* Panel de Salida */}
                <div className={`bg-black/40 flex flex-col min-h-0 rounded-lg border border-white/5 overflow-hidden flex-1`}>
                  <div className="flex items-center justify-between p-3 pb-1.5 flex-shrink-0">
                    <h3 className="text-xs font-bold text-green-400 flex items-center gap-2">
                      <Terminal size={12} />
                      Salida
                    </h3>
                    {executionOutput && (
                      <button
                        onClick={() => setExecutionOutput('')}
                        className="text-[10px] text-gray-500 hover:text-white transition-colors"
                      >
                        Limpiar
                      </button>
                    )}
                  </div>
                  <div 
                    className={`flex-1 bg-[#0a0a0a] border border-green-500/20 rounded-lg m-3 mt-1 p-3 font-mono text-[10px] overflow-y-auto border-dashed`}
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#22c55e40 transparent',
                      maxHeight: '250px'
                    }}
                  >
                    {executionOutput ? (
                      <pre className="whitespace-pre-wrap break-words text-green-400 leading-relaxed">{executionOutput}</pre>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-600 py-8">
                        <Package size={24} className="mb-2 opacity-50" />
                        <p className="text-xs">Selecciona una app del catálogo</p>
                        <p className="text-[10px] text-gray-700">y presiona "Instalar"</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* ESTRUCTURA NO-MODAL (original) */}
            <div className={`lg:col-span-2 flex flex-col gap-3 h-full overflow-hidden`}>
              
              {/* Dispositivo y Tipo */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`bg-black/40 rounded-lg border border-white/5 p-3 space-y-1.5`}>
                  <label className={`font-bold text-gray-400 uppercase block text-xs`}>Dispositivo</label>
                  <select 
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className={`w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-cyan-500/50 outline-none transition-colors`}
                  >
                    {devices.map(device => (
                      <option key={device.id} value={device.id}>
                        {device.name} {device.online ? '● Online' : '● Offline'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`bg-black/40 rounded-lg border border-white/5 p-3 space-y-1.5`}>
                  <label className={`font-bold text-gray-400 uppercase block text-xs`}>Tipo de Instalación</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setInstallType('snap')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        installType === 'snap'
                          ? 'bg-orange-500/20 border border-orange-500/50 text-orange-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Package size={14} />
                      Snap
                    </button>
                    <button
                      onClick={() => setInstallType('apt')}
                      className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        installType === 'apt'
                          ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Box size={14} />
                      APT
                    </button>
                  </div>
                </div>
              </div>

              {/* Nombre de la App */}
              <div className={`bg-black/40 rounded-lg border border-white/5 p-3 space-y-1.5`}>
                <label className={`font-bold text-gray-400 uppercase block text-xs`}>
                  Nombre de la Aplicación
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  placeholder={installType === 'snap' ? 'Ej: code, slack, discord, postman' : 'Ej: git, nodejs, python3, docker.io'}
                  className={`w-full px-3 py-2 bg-[#0a0a0a] border border-white/10 rounded-lg text-white font-mono focus:border-cyan-500/50 outline-none placeholder-gray-600 text-sm`}
                />
                <p className="text-xs text-gray-500">
                  {installType === 'snap' 
                    ? 'Instala paquetes desde Snap Store (aplicaciones de escritorio)'
                    : 'Instala paquetes del sistema con apt-get (herramientas de desarrollo)'}
                </p>
              </div>

              <button
                onClick={handleExecuteDeploy}
                disabled={!appName.trim() || isExecuting}
                className={`w-full px-4 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm ${
                  isExecuting
                    ? 'bg-yellow-600 text-black'
                    : appName.trim()
                    ? 'bg-cyan-600 hover:bg-cyan-500 text-black shadow-[0_0_20px_rgba(6,182,212,0.2)]'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isExecuting ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Ejecutando...
                  </>
                ) : (
                  <>
                    <Play size={14} />
                    Instalar
                  </>
                )}
              </button>
            </div>

            <div className={`flex flex-col gap-3 h-full overflow-hidden lg:col-span-1`}>
              
              <div className={`bg-black/40 p-3 rounded-lg border border-white/5 space-y-1.5 flex-shrink-0 overflow-hidden flex flex-col`}>
                <h3 className={`text-xs font-bold text-cyan-400 flex items-center gap-2`}>
                  <BookOpen size={12} />
                  Apps Populares
                </h3>
                <div className={`space-y-0.5 overflow-y-auto max-h-28`}>
                  {savedCommands.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <button
                        onClick={() => {
                          setAppName(item.cmd);
                          setInstallType(item.type || 'apt');
                        }}
                        className={`flex-1 text-left px-2 py-1 bg-black/40 hover:bg-black/60 border border-white/10 rounded text-xs text-gray-400 hover:text-cyan-300 transition-colors`}
                        title={`${item.type === 'snap' ? 'snap install' : 'apt install'} ${item.cmd}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            item.type === 'snap' 
                              ? 'bg-orange-500/20 text-orange-400' 
                              : 'bg-green-500/20 text-green-400'
                          }`}>
                            {item.type?.toUpperCase() || 'APT'}
                          </span>
                          <span className={`font-bold text-gray-200 text-xs truncate`}>{item.label}</span>
                        </div>
                      </button>
                      <button
                        onClick={() => removeCommand(idx)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-500/20 hover:text-red-400 text-gray-500 rounded"
                        title="Eliminar"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col min-h-0">
                <h3 className={`text-xs font-bold text-green-400 mb-1.5`}>Salida</h3>
                <div className={`flex-1 bg-[#0a0a0a] border border-green-500/20 rounded-lg p-3 font-mono text-[10px] text-green-400 overflow-y-auto min-h-0 border-dashed`}>
                  {executionOutput ? (
                    <pre className="whitespace-pre-wrap break-words">{executionOutput}</pre>
                  ) : (
                    <p className="text-gray-600">Salida aquí...</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {!isModal && (
        <div className="bg-black/40 p-4 rounded-xl border border-white/5 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <History size={16} className="text-purple-400" />
            Historial de Despliegues
          </h3>
          <ScrollArea className="w-full rounded-lg border border-white/5 bg-[#0a0a0a] overflow-hidden">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-white/5 text-[9px] uppercase font-mono text-gray-500 sticky top-0 backdrop-blur-md z-10 tracking-wider">
                <tr>
                  <th className="p-2 font-normal">Fecha</th>
                  <th className="p-2 font-normal">Dispositivo</th>
                  <th className="p-2 font-normal">Comando</th>
                  <th className="p-2 font-normal">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deploymentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-2 text-xs text-gray-400 font-mono">{item.date}</td>
                    <td className="p-2 text-xs text-gray-300 font-mono">{item.device === 'all' ? 'Todos' : item.device}</td>
                    <td className="p-2 text-xs text-gray-300 truncate max-w-xs" title={item.command}>{item.command}</td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className={`text-xs font-bold ${item.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.status === 'success' ? 'ÉXITO' : 'ERROR'}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default AppDeploymentSection;
