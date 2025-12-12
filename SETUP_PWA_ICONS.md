# Generador de Íconos PWA

Para que tu PWA funcione correctamente, necesitas generar íconos en los siguientes tamaños:

## Archivos necesarios en `/public`:

1. **icon-192.png** (192x192 píxeles)
2. **icon-512.png** (512x512 píxeles)

## Opciones para generar los íconos:

### Opción 1: Usar PWA Asset Generator (Recomendado)
```bash
npm install --save-dev @pwa-asset-generator/cli
npx pwa-asset-generator tu-logo.png ./public/icon
```

### Opción 2: Usar un generador online
- https://www.favicon-generator.org/
- https://appicon.co/
- https://pwabuilder.com/imageGenerator

### Opción 3: Usar ImageMagick (si lo tienes instalado)
```bash
magick convert tu-logo.png -resize 192x192 public/icon-192.png
magick convert tu-logo.png -resize 512x512 public/icon-512.png
```

### Opción 4: Crear manualmente con un editor de imágenes
1. Abre tu imagen actual en Photoshop, GIMP, Paint.NET, etc.
2. Ajusta el tamaño a 192x192 y guarda como `icon-192.png`
3. Ajusta el tamaño a 512x512 y guarda como `icon-512.png`

## Verificar que está funcionando:

1. Los íconos deben estar en: `public/icon-192.png` y `public/icon-512.png`
2. El `manifest.json` debe referenciarlos correctamente
3. Cuando corras `npm start`, verifica que los íconos carguen sin errores en DevTools

## Requisitos para que aparezca el botón de instalación:

✅ manifest.json vinculado en index.html
✅ Service Worker registrado y funcionando
✅ Íconos en los tamaños correctos (192x192 y 512x512)
✅ HTTPS activado (en producción) o localhost (desarrollo)
✅ display: "standalone" en el manifest

Una vez tengas los íconos en su lugar, el botón de "Instalar" debería aparecer automáticamente.
