import { cva, type VariantProps } from 'class-variance-authority'

import type { ListIconColor } from './types'

/**
 * List variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants for the List component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 */
export const listVariants = cva(
  // Base styles
  'flex w-full items-center gap-3 rounded-lg bg-[#F9FAFB] p-4 transition-colors disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: 'cursor-pointer',
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
)

export type ListVariants = VariantProps<typeof listVariants>

/**
 * List Icon variant configuration
 *
 * @description
 * Defines the visual variants for the List Icon component.
 * Circular background with color variants.
 */
export const listIconVariants = cva(
  // Base styles
  'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
  {
    variants: {
      color: {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500',
        default: 'bg-[var(--color-background-neutral-subtle)]',
      } as Record<ListIconColor, string>,
    },
    defaultVariants: {
      color: 'default',
    },
  },
)

export type ListIconVariants = VariantProps<typeof listIconVariants>
