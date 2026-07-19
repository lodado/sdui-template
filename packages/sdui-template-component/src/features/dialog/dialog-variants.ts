import { cva, type VariantProps } from 'class-variance-authority'

import { MOTION } from '../../shared/lib/motion'
import type { DialogAppearance, DialogSize } from './types'

/**
 * Dialog overlay (blanket) variant configuration
 *
 * Based on Figma:
 * - Background: color.blanket (rgba(5,12,31,0.46))
 * - Fixed positioning covering entire viewport
 */
export const dialogOverlayVariants = cva(
  [
    'fixed inset-0 z-50',
    'bg-[rgba(5,12,31,0.46)]',
    // Motion: blanket fade, slower in / faster out
    MOTION.overlay,
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog content variant configuration
 *
 * Based on Figma:
 * - Background: elevation.surface.overlay (white)
 * - Shadow: elevation.shadow.overlay
 * - Border radius: 3px
 * - Size variants for width
 */
export const dialogContentVariants = cva(
  [
    'fixed left-[50%] top-[50%] z-50',
    'translate-x-[-50%] translate-y-[-50%]',
    'bg-[var(--color-elevation-surface-overlay,white)]',
    'rounded-[3px]',
    'shadow-[0px_0px_1px_0px_rgba(30,31,33,0.31),0px_8px_12px_0px_rgba(30,31,33,0.15)]',
    'overflow-hidden',
    'flex flex-col',
    'max-h-[85vh]',
    // Focus outline
    'focus:outline-none',
    // Motion: rise-in from slightly below, faster sink-out on close
    'data-[state=open]:animate-[sdui-dialog-in_var(--motion-duration-slow)_var(--motion-ease-out)]',
    'data-[state=closed]:animate-[sdui-dialog-out_var(--motion-duration-medium)_var(--motion-ease-in)]',
  ].join(' '),
  {
    variants: {
      size: {
        small: 'w-[400px]',
        medium: 'w-[600px]',
        large: 'w-[800px]',
        xlarge: 'w-[968px]',
      } as Record<DialogSize, string>,
    },
    defaultVariants: {
      size: 'small',
    },
  },
)

/**
 * Dialog header variant configuration
 *
 * Based on Figma:
 * - Padding: 24px horizontal, 24px top, 16px bottom
 * - Gap: 16px between title and close button
 * - Flex layout with space-between
 */
export const dialogHeaderVariants = cva(
  [
    'flex items-start justify-between',
    'gap-4', // 16px
    'px-6 pt-6 pb-4', // 24px horizontal, 24px top, 16px bottom
    'shrink-0',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog title variant configuration
 *
 * Based on Figma:
 * - Font: heading-m (20px, bold)
 * - Color: color.text (#292a2e)
 * - Line height: 24px
 */
export const dialogTitleVariants = cva(
  [
    'flex-1',
    'text-xl font-bold leading-6', // 20px, bold, 24px line-height
    'text-[var(--color-text-default,#212623)]',
    'min-h-[32px] flex items-center',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog description variant configuration
 *
 * Based on Figma:
 * - Font: body-m (14px, regular)
 * - Color: color.text.subtle
 */
export const dialogDescriptionVariants = cva(
  [
    'text-sm leading-5', // 14px, 20px line-height
    'text-[var(--color-text-subtle,#505258)]',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog close button variant configuration
 *
 * Based on Figma:
 * - Size: 24px (icon button)
 * - Padding: 4px
 * - Border radius: 4px
 * - Hover: neutral background
 */
export const dialogCloseVariants = cva(
  [
    'inline-flex items-center justify-center',
    'rounded-[4px]',
    'p-1', // 4px
    'shrink-0',
    'bg-transparent',
    'text-[var(--color-text-subtle,#505258)]',
    'hover:bg-[var(--color-background-neutral-subtle-hovered,rgba(0,0,0,0.06))]',
    'active:bg-[var(--color-background-neutral-subtle-pressed,rgba(0,0,0,0.1))]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-border-focused,#0d9488)]',
    MOTION.pressable,
    'cursor-pointer',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog body variant configuration
 *
 * Based on Figma:
 * - Padding: 24px horizontal, 0 vertical
 * - Overflow: auto for scrollable content
 */
export const dialogBodyVariants = cva(
  [
    'flex-1',
    'px-6', // 24px horizontal
    'overflow-y-auto',
    'text-sm leading-5', // 14px, 20px line-height
    'text-[var(--color-text-default,#212623)]',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog footer variant configuration
 *
 * Based on Figma:
 * - Padding: 24px horizontal, 16px top, 24px bottom
 * - Gap: 8px between buttons
 * - Justify: end (buttons aligned to right)
 */
export const dialogFooterVariants = cva(
  [
    'flex items-center justify-end',
    'gap-2', // 8px
    'px-6 pt-4 pb-6', // 24px horizontal, 16px top, 24px bottom
    'bg-[var(--color-elevation-surface-overlay,white)]',
    'shrink-0',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

/**
 * Dialog confirm button variant configuration
 *
 * Based on Figma:
 * - Appearance variants: default (primary), danger, warning
 */
export const dialogConfirmButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'min-h-[32px]',
    'px-3', // 12px
    'rounded-[4px]',
    'text-sm font-medium leading-5', // 14px, medium, 20px line-height
    MOTION.pressable,
    'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
  ].join(' '),
  {
    variants: {
      appearance: {
        default: [
          'bg-[var(--color-background-brand-bold-default,#0f766e)]',
          'text-[var(--color-text-inverse,white)]',
          'hover:bg-[var(--color-background-brand-bold-hovered,#115e58)]',
          'active:bg-[var(--color-background-brand-bold-pressed,#134c47)]',
          'focus-visible:ring-[var(--color-border-focused,#0d9488)]',
        ].join(' '),
        danger: [
          'bg-[var(--color-background-danger-bold-default,#c9372c)]',
          'text-[var(--color-text-inverse,white)]',
          'hover:bg-[var(--color-background-danger-bold-hovered,#ae2e24)]',
          'active:bg-[var(--color-background-danger-bold-pressed,#872821)]',
          'focus-visible:ring-[var(--color-border-danger,#e2483d)]',
        ].join(' '),
        warning: [
          'bg-[var(--color-background-warning-bold-default,#fbc828)]',
          'text-[var(--color-text-default,#212623)]',
          'hover:bg-[var(--color-background-warning-bold-hovered,#fca700)]',
          'active:bg-[var(--color-background-warning-bold-pressed,#f68909)]',
          'focus-visible:ring-[var(--color-border-warning,#e06c00)]',
        ].join(' '),
      } as Record<DialogAppearance, string>,
      isDisabled: {
        true: [
          'bg-[var(--color-background-disabled,#17171708)]',
          'text-[var(--color-text-disabled,#080f214a)]',
          'cursor-not-allowed',
          'pointer-events-none',
        ].join(' '),
        false: '',
      },
      isLoading: {
        true: 'cursor-wait',
        false: '',
      },
    },
    defaultVariants: {
      appearance: 'default',
      isDisabled: false,
      isLoading: false,
    },
  },
)

/**
 * Dialog cancel button variant configuration
 *
 * Based on Figma:
 * - Appearance: subtle (transparent background)
 */
export const dialogCancelButtonVariants = cva(
  [
    'inline-flex items-center justify-center',
    'min-h-[32px]',
    'px-3', // 12px
    'rounded-[4px]',
    'text-sm font-medium leading-5', // 14px, medium, 20px line-height
    'bg-transparent',
    'text-[var(--color-text-subtle,#505258)]',
    'hover:bg-[var(--color-background-neutral-subtle-hovered,rgba(0,0,0,0.06))]',
    'active:bg-[var(--color-background-neutral-subtle-pressed,rgba(0,0,0,0.1))]',
    MOTION.pressable,
    'cursor-pointer',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--color-border-focused,#0d9488)]',
  ].join(' '),
  {
    variants: {},
    defaultVariants: {},
  },
)

// Type exports
export type DialogOverlayVariants = VariantProps<typeof dialogOverlayVariants>
export type DialogContentVariants = VariantProps<typeof dialogContentVariants>
export type DialogHeaderVariants = VariantProps<typeof dialogHeaderVariants>
export type DialogTitleVariants = VariantProps<typeof dialogTitleVariants>
export type DialogDescriptionVariants = VariantProps<typeof dialogDescriptionVariants>
export type DialogCloseVariants = VariantProps<typeof dialogCloseVariants>
export type DialogBodyVariants = VariantProps<typeof dialogBodyVariants>
export type DialogFooterVariants = VariantProps<typeof dialogFooterVariants>
export type DialogConfirmButtonVariants = VariantProps<typeof dialogConfirmButtonVariants>
export type DialogCancelButtonVariants = VariantProps<typeof dialogCancelButtonVariants>
