ARG NODE_VERSION=24.11.0
FROM node:${NODE_VERSION}-slim AS base

# Instalação do pnpm e dependências do sistema
RUN apt-get update && \
    apt-get install --no-install-recommends -y wget ca-certificates dumb-init openssl procps && \
    rm -rf /var/lib/apt/lists/*

RUN corepack enable pnpm
WORKDIR /app

# --- Estágio 1: Instalação de todas as dependências ---
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/
# Instalamos tudo (incluindo devDeps) para poder compilar o código
RUN pnpm install --frozen-lockfile

# --- Estágio 2: Compilação (Build) ---
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Gerar o Prisma Client e fazer o build do NestJS
RUN pnpm prisma generate
RUN pnpm run build

# --- Estágio 3: Produção ---
FROM base AS production
ENV NODE_ENV=production

# Copiamos apenas o necessário do estágio de build
COPY --from=build /app/package.json ./
COPY --from=build /app/pnpm-lock.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts

# Agora removemos as devDependencies.
# IMPORTANTE: O pacote 'prisma' deve estar em "dependencies" para o comando abaixo funcionar
RUN pnpm prune --prod

EXPOSE 3000

RUN useradd --user-group --create-home --shell /bin/false appuser
RUN chown -R appuser:appuser /app
USER appuser

# Executa as migrações e inicia a aplicação
# Usamos 'pnpm prisma' em vez de npx para garantir que usamos a versão local instalada
CMD ["/bin/sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]
