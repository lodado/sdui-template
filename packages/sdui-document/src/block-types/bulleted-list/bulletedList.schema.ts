import { z } from 'zod'

/** Bulleted list item `state` — inline text only; nesting lives in `children`. */
export const bulletedListStateSchema = z.object({
  text: z.string().optional(),
})

export type BulletedListBlockState = z.infer<typeof bulletedListStateSchema>
