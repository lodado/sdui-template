const jestConfig = require('jest-config/jest.config.js')

const customJestConfig = {
  ...jestConfig,
  // 패키지별 설정을 여기에 추가
  testPathIgnorePatterns: [...(jestConfig.testPathIgnorePatterns || []), '<rootDir>/src/__tests__/utils/'],
  moduleNameMapper: {
    ...jestConfig.moduleNameMapper,
  },
}

module.exports = customJestConfig

