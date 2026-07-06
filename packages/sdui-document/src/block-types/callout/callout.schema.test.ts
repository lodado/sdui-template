import { calloutAttributesSchema } from './callout.schema'

it('accepts an optional emoji icon', () => {
  expect(calloutAttributesSchema.parse({ tone: 'info', icon: '🔥' })).toEqual({ tone: 'info', icon: '🔥' })
})
