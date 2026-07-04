import type { SduiDocumentContent } from '../schema';
import { walkDocumentBlocks } from './walkBlocks';

export function extractPlainText(content: SduiDocumentContent): string {
  const lines: string[] = [];

  walkDocumentBlocks(content, (block) => {
    const text = block.state?.text;
    if (typeof text === 'string' && text.length > 0) {
      lines.push(text);
    }
  });

  return lines.join('\n');
}
