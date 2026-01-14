import { cva, type VariantProps } from 'class-variance-authority'

/**
 * TextField variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants for the TextField component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Supports:
 * - error state
 * - disabled state
 * - with/without icons
 *
 * Design specs:
 * - Height: 48px
 * - Padding: 16px (default), 8px (with icons)
 * - Border: #E6E6E6 (default), #EF4444 (error)
 * - Text: #C8C8C8 (placeholder), #222 (label), #EF4444 (error message)
 */
export const textFieldVariants = cva(
  // Base styles
  'flex h-12 w-full items-center gap-2 rounded-md border border-solid px-4 py-2 text-sm leading-[1.429] focus-within:outline-2 focus-within:outline-offset-0 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: 'border-[var(--color-border-danger)] focus-within:border-[var(--color-border-danger)] focus-within:outline-[var(--color-border-danger)]',
        false:
          'border-[var(--color-border-input)] focus-within:border-[var(--color-border-focused)] focus-within:outline-[var(--color-border-focused)]',
      },
      disabled: {
        true: 'bg-[var(--color-background-disabled)]',
        false: 'bg-[var(--color-background-input-default)]',
      },
      hasLeftIcon: {
        true: 'pl-2',
        false: '',
      },
      hasRightIcon: {
        true: 'pr-2',
        false: '',
      },
    },
    defaultVariants: {
      error: false,
      disabled: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  },
)

export type TextFieldVariants = VariantProps<typeof textFieldVariants>

/**
 * Label variant styles
 */
export const labelVariants = cva('text-sm leading-[1.429] text-[var(--color-text-default)]', {
  variants: {
    error: {
      true: 'text-[var(--color-text-danger)]',
      false: '',
    },
  },
  defaultVariants: {
    error: false,
  },
})

/**
 * Help message variant styles
 */
export const helpMessageVariants = cva('text-xs leading-[1.333]', {
  variants: {
    error: {
      true: 'text-[var(--color-text-danger)]',
      false: 'text-[var(--color-text-subtle)]',
    },
  },
  defaultVariants: {
    error: false,
  },
})

/**
 * Input text variant styles
 */
export const inputTextVariants = cva(
  'flex-1 bg-transparent outline-none focus:outline-none text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtlest)] caret-[var(--color-border-focused)] antialiased',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-[var(--color-text-disabled)]',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
)

/**
 * Wrapper variant styles
 *
 * @description
 * Defines layout variants for TextField.Wrapper component.
 * Supports horizontal, vertical, and custom orientations.
 */
export const wrapperVariants = cva('', {
  variants: {
    orientation: {
      horizontal: 'flex items-center gap-2',
      vertical: 'flex flex-col gap-2',
      custom: '',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export type WrapperVariants = VariantProps<typeof wrapperVariants>
