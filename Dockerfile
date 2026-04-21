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
COPY src ./src

CMD ["pnpm", "run", "start:debug"]


FROM base AS production

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --link prisma tsconfig.json tsconfig.build.json package.json ./
COPY --link ./nest-cli.json ./
COPY src ./src

ENV CI="true"

RUN pnpm run build

EXPOSE 3000

RUN chown -R appuser:appuser /app

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && node dist/main.js"]
