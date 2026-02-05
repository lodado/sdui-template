import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Radio variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Radio component using native HTML input.
 * Based on Atlassian Design System Radio specifications.
 * Uses native :checked pseudo-class for state-based styling.
 *
 * Figma reference:
 * - Size: 14px × 14px circle
 * - Border radius: 50% (fully rounded)
 * - Focus ring: 2px border with --color-border-focused
 * - Colors: --color-background-input, --color-border-input, --color-border-focused
 */
export const radioVariants = cva(
  // Base styles - common to all states
  [
    'relative inline-flex items-center justify-center shrink-0',
    'size-[14px] rounded-full',
    'cursor-pointer transition-all duration-200',
    'appearance-none',
    '-webkit-appearance-none',
    // Focus ring - applies to all states
    'focus-visible:outline-none',
    'focus-visible:before:absolute focus-visible:before:inset-[3px]',
    'focus-visible:before:border-[length:var(--stroke/bold,2px)]',
    'focus-visible:before:border-[var(--color-border-focused)]',
    'focus-visible:before:border-solid focus-visible:before:rounded-full',
    'focus-visible:before:z-10',
    // Disabled state - applies to all variants
    'disabled:bg-[var(--color-background-disabled)]',
    'disabled:border-none',
    'disabled:cursor-not-allowed',
    'disabled:pointer-events-none',
    'disabled:hover:border-none',
    'disabled:checked:bg-[var(--color-background-disabled)]',
    'disabled:checked:border-none',
  ].join(' '),
  {
    variants: {
      error: {
        true: [
          // Base unchecked error state
          'border-[length:var(--🌮-stroke/default,1px)] border-solid',
          'bg-[var(--color-background-input-default)]',
          'border border-[var(--color-border-danger)]',
          // Checked error state
          'checked:bg-[var(--color-border-danger)]',
          'checked:border-[var(--color-border-danger)]',
          // Error hover states
          'hover:not(:disabled):not(:checked):border-[var(--color-border-danger)]',
        ].join(' '),
        false: [
          // Base unchecked state (normal)
          'border-[length:var(--🌮-stroke/default,1px)] border-solid',
          'bg-[var(--color-background-input-default)]',
          'border border-[var(--color-border-input)]',
          // Checked state
          'checked:bg-[var(--color-background-brand-bold-default)]',
          'checked:border-[var(--color-background-brand-bold-default)]',
          // Hover states - unchecked
          'hover:not(:disabled):not(:checked):border-[var(--color-border-input)]',
          // Hover states - checked
          'checked:hover:not(:disabled):bg-[var(--color-background-brand-bold-hovered)]',
          'checked:hover:not(:disabled):border-[var(--color-background-brand-bold-hovered)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      error: false,
    },
  },
)

/**
 * Radio indicator variants - for the inner dot
 *
 * @description
 * Styles for the inner dot inside the radio button when checked.
 * Visibility is controlled by the RadioIndicator component logic.
 */
export const radioIndicatorVariants = cva(
  // Base styles - visibility controlled by component logic
  [
    'absolute inset-[3px] rounded-full bg-white',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

export type RadioVariants = VariantProps<typeof radioVariants>
export type RadioIndicatorVariants = VariantProps<typeof radioIndicatorVariants>
