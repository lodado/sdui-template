import { z } from 'zod'

import { blockAlignSchema } from '../shared/align'

/** Heading block `state` — text plus a 1–3 level. */
export const headingStateSchema = z.object({
  text: z.string().optional(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
})

export type HeadingBlockState = z.infer<typeof headingStateSchema>

/**
 * Heading block `attributes` — the React editor reads `level` from here (the
 * mapper uses `state.level`); `align` sets horizontal text alignment.
 */
export const headingAttributesSchema = z.object({
  level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]).optional(),
  align: blockAlignSchema.optional(),
})

export type HeadingBlockAttributes = z.infer<typeof headingAttributesSchema>
