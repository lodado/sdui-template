import { defineAttrlessMark } from '../types'

export type ItalicMark = { type: 'italic' }

export const italicMark = defineAttrlessMark('italic', { token: 'em', toMarkdown: (inner) => `*${inner}*` })
