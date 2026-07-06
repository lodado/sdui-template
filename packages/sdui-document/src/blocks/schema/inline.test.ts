import { isInlineDateNode, type SduiInlineNode } from './inline'

it('narrows a date node', () => {
  const node: SduiInlineNode = { type: 'date', iso: '2026-07-06', display: 'Jul 6, 2026' }

  expect(isInlineDateNode(node)).toBe(true)
  expect(isInlineDateNode({ type: 'text', text: 'x' })).toBe(false)
  expect(isInlineDateNode({ type: 'hard_break' })).toBe(false)
})
