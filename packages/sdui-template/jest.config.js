const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  // Add per-package config here
  testPathIgnorePatterns: [...(jestConfig.testPathIgnorePatterns || []), '<rootDir>/src/__tests__/utils/'],
}

module.exports = customJestConfig
