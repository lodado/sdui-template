import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { createBlockId } from '../blocks/schema/ids'
import type { SduiLayoutLikeDocument, SduiLayoutLikeNode } from './toSduiLayout'

function realBlockChildren(node: SduiLayoutLikeNode): SduiLayoutLikeNode[] {
  return (node.children ?? []).filter((child) => typeof child.attributes?.['data-block-type'] === 'string')
}

function stripKeys(attrs: Record<string, unknown>, ...keys: string[]): Record<string, unknown> {
  return Object.keys(attrs)
    .filter((k) => !keys.includes(k))
    .reduce<Record<string, unknown>>((acc, k) => ({ ...acc, [k]: attrs[k] }), {})
}

function stateText(node: SduiLayoutLikeNode): string {
  return typeof node.state?.text === 'string' ? node.state.text : ''
}

function fromSduiNode(node: SduiLayoutLikeNode): SduiDocumentBlock {
  const blockType = String(node.attributes?.['data-block-type'] ?? 'document.paragraph')
  const id = createBlockId(node.id)
  const children = realBlockChildren(node).map(fromSduiNode)

  switch (blockType) {
    case 'document.root':
      return {
        id,
        type: 'document.root',
        children: children.length > 0 ? children : undefined,
      }

    case 'document.heading':
      return {
        id,
        type: 'document.heading',
        state: { text: stateText(node), level: node.state?.level },
        children: children.length > 0 ? children : undefined,
      }

    case 'document.checklist':
      return {
        id,
        type: 'document.checklist',
        state: { text: stateText(node), checked: node.state?.checked === true },
      }

    case 'document.divider':
      return { id, type: 'document.divider' }

    case 'document.callout': {
      const tone = node.attributes?.['data-tone']
      return {
        id,
        type: 'document.callout',
        state: { text: stateText(node) },
        attributes: tone !== undefined ? { tone } : undefined,
        children: children.length > 0 ? children : undefined,
      }
    }

    case 'document.link': {
      const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'rel', 'className')
      return {
        id,
        type: 'document.link',
        state: { text: stateText(node) },
        attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
      }
    }

    case 'document.image': {
      const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
      return {
        id,
        type: 'document.image',
        state: { text: stateText(node) },
        attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
      }
    }

    case 'document.file': {
      const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
      return {
        id,
        type: 'document.file',
        state: { text: stateText(node) },
        attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
      }
    }

    default: {
      const restAttribs = stripKeys(node.attributes ?? {}, 'data-block-type', 'className')
      return {
        id,
        type: blockType as SduiDocumentBlock['type'],
        state: { text: stateText(node) },
        attributes: Object.keys(restAttribs).length > 0 ? restAttribs : undefined,
        children: children.length > 0 ? children : undefined,
      }
    }
  }
}

export function fromSduiLayoutDocument(layout: SduiLayoutLikeDocument): SduiDocumentContent {
  return {
    schemaVersion: '1.0',
    root: fromSduiNode(layout.root),
  }
}
