import type { SduiLayoutDocument } from '../../schema'
import type { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreState } from '../../store/types'
import { normalizeSduiLayout } from '../../utils/normalize'

export type LayoutStateSnapshot = {
  document: SduiLayoutDocument | null
  nodes: SduiLayoutStoreState['nodes']
  store: Pick<
    SduiLayoutStoreState,
    'version' | 'rootId' | 'selectedNodeId' | 'isEdited' | 'variables' | 'lastModified'
  > & {
    nodeCount: number
  }
}

/** Builds a JSON-friendly snapshot from a live store instance. */
export function snapshotLayoutStateFromStore(store: SduiLayoutStore): LayoutStateSnapshot {
  const { version, rootId, selectedNodeId, isEdited, variables, lastModified } = store.state
  const {nodes} = store

  return {
    document: store.getDocument(),
    nodes,
    store: {
      version,
      rootId,
      selectedNodeId,
      isEdited,
      variables,
      lastModified,
      nodeCount: Object.keys(nodes).length,
    },
  }
}

/** Builds a snapshot from a layout document without mounting a store. */
export function snapshotLayoutStateFromDocument(document: SduiLayoutDocument): LayoutStateSnapshot {
  const { entities } = normalizeSduiLayout(document)
  const nodes = entities.nodes ?? {}
  const rootId = document.root.id

  return {
    document,
    nodes,
    store: {
      version: 0,
      rootId,
      selectedNodeId: undefined,
      isEdited: false,
      variables: {},
      lastModified: {},
      nodeCount: Object.keys(nodes).length,
    },
  }
}

export function formatLayoutStateJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
