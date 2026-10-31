# Decisions

One file per decision (ADR). Read this index first for context, then open only the ADRs you need.
New decisions get the next number; never rewrite history. To change a decision, add a new ADR and mark the old one `Superseded by NNNN`.
Copy [`template.md`](template.md) to start a new one.

| # | Decision | Status | Phase |
|---|----------|--------|-------|
| [0001](0001-frontend-stack.md) | Vite + React + TypeScript frontend | Accepted | 1 |
| [0002](0002-project-data-source.md) | Curated `projects.json` + build-time GitHub sync | Accepted | 1 |
| [0003](0003-showcase-scope.md) | 6-10 featured projects + link to all repos | Accepted | 1 |
| [0004](0004-backend-stack.md) | FastAPI + PostgreSQL for later phases | Accepted | 2-3 |
| [0005](0005-phase1-sections.md) | Phase 1 sections: Projects, Skills, Experience/Education + Resume | Accepted | 1 |
| [0006](0006-visual-style.md) | Clean minimal design with dark/light toggle | Accepted | 1 |
| [0007](0007-ngrok-in-compose.md) | ngrok as a docker-compose container with static domain | Accepted | 1 |
| [0008](0008-decision-tracking.md) | One ADR per decision in `decisions/` | Accepted | 0 |
| [0009](0009-repo-layout.md) | Project at `demo_rag/` root; `projects/` untouched | Accepted | 0 |
| [0010](0010-compose-and-nginx-design.md) | Compose build context at root, ngrok behind `tunnel` profile, nginx details, `/api/` stub | Accepted | 1 |
| [0011](0011-profile-content-sourcing.md) | Profile/project content from public GitHub; no invented experience, resume hidden until supplied | Accepted | 1 |
| [0012](0012-claude-code-review-hook.md) | Read-only code-reviewer subagent run by a PostToolUse hook after Claude edits code | Accepted | Tooling |
