import {
  createDocumentBlock,
  type SduiDocumentBlock,
  type SduiDocumentContent,
  type SduiInlineContent,
  type SduiInlineMark,
} from '@lodado/sdui-document'
import { SduiDocumentEditor } from '@lodado/sdui-document-react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof SduiDocumentEditor> = {
  title: 'Document/Keyboard Shortcuts',
  component: SduiDocumentEditor,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Keyboard shortcut guide, written as an sdui-document and rendered by the editor itself — ' +
          'every mark/block you see is real, so the guide doubles as a fixture. ' +
          'Checked items are implemented (Phase 24 shipped); unchecked items wait on missing features ' +
          '(comment system, list/code-fence/toggle/table block types) — see ' +
          '`docs/sdui-document-block-editor-plan.md` Phase 24. ' +
          'Source of truth for the Outline bindings: `shared/editor/marks/*`, `shared/editor/nodes/*`, ' +
          '`app/editor/extensions/Keys.ts` in the Outline repository.',
      },
    },
  },
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof SduiDocumentEditor>

/* ---------- fixture helpers (content + derived plain text in one call) ---------- */

const t = (value: string, ...marks: SduiInlineMark[]) =>
  marks.length ? ({ type: 'text', text: value, marks } as const) : ({ type: 'text', text: value } as const)

/** key combo rendered with the inline code mark, like Outline's help dialog */
const kbd = (combo: string) => t(combo, { type: 'code' })

const toPlainText = (content: SduiInlineContent): string =>
  content.map((node) => (node.type === 'text' ? node.text : '\n')).join('')

let sequence = 0
const nextId = (): string => {
  sequence += 1

  return `shortcut-${sequence}`
}

const block = (type: string, content: SduiInlineContent, attributes?: Record<string, unknown>): SduiDocumentBlock =>
  createDocumentBlock({
    id: nextId(),
    type,
    state: { content, text: toPlainText(content) },
    attributes,
  })

const heading = (level: number, ...content: SduiInlineContent) => block('document.heading', content, { level })
const paragraph = (...content: SduiInlineContent) => block('document.paragraph', content)
const callout = (style: string, ...content: SduiInlineContent) => block('document.callout', content, { style })
const item = (checked: boolean, ...content: SduiInlineContent) => block('document.checklist', content, { checked })
const divider = () => createDocumentBlock({ id: nextId(), type: 'document.divider' })

/* ---------------------------------- document ---------------------------------- */

