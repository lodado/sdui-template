import { z } from 'zod'

/** Callout block `attributes` — visual tone. */
export const calloutAttributesSchema = z.object({
  tone: z.union([z.literal('info'), z.literal('tip'), z.literal('warning'), z.literal('success')]).optional(),
  /** Optional emoji glyph that overrides the tone icon. */
  icon: z.string().optional(),
})

export type CalloutBlockAttributes = z.infer<typeof calloutAttributesSchema>
