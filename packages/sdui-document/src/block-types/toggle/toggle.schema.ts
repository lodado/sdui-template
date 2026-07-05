import { z } from 'zod'

/** Toggle block `state` — the always-visible summary text. */
export const toggleStateSchema = z.object({
  text: z.string().optional(),
})

/** Toggle block `attributes` — persisted open/closed state. */
export const toggleAttributesSchema = z.object({
  collapsed: z.boolean().optional(),
})

export type ToggleBlockState = z.infer<typeof toggleStateSchema>
export type ToggleBlockAttributes = z.infer<typeof toggleAttributesSchema>
