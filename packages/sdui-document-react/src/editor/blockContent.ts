import type { SduiDocumentBlock, SduiInlineContent } from '@lodado/sdui-document'
import { createBlockId, textToInlineContent } from '@lodado/sdui-document'

import type { FocusedBlockCommit } from '../focused-block/FocusedBlockEditor'
import { NON_TEXT_BLOCK_TYPES } from './editorConstants'

export function defaultGenerateBlockId(): string {
  return `block-${Math.random().toString(36).slice(2, 10)}`
}

/** Deep-clones a subtree with fresh ids — Mod-D duplicate (Notion behavior). */
export function cloneBlockWithNewIds(block: SduiDocumentBlock, generateId: () => string): SduiDocumentBlock {
  return {
    ...block,
    id: createBlockId(generateId()),
    ...(block.children ? { children: block.children.map((child) => cloneBlockWithNewIds(child, generateId)) } : {}),
  }
}

export function isTextBlock(block: SduiDocumentBlock): boolean {
  return !NON_TEXT_BLOCK_TYPES.has(block.type)
}

export function blockInlineContent(block: SduiDocumentBlock | undefined): SduiInlineContent {
  const content = block?.state?.content
  if (Array.isArray(content)) {
    return content as SduiInlineContent
  }

  const text = block?.state?.text

  return typeof text === 'string' ? textToInlineContent(text) : []
}

export function isSameCommit(block: SduiDocumentBlock | undefined, commit: FocusedBlockCommit): boolean {
  if (!block) {
    return true
  }

  const existing = blockInlineContent(block)

  return JSON.stringify(existing) === JSON.stringify(commit.content)
}
