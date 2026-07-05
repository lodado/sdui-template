import { EditorState,TextSelection  } from 'prosemirror-state'

import type { FocusedBlockCallbacks } from '../pm/keymapDelegation'
import { focusedBlockSchema } from '../pm/schema'
import { buildSlashMenuPlugin, getSlashRange } from '../pm/slashMenuPlugin'

const noopCallbacks: FocusedBlockCallbacks = {
  onSplit: () => {},
  onMergeBackward: () => {},
  onIndent: () => {},
  onOutdent: () => {},
  onNavigate: () => {},
  onTurnInto: () => {},
  onEscape: () => {},
  onMoveBlock: () => {},
  onHistory: () => {},
  onBlockAction: () => {},
  onSlashMenuOpen: () => {},
  onSlashMenuQueryChange: () => {},
  onSlashMenuClose: () => {},
  isSlashMenuOpen: () => false,
  onSlashMenuKey: () => false,
}

function stateWithPlugin(): EditorState {
  return EditorState.create({
    schema: focusedBlockSchema,
    plugins: [buildSlashMenuPlugin(noopCallbacks)],
  })
}

function typeText(state: EditorState, text: string): EditorState {
  return state.apply(state.tr.insertText(text, state.selection.from))
}

describe('slashMenuPlugin', () => {
  test('slash at block start opens a range', () => {
    const state = typeText(stateWithPlugin(), '/')
    // flat schema: doc → inline*, so position 0 = before '/', position 1 = after '/'
    expect(getSlashRange(state)).toEqual({ from: 0, to: 1 })
  })

  test('query grows with typed characters', () => {
    const state = typeText(typeText(stateWithPlugin(), '/'), 'head')
    // slashPos stays at 0; to = cursor = 0+1+4 = 5
    expect(getSlashRange(state)).toEqual({ from: 0, to: 5 })
  })

  test('slash mid-word does not open', () => {
    const state = typeText(typeText(stateWithPlugin(), 'a'), '/')
    expect(getSlashRange(state)).toBeNull()
  })

  test('slash after whitespace opens', () => {
    const state = typeText(typeText(stateWithPlugin(), 'a '), '/')
    expect(getSlashRange(state)).not.toBeNull()
  })

  test('whitespace in query closes the range', () => {
    const state = typeText(typeText(stateWithPlugin(), '/he'), ' ')
    expect(getSlashRange(state)).toBeNull()
  })

  test('deleting the slash closes the range', () => {
    let state = typeText(stateWithPlugin(), '/')
    // flat schema: '/' is at [0, 1)
    state = state.apply(state.tr.delete(0, 1))
    expect(getSlashRange(state)).toBeNull()
  })

  test('moving the caret before the slash closes the range', () => {
    let state = typeText(typeText(stateWithPlugin(), '/'), 'he')
    // flat schema: '/' at position 0; moving caret to 0 puts it before the slash
    state = state.apply(state.tr.setSelection(TextSelection.create(state.doc, 0)))
    expect(getSlashRange(state)).toBeNull()
  })
})
