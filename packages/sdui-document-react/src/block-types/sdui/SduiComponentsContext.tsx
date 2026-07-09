import type { ComponentFactory } from '@lodado/sdui-template'
import React, { useContext } from 'react'

/**
 * Host-provided component map for `document.sdui` blocks — the factories
 * `SduiLayoutRenderer` resolves layout node types against. No provider (or an
 * empty map) renders a placeholder instead of the embedded layout, mirroring
 * the embed allowlist posture: embedded documents are data, the host decides
 * what may render.
 */
export type SduiLayoutComponents = Record<string, ComponentFactory>

const SduiComponentsContext = React.createContext<SduiLayoutComponents | null>(null)

export const SduiComponentsProvider = SduiComponentsContext.Provider

export function useSduiComponents(): SduiLayoutComponents | null {
  return useContext(SduiComponentsContext)
}
