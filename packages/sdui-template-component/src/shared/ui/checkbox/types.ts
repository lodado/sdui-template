import type { VariantProps } from 'class-variance-authority'
import React from 'react'
import { z } from 'zod'

import type { checkboxVariants } from './checkbox-variants'

/**
 * Checkbox Root Props
 *
 * @description
 * Props for Checkbox.Root component.
 * Provides Context and manages shared state (disabled, required, error).
 */
export interface CheckboxRootProps {
  /** Disabled state - applies to all children */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** Error state */
  error?: boolean
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Checkbox element id (auto-generated if not provided) */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Child components */
  children: React.ReactNode
}

/**
 * Checkbox Label Props
 *
 * @description
 * Props for Checkbox.Label component.
 * Label is automatically connected to checkbox via Context.
 */
export interface CheckboxLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Checkbox component props
 *
 * @description
 * Props for Checkbox.Checkbox component.
 * Based on native HTML input checkbox with additional styling options.
 */
export interface CheckboxCheckboxProps
  extends Omit<VariantProps<typeof checkboxVariants>, 'checked' | 'indeterminate'>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onChange' | 'type'> {
  /**
   * Whether the checkbox is checked
   * @default false
   */
  checked?: boolean

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean

  /**
   * Whether the checkbox is in indeterminate state
   * @default false
   */
  indeterminate?: boolean

  /**
   * Whether the checkbox is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Callback when checkbox state changes
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * Additional CSS class name
   */
  className?: string

  /**
   * SDUI node ID for tracking
   */
  nodeId?: string

  /**
   * SDUI event ID for event handling
   */
  eventId?: string

  /**
   * HTML id attribute
   */
  id?: string

  /**
   * HTML name attribute
   */
  name?: string
}

/**
 * Checkbox container props for SDUI integration
 */
export interface CheckboxContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * CheckboxCheckbox container props for SDUI integration
 */
export interface CheckboxCheckboxContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * CheckboxLabel container props for SDUI integration
 */
export interface CheckboxLabelContainerProps {
  id: string
  parentPath?: string[]
}

// ============================================
// SDUI State Schemas (Zod)
// ============================================

/**
 * Checkbox Root state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Checkbox Root component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const checkboxRootStateSchema = z.object({
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.boolean().optional(),
})

export type CheckboxRootState = z.infer<typeof checkboxRootStateSchema>

/**
 * Checkbox Root attributes schema for SDUI validation
 */
export const checkboxRootAttributesSchema = z.object({
  className: z.string().optional(),
})

export type CheckboxRootAttributes = z.infer<typeof checkboxRootAttributesSchema>

/**
 * Checkbox Checkbox state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Checkbox Checkbox component state in SDUI.
 */
export const checkboxCheckboxStateSchema = z.object({
  checked: z.boolean().optional(),
  indeterminate: z.boolean().optional(),
  disabled: z.boolean().optional(),
})

export type CheckboxCheckboxState = z.infer<typeof checkboxCheckboxStateSchema>

/**
 * Checkbox Checkbox attributes schema for SDUI validation
 */
export const checkboxCheckboxAttributesSchema = z.object({
  className: z.string().optional(),
})

export type CheckboxCheckboxAttributes = z.infer<typeof checkboxCheckboxAttributesSchema>

/**
 * Checkbox Label state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Checkbox Label component state in SDUI.
 */
export const checkboxLabelStateSchema = z.object({
  text: z.string().optional(),
})

export type CheckboxLabelState = z.infer<typeof checkboxLabelStateSchema>

/**
 * Checkbox Label attributes schema for SDUI validation
 */
export const checkboxLabelAttributesSchema = z.object({
  className: z.string().optional(),
})

export type CheckboxLabelAttributes = z.infer<typeof checkboxLabelAttributesSchema>
