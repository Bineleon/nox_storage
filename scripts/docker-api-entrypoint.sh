#!/bin/sh
set -e
cd /app
echo "[deco-storage] Prisma migrate deploy..."
pnpm --filter @deco/database run migrate:deploy
echo "[deco-storage] Seed base (propriétaire, catégories, emplacements)..."
pnpm db:seed
echo "[deco-storage] Démarrage de l'API..."
exec pnpm --filter @deco/api dev
