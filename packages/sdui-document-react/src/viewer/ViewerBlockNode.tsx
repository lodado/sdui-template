import type { SduiDocumentBlock } from '@lodado/sdui-document'
import {
  COLLECTION_BLOCK_TYPE,
  COLUMN_BLOCK_TYPE,
  COLUMN_LIST_BLOCK_TYPE,
  resolveBlockAlign,
  TOGGLE_BLOCK_TYPE,
} from '@lodado/sdui-document'
import React from 'react'

import { BlockChrome } from '../block-types/BlockChrome'
import { blockInlineContent, isTextBlock, numberedListOrdinals } from '../editor/blockContent'
import { InlineContentView } from '../inline/InlineContentView'
import { attributeRatio, DRAG_INDENT_WIDTH } from '../shared/blockConstants'

// Static twin of the readOnly branch of ../editor/BlockNode.tsx (BlockRow).
// The DOM both emit must stay byte-identical — viewerParity.test.tsx compares
// outerHTML against <SduiDocumentEditor readOnly />. When editing the readOnly
// row markup there, mirror it here. This tree must never import ProseMirror,
// dnd-kit, or editor runtime modules (viewerImportGraph.test.tsx enforces it).

type ViewerBlockNodeProps = {
  block: SduiDocumentBlock
  depth: number
  listOrdinal?: number
}

/** Childless copy for BlockChrome — block types read children via DocumentContentContext, never `.children`. */
function rowBlock(block: SduiDocumentBlock): SduiDocumentBlock {
  const { children: _children, ...rest } = block

  return rest
}

const ViewerColumnContainers = ({ block, depth }: { block: SduiDocumentBlock; depth: number }) => {
  const children = block.children ?? []

  if (block.type === COLUMN_LIST_BLOCK_TYPE) {
    return (
      <div data-block-id={block.id} data-depth={depth} data-column-list>
        {children.map((child) => (
          // eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested nodes
          <ViewerBlockNode key={child.id} block={child} depth={depth} />
        ))}
      </div>
    )
  }

  const ratio = attributeRatio(block.attributes)

  return (
    <div data-block-id={block.id} data-column style={ratio !== undefined ? { flexGrow: ratio } : undefined}>
      {children.map((child) => (
        // eslint-disable-next-line no-use-before-define -- mutual recursion: containers render nested nodes
        <ViewerBlockNode key={child.id} block={child} depth={depth} />
      ))}
    </div>
  )
}

export const ViewerBlockNode = ({ block, depth, listOrdinal }: ViewerBlockNodeProps) => {
  if (block.type === COLUMN_LIST_BLOCK_TYPE || block.type === COLUMN_BLOCK_TYPE) {
    return <ViewerColumnContainers block={block} depth={depth} />
  }

  // eslint-disable-next-line no-use-before-define -- dispatch keeps hook usage inside the row component
  return <ViewerBlockRow block={block} depth={depth} listOrdinal={listOrdinal} />
}

const ViewerBlockRow = ({ block, depth, listOrdinal }: ViewerBlockNodeProps) => {
  const children = block.children ?? []

  // toggle collapse is ephemeral view state — never written back to content
  const isToggle = block.type === TOGGLE_BLOCK_TYPE
  // collection renders its page-item children itself (as cards/rows), not as block rows
  const isCollection = block.type === COLLECTION_BLOCK_TYPE
  const documentCollapsed = block.attributes?.collapsed === true
  const [collapsed, setCollapsed] = React.useState(documentCollapsed)

  React.useEffect(() => {
    if (isToggle) {
      setCollapsed(documentCollapsed)
    }
  }, [isToggle, documentCollapsed])

  const isCollapsedToggle = isToggle && collapsed
  const isExpandedEmptyToggle = isToggle && !isCollapsedToggle && children.length === 0
  const base = rowBlock(block)
  const chromeBlock = isToggle ? { ...base, attributes: { ...base.attributes, collapsed } } : base
  const onToggleCollapsed = isToggle ? (_blockId: string, next: boolean) => setCollapsed(next) : undefined

  const ordinals = numberedListOrdinals(children)

  return (
    <div data-block-id={block.id} data-depth={depth}>
      <div data-block-row>
        <div data-block-content data-align={resolveBlockAlign(block.attributes?.align)}>
          <BlockChrome
            block={chromeBlock}
            depth={depth}
            listOrdinal={listOrdinal}
            onToggleCollapsed={onToggleCollapsed}
          >
            {isTextBlock(block) && (
              <span className="sdui-doc-static" data-inline-root>
                <InlineContentView content={blockInlineContent(block)} />
              </span>
            )}
          </BlockChrome>
        </div>
      </div>
      {children.length > 0 && !isCollapsedToggle && !isCollection ? (
        <div data-block-nested data-nested-toggle={isToggle || undefined} style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          {children.map((child) => (
            <ViewerBlockNode key={child.id} block={child} depth={depth + 1} listOrdinal={ordinals.get(child.id)} />
          ))}
        </div>
      ) : null}
      {isExpandedEmptyToggle ? (
        <div data-block-nested data-nested-toggle style={{ paddingLeft: DRAG_INDENT_WIDTH }}>
          <button type="button" className="toggle-empty-placeholder" disabled>
            Empty toggle. Press Enter, click, or drop blocks inside.
          </button>
        </div>
      ) : null}
    </div>
  )
}
