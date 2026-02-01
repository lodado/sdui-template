'use client'

import type { ComponentFactory } from '@lodado/sdui-template'
import { ToggleContainer } from '@lodado/sdui-template-component'

// Re-export from sdui-template-component
export type { ToggleContainerProps, ToggleProps, ToggleState } from '@lodado/sdui-template-component'
export { Toggle, ToggleContainer, toggleStateSchema } from '@lodado/sdui-template-component'

export const ToggleFactory: ComponentFactory = (id) => <ToggleContainer id={id} />
