# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package.json and package-lock.json first (if present) for dependency installation
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the WebSocket server code
COPY . .

# Expose port 8080
EXPOSE 8080

# Run the server
CMD ["node", "server.js"]
