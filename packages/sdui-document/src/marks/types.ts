import { z } from 'zod'

/**
 * One inline mark, fully colocated on the domain side: type literal,
 * zod schema, deep clone, and attrs equality.
 *
 * Render-side counterpart: packages/sdui-document-react/src/marks/types.ts.
 * `name` must equal the SduiInlineMark type string (same 1:1 contract).
 */
export type SduiMarkModule<Mark extends { type: string }> = {
  readonly name: Mark['type']
  /** zod schema for this single mark — composed into inlineMarkSchema */
  readonly schema: z.ZodType<Mark>
  /** deep copy — attrs-bearing marks must not share attrs references */
  readonly clone: (mark: Mark) => Mark
  /** attrs equality — only called when both marks already have the same type */
  readonly equals: (a: Mark, b: Mark) => boolean
}

/** Marks without attrs share trivial clone/equals. */
export function defineAttrlessMark<Type extends string>(name: Type): SduiMarkModule<{ type: Type }> {
  return {
    name,
    schema: z.object({ type: z.literal(name) }),
    clone: (mark) => ({ ...mark }),
    equals: () => true,
  }
}
