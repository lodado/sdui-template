# ssr-testing

**Next.js SSR integration testbed for the SDUI monorepo — layout rendering, document editor, and Playwright E2E.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Playwright](https://img.shields.io/badge/E2E-Playwright-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Private](https://img.shields.io/badge/npm-private-red)](https://github.com/lodado/sdui-template/tree/main/packages/ssr-testing)
[![GitHub](https://img.shields.io/github/stars/lodado/sdui-template?style=social&label=Star)](https://github.com/lodado/sdui-template)

[![SSR](https://img.shields.io/badge/Test-SSR%20Hydration-2563EB)](https://github.com/lodado/sdui-template/tree/main/packages/ssr-testing)
[![SDUI](https://img.shields.io/badge/Scope-SDUI%20Monorepo-7C3AED)](https://github.com/lodado/sdui-template)

[Quick start](#quick-start) · [Routes](#routes) · [E2E tests](#e2e-tests) · [Stack](#stack) · [Development](#development)

---

This private package is the **live integration surface** for `@lodado/sdui-template`, `@lodado/sdui-template-component`, `@lodado/sdui-document`, and `@lodado/sdui-document-react`. It validates SSR hydration, component rendering, and document editor behavior against real Next.js App Router.

```
workspace packages → Next.js app → Playwright E2E → pass/fail
```

### End-to-end example

| **① SDUI document** | →   | **② Next.js SSR page** | →   | **③ Playwright spec** |
| ------------------- | --- | ---------------------- | --- | --------------------- |

```tsx
// app/page.tsx
'use client'

import { SduiLayoutRenderer } from '@lodado/sdui-template'
import { componentMap } from './components/componentMap'

export default function Page() {
  return <SduiLayoutRenderer document={exampleDocument} components={componentMap} />
}
```

```ts
// app/page-render.spec.ts
import { test, expect } from '@playwright/test'

test('renders toggle components from SDUI document', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('알림 받기')).toBeVisible()
})
```

---

## Table of Contents

- [Why this exists](#why-this-exists)
- [Quick start](#quick-start)
- [Routes](#routes)
- [E2E tests](#e2e-tests)
- [Stack](#stack)
- [Development](#development)

---

## Why this exists

Unit tests in individual packages cannot catch:

- SSR/hydration mismatches with `'use client'` SDUI components
- Cross-package integration (template + component + document)
- Real browser interactions (drag-and-drop, keyboard, focus)

This app runs the full stack locally and in CI via Playwright.

## Quick start

```bash
# From monorepo root
pnpm install

# Dev server (port 3000)
pnpm --filter ssr-testing dev-test

# Production build smoke test
pnpm --filter ssr-testing build-test
pnpm --filter ssr-testing start-test
```

Open [http://localhost:3000](http://localhost:3000).

---

## Routes

| Route              | Purpose                                                |
| ------------------ | ------------------------------------------------------ |
| `/`                | SDUI layout rendering — GridLayout + Toggle components |
| `/document-editor` | `@lodado/sdui-document-react` block editor             |

### `/` — SDUI layout

Renders a server-defined `SduiLayoutDocument` with custom `componentMap` (Toggle, GridLayout). Validates subscription-based re-rendering and SSR output.

### `/document-editor` — Block editor

Full `SduiDocumentEditor` integration: paragraphs, headings, checklists, drag-and-drop, keyboard shortcuts, and patch-based editing.

---

## E2E tests

```bash
# Run all Playwright specs
pnpm --filter ssr-testing test:e2e

# Interactive UI mode
pnpm --filter ssr-testing test:e2e:ui

# Headed browser
pnpm --filter ssr-testing test:e2e:headed
```

| Spec file                                          | Coverage                  |
| -------------------------------------------------- | ------------------------- |
| `app/page-render.spec.ts`                          | SDUI layout SSR render    |
| `app/document-editor/document-editor.spec.ts`      | Core editor flows         |
| `app/document-editor/block-menu.spec.ts`           | Block type menu           |
| `app/document-editor/columns.spec.ts`              | Column layout             |
| `app/document-editor/gesture-interactions.spec.ts` | Touch/gesture handling    |
| `app/document-editor/multilineAlignment.spec.ts`   | Multi-line text alignment |

Config: [playwright.config.ts](playwright.config.ts)

---

## Stack

| Package                           | Role                    |
| --------------------------------- | ----------------------- |
| `@lodado/sdui-template`           | Layout renderer + store |
| `@lodado/sdui-template-component` | Component library       |
| `@lodado/sdui-document`           | Block document domain   |
| `@lodado/sdui-document-react`     | Block editor UI         |
| `next@16`                         | App Router SSR          |
| `react@19`                        | UI runtime              |
| `@playwright/test`                | E2E testing             |

---

## Development

```bash
pnpm --filter ssr-testing lint
pnpm --filter ssr-testing typecheck
pnpm --filter ssr-testing test:e2e
```

From monorepo root after any package change:

```bash
pnpm run test
```

---

## License

Private — not published to npm.
