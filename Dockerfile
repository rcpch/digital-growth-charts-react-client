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

# Install app dependencies
RUN npm install

# Copy the rest of the application files
COPY . ./

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]