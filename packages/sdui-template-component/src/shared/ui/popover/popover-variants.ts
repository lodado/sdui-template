import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Popover content variants
 *
 * @description
 * Defines styling variants for the Popover content container.
 * Uses CVA (class-variance-authority) for type-safe variant management.
 */
export const popoverContentVariants = cva(
  // Base styles
  [
    'z-50',
    'rounded-md',
    'border',
    'border-gray-200',
    'bg-white',
    'shadow-lg',
    'outline-none',
    // Animation
    'data-[state=open]:animate-in',
    'data-[state=closed]:animate-out',
    'data-[state=closed]:fade-out-0',
    'data-[state=open]:fade-in-0',
    'data-[state=closed]:zoom-out-95',
    'data-[state=open]:zoom-in-95',
    'data-[side=bottom]:slide-in-from-top-2',
    'data-[side=left]:slide-in-from-right-2',
    'data-[side=right]:slide-in-from-left-2',
    'data-[side=top]:slide-in-from-bottom-2',
  ],
  {
    variants: {
      size: {
        small: 'w-48 p-2',
        medium: 'w-64 p-3',
        large: 'w-80 p-4',
      },
    },
    defaultVariants: {
      size: 'medium',
    },
  },
)

export type PopoverContentVariants = VariantProps<typeof popoverContentVariants>

/**
 * Popover close button variants
 */
export const popoverCloseVariants = cva([
  'absolute',
  'right-2',
  'top-2',
  'rounded-sm',
  'opacity-70',
  'ring-offset-background',
  'transition-opacity',
  'hover:opacity-100',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-ring',
  'focus:ring-offset-2',
  'disabled:pointer-events-none',
  'data-[state=open]:bg-accent',
  'data-[state=open]:text-muted-foreground',
])

export type PopoverCloseVariants = VariantProps<typeof popoverCloseVariants>
