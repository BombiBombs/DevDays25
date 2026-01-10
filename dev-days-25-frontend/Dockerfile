# ETAPA 1: Instalar dependencias
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# ETAPA 2: Construir el proyecto
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Importante: Si usas variables de entorno en el cliente (NEXT_PUBLIC_...), ponlas aquí
RUN npm run build

# ETAPA 3: Imagen de ejecución (Producción)
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copiamos solo lo necesario para que funcione
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]