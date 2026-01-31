import type { Schema } from 'prosemirror-model'
import { schema as basicSchema } from 'prosemirror-schema-basic'

export const defaultProseMirrorSchema = basicSchema

export const createProseMirrorDoc = (text: string, schema: Schema = defaultProseMirrorSchema) => {
  return schema
    .node('doc', null, [schema.node('paragraph', null, schema.text(text))])
    .toJSON()
}
