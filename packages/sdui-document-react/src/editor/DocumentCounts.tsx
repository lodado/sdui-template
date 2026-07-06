import type { DocumentStats, SduiDocumentContent } from '@lodado/sdui-document'
import { documentStats } from '@lodado/sdui-document'
import React, { useMemo } from 'react'

/** Memoized document metrics for status/footer UI. */
export function useDocumentStats(content: SduiDocumentContent): DocumentStats {
  return useMemo(() => documentStats(content), [content])
}

export interface DocumentCountsProps {
  content: SduiDocumentContent
}

/**
 * Opt-in footer stats. The editor renders nothing by default — consumers place
 * this component where they want the word/block count shown.
 */
export const DocumentCounts = ({ content }: DocumentCountsProps) => {
  const { words, blocks } = useDocumentStats(content)

  return (
    <div className="document-counts" aria-label="document statistics">
      {words} words · {blocks} block{blocks === 1 ? '' : 's'}
    </div>
  )
}
