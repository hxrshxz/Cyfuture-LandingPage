# Stage 1: Build the React application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and install dependencies
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy the rest of the application source code
COPY . .

# Set the Gemini API key as an argument (will be passed by Docker Compose)
# This key is only used during the build process, it's not exposed in the final image.
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

ARG VITE_PINATA_JWT
ENV VITE_PINATA_JWT=$VITE_PINATA_JWT

# Build the production-ready static files
RUN yarn build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine

# Copy the built static files from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]