# Software Repository (API Backend)

[![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/learnsoftwaredevelopment/SoftwareRepository/blob/master/LICENSE)
![GitHub Node.js CI](https://github.com/learnsoftwaredevelopment/SoftwareRepository/workflows/Node.js%20CI/badge.svg?branch=master)
![App Container CI](https://github.com/learnsoftwaredevelopment/SoftwareRepository/workflows/App%20Container%20CI/badge.svg?branch=master)

## Introduction

The **Software Repository** REST API Service provides access to various software information such as software description and latest software version.

This Backend REST API Service is used by **Software Repository** platform.

**Software Repository** aims to be a platform to share and discover softwares. The platform also allows software developers to add their softwares to the platform and share them with the rest of the world.

## Purpose

There is a lack of a REST API for softwares and this project aims to address this problem by providing a REST API for users to query/submit software information.

It also serves as my personal project to learn web development and testing.

## My Sample code

### Testing

- The users API endpoint Testing: [users.test.js](https://github.com/learnsoftwaredevelopment/SoftwareRepository/blob/master/tests/api/users.test.js)

## Getting Started

1. Clone the **Software Repository**'s GitHub Repository.

2. Create a `.env` file in the project root directory with the structure as shown below.

Sample `.env` file

```Shell
PORT=<YOUR_PORT>
MONGODB_URI=<YOUR_MONGODB_URI>
TEST_MONGODB_URI=<YOUR_MONGODB_TEST_ENVIRONMENT_URI>
GOOGLE_APPLICATION_CREDENTIALS=<PATH_TO_GOOGLE_SERVICE ACCOUNT_JSON_FILE>
TEST_FIREBASE_CLIENT_API_KEY=<YOUR_FIREBASE_CLIENT_API_KEY>
```

**Note:** Please ensure that you key in all your desired values for the respective fields in the `.env` files.

3. Open your favourite terminal/command prompt in the **SoftwareRepository**'s working directory.

4. Install the necessary dependencies using `npm install`.

5. To launch the App in _production_ mode, run `npm start` (recommended). For developers, you can run `npm run start-dev` to launch the App in _development_ mode.

6. (Optional) To execute the included test cases, run `npm test`.

To be Added.

## Instructions to Configure, Build and Run Docker Image

**Prerequisite:** The host operating system has [Docker](https://www.docker.com/) already installed.

1. Clone the **Software Repository**'s GitHub Repository.

2. Open the `Dockerfile` and edit the environmental variables (`ENV`) and port in which container is listening to at runtime (`EXPOSE`) with your desired values.

```Dockerfile
# The container environmental variables.
# Note: The environmental variables with prefix 'TEST_' are used when running tests.
ENV PORT=8080
ENV MONGODB_URI=YOUR_MONGODB_URI
ENV GOOGLE_APPLICATION_CREDENTIALS=YOUR_GOOGLE_SERVICE_ACCOUNT_FILE_PATH
ENV TEST_MONGODB_URI=YOUR_TEST_MONGODB_URI
ENV TEST_FIREBASE_CLIENT_API_KEY=YOUR_TEST_FIREBASE_CLIENT_API_KEY

# The container listens on port 8080.
EXPOSE 8080
```

**Note:** Please ensure the values for `PORT` and `EXPOSE` are the same. An example: `ENV PORT=8080` and `EXPOSE 8080`.

3. Save the changes made to `Dockerfile`.

4. Open your favourite terminal/command prompt in the **Software Repository**'s working directory.

5. Build the docker image using `docker build -t software_repository:latest .`

6. After the docker image has been built, run the container using `docker run -p 8080:8080 software_repository:latest`

7. If all the environmental variables are configured correctly, by default, the **Software Repository** App can be accessed via http://localhost:8080

**Note:** In Step 6 and 7, the `PORT` environment variable and `EXPOSE` value are assumed to be `8080`.

## Instructions to run the multi container setup using Docker Compose

Services included in the multi container setup in `docker-compose.yml`:

- Software Repository App
- MongoDB (database)
- Mongo Express (Web based MongoDB Admin Interface for database management)

1. Open the `docker-compose.yml` and edit the environmental variables (`environment` key) and the exposed ports (`ports` key) in the format (`HOST:CONTAINER`) with your desired values.

```yml
app:
    depends_on:
      - mongo
    build: .
    ports:
      - 8080:8080
    # The app service's environmental variables.
    # Note: The environmental variables with prefix 'TEST_' are used when running tests.
    environment:
      PORT: 8080
      MONGODB_URI: mongodb://root:password@mongo:27017/softwareRepository?authSource=admin
      GOOGLE_APPLICATION_CREDENTIALS: YOUR_GOOGLE_SERVICE_ACCOUNT_FILE_PATH
      TEST_MONGODB_URI: mongodb://root:password@mongo:27017/softwareRepositoryTest?authSource=admin
      TEST_FIREBASE_CLIENT_API_KEY: YOUR_TEST_FIREBASE_CLIENT_API_KEY
    command: "npm start"
```

**Note** The environmental variables set in `docker-compose.yml` for the `app` service takes precedence over those set in the `Dockerfile`. (Read more in [Docker's documentation](https://docs.docker.com/compose/environment-variables/#the-env-file))

2. Save the changes made to `docker-compose.yml`.

3. In the **Software Repository**'s working directory, run the multi container setup using `docker-compose up --build` or `docker-compose up -d --build` (detached mode).

4. To access the **Software Repository** App, go to [http://localhost:8080](http://localhost:8080).

**Note:** Assuming `ports` key and `PORT` environmental variable are not changed in Step 1.

5. (Optional) To access the Mongo Express interface, go to [http://localhost:8081](http://localhost:8081).

## Documentation

To be Added.

## Coding Standards

The source code follows [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) as much as possible with some slight modifications to Airbnb's ESlint configuration.

## Technologies and Frameworks

A list of the technologies and frameworks used in this project

### Backend Technologies

- Node.js (Node 12)
- MongoDB
- Firebase Authentication

### General Frameworks used

- Express.js

### Testing Frameworks used

- Jest (Javascript Testing Framework)

### Others

- GitHub Actions for Continuous Integration (CI)
- Docker for containerisation (Refer to [Instructions to Configure, Build and Run Docker Image Section](#instructions-to-configure-build-and-run-docker-image) or [Instructions to run the multi container setup using Docker Compose](#instructions-to-run-the-multi-container-setup-using-docker-compose))
- ESLint (Javascript Linter)

## Recommended Development Tools

### API and REST Clients

- Visual Studio Code's REST client plugin (`.rest` files to test API endpoints can be found in the `requests` directory)
- Postman (Alternative)
