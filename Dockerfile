# SoftwareRepository's Dockerfile
# With comments to aid in my learning of docker.

# To use official nodejs base docker image.
FROM node:12

# The working directory where any subsequent instructions in the Dockerfile will be executed on.
WORKDIR /app

# I want to install dependencies first so they can be cache.
# Hence, I copy the package.json file first to the work directory for installing the dependencies in the subsequent command (npm install).
COPY package.json .

# Run npm install to install the dependencies specified in package.json
RUN npm install

# After the dependencies are installed, I copy over the source code of the web application to the current working directory.
# Note: In this case, I add .dockerignore file (similar to .gitignore) and add node_modules to the .dockerignore file so that my local node_modules directory will not be copied to the container's working directory.
COPY . .

# The container environmental variables.
ENV PORT=8080
ENV MONGODB_URI=mongodb://root:password@mongo:27017/softwareRepository?authSource=admin
ENV BCRYPT_SALT_ROUNDS=YOUR_BCRYPT_SALT_ROUNDS
ENV TEST_MONGODB_URI=mongodb://root:password@mongo:27017/softwareRepositoryTest?authSource=admin
ENV JWT_SECRET=YOUR_JWT_SECRET

# The container listens on port 8080.
EXPOSE 8080

# Should only have one cmd in a Dockerfile. Tells container how to run the application.
# In this case, the command is npm start.
# An exec form (Array of strings). It does not start up a shell session unlike run.
CMD ["npm", "start"]