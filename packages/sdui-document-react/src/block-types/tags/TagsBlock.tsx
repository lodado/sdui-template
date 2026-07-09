import type { SduiDocumentBlock, TagItem } from '@lodado/sdui-document'
import { PROPERTY_COLORS } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'

export type TagsEditor = {
  onSetItems(blockId: string, items: TagItem[]): void
  generateId(): string
}

function readItems(block: SduiDocumentBlock): TagItem[] {
  return Array.isArray(block.attributes?.items) ? (block.attributes.items as TagItem[]) : []
}

/** Skill/tech chip row. Editable in edit mode: add via input, remove/recolor via chip. */
export const TagsBlock = ({ block, editor }: { block: SduiDocumentBlock; editor?: TagsEditor }) => {
  const items = readItems(block)
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const label = draft.trim()
    if (!label || !editor) {
      return
    }
    editor.onSetItems(block.id, [...items, { id: editor.generateId(), label }])
    setDraft('')
  }

  const removeTag = (id: string) =>
    editor?.onSetItems(
      block.id,
      items.filter((item) => item.id !== id),
    )
  const recolor = (id: string, color: TagItem['color']) =>
    editor?.onSetItems(
      block.id,
      items.map((item) => (item.id === id ? { ...item, color } : item)),
    )

  return (
    <div className="sdui-doc-tags" contentEditable={false}>
      {items.map((item) =>
        editor ? (
          <Popover.Root key={item.id}>
            <Popover.Trigger asChild>
              <button type="button" className="sdui-doc-chip" data-color={item.color ?? 'gray'}>
                {item.label}
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content className="sdui-doc-tags-edit" sideOffset={4}>
                <div className="sdui-doc-tags-colors">
                  {PROPERTY_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      aria-label={`Color ${color}`}
                      className="sdui-doc-chip"
                      data-color={color}
                      data-active={item.color === color || undefined}
                      onClick={() => recolor(item.id, color)}
                    >
                      A
                    </button>
                  ))}
                </div>
                <button type="button" className="sdui-doc-tags-remove" onClick={() => removeTag(item.id)}>
                  Remove
                </button>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        ) : (
          <span key={item.id} className="sdui-doc-chip" data-color={item.color ?? 'gray'}>
            {item.label}
          </span>
        ),
      )}
      {editor ? (
        <input
          aria-label="Add tag"
          className="sdui-doc-tags-input"
          placeholder="+ Tag"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              addTag()
            } else if (event.key === 'Backspace' && draft === '' && items.length > 0) {
              removeTag(items[items.length - 1].id)
            }
          }}
        />
      ) : null}
    </div>
  )
}
