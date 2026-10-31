# 0002: Curated projects.json + build-time GitHub sync

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: user (recommended option)

## Context
The GitHub account has about 75 public repos, many with no description and many being practice notebooks. Phase 1 has no backend.

## Decision
Featured projects are hand-curated in `web/data/projects.json` (title, summary, tags, links). A script, `scripts/sync-github.mjs`, optionally enriches entries with stars, language and last-updated from the GitHub API at build time, and falls back to the curated values when offline or rate-limited. The frontend reads data only through a `ProjectsSource` interface (`StaticProjectsSource` in Phase 1).

## Consequences
- No runtime GitHub calls from the browser, so no rate-limit issues for visitors.
- Content is editable without code changes.
- The `ProjectsSource` interface is the seam where Phase 2 adds an API-backed source and Phase 3 moves data into the database.
- Metadata can be stale until the next build.

## Alternatives considered
- Live GitHub API from the browser: always fresh, but 60 requests/hour unauthenticated and exposes all repos.
- Fully manual JSON: no sync script, but stats go stale and need manual edits.
