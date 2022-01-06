# SoftwareRepository's Dockerfile
# With comments to aid in my learning of docker.

# To use official nodejs base docker image.
FROM node:lts

# The working directory where any subsequent instructions in the Dockerfile will be executed on.
WORKDIR /app

# I want to install dependencies first so they can be cache.
# Hence, I copy the package.json file first to the work directory for installing the dependencies in the subsequent command (npm install).
COPY package.json .

# Run npm install to install the dependencies specified in package.json
RUN npm install --legacy-peer-deps

# After the dependencies are installed, I copy over the source code of the web application to the current working directory.
# Note: In this case, I add .dockerignore file (similar to .gitignore) and add node_modules to the .dockerignore file so that my local node_modules directory will not be copied to the container's working directory.
COPY . .

# The container environmental variables.
# Note: The environmental variables with prefix 'TEST_' are used when running tests.
ENV PORT=8080
ENV MONGODB_URI=mongodb://root:password@mongo:27017/softwareRepository?authSource=admin
ENV TEST_MONGODB_URI=mongodb://root:password@mongo:27017/softwareRepositoryTest?authSource=admin
ENV FIREBASE_CLIENT_API_KEY=YOUR_FIREBASE_CLIENT_API_KEY
# Your firebase service account information
ENV FIREBASE_ADMIN_SA_TYPE=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_PROJECT_ID=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_PRIVATE_KEY_ID=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_PRIVATE_KEY=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_CLIENT_EMAIL=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_CLIENT_ID=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_AUTH_URI=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_TOKEN_URI=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_AUTH_PROVIDER_X509_CERT_URL=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT
ENV FIREBASE_ADMIN_SA_CLIENT_X509_CERT_URL=REFER_TO_YOUR_FIREBASE_SERVICE_ACCOUNT

# The container listens on port 8080.
EXPOSE 8080

# Should only have one cmd in a Dockerfile. Tells container how to run the application.
# In this case, the command is npm start.
# An exec form (Array of strings). It does not start up a shell session unlike run.
CMD ["npm", "start"]