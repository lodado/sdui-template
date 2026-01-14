import type { StorybookConfig } from '@storybook/react-vite'

// GitHub Pages 배포를 위한 base 경로 설정
// 환경 변수 PUBLIC_URL이 있으면 사용, 없으면 빈 문자열 (로컬 개발용)
const basePath = process.env.PUBLIC_URL || ''

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Storybook의 base 경로 설정 (GitHub Pages용)
  ...(basePath && { base: basePath }),
  async viteFinal(config) {
    // Vite의 base 경로도 동일하게 설정
    if (basePath) {
      config.base = basePath
    }
    return config
  },
}

export default config
