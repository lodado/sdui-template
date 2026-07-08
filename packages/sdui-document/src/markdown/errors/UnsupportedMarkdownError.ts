import { SduiDocumentError } from '../../blocks/schema/SduiDocumentError'

/** Thrown when markdown import hits a construct the schema cannot express and `onUnsupported` is `'throw'`. */
export class UnsupportedMarkdownError extends SduiDocumentError {
  constructor(tokenType: string) {
    super(`Unsupported markdown construct: ${tokenType}`)
    this.name = 'UnsupportedMarkdownError'
  }
}
