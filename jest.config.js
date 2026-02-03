const jestConfig = require('./configs/jest-config/jest.config')

const customJestConfig = {
  ...jestConfig,
  // Add per-package config here
}

module.exports = customJestConfig
