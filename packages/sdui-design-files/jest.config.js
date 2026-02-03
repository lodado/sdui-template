const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  // Add per-package config here
}

module.exports = customJestConfig
