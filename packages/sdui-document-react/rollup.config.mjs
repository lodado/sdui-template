import { defaultConfig } from 'rollup-config/rollup.config.mjs'

// Extra `./viewer` entry: read-only renderer without ProseMirror/dnd-kit.
// ES build preserves modules (shared files overwrite identically); the CJS
// entry needs an object input so it lands at viewer/index.cjs instead of
// colliding with the main index.cjs.
export default defaultConfig([
  { input: './src/viewer/index.ts', format: 'es', additionalFolderDirectiory: 'client' },
  { input: { 'viewer/index': './src/viewer/index.ts' }, format: 'cjs', additionalFolderDirectiory: 'client' },
])
