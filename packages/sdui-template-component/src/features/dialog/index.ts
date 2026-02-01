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
  // Context hook for providerId inheritance
  useDialogContext,
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

// Zod schemas (legacy)
export { dialogStatesSchema } from './types'

// Compound component state schemas (providerId pattern)
export {
  dialogBodyStateSchema,
  dialogContentStateSchema,
  dialogFooterStateSchema,
  dialogHeaderStateSchema,
  dialogPortalStateSchema,
  dialogRootStateSchema,
  dialogTriggerStateSchema,
} from './types'

// Compound component state types
export type {
  DialogBodyState,
  DialogContentState,
  DialogFooterState,
  DialogHeaderState,
  DialogPortalState,
  DialogRootState,
  DialogTriggerState,
} from './types'

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
