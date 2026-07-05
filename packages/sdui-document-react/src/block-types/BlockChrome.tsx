import type { SduiDocumentBlock } from '@lodado/sdui-document'
import React from 'react'

import { BulletedListBlock } from './bulleted-list/BulletedListBlock'
import { CalloutBlock } from './callout/CalloutBlock'
import { ChecklistBlock } from './checklist/ChecklistBlock'
import { DividerBlock } from './divider/DividerBlock'
import { FileBlock } from './file/FileBlock'
import { HeadingBlock } from './heading/HeadingBlock'
import { ImageBlock } from './image/ImageBlock'
import { LinkBlock } from './link/LinkBlock'
import { NumberedListBlock } from './numbered-list/NumberedListBlock'
import { ParagraphBlock } from './paragraph/ParagraphBlock'
import { QuoteBlock } from './quote/QuoteBlock'

export type BlockChromeProps = {
  block: SduiDocumentBlock
  /** Tree depth (1 = top level) — drives the bulleted marker cycle. */
  depth?: number
  /** Render-time ordinal for numbered list items (computed from siblings, never stored). */
  listOrdinal?: number
  /** Checklist checkbox toggle — omitted (readOnly) renders a non-interactive box. */
  onToggleChecked?(blockId: string, checked: boolean): void
  /** Inline content: static InlineContentView or the focused ProseMirror editor. */
  children?: React.ReactNode
}

/**
 * Type-appropriate semantic wrapper for a block — tags and class names ported
 * from Outline's node toDOM definitions (shared/editor/nodes/*).
 *
 * Text blocks wrap `children` (static view or the focused PM editor) so the
 * typography is identical in both states. Non-text blocks (divider/image/
 * file/link) render themselves entirely and ignore `children`.
 *
 * Policies:
 * - heading level clamps to 1..4 (Outline's supported range)
 * - callout style falls back to "info" outside info/warning/tip/success
 * - image src and file/link hrefs are scheme-whitelisted via safeHref;
 *   unsafe URLs render without the attribute (span fallback for anchors)
 */
export const BlockChrome = ({ block, depth, listOrdinal, onToggleChecked, children }: BlockChromeProps) => {
  switch (block.type) {
    case 'document.heading':
      return <HeadingBlock block={block}>{children}</HeadingBlock>

    case 'document.checklist':
      return (
        <ChecklistBlock block={block} onToggleChecked={onToggleChecked}>
          {children}
        </ChecklistBlock>
      )

    case 'document.bulleted-list':
      return (
        <BulletedListBlock block={block} depth={depth}>
          {children}
        </BulletedListBlock>
      )

    case 'document.numbered-list':
      return (
        <NumberedListBlock block={block} listOrdinal={listOrdinal}>
          {children}
        </NumberedListBlock>
      )

    case 'document.quote':
      return <QuoteBlock block={block}>{children}</QuoteBlock>

    case 'document.callout':
      return <CalloutBlock block={block}>{children}</CalloutBlock>

    case 'document.divider':
      return <DividerBlock block={block} />

    case 'document.image':
      return <ImageBlock block={block} />

    case 'document.file':
      return <FileBlock block={block} />

    case 'document.link':
      return <LinkBlock block={block} />

    case 'document.paragraph':
    default:
      return <ParagraphBlock block={block}>{children}</ParagraphBlock>
  }
}
