import { TextSelection } from 'prosemirror-state'

import { createFocusedBlockEditorState, editorStateToInline } from '../pm/editorState'
import type { FocusedBlockCallbacks } from '../pm/keymapDelegation'

function createCallbacks(): jest.Mocked<FocusedBlockCallbacks> {
  return {
    onSplit: jest.fn(),
    onMergeBackward: jest.fn(),
    onIndent: jest.fn(),
    onOutdent: jest.fn(),
    onNavigate: jest.fn(),
    onTurnInto: jest.fn(),
  }
}

type KeyName = 'Enter' | 'Backspace' | 'Tab' | 'Shift-Tab' | 'ArrowUp' | 'ArrowDown'

/**
 * Runs a bound keymap command at the given caret offset without an EditorView
 * (state-level dispatch; the view-dependent paths fall back to offset checks).
 */
function pressKey(callbacks: FocusedBlockCallbacks, text: string, offset: number, key: KeyName): boolean {
  const base = createFocusedBlockEditorState(text.length > 0 ? [{ type: 'text', text }] : [], callbacks)
  const withCaret = base.apply(base.tr.setSelection(TextSelection.create(base.doc, offset)))

  const keymapPlugin = withCaret.plugins.find((plugin) => {
    const props = plugin.props as { handleKeyDown?: unknown }
    return typeof props.handleKeyDown === 'function'
  })
  if (!keymapPlugin) {
    throw new Error('keymap plugin not found')
  }

  const handleKeyDown = keymapPlugin.props.handleKeyDown as (
    view: { state: typeof withCaret; dispatch: (tr: unknown) => void; composing?: boolean },
    event: KeyboardEvent,
  ) => boolean

  const [, shiftKey, keyName] = key.startsWith('Shift-') ? [null, true, key.slice(6)] : [null, false, key]
  const event = {
    key: keyName,
    shiftKey,
    ctrlKey: false,
    altKey: false,
    metaKey: false,
    preventDefault: () => undefined,
  } as unknown as KeyboardEvent

  return handleKeyDown({ state: withCaret, dispatch: () => undefined, composing: false }, event)
}

describe('focused block keymap delegation', () => {
  describe('as is: caret inside "Hello" (length 5)', () => {
    describe('when Enter is pressed at offset 0 (BVA: min)', () => {
      it('to be: onSplit(0) called and key consumed', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 0, 'Enter')).toBe(true)
        expect(callbacks.onSplit).toHaveBeenCalledWith(0)
      })
    })

    describe('when Enter is pressed at offset 2 (EP: interior)', () => {
      it('to be: onSplit(2) called', () => {
        const callbacks = createCallbacks()

        pressKey(callbacks, 'Hello', 2, 'Enter')
        expect(callbacks.onSplit).toHaveBeenCalledWith(2)
      })
    })

    describe('when Enter is pressed at offset 5 (BVA: max = length)', () => {
      it('to be: onSplit(5) called', () => {
        const callbacks = createCallbacks()

        pressKey(callbacks, 'Hello', 5, 'Enter')
        expect(callbacks.onSplit).toHaveBeenCalledWith(5)
      })
    })

    describe('when Backspace is pressed at offset 0 (BVA: block start)', () => {
      it('to be: onMergeBackward called and key consumed', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 0, 'Backspace')).toBe(true)
        expect(callbacks.onMergeBackward).toHaveBeenCalledTimes(1)
      })
    })

    describe('when Backspace is pressed at offset 1 (BVA: start + 1)', () => {
      it('to be: not delegated — ProseMirror handles in-block deletion', () => {
        const callbacks = createCallbacks()

        pressKey(callbacks, 'Hello', 1, 'Backspace')
        expect(callbacks.onMergeBackward).not.toHaveBeenCalled()
      })
    })

    describe('when Tab is pressed anywhere', () => {
      it('to be: onIndent called and key consumed', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 3, 'Tab')).toBe(true)
        expect(callbacks.onIndent).toHaveBeenCalledTimes(1)
      })
    })

    describe('when Shift-Tab is pressed anywhere', () => {
      it('to be: onOutdent called and key consumed', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 3, 'Shift-Tab')).toBe(true)
        expect(callbacks.onOutdent).toHaveBeenCalledTimes(1)
      })
    })

    describe('when ArrowUp is pressed at offset 0 (BVA: block start, no view fallback)', () => {
      it('to be: onNavigate("up", 0) called', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 0, 'ArrowUp')).toBe(true)
        expect(callbacks.onNavigate).toHaveBeenCalledWith('up', 0)
      })
    })

    describe('when ArrowUp is pressed at offset 2 (EP: interior — stays inside block)', () => {
      it('to be: not delegated', () => {
        const callbacks = createCallbacks()

        pressKey(callbacks, 'Hello', 2, 'ArrowUp')
        expect(callbacks.onNavigate).not.toHaveBeenCalled()
      })
    })

    describe('when ArrowDown is pressed at offset 5 (BVA: block end)', () => {
      it('to be: onNavigate("down", 5) called', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 5, 'ArrowDown')).toBe(true)
        expect(callbacks.onNavigate).toHaveBeenCalledWith('down', 5)
      })
    })
  })

  describe('as is: empty block (BVA: zero-length content)', () => {
    describe('when Backspace is pressed', () => {
      it('to be: onMergeBackward called (offset 0 is the only position)', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, '', 0, 'Backspace')).toBe(true)
        expect(callbacks.onMergeBackward).toHaveBeenCalledTimes(1)
      })
    })
  })
})

describe('editorStateToInline', () => {
  describe('as is: editor state created from rich inline content', () => {
    describe('when committed back to sdui state', () => {
      it('to be: content preserved and plain text derived', () => {
        const callbacks = createCallbacks()
        const state = createFocusedBlockEditorState(
          [
            { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' world' },
          ],
          callbacks,
        )

        expect(editorStateToInline(state)).toEqual({
          content: [
            { type: 'text', text: 'Hello', marks: [{ type: 'bold' }] },
            { type: 'text', text: ' world' },
          ],
          text: 'Hello world',
        })
      })
    })
  })
})
