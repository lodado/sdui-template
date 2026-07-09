/**
 * Pure decision logic for the editor handlers (functional core).
 *
 * Every function here is `(content, args) => decision`: it reads a document
 * snapshot plus plain values and returns patches and UI intents as data.
 * No DOM, no store, no refs, no React. Fresh block ids come in as a
 * `nextBlockId` thunk called AT MOST ONCE and only when the decision
 * actually inserts a block — id consumption order is part of the observable
 * contract (tests seed deterministic id sequences).
 *
 * Import direction is one-way: hooks import this module, this module must
 * never import from `hooks/` (or anything effectful).
 */
import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import {
  anchorAfterBlock,
  anchorAppendToParent,
  anchorBeforeBlock,
  COLLECTION_BLOCK_TYPE,
  createBlockId,
  createDefaultBlock,
  findBlockById,
  flattenDocumentBlocks,
  getInlineContentLength,
  PAGE_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'

import { blockInlineContent, isTextBlock } from './blockContent'
import { LIST_LIKE_BLOCK_TYPES, NON_TEXT_BLOCK_TYPES, SPLIT_TO_PARAGRAPH_BLOCK_TYPES } from './editorConstants'
import type { FocusTarget } from './uiStore'

/** Focus intent as data. The `session` bump is imperative-shell state. */
export type HandlerFocusIntent = {
  blockId: string
  caret: FocusTarget['caret']
  justInserted?: boolean
  openBlockMenu?: boolean
}

export type HandlerDecision = {
  patches: SduiDocumentPatch[]
  focus?: HandlerFocusIntent
  /** Block-selection intent (e.g. turning into a non-text block). */
  selectBlockId?: string
}

/** Single `block.update` patch setting attributes — shared by the attribute toggles. */
export function blockAttrsPatch(blockId: string, attributes: Record<string, unknown>): SduiDocumentPatch {
  return { type: 'block.update', blockId: createBlockId(blockId), attributes }
}

function collectPageDocumentIds(block: SduiDocumentBlock, into: string[]): void {
  if (block.type === PAGE_BLOCK_TYPE && typeof block.attributes?.documentId === 'string') {
    into.push(block.attributes.documentId)
  }
  ;(block.children ?? []).forEach((child) => collectPageDocumentIds(child, into))
}

/**
 * Target documents of every page block removed by the given patches (subtrees
 * included). Read BEFORE the patches are applied — the archive side effect
 * fires per collected id after apply. Every deletion path funnels through
 * applyPatches, so this is the single choke point for orphan prevention.
 */
export function collectDeletedPageDocumentIds(content: SduiDocumentContent, patches: SduiDocumentPatch[]): string[] {
  const ids: string[] = []
  patches.forEach((patch) => {
    if (patch.type === 'block.delete') {
      const block = findBlockById(content, patch.blockId)
      if (block) {
        collectPageDocumentIds(block, ids)
      }
    }
  })
  return ids
}

/**
 * Insert a page block (item) as the last child of a collection. The target
 * document must already exist (created by the host's onCreatePage) — this only
 * builds the block.insert patch pointing at it. Returns null when the block is
 * missing or is not a collection.
 */
export function computeAddCollectionItem(
  content: SduiDocumentContent,
  collectionId: string,
  item: { documentId: string; title?: string },
  nextBlockId: () => string,
): HandlerDecision | null {
  const collection = findBlockById(content, collectionId)
  if (!collection || collection.type !== COLLECTION_BLOCK_TYPE) {
    return null
  }

  const children = collection.children ?? []
  const lastChildId = children.length > 0 ? children[children.length - 1].id : null
  const itemId = nextBlockId()

  return {
    patches: [
      {
        type: 'block.insert',
        parentId: createBlockId(collectionId),
        after: lastChildId ? createBlockId(lastChildId) : null,
        block: {
          id: createBlockId(itemId),
          type: PAGE_BLOCK_TYPE,
          state: { text: item.title ?? 'Untitled' },
          attributes: { documentId: item.documentId },
        },
      },
    ],
  }
}

/** Document-order text blocks (root excluded) — the caret navigation space. */
export function orderedTextBlocks(content: SduiDocumentContent) {
  return flattenDocumentBlocks(content)
    .filter((item) => item.id !== content.root.id)
    .filter((item) => {
      const block = findBlockById(content, item.id)

      return block !== undefined && isTextBlock(block)
    })
}

/**
 * Insert a paragraph as the toggle's first child, expanding the toggle first
 * if collapsed (a collapsed toggle hides its children). Shared by
 * Enter-on-summary and the empty-toggle placeholder click.
 * Returns null when the block is missing or not a toggle.
 */
export function computeInsertToggleChild(
  content: SduiDocumentContent,
  blockId: string,
  nextBlockId: () => string,
): HandlerDecision | null {
  const source = findBlockById(content, blockId)
  if (!source || source.type !== TOGGLE_BLOCK_TYPE) {
    return null
  }

  const childId = nextBlockId()
  const patches: SduiDocumentPatch[] = []
  if (source.attributes?.collapsed === true) {
    patches.push({
      type: 'block.update',
      blockId: createBlockId(blockId),
      attributes: { collapsed: false },
    })
  }
  patches.push({
    type: 'block.insert',
    parentId: createBlockId(blockId),
    after: null, // front of parent = first child
    block: createDefaultBlock('document.paragraph', childId),
  })

  return { patches, focus: { blockId: childId, caret: 'start', justInserted: true } }
}

/**
 * Notion semantics for block-menu type application: an empty block converts
 * in place (block.setType), a non-empty block gets a new default sibling
 * below (block.insert).
 * Returns the id that received the type, or null when the block has no
 * insert position (root-less).
 */
export function computeApplyMenuType(
  content: SduiDocumentContent,
  args: {
    blockId: string
    type: string
    attributes?: Record<string, unknown>
    extraState?: Record<string, unknown>
    nextBlockId: () => string
  },
): { patches: SduiDocumentPatch[]; targetId: string } | null {
  const { blockId, type, attributes, extraState, nextBlockId } = args
  const source = findBlockById(content, blockId)
  const isEmpty = getInlineContentLength(blockInlineContent(source)) === 0

  if (isEmpty) {
    const patches: SduiDocumentPatch[] = [
      {
        type: 'block.setType',
        blockId: createBlockId(blockId),
        blockType: type,
        ...(attributes ? { attributes } : {}),
      },
    ]
    if (extraState) {
      patches.push({ type: 'block.update', blockId: createBlockId(blockId), state: extraState })
    }

    return { patches, targetId: blockId }
  }

  const flattened = flattenDocumentBlocks(content)
  const location = flattened.find((candidate) => candidate.id === blockId)
  if (!location?.parentId) {
    return null
  }

  const newId = nextBlockId()
  const base = createDefaultBlock(type, newId, attributes)
  const block = extraState ? { ...base, state: { ...base.state, ...extraState } } : base

  return {
    patches: [
      {
        type: 'block.insert',
        parentId: createBlockId(location.parentId),
        ...anchorAfterBlock(content, location.parentId, blockId),
        block,
      },
    ],
    targetId: newId,
  }
}

/**
 * Notion split policy on Enter:
 * - empty list-like block converts to a paragraph in place;
 * - a toggle summary opens the toggle and starts its first child;
 * - otherwise block.split, and heading/quote/toggle continuations become
 *   body text (setType with no attributes also clears inherited attributes
 *   like heading level) while list blocks continue their type.
 */
export function computeSplit(
  content: SduiDocumentContent,
  args: { blockId: string; offset: number; nextBlockId: () => string },
): HandlerDecision {
  const { blockId, offset, nextBlockId } = args
  const source = findBlockById(content, blockId)

  if (source && LIST_LIKE_BLOCK_TYPES.has(source.type) && getInlineContentLength(blockInlineContent(source)) === 0) {
    return {
      patches: [{ type: 'block.setType', blockId: createBlockId(blockId), blockType: 'document.paragraph' }],
      focus: { blockId, caret: 'start' },
    }
  }

  if (source && source.type === TOGGLE_BLOCK_TYPE) {
    return computeInsertToggleChild(content, blockId, nextBlockId) ?? { patches: [] }
  }

  const newBlockId = nextBlockId()
  const patches: SduiDocumentPatch[] = [
    { type: 'block.split', blockId: createBlockId(blockId), offset, newBlockId: createBlockId(newBlockId) },
  ]
  if (source && SPLIT_TO_PARAGRAPH_BLOCK_TYPES.has(source.type)) {
    patches.push({ type: 'block.setType', blockId: createBlockId(newBlockId), blockType: 'document.paragraph' })
  }

  return { patches, focus: { blockId: newBlockId, caret: 'start', justInserted: true } }
}

/**
 * Notion semantics for Backspace at block start: a list-like or quote block
 * first strips its type (only the SECOND Backspace, now a paragraph, merges);
 * otherwise merge into the previous text block, caret at the join point.
 * The first text block has nowhere to merge — refocus only.
 */
export function computeMergeBackward(content: SduiDocumentContent, blockId: string): HandlerDecision {
  const source = findBlockById(content, blockId)

  if (source && (LIST_LIKE_BLOCK_TYPES.has(source.type) || source.type === 'document.quote')) {
    return {
      patches: [{ type: 'block.setType', blockId: createBlockId(blockId), blockType: 'document.paragraph' }],
      focus: { blockId, caret: 'start' },
    }
  }

  const ordered = orderedTextBlocks(content)
  const index = ordered.findIndex((item) => item.id === blockId)
  const previous = index > 0 ? ordered[index - 1] : undefined
  if (!previous) {
    return { patches: [], focus: { blockId, caret: 'start' } }
  }

  const caretOffset = getInlineContentLength(blockInlineContent(findBlockById(content, previous.id)))

  return {
    patches: [{ type: 'block.merge', blockId: createBlockId(blockId), intoBlockId: createBlockId(previous.id) }],
    focus: { blockId: previous.id, caret: caretOffset },
  }
}

/** Tab: move the block to the end of its previous sibling's children. */
export function computeIndent(content: SduiDocumentContent, blockId: string): HandlerDecision {
  const flattened = flattenDocumentBlocks(content)
  const item = flattened.find((candidate) => candidate.id === blockId)
  const previousSibling = flattened.find(
    (candidate) => candidate.parentId === item?.parentId && candidate.index === (item?.index ?? 0) - 1,
  )
  if (!item || !previousSibling) {
    return { patches: [], focus: { blockId, caret: 'start' } }
  }

  return {
    patches: [
      {
        type: 'block.move',
        blockId: createBlockId(blockId),
        parentId: createBlockId(previousSibling.id),
        ...anchorAppendToParent(content, previousSibling.id),
      },
    ],
    focus: { blockId, caret: 'start' },
  }
}

/** Shift+Tab: move the block to be its parent's next sibling. */
export function computeOutdent(content: SduiDocumentContent, blockId: string): HandlerDecision {
  const flattened = flattenDocumentBlocks(content)
  const item = flattened.find((candidate) => candidate.id === blockId)
  const parentItem = flattened.find((candidate) => candidate.id === item?.parentId)
  if (!item || !parentItem || !parentItem.parentId) {
    return { patches: [], focus: { blockId, caret: 'start' } }
  }

  return {
    patches: [
      {
        type: 'block.move',
        blockId: createBlockId(blockId),
        parentId: createBlockId(parentItem.parentId),
        ...anchorAfterBlock(content, parentItem.parentId, parentItem.id),
      },
    ],
    focus: { blockId, caret: 'start' },
  }
}

/** ArrowUp/ArrowDown across text blocks; caret lands on the entered edge. */
export function computeNavigate(
  content: SduiDocumentContent,
  blockId: string,
  direction: 'up' | 'down',
): HandlerDecision {
  const ordered = orderedTextBlocks(content)
  const index = ordered.findIndex((item) => item.id === blockId)
  const neighbor = direction === 'up' ? ordered[index - 1] : ordered[index + 1]
  if (!neighbor) {
    return { patches: [], focus: { blockId, caret: direction === 'up' ? 'start' : 'end' } }
  }

  return { patches: [], focus: { blockId: neighbor.id, caret: direction === 'up' ? 'end' : 'start' } }
}

/**
 * Default turn-into: a block.setType patch; turning into a non-text type
 * ends the inline session, so the block gets selected instead of focused.
 * (The consumer `onTurnInto` override is an imperative-shell concern.)
 */
export function computeTurnInto(
  content: SduiDocumentContent,
  blockId: string,
  type: string,
  attrs?: Record<string, unknown>,
): HandlerDecision {
  return {
    patches: [
      {
        type: 'block.setType',
        blockId: createBlockId(blockId),
        blockType: type,
        ...(attrs ? { attributes: attrs } : {}),
      },
    ],
    ...(NON_TEXT_BLOCK_TYPES.has(type) ? { selectBlockId: blockId } : {}),
  }
}

/** Alt+ArrowUp/Down: swap the block with its adjacent sibling. Null = no-op. */
export function computeMoveBlock(
  content: SduiDocumentContent,
  blockId: string,
  direction: 'up' | 'down',
): HandlerDecision | null {
  const flattened = flattenDocumentBlocks(content)
  const item = flattened.find((candidate) => candidate.id === blockId)
  if (!item?.parentId) {
    return null
  }

  const parent = findBlockById(content, item.parentId)
  const siblingCount = parent?.children?.length ?? 0
  const targetIndex = item.index + (direction === 'up' ? -1 : 1)
  if (targetIndex < 0 || targetIndex >= siblingCount) {
    return null
  }

  const neighbor = flattened.find(
    (candidate) => candidate.parentId === item.parentId && candidate.index === targetIndex,
  )
  if (!neighbor) {
    return null
  }

  return {
    patches: [
      {
        type: 'block.move',
        blockId: createBlockId(blockId),
        parentId: createBlockId(item.parentId),
        ...(direction === 'up'
          ? anchorBeforeBlock(content, item.parentId, neighbor.id)
          : anchorAfterBlock(content, item.parentId, neighbor.id)),
      },
    ],
  }
}

/** '+' button: insert an empty paragraph below and open its block menu. Null = no insert position. */
export function computeInsertBlockBelow(
  content: SduiDocumentContent,
  blockId: string,
  nextBlockId: () => string,
): HandlerDecision | null {
  const flattened = flattenDocumentBlocks(content)
  const location = flattened.find((candidate) => candidate.id === blockId)
  if (!location?.parentId) {
    return null
  }

  const newId = nextBlockId()

  return {
    patches: [
      {
        type: 'block.insert',
        parentId: createBlockId(location.parentId),
        ...anchorAfterBlock(content, location.parentId, blockId),
        block: createDefaultBlock('document.paragraph', newId),
      },
    ],
    focus: { blockId: newId, caret: 'start', openBlockMenu: true, justInserted: true },
  }
}
