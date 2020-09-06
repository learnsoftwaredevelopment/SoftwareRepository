# Software Repository (API Backend)

[![MIT License](https://img.shields.io/badge/license-MIT-blue)](https://github.com/learnsoftwaredevelopment/SoftwareRepository/blob/master/LICENSE)
![GitHub Node.js CI](https://github.com/learnsoftwaredevelopment/SoftwareRepository/workflows/Node.js%20CI/badge.svg?branch=master)

## Introduction

The **Software Repository** REST API Service provides access to various software information such as software description and latest software version. 

This Backend REST API Service is used by **Software Repository** platform.

**Software Repository** aims to be a platform to share and discover softwares. The platform also allows software developers to add their softwares to the platform and share them with the rest of the world. 

## Purpose
There is a lack of a REST API for softwares and this project aims to address this problem by providing a REST API for users to query/submit software information.

It also serves as my personal project to learn web development and testing.

## My Sample code

### Testing
- The users API endpoint Testing: [users.test.js](https://github.com/learnsoftwaredevelopment/SoftwareRepository/blob/master/tests/api/users/users.test.js)

## Getting Started
1) Create a `.env` file in the project root directory with the structure as shown below.

Sample `.env` file
```
PORT=<YOUR_PORT>
MONGODB_URI=<YOUR_MONGODB_URI>
TEST_MONGODB_URI=<YOUR_MONGODB_TEST_ENVIRONMENT_URI>
BCRYPT_SALT_ROUNDS=<BCRYPT_SALT_ROUNDS>
```
**Note:** Please ensure that you key in all the values for the respective fields in the `.env` files.

2) Install the necessary dependencies using `npm install`.

3) To launch the App in *production* mode, run `npm start` (recommended). For developers, you can run `npm run start-dev` to launch the App in *development* mode.

4) (Optional) To execute the included test cases, run `npm test`.

To be Added.

## Documentation
To be Added.

## Technologies and Frameworks
A list of the technologies and frameworks used in this project

### Backend Technologies
- Node.js (Node 12)
- MongoDB

### General Frameworks used
- Express.js

### Testing Frameworks used
- Jest (Javascript Testing Framework)

## Recommended Development Tools
### API and REST Clients
- Visual Studio Code's REST client plugin (`.rest` files to test API endpoints can be found in the `requests` directory)
- Postman (Alternative)
