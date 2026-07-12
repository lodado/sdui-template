import { rollupConfigFunc } from 'rollup-config/rollup.config.mjs'

// The ES build uses `preserveModules`, so the main and `./viewer` entries MUST
// be produced in a single Rollup pass. Two separate ES passes writing
// preserveModules output into the same `dist/es/client` dir let the second pass
// overwrite shared chunks (e.g. blockContent.mjs, marks/highlight/palette.mjs)
// with its own tree-shaken subset — dropping exports the first pass still
// imports (`cloneBlockWithNewIds`, `HIGHLIGHT_PALETTE`) and producing dangling
// imports that break strict-ESM consumers like Next/Turbopack. One pass with
// both entries keeps the union of used exports per shared module.
//
// CJS bundles each entry (no preserveModules), so no shared-file collision —
// each CJS entry gets its own object input so it lands at the right path.
export default rollupConfigFunc([
  {
    input: { index: './src/index.ts', 'viewer/index': './src/viewer/index.ts' },
    format: 'es',
    additionalFolderDirectiory: 'client',
  },
  { input: { index: './src/index.ts' }, format: 'cjs', additionalFolderDirectiory: 'client' },
  { input: { 'viewer/index': './src/viewer/index.ts' }, format: 'cjs', additionalFolderDirectiory: 'client' },
])
