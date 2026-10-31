# 0009: Repo layout at demo_rag/ root

- Status: Accepted
- Date: 2026-10-27
- Phase: 0
- Decided by: Claude (user approved the plan)

## Context
`demo_rag/` contains `demo.txt`, `CLAUDE.md`, `.claude/` and an empty `projects/` folder. The user did not say what `projects/` is for.

## Decision
Build the portfolio at the `demo_rag/` root: `web/`, `docker/`, `decisions/`, `tasks.md`, `docker-compose.yml`. Leave `projects/` untouched. Later phases add `api/` at the root. Each new folder is confirmed with the user first (standing rule in `CLAUDE.md`).

## Consequences
- Flat, conventional layout for a compose-based project.
- `demo.txt` (Graph RAG notes) is unrelated and stays as-is.
- If the user intended the site to live in `projects/`, this should be revisited with a new ADR.

## Alternatives considered
- Putting everything under `projects/portfolio/`: extra nesting, and the intent of `projects/` is unknown.
