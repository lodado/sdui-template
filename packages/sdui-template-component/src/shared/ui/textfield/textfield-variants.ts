import { cva, type VariantProps } from 'class-variance-authority'

/**
 * TextField variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants for the TextField component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Supports:
 * - size variants (default, compact)
 * - appearance variants (standard, subtle, none)
 * - error state
 * - disabled state
 * - hover state
 * - with/without icons
 *
 * Design specs (based on Figma ADS Components):
 * - Height: 40px (default), 32px (compact)
 * - Padding: 8px
 * - Gap: 6px
 * - Border radius: 3px
 * - Border: 1px solid (default), 2px solid (focus/error)
 */
export const textFieldVariants = cva(
  // Base styles - updated based on Figma design
  // Using ring instead of border-2 on focus to prevent layout shift
  'flex w-full items-center gap-1.5 rounded-[3px] border border-solid text-sm leading-[1.429] transition-colors focus-within:ring-1 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      size: {
        default: 'h-10 p-2', // 40px height, 8px padding
        compact: 'h-8 px-2 py-1.5', // 32px height
      },
      appearance: {
        standard:
          'bg-[var(--color-background-input-default)] hover:bg-[var(--color-background-input-hovered)]',
        subtle: 'bg-transparent hover:bg-[var(--color-background-input-hovered)]',
        none: 'bg-transparent border-transparent',
      },
      error: {
        true: 'border-[var(--color-border-danger)] focus-within:border-[var(--color-border-danger)] focus-within:ring-[var(--color-border-danger)]',
        false:
          'border-[var(--color-border-input)] focus-within:border-[var(--color-border-focused)] focus-within:ring-[var(--color-border-focused)]',
      },
      disabled: {
        true: 'bg-[var(--color-background-disabled)] border-[var(--color-border-disabled)] hover:bg-[var(--color-background-disabled)] cursor-not-allowed',
        false: '',
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
    compoundVariants: [
      // When appearance is 'none', remove border and ring even on focus
      {
        appearance: 'none',
        className: 'border-transparent focus-within:border-transparent focus-within:ring-0',
      },
      // When appearance is 'subtle' in default state
      {
        appearance: 'subtle',
        error: false,
        disabled: false,
        className: 'border-transparent',
      },
    ],
    defaultVariants: {
      size: 'default',
      appearance: 'standard',
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
 *
 * @description
 * Styles for the actual input element inside TextField.
 * Font size: 14px, Line height: 20px (based on Figma)
 */
export const inputTextVariants = cva(
  'flex-1 min-w-0 bg-transparent outline-none focus:outline-none text-[var(--color-text-default)] placeholder:text-[var(--color-text-subtlest)] caret-[var(--color-border-focused)] antialiased text-sm leading-5',
  {
    variants: {
      disabled: {
        true: 'cursor-not-allowed text-[var(--color-text-disabled)]',
        false: '',
      },
      isMonospaced: {
        true: 'font-mono',
        false: '',
      },
    },
    defaultVariants: {
      disabled: false,
      isMonospaced: false,
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
