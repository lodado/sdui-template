import type { SduiDocumentBlock, SduiDocumentContent } from '../schema';

export type SduiLayoutLikeNode = {
  id: string;
  type: string;
  state?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  children?: SduiLayoutLikeNode[];
};

export type SduiLayoutLikeDocument = {
  version: string;
  metadata?: {
    id?: string;
    name?: string;
  };
  root: SduiLayoutLikeNode;
};

export type ToSduiLayoutDocumentOptions = {
  documentId?: string;
  title?: string;
};

const OUTLINE = {
  accent: '#0366d6',
  background: '#FFFFFF',
  border: '#DAE1E9',
  brandBlue: '#3633FF',
  brandGreen: '#3ad984',
  danger: '#ed2651',
  noticeTip: '#f5be31',
  noticeWarning: '#d73a49',
  quote: '#DAE1E9',
  smoke: '#F4F7FA',
  smokeLight: '#F9FBFC',
  text: '#111319',
  textSecondary: '#394351',
  textTertiary: '#66778F',
};

const EDITOR_FONT = "font-[-apple-system,BlinkMacSystemFont,Inter,'Segoe_UI',Roboto,Oxygen,sans-serif]";
const BLOCK_RADIUS = 'rounded-[6px]';

function textChild(id: string, text: unknown, className?: string): SduiLayoutLikeNode {
  return {
    id,
    type: 'Span',
    state: { text: typeof text === 'string' ? text : '' },
    attributes: className ? { className } : undefined,
  };
}

function blockText(block: SduiDocumentBlock): string {
  return typeof block.state?.text === 'string' ? block.state.text : '';
}

function headingClassName(level: unknown): string {
  if (level === 1) {
    return 'block text-[28px] font-semibold leading-[1.2] text-[#111319]';
  }

  if (level === 2) {
    return 'block text-[22px] font-semibold leading-[1.25] text-[#111319]';
  }

  return 'block text-[18px] font-semibold leading-[1.3] text-[#111319]';
}

function mapChildren(block: SduiDocumentBlock): SduiLayoutLikeNode[] | undefined {
  // ponytail: recursive mapper; split only if dedicated block renderers need per-type modules.
  // eslint-disable-next-line no-use-before-define
  return block.children?.map(mapDocumentBlockToSduiNode);
}

function mapRoot(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: `mx-auto flex w-full max-w-[760px] flex-col gap-3 bg-[#FFFFFF] px-8 py-6 text-[#111319] ${EDITOR_FONT}`,
      ...block.attributes,
    },
    children: mapChildren(block),
  };
}

function mapHeading(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: { className: 'py-1' },
    children: [textChild(`${block.id}-text`, blockText(block), headingClassName(block.state?.level))],
  };
}

function mapChecklist(block: SduiDocumentBlock): SduiLayoutLikeNode {
  const checked = block.state?.checked === true;

  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: 'flex items-start gap-2 py-1 text-[16px] leading-[1.6]',
    },
    children: [
      textChild(
        `${block.id}-check`,
        checked ? '☑' : '☐',
        'mt-[1px] select-none text-[16px] leading-[1.6] text-[#66778F]'
      ),
      textChild(
        `${block.id}-text`,
        blockText(block),
        checked
          ? 'leading-[1.6] text-[#66778F] line-through'
          : 'leading-[1.6] text-[#111319]'
      ),
    ],
  };
}

function mapDivider(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: { className: 'my-3 h-px bg-[#DAE1E9]' },
  };
}

function noticeColorClass(tone: unknown): { background: string; border: string; icon: string } {
  if (tone === 'tip') {
    return { background: 'bg-[#f5be31]/10', border: 'border-[#f5be31]', icon: 'text-[#f5be31]' };
  }

  if (tone === 'warning') {
    return { background: 'bg-[#d73a49]/10', border: 'border-[#d73a49]', icon: 'text-[#d73a49]' };
  }

  if (tone === 'success') {
    return { background: 'bg-[#3ad984]/10', border: 'border-[#3ad984]', icon: 'text-[#3ad984]' };
  }

  return { background: 'bg-[#3633FF]/10', border: 'border-[#3633FF]', icon: 'text-[#3633FF]' };
}

function mapCallout(block: SduiDocumentBlock): SduiLayoutLikeNode {
  const color = noticeColorClass(block.attributes?.tone);

  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: `notice-block ${String(block.attributes?.tone ?? 'info')} flex gap-3 ${BLOCK_RADIUS} border-l-4 ${color.border} ${color.background} px-[10px] py-2 text-[#111319]`,
    },
    children: [
      textChild(`${block.id}-icon`, 'ⓘ', `w-6 shrink-0 text-center ${color.icon}`),
      textChild(`${block.id}-text`, blockText(block), 'content leading-[1.6]'),
      ...(mapChildren(block) ?? []),
    ],
  };
}

function mapLink(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) || String(block.attributes?.href ?? '') },
    attributes: {
      className: 'use-hover-preview cursor-pointer text-[#0366d6] hover:underline',
      rel: 'noopener noreferrer nofollow',
      ...block.attributes,
    },
  };
}

function mapImage(block: SduiDocumentBlock): SduiLayoutLikeNode {
  const alt = blockText(block) || String(block.attributes?.alt ?? 'Image');

  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: `image ${BLOCK_RADIUS} border border-[#DAE1E9] bg-[#F9FBFC] p-3`,
      ...block.attributes,
    },
    children: [
      textChild(`${block.id}-label`, alt, 'block text-[14px] leading-[1.5] text-[#394351]'),
      textChild(
        `${block.id}-caption`,
        String(block.attributes?.src ?? 'image source pending'),
        'caption block pt-1 text-[13px] leading-[1.4] text-[#66778F]'
      ),
    ],
  };
}

function mapFile(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: `attachment ${BLOCK_RADIUS} flex items-center gap-3 border border-[#DAE1E9] bg-[#F4F7FA] px-3 py-2 text-[#111319]`,
      ...block.attributes,
    },
    children: [
      textChild(`${block.id}-icon`, '▣', 'text-[#66778F]'),
      textChild(`${block.id}-title`, blockText(block) || String(block.attributes?.title ?? 'Attachment'), 'leading-[1.5]'),
      textChild(
        `${block.id}-size`,
        String(block.attributes?.size ?? ''),
        'text-[13px] leading-[1.5] text-[#66778F]'
      ),
    ],
  };
}

function mapTextBlock(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) },
    attributes: {
      className: 'block text-[16px] leading-[1.6] text-[#111319]',
      ...block.attributes,
    },
  };
}

export function mapDocumentBlockToSduiNode(block: SduiDocumentBlock): SduiLayoutLikeNode {
  switch (block.type) {
    case 'document.root':
      return mapRoot(block);
    case 'document.heading':
      return mapHeading(block);
    case 'document.checklist':
      return mapChecklist(block);
    case 'document.divider':
      return mapDivider(block);
    case 'document.callout':
      return mapCallout(block);
    case 'document.link':
      return mapLink(block);
    case 'document.image':
      return mapImage(block);
    case 'document.file':
      return mapFile(block);
    case 'document.paragraph':
    default:
      return mapTextBlock(block);
  }
}

export function toSduiLayoutDocument(
  content: SduiDocumentContent,
  options: ToSduiLayoutDocumentOptions = {}
): SduiLayoutLikeDocument {
  return {
    version: '1.0.0',
    metadata: {
      id: options.documentId,
      name: options.title,
    },
    root: mapDocumentBlockToSduiNode(content.root),
  };
}
