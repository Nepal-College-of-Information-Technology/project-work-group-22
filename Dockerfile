# Ultra-simplified Dockerfile for limited space
FROM node:20-alpine

WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma

# Install only production dependencies first, then add dev deps for build
RUN npm install --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Install dev dependencies only for build
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Generate Prisma client
RUN npx prisma generate

# Copy source
COPY . .

# Build app and clean up immediately
RUN npm run build && \
    rm -rf node_modules && \
    npm install --omit=dev --legacy-peer-deps && \
    npm cache clean --force

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
