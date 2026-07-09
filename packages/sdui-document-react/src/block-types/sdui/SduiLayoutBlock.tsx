import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer, useSduiLayoutAction } from '@lodado/sdui-template'
import React, { useEffect, useState } from 'react'

import { useDocumentContent } from '../../editor/DocumentContentContext'
import type { BlockChromeProps } from '../BlockChrome'
import { useSduiComponents } from './SduiComponentsContext'
import { useSduiDocumentVariablesSelector } from './SduiDocumentBridgeContext'

function layoutDocument(attributes: Record<string, unknown> | undefined): SduiLayoutDocument | null {
  const document = attributes?.document as SduiLayoutDocument | undefined

  return document && typeof document === 'object' && 'root' in document ? document : null
}

/**
 * Pushes host-selected document variables into the embedded layout store on
 * every document change — rendered inside SduiLayoutRenderer so it can reach
 * the store without recreating it (a new `document` prop would reset widget
 * state). Widgets read reactively via `useSduiVariable`.
 */
const DocumentVariablesBridge = () => {
  const store = useSduiLayoutAction()
  const selectVariables = useSduiDocumentVariablesSelector()
  const content = useDocumentContent()

  useEffect(() => {
    if (selectVariables && content) {
      store.updateVariables(selectVariables(content))
    }
  }, [store, selectVariables, content])

  return null
}

/**
 * `document.sdui` block — mounts a server-defined SDUI layout inside the
 * document. Works identically in the editor (readOnly or not) and the viewer:
 * the embedded layout is not editable block content, it is rendered UI.
 */
export const SduiLayoutBlock = ({ block }: BlockChromeProps) => {
  const components = useSduiComponents()
  const [renderError, setRenderError] = useState<string | null>(null)
  const document = layoutDocument(block.attributes)

  if (!document) {
    return <div className="sdui-layout-block sdui-layout-block--empty">Invalid SDUI layout document</div>
  }

  if (!components || Object.keys(components).length === 0) {
    return (
      <div className="sdui-layout-block sdui-layout-block--empty">
        SDUI layout blocked — no component map. Wrap the editor/viewer in SduiComponentsProvider.
      </div>
    )
  }

  if (renderError) {
    return <div className="sdui-layout-block sdui-layout-block--error">SDUI layout failed to render: {renderError}</div>
  }

  return (
    <div className="sdui-layout-block" data-sdui-layout-block>
      <SduiLayoutRenderer
        document={document}
        components={components}
        onError={(error) => setRenderError(error instanceof Error ? error.message : String(error))}
        effects={<DocumentVariablesBridge />}
      />
    </div>
  )
}
