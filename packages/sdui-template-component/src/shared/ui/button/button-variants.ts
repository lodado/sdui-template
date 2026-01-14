import { cva, type VariantProps } from 'class-variance-authority'

import type { ButtonSize, ButtonStyle, ButtonType } from './types'

/**
 * Button variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants and sizes for the Button component.
 * Uses Tailwind CSS classes with CSS variables from @lodado/sdui-design-files.
 *
 * Supports:
 * - style: filled, outline, text
 * - size: L, M, S
 * - type: primary, secondary
 */
export const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none cursor-pointer',
  {
    variants: {
      style: {
        filled: '',
        outline: 'border bg-transparent',
        text: '',
      } as Record<ButtonStyle, string>,
      size: {
        L: 'text-base leading-[1.5]', // 16px text, line-height 1.5
        M: 'text-sm leading-[1.429]', // 14px text, line-height 1.429
        S: 'text-xs leading-[1.333]', // 12px text, line-height 1.333
      } as Record<ButtonSize, string>,
      type: {
        primary: '',
        secondary: '',
      } as Record<ButtonType, string>,
      disabled: {
        true: 'opacity-50 cursor-not-allowed',
        false: '',
      },
    },
    compoundVariants: [
      // Filled + Primary + Size (height + padding)
      {
        style: 'filled',
        type: 'primary',
        size: 'L',
        class:
          'h-12 px-4 bg-[var(--color-background-brand-bold-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-background-brand-bold-hovered)] active:bg-[var(--color-background-brand-bold-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'filled',
        type: 'primary',
        size: 'M',
        class:
          'h-10 px-4 bg-[var(--color-background-brand-bold-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-background-brand-bold-hovered)] active:bg-[var(--color-background-brand-bold-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'filled',
        type: 'primary',
        size: 'S',
        class:
          'h-8 px-3 bg-[var(--color-background-brand-bold-default)] text-[var(--color-text-inverse)] hover:bg-[var(--color-background-brand-bold-hovered)] active:bg-[var(--color-background-brand-bold-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      // Filled + Secondary + Size (height + padding)
      {
        style: 'filled',
        type: 'secondary',
        size: 'L',
        class:
          'h-12 px-4 bg-[var(--color-background-accent-gray-subtler-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-accent-gray-subtler-hovered)] active:bg-[var(--color-background-accent-gray-subtler-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'filled',
        type: 'secondary',
        size: 'M',
        class:
          'h-10 px-4 bg-[var(--color-background-accent-gray-subtler-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-accent-gray-subtler-hovered)] active:bg-[var(--color-background-accent-gray-subtler-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'filled',
        type: 'secondary',
        size: 'S',
        class:
          'h-8 px-3 bg-[var(--color-background-accent-gray-subtler-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-accent-gray-subtler-hovered)] active:bg-[var(--color-background-accent-gray-subtler-pressed)] disabled:bg-[var(--color-background-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      // Outline + Primary + Size (height + padding)
      {
        style: 'outline',
        type: 'primary',
        size: 'L',
        class:
          'h-12 px-4 border-[var(--color-border-brand)] text-[var(--color-text-brand)] hover:bg-[var(--color-background-brand-subtlest-default)] active:bg-[var(--color-background-brand-subtlest-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'outline',
        type: 'primary',
        size: 'M',
        class:
          'h-10 px-4 border-[var(--color-border-brand)] text-[var(--color-text-brand)] hover:bg-[var(--color-background-brand-subtlest-default)] active:bg-[var(--color-background-brand-subtlest-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'outline',
        type: 'primary',
        size: 'S',
        class:
          'h-8 px-3 border-[var(--color-border-brand)] text-[var(--color-text-brand)] hover:bg-[var(--color-background-brand-subtlest-default)] active:bg-[var(--color-background-brand-subtlest-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      // Outline + Secondary + Size (height + padding)
      {
        style: 'outline',
        type: 'secondary',
        size: 'L',
        class:
          'h-12 px-4 border-[var(--color-border-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-neutral-default)] active:bg-[var(--color-background-neutral-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'outline',
        type: 'secondary',
        size: 'M',
        class:
          'h-10 px-4 border-[var(--color-border-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-neutral-default)] active:bg-[var(--color-background-neutral-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      {
        style: 'outline',
        type: 'secondary',
        size: 'S',
        class:
          'h-8 px-3 border-[var(--color-border-default)] text-[var(--color-text-default)] hover:bg-[var(--color-background-neutral-default)] active:bg-[var(--color-background-neutral-hovered)] disabled:border-[var(--color-border-disabled)] disabled:text-[var(--color-text-disabled)]',
      },
      // Text + Primary (no height, no padding - 텍스트 높이에 맞춤)
      {
        style: 'text',
        type: 'primary',
        class:
          'text-[var(--color-text-brand)] hover:bg-[var(--color-background-brand-subtlest-default)] active:bg-[var(--color-background-brand-subtlest-hovered)] disabled:text-[var(--color-text-disabled)]',
      },
      // Text + Secondary (no height, no padding - 텍스트 높이에 맞춤)
      {
        style: 'text',
        type: 'secondary',
        class:
          'text-[var(--color-text-subtle)] hover:bg-[var(--color-background-neutral-default)] active:bg-[var(--color-background-neutral-hovered)] disabled:text-[var(--color-text-disabled)]',
      },
    ],
    defaultVariants: {
      style: 'filled',
      size: 'M',
      type: 'primary',
      disabled: false,
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
