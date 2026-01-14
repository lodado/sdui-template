import React from 'react'

/**
 * TextField Wrapper Props
 *
 * @description
 * Props for TextField.Wrapper component.
 * Controls layout orientation and custom styling.
 */
export interface TextFieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical' | 'custom'
  /** Additional CSS classes */
  className?: string
  /** Child components */
  children: React.ReactNode
}

/**
 * TextField Label Props
 *
 * @description
 * Props for TextField.Label component.
 * Label is automatically connected to input via Context.
 */
export interface TextFieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Label text */
  children: React.ReactNode
  /** Additional CSS classes */
  className?: string
}

/**
 * TextField Input Props
 *
 * @description
 * Props for TextField.Input component.
 * Extends standard input HTML attributes.
 */
export interface TextFieldInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'
  > {
  /** Placeholder text */
  placeholder?: string
  /** Controlled value */
  value?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Change event handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Focus event handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Left icon displayed inside the input field */
  leftIcon?: React.ReactNode
  /** Right icon displayed inside the input field */
  rightIcon?: React.ReactNode
  /** Right icon click handler */
  onRightIconClick?: (event: React.MouseEvent) => void
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** Maximum input length */
  maxLength?: number
  /** Autocomplete hint */
  autocomplete?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * TextField HelpMessage Props
 *
 * @description
 * Props for TextField.HelpMessage component.
 * Displays help message or error message based on Context state.
 */
export interface TextFieldHelpMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Message text (optional, uses Context errorMessage/helpMessage if not provided) */
  children?: React.ReactNode
  /** Additional CSS classes */
  className?: string
  /** Override error state (optional, uses Context error if not provided) */
  error?: boolean
}

/**
 * TextField Root Props
 *
 * @description
 * Props for TextField root component.
 * Provides Context and manages shared state.
 */
export interface TextFieldRootProps {
  /** Error state */
  error?: boolean
  /** Error message displayed when error is true */
  errorMessage?: string
  /** Help message displayed when error is false */
  helpMessage?: string
  /** Disabled state */
  disabled?: boolean
  /** Required field indicator */
  required?: boolean
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
  /** Input element id (auto-generated if not provided) */
  id?: string
  /** Additional CSS classes */
  className?: string
  /** Child components */
  children: React.ReactNode
}
