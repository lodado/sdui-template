import { z } from 'zod'

import { isSafeHttpUrl } from '../shared/url'

/** Bookmark `attributes` — a URL plus unfurled metadata persisted at edit time. */
export const bookmarkAttributesSchema = z.object({
  url: z.string().refine(isSafeHttpUrl, { message: 'url must be http(s)' }),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  unfurledAt: z.string().optional(),
})

export type BookmarkBlockAttributes = z.infer<typeof bookmarkAttributesSchema>
