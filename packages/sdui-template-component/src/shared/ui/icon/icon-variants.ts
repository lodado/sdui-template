import { cva, type VariantProps } from 'class-variance-authority'

import type { IconSize } from './types'

/**
 * Icon variant configuration using class-variance-authority
 *
 * @description
 * Defines the size variants for the Icon component.
 * Predefined sizes use Tailwind CSS classes for optimal performance.
 * Custom sizes (not in this list) will use inline styles instead.
 * Ensures square aspect ratio (1:1) for all sizes.
 * Uses CSS variables from @lodado/sdui-design-files for colors.
 */
export const iconVariants = cva(
  // Base styles: square aspect ratio, flexbox for centering children, default icon color
  'inline-flex items-center justify-center shrink-0 text-[var(--color-icon-default)]',
  {
    variants: {
      size: {
        '12px': 'w-3 h-3', // 12px = 0.75rem = 3 * 4px (Tailwind spacing scale)
        '16px': 'w-4 h-4', // 16px = 1rem = 4 * 4px
        '20px': 'w-5 h-5', // 20px = 1.25rem = 5 * 4px
        '24px': 'w-6 h-6', // 24px = 1.5rem = 6 * 4px
        '32px': 'w-8 h-8', // 32px = 2rem = 8 * 4px
        '40px': 'w-10 h-10', // 40px = 2.5rem = 10 * 4px
        '48px': 'w-12 h-12', // 48px = 3rem = 12 * 4px
        '64px': 'w-16 h-16', // 64px = 4rem = 16 * 4px
      } as Record<IconSize, string>,
    },
    defaultVariants: {
      size: '16px',
    },
  },
)

export type IconVariants = VariantProps<typeof iconVariants>
