import { cva, type VariantProps } from 'class-variance-authority'

import { MOTION } from '../../lib/motion'
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
    MOTION.colors,
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      color: {
        standard: [
          'bg-[var(--color-background-neutral-subtle-default,transparent)]',
          'border-[var(--color-border-default,#0b120e24)]',
          'text-[var(--color-text-default,#212623)]',
        ].join(' '),
        blue: [
          'bg-[var(--color-background-information-default,#e9f2fe)]',
          'border-[var(--color-border-information,#357de8)]',
          'text-[var(--color-text-information,#1558bc)]',
        ].join(' '),
        red: [
          'bg-[var(--color-background-danger-default,#ffeceb)]',
          'border-[var(--color-border-danger,#e2483d)]',
          'text-[var(--color-text-danger,#ae2e24)]',
        ].join(' '),
        yellow: [
          'bg-[var(--color-background-warning-default,#fff5db)]',
          'border-[var(--color-border-warning,#e06c00)]',
          'text-[var(--color-text-warning,#9e4c00)]',
        ].join(' '),
        green: [
          'bg-[var(--color-background-success-default,#efffd6)]',
          'border-[var(--color-border-success,#6a9a23)]',
          'text-[var(--color-text-success,#4c6b1f)]',
        ].join(' '),
        teal: [
          'bg-[var(--color-background-accent-teal-subtler-default,#c6edfb)]',
          'border-[var(--color-border-accent-teal,#2898bd)]',
          'text-[var(--color-text-accent-teal-default,#206a83)]',
        ].join(' '),
        purple: [
          'bg-[var(--color-background-accent-purple-subtler-default,#eed7fc)]',
          'border-[var(--color-border-accent-purple,#af59e1)]',
          'text-[var(--color-text-accent-purple-default,#803fa5)]',
        ].join(' '),
        grey: [
          'bg-[var(--color-background-neutral-subtle-default,#00000000)]',
          'border-[var(--color-border-default,#0b120e24)]',
          'text-[var(--color-text-subtlest,#6b6e76)]',
        ].join(' '),
        lime: [
          'bg-[var(--color-background-accent-lime-subtler-default,#d3f1a7)]',
          'border-[var(--color-border-accent-lime,#6a9a23)]',
          'text-[var(--color-text-accent-lime-default,#4c6b1f)]',
        ].join(' '),
        orange: [
          'bg-[var(--color-background-accent-orange-subtler-default,#fce4a6)]',
          'border-[var(--color-border-accent-orange,#e06c00)]',
          'text-[var(--color-text-accent-orange-default,#9e4c00)]',
        ].join(' '),
        magenta: [
          'bg-[var(--color-background-accent-magenta-subtler-default,#fdd0ec)]',
          'border-[var(--color-border-accent-magenta,#cd519d)]',
          'text-[var(--color-text-accent-magenta-default,#943d73)]',
        ].join(' '),
      } as Record<TagColor, string>,
    },
    defaultVariants: {
      color: 'standard',
    },
  },
)

export type TagVariants = VariantProps<typeof tagVariants>
