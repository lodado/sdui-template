import { z } from 'zod'

import { blockAlignSchema } from '../shared/align'
import { isSafeCtaUrl } from '../shared/url'

/** Button `attributes` — CTA href (http/https/mailto), visual variant, alignment. */
export const buttonAttributesSchema = z.object({
  href: z.string().refine(isSafeCtaUrl, { message: 'href must be http(s) or mailto' }),
  variant: z.enum(['primary', 'secondary', 'outline']).default('primary'),
  align: blockAlignSchema.optional(),
})

export type ButtonBlockAttributes = z.infer<typeof buttonAttributesSchema>
