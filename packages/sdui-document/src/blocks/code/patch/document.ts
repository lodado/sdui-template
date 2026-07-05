import type { SduiDocument, SduiDocumentPatch } from '../../schema'
import { applyDocumentPatch } from './apply'
import { applyDocumentPatchWithInverse } from './inverse'

export function applyPatchToDocument(document: SduiDocument, patch: SduiDocumentPatch): SduiDocument {
  if (patch.type === 'document.setTitle') {
    return { ...document, title: patch.title }
  }

  return {
    ...document,
    content: applyDocumentPatch(document.content, patch),
  }
}

export function applyPatchesToDocument(document: SduiDocument, patches: SduiDocumentPatch[]): SduiDocument {
  return patches.reduce(applyPatchToDocument, document)
}

export type ApplyPatchToDocumentResult = {
  document: SduiDocument
  inverse: SduiDocumentPatch[]
}

export function applyPatchToDocumentWithInverse(
  document: SduiDocument,
  patch: SduiDocumentPatch,
): ApplyPatchToDocumentResult {
  if (patch.type === 'document.setTitle') {
    return {
      document: { ...document, title: patch.title },
      inverse: [{ type: 'document.setTitle', title: document.title }],
    }
  }

  const result = applyDocumentPatchWithInverse(document.content, patch)

  return { document: { ...document, content: result.content }, inverse: result.inverse }
}

/**
 * Applies a batch to the document (title + content) and returns the combined
 * inverse: each patch's inverse accumulated in reverse order, so applying
 * `inverse` in array order rolls the whole batch back — including
 * `document.setTitle`, which the content-level pipeline cannot invert.
 */
export function applyPatchesToDocumentWithInverse(
  document: SduiDocument,
  patches: SduiDocumentPatch[],
): ApplyPatchToDocumentResult {
  return patches.reduce<ApplyPatchToDocumentResult>(
    (acc, patch) => {
      const result = applyPatchToDocumentWithInverse(acc.document, patch)

      return { document: result.document, inverse: [...result.inverse, ...acc.inverse] }
    },
    { document, inverse: [] },
  )
}
