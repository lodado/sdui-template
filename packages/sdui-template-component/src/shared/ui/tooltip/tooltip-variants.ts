import { cva, type VariantProps } from 'class-variance-authority'

import { MOTION } from '../../lib/motion'

/**
 * Tooltip content variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual styles for the Tooltip content component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * ADS Tooltip Style:
 * - Dark background (neutral.bold)
 * - White text (text.inverse)
 * - Font size: 12px
 * - Padding: 6px horizontal, 2px vertical
 * - Border radius: 3px
 */
export const tooltipContentVariants = cva(
  // Base styles - ADS tooltip appearance
  [
    // Background and text
    'bg-[var(--color-background-neutral-bold-default,#292a2e)]',
    'text-[var(--color-text-inverse,white)]',
    // Typography
    'text-xs leading-4',
    // Spacing
    'px-1.5 py-0.5',
    // Border radius
    'rounded-[3px]',
    // Z-index for overlay
    'z-50',
    // Motion: scale-fade from the trigger side (Radix transform-origin), faster exit
    'origin-[var(--radix-tooltip-content-transform-origin)]',
    MOTION.surface,
    // Overflow
    'overflow-hidden',
    // Max width for long content
    'max-w-xs',
    // Text overflow handling
    'whitespace-nowrap text-ellipsis',
  ].join(' '),
  {
    variants: {
      // Future variants can be added here
    },
    defaultVariants: {},
  },
)

/**
 * Tooltip arrow variant configuration
 *
 * @description
 * Defines the visual styles for the Tooltip arrow component.
 */
export const tooltipArrowVariants = cva(
  // Base arrow styles
  ['fill-[var(--color-background-neutral-bold-default,#292a2e)]'].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

export type TooltipContentVariants = VariantProps<typeof tooltipContentVariants>
export type TooltipArrowVariants = VariantProps<typeof tooltipArrowVariants>
