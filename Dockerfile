# Use Node.js 18 Alpine as base image for smaller size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including production dependencies)
RUN npm ci

# Copy source code
COPY . .

# Build the React application
RUN npm run build

# Expose port 3001 (or whatever PORT is set via environment)
EXPOSE 3001

# Set environment to production
ENV NODE_ENV=production

# Start the Express server (which serves both API and static files)
CMD ["npm", "start"]
