'use client'

/**
 * SDUI Node Reference Hook
 *
 * Hook that provides easy access to nodes referenced via the reference field.
 * Automatically subscribes to changes in referenced nodes to trigger re-renders.
 *
 * @description
 * - If reference is a string, it is a single node; string[] references multiple nodes
 * - Returns referenced nodes' state, attributes, etc. as arrays and maps
 * - Automatically subscribes to referenced node changes
 * - Direct access by ID: referencedNodesMap[id]
 * - Iterate: referencedNodes.forEach(...)
 */

import React, { useMemo, useSyncExternalStore } from 'react'
import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStore } from '../../store/SduiLayoutStore'
import { useSduiLayoutAction } from './useSduiLayoutAction'
import { useSduiNodeSubscription } from './useSduiNodeSubscription'

/**
 * Referenced node info type
 */
export interface ReferencedNodeInfo {
  /** Node ID */
  id: string
  /** Node entity */
  node: SduiLayoutNode | undefined
  /** Node type */
  type: string | undefined
  /** Node state */
  state: Record<string, unknown>
  /** Node attributes */
  attributes: Record<string, unknown> | undefined
  /** Whether the node exists */
  exists: boolean
}

/**
 * useSduiNodeReference parameter type
 */
export interface UseSduiNodeReferenceParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** Node ID that holds the reference */
  nodeId: string
  /** Zod schema to validate referenced node state (optional) */
  schema?: TSchema
}

/**
 * Helper hook to subscribe to multiple node IDs and collect their info.
 *
 * Uses useSyncExternalStore to subscribe to all nodes at once.
 * Prevents tearing issues.
 *
 * @template TSchema - Zod schema type
 * @param nodeIds - Array of node IDs to subscribe to
 * @param schema - Zod schema (optional)
 * @returns Array of subscription results for each node
 */
function useMultipleNodeSubscriptions<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(nodeIds: string[], schema?: TSchema): Array<ReturnType<typeof useSduiNodeSubscription<TSchema>>> {
  const store = useSduiLayoutAction()

  // Cache for extracting lastModified values per node ID
  // Return the same array reference when nodeIds and lastModified values are unchanged
  const lastModifiedCacheRef = React.useRef<{
    nodeIdsKey: string
    values: string[]
  } | null>(null)
  const serverSnapshotCacheRef = React.useRef<{
    nodeIdsKey: string
    values: string[]
  } | null>(null)

  // Subscribe to all nodes using useSyncExternalStore
  // Compare only the lastModified values for each node
  const lastModifiedValues = useSyncExternalStore(
    // subscribe function: subscribe to all nodes and version changes
    (onStoreChange) => {
      // Subscribe to each node
      const unsubscribes = nodeIds.map((nodeId) => store.subscribeNode(nodeId, onStoreChange))
      // Subscribe to version (detects full nodes changes)
      const unsubscribeVersion = store.subscribeVersion(onStoreChange)

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe())
        unsubscribeVersion()
      }
    },
    // getSnapshot: return only lastModified values for subscribed nodes
    () => {
      const lastModifiedSnapshot = store.getSnapshot()
      const values = nodeIds.map((id) => lastModifiedSnapshot[id] || 'none')
      const nodeIdsKey = nodeIds.join(',')

      // Cache check: return the same array reference when nodeIds and values match
      if (
        lastModifiedCacheRef.current &&
        lastModifiedCacheRef.current.nodeIdsKey === nodeIdsKey &&
        lastModifiedCacheRef.current.values.length === values.length &&
        lastModifiedCacheRef.current.values.every((val, idx) => val === values[idx])
      ) {
        return lastModifiedCacheRef.current.values
      }

      // Create a new array and update cache
      lastModifiedCacheRef.current = { nodeIdsKey, values }
      return values
    },
    // getServerSnapshot: for SSR (cache to prevent infinite loops)
    () => {
      const nodeIdsKey = nodeIds.join(',')
      
      // Compute the server snapshot once and cache it to keep a stable reference
      if (
        serverSnapshotCacheRef.current &&
        serverSnapshotCacheRef.current.nodeIdsKey === nodeIdsKey
      ) {
        return serverSnapshotCacheRef.current.values
      }

      const lastModifiedSnapshot = store.getServerSnapshot()
      const values = nodeIds.map((id) => lastModifiedSnapshot[id] || 'none')
      serverSnapshotCacheRef.current = { nodeIdsKey, values }
      return values
    },
  )

  // When lastModified values change, re-render; read directly from store.state here
  const { nodes } = store.state

  // Validate schema and transform results
  // Convert lastModified values to a string for the dependency array
  const lastModifiedKeys = useMemo(() => lastModifiedValues.join(':'), [lastModifiedValues])

  return useMemo(() => {
    return nodeIds.map((nodeId) => {
      const node = nodes[nodeId]
      const childrenIds = (node as any)?.childrenIds || []
      const rawState = node?.state || {}
      const attributes = node?.attributes
      const reference = node?.reference

      let validatedState: Record<string, unknown>
      if (schema) {
        const result = schema.safeParse(rawState)
        if (!result.success) {
          throw new Error(`State validation failed for referenced node "${nodeId}": ${result.error.message}`)
        }
        validatedState = result.data
      } else {
        validatedState = rawState
      }

      return {
        node,
        type: node?.type,
        state: validatedState,
        childrenIds,
        attributes,
        reference,
        exists: !!node,
      }
    }) as Array<ReturnType<typeof useSduiNodeSubscription<TSchema>>>
  }, [nodeIds, nodes, schema, lastModifiedKeys])
}

