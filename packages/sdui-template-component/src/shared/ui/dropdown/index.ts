// Legacy exports
export { DropdownCheckboxItem, DropdownMenu, DropdownMenuItem } from './Dropdown'
export { DropdownContainer } from './DropdownContainer'

// Compound pattern exports
export {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownRoot,
  DropdownTrigger,
  DropdownValue,
  useDropdownContext,
} from './Dropdown'
export {
  DropdownContentContainer,
  DropdownItemContainer,
  DropdownTriggerContainer,
  DropdownValueContainer,
} from './DropdownContainer'

// Type exports
export type {
  DropdownAppearance,
  DropdownItemOption,
  DropdownMenuItemProps,
  DropdownMenuProps,
  DropdownMenuState,
  DropdownPlacement,
  DropdownSpacing,
  DropdownTriggerProps,
} from './types'

// Compound state type exports
export type {
  DropdownContentState,
  DropdownItemState,
  DropdownRootState,
  DropdownTriggerState,
  DropdownValueState,
} from './types'

// Schema exports for validation
export {
  dropdownContentStateSchema,
  dropdownItemStateSchema,
  dropdownMenuStatesSchema,
  dropdownRootStateSchema,
  dropdownTriggerStateSchema,
  dropdownValueStateSchema,
} from './types'
