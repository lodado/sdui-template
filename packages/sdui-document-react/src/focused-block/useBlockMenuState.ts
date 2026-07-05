import type { MutableRefObject } from 'react'
import { useCallback, useRef, useState } from 'react'

import type { BlockMenuAnchorRect } from '../editor/block-menu/BlockMenu'
import type { BlockMenuItem } from '../editor/block-menu/blockMenuItems'

/** Slash/plus menu UI state — owned here, keyboard-driven via PM delegation. */
export type BlockMenuState = {
  anchor: BlockMenuAnchorRect
  query: string
  activeIndex: number
  view: 'menu' | 'link'
  /** Set while the link URL input is open — the item to delegate on submit. */
  pendingLinkItem?: BlockMenuItem
}

export type UseBlockMenuStateResult = {
  /** Async state driving the rendered menu. */
  menu: BlockMenuState | null
  /**
   * Synchronous mirror of `menu`. Plugin callbacks run inside PM event handling
   * and must read the ref, never the async state.
   */
  menuRef: MutableRefObject<BlockMenuState | null>
  /** Updates ref + state together so both channels stay in sync. */
  updateMenu: (next: BlockMenuState | null) => void
}

export function useBlockMenuState(): UseBlockMenuStateResult {
  const [menu, setMenu] = useState<BlockMenuState | null>(null)
  const menuRef = useRef<BlockMenuState | null>(null)
  const updateMenu = useCallback((next: BlockMenuState | null) => {
    menuRef.current = next
    setMenu(next)
  }, [])

  return { menu, menuRef, updateMenu }
}
