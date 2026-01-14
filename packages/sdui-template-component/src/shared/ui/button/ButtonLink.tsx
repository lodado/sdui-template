import NextLink, { type LinkProps } from 'next/link'
import React from 'react'

import { cn } from '../../lib/cn'
import { Button } from './Button'
import type { ButtonSize, ButtonStyle, ButtonType } from './types'

/**
 * ButtonLink component props
 */
export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Pick<LinkProps, 'href'> {
  /** Button style: filled, outline, or text */
  buttonStyle?: ButtonStyle
  /** Button size: L, M, or S */
  size?: ButtonSize
  /** Button type: primary or secondary */
  buttonType?: ButtonType
  /** Whether link is disabled */
  disabled?: boolean
  /** Link content */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
}

/**
 * ButtonLink component
 *
 * @description
 * Button-styled link component that wraps Next.js Link using Button's asChild pattern.
 * Supports the same button styles as Button component (filled/outline/text, sizes L/M/S, types primary/secondary).
 * Requires Next.js to be installed as a peer dependency.
 *
 * @example
 * ```tsx
 * <ButtonLink href="/about" buttonStyle="text" size="S" buttonType="secondary">
 *   About
 * </ButtonLink>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <ButtonLink href="/products" nodeId="link-1" eventId="nav-click" buttonStyle="filled" size="M">
 *   Products
 * </ButtonLink>
 * ```
 */
export const ButtonLink = React.forwardRef<React.ElementRef<typeof NextLink>, ButtonLinkProps>(
  (
    {
      href,
      buttonStyle = 'text',
      size = 'M',
      buttonType = 'primary',
      disabled = false,
      children,
      className,
      nodeId,
      eventId,
      ...props
    },
    ref,
  ) => {
    return (
      <Button
        buttonStyle={buttonStyle}
        size={size}
        buttonType={buttonType}
        disabled={disabled}
        className={className}
        nodeId={nodeId}
        eventId={eventId}
        asChild
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <NextLink href={href} ref={ref} {...props}>
          {children}
        </NextLink>
      </Button>
    )
  },
)

ButtonLink.displayName = 'ButtonLink'
