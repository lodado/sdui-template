'use client'

import React, { useMemo, useState, useSyncExternalStore } from 'react'

import type { SduiLayoutDocument } from '../../schema'
import { useSduiLayoutAction } from '../hooks/useSduiLayoutAction'
import {
  formatLayoutStateJson,
  type LayoutStateSnapshot,
  snapshotLayoutStateFromDocument,
  snapshotLayoutStateFromStore,
} from '../utils/layoutStateSnapshot'

export type SduiLayoutStateInspectorView = 'document' | 'nodes' | 'store'

export type SduiLayoutStateInspectorProps = {
  /**
   * When set, shows a static snapshot derived from the document (no provider required).
   * When omitted, reads live state from the nearest SduiLayoutProvider.
   */
  document?: SduiLayoutDocument | null
  title?: string
  views?: SduiLayoutStateInspectorView[]
  defaultView?: SduiLayoutStateInspectorView
  maxHeight?: number | string
  className?: string
}

const VIEW_LABELS: Record<SduiLayoutStateInspectorView, string> = {
  document: 'Document',
  nodes: 'Nodes',
  store: 'Store',
}

const DEFAULT_VIEWS: SduiLayoutStateInspectorView[] = ['document', 'nodes', 'store']

const inspectorStyles: React.CSSProperties = {
  display: 'grid',
  gap: 8,
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  fontSize: 12,
  lineHeight: 1.45,
}

const tabListStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 6,
}

function tabButtonStyles(active: boolean): React.CSSProperties {
  return {
    border: `1px solid ${active ? '#64748b' : '#cbd5e1'}`,
    background: active ? '#e2e8f0' : '#fff',
    color: '#0f172a',
    borderRadius: 6,
    padding: '4px 10px',
    cursor: 'pointer',
    font: 'inherit',
  }
}

const panelStyles = (maxHeight: number | string): React.CSSProperties => ({
  margin: 0,
  padding: 12,
  borderRadius: 8,
  border: '1px solid #cbd5e1',
  background: '#f8fafc',
  color: '#0f172a',
  overflow: 'auto',
  maxHeight,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
})

function pickViewValue(snapshot: LayoutStateSnapshot, view: SduiLayoutStateInspectorView): unknown {
  switch (view) {
    case 'document':
      return snapshot.document
    case 'nodes':
      return snapshot.nodes
    case 'store':
      return snapshot.store
    default:
      return snapshot
  }
}

type InspectorPanelProps = Omit<SduiLayoutStateInspectorProps, 'document'> & {
  snapshot: LayoutStateSnapshot | null
  mode: 'live store' | 'from document'
}

const InspectorPanel = ({
  snapshot,
  mode,
  title = 'SDUI layout state',
  views = DEFAULT_VIEWS,
  defaultView = 'document',
  maxHeight = 360,
  className,
}: InspectorPanelProps) => {
  const availableViews = views.filter((view) => DEFAULT_VIEWS.includes(view))
  const [activeView, setActiveView] = useState<SduiLayoutStateInspectorView>(
    availableViews.includes(defaultView) ? defaultView : availableViews[0] ?? 'document',
  )

  if (!snapshot) {
    return (
      <section aria-label={title} className={className} style={inspectorStyles}>
        <p style={{ margin: 0, color: '#64748b' }}>No layout state to display.</p>
      </section>
    )
  }

  const resolvedView = availableViews.includes(activeView) ? activeView : availableViews[0] ?? 'document'
  const json = formatLayoutStateJson(pickViewValue(snapshot, resolvedView))

  return (
    <section aria-label={title} className={className} style={inspectorStyles}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <strong style={{ fontSize: 13 }}>{title}</strong>
        <span style={{ color: '#64748b' }}>
          {mode} · {snapshot.store.nodeCount} nodes · v{snapshot.store.version}
        </span>
      </div>

      <div role="tablist" aria-label={`${title} views`} style={tabListStyles}>
        {availableViews.map((view) => {
          const selected = view === resolvedView

          return (
            <button
              key={view}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`sdui-layout-state-${view}`}
              id={`sdui-layout-state-tab-${view}`}
              style={tabButtonStyles(selected)}
              onClick={() => setActiveView(view)}
            >
              {VIEW_LABELS[view]}
            </button>
          )
        })}
      </div>

      <pre
        id={`sdui-layout-state-${resolvedView}`}
        role="tabpanel"
        aria-labelledby={`sdui-layout-state-tab-${resolvedView}`}
        style={panelStyles(maxHeight)}
      >
        {json}
      </pre>
    </section>
  )
}

const ConnectedInspector = (props: Omit<SduiLayoutStateInspectorProps, 'document'>) => {
  const store = useSduiLayoutAction()
  const version = useSyncExternalStore(
    store.subscribeVersion.bind(store),
    () => store.state.version,
    () => 0,
  )
  const snapshot = useMemo(() => snapshotLayoutStateFromStore(store), [store, version])

  return <InspectorPanel {...props} snapshot={snapshot} mode="live store" />
}

const StaticInspector = ({
  document,
  ...props
}: SduiLayoutStateInspectorProps & { document: SduiLayoutDocument | null }) => {
  const snapshot = useMemo(() => (document ? snapshotLayoutStateFromDocument(document) : null), [document])

  return <InspectorPanel {...props} snapshot={snapshot} mode="from document" />
}

/**
 * Debug utility for inspecting sdui-template internal JSON state.
 *
 * - Inside `SduiLayoutProvider`: live store snapshot via version subscription.
 * - With `document` prop: static snapshot from normalization (no provider).
 */
export const SduiLayoutStateInspector: React.FC<SduiLayoutStateInspectorProps> = ({ document, ...props }) => {
  if (document !== undefined) {
    return <StaticInspector document={document} {...props} />
  }

  return <ConnectedInspector {...props} />
}
