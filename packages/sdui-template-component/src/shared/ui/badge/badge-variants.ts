import { cva, type VariantProps } from 'class-variance-authority'

import type { BadgeAppearance } from './types'

/**
 * Badge variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Badge component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Design specs from Figma:
 * - Height: 16px
 * - Min Width: 24px
 * - Padding: 4px horizontal (xxsmall)
 * - Border Radius: 2px
 * - Border: none
 * - Font Size: 12px (Body S)
 * - Line Height: 16px
 * - Background: neutral300 (#dddee1)
 * - Text Color: neutral1000 (#292a2e)
 */
export const badgeVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'h-4 min-w-6 px-1 rounded-[2px]',
    'text-xs leading-4',
    'whitespace-nowrap',
    'content-stretch',
  ].join(' '),
  {
    variants: {
      appearance: {
        default: [
          'bg-[var(--neutral/opaque/neutral300,#dddee1)]',
          'text-[color:var(--neutral/opaque/neutral1000,#292a2e)]',
        ].join(' '),
      } as Record<BadgeAppearance, string>,
    },
    defaultVariants: {
      appearance: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
