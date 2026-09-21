# @lodado/eslint-plugin-sdui

ESLint rules for keeping SDUI state close to the component that consumes it.

The plugin currently provides one rule:

- `no-hook-data-prop-drilling`: allows the first handoff from an SDUI hook to a child component, then reports the same hook-derived data when that child forwards it to another component.

The package is in this repository and is not published to npm yet.

## Installation

```bash
pnpm add -D @lodado/eslint-plugin-sdui eslint@^9 @typescript-eslint/parser@^8 typescript@^5
# or
npm install --save-dev @lodado/eslint-plugin-sdui eslint@^9 @typescript-eslint/parser@^8 typescript@^5
```

The plugin is not published yet, so the install command becomes usable after its first npm release. In this repository, use the workspace package instead.

The rule needs TypeScript parser services. Your ESLint configuration must point the parser at a `tsconfig.json` that includes every file whose parent and child components you want to analyze.

Supported toolchains are:

- ESLint 8.57 with `@typescript-eslint/parser` 5.62, or ESLint 9 with parser 8.
- TypeScript 5.4 through 5.x.
- Node.js 18.18 or newer.

## Flat config

The plugin exports a CommonJS plugin object. Flat config registers that object manually; the package does not provide a preset.

```js
// eslint.config.mjs
import { fileURLToPath } from 'node:url'
import tsParser from '@typescript-eslint/parser'
import sdui from '@lodado/eslint-plugin-sdui'

const tsconfigRootDir = fileURLToPath(new URL('.', import.meta.url))

export default [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir,
      },
    },
    plugins: {
      sdui,
    },
    rules: {
      'sdui/no-hook-data-prop-drilling': 'error',
    },
  },
]
```

For an ESLint 9 configuration in a CommonJS project, use `require` instead:

```js
// eslint.config.cjs
const tsParser = require('@typescript-eslint/parser')
const sdui = require('@lodado/eslint-plugin-sdui')

module.exports = [
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: { sdui },
    rules: {
      'sdui/no-hook-data-prop-drilling': 'error',
    },
  },
]
```

## Legacy config

```js
// .eslintrc.cjs
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@lodado/sdui'],
  rules: {
    '@lodado/sdui/no-hook-data-prop-drilling': 'error',
  },
}
```

## Rule behavior

The rule recognizes SDUI hooks imported from the exact module `@lodado/sdui-template`:

- `useSduiNodeSubscription`
- `useSduiNodeReference`
- `useSduiVariable`
- `useSduiVariables`
- `useRenderNode`
- `useSduiLayoutAction`

It follows aliases, destructuring, imported or namespace references, same-file variable aliases, common data transformations, and statically known object spreads. A hook name from another module is not treated as an SDUI source just because it starts with `use`.

### Allowed first handoff

The component that reads the hook may pass a value to its direct child:

The snippets use this schema so `state.title` has a concrete type:

```tsx
import { z } from 'zod'

const titleSchema = z.object({ title: z.string() })
```

```tsx
function Parent({ nodeId }: { nodeId: string }) {
  const { state } = useSduiNodeSubscription({ nodeId, schema: titleSchema })

  return <Child title={state.title} />
}
```

### Reported second handoff

When `Child` forwards that value to another component, the rule reports the forwarding prop:

```tsx
function Child(props: { title: string }) {
  return <GrandChild title={props.title} />
  //                    ^ SDUI hook data is being forwarded again
}
```

The same check works across files and imported or barrel aliases when the files belong to the same TypeScript Program. If a shared component has one SDUI caller that creates a second handoff, that forwarding path is reported.

The usual fix is to pass an identifier and subscribe in the component that renders the data:

```tsx
function Parent({ nodeId }: { nodeId: string }) {
  return <Child nodeId={nodeId} />
}

function Child({ nodeId }: { nodeId: string }) {
  const { state } = useSduiNodeSubscription({ nodeId, schema: titleSchema })

  return <span>{state.title}</span>
}
```

### Values that remain allowed

The rule does not report normal data with no SDUI source:

```tsx
const title = 'Static title'

function Parent() {
  return <Child title={title} />
}

function Child(props: { title: string }) {
  return <GrandChild title={props.title} />
}
```

Function props are allowed at any depth, including nullable callbacks. A callback may close over SDUI state or an SDUI action:

```tsx
type Props = { onClick?: (() => void) | null }

function Child(props: Props) {
  return <GrandChild onClick={props.onClick} />
}
```

The exception is type-based. A prop named `onClick` with an `unknown` or `any` type is not assumed to be a function and is not exempt.

Rendering hook data in a DOM element or as JSX children is treated as display output:

```tsx
function Child(props: { title: string }) {
  return (
    <div title={props.title}>
      {props.title}
      <GrandChild>{props.title}</GrandChild>
    </div>
  )
}
```

An explicit `children` prop is still a prop and is checked:

```tsx
<GrandChild children={props.title} />
```

The rule does not provide an autofix. Moving a subscription changes component ownership and requires a design decision.

## Analysis limits

The first version is intentionally conservative. The analyzed parent and child components must be visible to the same TypeScript Program. The rule does not promise complete analysis for:

- arbitrary interprocedural helper return values;
- wrappers, custom hooks, higher-order components, or dynamic component expressions;
- class components;
- prop mutation or recursive object shape transformations;
- flow-sensitive branch analysis.

The rule propagates a source through helper-call arguments, but it does not inspect helper function bodies. It tracks variable assignments conservatively rather than simulating execution order, so a variable can remain marked as SDUI-derived after a later reassignment.

To bound recursive object expansion, analysis stops beyond 32 property-path segments or 256 distinct projections of one syntax node. Flows beyond those limits are not reported.

Keep the parent and child files in the configured `tsconfig.json`, and run ESLint on all relevant source files. Linting a child alone can discover its parents through the project, but linting only a parent does not emit diagnostics for an unlinted child. Because a parent change can affect a diagnostic in a child file, disabling ESLint's `--cache` is recommended for reliable results. The rule reuses analysis through a `WeakMap` during an ESLint invocation; that map is not a persistent file cache.

If parser services are unavailable, the rule throws an actionable configuration error. Configure `@typescript-eslint/parser` with `parserOptions.project` and `tsconfigRootDir`; the rule never silently falls back to name-only analysis.
