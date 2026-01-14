# @lodado/sdui-design-files

Design system files for SDUI template - CSS variables, colors, and design tokens extracted from Jira Design System (Atlassian Design System).

## Installation

```bash
pnpm add @lodado/sdui-design-files
```

## Usage

### Import CSS Variables

```tsx
// Import the CSS file to use design system variables
import '@lodado/sdui-design-files/index.css'
// or
import '@lodado/sdui-design-files/colors.css'
```

### Use CSS Variables

```css
.my-component {
  background-color: var(--color-blue-500);
  color: var(--color-white);
  border: 1px solid var(--color-gray-200);
}
```

## Available Colors

### Black & White

- `--color-black`: #000000 (not directly defined, use semantic tokens)
- `--color-white`: #ffffff (via `--color-text-inverse` or `--color-background-input-default`)

### Gray Scale (Neutral Colors)

- `--color-gray-0`: #ffffff (via `--neutral-opaque-neutral0`)
- `--color-gray-100`: #f8f8f8 (via `--neutral-opaque-neutral100`)
- `--color-gray-200`: #f0f1f2 (via `--neutral-opaque-neutral200`)
- `--color-gray-300`: #dddee1 (via `--neutral-opaque-neutral300`)
- `--color-gray-400`: #b7b9be (via `--neutral-opaque-neutral400`)
- `--color-gray-500`: #8c8f97 (via `--neutral-opaque-neutral500`)
- `--color-gray-600`: #7d818a (via `--neutral-opaque-neutral600`)
- `--color-gray-700`: #6b6e76 (via `--neutral-opaque-neutral700`)
- `--color-gray-800`: #505258 (via `--neutral-opaque-neutral800`)
- `--color-gray-900`: #3b3d42 (via `--neutral-opaque-neutral900`)
- `--color-gray-1000`: #292a2e (via `--neutral-opaque-neutral1000`)

### Blue Scale (Primary Brand Colors)

- `--color-blue-100`: #e9f2fe (via `--blue-blue100`)
- `--color-blue-200`: #cfe1fd (via `--blue-blue200`)
- `--color-blue-300`: #8fb8f6 (via `--blue-blue300`)
- `--color-blue-400`: #669df1 (via `--blue-blue400`)
- `--color-blue-500`: #4688ec (via `--blue-blue500`)
- `--color-blue-600`: #357de8 (via `--blue-blue600`)
- `--color-blue-700`: #1868db (via `--blue-blue700`)
- `--color-blue-800`: #1558bc (via `--blue-blue800`)
- `--color-blue-900`: #123263 (via `--blue-blue900`)

### Red Scale

- `--color-red-100`: #ffeceb (via `--red-red100`)
- `--color-red-200`: #ffd5d2 (via `--red-red200`)
- `--color-red-300`: #fd9891 (via `--red-red300`)
- `--color-red-400`: #f87168 (via `--red-red400`)
- `--color-red-500`: #f15b50 (via `--red-red500`)
- `--color-red-600`: #e2483d (via `--red-red600`)
- `--color-red-700`: #c9372c (via `--red-red700`)
- `--color-red-800`: #ae2e24 (via `--red-red800`)
- `--color-red-900`: #5d1f1a (via `--red-red900`)

## Source

Colors are extracted from the Atlassian Design System (Jira Design System).

## License

MIT
