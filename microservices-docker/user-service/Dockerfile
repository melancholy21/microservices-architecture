FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies before copying source code to leverage Docker cache layers
COPY package*.json ./
RUN npm install --production

# Copy over the service source files
COPY . .

# Let the network cluster reach out dynamically
CMD ["node", "src/server.js"]