import type { StorybookConfig } from '@storybook/react-vite'

// Base path for GitHub Pages deployment
// Use PUBLIC_URL if set, otherwise empty string (for local dev)
const basePath = process.env.PUBLIC_URL || ''

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  // Set Storybook base path (for GitHub Pages)
  ...(basePath && { base: basePath }),
  async viteFinal(config) {
    // Set Vite base path to the same value
    if (basePath) {
      config.base = basePath
    }
    return config
  },
}

export default config
