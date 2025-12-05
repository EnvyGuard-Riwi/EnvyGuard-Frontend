# Configuración de EnvyGuard Desktop App

## Estado Actual ✅

El proyecto ha sido configurado exitosamente como aplicación Electron. Los archivos necesarios ya están creados:

- **`public/electron.js`** - Proceso principal de Electron
- **`public/preload.js`** - API segura entre Electron y React
- **`package.json`** - Scripts y configuración actualizada
- **`builder-config.json`** - Configuración para electron-builder

## Ejecutar en Modo Desarrollo

```bash
npm run build-dev
```

Esto compilará React y abrirá la aplicación Electron localmente.

## Compilar Aplicación (Build)

Debido a limitaciones de permisos en OneDrive, se recomienda:

### Opción 1: Copiar a carpeta local (Recomendado)
```bash
# Copiar el proyecto a C:\Temp\EnvyGuard-Frontend
cp -r . C:\Temp\EnvyGuard-Frontend
cd C:\Temp\EnvyGuard-Frontend
npm run build
```

### Opción 2: Construir manualmente
```bash
# Desde el terminal en la carpeta del proyecto:
npm run react-build
npx electron-builder --config builder-config.json --win portable --publish never
```

## Archivos de Salida

Después de ejecutar `npm run build`, encontrarás:

- **`dist/EnvyGuard Setup.exe`** - Instalador NSIS
- **`dist/EnvyGuard.exe`** - Ejecutable portable

## Características de Desktop

- ✅ Ventana independiente (1400x900px, redimensionable)
- ✅ Menú de aplicación (Archivo, Editar, Ver, Ayuda)
- ✅ DevTools accesibles con Ctrl+Shift+I
- ✅ API segura mediante contextBridge (IPC)
- ✅ Compatible con Windows, macOS y Linux

## Próximos Pasos

1. Probar la aplicación en modo desarrollo: `npm run build-dev`
2. Una vez verificado, compilar para distribución: `npm run build`
3. Compartir los archivos `.exe` con los usuarios

## Notas

- Electron maneja automáticamente las actualizaciones de versión en `package.json`
- Para firmar el código en producción, se recomienda obtener un certificado digital
- Los instaladores sin firmar mostrarán advertencia de SmartScreen de Windows

