# Step 1: Build the Angular application
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Clear cache and install dependencies with legacy-peer-deps
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Step 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the Nginx configuration file
COPY nginx.conf /etc/nginx/nginx.conf  

# Copy built application from build stage to Nginx html directory
COPY --from=build /app/dist/healthcare /usr/share/nginx/html

# Expose the port Nginx is running on
EXPOSE 80

# Command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
