import { createBlockId } from '../../blocks/schema/ids'
import { blockModuleByType, canHostInlineText, SDUI_BLOCK_TYPE } from '../index'
import { isSduiBlock, sduiBlockModule } from '../sdui/sdui'
import { sduiAttributesSchema } from '../sdui/sdui.schema'

const LAYOUT_DOC = {
  version: '1.0',
  root: { id: 'w-root', type: 'Card', children: [{ id: 'w-text', type: 'Text', state: { text: 'hi' } }] },
}

describe('sdui block module', () => {
  test('registered in the registry under document.sdui', () => {
    expect(blockModuleByType[SDUI_BLOCK_TYPE]).toBe(sduiBlockModule)
  })

  test('createDefault produces a minimal valid layout document envelope', () => {
    const block = sduiBlockModule.createDefault(createBlockId('s1'))

    expect(block.type).toBe(SDUI_BLOCK_TYPE)
    expect(sduiAttributesSchema.safeParse(block.attributes).success).toBe(true)
  })

  test('attributesSchema accepts a layout document and rejects a missing root', () => {
    expect(sduiAttributesSchema.safeParse({ document: LAYOUT_DOC }).success).toBe(true)
    expect(sduiAttributesSchema.safeParse({ document: { version: '1.0' } }).success).toBe(false)
    expect(sduiAttributesSchema.safeParse({}).success).toBe(false)
  })

  test('toSduiNode/fromSduiNode round-trip preserves the embedded document', () => {
    const block = { id: createBlockId('s2'), type: SDUI_BLOCK_TYPE, attributes: { document: LAYOUT_DOC } }
    const node = sduiBlockModule.toSduiNode(block, { theme: { paragraph: 'p' } } as never)
    const back = sduiBlockModule.fromSduiNode(node, { id: block.id } as never)

    expect(node.attributes?.['data-block-type']).toBe(SDUI_BLOCK_TYPE)
    expect(back.attributes?.document).toEqual(LAYOUT_DOC)
    expect(isSduiBlock(back)).toBe(true)
  })

  test('cannot host inline text and has a markdown label', () => {
    const block = { id: createBlockId('s3'), type: SDUI_BLOCK_TYPE, attributes: { document: LAYOUT_DOC } }

    expect(canHostInlineText(block)).toBe(false)
    expect(sduiBlockModule.toMarkdown(block, {} as never)).toBe('[sdui:Card]')
  })
})
