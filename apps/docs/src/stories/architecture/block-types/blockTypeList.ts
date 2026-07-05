/** Canonical block-type list — keep in sync with packages/sdui-document/src/block-types/index.ts */
export const BLOCK_TYPE_IDS = [
  'document.root',
  'document.paragraph',
  'document.heading',
  'document.bulleted-list',
  'document.numbered-list',
  'document.checklist',
  'document.divider',
  'document.callout',
  'document.quote',
  'document.toggle',
  'document.code',
  'document.image',
  'document.file',
  'document.link',
  'document.columnList',
  'document.column',
] as const

export type BlockTypeId = (typeof BLOCK_TYPE_IDS)[number]

/** Short labels for badges (strip `document.` prefix). */
export const BLOCK_TYPE_LABELS = BLOCK_TYPE_IDS.map((id) => id.replace('document.', ''))

export const CONTENT_BLOCK_TYPE_LABELS = BLOCK_TYPE_LABELS.filter(
  (label) => label !== 'root' && label !== 'columnList' && label !== 'column',
)

export const BLOCK_TYPE_COUNT = BLOCK_TYPE_IDS.length
