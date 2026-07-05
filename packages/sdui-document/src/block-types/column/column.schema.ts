import { z } from 'zod'

/**
 * Column block `attributes` — relative width weight among sibling columns.
 * `ratio` must be a positive finite number; anything else is treated as
 * absent (equal split) by the mapper.
 */
export const columnAttributesSchema = z.object({
  ratio: z.number().positive().finite().optional(),
})

export type ColumnBlockAttributes = z.infer<typeof columnAttributesSchema>

/** Runtime guard mirroring the schema policy — invalid ratios degrade to equal split. */
export function normalizeColumnRatio(ratio: unknown): number | undefined {
  return typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}
