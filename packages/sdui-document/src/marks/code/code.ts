import { defineAttrlessMark } from '../types'

export type CodeMark = { type: 'code' }

export const codeMark = defineAttrlessMark('code', {
  token: 'codespan',
  leaf: true,
  toMarkdown: (inner) => `\`${inner}\``,
})
