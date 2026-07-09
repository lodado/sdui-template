import { z } from 'zod'

import { isSafeHttpUrl } from '../shared/url'

/** Embed `attributes` — a URL and iframe height (allowlist enforced at render). */
export const embedAttributesSchema = z.object({
  url: z.string().refine(isSafeHttpUrl, { message: 'url must be http(s)' }),
  height: z.number().int().min(100).max(2000).default(400),
})

export type EmbedBlockAttributes = z.infer<typeof embedAttributesSchema>
