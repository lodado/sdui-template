import { z } from 'zod'

/** Numbered list item `state` — inline text only; the ordinal is computed at render. */
export const numberedListStateSchema = z.object({
  text: z.string().optional(),
})

export type NumberedListBlockState = z.infer<typeof numberedListStateSchema>
