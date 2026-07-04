import type { SduiDocumentBlock, SduiDocumentContent } from '../blocks/schema';

export type SduiDocumentBlockVisitor = (block: SduiDocumentBlock) => void;

function visitBlock(block: SduiDocumentBlock, visitor: SduiDocumentBlockVisitor): void {
  visitor(block);
  block.children?.forEach((child) => visitBlock(child, visitor));
}

export function walkDocumentBlocks(
  content: SduiDocumentContent,
  visitor: SduiDocumentBlockVisitor
): void {
  visitBlock(content.root, visitor);
}
