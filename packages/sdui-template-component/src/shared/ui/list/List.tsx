import React, { useMemo } from 'react'

import { cn } from '../../lib/cn'
import { Icon } from '../icon'
import { listIconVariants, listVariants } from './list-variants'
import { ListContext, type ListContextValue } from './ListContext'
import type {
  ListArrowProps,
  ListContentProps,
  ListDescriptionProps,
  ListIconProps,
  ListProps,
  ListTitleProps,
} from './types'

/**
 * List Root Component
 *
 * @description
 * Root component for List compound component pattern.
 * Provides Context to child components (Icon, Content, Title, Description, Arrow).
 * Renders as div element.
 *
 * @example
 * ```tsx
 * <List onClick={handleClick}>
 *   <List.Icon color="blue">
 *     <BookIcon />
 *   </List.Icon>
 *   <List.Content>
 *     <List.Title>Read Article</List.Title>
 *     <List.Description>Read today’s recommended article and save new words.</List.Description>
 *   </List.Content>
 *   <List.Arrow />
 * </List>
 * ```
 */
const ListRoot = React.forwardRef<HTMLDivElement, ListProps>(
  (
    {
      disabled = false,
      className,
      nodeId,
      eventId,
      children,
      ...props
    },
    ref,
  ) => {
    // Create context value (memoized to prevent unnecessary re-renders)
    const contextValue: ListContextValue = useMemo(
      () => ({
        disabled,
      }),
      [disabled],
    )

    // Get variant classes
    const variantClasses = listVariants({ disabled })

    const mergedClassName = cn(variantClasses, className)


    return (
      <div
        ref={ref}
        className={mergedClassName}
        tabIndex={disabled ? undefined : 0}
        aria-disabled={disabled}
        data-node-id={nodeId}
        data-event-id={eventId}

        {...(props as React.HTMLAttributes<HTMLDivElement>)}
      >
        <ListContext.Provider value={contextValue}>{children}</ListContext.Provider>
      </div>
    )
  },
)

ListRoot.displayName = 'List'

/**
 * List Icon Component
 *
 * @description
 * Icon component for List compound pattern.
 * Wraps shared Icon component with circular colored background.
 *
 * @example
 * ```tsx
 * <List.Icon color="blue">
 *   <svg viewBox="0 0 24 24">
 *     <path d="..." />
 *   </svg>
 * </List.Icon>
 * ```
 */
const ListIcon = React.forwardRef<HTMLDivElement, ListIconProps>(
  ({ children, className, color = 'default', ...props }, ref) => {
    const variantClasses = listIconVariants({ color })

    return (
      <div
        ref={ref}
        className={cn(variantClasses, className)}
        aria-hidden="true"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <Icon size="24px">{children}</Icon>
      </div>
    )
  },
)

ListIcon.displayName = 'List.Icon'

/**
 * List Content Component
 *
 * @description
 * Content container for List compound pattern.
 * Wraps title and description with flex-1 for proper spacing.
 *
 * @example
 * ```tsx
 * <List.Content>
 *   <List.Title>Read Article</List.Title>
 *   <List.Description>Read today’s recommended article and save new words.</List.Description>
 * </List.Content>
 * ```
 */
const ListContent = React.forwardRef<HTMLDivElement, ListContentProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-1 flex-col gap-1', className)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {children}
      </div>
    )
  },
)

ListContent.displayName = 'List.Content'

/**
 * List Title Component
 *
 * @description
 * Title component for List compound pattern.
 * Displays bold title text.
 *
 * @example
 * ```tsx
 * <List.Title>Read Article</List.Title>
 * ```
 */
const ListTitle = React.forwardRef<HTMLDivElement, ListTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-base font-semibold text-[var(--color-text-default)]', className)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {children}
      </div>
    )
  },
)

ListTitle.displayName = 'List.Title'

/**
 * List Description Component
 *
 * @description
 * Description component for List compound pattern.
 * Displays lighter description text.
 *
 * @example
 * ```tsx
 * <List.Description>Read today’s recommended article and save new words.</List.Description>
 * ```
 */
const ListDescription = React.forwardRef<HTMLDivElement, ListDescriptionProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('text-sm text-[var(--color-text-subtle)]', className)}
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        {children}
      </div>
    )
  },
)

ListDescription.displayName = 'List.Description'

/**
 * List Arrow Component
 *
 * @description
 * Arrow indicator component for List compound pattern.
 * Displays right-pointing arrow icon.
 *
 * @example
 * ```tsx
 * <List.Arrow />
 * ```
 */
const ListArrow = React.forwardRef<HTMLDivElement, ListArrowProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex shrink-0 text-[var(--color-text-subtle)]', className)}
        aria-hidden="true"
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
        >
          <path
            d="M7.5 15L12.5 10L7.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  },
)

ListArrow.displayName = 'List.Arrow'

// Compound Component export
export const List = Object.assign(ListRoot, {
  Icon: ListIcon,
  Content: ListContent,
  Title: ListTitle,
  Description: ListDescription,
  Arrow: ListArrow,
})
