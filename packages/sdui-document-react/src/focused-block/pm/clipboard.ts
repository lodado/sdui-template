import type { Node as PmNode } from 'prosemirror-model'
import { Fragment, Slice } from 'prosemirror-model'
import type { EditorView } from 'prosemirror-view'

import { focusedBlockSchema } from './schema'

/**
 * Builds an inline slice from multiline plain text — one hard_break per
 * newline. The schema is inline-only, so PM's default paste path has no block
 * node to map lines onto and silently glues them together; this parser is
 * what keeps a cross-block partial copy ("tail of a\nhead of b") readable
 * after pasting.
 */
export function multilineTextToSlice(text: string): Slice {
  const nodes = text.split(/\r?\n/).reduce<PmNode[]>((accumulated, line, index) => {
    const parts = [...accumulated]
    if (index > 0) {
      parts.push(focusedBlockSchema.nodes.hard_break.create())
    }

    if (line.length > 0) {
      parts.push(focusedBlockSchema.text(line))
    }

    return parts
  }, [])

  return new Slice(Fragment.from(nodes), 0, 0)
}

const BLOCK_TAG_PATTERN = 'p|div|h[1-6]|li|blockquote|pre|ul|ol|table|tr|section|article'
const BLOCK_BOUNDARY_REGEX = new RegExp(`(</(?:${BLOCK_TAG_PATTERN})>)(?=\\s*<(?:${BLOCK_TAG_PATTERN})[\\s>])`, 'gi')

/**
 * transformPastedHTML hook: marks a block boundary with a <br> so the
 * inline-only schema keeps the line structure.
 *
 * PM's default HTML paste path preserves marks (parseDOM), but with no block
 * nodes to map <p>/<h1>/… onto it glues their contents together. Injecting a
 * <br> between adjacent closing/opening block tags turns each boundary into
 * exactly one hard_break — nested wrappers (</p></div><div><p>) still yield
 * a single break because only the outermost closing/opening pair is adjacent.
 */
export function insertLineBreaksBetweenBlocks(html: string): string {
  return html.replace(BLOCK_BOUNDARY_REGEX, '$1<br>')
}

/**
 * PM handlePaste hook: takes over only for MULTILINE **plain-text-only**
 * pastes (no text/html flavor — e.g. from terminals/plain editors).
 *
 * Anything carrying text/html stays on PM's default path, which preserves
 * marks; insertLineBreaksBetweenBlocks (wired as transformPastedHTML) keeps
 * the line structure there.
 */
export function handleMultilinePaste(view: EditorView, event: ClipboardEvent): boolean {
  if (event.clipboardData?.types.includes('text/html')) {
    return false
  }

  // trailing newlines are serializer artifacts (copying whole lines/blocks),
  // not content — pasting them would leave a stray break after the caret
  const text = event.clipboardData?.getData('text/plain')?.replace(/[\r\n]+$/, '')
  if (!text || !/[\r\n]/.test(text)) {
    return false
  }

  view.dispatch(view.state.tr.replaceSelection(multilineTextToSlice(text)).scrollIntoView())

  return true
}
