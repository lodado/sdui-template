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

import React, { useMemo, useRef } from 'react'

import { componentMap } from '../../components/componentMap'
import type { ComponentFactory } from '../../components/types'
import type { SduiLayoutDocument } from '../../schema'
import { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreOptions } from '../../store/types'
import { SduiLayoutProvider } from '../context'
import { SduiLayoutRendererInner } from './SduiLayoutRendererInner'

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
  // Create store instance and update the document
  // components and componentOverrides are set once, so they are excluded from deps
  const store = useMemo(() => {
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
      if (!storeRef.current) {
        storeRef.current = new SduiLayoutStore(undefined, options)
        storeRef.current.updateLayout(document)
      } else {
        storeRef.current.mergeLayout(document)
      }

      return storeRef.current
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }
      // Return empty store on error
      if (storeRef.current === null) {
        storeRef.current = new SduiLayoutStore()
      }
      return storeRef.current
    }
  }, [document, components, componentOverrides])

  // Merge component map
  const mergedComponentMap = useMemo(() => {
    return {
      ...componentMap,
      ...components,
    }
  }, [components])

  // Do not render if root.id is missing (error already passed to onError)
  const rootId = document?.root?.id
  if (!rootId) {
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
