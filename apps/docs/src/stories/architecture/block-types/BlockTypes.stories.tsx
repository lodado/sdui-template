import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

import { BadgeRow, DocHero, DocPage, DocSection, Prose } from '../components'
import { EditorWithPatchLog } from '../demos/EditorWithPatchLog'
import { allBlocksContent } from '../demos/sampleContents'
import { BLOCK_TYPE_DOCS } from './blockRegistry'
import { BLOCK_TYPE_COUNT, CONTENT_BLOCK_TYPE_LABELS } from './blockTypeList'
import { blockTypeStory } from './createBlockTypeStory'

/** CSF default export must be a static object literal — Storybook cannot index `export default fn()`. */
const meta: Meta = {
  title: 'Document/Block Types',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `@lodado/sdui-document 블록 타입 ${BLOCK_TYPE_COUNT}종 — 타입별 SduiBlockTypeModule 문서.`,
      },
    },
  },
}

export default meta
type Story = StoryObj

function docBySlug(slug: string) {
  const doc = BLOCK_TYPE_DOCS.find((entry) => entry.slug === slug)
  if (!doc) throw new Error(`Missing block doc: ${slug}`)
  return doc
}

export const Overview: Story = {
  name: '0. Overview',
  render: () => (
    <DocPage accent="core">
      <DocHero
        kicker="Block Types · @lodado/sdui-document"
        title={`블록 타입 ${BLOCK_TYPE_COUNT}종`}
        lead="각 타입은 packages/sdui-document/src/block-types/<name>/ 에 SduiBlockTypeModule로 콜로케이션됩니다. 아래 스토리에서 타입별 상세 문서를 확인하세요."
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
        <BadgeRow items={BLOCK_TYPE_DOCS.map((entry) => entry.type.replace('document.', ''))} />
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

export const Root: Story = blockTypeStory(docBySlug('Root'))
export const Paragraph: Story = blockTypeStory(docBySlug('Paragraph'))
export const Heading: Story = blockTypeStory(docBySlug('Heading'))
export const BulletedList: Story = blockTypeStory(docBySlug('Bulleted List'))
export const NumberedList: Story = blockTypeStory(docBySlug('Numbered List'))
export const Checklist: Story = blockTypeStory(docBySlug('Checklist'))
export const Divider: Story = blockTypeStory(docBySlug('Divider'))
export const Callout: Story = blockTypeStory(docBySlug('Callout'))
export const Quote: Story = blockTypeStory(docBySlug('Quote'))
export const Toggle: Story = blockTypeStory(docBySlug('Toggle'))
export const Code: Story = blockTypeStory(docBySlug('Code'))
export const Image: Story = blockTypeStory(docBySlug('Image'))
export const File: Story = blockTypeStory(docBySlug('File'))
export const Link: Story = blockTypeStory(docBySlug('Link'))
export const ColumnList: Story = blockTypeStory(docBySlug('Column List'))
export const Column: Story = blockTypeStory(docBySlug('Column'))
