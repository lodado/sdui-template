import { z } from 'zod'

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
])

const inlineContentSchema = z.array(inlineNodeSchema)

const blockTypeSchema = z.union([
  z.literal('document.root'),
  z.literal('document.paragraph'),
  z.literal('document.heading'),
  z.literal('document.checklist'),
  z.literal('document.divider'),
  z.literal('document.callout'),
  z.literal('document.image'),
  z.literal('document.file'),
  z.literal('document.link'),
  z.string(),
])

const blockSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    type: blockTypeSchema,
    state: z.record(z.string(), z.unknown()).optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
    children: z.array(blockSchema).optional(),
  }),
)

const contentSchema = z.object({
  schemaVersion: z.literal('1.0'),
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

const patchSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('block.insert'),
    parentId: z.string().min(1),
    index: z.number().int().min(0),
    block: blockSchema,
  }),
  z.object({
    type: z.literal('block.update'),
    blockId: z.string().min(1),
    state: z.record(z.string(), z.unknown()).optional(),
    attributes: z.record(z.string(), z.unknown()).optional(),
  }),
  z.object({
    type: z.literal('block.delete'),
    blockId: z.string().min(1),
  }),
  z.object({
    type: z.literal('block.move'),
    blockId: z.string().min(1),
    parentId: z.string().min(1),
    index: z.number().int().min(0),
  }),
  z.object({
    type: z.literal('document.setTitle'),
    title: z.string(),
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
