import { z } from 'zod'

/** Checklist block `state` — text plus a checked flag. */
export const checklistStateSchema = z.object({
  text: z.string().optional(),
  checked: z.boolean().optional(),
})

export type ChecklistBlockState = z.infer<typeof checklistStateSchema>
