FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.0.8 --activate
WORKDIR /app

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml tsconfig.base.json .env.example ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
COPY packages/database/package.json packages/database/
COPY packages/ui/package.json packages/ui/
RUN pnpm install --frozen-lockfile

FROM base AS runner
ENV NODE_ENV=development
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps ./apps
COPY --from=deps /app/packages ./packages
COPY . .

RUN pnpm db:generate

WORKDIR /app/apps/api
EXPOSE 4000
CMD ["pnpm", "dev"]