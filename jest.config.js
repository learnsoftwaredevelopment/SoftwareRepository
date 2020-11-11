module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/tests/api/disabledAPINotTested'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
