import { z } from 'zod'

import { blockAlignSchema } from '../shared/align'

/** Paragraph block `state` — plain text-bearing. */
export const paragraphStateSchema = z.object({
  text: z.string().optional(),
})

export type ParagraphBlockState = z.infer<typeof paragraphStateSchema>

/** Paragraph block `attributes` — `align` sets horizontal text alignment. */
export const paragraphAttributesSchema = z.object({
  align: blockAlignSchema.optional(),
})

export type ParagraphBlockAttributes = z.infer<typeof paragraphAttributesSchema>
