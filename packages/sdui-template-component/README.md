# @lodado/sdui-template-component

SDUI Component Library - Radix UI-based components for Server-Driven UI.

## Installation

```bash
npm install @lodado/sdui-template-component
# or
pnpm add @lodado/sdui-template-component
# or
yarn add @lodado/sdui-template-component
```

This package relies on the latest **zod v4** types for schema validation. Install a compatible zod version:

```bash
pnpm add zod@^4.3.6
# or
npm install zod@^4.3.6
# or
yarn add zod@^4.3.6
```

## Usage

```tsx
import { Button } from '@lodado/sdui-template-component'

function App() {
  return <Button variant="primary">Click me</Button>
}
```

## Components

### Button

A flexible button component built with Radix UI primitives.

```tsx
import { Button } from '@lodado/sdui-template-component'

;<Button variant="primary" size="md" onClick={handleClick}>
  Submit
</Button>
```

## Architecture

This library follows Feature-Sliced Design (FSD) architecture:

- `app/` - Entry point and exports
- `features/` - Component features (Button, etc.)
- `shared/` - Shared utilities, hooks, and UI primitives

## License

MIT
