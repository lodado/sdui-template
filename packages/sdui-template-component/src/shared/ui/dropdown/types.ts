import React from 'react'
import { z } from 'zod'

/**
 * Dropdown menu appearance variants (ADS style)
 * @description
 * - default: Neutral button trigger with border
 * - primary: Brand blue filled button trigger
 * - subtle: Transparent button trigger without border
 */
export type DropdownAppearance = 'default' | 'primary' | 'subtle'

/**
 * Dropdown menu spacing options (ADS style)
 * @description
 * - default: 32px trigger height, default item padding
 * - compact: 24px trigger height, reduced item padding
 * - cozy: Same as default (alias for consistency with Figma)
 */
export type DropdownSpacing = 'default' | 'compact' | 'cozy'

/**
 * Dropdown menu placement options
 */
export type DropdownPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'right'

/**
 * Dropdown item type
 */
export interface DropdownItemOption {
  /** Unique identifier for the item */
  id: string
  /** Display label */
  label: string
  /** Whether item is disabled */
  disabled?: boolean
  /** Optional icon element */
  icon?: React.ReactNode
}

/**
 * Dropdown menu trigger props
 */
export interface DropdownTriggerProps {
  /** Trigger button text */
  label?: string
  /** Icon to display after label (chevron by default) */
  iconAfter?: React.ReactNode
  /** Whether trigger is disabled */
  isDisabled?: boolean
  /** Whether menu is currently open */
  isOpen?: boolean
}

/**
 * Dropdown menu component props (ADS style)
 *
 * @description
 * Dropdown menu component following Atlassian Design System (ADS) specifications.
 * Uses Radix UI DropdownMenu primitive for accessibility and keyboard navigation.
 *
 * Features:
 * - Single select or multi-select (checkbox) mode
 * - Keyboard navigation support
 * - Accessible by default (ARIA attributes)
 * - Customizable trigger appearance
 * - Support for icons and disabled states
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
 *
 * @example
 * ```tsx
 * // Multi-select with checkboxes
 * <DropdownMenu
 *   triggerLabel="Select items"
 *   isMultiSelect
 *   selectedIds={['1', '2']}
 *   options={options}
 *   onSelectionChange={(ids) => setSelected(ids)}
 * />
 * ```
 */
export interface DropdownMenuProps {
  /** Trigger button label */
  triggerLabel?: string
  /** Dropdown appearance: default, primary, or subtle */
  appearance?: DropdownAppearance
  /** Dropdown spacing: default, compact, or cozy */
  spacing?: DropdownSpacing
  /** Menu placement relative to trigger */
  placement?: DropdownPlacement
  /** Whether trigger is disabled */
  isDisabled?: boolean
  /** Whether trigger shows selected state */
  isSelected?: boolean
  /** Menu options */
  options?: DropdownItemOption[]
  /** Currently selected option ID (single select) */
  selectedId?: string
  /** Currently selected option IDs (multi-select) */
  selectedIds?: string[]
  /** Whether multi-select mode is enabled */
  isMultiSelect?: boolean
  /** Callback when single option is selected */
  onSelect?: (id: string) => void
  /** Callback when selection changes (multi-select) */
  onSelectionChange?: (ids: string[]) => void
  /** Callback when menu open state changes */
  onOpenChange?: (open: boolean) => void
  /** Additional CSS classes for trigger */
  className?: string
  /** Additional CSS classes for content */
  contentClassName?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Children for custom trigger */
  children?: React.ReactNode
}

/**
 * Dropdown menu item props
 */
export interface DropdownMenuItemProps {
  /** Item unique identifier */
  id: string
  /** Item label */
  label: string
  /** Whether item is disabled */
  disabled?: boolean
  /** Whether item is currently selected */
  isSelected?: boolean
  /** Whether to show checkbox */
  showCheckbox?: boolean
  /** Icon element */
  icon?: React.ReactNode
  /** Click handler */
  onSelect?: () => void
  /** Additional CSS classes */
  className?: string
}

/**
 * Dropdown menu state schema for SDUI validation
 */
export const dropdownMenuStatesSchema: z.ZodSchema<Record<string, unknown>> = z.object({
  appearance: z.enum(['default', 'primary', 'subtle']).optional(),
  spacing: z.enum(['default', 'compact', 'cozy']).optional(),
  placement: z
    .enum(['top', 'top-start', 'top-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'right'])
    .optional(),
  isDisabled: z.boolean().optional(),
  isSelected: z.boolean().optional(),
  isMultiSelect: z.boolean().optional(),
  selectedId: z.string().optional(),
  selectedIds: z.array(z.string()).optional(),
  triggerLabel: z.string().optional(),
  options: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        disabled: z.boolean().optional(),
      }),
    )
    .optional(),
}) as z.ZodSchema<Record<string, unknown>>

export type DropdownMenuState = z.infer<typeof dropdownMenuStatesSchema>
