import { cva, type VariantProps } from 'class-variance-authority'

import type { ToggleSize } from './types'

/**
 * Toggle variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Toggle component built on Radix UI Switch.
 * Based on Atlassian Design System Toggle specifications.
 * Uses Radix data-state attributes for state-based styling.
 *
 * Figma reference:
 * - Size: 32x16px (regular), 40x20px (large)
 * - Dot: 12x12px (regular), 16x16px (large)
 * - Colors: success.bold (checked), neutral.bold (unchecked)
 *
 * @see https://www.radix-ui.com/primitives/docs/components/switch
 */
export const toggleVariants = cva(
  // Base styles - using Radix data-state for checked styling
  [
    'relative inline-flex items-center rounded-full cursor-pointer transition-colors duration-200',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-border-focused)]',
    // Radix data-state based colors
    'bg-[var(--color-background-neutral-bold-default,#292a2e)]',
    'data-[state=checked]:bg-[var(--color-background-success-bold-default,#5b7f24)]',
    // Hover states
    'hover:bg-[var(--color-background-neutral-bold-hovered,#3d3e42)]',
    'data-[state=checked]:hover:bg-[var(--color-background-success-bold-hovered,#4a6a1e)]',
    // Disabled state via Radix data-disabled
    'data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed data-[disabled]:pointer-events-none',
    'data-[disabled]:hover:bg-[var(--color-background-neutral-bold-default,#292a2e)]',
    'data-[disabled]:data-[state=checked]:hover:bg-[var(--color-background-success-bold-default,#5b7f24)]',
  ].join(' '),
  {
    variants: {
      size: {
        regular: 'w-8 h-4', // 32x16px
        large: 'w-10 h-5', // 40x20px
      } as Record<ToggleSize, string>,
      isDisabled: {
        true: '',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      size: 'regular',
      isDisabled: false,
      isLoading: false,
    },
  },
)

/**
 * Toggle thumb variants - for Radix Switch.Thumb
 *
 * @description
 * Styles for the thumb element using Radix data-state for positioning.
 * The thumb slides based on the checked/unchecked state.
 */
export const toggleThumbVariants = cva(
  // Base styles - using Radix data-state for position
  [
    'block bg-white rounded-full shadow-sm transition-transform duration-200',
    // Position based on state
    'translate-x-0.5',
    'data-[state=checked]:translate-x-[18px]',
  ].join(' '),
  {
    variants: {
      size: {
        regular: [
          'w-3 h-3', // 12x12px
          'data-[state=checked]:translate-x-[18px]', // 32 - 12 - 2 = 18px
        ].join(' '),
        large: [
          'w-4 h-4', // 16x16px
          'data-[state=checked]:translate-x-[22px]', // 40 - 16 - 2 = 22px
        ].join(' '),
      } as Record<ToggleSize, string>,
    },
    defaultVariants: {
      size: 'regular',
    },
  },
)

/**
 * Toggle icon variants
 *
 * @description
 * Styles for the check and cross icons.
 * Uses parent's Radix data-state for opacity transitions.
 */
export const toggleIconVariants = cva(
  'absolute top-1/2 -translate-y-1/2 flex items-center justify-center text-white pointer-events-none',
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

/**
 * @deprecated Use toggleThumbVariants instead
 * Kept for backward compatibility
 */
export const toggleDotVariants = toggleThumbVariants

export type ToggleVariants = VariantProps<typeof toggleVariants>
export type ToggleThumbVariants = VariantProps<typeof toggleThumbVariants>
/** @deprecated Use ToggleThumbVariants instead */
export type ToggleDotVariants = ToggleThumbVariants
export type ToggleIconVariants = VariantProps<typeof toggleIconVariants>
