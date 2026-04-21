ARG NODE_VERSION=24.11.0
FROM node:${NODE_VERSION}-slim AS base

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

RUN apt-get update && \
    apt-get install --no-install-recommends -y dumb-init openssl procps && \
    rm -rf /var/lib/apt/lists/*

RUN  corepack enable pnpm

WORKDIR /app

FROM base AS deps

COPY --link package.json pnpm-lock.yaml ./
COPY --link prisma ./prisma

RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate


FROM base AS development

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY --link prisma tsconfig.json tsconfig.build.json package.json ./
COPY --link ./nest-cli.json ./
COPY --link ./prisma.config.ts ./
COPY src ./src

CMD ["pnpm", "run", "start:debug"]


FROM base AS production

ENV NODE_ENV=production

# 1. Crie o usuário ANTES de copiar os arquivos
RUN useradd --user-group --create-home --shell /bin/false appuser

# 2. Copie os arquivos já com o dono correto usando --chown
COPY --chown=appuser:appuser --from=build /app/package.json ./
COPY --chown=appuser:appuser --from=build /app/pnpm-lock.yaml ./
COPY --chown=appuser:appuser --from=build /app/node_modules ./node_modules
COPY --chown=appuser:appuser --from=build /app/dist ./dist
COPY --chown=appuser:appuser --from=build /app/prisma ./prisma
COPY --chown=appuser:appuser --from=build /app/prisma.config.ts ./prisma.config.ts

# 3. Force o pnpm a executar os scripts de build do Prisma e Argon2
RUN pnpm config set ignore-scripts false

# 4. Agora faça o prune com segurança
RUN pnpm prune --prod

EXPOSE 3000

# Troque para o usuário sem privilégios
USER appuser

CMD ["/bin/sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]


CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
