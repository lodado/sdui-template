import React from 'react'

/**
 * Predefined icon sizes based on Tailwind spacing scale
 * These sizes use Tailwind CSS classes for optimal performance.
 * Based on Tailwind's default spacing scale (4px increments).
 */
export type IconSize =
  | '12px' // w-3 h-3 (3 * 4px)
  | '16px' // w-4 h-4 (4 * 4px)
  | '20px' // w-5 h-5 (5 * 4px)
  | '24px' // w-6 h-6 (6 * 4px)
  | '32px' // w-8 h-8 (8 * 4px)
  | '40px' // w-10 h-10 (10 * 4px)
  | '48px' // w-12 h-12 (12 * 4px)
  | '64px' // w-16 h-16 (16 * 4px)

/**
 * Icon component props
 *
 * @description
 * Icon component that can render SVG children or act as a placeholder.
 * Supports predefined sizes (12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px) using Tailwind classes,
 * or any custom CSS size value (e.g., "18px", "1.5rem", "28px", "2em") using inline styles.
 * Predefined sizes are based on Tailwind's spacing scale (4px increments).
 * Automatically applies width/height to SVG children if not provided.
 * Integrates with SDUI template system.
 *
 * @param size - Icon size: predefined sizes (12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px) or custom CSS size value (e.g., "18px", "1.5rem") (default: '16px')
 * @param children - SVG element or React node to render inside icon container
 * @param className - Additional CSS classes (merged with defaults)
 * @param nodeId - SDUI node ID for integration (optional)
 * @param eventId - Event ID for event emission (optional)
 * @param 'aria-label' - Accessible label for screen readers (optional)
 * @param 'aria-hidden' - Hide from screen readers (optional)
 * @param 'role' - ARIA role: 'img' or 'presentation' (optional, defaults to 'img' if children exist, 'presentation' otherwise)
 * @param asChild - Render as child element instead of div (optional)
 *
 * @example
 * ```tsx
 * // Predefined size (uses Tailwind classes)
 * <Icon size="24px">
 *   <svg viewBox="0 0 24 24" fill="none">
 *     <path d="..." fill="currentColor" />
 *   </svg>
 * </Icon>
 * ```
 *
 * @example
 * ```tsx
 * // Custom size (uses inline styles)
 * <Icon size="18px">
 *   <svg viewBox="0 0 24 24" fill="none">
 *     <path d="..." fill="currentColor" />
 *   </svg>
 * </Icon>
 * ```
 *
 * @example
 * ```tsx
 * // Using rem units (uses inline styles)
 * <Icon size="1.5rem">
 *   <svg viewBox="0 0 24 24" fill="none">
 *     <path d="..." fill="currentColor" />
 *   </svg>
 * </Icon>
 * ```
 *
 * @example
 * ```tsx
 * // Placeholder (no children)
 * <Icon size="24px" aria-label="Icon placeholder" />
 * ```
 *
 * @example
 * ```tsx
 * // Use asChild to apply Icon styles to a Link
 * <Icon asChild size="24px">
 *   <a href="/about">
 *     <svg>...</svg>
 *   </a>
 * </Icon>
 * ```
 */
export interface IconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Icon size: predefined sizes (12px, 16px, 20px, 24px, 32px, 40px, 48px, 64px) or custom CSS size value (e.g., "18px", "1.5rem") */
  size?: IconSize | string
  /** SVG element or React node to render inside icon container */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Render as child element instead of div */
  asChild?: boolean
}
