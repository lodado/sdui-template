import type { SduiDocument } from '@lodado/sdui-document'
import React, { useEffect, useState } from 'react'

import { useSduiPage } from './SduiPageContext'

/** Upper bound on parent-chain resolution — also the cycle stop. */
const MAX_BREADCRUMB_DEPTH = 10

export type BreadcrumbsProps = {
  documentId: string
  className?: string
}

async function resolveChain(
  resolve: (id: string) => Promise<SduiDocument | undefined>,
  documentId: string,
): Promise<SduiDocument[]> {
  const chain: SduiDocument[] = []
  const visited = new Set<string>()
  let currentId: string | undefined = documentId

  while (currentId && !visited.has(currentId) && chain.length < MAX_BREADCRUMB_DEPTH) {
    visited.add(currentId)
    // eslint-disable-next-line no-await-in-loop -- each parent id is only known after the child resolves
    const document = await resolve(currentId)
    if (!document) {
      break
    }
    chain.unshift(document)
    currentId = document.parentDocumentId
  }

  return chain
}

/** Parent-chain breadcrumb (root → … → current); ancestors push on click. */
export const Breadcrumbs = ({ documentId, className }: BreadcrumbsProps) => {
  const page = useSduiPage()
  const [chain, setChain] = useState<SduiDocument[]>([])

  useEffect(() => {
    if (!page) {
      return undefined
    }

    let alive = true
    resolveChain((id) => page.resolve(id), documentId).then((resolved) => {
      if (alive) {
        setChain(resolved)
      }
    })

    return () => {
      alive = false
    }
  }, [page, documentId])

  if (!page || chain.length === 0) {
    return null
  }

  return (
    <nav aria-label="Breadcrumb" className={className ?? 'sdui-doc-breadcrumbs'}>
      <ol>
        {chain.map((document, index) => {
          const isCurrent = index === chain.length - 1
          return (
            <li key={document.id}>
              {isCurrent ? (
                <span aria-current="page">{document.title || 'Untitled'}</span>
              ) : (
                <button type="button" onClick={() => page.open(document.id, 'push')}>
                  {document.title || 'Untitled'}
                </button>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
