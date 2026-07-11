import '@lodado/sdui-design-files/index.css'
import '@lodado/sdui-design-files/layout.css'
// globals.css pulls in Tailwind Preflight (@layer base). The document styles live
// in @layer sdui-doc.* — later-declared layers win, so the document CSS must be
// imported AFTER Tailwind or Preflight resets flatten headings/lists/margins.
import '../src/globals.css'
import '@lodado/sdui-document-react/styles/index.css'

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
