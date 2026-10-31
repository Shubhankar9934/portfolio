# 0008: One ADR per decision in decisions/

- Status: Accepted
- Date: 2026-10-27
- Phase: 0
- Decided by: user (recommended option)

## Context
The user wants decisions tracked so context can be managed across sessions.

## Decision
Each decision is a separate numbered file in `decisions/`, indexed by `decisions/README.md`, using `template.md`. `tasks.md` links to ADRs by number. New decisions made during implementation get the next number. Old ADRs are superseded, not edited away.

## Consequences
- A new session reads `decisions/README.md` and `tasks.md` first and opens only the ADRs it needs.
- Slightly more files than a single log.

## Alternatives considered
- Single decisions log: fewer files but grows long.
- Per-phase subfolders: extra folders to approve, little benefit at this size.
