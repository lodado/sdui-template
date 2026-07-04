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
    onEscape: jest.fn(),
    onMoveBlock: jest.fn(),
    onBlockAction: jest.fn(),
    onSlashMenuOpen: jest.fn(),
    onSlashMenuQueryChange: jest.fn(),
    onSlashMenuClose: jest.fn(),
    isSlashMenuOpen: jest.fn(() => false),
    onSlashMenuKey: jest.fn(() => false),
  }
}

type ChordModifiers = { shift?: boolean; ctrl?: boolean; alt?: boolean; meta?: boolean }

/**
 * Runs the delegation keymap for a key + modifier chord at the given caret
 * offset without an EditorView (state-level dispatch; view-dependent paths
 * fall back to offset checks). jsdom is non-mac, so Mod- resolves to Ctrl.
 */
function pressChord(
  callbacks: FocusedBlockCallbacks,
  text: string,
  offset: number,
  key: string,
  modifiers: ChordModifiers = {},
): boolean {
  const base = createFocusedBlockEditorState(text.length > 0 ? [{ type: 'text', text }] : [], callbacks)
  const withCaret = base.apply(base.tr.setSelection(TextSelection.create(base.doc, offset)))

  type KeyDownHandler = (
    view: { state: typeof withCaret; dispatch: (tr: unknown) => void; composing?: boolean },
    event: KeyboardEvent,
  ) => boolean

  // Collect only the "owned" handler plugins: slashMenu (new) + delegation keymap.
  // We do NOT include baseKeymap / history / mark keymaps — they are not the
  // subject of this test suite and some of them fail in the mock-view environment.
  const ownedPlugins = withCaret.plugins
    .filter((plugin) => {
      const props = plugin.props as { handleKeyDown?: unknown }
      return typeof props.handleKeyDown === 'function'
    })
    .slice(0, 2) // slashMenuPlugin is [0], buildFocusedBlockKeymap is [1]

  if (ownedPlugins.length === 0) {
    throw new Error('no delegation plugin found')
  }

  const event = {
    key,
    shiftKey: modifiers.shift ?? false,
    ctrlKey: modifiers.ctrl ?? false,
    altKey: modifiers.alt ?? false,
    metaKey: modifiers.meta ?? false,
    preventDefault: () => undefined,
  } as unknown as KeyboardEvent

  const mockView = { state: withCaret, dispatch: () => undefined, composing: false }

  // Try slashMenu first (returns false when closed), then delegation keymap.
  return ownedPlugins.some((plugin) => {
    const handleKeyDown = plugin.props.handleKeyDown as KeyDownHandler
    return handleKeyDown(mockView, event)
  })
}

type KeyName = 'Enter' | 'Backspace' | 'Tab' | 'Shift-Tab' | 'ArrowUp' | 'ArrowDown' | 'Escape'

function pressKey(callbacks: FocusedBlockCallbacks, text: string, offset: number, key: KeyName): boolean {
  const shift = key.startsWith('Shift-')

  return pressChord(callbacks, text, offset, shift ? key.slice(6) : key, { shift })
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

    describe('when Escape is pressed anywhere (EP: exit editing)', () => {
      it('to be: onEscape called and key consumed', () => {
        const callbacks = createCallbacks()

        expect(pressKey(callbacks, 'Hello', 2, 'Escape')).toBe(true)
        expect(callbacks.onEscape).toHaveBeenCalledTimes(1)
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

  describe('Outline structure key parity (Phase 24)', () => {
    describe('when Mod-] / Mod-[ are pressed (indent aliases)', () => {
      it('to be: onIndent / onOutdent called', () => {
        const callbacks = createCallbacks()

        expect(pressChord(callbacks, 'Hello', 2, ']', { ctrl: true })).toBe(true)
        expect(callbacks.onIndent).toHaveBeenCalledTimes(1)

        expect(pressChord(callbacks, 'Hello', 2, '[', { ctrl: true })).toBe(true)
        expect(callbacks.onOutdent).toHaveBeenCalledTimes(1)
      })
    })

    describe('when Mod-Alt-ArrowUp / Mod-Alt-ArrowDown are pressed', () => {
      it('to be: onMoveBlock called with the direction', () => {
        const callbacks = createCallbacks()

        expect(pressChord(callbacks, 'Hello', 2, 'ArrowUp', { ctrl: true, alt: true })).toBe(true)
        expect(callbacks.onMoveBlock).toHaveBeenCalledWith('up')

        expect(pressChord(callbacks, 'Hello', 2, 'ArrowDown', { ctrl: true, alt: true })).toBe(true)
        expect(callbacks.onMoveBlock).toHaveBeenCalledWith('down')
      })
    })

    describe('when Mod-Enter is pressed with no link under the caret', () => {
      it('to be: onBlockAction delegated to the block layer', () => {
        const callbacks = createCallbacks()

        expect(pressChord(callbacks, 'Hello', 2, 'Enter', { ctrl: true })).toBe(true)
        expect(callbacks.onBlockAction).toHaveBeenCalledTimes(1)
        expect(callbacks.onSplit).not.toHaveBeenCalled()
      })
    })

    describe('when turn-into shortcuts are pressed (registry bindings)', () => {
      it.each([
        ['0', 'document.paragraph', undefined],
        ['1', 'document.heading', { level: 1 }],
        ['3', 'document.heading', { level: 3 }],
        ['7', 'document.checklist', undefined],
      ] as const)('to be: Shift-Ctrl-%s → onTurnInto(%s)', (digit, type, attrs) => {
        const callbacks = createCallbacks()

        expect(pressChord(callbacks, 'Hello', 2, digit, { ctrl: true, shift: true })).toBe(true)
        expect(callbacks.onTurnInto).toHaveBeenCalledWith(type, attrs)
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
