# Estágio de Build
FROM node:22-alpine AS builder
WORKDIR /app

# Copia os arquivos de configuração
COPY package.json package-lock.json* ./

# Instala as dependências de produção e desenvolvimento
RUN npm install --production

# Copia o código-fonte
COPY . .

# Compila a aplicação
RUN npm run build

# Estágio de Produção
FROM node:22-alpine AS runner
WORKDIR /app

LABEL org.opencontainers.image.source=https://github.com/fozdoiguassu/chat-pgm
ENV NODE_ENV=production

# Adiciona um usuário não-root para executar a aplicação
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
