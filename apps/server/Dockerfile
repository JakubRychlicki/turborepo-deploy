# 1. Base
FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Builder – pruning
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo@^2

COPY . .
RUN turbo prune server --docker

# 3. Installer – deps + build
FROM base AS installer
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN npm install -g turbo@^2

WORKDIR /app

# kopiujemy package.json, lockfile ORAZ pnpm-workspace.yaml z pruned workspace
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./
COPY --from=builder /app/out/pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

# kopiujemy pełne źródła (serwer + zależności)
COPY --from=builder /app/out/full/ .

# kopiujemy dodatkowe pliki konfiguracyjne
COPY --from=builder /app/turbo.json ./

# build
RUN turbo run build --filter=server...

# 4. Runner – minimalny obraz
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# kopiujemy node_modules zainstalowane w installer
COPY --from=installer /app/node_modules ./node_modules

# kopiujemy WSZYSTKIE pakiety monorepo z ich package.json
COPY --from=installer /app/packages ./packages

# kopiujemy WSZYSTKIE apps z ich package.json
COPY --from=installer /app/apps ./apps

# kopiujemy root package.json dla ESM resolution
COPY --from=installer /app/package.json ./package.json

# kopiujemy pnpm-workspace.yaml dla poprawnego rozpoznania workspace'ów
COPY --from=installer /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

COPY apps/server/entrypoint.sh ./apps/server/entrypoint.sh
RUN chmod +x ./apps/server/entrypoint.sh

CMD ["/app/apps/server/entrypoint.sh"]