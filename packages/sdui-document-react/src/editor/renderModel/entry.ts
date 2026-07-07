import type { BlockOrigin, SduiDocumentBlock } from '@lodado/sdui-document'

/**
 * Render Model — pure projection layer.
 *
 * A `RenderEntry` is everything a single block ROW needs to render itself, plus
 * the id list of its children (NOT the child objects). Rows subscribe to their
 * own id, so an edit to one block notifies only that id — giving O(1) re-render
 * instead of the O(depth) ancestor-prop churn of the tree-prop model.
 *
 * Two invariants make O(1) actually happen (see the plan doc
 * docs/superpowers/plans/2026-07-07-render-model-o1-rerender.md):
 *
 * 1. Value-equality output stabilization — structural sharing hands us NEW node
 *    references for every ancestor on the edited path even when their content is
 *    unchanged. So the cache is keyed by ID and returns the PREVIOUS entry
 *    reference whenever the freshly derived entry is value-equal. A ref-keyed
 *    cache would miss on every ancestor and defeat the whole thing.
 * 2. `childrenIds` arrays are reference-stabilized the same way, so a parent
 *    subscribing to its child-id list is not woken when only a descendant's
 *    text changes.
 */
export interface RenderEntry {
  id: string
  type: string
  position?: string
  origin?: BlockOrigin
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  childrenIds: string[]
  /**
   * Render-time numbered-list ordinal. This is sibling-group derived (a run of
   * consecutive numbered-list siblings), NOT node-local — so it is assigned by
   * the PARENT during reconcile (`applyOrdinals`), not by `deriveEntry`.
   * `undefined` for non-numbered blocks.
   */
  listOrdinal?: number
}

const NUMBERED_LIST_TYPE = 'document.numbered-list'

/** Editor-scoped memo table: block id → last derived entry. */
export type RenderEntryCache = Map<string, RenderEntry>

function idsEqual(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) return false
  }
  return true
}

/**
 * Value-equality for entries. `state`/`attributes`/`origin` are compared by
 * reference: the patch engine replaces them immutably, and structural sharing
 * keeps an unchanged block's `state` object identical, so a reference check is
 * both correct and cheap. `childrenIds` is already ref-stabilized by the time
 * this runs, so it too compares by reference.
 */
export function shallowEqualEntry(a: RenderEntry, b: RenderEntry): boolean {
  return (
    a.id === b.id &&
    a.type === b.type &&
    a.position === b.position &&
    a.origin === b.origin &&
    a.state === b.state &&
    a.attributes === b.attributes &&
    a.childrenIds === b.childrenIds &&
    a.listOrdinal === b.listOrdinal
  )
}

/**
 * Derive (or reuse) the entry for `node`. Returns the SAME reference as last
 * time when nothing a row cares about changed; a fresh reference otherwise.
 * Mutates `cache` to hold whichever reference it returns.
 */
export function deriveEntry(node: SduiDocumentBlock, cache: RenderEntryCache): RenderEntry {
  const old = cache.get(node.id)

  const rawIds = (node.children ?? []).map((child) => child.id as string)
  const childrenIds = old && idsEqual(old.childrenIds, rawIds) ? old.childrenIds : rawIds

  const fresh: RenderEntry = {
    id: node.id,
    type: node.type,
    position: node.position,
    origin: node.origin,
    state: node.state,
    attributes: node.attributes,
    childrenIds,
    // ordinal is parent-assigned; carry the previous value so deriveEntry does
    // not clobber it — applyOrdinals overwrites when the sibling run changes.
    listOrdinal: old?.listOrdinal,
  }

  if (old && shallowEqualEntry(old, fresh)) {
    return old
  }

  cache.set(node.id, fresh)
  return fresh
}

/**
 * Collect every block id currently in the tree — used to garbage-collect cache
 * entries for deleted blocks so the memo table cannot grow unbounded.
 */
export function collectTreeIds(root: SduiDocumentBlock, into: Set<string> = new Set()): Set<string> {
  into.add(root.id)
  root.children?.forEach((child) => collectTreeIds(child, into))
  return into
}

function dropSubtree(node: SduiDocumentBlock, cache: RenderEntryCache): void {
  cache.delete(node.id)
  node.children?.forEach((child) => dropSubtree(child, cache))
}

/**
 * Assign numbered-list ordinals to a parent's children. Consecutive
 * `document.numbered-list` siblings form one run; any other type resets it
 * (Notion behavior). Directly patches each child entry whose ordinal changed —
 * bypassing the reconcile prune, since a sibling's ordinal can shift without its
 * own block changing.
 */
function applyOrdinals(parent: SduiDocumentBlock, cache: RenderEntryCache, changed: string[]): void {
  const { children } = parent
  if (!children?.length) return

  let run = 0
  children.forEach((child) => {
    const desired = child.type === NUMBERED_LIST_TYPE ? (run += 1) : ((run = 0), undefined)
    const entry = cache.get(child.id)
    if (entry && entry.listOrdinal !== desired) {
      cache.set(child.id, { ...entry, listOrdinal: desired })
      if (!changed.includes(child.id)) {
        changed.push(child.id)
      }
    }
  })
}

function reconcile(
  prev: SduiDocumentBlock | null,
  next: SduiDocumentBlock,
  cache: RenderEntryCache,
  changed: string[],
  removed: SduiDocumentBlock[],
): void {
  if (prev === next) {
    return
  }

  const before = cache.get(next.id)
  const entry = deriveEntry(next, cache)
  if (entry !== before) {
    changed.push(next.id)
  }

  const prevChildren = new Map<string, SduiDocumentBlock>()
  prev?.children?.forEach((child) => prevChildren.set(child.id, child))

  const nextIds = new Set<string>()
  next.children?.forEach((child) => {
    nextIds.add(child.id)
    reconcile(prevChildren.get(child.id) ?? null, child, cache, changed, removed)
  })

  // sibling-group derived: assign numbered-list ordinals across this parent's
  // children. Runs whenever the parent changed, so a child turning into/out of
  // a numbered list re-numbers its siblings even though their own blocks (and
  // thus their reconcile subtrees) were pruned as unchanged.
  applyOrdinals(next, cache, changed)

  // candidate removals — resolved against the whole next tree in syncTree so a
  // block that merely moved to another parent is not dropped
  prevChildren.forEach((child, id) => {
    if (!nextIds.has(id)) {
      removed.push(child)
    }
  })
}

/**
 * Reconcile the render entries from `prevRoot` to `nextRoot`, collecting the ids
 * whose entry reference actually changed. Structural sharing prunes the walk:
 * an untouched subtree is the same object reference and is skipped wholesale, so
 * the walk is O(depth-of-change), and only genuinely changed ids are reported.
 *
 * @returns the ids whose subscribers must be notified.
 */
export function syncTree(
  prevRoot: SduiDocumentBlock | null,
  nextRoot: SduiDocumentBlock,
  cache: RenderEntryCache,
): string[] {
  const changed: string[] = []
  const removed: SduiDocumentBlock[] = []
  reconcile(prevRoot, nextRoot, cache, changed, removed)

  // GC deleted blocks. A block absent from ITS OLD PARENT may have moved to a
  // different parent (still live), so we can only drop entries whose id is gone
  // from the WHOLE next tree. The O(n) walk runs only when something was removed
  // (structural edits) — plain text edits stay O(depth).
  if (removed.length > 0) {
    const live = collectTreeIds(nextRoot)
    removed.forEach((block) => {
      if (!live.has(block.id)) {
        dropSubtree(block, cache)
      }
    })
  }

  return changed
}
