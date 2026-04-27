FROM node:20-slim

# pnpm setup
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g pnpm

WORKDIR /app

# Install deps (cache-friendly)
COPY pnpm-lock.yaml package.json ./
RUN pnpm install

# Copy source
COPY . .

# Expose Vite port
EXPOSE 5173

# Run Vite dev server
CMD ["pnpm", "run", "dev", "--host"]