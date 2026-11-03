# 0015: Social links appear once, in the header

- Status: Accepted
- Date: 2026-11-03
- Phase: 1
- Decided by: user (observed duplicates, requested one place)

## Context
GitHub and LinkedIn links appeared in both the header and the footer. The X (Twitter) icon was also added to the header.

## Decision
- Social links (GitHub, LinkedIn, X) live only in the header.
- The footer shows only the copyright line.

## Consequences
- Easier: one place to find and maintain social links.
- Harder: the footer no longer offers links, so a visitor at the bottom must scroll up to reach them.

## Alternatives considered
- **Keep both:** duplicates links and looks cluttered. Rejected.
- **Move all links to the footer:** the header would lose its social icons. Rejected, since the header is where the user placed them.
