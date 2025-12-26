import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonVariant, ButtonSize } from './types'

/**
 * Button variant configuration using class-variance-authority
 *
 * @description
 * Defines the visual variants and sizes for the Button component.
 * Uses Tailwind CSS classes for styling.
 */
export const buttonVariants = cva(
  // Base styles
  'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-400',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-400',
        ghost: 'hover:bg-gray-100 focus-visible:ring-gray-400',
      } as Record<ButtonVariant, string>,
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg',
      } as Record<ButtonSize, string>,
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>

