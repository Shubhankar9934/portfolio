# 0007: ngrok as a docker-compose container with static domain

- Status: Accepted
- Date: 2026-10-27
- Phase: 1
- Decided by: user (recommended option)

## Context
The site is exposed publicly through ngrok. On this machine the npm `ngrok` shim fails with "Exec format error", so a host install via npm is not reliable.

## Decision
Run the official `ngrok/ngrok` image as a compose service that tunnels to `web:80` using `http --url=$NGROK_DOMAIN`. `NGROK_AUTHTOKEN` and `NGROK_DOMAIN` come from an untracked `.env`; `.env.example` is committed with placeholders. The user supplies the token and a free static domain.

## Consequences
- One `docker compose up` starts site and tunnel; no host ngrok install.
- Secrets stay out of git.
- The ngrok free tier shows a browser interstitial page to first-time visitors.
- Without a token, the `web` service still runs locally on port 8080.

## Alternatives considered
- ngrok on the host: simpler compose file, but manual and affected by the broken npm shim.
