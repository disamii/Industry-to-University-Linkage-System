FROM node:25.8.0-slim

# Set environment variables for pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

# Install pnpm directly via npm
RUN npm install -g pnpm

WORKDIR /app

# Copy only dependency files to leverage Docker layer caching
COPY pnpm-lock.yaml package.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the source code
COPY . .

EXPOSE 3000

# Standard dev command
CMD ["pnpm", "run", "dev"]