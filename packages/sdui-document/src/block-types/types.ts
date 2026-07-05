// packages/sdui-document/src/block-types/types.ts
import type { Token } from 'marked'
import type { z } from 'zod'

import type { SduiDocumentBlock } from '../blocks/schema/block'
import type { SduiDocumentBlockId } from '../blocks/schema/ids'
import type { SduiInlineContent } from '../blocks/schema/inline'
import type { MarkdownUnsupportedPolicy } from '../markdown/types'
import type { BlockMapperTheme } from '../sdui/theme'

export type SduiLayoutLikeNode = {
  id: string
  type: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutLikeNode[]
}

export type SduiLayoutLikeDocument = {
  version: string
  metadata?: {
    id?: string
    name?: string
  }
  root: SduiLayoutLikeNode
}

export type BlockMapperContext = {
  theme: BlockMapperTheme
  /** recursive dispatch injected by the dispatcher — modules never import it (no cycle) */
  mapChildren(block: SduiDocumentBlock): SduiLayoutLikeNode[] | undefined
}

export type BlockToMarkdownContext = {
  /** Serialize the block's own inline content (`state.content`, else `state.text`) to markdown. */
  inline(block: SduiDocumentBlock): string
  /**
   * Serialize child blocks to markdown, joined by blank lines ('' when none).
   * Injected by the dispatcher — modules never import it (no cycle).
   */
  renderChildren(block: SduiDocumentBlock): string
}

/**
 * Glue passed to each block's `fromMarkdown` token handler (`<name>.markdown.ts`).
 * The `marked` types are `import type` only — no runtime coupling to the parser.
 * Handlers are token-keyed (a marked token → block), so they are plain functions
 * aggregated by the markdown importer rather than fields on the block module.
 */
export type BlockFromMarkdownContext = {
  /** Generate a branded block id; `hint` is the block-type short name. */
  blockId(hint: string): SduiDocumentBlockId
  /** Policy for constructs the schema cannot express. */
  onUnsupported: MarkdownUnsupportedPolicy
  /** Convert marked inline tokens to inline content (applies onUnsupported). */
  inline(tokens: Token[]): SduiInlineContent
  /** `{ text, content }` state from inline content (plain-text derived). */
  textState(content: SduiInlineContent): Record<string, unknown>
  /** Recurse: map nested block tokens to blocks. */
  mapTokens(tokens: Token[]): SduiDocumentBlock[]
}

/** Precomputed by the fromSdui dispatcher: branded id + mapped children (undefined when empty). */
export type FromSduiBase = {
  id: SduiDocumentBlockId
  children?: SduiDocumentBlock[]
}

/** A link a block contributes to the document link index (blockId added by the caller). */
export type BlockLinkRef = {
  targetDocumentId?: string
  href?: string
}

/**
 * One document block type, fully colocated on the domain side: typed
 * state/attributes, type guard, SDUI layout mappings, default factory, and
 * markdown serialization. Each concern lives in its own file inside the block
 * folder (`<name>.ts` / `<name>.schema.ts` / `<name>.default.ts` /
 * `<name>.markdown.ts`) and is assembled into this module object.
 * Render-side counterpart: packages/sdui-document-react/src/block-types/<name>/.
 */
export type SduiBlockTypeModule = {
  readonly type: string
  toSduiNode(block: SduiDocumentBlock, ctx: BlockMapperContext): SduiLayoutLikeNode
  fromSduiNode(node: SduiLayoutLikeNode, base: FromSduiBase): SduiDocumentBlock
  /**
   * Freshly-inserted block for the block menu / '+' button.
   * Omitted for types that are never menu-inserted (e.g. root).
   */
  createDefault?(id: SduiDocumentBlockId, attributes?: Record<string, unknown>): SduiDocumentBlock
  /**
   * Zod schema for this block's `state` / `attributes` — the domain
   * source-of-truth for the block's shape, colocated in `<name>.schema.ts`.
   * Document-level validation stays intentionally loose; these enable
   * opt-in strict per-type parsing and drive the block's TS types.
   */
  readonly stateSchema?: z.ZodTypeAny
  readonly attributesSchema?: z.ZodTypeAny
  /**
   * Serialize this block (and, where relevant, its children) to a markdown
   * string. Omitted for types with no markdown form — the dispatcher falls
   * back to the paragraph module, matching the SDUI-mapping fallback.
   */
  toMarkdown?(block: SduiDocumentBlock, ctx: BlockToMarkdownContext): string
  /**
   * Whether this block can carry inline text (receive a text drop, hold a caret).
   * Defaults to true; container/leaf blocks (root, divider, image, file, link)
   * declare false.
   */
  readonly canHostInlineText?: boolean
  /** Links this block contributes to the document link index. Only link-like blocks implement it. */
  extractLinks?(block: SduiDocumentBlock): BlockLinkRef[]
  /**
   * Searchable plain text for this block. Optional override — the extractor
   * falls back to `state.text` / derived `state.content` when omitted.
   */
  toPlainText?(block: SduiDocumentBlock): string
}
