import { cva, type VariantProps } from 'class-variance-authority'

import type { DropdownAppearance, DropdownSpacing } from './types'

/**
 * Dropdown trigger variant configuration (ADS style)
 *
 * Based on Figma design:
 * - Trigger button with chevron icon
 * - Selected state: blue border, blue text, light blue background
 * - Default/Compact spacing options
 */
export const dropdownTriggerVariants = cva(
  // Base styles
  [
    'inline-flex items-center justify-center rounded font-medium',
    'transition-colors cursor-pointer gap-1.5',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'focus-visible:ring-[var(--color-border-focused)]',
  ].join(' '),
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
      } as Record<DropdownAppearance, string>,
      spacing: {
        default: 'min-h-[32px] px-3 text-sm leading-5',
        compact: 'min-h-[24px] px-2 text-xs leading-4',
        cozy: 'min-h-[32px] px-3 text-sm leading-5', // Same as default
      } as Record<DropdownSpacing, string>,
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
      isOpen: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      // Selected state - blue theme (from Figma)
      {
        appearance: 'default',
        isSelected: true,
        isDisabled: false,
        class: [
          'bg-[var(--color-background-selected-default,#e9f2fe)]',
          'border-[var(--color-border-selected,#1868db)]',
          'text-[var(--color-text-selected,#1868db)]',
        ].join(' '),
      },
      // Open state - same as selected
      {
        appearance: 'default',
        isOpen: true,
        isDisabled: false,
        class: [
          'bg-[var(--color-background-selected-default,#e9f2fe)]',
          'border-[var(--color-border-selected,#1868db)]',
          'text-[var(--color-text-selected,#1868db)]',
        ].join(' '),
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
    ],
    defaultVariants: {
      appearance: 'default',
      spacing: 'default',
      isDisabled: false,
      isSelected: false,
      isOpen: false,
    },
  },
)

/**
 * Dropdown content (menu) variant configuration
 *
 * Based on Figma:
 * - White overlay background
 * - Shadow: elevation.shadow.overlay
 * - Border radius: 3px
 * - Padding: 6px vertical
 */
export const dropdownContentVariants = cva(
  [
    'bg-[var(--color-elevation-surface-overlay,white)]',
    'rounded-[3px]',
    'py-1.5', // 6px
    'shadow-[0px_0px_1px_0px_rgba(30,31,33,0.31),0px_8px_12px_0px_rgba(30,31,33,0.15)]',
    'overflow-hidden',
    'z-50',
    'min-w-[160px]',
    // Animation
    'data-[state=open]:animate-in data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ].join(' '),
  {
    variants: {
      spacing: {
        default: '',
        compact: 'py-1', // 4px
        cozy: 'py-1.5', // 6px - same as default
      } as Record<DropdownSpacing, string>,
    },
    defaultVariants: {
      spacing: 'default',
    },
  },
)

/**
 * Dropdown item variant configuration
 *
 * Based on Figma:
 * - Min height: 32px, max height: 52px
 * - Padding: 16px horizontal, 8px vertical
 * - Text: 14px font size, 20px line height
 * - Checkbox: 14px size with 12px gap
 */
export const dropdownItemVariants = cva(
  [
    'flex items-center w-full',
    'min-h-[32px] max-h-[52px]',
    'px-4 py-2', // 16px horizontal, 8px vertical
    'text-sm leading-5', // 14px, 20px line-height
    'text-[var(--color-text-default,#292a2e)]',
    'cursor-pointer',
    'transition-colors',
    'outline-none',
    'hover:bg-[var(--color-background-neutral-subtle-hovered)]',
    'focus:bg-[var(--color-background-neutral-subtle-hovered)]',
    'data-[highlighted]:bg-[var(--color-background-neutral-subtle-hovered)]',
  ].join(' '),
  {
    variants: {
      spacing: {
        default: 'min-h-[32px] px-4 py-2',
        compact: 'min-h-[24px] px-3 py-1',
        cozy: 'min-h-[32px] px-4 py-2',
      } as Record<DropdownSpacing, string>,
      isDisabled: {
        true: [
          'text-[var(--color-text-disabled)]',
          'cursor-not-allowed',
          'pointer-events-none',
          'hover:bg-transparent',
        ].join(' '),
        false: '',
      },
      isSelected: {
        true: 'bg-[var(--color-background-selected-default,#e9f2fe)]',
        false: '',
      },
    },
    defaultVariants: {
      spacing: 'default',
      isDisabled: false,
      isSelected: false,
    },
  },
)

/**
 * Checkbox variant for dropdown items (ADS style)
 *
 * Based on Figma:
 * - Size: 14px
 * - Border: 1px solid color.border.input (#8c8f97)
 * - Background: color.background.input (white)
 * - Border radius: 2px
 * - Focus ring: 2px solid color.border.focused (#4688ec)
 */
export const dropdownCheckboxVariants = cva(
  [
    'inline-flex items-center justify-center',
    'w-3.5 h-3.5', // 14px
    'rounded-sm', // 2px
    'border border-solid',
    'border-[var(--color-border-input,#8c8f97)]',
    'bg-[var(--color-background-input,white)]',
    'transition-colors',
    'shrink-0',
    'focus-visible:ring-2 focus-visible:ring-[var(--color-border-focused,#4688ec)]',
  ].join(' '),
  {
    variants: {
      isChecked: {
        true: [
          'bg-[var(--color-background-brand-bold-default,#1868db)]',
          'border-[var(--color-background-brand-bold-default,#1868db)]',
          'text-white',
        ].join(' '),
        false: '',
      },
      isDisabled: {
        true: [
          'bg-[var(--color-background-disabled)]',
          'border-[var(--color-border-disabled)]',
          'cursor-not-allowed',
        ].join(' '),
        false: '',
      },
    },
    defaultVariants: {
      isChecked: false,
      isDisabled: false,
    },
  },
)

export type DropdownTriggerVariants = VariantProps<typeof dropdownTriggerVariants>
export type DropdownContentVariants = VariantProps<typeof dropdownContentVariants>
export type DropdownItemVariants = VariantProps<typeof dropdownItemVariants>
export type DropdownCheckboxVariants = VariantProps<typeof dropdownCheckboxVariants>
