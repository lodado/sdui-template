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
 */
export const badgeVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'h-4 min-w-6 px-1 rounded-[2px]',
    'text-xs leading-4',
    'whitespace-nowrap',
    'content-stretch',
    'font-[family-name:var(--🌮-font-family/body,\'Atlassian_Sans:Regular\',sans-serif)]',
    'leading-[var(--🌮-line-height/body-s,16px)]',
    'not-italic',
    'text-center',
  ].join(' '),
  {
    variants: {
      appearance: {
        default: [
          'bg-[var(--neutral-opaque-neutral300,#dddee1)]',
          'text-[var(--neutral-opaque-neutral1000,#292a2e)]',
        ].join(' '),
        primary: [
          'bg-[var(--blue-blue300,#8fb8f6)]',
          'text-[var(--neutral-opaque-neutral1000,#292a2e)]',
        ].join(' '),
        primaryInverted: [
          'bg-[var(--elevation-surface-default,#ffffff)]',
          'text-[var(--color-text-brand,#1868db)]',
        ].join(' '),
        important: [
          'bg-[var(--red-red300,#fd9891)]',
          'text-[var(--neutral-opaque-neutral1000,#292a2e)]',
        ].join(' '),
        added: [
          'bg-[var(--color-background-success-default,#efffd6)]',
          'text-[var(--color-text-default,#292a2e)]',
        ].join(' '),
        removed: [
          'bg-[var(--color-background-danger-default,#ffeceb)]',
          'text-[var(--color-text-default,#292a2e)]',
        ].join(' '),
      } as Record<BadgeAppearance, string>,
    },
    defaultVariants: {
      appearance: 'default',
    },
  },
)

export type BadgeVariants = VariantProps<typeof badgeVariants>
