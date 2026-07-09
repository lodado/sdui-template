import { z } from 'zod'

import { PROPERTY_COLORS } from '../collection/property'

/** Tags `attributes` — a list of colored chips (skill/tech stack). */
export const tagsAttributesSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        label: z.string(),
        color: z.enum(PROPERTY_COLORS).optional(),
      }),
    )
    .default([]),
})

export type TagsBlockAttributes = z.infer<typeof tagsAttributesSchema>
export type TagItem = TagsBlockAttributes['items'][number]
