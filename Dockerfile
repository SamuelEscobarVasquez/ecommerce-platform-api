# ---------- Stage 1: build ----------
FROM node:22.16.0-alpine AS builder

# Instala pnpm globalmente
RUN npm install -g pnpm@10.12.1

# Directorio de trabajo
WORKDIR /app

# Copia los archivos de definición y bloque lock, antes de copiar todo
COPY package.json pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install --frozen-lockfile

# Copia el resto del código y construye
COPY . .
RUN pnpm run build

# ---------- Stage 2: runtime ----------
FROM node:22.16.0-alpine AS runner

# Crea usuario no root para mayor seguridad
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copia sólo artefactos necesarios desde el builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Exponer el puerto que usa tu app
EXPOSE 3000

# Usa el usuario no privilegiado
USER appuser

# Comando por defecto
CMD ["node", "dist/main.js"]