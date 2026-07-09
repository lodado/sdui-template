import type { SduiDocumentBlock } from '@lodado/sdui-document'
import { isSafeCtaUrl, resolveBlockAlign } from '@lodado/sdui-document'
import * as Popover from '@radix-ui/react-popover'
import React, { useState } from 'react'

import { blockText } from '../blockText'

export type ButtonEditor = {
  onSetLabel(blockId: string, label: string): void
  onSetAttrs(blockId: string, partial: Record<string, unknown>): void
}

const VARIANTS = ['primary', 'secondary', 'outline'] as const

function str(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

/**
 * CTA link styled as a button. Unsafe hrefs render inert. In edit mode a
 * settings popover edits the label, href, and variant.
 */
export const ButtonBlock = ({ block, editor }: { block: SduiDocumentBlock; editor?: ButtonEditor }) => {
  const href = str(block.attributes?.href)
  const variant = str(block.attributes?.variant) ?? 'primary'
  const align = resolveBlockAlign(block.attributes?.align)
  const label = blockText(block) || 'Button'
  const isLink = href !== undefined && isSafeCtaUrl(href)

  const [labelDraft, setLabelDraft] = useState(label)
  const [hrefDraft, setHrefDraft] = useState(href ?? '')

  const button = (
    <span className="sdui-doc-button" data-variant={variant} data-inert={!isLink || undefined}>
      <span className="sdui-doc-button-label">{label}</span>
    </span>
  )

  if (!editor) {
    return (
      <div className="sdui-doc-button-wrap" data-align={align} contentEditable={false}>
        {isLink ? (
          <a
            className="sdui-doc-button"
            data-variant={variant}
            href={href}
            target={href!.startsWith('mailto:') ? undefined : '_blank'}
            rel="noopener noreferrer"
          >
            <span className="sdui-doc-button-label">{label}</span>
          </a>
        ) : (
          button
        )}
      </div>
    )
  }

  return (
    <div className="sdui-doc-button-wrap" data-align={align} contentEditable={false}>
      <Popover.Root>
        <Popover.Trigger asChild>
          <button type="button" className="sdui-doc-button" data-variant={variant} aria-label="Edit button">
            <span className="sdui-doc-button-label">{label}</span>
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="sdui-doc-button-edit" sideOffset={6}>
            <span className="sdui-doc-button-field">
              <span>Label</span>
              <input
                aria-label="Button label"
                value={labelDraft}
                onChange={(event) => setLabelDraft(event.target.value)}
                onBlur={() => editor.onSetLabel(block.id, labelDraft)}
              />
            </span>
            <span className="sdui-doc-button-field">
              <span>Link (http / mailto)</span>
              <input
                aria-label="Button link"
                placeholder="https://…"
                value={hrefDraft}
                onChange={(event) => setHrefDraft(event.target.value)}
                onBlur={() => isSafeCtaUrl(hrefDraft) && editor.onSetAttrs(block.id, { href: hrefDraft })}
              />
            </span>
            <div className="sdui-doc-button-variants">
              {VARIANTS.map((option) => (
                <button
                  key={option}
                  type="button"
                  data-active={option === variant || undefined}
                  onClick={() => editor.onSetAttrs(block.id, { variant: option })}
                >
                  {option}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  )
}
