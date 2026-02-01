import { cva, type VariantProps } from 'class-variance-authority'

import type { ToggleSize } from './types'

/**
 * Toggle variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Toggle component.
 * Based on Atlassian Design System Toggle specifications.
 *
 * Figma reference:
 * - Size: 32x16px (regular), 40x20px (large)
 * - Dot: 12x12px (regular), 16x16px (large)
 * - Colors: success.bold (checked), neutral.bold (unchecked)
 */
export const toggleVariants = cva(
  // Base styles
  [
    'relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-border-focused)]',
  ].join(' '),
  {
    variants: {
      size: {
        regular: 'w-8 h-4', // 32x16px
        large: 'w-10 h-5', // 40x20px
      } as Record<ToggleSize, string>,
      isChecked: {
        true: 'bg-[var(--color-background-success-bold-default,#5b7f24)]',
        false: 'bg-[var(--color-background-neutral-bold-default,#292a2e)]',
      },
      isDisabled: {
        true: 'opacity-50 cursor-not-allowed pointer-events-none',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      // Hover states (only when not disabled/loading)
      {
        isChecked: true,
        isDisabled: false,
        isLoading: false,
        class: 'hover:bg-[var(--color-background-success-bold-hovered,#4a6a1e)]',
      },
      {
        isChecked: false,
        isDisabled: false,
        isLoading: false,
        class: 'hover:bg-[var(--color-background-neutral-bold-hovered,#3d3e42)]',
      },
    ],
    defaultVariants: {
      size: 'regular',
      isChecked: false,
      isDisabled: false,
      isLoading: false,
    },
  },
)

/**
 * Toggle dot (thumb) variants
 */
export const toggleDotVariants = cva(
  // Base styles
  'absolute bg-white rounded-full shadow-sm transition-transform duration-200',
  {
    variants: {
      size: {
        regular: 'w-3 h-3 top-0.5', // 12x12px
        large: 'w-4 h-4 top-0.5', // 16x16px
      } as Record<ToggleSize, string>,
      isChecked: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Position based on checked state and size
      {
        size: 'regular',
        isChecked: false,
        class: 'left-0.5', // 2px
      },
      {
        size: 'regular',
        isChecked: true,
        class: 'left-[18px]', // 32 - 12 - 2 = 18px
      },
      {
        size: 'large',
        isChecked: false,
        class: 'left-0.5', // 2px
      },
      {
        size: 'large',
        isChecked: true,
        class: 'left-[22px]', // 40 - 16 - 2 = 22px
      },
    ],
    defaultVariants: {
      size: 'regular',
      isChecked: false,
    },
  },
)

/**
 * Toggle icon variants
 */
export const toggleIconVariants = cva(
  'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-white',
  {
    variants: {
      size: {
        regular: 'w-3 h-3', // 12x12px
        large: 'w-4 h-4', // 16x16px
      } as Record<ToggleSize, string>,
      position: {
        check: '', // Left side (visible when checked)
        cross: '', // Right side (visible when unchecked)
      },
    },
    compoundVariants: [
      {
        size: 'regular',
        position: 'check',
        class: 'left-1',
      },
      {
        size: 'regular',
        position: 'cross',
        class: 'right-1',
      },
      {
        size: 'large',
        position: 'check',
        class: 'left-1.5',
      },
      {
        size: 'large',
        position: 'cross',
        class: 'right-1.5',
      },
    ],
    defaultVariants: {
      size: 'regular',
      position: 'check',
    },
  },
)

export type ToggleVariants = VariantProps<typeof toggleVariants>
export type ToggleDotVariants = VariantProps<typeof toggleDotVariants>
export type ToggleIconVariants = VariantProps<typeof toggleIconVariants>
