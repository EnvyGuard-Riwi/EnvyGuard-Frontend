# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Stage 2: Production
FROM node:18-alpine

WORKDIR /app

# Instalar serve para servir la aplicación
RUN npm install -g serve

# Copiar los archivos construidos desde el stage anterior
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# Cambiar propietario de los archivos
RUN chown -R nextjs:nodejs /app

USER nextjs

# Exponer el puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la aplicación
CMD ["serve", "-s", "build", "-l", "3000"]
