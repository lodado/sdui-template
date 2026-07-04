import { blockText } from '../blocks/code/blockGuards'
import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema'
import { type BlockMapperTheme, outlineTheme } from './theme'

export type SduiLayoutLikeNode = {
  id: string
  type: string
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiLayoutLikeNode[]
}

export type SduiLayoutLikeDocument = {
  version: string
  metadata?: {
    id?: string
    name?: string
  }
  root: SduiLayoutLikeNode
}

export type ToSduiLayoutDocumentOptions = {
  documentId?: string
  title?: string
  theme?: BlockMapperTheme
}

const ALLOWED_HREF_SCHEMES = new Set(['http:', 'https:', 'mailto:', 'tel:'])

function sanitizeHref(href: unknown): string | undefined {
  if (typeof href !== 'string') {
    return undefined
  }

  try {
    const url = new URL(href)
    return ALLOWED_HREF_SCHEMES.has(url.protocol) ? href : undefined
  } catch {
    if (/^javascript:/i.test(href) || /^data:/i.test(href)) {
      return undefined
    }
    return href
  }
}

function textChild(id: string, text: unknown, className?: string): SduiLayoutLikeNode {
  return {
    id,
    type: 'Span',
    state: { text: typeof text === 'string' ? text : '' },
    attributes: className ? { className } : undefined,
  }
}

function resolveHeadingClassName(level: unknown, theme: BlockMapperTheme): string {
  if (level === 1) return theme.heading.level1
  if (level === 2) return theme.heading.level2
  return theme.heading.level3
}

function mapChildren(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode[] | undefined {
  // ponytail: recursive mapper; split only if dedicated block renderers need per-type modules.
  // eslint-disable-next-line no-use-before-define
  return block.children?.map((child) => mapDocumentBlockToSduiNode(child, theme))
}

function mapRoot(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const { background, textColor, maxWidth } = theme.root
  return {
    id: block.id,
    type: 'Div',
    attributes: {
      'data-block-type': 'document.root',
      className: `mx-auto flex w-full max-w-[${maxWidth}] flex-col gap-3 bg-[${background}] px-8 py-6 text-[${textColor}] ${theme.fontStack}`,
      ...block.attributes,
    },
    children: mapChildren(block, theme),
  }
}

function mapHeading(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    state: { text: blockText(block), level: block.state?.level },
    attributes: { 'data-block-type': 'document.heading', className: theme.heading.wrapper },
    children: [textChild(`${block.id}-text`, blockText(block), resolveHeadingClassName(block.state?.level, theme))],
  }
}

function mapChecklist(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const checked = block.state?.checked === true
  const t = theme.checklist

  return {
    id: block.id,
    type: 'Div',
    state: { text: blockText(block), checked },
    attributes: { 'data-block-type': 'document.checklist', className: t.wrapper },
    children: [
      textChild(`${block.id}-check`, checked ? t.checkOn : t.checkOff, t.checkColor),
      textChild(`${block.id}-text`, blockText(block), checked ? t.textOn : t.textOff),
    ],
  }
}

function mapDivider(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: { 'data-block-type': 'document.divider', className: theme.divider },
  }
}

function mapCallout(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const tone = String(block.attributes?.tone ?? theme.callout.defaultTone)
  const colors = theme.callout.toneColors[tone] ?? theme.callout.toneColors[theme.callout.defaultTone]

  return {
    id: block.id,
    type: 'Div',
    state: { text: blockText(block) },
    attributes: {
      'data-block-type': 'document.callout',
      'data-tone': tone,
      className: `notice-block ${tone} ${theme.callout.base} ${theme.radius} border-l-4 ${colors.border} ${colors.background} px-[10px] py-2 text-[#111319]`,
    },
    children: [
      textChild(`${block.id}-icon`, 'ⓘ', `w-6 shrink-0 text-center ${colors.icon}`),
      textChild(`${block.id}-text`, blockText(block), 'content leading-[1.6]'),
      ...(mapChildren(block, theme) ?? []),
    ],
  }
}

function mapLink(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const safeHref = sanitizeHref(block.attributes?.href)

  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) || safeHref || '' },
    attributes: {
      className: theme.link,
      ...block.attributes,
      // sanitized href, rel, and data-block-type override any values from block.attributes
      'data-block-type': 'document.link',
      href: safeHref,
      rel: 'noopener noreferrer nofollow',
    },
  }
}

function mapImage(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const alt = blockText(block) || String(block.attributes?.alt ?? 'Image')
  const t = theme.image

  return {
    id: block.id,
    type: 'Div',
    state: { text: blockText(block) },
    attributes: {
      'data-block-type': 'document.image',
      className: `image ${theme.radius} border border-[#DAE1E9] bg-[#F9FBFC] ${t.wrapper}`,
      ...block.attributes,
    },
    children: [
      textChild(`${block.id}-label`, alt, t.labelClassName),
      textChild(`${block.id}-caption`, String(block.attributes?.src ?? 'image source pending'), t.captionClassName),
    ],
  }
}

function mapFile(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  const t = theme.file

  return {
    id: block.id,
    type: 'Div',
    state: { text: blockText(block) },
    attributes: {
      'data-block-type': 'document.file',
      className: `attachment ${theme.radius} border border-[#DAE1E9] bg-[#F4F7FA] ${t.wrapper}`,
      ...block.attributes,
    },
    children: [
      textChild(`${block.id}-icon`, '▣', t.iconClassName),
      textChild(
        `${block.id}-title`,
        blockText(block) || String(block.attributes?.title ?? 'Attachment'),
        t.titleClassName,
      ),
      textChild(`${block.id}-size`, String(block.attributes?.size ?? ''), t.sizeClassName),
    ],
  }
}

function mapTextBlock(block: SduiDocumentBlock, theme: BlockMapperTheme): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) },
    attributes: {
      'data-block-type': block.type,
      className: theme.paragraph,
      ...block.attributes,
    },
  }
}

export function mapDocumentBlockToSduiNode(
  block: SduiDocumentBlock,
  theme: BlockMapperTheme = outlineTheme,
): SduiLayoutLikeNode {
  switch (block.type) {
    case 'document.root':
      return mapRoot(block, theme)
    case 'document.heading':
      return mapHeading(block, theme)
    case 'document.checklist':
      return mapChecklist(block, theme)
    case 'document.divider':
      return mapDivider(block, theme)
    case 'document.callout':
      return mapCallout(block, theme)
    case 'document.link':
      return mapLink(block, theme)
    case 'document.image':
      return mapImage(block, theme)
    case 'document.file':
      return mapFile(block, theme)
    case 'document.paragraph':
    default:
      return mapTextBlock(block, theme)
  }
}

export function toSduiLayoutDocument(
  content: SduiDocumentContent,
  options: ToSduiLayoutDocumentOptions = {},
): SduiLayoutLikeDocument {
  const theme = options.theme ?? outlineTheme

  return {
    version: '1.0.0',
    metadata: {
      id: options.documentId,
      name: options.title,
    },
    root: mapDocumentBlockToSduiNode(content.root, theme),
  }
}
