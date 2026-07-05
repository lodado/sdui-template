import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { BadgeRow, DocHero, DocPage, DocSection, Prose } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { allBlocksContent } from '../demos/sampleContents'
import { BLOCK_TYPE_DOCS } from './blockRegistry'
import { BLOCK_TYPE_COUNT, CONTENT_BLOCK_TYPE_LABELS } from './blockTypeList'

const meta: Meta = {
  title: 'Document/Block Types/0. Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `@lodado/sdui-document 블록 타입 ${BLOCK_TYPE_COUNT}종 — 타입별 SduiBlockTypeModule과 Storybook 문서.`,
      },
    },
  },
}

export default meta
type Story = StoryObj

export const Overview: Story = {
  name: '블록 타입 개요',
  render: () => (
    <DocPage accent="core">
      <DocHero
        kicker="Block Types · @lodado/sdui-document"
        title={`블록 타입 ${BLOCK_TYPE_COUNT}종`}
        lead="각 타입은 packages/sdui-document/src/block-types/<name>/ 에 SduiBlockTypeModule로 콜로케이션됩니다. 사이드바의 Document/Block Types/* 에서 타입별 상세 문서를 확인하세요."
        pills={['SduiBlockTypeModule', 'strategy registry', `${CONTENT_BLOCK_TYPE_LABELS.length} menu-insertable`]}
      />

      <DocSection index="0.1" label="Registry" title="등록된 타입">
        <Prose>
          <p>
            <code>BLOCK_TYPE_MODULES</code> 레지스트리와 1:1 대응합니다. root·columnList·column 은 구조 전용(슬래시 메뉴
            없음)이고, 나머지 {CONTENT_BLOCK_TYPE_LABELS.length}종은 <code>createDefault</code> + 마크다운 직렬화를
            제공합니다.
          </p>
        </Prose>
        <BadgeRow items={BLOCK_TYPE_DOCS.map((doc) => doc.type.replace('document.', ''))} />
      </DocSection>

      <DocSection index="0.2" label="Live" title="전체 타입 한 문서">
        <Prose>
          <p>아래 샘플은 등록된 모든 렌더 타입을 한 문서에 담습니다.</p>
        </Prose>
        <EditorWithPatchLog content={allBlocksContent} readOnly />
      </DocSection>
    </DocPage>
  ),
}
