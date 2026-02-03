'use client'

/**
 * SDUI Node Subscription Hook
 *
 * Uses a useSyncExternalStore-based subscription system to detect changes
 * for a specific node and trigger re-renders. To prevent tearing,
 * it uses useSduiNodeSubscriptionSync internally.
 *
 * @description
 * - Prevents tearing in React 18+ concurrent rendering with useSyncExternalStore
 * - nodes, variables: detect changes by version subscription
 * - layoutStates/layoutAttributes: detect changes by per-node subscription
 * - Efficient re-rendering via timestamp-based snapshot comparison
 */

import type { z, ZodSchema } from 'zod'

import type { SduiLayoutNode } from '../../schema'
import { useSduiNodeSubscriptionSync } from './useSduiNodeSubscriptionSync'

/**
 * useSduiNodeSubscription parameter types
 */
export interface UseSduiNodeSubscriptionParams<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
> {
  /** Node ID to subscribe to */
  nodeId: string
  /** Zod schema (optional). Validates state and throws on failure. On success, state is inferred from the schema. */
  schema?: TSchema
}

/**
 * Subscribe to a specific node ID and trigger re-renders on changes.
 *
 * Internally uses useSyncExternalStore to prevent tearing.
 *
 * - nodes, variables: detect changes by version subscription
 * - layoutStates: detect changes by per-node subscription
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
 * const { node, state } = useSduiNodeSubscription({
 *   nodeId: 'node-1',
 *   schema: baseLayoutStateSchema, // optional
 * });
 * ```
 */
export function useSduiNodeSubscription<
  TSchema extends ZodSchema<Record<string, unknown>> = ZodSchema<Record<string, unknown>>,
>(
  params: UseSduiNodeSubscriptionParams<TSchema>,
): {
  node: SduiLayoutNode | undefined
  type: string | undefined
  state: TSchema extends ZodSchema<any> ? z.infer<TSchema> : Record<string, unknown>
  childrenIds: string[]
  attributes: Record<string, unknown> | undefined
  reference: string | string[] | undefined
  exists: boolean
} {
  // Delegate to the useSyncExternalStore-based subscription
  return useSduiNodeSubscriptionSync(params)
}
