import NextLink, { type LinkProps } from 'next/link'
import React from 'react'

import { Button } from './Button'
import type { ButtonAppearance, ButtonSpacing } from './types'

/**
 * ButtonLink component props
 */
export interface ButtonLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>,
    Pick<LinkProps, 'href'> {
  /** Button appearance: default, primary, subtle, warning, danger */
  appearance?: ButtonAppearance
  /** Button spacing: default (32px), compact (24px) */
  spacing?: ButtonSpacing
  /** Whether link is disabled */
  isDisabled?: boolean
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
 * Supports the same button styles as Button component (ADS style).
 * Requires Next.js to be installed as a peer dependency.
 *
 * @example
 * ```tsx
 * <ButtonLink href="/about" appearance="subtle">
 *   About
 * </ButtonLink>
 * ```
 *
 * @example
 * ```tsx
 * // SDUI integration
 * <ButtonLink href="/products" nodeId="link-1" eventId="nav-click" appearance="primary">
 *   Products
 * </ButtonLink>
 * ```
 */
export const ButtonLink = React.forwardRef<React.ElementRef<typeof NextLink>, ButtonLinkProps>(
  (
    {
      href,
      appearance = 'subtle',
      spacing = 'default',
      isDisabled = false,
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
        appearance={appearance}
        spacing={spacing}
        isDisabled={isDisabled}
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
