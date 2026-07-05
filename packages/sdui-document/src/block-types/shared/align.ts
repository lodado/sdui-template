import { z } from 'zod'

/**
 * Horizontal alignment for text blocks (heading/paragraph) and media (image).
 * Absent means the block inherits its natural flow alignment (start).
 */
export const blockAlignSchema = z.enum(['left', 'center', 'right'])

export type BlockAlign = z.infer<typeof blockAlignSchema>

/** Runtime guard — invalid/absent values degrade to `undefined` (natural flow). */
export function resolveBlockAlign(value: unknown): BlockAlign | undefined {
  return value === 'left' || value === 'center' || value === 'right' ? value : undefined
}
