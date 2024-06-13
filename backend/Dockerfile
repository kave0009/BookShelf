# Use the official Node.js image
FROM node:14

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the application code
COPY . .

# Install dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 5001

# Start the application
CMD ["node", "index.js"]

