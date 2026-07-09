import { z } from 'zod'

import { propertyDefSchema } from './property'

export const COLLECTION_VIEWS = ['gallery', 'list', 'board', 'timeline'] as const
export type CollectionView = (typeof COLLECTION_VIEWS)[number]

export const collectionViewSchema = z.enum(COLLECTION_VIEWS)

/** Collection block `attributes` — view config + property schema definitions. */
export const collectionAttributesSchema = z.object({
  view: collectionViewSchema.default('gallery'),
  properties: z.array(propertyDefSchema).default([]),
  /** board: select property id used for columns. */
  groupBy: z.string().optional(),
  sortBy: z.object({ propertyId: z.string(), direction: z.enum(['asc', 'desc']) }).optional(),
  cardSize: z.enum(['small', 'medium', 'large']).optional(),
})

export type CollectionBlockAttributes = z.infer<typeof collectionAttributesSchema>
