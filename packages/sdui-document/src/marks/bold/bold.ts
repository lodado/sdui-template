import { defineAttrlessMark } from '../types'

export type BoldMark = { type: 'bold' }

export const boldMark = defineAttrlessMark('bold', { token: 'strong', toMarkdown: (inner) => `**${inner}**` })
