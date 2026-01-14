import '@lodado/sdui-design-files/index.css'
import '@lodado/sdui-design-files/layout.css'
import '../src/globals.css'

// Define process for browser environment (Storybook)
if (typeof process === 'undefined') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(window as any).process = {
    env: {},
    platform: 'browser',
    version: '',
  }
}

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