const shortcutGuide: SduiDocumentContent = {
  schemaVersion: '1.0',
  root: createDocumentBlock({
    id: 'shortcut-root',
    type: 'document.root',
    children: [
      heading(
        1,
        t('키보드 단축키 가이드 — ', { type: 'bold' }),
        t('Outline parity', { type: 'bold' }, { type: 'highlight', attrs: { color: '#FDEA9B' } }),
      ),
      paragraph(
        t('Outline 에디터 소스 전수 조사 기반. 인라인 편집은 '),
        t('Outline 단축키 체계', { type: 'bold' }),
        t(', block 구조 조작은 '),
        t('Notion식 block selection 모드', { type: 'bold' }),
        t('로 이원화한다. 상세 플랜: '),
        t('docs/sdui-document-block-editor-plan.md · Phase 24', { type: 'code' }),
      ),
      callout(
        'info',
        t(
          '체크된 항목 = 구현 완료 (이 문서에서 바로 시험 가능). 빈 체크 = 선행 기능(코멘트, list/code-fence 블록) 대기.',
        ),
      ),
      divider(),

      /* 1. inline marks — handled inside the focused-block ProseMirror */
      heading(2, t('1. 인라인 마크 — PM 내부 처리')),
      paragraph(t('블록을 클릭해 편집 모드로 들어간 뒤 텍스트를 선택하고 눌러보세요.')),
      item(true, kbd('Mod-B'), t(' — '), t('굵게', { type: 'bold' })),
      item(true, kbd('Mod-I'), t(' — '), t('기울임', { type: 'italic' })),
      item(true, kbd('Mod-E'), t(' — '), t('인라인 코드', { type: 'code' })),
      item(true, kbd('Mod-D'), t(' — '), t('취소선', { type: 'strikethrough' }), t(' (Notion은 Cmd-Shift-S)')),
      item(true, kbd('Mod-U'), t(' — '), t('밑줄', { type: 'underline' })),
      item(
        true,
        kbd('Mod-Shift-H'),
        t(' — '),
        t('하이라이트', { type: 'highlight', attrs: { color: '#FDEA9B' } }),
        t(' (Outline 팔레트 첫 색)'),
      ),
      item(
        true,
        kbd('Mod-Z'),
        t(' / '),
        kbd('Mod-Y'),
        t(' / '),
        kbd('Mod-Shift-Z'),
        t(' — 실행취소 / 재실행 (focus 세션 단위)'),
      ),
      item(true, kbd('Mod-Shift-C'), t(' — 인라인 코드 대체 바인딩')),
      item(false, kbd('Mod-Alt-M'), t(' — 코멘트 마크. comment 시스템 없어 보류')),
      divider(),

      /* 2. markdown input rules */
      heading(2, t('2. Markdown input rules — 입력 즉시 변환')),
      paragraph(
        t('빈 블록 맨 앞에서 패턴을 입력하면 블록 타입이 바뀌고('),
        t('onTurnInto', { type: 'code' }),
        t(' 위임 → '),
        t('block.setType', { type: 'code' }),
        t(' patch), 마크 패턴은 PM 내부에서 즉시 적용된다.'),
      ),
      item(true, kbd('# '), t(' ~ '), kbd('#### '), t(' — heading 1~4')),
      item(true, kbd('[] '), t(' / '), kbd('[ ] '), t(' / '), kbd('[x] '), t(' — checklist ([x]는 checked)')),
      item(true, kbd('> '), t(' — callout (Notion에선 '), kbd('> '), t('가 toggle, quote는 '), kbd('" '), t(')')),
      item(true, kbd('~텍스트~'), t(' — '), t('취소선', { type: 'strikethrough' })),
      item(true, kbd('__텍스트__'), t(' — '), t('밑줄', { type: 'underline' })),
      item(true, kbd('==텍스트=='), t(' — '), t('하이라이트', { type: 'highlight', attrs: { color: '#FDEA9B' } })),
      item(true, kbd('**텍스트**'), t(' — '), t('굵게', { type: 'bold' })),
      item(true, kbd('*텍스트*'), t(' / '), kbd('_텍스트_'), t(' — '), t('기울임', { type: 'italic' })),
      item(true, kbd('`텍스트`'), t(' — '), t('인라인 코드', { type: 'code' })),
      item(true, kbd('---'), t(' — divider ('), kbd('*** '), t('는 page break)')),
      item(
        false,
        kbd('- '),
        t(' bullet / '),
        kbd('1. '),
        t(' ordered / '),
        kbd('``` '),
        t(' code fence / '),
        kbd('+++ '),
        t(' toggle / '),
        kbd('|--'),
        t(' table — 블록 타입 미구현, registry 슬롯만 예약'),
      ),
      divider(),

      /* 3. block boundary keys — delegated to the block layer */
      heading(2, t('3. 블록 경계 키 — keymap 위임 (PM → block layer)')),
      paragraph(
        t('구조를 바꾸는 키는 PM이 처리하지 않고 '),
        t('FocusedBlockCallbacks', { type: 'code' }),
        t('로 위임 → block layer가 patch 발행. PM은 block 구조를 절대 직접 변경하지 않는다.'),
      ),
      item(true, kbd('Enter'), t(' — 커서 위치에서 블록 분할 ('), t('block.split', { type: 'code' }), t(')')),
      item(true, kbd('Backspace'), t(' (offset 0) — 이전 블록과 병합 ('), t('block.merge', { type: 'code' }), t(')')),
      item(
        true,
        kbd('Tab'),
        t(' / '),
        kbd('Shift-Tab'),
        t(' — indent / outdent ('),
        t('block.move', { type: 'code' }),
        t(')'),
      ),
      item(true, kbd('Escape'), t(' — 인라인 편집 종료 → block selection 모드')),
      item(true, kbd('ArrowUp'), t(' / '), kbd('ArrowDown'), t(' — 첫/마지막 줄 경계에서 이웃 블록으로 포커스 이동')),
      item(
        true,
        kbd('Ctrl-Shift-0/1~4/7'),
        t(' — paragraph / h1~h4 / checklist로 turn-into ('),
        t('block.setType', { type: 'code' }),
        t(' patch)'),
      ),
      item(true, kbd('Mod-]'), t(' / '), kbd('Mod-['), t(' — Tab/Shift-Tab alias')),
      item(true, kbd('Mod-Alt-ArrowUp'), t(' / '), kbd('Mod-Alt-ArrowDown'), t(' — 블록을 형제 사이에서 위/아래 이동')),
      item(true, kbd('Shift-Enter'), t(' — hard break')),
      item(true, kbd('Mod-Enter'), t(' — 컨텍스트 액션: checklist 토글, link 열기(http/https만)')),
      divider(),

      /* 4. block selection mode — Notion-style */
      heading(2, t('4. Block selection 모드 — Notion식')),
      paragraph(
        t('focused block이 없는 상태의 키. React block layer('),
        t('handleSelectionKeyDown', { type: 'code' }),
        t(')가 처리한다.'),
      ),
      item(true, kbd('Escape'), t(' — 인라인 편집 → block selection → 선택 해제 체인')),
      item(
        true,
        kbd('Backspace'),
        t(' / '),
        kbd('Delete'),
        t(' — 선택 블록 삭제 ('),
        t('block.remove', { type: 'code' }),
        t(')'),
      ),
      item(true, kbd('ArrowUp'), t(' / '), kbd('ArrowDown'), t(' — 평탄화 순서로 selection 이동')),
      item(true, kbd('Enter'), t(' — 선택 블록 인라인 편집 진입, 커서는 끝 offset')),
      item(true, kbd('Mod-D'), t(' — 블록 복제(subtree + 새 id). 인라인 편집의 취소선과 모드로 분리되어 충돌 없음')),
      item(true, kbd('Mod-A'), t(' — 전체 블록 선택')),
      divider(),

      /* 5. Outline vs Notion */
      heading(2, t('5. Outline vs Notion — 무엇을 어느 쪽에서 가져왔나')),
      callout(
        'tip',
        t('인라인 포맷팅 = Outline 그대로, block 구조 조작 = Notion 방식.', { type: 'bold' }),
        t(
          ' Outline은 단일 ProseMirror 문서(모든 키가 한 keymap), Notion은 block 트리 + 모드 이원화. 이 에디터는 Notion형 아키텍처에 Outline 키맵을 이식한다.',
        ),
      ),
      item(
        true,
        t('Outline 채택 — 마크 바인딩('),
        kbd('Mod-D'),
        t(' 취소선, '),
        kbd('Mod-E'),
        t(' 코드), turn-into 번호 체계('),
        kbd('Ctrl-Shift-7'),
        t(' todo / '),
        kbd('8'),
        t(' bullet / '),
        kbd('9'),
        t(' ordered), 블록 이동 '),
        kbd('Mod-Alt-Arrow'),
      ),
      item(
        true,
        t('Notion 채택 — '),
        kbd('Escape'),
        t(' 블록 선택 체인, 방향키 selection 이동, '),
        kbd('Mod-D'),
        t(' duplicate, '),
        kbd('Mod-A'),
        t(' 단계 확장, 모든 블록 Tab 중첩(n-depth 트리)'),
      ),
      item(
        true,
        t('불채택 — Outline '),
        kbd('Mod-S'),
        t(' 저장 / '),
        kbd('Mod-Enter'),
        t(' save-and-exit: autosave 구조라 불필요'),
      ),
      paragraph(
        t('트리거 메뉴는 양쪽 동일: ', { type: 'italic' }),
        kbd('/'),
        t(' slash · ', { type: 'italic' }),
        kbd('@'),
        t(' mention · ', { type: 'italic' }),
        kbd(':'),
        t(' emoji — 별도 phase에서 진행.', { type: 'italic' }),
      ),
    ],
  }),
}

export const Guide: Story = {
  render: () => <SduiDocumentEditor content={shortcutGuide} />,
  parameters: {
    docs: {
      description: {
        story:
          'The full shortcut inventory as a live document. Section 1–2 are testable in place: ' +
          'click any block, select text, and press the combos. Sections 3–4 describe the ' +
          'delegation boundary (PM never mutates block structure; structural keys go through ' +
          '`FocusedBlockCallbacks` and land as patches). Unchecked checklists map 1:1 to ' +
          'Phase 24 sub-phases (24-B marks, 24-C turn-into, 24-D structure keys, ' +
          '24-E Mod-Enter actions, 24-F block selection keys).',
      },
    },
  },
}

export const ReadOnly: Story = {
  render: () => <SduiDocumentEditor content={shortcutGuide} readOnly />,
}
