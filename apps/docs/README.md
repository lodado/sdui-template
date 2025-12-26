# SDUI Template Storybook

Storybook for SDUI Template Library components and examples.

## Overview

This Storybook showcases the `@lodado/sdui-template` and `@lodado/sdui-template-component` libraries, demonstrating how to use Server-Driven UI (SDUI) components in your React applications.

## Features

- **SduiLayoutRenderer**: Main component for rendering SDUI Layout Documents
- **Button Component**: Example UI component integrated with SDUI system
- **Component Factory Pattern**: Demonstrates how to create custom component factories

## Setup

Install dependencies:

```bash
pnpm install
```

## Development

Start Storybook development server:

```bash
pnpm dev
```

Storybook will be available at `http://localhost:6006`

## Build

Build static Storybook:

```bash
pnpm build
```

The static build will be output to `storybook-static/` directory.

## Stories

### SDUI/SduiLayoutRenderer

Demonstrates how to use the `SduiLayoutRenderer` component with various document structures and component mappings.

### Components/Button

Shows the Button component from `@lodado/sdui-template-component` with different variants, sizes, and states.
