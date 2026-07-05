import { extractBlockLinks } from '../block-types'
import type { SduiDocumentContent } from '../blocks/schema'
import { walkDocumentBlocks } from './walkBlocks'

export type SduiDocumentLink = {
  blockId: string
  targetDocumentId?: string
  href?: string
}

/**
 * Collects every link in the document. Which blocks carry links (and what they
 * expose) is a per-block capability (`module.extractLinks`) owned by each block
 * folder; this walker just attaches the source blockId.
 */
export function extractDocumentLinks(content: SduiDocumentContent): SduiDocumentLink[] {
  const links: SduiDocumentLink[] = []

  walkDocumentBlocks(content, (block) => {
    extractBlockLinks(block).forEach((link) => {
      links.push({ blockId: block.id, ...link })
    })
  })

  return links
}
