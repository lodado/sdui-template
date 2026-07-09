import type { CollisionDetection } from '@dnd-kit/core'
import { pointerWithin, rectIntersection } from '@dnd-kit/core'
import {
  BOOKMARK_BLOCK_TYPE,
  COLLECTION_BLOCK_TYPE,
  EMBED_BLOCK_TYPE,
  PAGE_BLOCK_TYPE,
  TOGGLE_BLOCK_TYPE,
  VIDEO_BLOCK_TYPE,
} from '@lodado/sdui-document'

/** Pixel width of one indentation level for drag depth projection. */
export const DRAG_INDENT_WIDTH = 24

// Module-level constant: a fresh options object each render would change the
// sensors identity, recreate DndContext's internal context, and force every
// memoized row to re-render on any container render.
// distance constraint keeps plain clicks (selection) distinct from drags.
export const POINTER_SENSOR_OPTIONS = { activationConstraint: { distance: 4 } }

// The pointer decides the drop row (vertical zones need the exact row under
// the cursor); rect intersection only as a fallback when the pointer is
// between rows (e.g. heading margins).
export const collisionDetection: CollisionDetection = (args) => {
  const pointerCollisions = pointerWithin(args)

  return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args)
}

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
])

/** Blocks with Notion list semantics: empty+Enter → paragraph, Backspace-at-start → paragraph. */
export const LIST_LIKE_BLOCK_TYPES = new Set([
  'document.bulleted-list',
  'document.numbered-list',
  'document.checklist',
  TOGGLE_BLOCK_TYPE,
])

/** Enter never continues these — the continuation block becomes a paragraph. */
export const SPLIT_TO_PARAGRAPH_BLOCK_TYPES = new Set(['document.heading', 'document.quote', TOGGLE_BLOCK_TYPE])
