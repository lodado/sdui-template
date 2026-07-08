import type { SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from '@lodado/sdui-document'
import { createBlockSelection, createDocumentBlock } from '@lodado/sdui-document'
import { renderHook } from '@testing-library/react'
import type React from 'react'

import { useSelectionKeyboard, type UseSelectionKeyboardInput } from '../hooks/useSelectionKeyboard'
import { createEditorUIStore } from '../uiStore'

/**
 * Hook-level tests: failures here attribute to THIS unit instead of
 * "something in SduiDocumentEditor.test.tsx".
 */
function doc(children: SduiDocumentBlock[]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

const paragraph = (id: string, text: string) => createDocumentBlock({ id, type: 'document.paragraph', state: { text } })

function keyEvent(key: string, modifiers: Partial<{ meta: boolean; ctrl: boolean; shift: boolean }> = {}) {
  return {
    key,
    metaKey: modifiers.meta ?? false,
    ctrlKey: modifiers.ctrl ?? false,
    shiftKey: modifiers.shift ?? false,
    defaultPrevented: false,
    preventDefault: jest.fn(),
  } as unknown as React.KeyboardEvent
}

function setup(overrides: Partial<UseSelectionKeyboardInput> = {}) {
  const store = createEditorUIStore()
  const input: UseSelectionKeyboardInput = {
    store,
    docRef: { current: doc([paragraph('p0', 'a'), paragraph('p1', 'b'), paragraph('p2', 'c')]) },
    readOnly: false,
    applyPatches: jest.fn(),
    undo: jest.fn(() => null),
    redo: jest.fn(() => null),
    generateBlockId: jest.fn(() => 'gen-1'),
    focusBlock: jest.fn(),
    ...overrides,
  }
  const { result } = renderHook(() => useSelectionKeyboard(input))

  return { input, store, ...result.current }
}

describe('history keys', () => {
  it('Mod+Z undoes and lands the caret on the touched text block', () => {
    const undo = jest.fn((): SduiDocumentPatch[] => [
      { type: 'block.update', blockId: 'p1', state: { text: 'b' } } as SduiDocumentPatch,
    ])
    const { handleSelectionKeyDown, input } = setup({ undo })

    handleSelectionKeyDown(keyEvent('z', { meta: true }))

    expect(undo).toHaveBeenCalled()
    expect(input.focusBlock).toHaveBeenCalledWith('p1', 'end')
  })

  it.each([
    ['Shift+Mod+Z', keyEvent('Z', { meta: true, shift: true })],
    ['Mod+Y', keyEvent('y', { ctrl: true })],
  ])('%s redoes', (_name, event) => {
    const redo = jest.fn((): SduiDocumentPatch[] | null => null)
    const { handleSelectionKeyDown } = setup({ redo })

    handleSelectionKeyDown(event)

    expect(redo).toHaveBeenCalled()
  })

  it('readOnly ignores history keys', () => {
    const undo = jest.fn((): SduiDocumentPatch[] | null => null)
    const { handleSelectionKeyDown } = setup({ undo, readOnly: true })

    handleSelectionKeyDown(keyEvent('z', { meta: true }))

    expect(undo).not.toHaveBeenCalled()
  })

  it('defaultPrevented events are left alone (PM already handled them)', () => {
    const undo = jest.fn((): SduiDocumentPatch[] | null => null)
    const { handleSelectionKeyDown } = setup({ undo })
    const event = keyEvent('z', { meta: true })
    ;(event as { defaultPrevented: boolean }).defaultPrevented = true

    handleSelectionKeyDown(event)

    expect(undo).not.toHaveBeenCalled()
  })
})

describe('block-selection keys', () => {
  it('without a selection, selection keys are ignored', () => {
    const { handleSelectionKeyDown, input } = setup()

    handleSelectionKeyDown(keyEvent('Backspace'))

    expect(input.applyPatches).not.toHaveBeenCalled()
  })

  it('Backspace deletes every selected block and clears the selection', () => {
    const { handleSelectionKeyDown, input, store } = setup()
    store.set({ selection: { anchorId: 'p0', selectedIds: ['p0', 'p1'] } })

    handleSelectionKeyDown(keyEvent('Backspace'))

    expect(input.applyPatches).toHaveBeenCalledWith([
      { type: 'block.delete', blockId: 'p0' },
      { type: 'block.delete', blockId: 'p1' },
    ])
    expect(store.get().selection.selectedIds).toEqual([])
  })

  it('ArrowDown moves the single selection to the next block', () => {
    const { handleSelectionKeyDown, store } = setup()
    store.set({ selection: createBlockSelection('p0') })

    handleSelectionKeyDown(keyEvent('ArrowDown'))

    expect(store.get().selection.selectedIds).toEqual(['p1'])
  })

  it('Shift+ArrowDown extends the selection from the anchor', () => {
    const { handleSelectionKeyDown, store } = setup()
    store.set({ selection: createBlockSelection('p0') })

    handleSelectionKeyDown(keyEvent('ArrowDown', { shift: true }))

    expect(store.get().selection.selectedIds).toEqual(['p0', 'p1'])
    expect(store.get().selection.anchorId).toBe('p0')
  })

  it('Enter re-enters inline editing on the anchor text block (with a session bump)', () => {
    const { handleSelectionKeyDown, store } = setup()
    store.set({ selection: createBlockSelection('p1') })

    handleSelectionKeyDown(keyEvent('Enter'))

    expect(store.get().selection.selectedIds).toEqual([])
    expect(store.get().focus).toEqual(expect.objectContaining({ blockId: 'p1', caret: 'end', session: 1 }))
  })

  it('Mod+A selects every block', () => {
    const { handleSelectionKeyDown, store } = setup()
    store.set({ selection: createBlockSelection('p1') })

    handleSelectionKeyDown(keyEvent('a', { meta: true }))

    expect(store.get().selection.selectedIds).toEqual(['p0', 'p1', 'p2'])
  })

  it('Mod+D duplicates the selection with fresh ids and selects the clones', () => {
    const ids = ['dup-1', 'dup-2']
    const { handleSelectionKeyDown, input, store } = setup({ generateBlockId: () => ids.shift() ?? 'dup-x' })
    store.set({ selection: { anchorId: 'p0', selectedIds: ['p0', 'p1'] } })

    handleSelectionKeyDown(keyEvent('d', { meta: true }))

    expect(input.applyPatches).toHaveBeenCalledWith([
      expect.objectContaining({ type: 'block.insert', parentId: 'root' }),
      expect.objectContaining({ type: 'block.insert', parentId: 'root' }),
    ])
    expect(store.get().selection.selectedIds).toEqual(['dup-1', 'dup-2'])
  })

  it('Escape clears the selection', () => {
    const { handleSelectionKeyDown, store } = setup()
    store.set({ selection: createBlockSelection('p1') })

    handleSelectionKeyDown(keyEvent('Escape'))

    expect(store.get().selection.selectedIds).toEqual([])
  })
})

describe('handlePaddingClick', () => {
  it('focuses the trailing text block without inserting anything', () => {
    const { handlePaddingClick, input } = setup()

    handlePaddingClick()

    expect(input.focusBlock).toHaveBeenCalledWith('p2', 'end')
    expect(input.applyPatches).not.toHaveBeenCalled()
  })

  it('restores the trailing-block invariant when the last block is not text', () => {
    const { handlePaddingClick, input } = setup({
      docRef: { current: doc([paragraph('p0', 'a'), createDocumentBlock({ id: 'img', type: 'document.image' })]) },
    })

    handlePaddingClick()

    expect(input.applyPatches).toHaveBeenCalledWith([expect.objectContaining({ type: 'block.insert' })])
    expect(input.focusBlock).toHaveBeenCalledWith('gen-1', 'end')
  })
})
