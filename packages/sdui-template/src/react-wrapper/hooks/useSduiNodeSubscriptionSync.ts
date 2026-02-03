'use client'

/**
 * SDUI Node Subscription Sync Hook
 *
 * Subscription system that prevents tearing using useSyncExternalStore.
 * Provides efficient re-rendering via timestamp-based snapshot comparison.
 *
 * @description
 * - Prevents tearing in React 18+ concurrent rendering with useSyncExternalStore
 * - Snapshot comparison based on lastModified timestamps
 * - nodes, variables: detect changes by version subscription
 * - layoutStates/layoutAttributes: detect changes by per-node subscription
 */

import React, { useSyncExternalStore } from 'react'
import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import type { SduiLayoutStore } from '../../store/SduiLayoutStore'
import { useSduiLayoutAction } from './useSduiLayoutAction'

/**
 * useSduiNodeSubscriptionSync parameter types
 */
export interface UseSduiNodeSubscriptionSyncParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** Node ID to subscribe to */
  nodeId: string
  /** Zod schema (optional). Validates state and throws on failure. On success, state is inferred from the schema. */
  schema?: TSchema
}

/**
 * Subscribe to a specific node ID and trigger re-renders on changes.
 * Prevents tearing by using useSyncExternalStore.
 *
 * @template TSchema - Zod schema type. Infers types from the schema.
 * @param params - Subscription parameter object
 *   - `nodeId`: Node ID to subscribe to
 *   - `schema`: Zod schema (optional). Validates state and throws on failure. On success, state is inferred from the schema.
 * @returns Node info object
 *   - `node`: Node entity (SduiLayoutNode | undefined)
 *   - `type`: Node type (string | undefined)
 *   - `state`: Layout state (z.infer<TSchema> if schema is provided, otherwise Record<string, unknown>)
 *   - `childrenIds`: Array of child node IDs (string[])
 *   - `attributes`: Node attributes (Record<string, unknown> | undefined)
 *   - `reference`: Node reference (string | string[] | undefined)
 *   - `exists`: Whether the node exists (boolean)
 *
 * @example
 * ```tsx
 * const { node, state } = useSduiNodeSubscriptionSync({
 *   nodeId: 'node-1',
 *   schema: baseLayoutStateSchema, // optional
 * });
 * ```
 */
export function useSduiNodeSubscriptionSync<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeSubscriptionSyncParams<TSchema>,
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  reference: string | string[] | undefined
  exists: boolean
} {
  const { nodeId, schema } = params
  const store = useSduiLayoutAction()

  // Subscribe and select snapshots using useSyncExternalStore
  // Efficiently detect changes by comparing only the node's lastModified value
  const lastModifiedCacheRef = React.useRef<string | null>(null)
  const serverSnapshotCacheRef = React.useRef<string | null>(null)

  const lastModifiedValue = useSyncExternalStore<string>(
    // subscribe function: subscribe to both node and version changes
    (onStoreChange) => {
      // Per-node subscription (detect layoutStates/layoutAttributes changes)
      const unsubscribeNode = store.subscribeNode(nodeId, onStoreChange)
      // Version subscription (detect nodes, rootId, variables changes)
      const unsubscribeVersion = store.subscribeVersion(onStoreChange)

      // Return a function that unsubscribes from both
      return () => {
        unsubscribeNode()
        unsubscribeVersion()
      }
    },
    // getSnapshot: return only the node's lastModified value (for comparison)
    () => {
      const lastModifiedSnapshot = store.getSnapshot()
      const value = lastModifiedSnapshot[nodeId] || 'none'

      // If the value matches, return the same string reference (caching)
      if (lastModifiedCacheRef.current === value) {
        return lastModifiedCacheRef.current
      }

      lastModifiedCacheRef.current = value
      return value
    },
    // getServerSnapshot: return a snapshot for SSR (cache to prevent infinite loops)
    () => {
      // Compute the server snapshot once and cache it to keep a stable reference
      if (serverSnapshotCacheRef.current === null) {
        const lastModifiedSnapshot = store.getServerSnapshot()
        serverSnapshotCacheRef.current = lastModifiedSnapshot[nodeId] || 'none'
      }
      return serverSnapshotCacheRef.current
    },
  )

  // When the lastModified reference changes, re-render; read directly from store.state here
  const { nodes } = store.state
  const node = nodes[nodeId]
  const childrenIds = (node as any)?.childrenIds || []
  const rawState = node?.state
  const attributes = node?.attributes
  const reference = node?.reference

  // Schema validation
  let validatedState: Record<string, unknown>

  if (!schema) {
    // If no schema, use rawState (or an empty object if missing)
    validatedState = rawState || {}
  } else if (!node || !rawState) {
    // If the node is missing, skip validation and return an empty object
    validatedState = {}
  } else {
    // Perform schema validation
    const result = schema.safeParse(rawState)
    if (!result.success) {
      throw new Error(`State validation failed for node "${nodeId}": ${result.error.message}`)
    }
    validatedState = result.data
  }

  return {
    node,
    type: node?.type,
    state: validatedState as TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>,
    childrenIds,
    attributes,
    reference,
    exists: !!node,
  }
}
