import { z } from 'zod'

/** Code block `state` — raw source text (real newlines, mirrored as hard_breaks in content). */
export const codeStateSchema = z.object({
  text: z.string().optional(),
})

/** Code block `attributes` — display language for the picker (no highlighting yet). */
export const codeAttributesSchema = z.object({
  language: z.string().optional(),
})

export type CodeBlockState = z.infer<typeof codeStateSchema>
export type CodeBlockAttributes = z.infer<typeof codeAttributesSchema>
