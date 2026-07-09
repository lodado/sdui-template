import '../styles/editor.css'

// Read-only viewer entry (`@lodado/sdui-document-react/viewer`). Everything
// re-exported here must keep ProseMirror/dnd-kit out of the import graph —
// notably do NOT re-export from ../page/index.ts (SduiPageProvider pulls the
// full editor via SduiPeekDialog); page navigation types come from
// SduiPageContext directly so hosts can wire their own navigator.

export {
  SduiComponentsProvider,
  type SduiLayoutComponents,
  useSduiComponents,
} from '../block-types/sdui/SduiComponentsContext'
export {
  SduiDocumentBridgeProvider,
  type SduiDocumentVariablesSelector,
  useSduiDocumentVariablesSelector,
} from '../block-types/sdui/SduiDocumentBridgeContext'
export {
  type DocumentResolver,
  type PageOpenMode,
  type ResolvedDocumentState,
  type SduiDocumentNavigator,
  SduiPageContext,
  type SduiPageContextValue,
  useResolvedDocument,
  useSduiPage,
} from '../page/SduiPageContext'
export { documentViewerComponent } from '../sdui-node/DocumentViewerNode'
export { SduiDocumentViewer, type SduiDocumentViewerProps } from './SduiDocumentViewer'
