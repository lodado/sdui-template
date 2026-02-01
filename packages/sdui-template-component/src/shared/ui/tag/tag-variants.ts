import { cva, type VariantProps } from 'class-variance-authority'

import type { TagColor } from './types'

/**
 * Tag variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants for the Tag component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Supports:
 * - color: standard, blue, red, yellow, green, teal, purple, grey, lime, orange, magenta
 * - isLink: true/false (underline text style)
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
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--color-border-focused)]',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      color: {
        standard: [
          'bg-[var(--color-background-neutral-subtle-default,transparent)]',
          'border-[var(--color-border-default,#b7b9be)]',
          'text-[var(--color-text-default,#292a2e)]',
          'hover:bg-[var(--color-background-neutral-subtle-hovered)]',
          'active:bg-[var(--color-background-neutral-subtle-pressed)]',
        ].join(' '),
        blue: [
          'bg-[var(--color-background-information-default,#e9f2ff)]',
          'border-[var(--color-border-information,#579dff)]',
          'text-[var(--color-text-information,#0c66e4)]',
          'hover:bg-[var(--color-background-information-hovered,#cce0ff)]',
          'active:bg-[var(--color-background-information-pressed,#85b8ff)]',
        ].join(' '),
        red: [
          'bg-[var(--color-background-danger-default,#ffeceb)]',
          'border-[var(--color-border-danger,#f87462)]',
          'text-[var(--color-text-danger,#ae2a19)]',
          'hover:bg-[var(--color-background-danger-hovered,#ffd2cc)]',
          'active:bg-[var(--color-background-danger-pressed,#ff9c8f)]',
        ].join(' '),
        yellow: [
          'bg-[var(--color-background-warning-default,#fff7d6)]',
          'border-[var(--color-border-warning,#f5cd47)]',
          'text-[var(--color-text-warning,#7f5f01)]',
          'hover:bg-[var(--color-background-warning-hovered,#f8e6a0)]',
          'active:bg-[var(--color-background-warning-pressed,#f5cd47)]',
        ].join(' '),
        green: [
          'bg-[var(--color-background-success-default,#dffcf0)]',
          'border-[var(--color-border-success,#4bce97)]',
          'text-[var(--color-text-success,#216e4e)]',
          'hover:bg-[var(--color-background-success-hovered,#baf3db)]',
          'active:bg-[var(--color-background-success-pressed,#7ee2b8)]',
        ].join(' '),
        teal: [
          'bg-[var(--color-background-accent-teal-subtler,#e3fafc)]',
          'border-[var(--color-border-accent-teal,#60c6d2)]',
          'text-[var(--color-text-accent-teal,#206b74)]',
          'hover:bg-[var(--color-background-accent-teal-subtler-hovered,#c1f0f5)]',
          'active:bg-[var(--color-background-accent-teal-subtler-pressed,#8bdbe5)]',
        ].join(' '),
        purple: [
          'bg-[var(--color-background-accent-purple-subtler,#f3f0ff)]',
          'border-[var(--color-border-accent-purple,#9f8fef)]',
          'text-[var(--color-text-accent-purple,#5e4db2)]',
          'hover:bg-[var(--color-background-accent-purple-subtler-hovered,#dfd8fd)]',
          'active:bg-[var(--color-background-accent-purple-subtler-pressed,#b8acf6)]',
        ].join(' '),
        grey: [
          'bg-[var(--color-background-neutral-subtle-default,#f1f2f4)]',
          'border-[var(--color-border-default,#8c8f97)]',
          'text-[var(--color-text-subtlest,#626f86)]',
          'hover:bg-[var(--color-background-neutral-subtle-hovered,#dcdfe4)]',
          'active:bg-[var(--color-background-neutral-subtle-pressed,#b3b9c4)]',
        ].join(' '),
        lime: [
          'bg-[var(--color-background-accent-lime-subtler,#eefbda)]',
          'border-[var(--color-border-accent-lime,#94c748)]',
          'text-[var(--color-text-accent-lime,#4c6b1f)]',
          'hover:bg-[var(--color-background-accent-lime-subtler-hovered,#d3f1a7)]',
          'active:bg-[var(--color-background-accent-lime-subtler-pressed,#b3df72)]',
        ].join(' '),
        orange: [
          'bg-[var(--color-background-accent-orange-subtler,#fff4e5)]',
          'border-[var(--color-border-accent-orange,#faa53d)]',
          'text-[var(--color-text-accent-orange,#974f0c)]',
          'hover:bg-[var(--color-background-accent-orange-subtler-hovered,#ffe2bd)]',
          'active:bg-[var(--color-background-accent-orange-subtler-pressed,#fec57b)]',
        ].join(' '),
        magenta: [
          'bg-[var(--color-background-accent-magenta-subtler,#ffecf8)]',
          'border-[var(--color-border-accent-magenta,#e774bb)]',
          'text-[var(--color-text-accent-magenta,#943d73)]',
          'hover:bg-[var(--color-background-accent-magenta-subtler-hovered,#fdd0ec)]',
          'active:bg-[var(--color-background-accent-magenta-subtler-pressed,#f797d2)]',
        ].join(' '),
      } as Record<TagColor, string>,
      isLink: {
        true: 'cursor-pointer underline',
        false: '',
      },
      isClickable: {
        true: 'cursor-pointer',
        false: '',
      },
    },
    defaultVariants: {
      color: 'standard',
      isLink: false,
      isClickable: false,
    },
  },
)

/**
 * Remove button variant for Tag
 */
export const tagRemoveButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'ml-0.5 -mr-0.5',
    'w-4 h-4',
    'rounded-sm',
    'transition-colors',
    'hover:bg-black/10',
    'active:bg-black/20',
    'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-border-focused)]',
  ].join(' '),
  {
    variants: {
      color: {
        standard: 'text-[var(--color-text-subtlest,#626f86)] hover:text-[var(--color-text-default)]',
        blue: 'text-[var(--color-text-information,#0c66e4)] hover:text-[var(--color-text-information)]',
        red: 'text-[var(--color-text-danger,#ae2a19)] hover:text-[var(--color-text-danger)]',
        yellow: 'text-[var(--color-text-warning,#7f5f01)] hover:text-[var(--color-text-warning)]',
        green: 'text-[var(--color-text-success,#216e4e)] hover:text-[var(--color-text-success)]',
        teal: 'text-[var(--color-text-accent-teal,#206b74)] hover:text-[var(--color-text-accent-teal)]',
        purple: 'text-[var(--color-text-accent-purple,#5e4db2)] hover:text-[var(--color-text-accent-purple)]',
        grey: 'text-[var(--color-text-subtlest,#626f86)] hover:text-[var(--color-text-default)]',
        lime: 'text-[var(--color-text-accent-lime,#4c6b1f)] hover:text-[var(--color-text-accent-lime)]',
        orange: 'text-[var(--color-text-accent-orange,#974f0c)] hover:text-[var(--color-text-accent-orange)]',
        magenta: 'text-[var(--color-text-accent-magenta,#943d73)] hover:text-[var(--color-text-accent-magenta)]',
      } as Record<TagColor, string>,
    },
    defaultVariants: {
      color: 'standard',
    },
  },
)

export type TagVariants = VariantProps<typeof tagVariants>
export type TagRemoveButtonVariants = VariantProps<typeof tagRemoveButtonVariants>
