import type { VariantProps } from 'class-variance-authority'
import React from 'react'
import { z } from 'zod'

import type { radioVariants } from './radio-variants'

/**
 * Radio Root Props
 *
 * @description
 * Props for Radio.Root component.
 * Provides Context and manages shared state (disabled, required, error, name).
 */
export interface RadioRootProps {
  /** Disabled state - applies to all children */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** Error state */
  error?: boolean
  /** Radio group name for grouping radios */
  name?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Radio element id (auto-generated if not provided) */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Child components */
  children: React.ReactNode
}

/**
 * Radio Label Props
 *
 * @description
 * Props for Radio.Label component.
 * Label is automatically connected to radio via Context.
 */
export interface RadioLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * Radio component props
 *
 * @description
 * Props for Radio.Radio component.
 * Based on native HTML input radio with additional styling options.
 */
export interface RadioRadioProps
  extends Omit<VariantProps<typeof radioVariants>, 'checked'>,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onChange' | 'type'> {
  /**
   * Whether the radio is checked
   * @default false
   */
  checked?: boolean

  /**
   * Default checked state (uncontrolled)
   */
  defaultChecked?: boolean

  /**
   * Whether the radio is disabled
   * @default false
   */
  disabled?: boolean

  /**
   * Callback when radio state changes
   */
  onCheckedChange?: (checked: boolean) => void

  /**
   * Radio value (required for radio groups)
   */
  value: string

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
   * HTML name attribute (overrides context name)
   */
  name?: string
}

/**
 * Radio container props for SDUI integration
 */
export interface RadioContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * RadioRadio container props for SDUI integration
 */
export interface RadioRadioContainerProps {
  id: string
  parentPath?: string[]
}

/**
 * RadioLabel container props for SDUI integration
 */
export interface RadioLabelContainerProps {
  id: string
  parentPath?: string[]
}

// ============================================
// SDUI State Schemas (Zod)
// ============================================

/**
 * Radio Root state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Radio Root component state in SDUI.
 * Used with useSduiNodeSubscription to ensure type safety.
 */
export const radioRootStateSchema = z.object({
  disabled: z.boolean().optional(),
  required: z.boolean().optional(),
  error: z.boolean().optional(),
  name: z.string().optional(),
  providerId: z.string().optional(), // Optional - inherits from RadioGroup context
})

export type RadioRootState = z.infer<typeof radioRootStateSchema>

/**
 * Radio Root attributes schema for SDUI validation
 */
export const radioRootAttributesSchema = z.object({
  className: z.string().optional(),
})

export type RadioRootAttributes = z.infer<typeof radioRootAttributesSchema>

/**
 * Radio Radio state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Radio Radio component state in SDUI.
 * providerId is optional - if not specified, inherits from RadioGroup context.
 */
export const radioRadioStateSchema = z.object({
  checked: z.boolean().optional(),
  disabled: z.boolean().optional(),
  value: z.string(),
  providerId: z.string().optional(), // Optional - inherits from RadioGroup context
})

export type RadioRadioState = z.infer<typeof radioRadioStateSchema>

/**
 * Radio Radio attributes schema for SDUI validation
 */
export const radioRadioAttributesSchema = z.object({
  className: z.string().optional(),
  name: z.string().optional(),
})

export type RadioRadioAttributes = z.infer<typeof radioRadioAttributesSchema>

/**
 * Radio Label state schema for SDUI validation
 *
 * @description
 * Zod schema for validating Radio Label component state in SDUI.
 */
export const radioLabelStateSchema = z.object({
  text: z.string().optional(),
})

export type RadioLabelState = z.infer<typeof radioLabelStateSchema>

/**
 * Radio Label attributes schema for SDUI validation
 */
export const radioLabelAttributesSchema = z.object({
  className: z.string().optional(),
})

export type RadioLabelAttributes = z.infer<typeof radioLabelAttributesSchema>
