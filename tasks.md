# Portfolio Website: Tasks

Tracker for the phased build. Decisions live in [`decisions/`](decisions/README.md); reference them by number (ADR-0001 etc.).
Status legend: `[ ]` todo, `[~]` in progress, `[x]` done, `[!]` blocked (reason noted).

**Last updated:** 2026-11-03 (commit `a75073f`, branch `main`; page layout restructured with shared `Section` wrapper (ADR-0016), live on GitHub Pages, and checked by the user at phone width)

**How this file is kept current** (rules also in `CLAUDE.md` → "Progress process"):
- Mark items `[x]` in the same turn the work is done; add items found along the way.
- Every non-trivial decision gets an ADR (`decisions/`) and is referenced by number on the item it affects.
- Update `Last updated` (date + commit) on every change to this file.
- Items that need the user's input are listed under the phase's "inputs still needed" block, so they stay visible.

Plan file: `C:\Users\Shubhankar\.claude\plans\deep-meandering-dove.md`

## Phase 0: Planning scaffolding
- [x] Gather requirements and clarify scope with user
- [x] Create `tasks.md`
- [x] Create `decisions/` with index README, template, and ADRs 0001-0009

## Phase 1: Static portfolio on Docker + nginx + ngrok
- [x] Scaffold Vite + React + TS app in `web/` (ADR-0001)
- [x] Theme system: CSS variables, dark/light toggle, persisted, respects system preference (ADR-0006)
- [x] Data layer: `ProjectsSource` interface + `StaticProjectsSource` reading `projects.json`, selected by `VITE_DATA_SOURCE` (ADR-0002)
- [x] Slim header/footer: name, GitHub link, theme toggle (ADR-0005)
- [x] Projects section: featured cards + "View all on GitHub" (ADR-0003)
- [x] Page layout structure: shared `Section` wrapper for all content sections, fixed section order (ADR-0016)
- [x] Skills / Tech stack section
- [x] Experience / Education timeline + resume download (shows placeholders until content supplied, ADR-0011)
- [x] `scripts/sync-github.mjs`: build-time stats sync with fallback (verified: 9/9 repos)
- [x] `web/Dockerfile` multi-stage (node build, nginx:alpine)
- [x] `docker/nginx/default.conf`: SPA fallback, gzip, caching, security headers, reserved `/api/` block (ADR-0010)
- [x] `docker-compose.yml`: `web` + `ngrok` (profile `tunnel`), `.env.example`, `.gitignore`, `.dockerignore` (ADR-0007, ADR-0010)
- [x] Verified locally: `npm run lint`, `npm run build`, `docker compose build`, site at http://localhost:8080 (200, SPA fallback, healthy, gzip, asset caching, security headers, `/api/` returns 503 stub)
- [x] Deployed to GitHub Pages (`https://shubhankar9934.github.io/portfolio/`) via `.github/workflows/pages.yml` on merge to `main`
- [ ] Verify the public ngrok URL (blocked on `NGROK_AUTHTOKEN` + static domain in `.env`)

### Phase 1 inputs still needed from user
- [ ] Review/confirm featured projects and summaries (three are inferred from repo names only, see ADR-0011)
- [ ] Decide whether `sapienplus_folk_system` should be public-facing
- [ ] Experience and education details (`web/data/profile.json`)
- [ ] Profile photo: user supplies the image; add it to `web/public/` (folder exists, empty), set `photoUrl` (placeholder in place, ADR-0013)
- [ ] X (Twitter) profile URL (ADR-0015 puts social links in the header only): set `twitterUrl` in `profile.json` to show the header icon (currently hidden)
- [ ] `resume.pdf` in `web/public/` and set `resumeUrl` in `profile.json`
- [ ] `NGROK_AUTHTOKEN` and static domain in `.env` (copy `.env.example`), then `COMPOSE_PROFILES=tunnel`

### Phase 1 follow-ups (optional)
- [ ] Check light theme visually (only the dark theme was screenshotted)
- [x] Check the layout at phone width in a browser (checked by the user, ADR-0016)
- [ ] Bump ESLint 9 -> 10 (npm reports 9.x as deprecated)
- [ ] Add a CSP (needs hash/nonce for the inline theme script, see ADR-0010)

## Tooling: Claude Code review hook (ADR-0012)
- [x] `.claude/agents/code-reviewer.md`: read-only reviewer subagent
- [x] `.claude/hooks/review-changed-file.mjs`: runs the reviewer after Claude edits a code file
- [x] `.claude/settings.json`: `PostToolUse` hook on `Edit|Write|MultiEdit`
- [x] Verified: markdown file skipped; `ThemeToggle.tsx` reviewed and verdict returned
- [ ] Watch for false positives over a few sessions and tune the reviewer prompt
- [ ] Review findings from the watcher appear in its log, not in the Claude chat: `Get-Content -Wait $env:TEMP\portfolio-review-watcher.log`
- [x] Watcher for editor saves and other changes: `review-watcher.mjs`, started by a SessionStart hook (ADR-0014)

## Testing
- [x] `web/scripts/check-docs.mjs` (`npm run test:docs`): checks ADR index and links, ADR numbers and statuses, checkbox markers, and the `Last updated` commit. Passes 10/10 on the repo; a copy with four planted errors fails 4 checks.
- [ ] Site smoke test (Docker build, `/healthz`, SPA fallback): needs Docker Desktop running. Not run in this session.
- [ ] Decide whether to add a site test runner (none exists; `npm run build` and `npm run lint` are the only checks today)

## Phase 2: Backend foundation (later, ADR-0004)
- [ ] FastAPI service in `api/` with `/api/health` and `/api/projects`
- [ ] Compose `backend` profile; nginx `/api/` stub becomes `proxy_pass http://api:8000;`
- [ ] Frontend `ApiProjectsSource` behind `VITE_DATA_SOURCE=api` (add to `createProjectsSource` in `web/src/data/source.ts`)

## Phase 3: Database (later)
- [ ] PostgreSQL service in compose
- [ ] SQLAlchemy models + Alembic migrations
- [ ] Seed from `projects.json`; serve projects from the DB

## Phase 4: Extras (later)
- [ ] Contact form endpoint
- [ ] Admin/auth for managing projects
- [ ] Scheduled GitHub sync
- [ ] Analytics
- [ ] CI/CD
