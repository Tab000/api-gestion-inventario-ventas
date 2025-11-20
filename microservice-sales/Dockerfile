FROM node:18-alpine

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./
COPY tsconfig.json ./

# Instalar dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiar código fuente
COPY src ./src

# Compilar TypeScript
RUN npm run build

# Crear directorio para la base de datos
RUN mkdir -p /app/data

# Limpiar devDependencies (opcional, para reducir tamaño)
# RUN npm prune --production

# Exponer puerto
EXPOSE 3003

# Comando para ejecutar
CMD ["node", "dist/app.js"]

