import { Slot } from '@radix-ui/react-slot'
import React from 'react'

import { cn } from '../../lib/cn'
import { iconVariants } from './icon-variants'
import type { IconProps, IconSize } from './types'

/**
 * Icon component
 *
 * @description
 * Icon component that can render SVG children or act as a placeholder.
 * Supports predefined sizes (16px, 20px, 24px, 32px, 48px) using Tailwind classes,
 * or any custom CSS size value (e.g., "18px", "1.5rem", "28px", "2em") using inline styles.
 * Automatically applies width/height to SVG children if not provided.
 * Integrates with SDUI template system.
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
 * // SDUI integration
 * <Icon nodeId="icon-1" size="32px">
 *   <svg>...</svg>
 * </Icon>
 * ```
 */

// Predefined sizes for checking if we should use Tailwind classes
// Based on Tailwind spacing scale (4px increments)
const PREDEFINED_SIZES: IconSize[] = ['12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px']

// Helper function to check if size is predefined
const isPredefinedSize = (size: string): size is IconSize => {
  return PREDEFINED_SIZES.includes(size as IconSize)
}

// Helper function to convert size string to number (for SVG width/height props)
const sizeToNumber = (size: string): number | undefined => {
  // Extract numeric value from CSS size string (e.g., "18px" -> 18, "1.5rem" -> undefined)
  const match = size.match(/^(\d+(?:\.\d+)?)px$/)
  if (match) {
    return parseFloat(match[1])
  }
  // For non-px values (rem, em, etc.), return undefined to use the string value directly
  return undefined
}

// Helper function to clone SVG element with auto width/height
const cloneSvgWithSize = (element: React.ReactElement, size: string): React.ReactElement => {
  const numericSize = sizeToNumber(size)

  // If SVG already has width/height, don't override
  if (element.props.width || element.props.height) {
    return element
  }

  // Clone SVG with width and height props
  // Use numeric value if available, otherwise use the string value directly
  return React.cloneElement(element, {
    width: numericSize ?? size,
    height: numericSize ?? size,
    // Preserve existing props
    ...element.props,
  })
}

export const Icon = React.forwardRef<HTMLDivElement, IconProps>(
  (
    {
      size = '16px',
      asChild = false,
      children,
      className,
      nodeId,
      eventId,
      style,
      'aria-label': ariaLabel,
      'aria-hidden': ariaHidden,
      role,
      ...props
    },
    ref,
  ) => {
    // Get variant classes (use Tailwind classes for predefined sizes, base classes for custom sizes)
    const variantClasses = isPredefinedSize(size) ? iconVariants({ size }) : iconVariants()

    // Process children: auto-apply width/height to SVG elements
    const processedChildren = React.Children.map(children, (child) => {
      if (React.isValidElement(child) && child.type === 'svg') {
        return cloneSvgWithSize(child as React.ReactElement<React.SVGProps<SVGSVGElement>>, size)
      }
      return child
    })

    const hasChildren = React.Children.count(children) > 0

    // Default role: 'img' if children exist, 'presentation' if placeholder
    const defaultRole = hasChildren ? 'img' : 'presentation'

    // Apply inline styles only for custom sizes (predefined sizes use Tailwind classes)
    const customSizeStyle: React.CSSProperties | undefined = isPredefinedSize(size)
      ? undefined
      : {
          width: size,
          height: size,
        }

    const mergedClassName = cn(variantClasses, className)
    const mergedStyle = { ...style, ...customSizeStyle }

    if (asChild) {
      return (
        <Slot
          ref={ref}
          className={mergedClassName}
          style={mergedStyle}
          role={role ?? defaultRole}
          aria-label={ariaLabel}
          aria-hidden={ariaHidden ?? (!hasChildren && !ariaLabel ? true : undefined)}
          data-node-id={nodeId}
          data-event-id={eventId}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        >
          {children}
        </Slot>
      )
    }

    return (
      <div
        ref={ref}
        className={mergedClassName}
        style={mergedStyle}
        role={role ?? defaultRole}
        aria-label={ariaLabel}
        aria-hidden={ariaHidden ?? (!hasChildren && !ariaLabel ? true : undefined)}
        data-node-id={nodeId}
        data-event-id={eventId}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {processedChildren}
      </div>
    )
  },
)

Icon.displayName = 'Icon'
