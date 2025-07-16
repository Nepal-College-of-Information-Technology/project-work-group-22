# Ultra-simplified Dockerfile for limited space
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install dependencies and clean cache in one step
RUN npm install --production=false --legacy-peer-deps && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build app and clean up
RUN npm run build && \
    npm prune --production && \
    npm cache clean --force

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
