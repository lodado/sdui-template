import { z } from 'zod'

/** Quote block `state` — inline text; nested blocks live in `children`. */
export const quoteStateSchema = z.object({
  text: z.string().optional(),
})

export type QuoteBlockState = z.infer<typeof quoteStateSchema>
