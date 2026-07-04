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
    return 'text-3xl font-bold tracking-tight text-slate-950';
  }

  if (level === 2) {
    return 'text-2xl font-semibold tracking-tight text-slate-900';
  }

  return 'text-xl font-semibold text-slate-900';
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
      className: 'mx-auto flex max-w-3xl flex-col gap-4 rounded-xl bg-white p-8 text-slate-900 shadow-sm ring-1 ring-slate-200',
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
      className: 'flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2',
    },
    children: [
      textChild(`${block.id}-check`, checked ? '☑' : '☐', 'select-none text-base leading-6 text-slate-500'),
      textChild(
        `${block.id}-text`,
        blockText(block),
        checked ? 'leading-6 text-slate-500 line-through' : 'leading-6 text-slate-800'
      ),
    ],
  };
}

function mapDivider(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: { className: 'my-2 h-px bg-slate-200' },
  };
}

function mapCallout(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Div',
    attributes: {
      className: 'rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-blue-950',
    },
    children: [textChild(`${block.id}-text`, blockText(block), 'leading-6')],
  };
}

function mapLink(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) || String(block.attributes?.href ?? '') },
    attributes: {
      className: 'inline-flex rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-700 ring-1 ring-indigo-200',
      ...block.attributes,
    },
  };
}

function mapTextBlock(block: SduiDocumentBlock): SduiLayoutLikeNode {
  return {
    id: block.id,
    type: 'Span',
    state: { text: blockText(block) },
    attributes: {
      className: 'leading-7 text-slate-700',
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
