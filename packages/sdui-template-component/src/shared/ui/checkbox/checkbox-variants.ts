import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Checkbox variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Checkbox component built on Radix UI Checkbox.
 * Based on Atlassian Design System Checkbox specifications.
 * Uses Radix data-state attributes for state-based styling.
 *
 * Figma reference:
 * - Size: 14px × 14px box
 * - Border radius: 2px
 * - Focus ring: 2px border with --color-border-focused
 * - Colors: --color-background-input, --color-border-input, --color-border-focused
 *
 * @see https://www.radix-ui.com/primitives/docs/components/checkbox
 */
export const checkboxVariants = cva(
  // Base styles - using Radix data-state for checked styling
  [
    'relative inline-flex items-center justify-center shrink-0 rounded-[2px]',
    'border-[length:var(--🌮-stroke/default,1px)] border-solid',
    'bg-[var(--token(\'color.background.input\'),white)]',
    'border-[var(--token(\'color.border.input\'),#8c8f97)]',
    'cursor-pointer transition-all duration-200',
    // Focus ring - 2px border inset by 3px (Figma design)
    'focus-visible:outline-none',
    'focus-visible:before:absolute focus-visible:before:inset-[3px]',
    'focus-visible:before:border-[length:var(--stroke/bold,2px)]',
    'focus-visible:before:border-[var(--token(\'color.border.focused\'),#4688ec)]',
    'focus-visible:before:border-solid focus-visible:before:rounded-[2px]',
    // Checked state
    'data-[state=checked]:bg-[var(--color-background-brand-bold-default,#0052cc)]',
    'data-[state=checked]:border-[var(--color-background-brand-bold-default,#0052cc)]',
    // Indeterminate state (using data-indeterminate attribute)
    'data-[indeterminate]:bg-[var(--color-background-brand-bold-default,#0052cc)]',
    'data-[indeterminate]:border-[var(--color-background-brand-bold-default,#0052cc)]',
    // Hover states
    'hover:border-[var(--color-border-input-hovered,#5e6c84)]',
    'data-[state=checked]:hover:bg-[var(--color-background-brand-bold-hovered,#0065ff)]',
    'data-[state=checked]:hover:border-[var(--color-background-brand-bold-hovered,#0065ff)]',
    'data-[indeterminate]:hover:bg-[var(--color-background-brand-bold-hovered,#0065ff)]',
    'data-[indeterminate]:hover:border-[var(--color-background-brand-bold-hovered,#0065ff)]',
    // Disabled state via Radix data-disabled
    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
    'data-[disabled]:hover:border-[var(--token(\'color.border.input\'),#8c8f97)]',
    'data-[disabled]:data-[state=checked]:hover:bg-[var(--color-background-brand-bold-default,#0052cc)]',
    'data-[disabled]:data-[indeterminate]:hover:bg-[var(--color-background-brand-bold-default,#0052cc)]',
  ].join(' '),
  {
    variants: {
      // Size variants (currently only one size: 14px × 14px)
      // Can be extended in the future if needed
    },
    defaultVariants: {},
  },
)

/**
 * Checkbox indicator variants - for the check/indeterminate icon
 *
 * @description
 * Styles for the checkmark or indeterminate indicator inside the checkbox.
 * Uses Radix data-state for visibility.
 */
export const checkboxIndicatorVariants = cva(
  // Base styles - using Radix data-state for visibility
  [
    'flex items-center justify-center text-white',
    'data-[state=checked]:block',
    'data-[state=unchecked]:hidden',
    'data-[indeterminate]:block',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

export type CheckboxVariants = VariantProps<typeof checkboxVariants>
export type CheckboxIndicatorVariants = VariantProps<typeof checkboxIndicatorVariants>
