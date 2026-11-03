# 0013: Profile photo with placeholder until supplied

- Status: Accepted
- Date: 2026-11-03
- Phase: 1
- Decided by: user (requested "write with placeholder")

## Context
The user wants their photo shown as a professional portrait on the site, but the photo was not yet supplied. Images must be served from the static build, and `web/public/` does not exist yet. Creating that folder needs the user's approval under `CLAUDE.md`.

## Decision
- `photoUrl` in `web/data/profile.json` (nullable, default `null`), typed in `web/src/data/types.ts`.
- `web/src/components/ProfilePhoto.tsx` renders a circular photo in the header next to the name. When `photoUrl` is null it renders a neutral silhouette placeholder. Both are decorative (`alt=""` and `aria-hidden`), because the name is already shown beside them.
- Styles live in `web/src/index.css` using existing theme tokens, so the photo works in light and dark themes.
- The photo file itself is not added yet. Once supplied, it goes in the static folder (for example `web/public/profile.jpg`, after the user approves creating `web/public/`) and `photoUrl` is set to its path.

## Consequences
- Easier: the layout is final, and adding the photo later is a one-line data change.
- Harder: until a photo is set, the header shows a generic silhouette.
- Rules out: nothing. The photo is optional and personal data stays in the JSON, not in components.

## Alternatives considered
- **Hard-coded `<img>` in the header:** would need a component edit for every change of photo. Rejected.
- **Hero section with a large photo:** the site has no hero section (ADR-0005), so this would add a new layout. Rejected for now.
