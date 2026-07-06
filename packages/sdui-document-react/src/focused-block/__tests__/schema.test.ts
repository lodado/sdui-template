import { focusedBlockSchema } from '../pm/schema'

it('has an inline date atom node', () => {
  const node = focusedBlockSchema.nodes.date.create({ iso: '2026-07-06', display: 'Jul 6' })

  expect(node.isInline).toBe(true)
  expect(node.isAtom).toBe(true)
  expect(node.attrs.iso).toBe('2026-07-06')
})
