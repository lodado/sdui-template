import type { SduiDocumentPatch } from '@lodado/sdui-document'

/** Strip transport metadata added by useDocumentPatches for stable assertions. */
export function stripPatchOrigins(patches: SduiDocumentPatch[]): SduiDocumentPatch[] {
  return patches.map((patch) => {
    const { origin: _origin, ...rest } = patch as SduiDocumentPatch & { origin?: unknown }
    return rest as SduiDocumentPatch
  })
}
