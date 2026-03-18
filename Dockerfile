# Stage 1: Build frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production server
FROM node:22-alpine AS runner
WORKDIR /app

# Install server dependencies only
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev && npm rebuild better-sqlite3

# Copy server source and built frontend
COPY server/ ./server/
COPY --from=builder /app/dist ./dist

WORKDIR /app/server

EXPOSE 4000

ENV NODE_ENV=production

CMD ["node", "index.js"]
