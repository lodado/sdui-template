import { cva, type VariantProps } from 'class-variance-authority'

import type { TagColor } from './types'

/**
 * Tag variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Tag component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Design specs from Figma:
 * - Height: 20px
 * - Padding: 4px horizontal
 * - Border Radius: 3px
 * - Border: 1px solid
 * - Font Size: 14px
 * - Line Height: 20px
 */
export const tagVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center',
    'h-5 px-1 rounded-[3px]',
    'border border-solid',
    'text-sm leading-5',
    'transition-colors',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      color: {
        standard: [
          'bg-[var(--color-background-neutral-subtle-default,transparent)]',
          'border-[var(--color-border-default,#b7b9be)]',
          'text-[var(--color-text-default,#292a2e)]',
        ].join(' '),
        blue: [
          'bg-[var(--color-background-information-default,#e9f2ff)]',
          'border-[var(--color-border-information,#579dff)]',
          'text-[var(--color-text-information,#0c66e4)]',
        ].join(' '),
        red: [
          'bg-[var(--color-background-danger-default,#ffeceb)]',
          'border-[var(--color-border-danger,#f87462)]',
          'text-[var(--color-text-danger,#ae2a19)]',
        ].join(' '),
        yellow: [
          'bg-[var(--color-background-warning-default,#fff7d6)]',
          'border-[var(--color-border-warning,#f5cd47)]',
          'text-[var(--color-text-warning,#7f5f01)]',
        ].join(' '),
        green: [
          'bg-[var(--color-background-success-default,#dffcf0)]',
          'border-[var(--color-border-success,#4bce97)]',
          'text-[var(--color-text-success,#216e4e)]',
        ].join(' '),
        teal: [
          'bg-[var(--color-background-accent-teal-subtler,#e3fafc)]',
          'border-[var(--color-border-accent-teal,#60c6d2)]',
          'text-[var(--color-text-accent-teal,#206b74)]',
        ].join(' '),
        purple: [
          'bg-[var(--color-background-accent-purple-subtler,#f3f0ff)]',
          'border-[var(--color-border-accent-purple,#9f8fef)]',
          'text-[var(--color-text-accent-purple,#5e4db2)]',
        ].join(' '),
        grey: [
          'bg-[var(--color-background-neutral-subtle-default,#f1f2f4)]',
          'border-[var(--color-border-default,#8c8f97)]',
          'text-[var(--color-text-subtlest,#626f86)]',
        ].join(' '),
        lime: [
          'bg-[var(--color-background-accent-lime-subtler,#eefbda)]',
          'border-[var(--color-border-accent-lime,#94c748)]',
          'text-[var(--color-text-accent-lime,#4c6b1f)]',
        ].join(' '),
        orange: [
          'bg-[var(--color-background-accent-orange-subtler,#fff4e5)]',
          'border-[var(--color-border-accent-orange,#faa53d)]',
          'text-[var(--color-text-accent-orange,#974f0c)]',
        ].join(' '),
        magenta: [
          'bg-[var(--color-background-accent-magenta-subtler,#ffecf8)]',
          'border-[var(--color-border-accent-magenta,#e774bb)]',
          'text-[var(--color-text-accent-magenta,#943d73)]',
        ].join(' '),
      } as Record<TagColor, string>,
    },
    defaultVariants: {
      color: 'standard',
    },
  },
)

export type TagVariants = VariantProps<typeof tagVariants>
