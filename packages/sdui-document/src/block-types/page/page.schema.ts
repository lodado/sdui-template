import { z } from 'zod'

/**
 * Page block `attributes` — reference to another document. The page's content
 * lives in the target document; this block only carries display hints.
 */
export const pageAttributesSchema = z.object({
  documentId: z.string().min(1),
  /** Emoji display icon shown before the title. */
  icon: z.string().optional(),
  coverUrl: z.string().optional(),
  /** Per-item collection property values, keyed by property id (present only inside collections). */
  properties: z.record(z.string(), z.unknown()).optional(),
})

/** Page block `state` — the display title (owned by the reference block). */
export const pageStateSchema = z.object({
  text: z.string().optional(),
})

export type PageBlockAttributes = z.infer<typeof pageAttributesSchema>
export type PageBlockState = z.infer<typeof pageStateSchema>
