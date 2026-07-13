'use client'

/**
 * SDUI Layout Renderer
 *
 * Top-level component that renders the entire UI from an SDUI Layout Document.
 * Render Props Pattern: defines the renderNode function and injects it into child components.
 *
 * @param document - SDUI Layout Document (required)
 * @param components - Custom component map (optional, merged with defaults)
 * @param componentOverrides - Component overrides by ID or type (optional, ID > type priority)
 * @param onLayoutChange - Callback when layout changes (optional)
 * @param onError - Error callback (optional)
 *
 * @example
 * ```tsx
 * <SduiLayoutRenderer
 *   document={myDocument}
 *   components={{ CustomChart: CustomChartFactory }}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 *
 * @remarks
 * - Must be wrapped with "use client" directive in Next.js App Router
 * - Component overrides: byNodeId > byNodeType > defaultComponentFactory
 * - Errors are passed to onError callback, component continues rendering if possible
 */

import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react'

import { componentMap } from '../../components/componentMap'
import type { ComponentFactory } from '../../components/types'
import type { SduiLayoutDocument } from '../../schema'
import { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreOptions } from '../../store/types'
import { SduiLayoutProvider } from '../context'
import { SduiLayoutRendererInner } from './SduiLayoutRendererInner'

/**
 * useLayoutEffect on the client (flush the store merge before paint to avoid a
 * stale frame); useEffect on the server to silence the SSR-only warning.
 */
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface SduiLayoutRendererProps {
  /** SDUI Layout Document */
  document: SduiLayoutDocument
  /** Custom component map (components added to componentMap) */
  components?: Record<string, ComponentFactory>
  /** One-time component override settings */
  componentOverrides?: {
    byNodeId?: Record<string, ComponentFactory>
    byNodeType?: Record<string, ComponentFactory>
  }
  /** Layout change callback */
  onLayoutChange?: (document: SduiLayoutDocument) => void
  /** Error callback */
  onError?: (error: Error) => void
  /** Rendered inside SduiLayoutProvider — useful for debug panels such as SduiLayoutStateInspector. */
  children?: React.ReactNode
  /**
   * Non-visual children rendered inside SduiLayoutProvider with no layout
   * wrapper (unlike `children`, which opens the side-panel grid) — for
   * store-effect components such as variable bridges.
   */
  effects?: React.ReactNode
}

/**
 * SduiLayoutRenderer
 *
 * Top-level component that renders an SDUI Layout Document.
 */
export const SduiLayoutRenderer: React.FC<SduiLayoutRendererProps> = ({
  document,
  components,
  componentOverrides,
  onLayoutChange,
  onError,
  children,
  effects,
}) => {
  const storeRef = useRef<SduiLayoutStore | null>(null)
  const appliedDocumentRef = useRef<SduiLayoutDocument | null>(null)

  // Create the store and inject the initial layout during the first render.
  // No child node has subscribed yet, so updateLayout notifies nobody — safe,
  // and it keeps the initial (SSR / first-paint) content.
  // components/componentOverrides are applied once at creation only.
  if (storeRef.current === null) {
    try {
      // Document validation
      if (!document || !document.root) {
        throw new Error('Invalid document: missing root')
      }
      if (!document.root.id) {
        throw new Error('Invalid document: root.id is required')
      }

      const options: SduiLayoutStoreOptions = {
        // Merge with spread (components → byNodeType → byNodeId order, ID takes priority)
        componentOverrides: {
          ...components,
          ...componentOverrides?.byNodeType,
          ...componentOverrides?.byNodeId,
        },
      }
      const store = new SduiLayoutStore(undefined, options)
      store.updateLayout(document)
      storeRef.current = store
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }
      // Fall back to an empty store on error
      storeRef.current = new SduiLayoutStore()
    }
    appliedDocumentRef.current = document
  }

  // Subsequent document changes merge in the commit phase, never during render.
  // A render-phase store write notifies already-mounted subscribers mid-render
  // ("Cannot update a component while rendering a different component").
  useIsomorphicLayoutEffect(() => {
    if (appliedDocumentRef.current === document) {
      return
    }
    appliedDocumentRef.current = document
    try {
      if (!document?.root?.id) {
        throw new Error('Invalid document: root.id is required')
      }
      storeRef.current?.mergeLayout(document)
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }
    }
  }, [document])

  // Merge component map
  const mergedComponentMap = useMemo(() => {
    return {
      ...componentMap,
      ...components,
    }
  }, [components])

  // Do not render if root.id is missing (error already passed to onError)
  const rootId = document?.root?.id
  const store = storeRef.current
  if (!rootId || !store) {
    return null
  }

  return (
    <SduiLayoutProvider store={store}>
      {effects}
      {children ? (
        <div
          style={{
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            alignItems: 'start',
          }}
        >
          <SduiLayoutRendererInner id={rootId} componentMap={mergedComponentMap} />
          {children}
        </div>
      ) : (
        <SduiLayoutRendererInner id={rootId} componentMap={mergedComponentMap} />
      )}
    </SduiLayoutProvider>
  )
}
