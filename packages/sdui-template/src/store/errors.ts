/* eslint-disable max-classes-per-file */
/**
 * SDUI Layout Store Errors
 *
 * Custom error classes for SDUI Layout Store operations
 */

/**
 * NodeNotFoundError
 *
 * Thrown when attempting to access or update a node that does not exist in the store
 */
export class NodeNotFoundError extends Error {
  constructor(nodeId: string) {
    super(`Node not found: "${nodeId}"`)
    this.name = 'NodeNotFoundError'
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, NodeNotFoundError)
    }
  }
}

/**
 * RootNotFoundError
 *
 * Thrown when attempting to access root node ID that does not exist
 */
export class RootNotFoundError extends Error {
  constructor() {
    super('Root node ID not found')
    this.name = 'RootNotFoundError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RootNotFoundError)
    }
  }
}

/**
 * MetadataNotFoundError
 *
 * Thrown when attempting to access metadata that does not exist
 */
export class MetadataNotFoundError extends Error {
  constructor() {
    super('Metadata not found')
    this.name = 'MetadataNotFoundError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MetadataNotFoundError)
    }
  }
}

/**
 * AttributesNotFoundError
 *
 * Thrown when attempting to access attributes that does not exist
 */
export class AttributesNotFoundError extends Error {
  constructor(nodeId: string) {
    super(`Attributes not found for node: "${nodeId}"`)
    this.name = 'AttributesNotFoundError'
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AttributesNotFoundError)
    }
  }
}
