FROM node:20-alpine AS builder

WORKDIR /app

ARG NEXT_PUBLIC_BASE_PATH=/pbg-dashboard
ENV NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar el resto del código
COPY . .

# Build de Next.js
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiar package.json
COPY package*.json ./

# Instalar dependencias de producción + TypeScript (necesario para next.config.ts)
RUN npm ci --only=production && npm install typescript

# Copiar archivos necesarios desde builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Copiar node_modules del builder (contiene todo lo necesario)
COPY --from=builder /app/node_modules ./node_modules

# Exponer puerto 3000
EXPOSE 3000

# Comando para iniciar
CMD ["npm", "start"]
