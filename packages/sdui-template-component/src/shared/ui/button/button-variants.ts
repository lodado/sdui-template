import { cva, type VariantProps } from 'class-variance-authority'

import type { ButtonAppearance, ButtonSpacing } from './types'

/**
 * Button variant configuration using class-variance-authority (ADS style)
 *
 * @description
 * Defines the visual variants and sizes for the Button component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Supports:
 * - appearance: default, primary, subtle, warning, danger
 * - spacing: default (32px), compact (24px)
 * - isDisabled: true/false
 * - isSelected: true/false
 */
export const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-border-focused)] cursor-pointer gap-1.5',
  {
    variants: {
      appearance: {
        default: [
          'bg-[var(--color-background-neutral-subtle-default)]',
          'border border-solid border-[var(--color-border-default)]',
          'text-[var(--color-text-default)]',
          'hover:bg-[var(--color-background-neutral-subtle-hovered)]',
          'active:bg-[var(--color-background-neutral-subtle-pressed)]',
        ].join(' '),
        primary: [
          'bg-[var(--color-background-brand-bold-default)]',
          'text-[var(--color-text-inverse)]',
          'hover:bg-[var(--color-background-brand-bold-hovered)]',
          'active:bg-[var(--color-background-brand-bold-pressed)]',
        ].join(' '),
        subtle: [
          'bg-transparent',
          'text-[var(--color-text-subtle)]',
          'hover:bg-[var(--color-background-neutral-subtle-hovered)]',
          'active:bg-[var(--color-background-neutral-subtle-pressed)]',
        ].join(' '),
        warning: [
          'bg-[var(--color-background-warning-bold-default)]',
          'text-[var(--color-text-warning-inverse)]',
          'hover:bg-[var(--color-background-warning-bold-hovered)]',
          'active:bg-[var(--color-background-warning-bold-pressed)]',
        ].join(' '),
        danger: [
          'bg-[var(--color-background-danger-bold-default)]',
          'text-[var(--color-text-inverse)]',
          'hover:bg-[var(--color-background-danger-bold-hovered)]',
          'active:bg-[var(--color-background-danger-bold-pressed)]',
        ].join(' '),
      } as Record<ButtonAppearance, string>,
      spacing: {
        default: 'min-h-[32px] px-3 text-sm leading-5', // 32px height, 12px padding
        compact: 'min-h-[24px] px-2 text-xs leading-4', // 24px height, 8px padding
      } as Record<ButtonSpacing, string>,
      isDisabled: {
        true: [
          'bg-[var(--color-background-disabled)]',
          'text-[var(--color-text-disabled)]',
          'border-[var(--color-border-disabled)]',
          'cursor-not-allowed',
          'pointer-events-none',
        ].join(' '),
        false: '',
      },
      isSelected: {
        true: '',
        false: '',
      },
      isLoading: {
        true: 'cursor-wait pointer-events-none',
        false: '',
      },
    },
    compoundVariants: [
      // Selected state - appearance specific backgrounds
      {
        appearance: 'default',
        isSelected: true,
        isDisabled: false,
        class: 'bg-[var(--color-background-selected-default)] text-[var(--color-text-selected)]',
      },
      {
        appearance: 'primary',
        isSelected: true,
        isDisabled: false,
        class: 'bg-[var(--color-background-selected-bold-default)]',
      },
      {
        appearance: 'subtle',
        isSelected: true,
        isDisabled: false,
        class: 'bg-[var(--color-background-selected-default)] text-[var(--color-text-selected)]',
      },
      {
        appearance: 'warning',
        isSelected: true,
        isDisabled: false,
        class: 'bg-[var(--color-background-warning-bold-pressed)]',
      },
      {
        appearance: 'danger',
        isSelected: true,
        isDisabled: false,
        class: 'bg-[var(--color-background-danger-bold-pressed)]',
      },
      // Disabled state overrides - remove border for non-default appearances
      {
        appearance: 'primary',
        isDisabled: true,
        class: 'border-none',
      },
      {
        appearance: 'subtle',
        isDisabled: true,
        class: 'border-none bg-transparent',
      },
      {
        appearance: 'warning',
        isDisabled: true,
        class: 'border-none',
      },
      {
        appearance: 'danger',
        isDisabled: true,
        class: 'border-none',
      },
    ],
    defaultVariants: {
      appearance: 'default',
      spacing: 'default',
      isDisabled: false,
      isSelected: false,
      isLoading: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
