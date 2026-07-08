import { z } from 'zod'

import { BLOCK_TYPE_MODULES, blockModuleByType } from '../../block-types'
import { inlineMarkSchema } from '../../marks'
import type { SduiDocument, SduiDocumentBlock, SduiDocumentContent, SduiDocumentPatch } from './index'
import type { SduiInlineContent } from './inline'

const inlineNodeSchema = z.union([
  z.object({
    type: z.literal('text'),
    text: z.string(),
    marks: z.array(inlineMarkSchema).optional(),
  }),
  z.object({ type: z.literal('hard_break') }),
  z.object({ type: z.literal('date'), iso: z.string(), display: z.string().optional() }),
])

const inlineContentSchema = z.array(inlineNodeSchema)

// Known block types are enumerated by the block-type registry, so adding a
// block folder auto-registers its type here. The trailing z.string() keeps
// validation intentionally open to custom/unknown types (behavior preserved).
const blockTypeSchema = z.union([
  z.string(),
  ...BLOCK_TYPE_MODULES.map((blockModule) => z.literal(blockModule.type)),
] as unknown as [z.ZodTypeAny, z.ZodTypeAny, ...z.ZodTypeAny[]])

const blockOriginSchema = z.object({
  clientId: z.string().min(1),
  opId: z.string().min(1),
})

const blockSchema: z.ZodTypeAny = z.lazy(() =>
  z
    .object({
      id: z.string().min(1),
      type: blockTypeSchema,
      position: z.string().optional(),
      origin: blockOriginSchema.optional(),
      state: z.record(z.string(), z.unknown()).optional(),
      attributes: z.record(z.string(), z.unknown()).optional(),
      children: z.array(blockSchema).optional(),
    })
    // Enforce each block type's own `state`/`attributes` schema at the parse
    // boundary via the registry. Unknown/custom types have no module and stay
    // open by design. Schemas are non-strict, so extra keys (e.g. rich `content`
    // alongside a modelled `text`) pass; only wrong-typed values are rejected.
    .superRefine((block, ctx) => {
      const blockModule = blockModuleByType[block.type as string]
      if (!blockModule) {
        return
      }

      if (blockModule.stateSchema && block.state !== undefined) {
        const result = blockModule.stateSchema.safeParse(block.state)
        if (!result.success) {
          result.error.issues.forEach((issue) => ctx.addIssue({ ...issue, path: ['state', ...issue.path] }))
        }
      }

      if (blockModule.attributesSchema && block.attributes !== undefined) {
        const result = blockModule.attributesSchema.safeParse(block.attributes)
        if (!result.success) {
          result.error.issues.forEach((issue) => ctx.addIssue({ ...issue, path: ['attributes', ...issue.path] }))
        }
      }
    }),
)

const contentSchema = z.object({
  schemaVersion: z.union([z.literal('1.0'), z.literal('1.1')]),
  root: blockSchema,
})

const documentStateSchema = z.union([
  z.literal('draft'),
  z.literal('published'),
  z.literal('archived'),
  z.literal('deleted'),
])

const documentSchema = z.object({
  id: z.string().min(1),
  workspaceId: z.string().min(1),
  collectionId: z.string().min(1).optional(),
  parentDocumentId: z.string().min(1).optional(),
  sortIndex: z.number().optional(),
  title: z.string(),
  state: documentStateSchema,
  content: contentSchema,
  version: z.number().int().nonnegative(),
  createdAt: z.string(),
  updatedAt: z.string(),
  archivedAt: z.string().optional(),
  deletedAt: z.string().optional(),
  createdBy: z.string().optional(),
})

const patchBaseFields = {
  expectedVersion: z.number().int().nonnegative().optional(),
  origin: blockOriginSchema.optional(),
}

const placementAnchorFields = {
  after: z.string().min(1).nullable().optional(),
  before: z.string().min(1).nullable().optional(),
  fallbackAfter: z.array(z.string().min(1)).optional(),
}

const patchSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('block.insert'),
    parentId: z.string().min(1),
    block: blockSchema,
    ...patchBaseFields,
    ...placementAnchorFields,
  }),
  z.object({
    type: z.literal('block.update'),
    blockId: z.string().min(1),
    state: z.record(z.string(), z.unknown()).optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
    ...patchBaseFields,
  }),
  z.object({
    type: z.literal('block.delete'),
    blockId: z.string().min(1),
    ...patchBaseFields,
  }),
  z.object({
    type: z.literal('block.move'),
    blockId: z.string().min(1),
    parentId: z.string().min(1),
    ...patchBaseFields,
    ...placementAnchorFields,
  }),
  z.object({
    type: z.literal('block.split'),
    blockId: z.string().min(1),
    offset: z.number().int().min(0),
    newBlockId: z.string().min(1),
    ...patchBaseFields,
  }),
  z.object({
    type: z.literal('block.merge'),
    blockId: z.string().min(1),
    intoBlockId: z.string().min(1),
    ...patchBaseFields,
  }),
  z.object({
    type: z.literal('block.setType'),
    blockId: z.string().min(1),
    blockType: blockTypeSchema,
    attributes: z.record(z.string(), z.unknown()).optional(),
    ...patchBaseFields,
  }),
  z.object({
    type: z.literal('document.setTitle'),
    title: z.string(),
    ...patchBaseFields,
  }),
])

export function parseSduiDocument(input: unknown): SduiDocument {
  return documentSchema.parse(input) as unknown as SduiDocument
}

export function parseSduiDocumentContent(input: unknown): SduiDocumentContent {
  return contentSchema.parse(input) as unknown as SduiDocumentContent
}

export function parseSduiInlineContent(input: unknown): SduiInlineContent {
  return inlineContentSchema.parse(input) as SduiInlineContent
}

export function parseSduiDocumentPatch(input: unknown): SduiDocumentPatch {
  return patchSchema.parse(input) as unknown as SduiDocumentPatch
}

export function parseSduiDocumentPatches(input: unknown): SduiDocumentPatch[] {
  return z.array(patchSchema).parse(input) as unknown as SduiDocumentPatch[]
}

// Keep internal types exported for tests that inspect Zod output shape
export type RawSduiDocumentBlock = z.infer<typeof blockSchema>
