import '../styles/viewer.css'

// Read-only viewer entry (`@lodado/sdui-document-react/viewer`). Everything
// re-exported here must keep ProseMirror/dnd-kit out of the import graph —
// notably do NOT re-export from ../page/index.ts (SduiPageProvider pulls the
// full editor via SduiPeekDialog); page navigation types come from
// SduiPageContext directly so hosts can wire their own navigator.

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
export { SduiDocumentViewer, type SduiDocumentViewerProps } from './SduiDocumentViewer'
