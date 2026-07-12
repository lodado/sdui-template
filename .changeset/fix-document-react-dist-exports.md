---
'@lodado/sdui-document-react': patch
---

fix(build): stop dropping `cloneBlockWithNewIds` / `HIGHLIGHT_PALETTE` from the ESM dist

The main and `./viewer` entries were built in two separate `preserveModules`
Rollup passes that both wrote to `dist/es/client`. The viewer pass tree-shook
shared modules (`editor/blockContent.mjs`, `marks/highlight/palette.mjs`) down
to only the exports it used, then overwrote the main pass's complete versions —
leaving other chunks importing exports that no longer existed. Strict-ESM
consumers (Next 16 + Turbopack) failed to build; Storybook (Vite) masked it.

Both ES entries now build in a single Rollup pass, so shared chunks keep the
union of used exports. Added a `postbuild` guard (`verify-dist-exports.mjs`)
that fails the build on any dangling ESM import so this can't reach npm again.
