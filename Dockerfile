FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies (use package-lock for deterministic installs)
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Use a non-root user for better security
RUN addgroup -S app && adduser -S -G app app
USER app

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
