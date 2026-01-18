import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Card variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants for the Card component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 */
export const cardVariants = cva(
  // Base styles
  'rounded-xl bg-[var(--color-background-neutral-subtle)] shadow-sm p-6',
  {
    variants: {},
    defaultVariants: {},
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
