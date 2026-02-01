// Compound components
export {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverRoot,
  PopoverTrigger,
  // Context hook for providerId inheritance
  usePopoverContext,
} from './Popover'

// SDUI containers
export {
  PopoverCloseContainer,
  PopoverContainer,
  PopoverContentContainer,
  PopoverTriggerContainer,
} from './PopoverContainer'

// Types
export type {
  // Props
  PopoverArrowProps,
  // State types
  PopoverArrowState,
  PopoverCloseProps,
  PopoverCloseState,
  PopoverContainerProps,
  PopoverContentProps,
  PopoverContentState,
  PopoverRootProps,
  PopoverRootState,
  PopoverSize,
  PopoverTriggerProps,
  PopoverTriggerState,
} from './types'

// Zod schemas
export {
  popoverArrowStateSchema,
  popoverCloseStateSchema,
  popoverContentStateSchema,
  popoverRootStateSchema,
  popoverTriggerStateSchema,
} from './types'

// Variants
export { popoverCloseVariants, popoverContentVariants } from './popover-variants'

// Variant types
export type { PopoverCloseVariants, PopoverContentVariants } from './popover-variants'
