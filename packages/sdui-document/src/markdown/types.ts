/** What to do with markdown constructs the document schema cannot express. */
export type MarkdownUnsupportedPolicy = 'degrade' | 'skip' | 'throw'

export type MarkdownImportOptions = {
  /**
   * Id source for generated blocks — `hint` is the block-type short name (`root`, `heading`, …).
   * Defaults to a per-conversion counter (`md-<hint>-<n>`): unique within one conversion,
   * NOT across conversions — inject your own (e.g. nanoid) when merging converted documents.
   */
  generateId?: (hint: string) => string
  /** Default: 'degrade' (unsupported constructs become plain-text paragraphs). */
  onUnsupported?: MarkdownUnsupportedPolicy
}
