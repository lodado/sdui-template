import type { EditorState } from 'prosemirror-state'
import { TextSelection } from 'prosemirror-state'

import { createFocusedBlockEditorState, editorStateToInline } from '../pm/editorState'
import type { FocusedBlockCallbacks } from '../pm/keymapDelegation'

function createCallbacks(): FocusedBlockCallbacks {
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

/**
 * Simulates typing one character at the end of `text` and runs every
 * inputRules plugin (block prefixes + marks) until one handles it.
 * Returns the resulting state, or null when no rule matched.
 */
function typeLastChar(text: string): EditorState | null {
  const prior = text.slice(0, -1)
  const typed = text.slice(-1)
  const base = createFocusedBlockEditorState(prior.length > 0 ? [{ type: 'text', text: prior }] : [], createCallbacks())
  const caret = base.doc.content.size
  const state = base.apply(base.tr.setSelection(TextSelection.create(base.doc, caret)))

  let next: EditorState | null = null
  const plugins = state.plugins.filter((plugin) => {
    const props = plugin.props as { handleTextInput?: unknown }
    return typeof props.handleTextInput === 'function'
  })

  const handled = plugins.some((plugin) => {
    const handleTextInput = plugin.props.handleTextInput as (
      view: { state: EditorState; dispatch: (tr: unknown) => void; composing?: boolean },
      from: number,
      to: number,
      typedText: string,
    ) => boolean

    return handleTextInput.call(
      plugin,
      {
        state,
        dispatch: (tr) => {
          next = state.apply(tr as Parameters<EditorState['apply']>[0])
        },
        composing: false,
      },
      caret,
      caret,
      typed,
    )
  })

  return handled ? next : null
}

describe('mark input rules (Outline parity)', () => {
  describe('as is: user finishes typing a markdown mark pattern', () => {
    it.each([
      ['**bold**', 'bold', 'bold'],
      ['*italic*', 'italic', 'italic'],
      ['_italic_', 'italic', 'italic'],
      ['`code`', 'code', 'code'],
      ['~strike~', 'strikethrough', 'strike'],
      ['__under__', 'underline', 'under'],
    ] as const)('to be: %s → %s mark on "%s"', (typedText, markName, innerText) => {
      const state = typeLastChar(typedText)

      expect(state).not.toBeNull()
      const { content, text } = editorStateToInline(state!)
      expect(text).toBe(innerText)
      expect(content).toEqual([{ type: 'text', text: innerText, marks: [{ type: markName }] }])
    })
  })

  describe('as is: patterns that must NOT trigger (EP: guards)', () => {
    it('to be: "**" alone (empty inner) does not apply bold', () => {
      expect(typeLastChar('****')).toBeNull()
    })

    it('to be: "_italic_" keeps the character before the delimiter intact', () => {
      const state = typeLastChar('a _word_')

      expect(state).not.toBeNull()
      const { content } = editorStateToInline(state!)
      expect(content).toEqual([
        { type: 'text', text: 'a ' },
        { type: 'text', text: 'word', marks: [{ type: 'italic' }] },
      ])
    })
  })
})
