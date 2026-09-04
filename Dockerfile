# Use the latest Node.js LTS version as the base image
FROM node:24-alpine AS base

# Set working directory
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH
ENV DOCKER=true

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Copy semantic-ui config needed by the postinstall script
COPY src/semantic-ui ./src/semantic-ui

# Install the exact locked dependencies
RUN npm ci

# Copy the rest of the application files
COPY . ./

# The container is for local development, but it should not need root.
RUN chown -R node:node /app
USER node

# Expose the port the app runs on
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://127.0.0.1:3000/ || exit 1

# Start the application on the container interface
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
