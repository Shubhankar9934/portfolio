# 0004: FastAPI + PostgreSQL for later phases

- Status: Accepted
- Date: 2026-10-27
- Phase: 2-3
- Decided by: user (recommended option)

## Context
No backend is needed now, but the design must not block adding one. The user's repos are mostly Python.

## Decision
Phase 2 adds a FastAPI service (`api/`); Phase 3 adds PostgreSQL with SQLAlchemy + Alembic. Both run in docker-compose behind a `backend` profile. nginx reverse-proxies `/api/` to the API.

## Phase 1 preparations (so later phases do not need rewrites)
- nginx config reserves a commented `location /api/` block.
- Frontend accesses data only through the `ProjectsSource` interface (ADR-0002), switched by `VITE_DATA_SOURCE`.
- compose file is structured so `api` and `db` can be added as profile-gated services.

## Consequences
- Python end to end for backend and the user's existing skills.
- Two languages in the repo (TypeScript frontend, Python backend).

## Alternatives considered
- Node (Express/Fastify) + PostgreSQL: single language, but less aligned with the user's Python work.
