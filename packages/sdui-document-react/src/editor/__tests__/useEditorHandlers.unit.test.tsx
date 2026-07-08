import type { SduiDocumentBlock, SduiDocumentContent } from '@lodado/sdui-document'
import { createDocumentBlock } from '@lodado/sdui-document'
import { act, renderHook } from '@testing-library/react'

import { useEditorHandlers, type UseEditorHandlersInput } from '../hooks/useEditorHandlers'
import { createEditorUIStore } from '../uiStore'

/**
 * Hook-level tests for the imperative shell: handler identity stability (the
 * `latest` ref contract that the render-count invariants depend on) and the
 * pure-decision → effect wiring, without a full editor render.
 */
function doc(children: SduiDocumentBlock[]): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: createDocumentBlock({ id: 'root', type: 'document.root', children }),
  }
}

const paragraph = (id: string, text: string) => createDocumentBlock({ id, type: 'document.paragraph', state: { text } })

function setup(overrides: Partial<UseEditorHandlersInput> = {}) {
  const store = createEditorUIStore()
  const input: UseEditorHandlersInput = {
    store,
    docRef: { current: doc([paragraph('p0', 'hello'), paragraph('p1', 'world')]) },
    containerRef: { current: null },
    applyPatches: jest.fn(),
    generateBlockId: jest.fn(() => 'gen-1'),
    onHistory: jest.fn(),
    ...overrides,
  }
  const view = renderHook((props: UseEditorHandlersInput) => useEditorHandlers(props), { initialProps: input })

  return { input, store, view }
}

describe('handler identity (latest-ref contract)', () => {
  it('the handlers object survives a rerender with new callback props AND uses the newest callback', () => {
    const { input, view } = setup()
    const first = view.result.current.handlers

    const nextApplyPatches = jest.fn()
    view.rerender({ ...input, applyPatches: nextApplyPatches })

    // identity stable → memoized rows keep bailing out
    expect(view.result.current.handlers).toBe(first)

    // ...but the live value flows through the `latest` ref
    act(() => view.result.current.handlers.toggleChecked('p0', true))
    expect(nextApplyPatches).toHaveBeenCalledWith([
      { type: 'block.update', blockId: 'p0', attributes: { checked: true } },
    ])
    expect(input.applyPatches).not.toHaveBeenCalled()
  })
})

describe('decision → effect wiring', () => {
  it('split applies the pure decision patches and focuses the new block', () => {
    const { input, store, view } = setup()

    act(() => view.result.current.handlers.split('p0', 2))

    expect(input.applyPatches).toHaveBeenCalledWith([
      { type: 'block.split', blockId: 'p0', offset: 2, newBlockId: 'gen-1' },
    ])
    expect(store.get().focus).toEqual(
      expect.objectContaining({ blockId: 'gen-1', caret: 'start', justInserted: true, session: 1 }),
    )
  })

  it('mergeBackward on the first block refocuses without any patch', () => {
    const { input, store, view } = setup()

    act(() => view.result.current.handlers.mergeBackward('p0'))

    expect(input.applyPatches).not.toHaveBeenCalled()
    expect(store.get().focus).toEqual(expect.objectContaining({ blockId: 'p0', caret: 'start' }))
  })

  it('turnInto with a consumer override delegates instead of patching', () => {
    const onTurnInto = jest.fn()
    const { input, view } = setup({ onTurnInto })

    act(() => view.result.current.handlers.turnInto('p0', 'document.heading', { level: 1 }))

    expect(onTurnInto).toHaveBeenCalledWith('p0', 'document.heading', { level: 1 })
    expect(input.applyPatches).not.toHaveBeenCalled()
  })

  it('turnInto into a non-text type selects the block (inline session ends)', () => {
    const { store, view } = setup()

    act(() => view.result.current.handlers.turnInto('p0', 'document.divider'))

    expect(store.get().selection.selectedIds).toEqual(['p0'])
    expect(store.get().focus).toBeNull()
  })

  it('handleClick selects the block and clears focus', () => {
    const { store, view } = setup()

    act(() => view.result.current.handlers.handleClick('p1', false))

    expect(store.get().selection.selectedIds).toEqual(['p1'])
    expect(store.get().focus).toBeNull()
  })

  it('history delegates to onHistory', () => {
    const { input, view } = setup()

    act(() => view.result.current.handlers.history('undo'))

    expect(input.onHistory).toHaveBeenCalledWith('undo')
  })
})
