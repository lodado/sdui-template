import { denormalizeSduiLayout, denormalizeSduiNode } from '../index'

describe('public exports', () => {
  it('exposes denormalization utilities from the package entrypoint', () => {
    expect(denormalizeSduiLayout).toEqual(expect.any(Function))
    expect(denormalizeSduiNode).toEqual(expect.any(Function))
  })
})
