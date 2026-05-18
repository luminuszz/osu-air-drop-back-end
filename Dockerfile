ARG NODE_VERSION=24.11.0
FROM node:${NODE_VERSION}-slim AS base

RUN apt-get update && \
    apt-get install --no-install-recommends -y dumb-init openssl procps && \
    rm -rf /var/lib/apt/lists/*


RUN corepack enable pnpm

WORKDIR /app

# ========================================== #

FROM base AS deps

ENV CI="true"

COPY --link package.json ./
COPY --link pnpm-lock.yaml ./
COPY --link  pnpm-workspace.yaml ./
COPY --link prisma ./prisma

RUN pnpm approve-builds --all
RUN pnpm install --frozen-lockfile

RUN pnpm prisma generate

# ========================================== #

FROM base AS development

ENV NODE_ENV=development

COPY --from=deps /app/node_modules ./node_modules
COPY --link prisma tsconfig.json tsconfig.build.json package.json ./
COPY --link ./nest-cli.json ./
COPY --link ./prisma.config.ts ./
COPY src ./src

CMD ["pnpm", "run", "start:debug"]

# ========================================== #

FROM base AS build

ENV CI="true"

COPY --from=deps /app/node_modules ./node_modules
COPY --link prisma tsconfig.json tsconfig.build.json package.json ./
COPY --link ./nest-cli.json ./
COPY --link ./prisma.config.ts ./
COPY --link  pnpm-workspace.yaml ./
COPY src ./src

RUN pnpm run build

# ========================================== #

FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist



COPY --link tsconfig.json tsconfig.build.json package.json nest-cli.json prisma.config.ts ./
COPY --link prisma ./prisma

EXPOSE 3000

CMD ["dumb-init", "/bin/sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
