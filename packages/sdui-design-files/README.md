# @lodado/sdui-design-files

**Design tokens and CSS variables for the SDUI template — extracted from the Atlassian Design System (Jira).**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-design-files.svg)](https://www.npmjs.com/package/@lodado/sdui-design-files)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)

[![Atlassian DS](https://img.shields.io/badge/Source-Atlassian%20DS-0052CC?logo=atlassian&logoColor=white)](https://atlassian.design/)
[![CSS Variables](https://img.shields.io/badge/Tokens-CSS%20Variables-1572B6?logo=css3&logoColor=white)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-design-files)
[![Figma](https://img.shields.io/badge/Design-Figma-F24E1E?logo=figma&logoColor=white)](https://www.figma.com/)

[Quick start](#quick-start) · [CSS variables](#css-variables) · [TypeScript tokens](#typescript-tokens) · [Color scales](#color-scales) · [Development](#development)

---

This package ships the visual foundation for SDUI components: CSS custom properties, layout tokens, and generated TypeScript token maps. Import once, use everywhere via `var(--token-name)`.

```
Figma / ADS source → design tokens → CSS variables + TS exports
```

### End-to-end example

| **① import CSS** | →   | **② use variables** | →   | **③ consistent UI** |
| ---------------- | --- | ------------------- | --- | ------------------- |

```tsx
// app/layout.tsx
import '@lodado/sdui-design-files/index.css'
```

```css
.my-card {
  background: var(--color-background-neutral-default);
  color: var(--color-text-default);
  border: 1px solid var(--neutral-opaque-neutral300);
  border-radius: var(--radius-medium);
}
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Installation](#installation)
- [Quick start](#quick-start)
- [CSS variables](#css-variables)
- [TypeScript tokens](#typescript-tokens)
- [Color scales](#color-scales)
- [Development](#development)

---

## Why this exists

SDUI components need a shared visual language. Hard-coding colors in each component creates drift between Storybook, SSR tests, and production apps. This package centralizes:

- Semantic and primitive color tokens
- Layout spacing and radius tokens
- Vanilla Extract theme exports for type-safe styling

## Installation

```bash
pnpm add @lodado/sdui-design-files
```

---

## Quick start

### CSS import (recommended)

```tsx
import '@lodado/sdui-design-files/index.css'
// or granular:
import '@lodado/sdui-design-files/colors.css'
import '@lodado/sdui-design-files/layout.css'
```

### Use in stylesheets

```css
.button-primary {
  background-color: var(--blue-blue700);
  color: var(--color-text-inverse);
}
```

---

## CSS variables

| Export path                            | Contents                         |
| -------------------------------------- | -------------------------------- |
| `@lodado/sdui-design-files/index.css`  | Full token set (colors + layout) |
| `@lodado/sdui-design-files/colors.css` | Color tokens only                |
| `@lodado/sdui-design-files/layout.css` | Spacing, radius, layout tokens   |

Tokens follow Atlassian Design System naming:

- `--blue-blue500`, `--red-red600` — primitive scales
- `--neutral-opaque-neutral300` — neutral grays
- `--color-text-default`, `--color-background-input-default` — semantic aliases

---

## TypeScript tokens

For programmatic access (Vanilla Extract, runtime theming):

```ts
import { tokens } from '@lodado/sdui-design-files/tokens'
import { theme } from '@lodado/sdui-design-files/theme'
```

| Export     | Description                    |
| ---------- | ------------------------------ |
| `./tokens` | Generated token object         |
| `./theme`  | Vanilla Extract theme contract |

---

## Color scales

### Gray (neutral)

| Token               | Hex       | ADS reference                  |
| ------------------- | --------- | ------------------------------ |
| `--color-gray-0`    | `#ffffff` | `--neutral-opaque-neutral0`    |
| `--color-gray-100`  | `#f8f8f8` | `--neutral-opaque-neutral100`  |
| `--color-gray-200`  | `#f0f1f2` | `--neutral-opaque-neutral200`  |
| `--color-gray-300`  | `#dddee1` | `--neutral-opaque-neutral300`  |
| `--color-gray-500`  | `#8c8f97` | `--neutral-opaque-neutral500`  |
| `--color-gray-700`  | `#6b6e76` | `--neutral-opaque-neutral700`  |
| `--color-gray-900`  | `#3b3d42` | `--neutral-opaque-neutral900`  |
| `--color-gray-1000` | `#292a2e` | `--neutral-opaque-neutral1000` |

### Blue (primary brand)

| Token              | Hex       | ADS reference    |
| ------------------ | --------- | ---------------- |
| `--color-blue-100` | `#e9f2fe` | `--blue-blue100` |
| `--color-blue-300` | `#8fb8f6` | `--blue-blue300` |
| `--color-blue-500` | `#4688ec` | `--blue-blue500` |
| `--color-blue-700` | `#1868db` | `--blue-blue700` |
| `--color-blue-900` | `#123263` | `--blue-blue900` |

### Red (danger)

| Token             | Hex       | ADS reference  |
| ----------------- | --------- | -------------- |
| `--color-red-100` | `#ffeceb` | `--red-red100` |
| `--color-red-500` | `#f15b50` | `--red-red500` |
| `--color-red-700` | `#c9372c` | `--red-red700` |
| `--color-red-900` | `#5d1f1a` | `--red-red900` |

> Full scales are defined in `colors.css`. Semantic tokens (`--color-text-*`, `--color-background-*`) are preferred over raw primitives in component code.

---

## Development

```bash
pnpm --filter @lodado/sdui-design-files build
pnpm --filter @lodado/sdui-design-files lint
pnpm --filter @lodado/sdui-design-files generate:tokens  # regenerate from source
```

---

## Source

Colors and tokens are extracted from the [Atlassian Design System](https://atlassian.design/) (Jira Design System).

## License

MIT
