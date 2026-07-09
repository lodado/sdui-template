import { z } from 'zod'

import { isSafeHttpUrl } from '../shared/url'

/** Video `attributes` — original URL + parsed provider/id + aspect ratio. */
export const videoAttributesSchema = z.object({
  url: z.string().refine(isSafeHttpUrl, { message: 'url must be http(s)' }),
  provider: z.enum(['youtube', 'vimeo']),
  videoId: z.string().min(1),
  aspectRatio: z.enum(['16:9', '4:3']).default('16:9'),
})

export type VideoBlockAttributes = z.infer<typeof videoAttributesSchema>
