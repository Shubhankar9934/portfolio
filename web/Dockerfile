# Build context is the repo root (see docker-compose.yml) so nginx config can be copied in.
FROM node:22-alpine AS build
WORKDIR /app

COPY web/package.json web/package-lock.json ./
RUN npm ci

COPY web/ ./

# Refresh GitHub stats at build time; never fails the build (falls back to committed data).
ARG SYNC_GITHUB=true
RUN if [ "$SYNC_GITHUB" = "true" ]; then node scripts/sync-github.mjs || true; fi

RUN npm run build

FROM nginx:1.27-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
