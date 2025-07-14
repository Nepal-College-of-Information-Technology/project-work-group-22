# Use official Node.js image as the base
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json* ./
RUN npm install --production=false

# Copy all files
COPY . .

# Build the Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm install --production

# Copy built app and other necessary files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/.env ./.env
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start the Next.js app
CMD ["npm", "start"]
