# @lodado/sdui-template-component

**Radix UI-based component library for Server-Driven UI — drop-in `sduiComponents` map for `SduiLayoutRenderer`.**

[![npm version](https://img.shields.io/npm/v/@lodado/sdui-template-component.svg)](https://www.npmjs.com/package/@lodado/sdui-template-component)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)

[![Radix UI](https://img.shields.io/badge/UI-Radix%20UI-161618?logo=radixui&logoColor=white)](https://www.radix-ui.com/)
[![SDUI](https://img.shields.io/badge/SDUI-Component%20Map-2563EB)](https://github.com/lodado/sdui-template/tree/main/packages/sdui-template-component)
[![FSD](https://img.shields.io/badge/Arch-FSD-0EA5E9)](https://feature-sliced.design/)

[Quick start](#quick-start) · [Components](#components) · [SDUI map](#sdui-component-map) · [Architecture](#architecture) · [Development](#development)

---

This package provides production-ready React components wired as SDUI `ComponentFactory` entries. Pass `sduiComponents` to `@lodado/sdui-template`'s renderer and server JSON documents render immediately — no per-component wiring required.

```
SduiLayoutDocument → SduiLayoutRenderer + sduiComponents → React UI
```

### End-to-end example

| **① server JSON** | →   | **② component map** `sduiComponents` | →   | **③ rendered UI** |
| ----------------- | --- | ------------------------------------ | --- | ----------------- |

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'

const document = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Div',
    children: [
      {
        id: 'btn-1',
        type: 'Button',
        state: { label: 'Submit', variant: 'primary' },
      },
    ],
  },
}

export default function Page() {
  return <SduiLayoutRenderer document={document} components={sduiComponents} />
}
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Components](#components)
- [SDUI component map](#sdui-component-map)
- [Form validation](#form-validation)
- [Architecture](#architecture)
- [Development](#development)

---

## Why this exists

`@lodado/sdui-template` renders any registered component type, but you still need React implementations for each `type` string in your document. This package ships:

- Pre-built Radix UI primitives (Button, Dialog, Dropdown, etc.)
- SDUI `*Container` wrappers with subscription hooks baked in
- A unified `sduiComponents` map ready for `SduiLayoutRenderer`
- FSD-structured source for extending or overriding individual components

## Installation

```bash
pnpm add @lodado/sdui-template-component @lodado/sdui-template zod@^4.3.6
# or
npm install @lodado/sdui-template-component @lodado/sdui-template zod@^4.3.6
```

Peer dependencies: `react`, `react-dom`, `@lodado/sdui-template`, `zod@^4.3.6`

---

## Quick start

### Standalone component

```tsx
import { Button } from '@lodado/sdui-template-component'

export function App() {
  return <Button variant="primary">Click me</Button>
}
```

### Full SDUI document

```tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { sduiComponents } from '@lodado/sdui-template-component'

export default function Page({ document }) {
  return <SduiLayoutRenderer document={document} components={sduiComponents} />
}
```

---

## Components

### Layout & structure

| Component  | SDUI type  | Description                |
| ---------- | ---------- | -------------------------- |
| `Div`      | `Div`      | Generic layout container   |
| `Card`     | `Card`     | Card wrapper with variants |
| `List`     | `List`     | List container             |
| `Canvas3D` | `Canvas3D` | 3D canvas (ECS-based)      |

### Inputs & controls

| Component   | SDUI type                                       | Description                     |
| ----------- | ----------------------------------------------- | ------------------------------- |
| `Button`    | `Button`                                        | Primary action button           |
| `TextField` | `TextField`, `TextFieldInput`, …                | Form text input with label/help |
| `Checkbox`  | `Checkbox`, `CheckboxCheckbox`, `CheckboxLabel` | Checkbox with compound children |
| `Toggle`    | `Toggle`                                        | On/off switch                   |
| `Dropdown`  | `Dropdown`, `DropdownTrigger`, …                | Select dropdown                 |
| `Form`      | `Form`, `FormField`                             | Form with Zod validation        |

### Overlays & feedback

| Component | SDUI type                      | Description     |
| --------- | ------------------------------ | --------------- |
| `Dialog`  | `Dialog`, `DialogTrigger`, …   | Modal dialog    |
| `Popover` | `Popover`, `PopoverTrigger`, … | Popover overlay |
| `Tooltip` | `Tooltip`                      | Hover tooltip   |
| `Badge`   | `Badge`                        | Status badge    |
| `Tag`     | `Tag`                          | Removable tag   |

### Typography & media

| Component       | SDUI type            | Description                   |
| --------------- | -------------------- | ----------------------------- |
| `Text` / `Span` | `Text`, `Span`       | Text rendering                |
| `Icon`          | `Icon`               | Icon display                  |
| `Title`         | `Title`, `TitleLogo` | Page title with optional logo |

---

## SDUI component map

`createSduiComponents(options?)` returns the full map; `sduiComponents` is the default export.

```tsx
import { sduiComponents, createSduiComponents } from '@lodado/sdui-template-component'

// Default map — covers all built-in types
;<SduiLayoutRenderer document={doc} components={sduiComponents} />

// Custom options (e.g. Canvas3D render strategy)
const components = createSduiComponents({ canvas3d: { strategy: 'webgl' } })
```

Compound components (Dialog, Dropdown, Checkbox, etc.) use the SDUI node-reference pattern — parent nodes hold shared state; children subscribe via `useSduiNodeReference`.

---

## Form validation

Register Zod schemas before rendering forms:

```tsx
import { sduiComponents, registerSchemas } from '@lodado/sdui-template-component'
import { z } from 'zod'

registerSchemas({
  loginForm: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

<SduiLayoutRenderer document={document} components={sduiComponents} />
```

---

## Architecture

Feature-Sliced Design (FSD):

```text
src/
├── app/          # sduiComponents map, public entry
├── features/     # Dialog, Form, Title
├── shared/       # UI primitives, hooks, utils
└── widgets/      # Composite widgets (future)
```

| Layer        | Responsibility                                      |
| ------------ | --------------------------------------------------- |
| `app/`       | Unified `sduiComponents` export                     |
| `features/`  | Domain-facing compound components                   |
| `shared/ui/` | Radix-based primitives + `*Container` SDUI wrappers |

Each `*Container` component uses `@lodado/sdui-template` hooks (`useSduiNodeSubscription`, `useRenderNode`, `useSduiNodeReference`) internally.

---

## Motion

Micro-interactions run on a small set of tokens defined in
`@lodado/sdui-design-files/motion.css` and consumed through the `MOTION`
fragments in `shared/lib/motion.ts`. Never hardcode a duration or easing —
compose a `MOTION` fragment or reference a token so the system stays in one
rhythm.

| Token | Value | Use |
| --- | --- | --- |
| `--motion-duration-fast` | 100ms | hover/press feedback, small-surface exit |
| `--motion-duration-medium` | 150ms | small-surface enter, large exit |
| `--motion-duration-slow` | 250ms | large-surface enter (dialog) |
| `--motion-ease-out` | `cubic-bezier(0.2, 0, 0, 1)` | decelerate — enter |
| `--motion-ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | accelerate — exit |
| `--motion-ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | color/state transition |
| `--motion-ease-spring` | `cubic-bezier(0.16, 1, 0.3, 1)` | overshoot — toggle thumb, check pop |

`MOTION` fragments: `surface` (floating enter/exit via Radix `data-state`),
`overlay` (blanket fade), `colors` (hover/active color transition),
`pressable` (color transition + active press-scale).

Principles: animate `transform`/`opacity` only; enter uses ease-out, exit uses
ease-in and runs faster; things that must feel instant (menu-item highlight,
focus ring) are not animated.

**Reduced motion:** `prefers-reduced-motion: reduce` zeroes the duration
tokens, so every transition/animation completes instantly system-wide while
state changes still apply. The one exception is the button loading spinner
(Tailwind `animate-spin`), which keeps turning because it conveys progress.

See `apps/docs/src/stories/Motion.stories.tsx` for the live token reference.

## Development

```bash
pnpm --filter @lodado/sdui-template-component test
pnpm --filter @lodado/sdui-template-component lint
pnpm --filter @lodado/sdui-template-component build
```

Storybook examples: `apps/docs/src/stories/`

---

## License

MIT
