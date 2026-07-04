const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
    '^fractional-indexing$': '<rootDir>/src/ordering/vendor/fractional-indexing.ts',
  },
}

module.exports = customJestConfig
