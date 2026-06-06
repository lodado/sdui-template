# @lodado/sdui-template

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
