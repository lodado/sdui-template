import type { SduiDocumentContent } from '../blocks/schema';
import { walkDocumentBlocks } from './walkBlocks';

export type SduiDocumentLink = {
  blockId: string;
  targetDocumentId?: string;
  href?: string;
};

export function extractDocumentLinks(content: SduiDocumentContent): SduiDocumentLink[] {
  const links: SduiDocumentLink[] = [];

  walkDocumentBlocks(content, (block) => {
    if (block.type !== 'document.link') {
      return;
    }

    const targetDocumentId = block.attributes?.targetDocumentId;
    const href = block.attributes?.href;

    links.push({
      blockId: block.id,
      targetDocumentId: typeof targetDocumentId === 'string' ? targetDocumentId : undefined,
      href: typeof href === 'string' ? href : undefined,
    });
  });

  return links;
}
