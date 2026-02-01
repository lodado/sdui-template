# Toggle Component - Requirement Analysis

## Overview

Toggle (Switch) component based on Atlassian Design System (ADS) specifications.
A toggle is used to view or switch between enabled or disabled states.

## Figma Reference

- **URL**: https://www.figma.com/design/v5a3riuR6uhKl2pQSvqRxN/ADS-Components--Community-?node-id=1966-3031
- **Documentation**: https://atlassian.design/components/toggle/usage

## Design Specifications

### Sizes

| Size | Width | Height | Dot Size |
|------|-------|--------|----------|
| regular | 32px | 16px | 12px |
| large | 40px | 20px | 16px |

### Colors

| State | Background Color |
|-------|-----------------|
| Checked | `--color-background-success-bold-default` (#5b7f24) |
| Unchecked | `--color-background-neutral-bold-default` (#292a2e) |
| Checked (hover) | `--color-background-success-bold-hovered` |
| Unchecked (hover) | `--color-background-neutral-bold-hovered` |
| Disabled | 50% opacity |

### Icons

- **Check mark**: Displayed on left side when checked
- **Cross**: Displayed on right side when unchecked
- **Loading spinner**: Replaces check icon during loading state

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| isChecked | boolean | false | Controlled checked state |
| defaultChecked | boolean | false | Initial state (uncontrolled) |
| isDisabled | boolean | false | Disabled state |
| isLoading | boolean | false | Loading state |
| size | 'regular' \| 'large' | 'regular' | Size variant |
| onChange | (checked: boolean) => void | - | Change callback |
| label | string | - | Accessible label |
| nodeId | string | - | SDUI node ID |
| eventId | string | - | SDUI event ID |
| id | string | - | HTML id |
| name | string | - | Form input name |

## Accessibility

- Role: `switch`
- `aria-checked`: Reflects current state
- `aria-label`: Provides accessible name
- `aria-disabled`: Indicates disabled state
- `aria-busy`: Indicates loading state
- Keyboard support: Space, Enter to toggle

## SDUI Integration

```typescript
// Document node example
{
  id: 'dark-mode-toggle',
  type: 'Toggle',
  state: {
    isChecked: false,
    isDisabled: false,
    isLoading: false,
    size: 'regular',
    label: 'Enable dark mode'
  }
}
```

## File Structure

```
toggle/
├── Toggle.tsx              # Main component
├── ToggleContainer.tsx     # SDUI container
├── toggle-variants.ts      # CVA variants
├── types.ts                # TypeScript types
├── index.ts                # Exports
├── __tests__/
│   └── toggle.logic.test.tsx
└── __docs__/
    └── requirement-analysis.md
```
