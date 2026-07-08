import type { BlockToMarkdownContext } from '../block-types'
import { blockModuleByType, paragraphBlockModule } from '../block-types'
import type { SduiDocument, SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import type { SduiInlineContent } from '../blocks/schema/inline'
import { inlineContentToMarkdown } from './inlineToMarkdown'

function blockInline(block: SduiDocumentBlock): string {
  const content = block.state?.content
  if (Array.isArray(content)) {
    return inlineContentToMarkdown(content as SduiInlineContent)
  }
  return typeof block.state?.text === 'string' ? block.state.text : ''
}

/**
 * Blocks that serialize as markdown list items — adjacent ones join with a
 * single newline (tight list). The fact lives on each block-type module
 * (`isListItem`), not a second hardcoded set here.
 */
function isListItemBlock(block: SduiDocumentBlock): boolean {
  return blockModuleByType[block.type]?.isListItem ?? false
}

const markdownContext: BlockToMarkdownContext = {
  inline: blockInline,
  renderChildren(block) {
    const rendered = (block.children ?? [])
      // eslint-disable-next-line no-use-before-define
      .map((child) => ({ child, md: renderBlock(child) }))
      .filter((entry) => entry.md.length > 0)

    return rendered.reduce((joined, entry, index) => {
      if (index === 0) {
        return entry.md
      }

      const separator = isListItemBlock(rendered[index - 1].child) && isListItemBlock(entry.child) ? '\n' : '\n\n'
      return `${joined}${separator}${entry.md}`
    }, '')
  },
}

function renderBlock(block: SduiDocumentBlock): string {
  const blockModule = blockModuleByType[block.type] ?? paragraphBlockModule
  const toMarkdown = blockModule.toMarkdown ?? paragraphBlockModule.toMarkdown
  // paragraph (fallback) always defines toMarkdown, so this is always callable
  return toMarkdown ? toMarkdown(block, markdownContext) : blockInline(block)
}

/**
 * Serialize document content to a markdown string. Each block owns its own
 * markdown via `module.toMarkdown` (colocated in `<name>.markdown.ts`);
 * unknown types fall back to the paragraph module.
 */
export function sduiDocumentContentToMarkdown(content: SduiDocumentContent): string {
  return renderBlock(content.root)
}

/** Serialize a full document — its title as an h1 (when present) plus the content. */
export function sduiDocumentToMarkdown(document: SduiDocument): string {
  const body = sduiDocumentContentToMarkdown(document.content)
  const title = document.title?.trim()
  return title ? [`# ${title}`, body].filter((part) => part.length > 0).join('\n\n') : body
}
