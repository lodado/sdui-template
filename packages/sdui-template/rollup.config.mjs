import { defaultConfig, rollupConfigFunc } from 'rollup-config/rollup.config.mjs'

// Build test utilities as well
const testUtilsConfig = rollupConfigFunc([
  { input: './src/__tests__/index.ts', format: 'es', additionalFolderDirectiory: 'client' },
  { input: './src/__tests__/index.ts', format: 'cjs', additionalFolderDirectiory: 'client' },
])

const config = [...defaultConfig(), ...testUtilsConfig]
export default config
