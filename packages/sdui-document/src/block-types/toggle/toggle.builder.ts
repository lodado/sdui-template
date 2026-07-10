import type { CreateDocumentBlockInput } from '../../blocks/schema/block'
import type { SduiInlineContent } from '../../blocks/schema/inline'
import { inlineState } from '../../content/inlineBuilders'
import { nextBlockId } from '../authoring/blockId'
import { TOGGLE_BLOCK_TYPE } from './toggle.type'

export type ToggleBuilderOptions = { id?: string; collapsed?: boolean }

/** Author a toggle: always-visible summary + collapsible children. */
export function toggle(
  content: string | SduiInlineContent,
  children: CreateDocumentBlockInput[] = [],
  { id, collapsed }: ToggleBuilderOptions = {},
): CreateDocumentBlockInput {
  return {
    id: id ?? nextBlockId('toggle'),
    type: TOGGLE_BLOCK_TYPE,
    state: typeof content === 'string' ? { text: content } : inlineState(content),
    ...(collapsed !== undefined ? { attributes: { collapsed } } : {}),
    ...(children.length > 0 ? { children } : {}),
  }
}
