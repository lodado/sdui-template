'use client'

/**
 * SDUI Node Subscription Sync Hook
 *
 * Subscription system that prevents tearing using useSyncExternalStore.
 * Composes subscription-only hook + getNodeSubscriptionData (read + schema validate).
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

export interface GetNodeSubscriptionDataReturn<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  reference: string | string[] | undefined
  exists: boolean
}

/**
 * Read node data from store and optionally validate state with schema.
 * No subscription — use when re-render on store change is not needed (e.g. read every frame).
 */
export function getNodeSubscriptionData<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  store: SduiLayoutStore,
  nodeId: string,
  schema?: TSchema,
): GetNodeSubscriptionDataReturn<TSchema> {
  const { nodes } = store.state
  const node = nodes[nodeId]
  const childrenIds = node?.childrenIds ?? []
  const rawState = node?.state
  const attributes = node?.attributes
  const reference = node?.reference

  let validatedState: Record<string, unknown>

  if (!schema) {
    validatedState = rawState ?? {}
  } else if (!node || rawState === undefined) {
    validatedState = {}
  } else {
    const result = schema.safeParse(rawState)
    if (!result.success) {
      throw new Error(`State validation failed for node "${nodeId}": ${result.error.message}`)
    }
    validatedState = result.data
  }

  return {
    node,
    type: node?.type,
    state: validatedState as GetNodeSubscriptionDataReturn<TSchema>['state'],
    childrenIds,
    attributes,
    reference,
    exists: !!node,
  }
}

const NONE = 'none'

/**
 * Subscription-only: triggers re-render when node or version changes.
 * Returns lastModified snapshot value; does not read node data.
 */
function useSduiNodeSubscriptionSnapshot(store: SduiLayoutStore, nodeId: string): string {
  const lastModifiedCacheRef = React.useRef<string | null>(null)
  const serverSnapshotCacheRef = React.useRef<string | null>(null)

  return useSyncExternalStore<string>(
    (onStoreChange) => {
      const unsubscribeNode = store.subscribeNode(nodeId, onStoreChange)
      const unsubscribeVersion = store.subscribeVersion(onStoreChange)
      return () => {
        unsubscribeNode()
        unsubscribeVersion()
      }
    },
    () => {
      const value = store.getSnapshot()[nodeId] ?? NONE
      if (lastModifiedCacheRef.current === value) {
        return lastModifiedCacheRef.current
      }
      lastModifiedCacheRef.current = value
      return value
    },
    () => {
      if (serverSnapshotCacheRef.current === null) {
        serverSnapshotCacheRef.current = store.getServerSnapshot()[nodeId] ?? NONE
      }
      return serverSnapshotCacheRef.current
    },
  )
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
 */
export function useSduiNodeSubscriptionSync<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeSubscriptionSyncParams<TSchema>,
): GetNodeSubscriptionDataReturn<TSchema> {
  const { nodeId, schema } = params
  const store = useSduiLayoutAction()

  useSduiNodeSubscriptionSnapshot(store, nodeId)

  return getNodeSubscriptionData(store, nodeId, schema)
}
