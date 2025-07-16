# Simple single-stage Dockerfile
FROM node:20-alpine

WORKDIR /app

# Accept build arguments
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG CLERK_SECRET_KEY
ARG DATABASE_URL
ARG NEXT_PUBLIC_VONAGE_APPLICATION_ID
ARG VONAGE_PRIVATE_KEY

# Set environment variables from build args
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV CLERK_SECRET_KEY=$CLERK_SECRET_KEY
ENV DATABASE_URL=$DATABASE_URL
ENV NEXT_PUBLIC_VONAGE_APPLICATION_ID=$NEXT_PUBLIC_VONAGE_APPLICATION_ID
ENV VONAGE_PRIVATE_KEY=$VONAGE_PRIVATE_KEY

# Copy package files first
COPY package.json package-lock.json* ./

# Copy prisma schema before npm install (needed for postinstall script)
COPY prisma ./prisma

# Install dependencies
RUN npm ci --legacy-peer-deps

# Copy all source code
COPY . .

# Build the application with environment variables
RUN npm run build

# Set to production for runtime
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]