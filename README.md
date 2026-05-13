# deco-storage

Web MVP for inventory management (decoration / event logistics).

All **host** commands below assume the **repository root** (where `docker-compose.yml` lives).

---

## Checklist — first-time install

- Install **Docker** with Compose v2 (`docker compose …`).
  - **macOS / Windows**: [Docker Desktop](https://www.docker.com/products/docker-desktop/) is the usual choice; alternatives such as [Colima](https://github.com/abiosoft/colima) or [Rancher Desktop](https://rancherdesktop.io/) also work if they provide the Docker CLI and Compose v2.
  - **Linux**: [Docker Engine](https://docs.docker.com/engine/install/) and the [Compose plugin](https://docs.docker.com/compose/install/linux/) are enough — Desktop is not required.
- `cp .env.example .env` — optionally edit `JWT_SECRET` (and URLs if not using localhost).
- `docker compose up --build` — waits for Postgres, then the **api** container runs migrations + seed automatically, then starts API (**4000**) and web (**3000**).

Open [http://localhost:3000](http://localhost:3000).

---

## Checklist — start the project (already installed)

- `docker compose up`  
Use `docker compose up --build` if dependencies or Dockerfiles changed.

Open [http://localhost:3000](http://localhost:3000).

### Stop

- `docker compose down`

---

## Stack

- **pnpm** monorepo (workspaces)
- **Next.js 15** + React + TypeScript (`apps/web`)
- **Fastify** + TypeScript (`apps/api`)
- **PostgreSQL 16**, **Prisma** (`packages/database`), **Zod** (`packages/shared`)
- Local file uploads behind `StorageService`

## Where commands run

- **Host terminal**: development machine, current directory = repository root.
- **Inside a Docker container**: `docker compose exec <service> …` is typed on the **host**; the command runs **inside** `<service>` (e.g. `api`).

---

## Persistent PostgreSQL data (Docker)

PostgreSQL files live under `**data/postgres/`** (bind mount). `docker compose stop` / `docker compose down` **keeps** that folder. `docker compose down -v` removes **named** volumes (`uploads_data`, `web_node_modules`) but **not** `data/postgres/`. To wipe the DB: stop the stack, then **host**: `rm -rf data/postgres`, then `docker compose up --build` again.

`data/postgres/` is in `.gitignore`.

---

## Docker — details

- First **api** start runs `scripts/docker-api-entrypoint.sh` **inside the container**: `prisma migrate deploy`, `pnpm db:seed`, then the dev server.
- Useful URLs: [http://localhost:3000](http://localhost:3000) · [http://localhost:4000/health](http://localhost:4000/health) · [http://localhost:3000/inventory](http://localhost:3000/inventory).
- Browser → API: `NEXT_PUBLIC_API_URL` (often `http://localhost:4000`). Next server in Docker → API: `API_URL=http://api:4000` (see `docker-compose.yml`).

**Optional — run inside the `api` container** (typed on host):

```bash
docker compose exec api sh -c "cd /app && pnpm --filter @deco/database run migrate:deploy"
docker compose exec api sh -c "cd /app && pnpm db:seed"
```

---

## Useful commands (inside the `api` container)

After `docker compose exec api sh` and `cd /app`, or as a one-liner: `docker compose exec api sh -c "cd /app && <command>"`.


| Command                                 | Purpose                                                          |
| --------------------------------------- | ---------------------------------------------------------------- |
| `pnpm install`                          | Install workspace dependencies (image rebuild usually preferred) |
| `pnpm db:generate`                      | Regenerate Prisma client                                         |
| `pnpm db:migrate:deploy`                | Apply migrations non-interactively                               |
| `pnpm db:seed`                          | Seed owner, categories, storage location                         |
| `pnpm run build`                        | Ordered build (database → shared → ui → api → web)               |
| `pnpm run lint`                         | Lint api + web                                                   |
| `pnpm --filter @deco/web run typecheck` | Typecheck web                                                    |
| `pnpm --filter @deco/api run typecheck` | Typecheck api                                                    |


---

## Repository layout

- `apps/web` — Next.js (App Router)
- `apps/api` — Fastify
- `packages/database` — Prisma, migrations, seed
- `packages/shared` — Zod, DTOs, enums
- `packages/ui` — Shared UI
- `scripts/docker-api-entrypoint.sh` — API Docker entrypoint
- `data/postgres/` — local Postgres data (Docker; not committed)

## Troubleshooting

- **P2021 / missing tables**: **host** `docker compose up -d --build api`, or run `migrate:deploy` inside `api` (see above).
- **Front cannot reach API**: check `API_URL` / `NEXT_PUBLIC_API_URL` in `docker-compose.yml` or `.env`.
- **Next cache**: **host** `rm -rf apps/web/.next`, then restart web.

## Architecture notes

Stateless API; business logic in services; Prisma in repositories; shared Zod validation; swappable file storage (S3, MinIO, etc.).