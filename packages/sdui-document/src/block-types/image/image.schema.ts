import { z } from 'zod'

import { blockAlignSchema } from '../shared/align'

/** Image block `attributes` — source, alt text, intrinsic size, and alignment. */
export const imageAttributesSchema = z.object({
  src: z.string().optional(),
  alt: z.string().optional(),
  width: z.number().positive().finite().optional(),
  height: z.number().positive().finite().optional(),
  align: blockAlignSchema.optional(),
})

export type ImageBlockAttributes = z.infer<typeof imageAttributesSchema>
