# 0017: Content-Security-Policy for the static site

- Status: Accepted
- Date: 2026-11-03
- Phase: 1
- Decided by: Claude (follow-up from issue #4; ADR-0010 deferred this)

## Context
ADR-0010 deferred a Content-Security-Policy because the inline theme script in `web/index.html` needs a hash or nonce. The site is static, so a nonce would need per-request server support. A hash is simpler.

## Decision
- nginx sends `Content-Security-Policy` at server level, next to the other security headers, so every location inherits it.
- `script-src` allows `'self'` and the sha256 hash of the inline theme script. Nothing else inline is allowed.
- `style-src 'self'` (no inline styles are used in the app), `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`. `img-src` allows `'self' data: https:` because the profile photo URL is set by the user.
- If the theme script changes, its hash in `docker/nginx/default.conf` must change too. The tracker entry in `tasks.md` links here.

## Consequences
- The theme script must stay byte-for-byte the same, or the page loses the first-paint theme and falls back to light mode.
- Any future inline script or style needs a new hash or a move to an external file.
- Vite dev server is not covered, because the policy is added only by nginx in Docker.

## Alternatives considered
- Nonce: needs per-request header generation; not practical for static nginx.
- Move the theme script to an external file: avoids the hash but adds a file to `web/public/`; not chosen to keep the change small.
- Meta-tag CSP in `index.html`: works, but the header is stronger and keeps the policy in one place with the other headers.
