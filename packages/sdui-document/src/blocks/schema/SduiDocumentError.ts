/**
 * Base class for every domain error thrown by `@lodado/sdui-document`.
 *
 * Lets a caller distinguish expected domain failures (block not found, invalid
 * merge, unsupported markdown, …) from programmer bugs with a single
 * `catch (e) { if (e instanceof SduiDocumentError) … }`, instead of importing
 * and testing each concrete class. Subclasses keep their own `name` as the
 * discriminant.
 */
export class SduiDocumentError extends Error {}
