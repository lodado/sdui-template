/* eslint-disable no-underscore-dangle */
/**
 * DocumentManager
 *
 * Manages document caching, restoration, and serialization.
 */

import { cloneDeep } from 'lodash-es'

import type { SduiLayoutDocument } from '../../schema'
import { denormalizeSduiNode } from '../../utils/normalize'
import type { LayoutStateRepository } from './LayoutStateRepository'

/**
 * DocumentManager
 *
 * Manages document caching, restoration, and serialization.
 */
export class DocumentManager {
  /** Document metadata */
  private _metadata?: SduiLayoutDocument['metadata']

  /** Cached documents */
  private _cached: Record<string, SduiLayoutDocument> = {}

  /** Original document cache (for undo) */
  private _originalCached: Record<string, SduiLayoutDocument> = {}

  /**
   * Cache a document.
   *
   * @param document - Document to cache
   */
  cacheDocument(document: SduiLayoutDocument): void {
    const documentId = document.metadata?.id || document.root.id
    this._cached[documentId] = document

    // Save the original if it does not exist
    if (!this._originalCached[documentId]) {
      this._originalCached[documentId] = cloneDeep(document)
    }
  }

  /**
   * Set metadata.
   *
   * @param metadata - Metadata
   */
  setMetadata(metadata?: SduiLayoutDocument['metadata']): void {
    this._metadata = metadata
  }

  /**
   * Return metadata.
   *
   * @returns Metadata or undefined
   */
  getMetadata(): SduiLayoutDocument['metadata'] | undefined {
    return this._metadata
  }

  /**
   * Return the original document.
   *
   * @param documentId - Document ID
   * @returns Original document or undefined
   */
  getOriginalDocument(documentId: string): SduiLayoutDocument | undefined {
    return this._originalCached[documentId]
  }

  /**
   * Get the document ID.
   *
   * @param rootId - Root node ID (fallback)
   * @returns Document ID or undefined
   */
  getDocumentId(rootId?: string): string | undefined {
    return this._metadata?.id || rootId
  }

  /**
   * Convert the current state into a document.
   *
   * @param repository - State repository
   * @returns Restored document or null
   */
  getDocument(repository: LayoutStateRepository): SduiLayoutDocument | null {
    const rootId = repository.getRootId()
    if (!rootId) return null

    const rootNode = denormalizeSduiNode(rootId, {
      nodes: repository.nodes,
    })

    if (!rootNode) return null

    return {
      version: '1.0.0',
      metadata: this._metadata,
      root: rootNode,
    }
  }

  /**
   * Clear the cache.
   */
  clearCache(): void {
    this._cached = {}
    this._originalCached = {}
  }

  /**
   * Reset the state.
   */
  reset(): void {
    this._metadata = undefined
    this.clearCache()
  }
}
