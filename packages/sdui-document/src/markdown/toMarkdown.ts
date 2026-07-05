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

const markdownContext: BlockToMarkdownContext = {
  inline: blockInline,
  renderChildren(block) {
    return (
      (block.children ?? [])
        // eslint-disable-next-line no-use-before-define
        .map(renderBlock)
        .filter((md) => md.length > 0)
        .join('\n\n')
    )
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
