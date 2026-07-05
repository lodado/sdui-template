import { z } from 'zod'

import type { SduiDocumentId, SduiDocumentPatch } from '../blocks/schema'
import { createDocumentId, parseSduiDocumentPatches } from '../blocks/schema'
import type { HlcTimestamp } from './hlc'

/**
 * Client-produced unit of change: an atomic batch of patches plus the
 * causality metadata the server needs to sequence it.
 *
 * Policies:
 * - `baseSeq` is the last committed log seq the client had applied when it
 *   produced the batch (0 = fresh document). It records WHAT THE CLIENT SAW —
 *   the causality info a raw timestamp cannot carry.
 * - `hlc` orders offline/local batches and feeds audit display; the server
 *   log `seq` remains the only merge authority.
 * - `envelopeId` is caller-supplied (this package never generates randomness)
 *   and deduplicates retries server-side.
 */
export type PatchEnvelope = {
  envelopeId: string
  documentId: SduiDocumentId
  actorId: string
  hlc: HlcTimestamp
  baseSeq: number
  patches: SduiDocumentPatch[]
}

/** Envelope after the server accepted it and stamped the authoritative seq. */
export type CommittedPatchEnvelope = PatchEnvelope & { seq: number }

export function createPatchEnvelope(input: PatchEnvelope): PatchEnvelope {
  return {
    ...input,
    hlc: { ...input.hlc },
    patches: [...input.patches],
  }
}

const hlcSchema = z.object({
  millis: z.number().int().nonnegative(),
  counter: z.number().int().nonnegative(),
  actorId: z.string().min(1),
})

const envelopeSchema = z.object({
  envelopeId: z.string().min(1),
  documentId: z.string().min(1),
  actorId: z.string().min(1),
  hlc: hlcSchema,
  baseSeq: z.number().int().nonnegative(),
  patches: z.array(z.unknown()).min(1),
})

/** Boundary validation for envelopes arriving over the network. */
export function parsePatchEnvelope(input: unknown): PatchEnvelope {
  const raw = envelopeSchema.parse(input)

  return {
    envelopeId: raw.envelopeId,
    documentId: createDocumentId(raw.documentId),
    actorId: raw.actorId,
    hlc: raw.hlc,
    baseSeq: raw.baseSeq,
    patches: parseSduiDocumentPatches(raw.patches),
  }
}
