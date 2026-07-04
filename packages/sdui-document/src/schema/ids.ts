declare const __brand: unique symbol
type Brand<T, B> = T & { readonly [__brand]: B }

export type SduiDocumentId = Brand<string, 'SduiDocumentId'>
export type SduiWorkspaceId = Brand<string, 'SduiWorkspaceId'>
export type SduiCollectionId = Brand<string, 'SduiCollectionId'>
export type SduiDocumentBlockId = Brand<string, 'SduiDocumentBlockId'>

export function createDocumentId(raw: string): SduiDocumentId {
  return raw as SduiDocumentId
}

export function createWorkspaceId(raw: string): SduiWorkspaceId {
  return raw as SduiWorkspaceId
}

export function createCollectionId(raw: string): SduiCollectionId {
  return raw as SduiCollectionId
}

export function createBlockId(raw: string): SduiDocumentBlockId {
  return raw as SduiDocumentBlockId
}
