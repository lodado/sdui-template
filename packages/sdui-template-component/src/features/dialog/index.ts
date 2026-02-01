// Dialog compound components
export {
  ConfirmDialog,
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
  // Preset components
  SimpleDialog,
} from './Dialog'

// SDUI containers
export {
  DialogBodyContainer,
  DialogContainer,
  DialogContentContainer,
  DialogFooterContainer,
  DialogHeaderContainer,
  DialogPortalContainer,
  DialogTriggerContainer,
} from './DialogContainer'

// Types
export type {
  ConfirmDialogProps,
  DialogAppearance,
  DialogBodyProps,
  DialogCloseProps,
  // SDUI
  DialogContainerProps,
  DialogContentProps,
  DialogDescriptionProps,
  DialogFooterProps,
  DialogHeaderProps,
  DialogOverlayProps,
  DialogPortalProps,
  // Compound component props
  DialogRootProps,
  // Size & Appearance
  DialogSize,
  DialogState,
  DialogTitleProps,
  DialogTriggerProps,
  // Preset props
  SimpleDialogProps,
} from './types'

// Zod schema
export { dialogStatesSchema } from './types'

// Variants
export {
  dialogBodyVariants,
  dialogCancelButtonVariants,
  dialogCloseVariants,
  dialogConfirmButtonVariants,
  dialogContentVariants,
  dialogDescriptionVariants,
  dialogFooterVariants,
  dialogHeaderVariants,
  dialogOverlayVariants,
  dialogTitleVariants,
} from './dialog-variants'

// Variant types
export type {
  DialogBodyVariants,
  DialogCancelButtonVariants,
  DialogCloseVariants,
  DialogConfirmButtonVariants,
  DialogContentVariants,
  DialogDescriptionVariants,
  DialogFooterVariants,
  DialogHeaderVariants,
  DialogOverlayVariants,
  DialogTitleVariants,
} from './dialog-variants'
