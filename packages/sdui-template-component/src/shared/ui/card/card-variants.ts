import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Card variant configuration using class-variance-authority
 *
 * @description
 * Defines visual variants Card component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 */
export const cardVariants = cva(
  // Base styles
  'rounded-xl bg-[var(--color-background-neutral-subtle)] shadow-sm p-6',
  {
    variants: {
      // Motion only for clickable cards — static cards stay still (no decorative motion)
      isInteractive: {
        true: 'transition-[transform,box-shadow] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] cursor-pointer hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.99]',
        false: '',
      },
    },
    defaultVariants: {
      isInteractive: false,
    },
  },
)

export type CardVariants = VariantProps<typeof cardVariants>
