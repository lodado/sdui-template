import type { SduiDocumentContent } from '@lodado/sdui-document'
import React, { useContext } from 'react'

/**
 * Document → embedded-layout state bridge. The host derives global variables
 * from the live document content; every `document.sdui` block pushes them into
 * its layout store on each document change, and widgets read them reactively
 * via `useSduiVariable` (@lodado/sdui-template).
 *
 * One-way by design: widgets that need to write back get their write API via
 * the host's component map, not through this bridge.
 */
export type SduiDocumentVariablesSelector = (content: SduiDocumentContent) => Record<string, unknown>

const SduiDocumentBridgeContext = React.createContext<SduiDocumentVariablesSelector | null>(null)

export const SduiDocumentBridgeProvider = SduiDocumentBridgeContext.Provider

export function useSduiDocumentVariablesSelector(): SduiDocumentVariablesSelector | null {
  return useContext(SduiDocumentBridgeContext)
}
