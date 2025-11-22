# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json dan install dependencies
COPY package*.json ./
RUN npm install

# Copy semua source code
COPY . .

# Jalankan aplikasi (ganti sesuai entry point-mu, misalnya: index.js / app.js)
CMD ["node", "index.js"]

# Aplikasi jalan di port 5002
EXPOSE 5002
