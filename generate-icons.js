#!/usr/bin/env node

/**
 * Script para generar íconos PWA a partir de un archivo existente
 * Uso: node generate-icons.js <ruta-imagen-fuente>
 */

const fs = require('fs');
const path = require('path');

console.log('📱 Generador de Íconos PWA para EnvyGuard');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

const sourceIcon = process.argv[2];

if (!sourceIcon) {
  console.error('\n❌ Error: Debes proporcionar la ruta del archivo de imagen fuente');
  console.error('\nUso: node generate-icons.js <ruta-imagen>\n');
  console.error('Ejemplo: node generate-icons.js ./logo.png\n');
  process.exit(1);
}

if (!fs.existsSync(sourceIcon)) {
  console.error(`\n❌ Error: El archivo "${sourceIcon}" no existe\n`);
  process.exit(1);
}

console.log(`\n📷 Archivo fuente: ${sourceIcon}`);
console.log('\n⚠️  Este script requiere que tengas ImageMagick instalado.');
console.log('   En Windows: choco install imagemagick (requiere Chocolatey)');
console.log('   O descárgalo desde: https://imagemagick.org/script/download.php\n');

console.log('Instrucciones alternativas:\n');
console.log('1️⃣  Opción: PWA Asset Generator');
console.log('   npm install --save-dev @pwa-asset-generator/cli');
console.log(`   npx pwa-asset-generator ${sourceIcon} ./public/icon\n`);

console.log('2️⃣  Opción: Herramienta online');
console.log('   Ve a: https://appicon.co/ o https://favicon-generator.org/');
console.log(`   Sube: ${sourceIcon}`);
console.log('   Descarga: icon-192.png y icon-512.png\n');

console.log('3️⃣  Opción: Usar editores de imagen');
console.log('   - Abre la imagen en Photoshop, GIMP o Paint.NET');
console.log('   - Redimensiona a 192x192 → guarda como public/icon-192.png');
console.log('   - Redimensiona a 512x512 → guarda como public/icon-512.png\n');

console.log('Una vez que tengas los íconos en place:');
console.log('✅ Colócalos en la carpeta public/');
console.log('✅ Ejecuta: npm start');
console.log('✅ Abre Chrome DevTools → Application → Manifest');
console.log('✅ Verifica que los íconos carguen correctamente\n');
