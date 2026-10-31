# 0006: Clean minimal design with dark/light toggle

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: user (recommended option)

## Context
The site should look professional and load fast.

## Decision
Typography-led minimal design. Theme implemented with CSS variables; dark/light toggle persisted in `localStorage`, defaulting to the system `prefers-color-scheme`. Subtle motion only, honoring `prefers-reduced-motion`.

## Consequences
- Small CSS footprint, no heavy UI library needed.
- Both themes must be checked for contrast.

## Alternatives considered
- Terminal/developer aesthetic and colorful animated design: not selected.
