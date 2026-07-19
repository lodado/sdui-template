# @lodado/sdui-template-component

## 1.1.0

### Minor Changes

- 2e2ad96: Add a token-driven motion system and micro-interactions across the component library.

  - **sdui-design-files:** new `motion.css` with duration/easing tokens, `sdui-*` keyframes, and a `prefers-reduced-motion` guard that zeroes durations system-wide.
  - **sdui-template-component:** new `MOTION` class fragments; real enter/exit motion for tooltip, dropdown, popover, and dialog (replacing dead `tailwindcss-animate` classes that never ran); press feedback on buttons; spring check-pop on checkbox; spring toggle thumb; focus/error transitions on textfield; opt-in interactive card lift/press; token-driven hover on list and tag; fade-in form error messages.

## 1.0.7

### Patch Changes

- Updated dependencies [c682664]
  - @lodado/sdui-template@1.0.7

## 1.0.5

### Patch Changes

- Updated dependencies
  - @lodado/sdui-template@1.0.5

## 1.0.4

### Patch Changes

- Fix package export paths to match Rollup build output. Align ESM `preserveModulesRoot` with `src`, separate test CJS output from main entry, and correct publishConfig subpath mappings.
- Updated dependencies
  - @lodado/sdui-template@1.0.4

## 1.0.3

### Patch Changes

- Updated dependencies [f37c102]
  - @lodado/sdui-template@1.0.3

## 1.0.2

### Patch Changes

- Updated dependencies [efef1f5]
  - @lodado/sdui-template@1.0.2

## 1.0.1

### Patch Changes

- boilerplate init
- Updated dependencies
  - @lodado/sdui-template@1.0.1
