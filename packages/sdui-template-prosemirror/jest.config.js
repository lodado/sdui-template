const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
  },
}

module.exports = customJestConfig
