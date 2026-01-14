import { z } from 'zod'

// Logo 컴포넌트 상태 스키마
export const logoStateSchema = z.object({
  src: z.string(),
  alt: z.string(),
})

export type LogoState = z.infer<typeof logoStateSchema>
