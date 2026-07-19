# @lodado/sdui-design-files

## 1.1.0

### Minor Changes

- 2e2ad96: Add a token-driven motion system and micro-interactions across the component library.

  - **sdui-design-files:** new `motion.css` with duration/easing tokens, `sdui-*` keyframes, and a `prefers-reduced-motion` guard that zeroes durations system-wide.
  - **sdui-template-component:** new `MOTION` class fragments; real enter/exit motion for tooltip, dropdown, popover, and dialog (replacing dead `tailwindcss-animate` classes that never ran); press feedback on buttons; spring check-pop on checkbox; spring toggle thumb; focus/error transitions on textfield; opt-in interactive card lift/press; token-driven hover on list and tag; fade-in form error messages.

## 1.0.2

### Patch Changes

- Fix package export paths to match Rollup build output. Align ESM `preserveModulesRoot` with `src`, separate test CJS output from main entry, and correct publishConfig subpath mappings.

## 1.0.1

### Patch Changes

- boilerplate init

## 1.0.1

### Patch Changes

- boilerplate init
