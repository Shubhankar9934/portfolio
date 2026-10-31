# 0010: Compose and nginx design for Phase 1

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: Claude (user approved the plan)

## Context
Implementing ADR-0007 (ngrok in compose) and ADR-0004 (backend later) raised details the plan did not fix.

## Decision
- **Build context is the repo root**, with `dockerfile: web/Dockerfile`, so the image can copy `docker/nginx/default.conf` from outside `web/`. A root `.dockerignore` keeps docs and secrets out of the context.
- **ngrok is behind a `tunnel` compose profile.** `docker compose up -d web` runs only the site, so it works with no ngrok account. Setting `COMPOSE_PROFILES=tunnel` in `.env` makes a plain `docker compose up -d` start the tunnel too. `NGROK_*` variables default to empty so compose parses without a `.env`.
- **nginx**: SPA fallback, gzip, `expires 1y` on `/assets/` (hashed filenames), `no-cache` on `index.html`, security headers at server level (locations use `expires`, not `add_header`, because `add_header` in a location drops inherited headers), `/healthz` for the container healthcheck.
- **`/api/` is reserved** and returns `503 {"error":"backend not enabled yet"}`. Phase 2 swaps the `return` for `proxy_pass http://api:8000;`.
- **No CSP yet**: the inline theme script in `index.html` would need a hash or nonce. Revisit in a later phase.
- **GitHub sync runs in the Docker build** (`SYNC_GITHUB` build arg, default true) and never fails the build; the committed `github-stats.json` is the fallback.

## Consequences
- Local use needs nothing beyond Docker; public exposure needs a token and static domain in `.env`.
- Image build does network calls to GitHub unless `--build-arg SYNC_GITHUB=false`.
- Docker Desktop must be running to build or run (it was not running at the start of Phase 1).

## Alternatives considered
- Context `./web` with the nginx config copied into `web/`: duplicates config and mixes concerns.
- ngrok always on: fails to start without a token and adds noise.
