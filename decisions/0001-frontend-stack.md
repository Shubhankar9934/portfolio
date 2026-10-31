# 0001: Vite + React + TypeScript frontend

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: user

## Context
The portfolio needs a frontend that works as static files behind nginx now and can grow into a backend-driven app in later phases.

## Decision
Use Vite + React + TypeScript. Production build is static files, built in a Docker multi-stage build and served by nginx.

## Consequences
- Static output fits the nginx-only Phase 1 setup.
- A client-side SPA needs nginx to fall back to `index.html` for deep links.
- Interactive features (admin, auth, dashboards) in later phases fit naturally.
- A build step (Node) is required in the Docker image.

## Alternatives considered
- Astro: strong for content sites, but user preferred React for later interactivity.
- Plain HTML/CSS/JS: simplest image, but harder to extend once a backend exists.
