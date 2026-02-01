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
} from './Dropdown'
export {
  DropdownContentContainer,
  DropdownItemContainer,
  DropdownTriggerContainer,
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
} from './types'

// Schema exports for validation
export {
  dropdownContentStateSchema,
  dropdownItemStateSchema,
  dropdownMenuStatesSchema,
  dropdownRootStateSchema,
  dropdownTriggerStateSchema,
} from './types'