/**
 * Hook that returns information about nodes referenced via the reference field.
 *
 * @template TSchema - Zod schema type. Validates referenced nodes' state.
 * @param params - Parameter object
 *   - `nodeId`: Node ID that holds the reference
 *   - `schema`: Zod schema (optional). Validates referenced nodes' state.
 * @returns Referenced node info
 *   - `referencedNodes`: Array of referenced node info (for iteration)
 *   - `referencedNodesMap`: Map of referenced node info (direct access by ID)
 *   - `reference`: Original reference value (string | string[] | undefined)
 *   - `hasReference`: Whether a reference exists (boolean)
 *
 * @example
 * ```tsx
 * // Direct access by ID
 * const { referencedNodesMap } = useSduiNodeReference({ nodeId: 'source-node' })
 * const targetNode = referencedNodesMap['target-node-id']
 *
 * // Iterate over the array
 * const { referencedNodes } = useSduiNodeReference({
 *   nodeId: 'source-node',
 *   schema: cardStateSchema // optional
 * })
 * referencedNodes.forEach(node => {
 *   console.log(node.state.title)
 * })
 * ```
 */
export function useSduiNodeReference<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeReferenceParams<TSchema>,
): {
  referencedNodes: Array<
    ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
  >
  referencedNodesMap: Record<
    string,
    ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
  >
  reference: string | string[] | undefined
  hasReference: boolean
} {
  const { nodeId, schema } = params

  // Get the current node's reference
  const { reference } = useSduiNodeSubscription({ nodeId })

  // Convert referenced IDs to an array
  const referencedIds = useMemo(() => {
    if (!reference) return []
    return Array.isArray(reference) ? reference : [reference]
  }, [reference])

  // Subscribe to each referenced node and collect info (using helper)
  const referencedSubscriptions = useMultipleNodeSubscriptions<TSchema>(referencedIds, schema)

  // Convert referenced node info into ReferencedNodeInfo and build the map
  const { referencedNodes, referencedNodesMap } = useMemo(() => {
    const nodes = referencedSubscriptions.map((sub, index) => {
      const refId = referencedIds[index]
      return {
        id: refId,
        node: sub.node,
        type: sub.type,
        state: sub.state,
        attributes: sub.attributes,
        exists: sub.exists,
      }
    }) as Array<
      ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
    >

    // Build a map for direct access by ID (single pass)
    const map: Record<
      string,
      ReferencedNodeInfo & { state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown> }
    > = {}
    nodes.forEach((node) => {
      map[node.id] = node
    })

    return { referencedNodes: nodes, referencedNodesMap: map }
  }, [referencedSubscriptions, referencedIds])

  return {
    referencedNodes,
    referencedNodesMap,
    reference,
    hasReference: referencedIds.length > 0,
  }
}
