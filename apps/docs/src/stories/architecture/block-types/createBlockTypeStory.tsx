import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { type DeepDiveConfig, DeepDiveTemplate } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import type { BlockTypeDoc } from './blockRegistry'

export function blockTypeMeta(doc: BlockTypeDoc): Meta {
  return {
    title: `Document/Block Types/${doc.slug}`,
    parameters: {
      layout: 'fullscreen',
      docs: {
        description: {
          component: doc.lead,
        },
      },
    },
  }
}

function blockTypeConfig(doc: BlockTypeDoc): DeepDiveConfig {
  return {
    accent: 'core',
    kicker: 'Block Type · @lodado/sdui-document',
    title: doc.titleKo,
    lead: doc.lead,
    pills: doc.pills,
    sections: [
      {
        index: 'B.1',
        label: 'Module',
        title: 'SduiBlockTypeModule',
        blocks: [
          { kind: 'prose', body: doc.description },
          {
            kind: 'badges',
            items: [
              doc.type,
              `SDUI → ${doc.sduiNodeType}`,
              doc.menuInsertable ? 'menu-insertable' : 'drag / structural only',
              doc.canHostInlineText ? 'inline text ✓' : 'inline text ✗',
              doc.markdownSupport ? 'markdown ✓' : 'markdown ✗',
            ],
          },
          {
            kind: 'code',
            file: `packages/sdui-document/src/${doc.modulePath}`,
            code: [
              `type: '${doc.type}'`,
              doc.stateFields.length > 0 ? `state: { ${doc.stateFields.join(', ')} }` : 'state: (none)',
              doc.attributesFields.length > 0
                ? `attributes: { ${doc.attributesFields.join(', ')} }`
                : 'attributes: (none)',
              `canHostInlineText: ${doc.canHostInlineText}`,
              doc.menuInsertable ? 'createDefault: ✓' : 'createDefault: —',
              doc.markdownSupport ? 'toMarkdown: ✓' : 'toMarkdown: —',
            ].join('\n'),
          },
        ],
      },
      {
        index: 'B.2',
        label: 'Live',
        title: '렌더 미리보기',
        blocks: [
          {
            kind: 'prose',
            body: (
              <>
                아래는 <code>{doc.type}</code> 단독(또는 필요한 자식 포함) 샘플입니다. React 대응 모듈은{' '}
                <code>packages/sdui-document-react/src/block-types/</code> 에 있습니다.
              </>
            ),
          },
          {
            kind: 'demo',
            title: doc.slug,
            hint: doc.type,
            node: <EditorWithPatchLog content={doc.sampleContent} readOnly />,
          },
        ],
      },
    ],
  }
}

export function blockTypeStory(doc: BlockTypeDoc): StoryObj {
  return {
    name: doc.titleKo,
    render: () => <DeepDiveTemplate config={blockTypeConfig(doc)} />,
  }
}
