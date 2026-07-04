import { z } from 'zod'

import { type BoldMark, boldMark } from './bold/bold'
import { type CodeMark, codeMark } from './code/code'
import { type HighlightMark, highlightMark } from './highlight/highlight'
import { type ItalicMark, italicMark } from './italic/italic'
import { type LinkMark, linkMark } from './link/link'
import { type StrikethroughMark, strikethroughMark } from './strikethrough/strikethrough'
import type { SduiMarkModule } from './types'
import { type UnderlineMark, underlineMark } from './underline/underline'

export type SduiInlineMark =
  | BoldMark
  | ItalicMark
  | StrikethroughMark
  | UnderlineMark
  | CodeMark
  | LinkMark
  | HighlightMark

/**
 * Domain mark registry — drives validation (inlineMarkSchema) and the
 * inline-content mark operations (cloneMark / marksEqual).
 * Render-side registry: packages/sdui-document-react/src/marks/index.ts.
 */
export const MARK_MODULES = [
  boldMark,
  italicMark,
  strikethroughMark,
  underlineMark,
  codeMark,
  linkMark,
  highlightMark,
] as const

const markModuleByName = {
  bold: boldMark,
  italic: italicMark,
  strikethrough: strikethroughMark,
  underline: underlineMark,
  code: codeMark,
  link: linkMark,
  highlight: highlightMark,
  // eslint-disable-next-line no-use-before-define
} satisfies { [Name in SduiInlineMark['type']]: SduiMarkModule<Extract<SduiInlineMark, { type: Name }>> }

export const inlineMarkSchema = z.union([
  boldMark.schema,
  italicMark.schema,
  strikethroughMark.schema,
  underlineMark.schema,
  codeMark.schema,
  linkMark.schema,
  highlightMark.schema,
])

export function cloneMark<Mark extends SduiInlineMark>(mark: Mark): Mark {
  // TS cannot correlate mark.type with the registry entry; the registry map above guarantees the match.
  const markModule = markModuleByName[mark.type] as unknown as SduiMarkModule<Mark>
  return markModule.clone(mark)
}

export function marksEqual(a: SduiInlineMark[] = [], b: SduiInlineMark[] = []): boolean {
  if (a.length !== b.length) {
    return false
  }

  return a.every((mark, markIndex) => {
    const other = b[markIndex]
    if (mark.type !== other.type) {
      return false
    }

    // TS cannot correlate mark.type with the registry entry; the registry map above guarantees the match.
    const markModule = markModuleByName[mark.type] as unknown as SduiMarkModule<SduiInlineMark>
    return markModule.equals(mark, other)
  })
}

export type { BoldMark, CodeMark, HighlightMark, ItalicMark, LinkMark, StrikethroughMark, UnderlineMark }
export { boldMark, codeMark, highlightMark, italicMark, linkMark, strikethroughMark, underlineMark }
export { HIGHLIGHT_COLOR_PATTERN, isValidHighlightColor } from './highlight/highlight'
export type { SduiMarkModule } from './types'
