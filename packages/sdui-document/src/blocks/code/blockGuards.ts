// packages/sdui-document/src/blocks/code/blockGuards.ts
// Block-type domain code moved to src/block-types/<name>/ — re-exported here
// to keep the public API (blocks/code barrel) stable.
export { CALLOUT_BLOCK_TYPE, type CalloutBlock, type CalloutBlockAttributes } from '../../block-types/callout/callout'
export { isCalloutBlock } from '../../block-types/callout/callout'
export {
  CHECKLIST_BLOCK_TYPE,
  type ChecklistBlock,
  type ChecklistBlockState,
} from '../../block-types/checklist/checklist'
export { isChecklistBlock } from '../../block-types/checklist/checklist'
export { DIVIDER_BLOCK_TYPE, type DividerBlock } from '../../block-types/divider/divider'
export { isDividerBlock } from '../../block-types/divider/divider'
export { FILE_BLOCK_TYPE, type FileBlock, type FileBlockAttributes } from '../../block-types/file/file'
export { isFileBlock } from '../../block-types/file/file'
export { HEADING_BLOCK_TYPE, type HeadingBlock, type HeadingBlockState } from '../../block-types/heading/heading'
export { isHeadingBlock } from '../../block-types/heading/heading'
export { IMAGE_BLOCK_TYPE, type ImageBlock, type ImageBlockAttributes } from '../../block-types/image/image'
export { isImageBlock } from '../../block-types/image/image'
export { LINK_BLOCK_TYPE, type LinkBlock, type LinkBlockAttributes } from '../../block-types/link/link'
export { isLinkBlock } from '../../block-types/link/link'
export {
  PARAGRAPH_BLOCK_TYPE,
  type ParagraphBlock,
  type ParagraphBlockState,
} from '../../block-types/paragraph/paragraph'
export { isParagraphBlock } from '../../block-types/paragraph/paragraph'
export { ROOT_BLOCK_TYPE } from '../../block-types/root/root'
export { blockText } from '../../block-types/shared'
