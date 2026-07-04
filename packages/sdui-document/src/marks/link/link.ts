import { z } from 'zod'

import type { SduiMarkModule } from '../types'

export type LinkMark = { type: 'link'; attrs: { href: string } }

export const linkMark: SduiMarkModule<LinkMark> = {
  name: 'link',
  schema: z.object({ type: z.literal('link'), attrs: z.object({ href: z.string() }) }),
  clone: (mark) => ({ type: 'link', attrs: { ...mark.attrs } }),
  equals: (a, b) => a.attrs.href === b.attrs.href,
}
