import { z } from 'zod'

// Logo component state schema
export const logoStateSchema = z.object({
  src: z.string(),
  alt: z.string(),
})

export type LogoState = z.infer<typeof logoStateSchema>
