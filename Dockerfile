# --- Stage 1: Build Stage ---
FROM node:24-slim AS builder

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true
RUN corepack enable

WORKDIR /app

# Copy dependency files first
COPY package.json pnpm-lock.yaml ./

# Install dependencies allowing esbuild compilation
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --dangerously-allow-all-builds

# Copy your source code
COPY src/ ./src

# Build the project via your esbuild bundle script
RUN pnpm run build

# Prune development dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm prune --prod


# --- Stage 2: Production Stage ---
FROM node:24-slim

WORKDIR /app

ENV NODE_ENV=production

# Copy bundled files and external production dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/server.js"]