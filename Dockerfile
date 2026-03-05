FROM node:18-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Install production deps. Some native modules may require build tools
# so install minimal build toolchain, run install, then remove build deps.
COPY package*.json ./
RUN apt-get update \
	&& apt-get install -y --no-install-recommends python3 g++ make ca-certificates \
	&& npm ci --only=production \
	&& apt-get remove -y python3 g++ make \
	&& apt-get autoremove -y \
	&& rm -rf /var/lib/apt/lists/*

# Copy source
COPY . .

# Use a non-root user for better security
RUN groupadd --system app && useradd --system --create-home --gid app app
USER app

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "start"]
