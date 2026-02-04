// Compound components
export type { CheckboxCheckboxProps, CheckboxLabelProps,CheckboxRootProps } from './Checkbox'
export { Checkbox } from './Checkbox'

// Context
export type { CheckboxContextValue } from './CheckboxContext'
export { CheckboxContext, useCheckboxContext } from './CheckboxContext'

// Container components (for SDUI integration)
export { CheckboxCheckboxContainer } from './CheckboxCheckboxContainer'
export { CheckboxContainer } from './CheckboxContainer'
export { CheckboxLabelContainer } from './CheckboxLabelContainer'

// Types
export type {
  CheckboxCheckboxAttributes,
  CheckboxCheckboxContainerProps,
  CheckboxCheckboxState,
  CheckboxContainerProps,
  CheckboxLabelAttributes,
  CheckboxLabelContainerProps,
  CheckboxLabelState,
  CheckboxRootAttributes,
  CheckboxRootState,
} from './types'

// State schemas (for SDUI validation)
export {
  checkboxCheckboxAttributesSchema,
  checkboxCheckboxStateSchema,
  checkboxLabelAttributesSchema,
  checkboxLabelStateSchema,
  checkboxRootAttributesSchema,
  checkboxRootStateSchema,
} from './types'

// Variants
export type { CheckboxIndicatorVariants,CheckboxVariants } from './checkbox-variants'
export { checkboxIndicatorVariants,checkboxVariants } from './checkbox-variants'
