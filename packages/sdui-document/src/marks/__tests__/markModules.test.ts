import { boldMark } from '../bold/bold'
import { codeMark } from '../code/code'
import { italicMark } from '../italic/italic'
import { strikethroughMark } from '../strikethrough/strikethrough'
import { underlineMark } from '../underline/underline'

describe('attr-less mark modules', () => {
  const modules = [boldMark, italicMark, strikethroughMark, underlineMark, codeMark]

  test('schema accepts exactly its own type literal', () => {
    modules.forEach((markModule) => {
      expect(markModule.schema.parse({ type: markModule.name })).toEqual({ type: markModule.name })
      expect(() => markModule.schema.parse({ type: 'nope' })).toThrow()
    })
  })

  test('clone returns a new object, equals is always true', () => {
    modules.forEach((markModule) => {
      const mark = { type: markModule.name }
      expect(markModule.clone(mark)).not.toBe(mark)
      expect(markModule.clone(mark)).toEqual(mark)
      expect(markModule.equals(mark, mark)).toBe(true)
    })
  })
})
