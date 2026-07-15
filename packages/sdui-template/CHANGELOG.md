# @lodado/sdui-template

## 1.0.7

### Patch Changes

- c682664: fix(sdui-template): move store merge out of render to stop setState-in-render warning

  `SduiLayoutRenderer` ran `updateLayout`/`mergeLayout` inside `useMemo` (the render
  phase). When the `document` prop changed after mount, `mergeLayout` synchronously
  notified already-subscribed child nodes mid-render, producing React's dev warning
  "Cannot update a component while rendering a different component" and risking tearing.

  The store is now created and seeded once during the first render (no subscribers exist
  yet, so the initial `updateLayout` notifies nobody and SSR/first-paint content is
  preserved), and every subsequent `document` change merges in a commit-phase
  `useLayoutEffect` (`useEffect` on the server). Public API and render output are
  unchanged.

## 1.0.5

### Patch Changes

- Fix the published ESM package entry by preserving denormalization utility exports during Rollup builds.

## 1.0.4

### Patch Changes

- Fix package export paths to match Rollup build output. Align ESM `preserveModulesRoot` with `src`, separate test CJS output from main entry, and correct publishConfig subpath mappings.

## 1.0.3

### Patch Changes

- f37c102: Fix ESM build: split SduiLayoutRendererInner into separate file so SduiLayoutRenderer is the only export from SduiLayoutRenderer.mjs, fixing "Export SduiLayoutRenderer doesn't exist" in consumer bundlers.

## 1.0.2

### Patch Changes

- efef1f5: Fix package tree-shaking: set sideEffects for SduiLayoutRenderer and SduiLayoutContext so re-exports are not removed by bundlers.

## 1.0.1

### Patch Changes

- boilerplate init
