import { z } from 'zod'

/** Heading block `state` — text plus a 1–3 level. */
export const headingStateSchema = z.object({
  text: z.string().optional(),
  level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
})

export type HeadingBlockState = z.infer<typeof headingStateSchema>
