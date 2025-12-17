# Use Node.js base image
FROM node:18-alpine

# Install LibreOffice and dependencies
RUN apk add --no-cache \
    libreoffice \
    libreoffice-base \
    libreoffice-writer \
    libreoffice-calc \
    libreoffice-impress \
    libreoffice-draw \
    libreoffice-math \
    ttf-dejavu \
    ttf-liberation \
    ttf-freefont \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    poppler-utils \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Create temp directory for conversions
RUN mkdir -p temp

# Start the application
CMD ["npm", "start"]