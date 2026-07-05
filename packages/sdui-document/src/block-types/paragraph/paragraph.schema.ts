import { z } from 'zod'

/** Paragraph block `state` — plain text-bearing. */
export const paragraphStateSchema = z.object({
  text: z.string().optional(),
})

export type ParagraphBlockState = z.infer<typeof paragraphStateSchema>
