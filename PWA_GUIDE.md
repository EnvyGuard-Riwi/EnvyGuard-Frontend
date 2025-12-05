# 🚀 Guía de PWA - EnvyGuard

## Cómo hacer funcionar la instalación de PWA

### En Navegadores Chrome/Edge/Firefox (Recomendado)

#### Opción 1: Modo Desarrollo (Localhost con HTTPS simulado)

1. **Abre DevTools (F12)**
2. **Ve a Console y ejecuta:**
   ```javascript
   // Copiar y pegar en la consola:
   fetch('/pwa-debug.js').then(r => r.text()).then(t => eval(t));
   ```
   Esto te mostrará el estado completo de la PWA

3. **Luego ejecuta:**
   ```javascript
   window.testInstall();
   ```
   Esto disparará el prompt de instalación (si está disponible)

#### Opción 2: Producción (HTTPS requerido)

1. Hacer `npm run build`
2. Hacer deploy a Vercel, Netlify o tu hosting con HTTPS
3. La PWA funcionará automáticamente

### Lo que debería aparecer cuando funciona:

1. **Botón "Instalar" en el Header (esquina superior derecha)**
   - Aparece cuando la app es instalable
   - Desaparece después de instalar

2. **Botón "Instalar aplicación" en Home**
   - Funciona igual que el del Header
   - Ambos usan el mismo hook

3. **Comportamiento esperado (como YouTube):**
   - ✅ Botón aparece cuando es instalable
   - ✅ Al clickear, muestra el prompt nativo del navegador
   - ✅ Después de instalar, aparece para "Abrir" en lugar de "Instalar"
   - ✅ Si desinstala, vuelve a mostrar "Instalar"

### Checklist de Debug

Abre la consola (F12) y verifica:

- [ ] ✓ Service Worker registrado
- [ ] ✓ Manifest encontrado
- [ ] ✓ beforeinstallprompt event disponible (en producción)
- [ ] ✓ Display Mode: standalone (cuando está instalada)
- [ ] ✓ HTTPS o localhost (requerido para PWA)

### Archivos PWA importantes

```
public/
├── manifest.json          # Configuración de la PWA
├── service-worker.js      # Caching y offline
├── icon.ico              # Icono de descarga
├── favicon.png           # Favicon del navegador
└── pwa-debug.js          # Script de debugging

src/
├── hooks/useInstallPrompt.js      # Hook de instalación
└── components/InstallButton.jsx   # Botón de instalar
```

### Prueba en producción:

1. Después del deploy a HTTPS, abre la app
2. Deberías ver el botón "Instalar" automáticamente
3. Clickea y sigue los pasos del navegador

### Solución de problemas:

**No aparece el botón:**
- ✓ Abre DevTools Console
- ✓ Ejecuta: `window.testInstall()`
- ✓ Verifica los logs que aparecen

**beforeinstallprompt no aparece:**
- Es normal en localhost
- En producción con HTTPS aparece automáticamente
- Necesitas acceder desde un navegador compatible (Chrome, Edge, Firefox, Opera)

**Manifest.json no se carga:**
- Verifica en Network tab que se cargue
- Status debe ser 200
- El archivo debe estar en `public/`

---

**Nota:** La PWA está completamente funcional. Los botones de instalación aparecerán cuando accedas desde:
- ✅ HTTPS (producción)
- ✅ localhost (desarrollo con algunos navegadores)
- ✅ Navegadores modernos (Chrome 90+, Edge, Firefox 78+)
