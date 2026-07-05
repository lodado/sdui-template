import type { Token } from 'marked'
import { z } from 'zod'

import type { SduiInlineMark, SduiInlineNode } from '../blocks/schema/inline'

/**
 * Glue passed to a mark's `fromMarkdown` handler. The `marked` type is
 * `import type` only — no runtime coupling to the parser.
 */
export type MarkFromMarkdownContext = {
  /** Recurse into a token's inline children, accumulating the mark stack. */
  collect(tokens: Token[], marks: SduiInlineMark[]): SduiInlineNode[]
  /** Build a single text node carrying the given marks. */
  textNode(text: string, marks: SduiInlineMark[]): SduiInlineNode
}

/**
 * One inline mark, fully colocated on the domain side: type literal,
 * zod schema, deep clone, attrs equality, and both markdown directions.
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
  /**
   * Wrap already-serialized inner text in this mark's markdown syntax.
   * Omitted for marks with no markdown equivalent (underline, highlight) —
   * they degrade to the plain inner text.
   */
  readonly toMarkdown?: (inner: string, mark: Mark) => string
  /** The marked inline token type this mark parses FROM (e.g. 'strong' → bold). */
  readonly markdownToken?: string
  /** Build inline nodes from a matching marked token (see markdownToken). */
  readonly fromMarkdown?: (token: Token, marks: SduiInlineMark[], ctx: MarkFromMarkdownContext) => SduiInlineNode[]
}

type AttrlessMarkdown<Type extends string> = {
  /** marked inline token type this mark parses from (e.g. 'strong') */
  token?: string
  /** wrap inner text in markdown syntax */
  toMarkdown?: (inner: string) => string
  /** codespan-style: the token's own `text` becomes a single marked text node (no recursion) */
  leaf?: boolean
}

/** Marks without attrs share trivial clone/equals and a uniform markdown mapping. */
export function defineAttrlessMark<Type extends string>(
  name: Type,
  markdown?: AttrlessMarkdown<Type>,
): SduiMarkModule<{ type: Type }> {
  // callers guarantee `name` is a real SduiInlineMark type; TS can't see that through the generic
  const selfMark = { type: name } as unknown as SduiInlineMark
  const fromMarkdown: SduiMarkModule<{ type: Type }>['fromMarkdown'] = markdown?.token
    ? (token, marks, ctx) =>
        markdown.leaf
          ? [ctx.textNode((token as { text?: string }).text ?? '', [...marks, selfMark])]
          : ctx.collect((token as { tokens?: Token[] }).tokens ?? [], [...marks, selfMark])
    : undefined

  return {
    name,
    schema: z.object({ type: z.literal(name) }),
    clone: (mark) => ({ ...mark }),
    equals: () => true,
    ...(markdown?.toMarkdown ? { toMarkdown: markdown.toMarkdown } : {}),
    ...(markdown?.token ? { markdownToken: markdown.token, fromMarkdown } : {}),
  }
}
