ARG NODE_VERSION=24.11.0
FROM node:${NODE_VERSION}-slim AS base

RUN wget -qO- https://get.pnpm.io/install.sh | ENV="$HOME/.bashrc" SHELL="$(which bash)" bash -

RUN  corepack enable pnpm

WORKDIR /app

FROM base AS deps

COPY --link package.json pnpm-lock.yaml ./
COPY --link prisma ./prisma

RUN pnpm install --frozen-lockfile


FROM base AS development

COPY --from=deps /app/node_modules ./node_modules
COPY --link prisma tsconfig.json tsconfig.build.json package.json ./
COPY --link ./nest-cli.json ./
COPY src ./src

RUN pnpm prisma generate

CMD ["pnpm", "run", "start:debug"]
