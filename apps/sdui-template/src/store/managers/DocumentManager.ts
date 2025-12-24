/* eslint-disable no-underscore-dangle */
/**
 * DocumentManager
 *
 * 문서 캐싱, 복원, 직렬화를 관리합니다.
 */

import { cloneDeep } from 'lodash-es'

import type { SduiLayoutDocument } from '../../schema'
import { denormalizeSduiNode } from '../../utils/normalize'
import type { LayoutStateRepository } from './LayoutStateRepository'

/**
 * DocumentManager
 *
 * 문서 캐싱, 복원, 직렬화를 관리합니다.
 */
export class DocumentManager {
  /** 문서 메타데이터 */
  private _metadata?: SduiLayoutDocument['metadata']

  /** 캐시된 문서 */
  private _cached: Record<string, SduiLayoutDocument> = {}

  /** 원본 문서 캐시 (편집 취소용) */
  private _originalCached: Record<string, SduiLayoutDocument> = {}

  /**
   * 문서를 캐시합니다.
   *
   * @param document - 캐시할 문서
   */
  cacheDocument(document: SduiLayoutDocument): void {
    const documentId = document.metadata?.id || document.root.id
    this._cached[documentId] = document

    // 원본 캐시가 없으면 저장
    if (!this._originalCached[documentId]) {
      this._originalCached[documentId] = cloneDeep(document)
    }
  }

  /**
   * 메타데이터를 설정합니다.
   *
   * @param metadata - 메타데이터
   */
  setMetadata(metadata?: SduiLayoutDocument['metadata']): void {
    this._metadata = metadata
  }

  /**
   * 메타데이터를 반환합니다.
   *
   * @returns 메타데이터 또는 undefined
   */
  getMetadata(): SduiLayoutDocument['metadata'] | undefined {
    return this._metadata
  }

  /**
   * 원본 문서를 반환합니다.
   *
   * @param documentId - 문서 ID
   * @returns 원본 문서 또는 undefined
   */
  getOriginalDocument(documentId: string): SduiLayoutDocument | undefined {
    return this._originalCached[documentId]
  }

  /**
   * 문서 ID를 가져옵니다.
   *
   * @param rootId - 루트 노드 ID (fallback)
   * @returns 문서 ID 또는 undefined
   */
  getDocumentId(rootId?: string): string | undefined {
    return this._metadata?.id || rootId
  }

  /**
   * 현재 상태를 문서로 변환합니다.
   *
   * @param repository - 상태 저장소
   * @returns 복원된 문서 또는 null
   */
  getDocument(repository: LayoutStateRepository): SduiLayoutDocument | null {
    const rootId = repository.getRootId()
    if (!rootId) return null

    const rootNode = denormalizeSduiNode(rootId, {
      nodes: repository.nodes,
      layoutStates: repository.layoutStates,
      layoutAttributes: repository.layoutAttributes,
    })

    if (!rootNode) return null

    return {
      version: '1.0.0',
      metadata: this._metadata,
      root: rootNode,
    }
  }

  /**
   * 캐시를 초기화합니다.
   */
  clearCache(): void {
    this._cached = {}
    this._originalCached = {}
  }

  /**
   * 상태를 초기화합니다.
   */
  reset(): void {
    this._metadata = undefined
    this.clearCache()
  }
}
