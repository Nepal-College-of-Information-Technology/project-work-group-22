# Absolute minimal Dockerfile for extremely limited space
FROM node:20-alpine

WORKDIR /app

# Set environment
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy everything at once
COPY . .

# Install and build in one command to minimize disk usage
RUN npm install --omit=dev --legacy-peer-deps --no-cache && \
    npx prisma generate && \
    npm run build && \
    npm cache clean --force

# Expose port
EXPOSE 3000

# Start app
CMD ["npm", "start"]
