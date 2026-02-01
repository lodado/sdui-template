import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import React, { useCallback, useMemo, useState } from 'react'

import { cn } from '../../lib/cn'
import {
  dropdownCheckboxVariants,
  dropdownContentVariants,
  dropdownItemVariants,
  dropdownTriggerVariants,
} from './dropdown-variants'
import type { DropdownItemOption, DropdownMenuItemProps, DropdownMenuProps, DropdownPlacement } from './types'

/**
 * Chevron down icon (12px as per Figma spec)
 */
const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('w-3 h-3 transition-transform duration-200', className)}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M2.5 4.5L6 8L9.5 4.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * Checkmark icon for selected checkbox items
 */
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={cn('w-2.5 h-2.5', className)}
    viewBox="0 0 10 10"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Convert placement to Radix UI side/align props
 */
const getPlacementProps = (placement: DropdownPlacement = 'bottom-start') => {
  const [side, align] = placement.includes('-') ? placement.split('-') : [placement, 'center']

  return {
    side: side as 'top' | 'bottom' | 'left' | 'right',
    align: (align === 'start' || align === 'end' ? align : 'center') as 'start' | 'center' | 'end',
  }
}

/**
 * Dropdown menu checkbox item
 */
const DropdownCheckboxItem = ({
  id,
  label,
  disabled = false,
  isSelected = false,
  showCheckbox = true,
  onSelect,
  className,
}: DropdownMenuItemProps) => {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      className={cn(
        dropdownItemVariants({ isDisabled: disabled, isSelected }),
        'gap-3', // 12px gap between checkbox and label
        className,
      )}
      checked={isSelected}
      disabled={disabled}
      onCheckedChange={() => onSelect?.()}
      data-item-id={id}
    >
      {showCheckbox && (
        <span className={cn(dropdownCheckboxVariants({ isChecked: isSelected, isDisabled: disabled }))}>
          {isSelected && <CheckIcon />}
        </span>
      )}
      <span className="flex-1 truncate">{label}</span>
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

/**
 * Dropdown menu regular item (for single select)
 */
const DropdownMenuItem = ({
  id,
  label,
  disabled = false,
  isSelected = false,
  icon,
  onSelect,
  className,
}: DropdownMenuItemProps) => {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(dropdownItemVariants({ isDisabled: disabled, isSelected }), 'gap-3', className)}
      disabled={disabled}
      onSelect={() => onSelect?.()}
      data-item-id={id}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{label}</span>
      {isSelected && !icon && (
        <span className="shrink-0 text-[var(--color-text-selected,#1868db)]">
          <CheckIcon className="w-3 h-3" />
        </span>
      )}
    </DropdownMenuPrimitive.Item>
  )
}

/**
 * DropdownMenu component (ADS style)
 *
 * @description
 * Dropdown menu component following Atlassian Design System (ADS) specifications.
 * Uses Radix UI DropdownMenu primitive for full accessibility support.
 *
 * Features:
 * - Single select or multi-select (checkbox) mode
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Focus management
 * - ARIA attributes for screen readers
 * - Customizable trigger appearance
 *
 * @example
 * ```tsx
 * <DropdownMenu
 *   triggerLabel="Choices"
 *   options={[
 *     { id: '1', label: 'Option 1' },
 *     { id: '2', label: 'Option 2' },
 *   ]}
 *   onSelect={(id) => console.log('Selected:', id)}
 * />
 * ```
 */
export const DropdownMenu = React.forwardRef<HTMLButtonElement, DropdownMenuProps>(
  (
    {
      triggerLabel = 'Select',
      appearance = 'default',
      spacing = 'default',
      placement = 'bottom-start',
      isDisabled = false,
      isSelected = false,
      options = [],
      selectedId,
      selectedIds = [],
      isMultiSelect = false,
      onSelect,
      onSelectionChange,
      onOpenChange,
      className,
      contentClassName,
      nodeId,
      eventId,
      children,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false)

    // Handle open state change
    const handleOpenChange = useCallback(
      (open: boolean) => {
        setIsOpen(open)
        onOpenChange?.(open)
      },
      [onOpenChange],
    )

    // Handle single select
    const handleSelect = useCallback(
      (id: string) => {
        onSelect?.(id)
        if (!isMultiSelect) {
          handleOpenChange(false)
        }
      },
      [onSelect, isMultiSelect, handleOpenChange],
    )

    // Handle multi-select toggle
    const handleCheckboxToggle = useCallback(
      (id: string) => {
        const newSelectedIds = selectedIds.includes(id)
          ? selectedIds.filter((itemId) => itemId !== id)
          : [...selectedIds, id]
        onSelectionChange?.(newSelectedIds)
      },
      [selectedIds, onSelectionChange],
    )

    // Get placement props for Radix
    const placementProps = useMemo(() => getPlacementProps(placement), [placement])

    // Trigger variant classes
    const triggerClasses = cn(
      dropdownTriggerVariants({
        appearance,
        spacing,
        isDisabled,
        isSelected: isSelected || isOpen,
        isOpen,
      }),
      className,
    )

    // Content variant classes
    const contentClasses = cn(dropdownContentVariants({ spacing }), contentClassName)

    return (
      <DropdownMenuPrimitive.Root open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuPrimitive.Trigger
          ref={ref}
          className={triggerClasses}
          disabled={isDisabled}
          aria-disabled={isDisabled}
          data-node-id={nodeId}
          data-event-id={eventId}
          data-open={isOpen || undefined}
        >
          {children ?? (
            <>
              <span>{triggerLabel}</span>
              <ChevronDownIcon className={cn(isOpen && 'rotate-180')} />
            </>
          )}
        </DropdownMenuPrimitive.Trigger>

        <DropdownMenuPrimitive.Portal>
          <DropdownMenuPrimitive.Content
            className={contentClasses}
            sideOffset={8}
            {...placementProps}
            onCloseAutoFocus={(e) => e.preventDefault()}
          >
            {options.map((option: DropdownItemOption) =>
              isMultiSelect ? (
                <DropdownCheckboxItem
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  disabled={option.disabled}
                  isSelected={selectedIds.includes(option.id)}
                  showCheckbox
                  onSelect={() => handleCheckboxToggle(option.id)}
                />
              ) : (
                <DropdownMenuItem
                  key={option.id}
                  id={option.id}
                  label={option.label}
                  disabled={option.disabled}
                  isSelected={selectedId === option.id}
                  icon={option.icon}
                  onSelect={() => handleSelect(option.id)}
                />
              ),
            )}
          </DropdownMenuPrimitive.Content>
        </DropdownMenuPrimitive.Portal>
      </DropdownMenuPrimitive.Root>
    )
  },
)

DropdownMenu.displayName = 'DropdownMenu'

// Export sub-components for composition
export { DropdownCheckboxItem, DropdownMenuItem }
