# OPTIONAL Docker deployment (the default, simpler path is deploy/setup-ec2.sh).
# Multi-stage build: compile the Vite app, then serve it with nginx.
# Note: building on a 1 GB instance needs swap -> run `sudo bash deploy/add-swap.sh` first.

# ---------- Stage 1: build ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

COPY . .
# VITE_* values are read from .env at build time (see .env.example)
ENV NODE_OPTIONS=--max-old-space-size=768
RUN npm run build

# ---------- Stage 2: serve ----------
FROM nginx:1.27-alpine
COPY deploy/nginx-docker.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -q --spider http://127.0.0.1/ || exit 1
