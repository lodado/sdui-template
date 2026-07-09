import {
  BOOKMARK_BLOCK_TYPE,
  BUTTON_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  PAGE_BLOCK_TYPE,
  SDUI_BLOCK_TYPE,
  TAGS_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '@lodado/sdui-document'

// Editor-independent block constants. This module must stay free of
// ProseMirror/dnd-kit imports — it is shared by the read-only viewer entry.

/** Pixel width of one indentation level for drag depth projection. */
export const DRAG_INDENT_WIDTH = 24

export const NON_TEXT_BLOCK_TYPES = new Set([
  'document.root',
  'document.divider',
  'document.image',
  'document.file',
  'document.link',
  PAGE_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  BOOKMARK_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  TAGS_BLOCK_TYPE,
  BUTTON_BLOCK_TYPE,
  SDUI_BLOCK_TYPE,
])

/** A column's grow weight from its attributes; absent/invalid = equal-split default. */
export function attributeRatio(attributes: Record<string, unknown> | undefined): number | undefined {
  const ratio = attributes?.ratio
  return typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 ? ratio : undefined
}
