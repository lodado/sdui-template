import type { SduiDocumentBlock } from '../schema'

export type ParagraphBlockState = { text?: string }

export type HeadingBlockState = { text?: string; level?: 1 | 2 | 3 }

export type ChecklistBlockState = { text?: string; checked?: boolean }

export type CalloutBlockAttributes = {
  tone?: 'info' | 'tip' | 'warning' | 'success'
}

export type ImageBlockAttributes = { src?: string; alt?: string }

export type FileBlockAttributes = { title?: string; size?: string }

export type LinkBlockAttributes = { href?: string; targetDocumentId?: string }

export type ParagraphBlock = SduiDocumentBlock & {
  type: 'document.paragraph'
  state: ParagraphBlockState
}

export type HeadingBlock = SduiDocumentBlock & {
  type: 'document.heading'
  state: HeadingBlockState
}

export type ChecklistBlock = SduiDocumentBlock & {
  type: 'document.checklist'
  state: ChecklistBlockState
}

export type DividerBlock = SduiDocumentBlock & { type: 'document.divider' }

export type CalloutBlock = SduiDocumentBlock & {
  type: 'document.callout'
  attributes: CalloutBlockAttributes
}

export type ImageBlock = SduiDocumentBlock & {
  type: 'document.image'
  attributes: ImageBlockAttributes
}

export type FileBlock = SduiDocumentBlock & {
  type: 'document.file'
  attributes: FileBlockAttributes
}

export type LinkBlock = SduiDocumentBlock & {
  type: 'document.link'
  attributes: LinkBlockAttributes
}

export function isParagraphBlock(block: SduiDocumentBlock): block is ParagraphBlock {
  return block.type === 'document.paragraph'
}

export function isHeadingBlock(block: SduiDocumentBlock): block is HeadingBlock {
  return block.type === 'document.heading'
}

export function isChecklistBlock(block: SduiDocumentBlock): block is ChecklistBlock {
  return block.type === 'document.checklist'
}

export function isDividerBlock(block: SduiDocumentBlock): block is DividerBlock {
  return block.type === 'document.divider'
}

export function isCalloutBlock(block: SduiDocumentBlock): block is CalloutBlock {
  return block.type === 'document.callout'
}

export function isImageBlock(block: SduiDocumentBlock): block is ImageBlock {
  return block.type === 'document.image'
}

export function isFileBlock(block: SduiDocumentBlock): block is FileBlock {
  return block.type === 'document.file'
}

export function isLinkBlock(block: SduiDocumentBlock): block is LinkBlock {
  return block.type === 'document.link'
}

export function blockText(block: SduiDocumentBlock): string {
  return typeof block.state?.text === 'string' ? block.state.text : ''
}
