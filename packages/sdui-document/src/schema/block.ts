import type { SduiDocumentBlockId } from './ids';

export type SduiDocumentBlockType =
  | 'document.root'
  | 'document.paragraph'
  | 'document.heading'
  | 'document.checklist'
  | 'document.divider'
  | 'document.callout'
  | 'document.image'
  | 'document.file'
  | 'document.link';

export type SduiDocumentBlock = {
  id: SduiDocumentBlockId;
  type: SduiDocumentBlockType | (string & {});
  state?: Record<string, unknown>;
  attributes?: Record<string, unknown>;
  children?: SduiDocumentBlock[];
};

export type CreateDocumentBlockInput = SduiDocumentBlock;

export function createDocumentBlock(input: CreateDocumentBlockInput): SduiDocumentBlock {
  return {
    ...input,
    state: input.state ? { ...input.state } : undefined,
    attributes: input.attributes ? { ...input.attributes } : undefined,
    children: input.children ? input.children.map(createDocumentBlock) : undefined,
  };
}
