const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  // Add per-package config here
  testPathIgnorePatterns: [
    ...(jestConfig.testPathIgnorePatterns || []),
    '<rootDir>/src/__tests__/utils/',
    '/dist/',
    '/node_modules/',
  ],
}

module.exports = customJestConfig
