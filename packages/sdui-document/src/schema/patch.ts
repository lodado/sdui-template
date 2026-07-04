import type { SduiDocumentBlock } from './block';
import type { SduiDocumentBlockId } from './ids';

export type SduiDocumentPatch =
  | {
      type: 'block.insert';
      parentId: SduiDocumentBlockId;
      index: number;
      block: SduiDocumentBlock;
    }
  | {
      type: 'block.update';
      blockId: SduiDocumentBlockId;
      state?: Record<string, unknown>;
      attributes?: Record<string, unknown>;
    }
  | {
      type: 'block.delete';
      blockId: SduiDocumentBlockId;
    }
  | {
      type: 'block.move';
      blockId: SduiDocumentBlockId;
      parentId: SduiDocumentBlockId;
      index: number;
    };
