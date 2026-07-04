# SDUI 기반 Notion형 Block Document Editor 구현 플랜

- 상태: Active (2026-07-04 하이브리드 방향으로 업데이트)
- 대상 레포: `sdui-template`
- 목표 패키지: `packages/sdui-document`
- 방향: block 구조(outline)는 `sdui-document`/`sdui-template`가 소유하고, block 내부 inline rich text에만 ProseMirror를 사용하는 하이브리드 notion형 outline editor
- 비목표: Notion 완전 복제, 전체 문서를 단일 ProseMirror doc으로 관리, ProseMirror view 로직의 React 재구현, Yjs character-level collaboration 초기 구현

---

## 0. 방향 업데이트 (2026-07-04): 하이브리드 결정

### 0.1 결정

기존 플랜의 "ProseMirror 도입하지 않음"을 다음으로 교체한다.

```text
block tree / patch / drag / permission / autosave  → sdui-document (기존 그대로, 변경 없음)
block 렌더링(비포커스 상태 전부)                     → sdui-template + React
포커스된 text block 1개의 inline 텍스트 편집         → ProseMirror (inline 전용 schema)
```

- ProseMirror를 문서 전체 엔진으로 쓰지 않는다. 단일 PM doc로 가면 PM이 source of truth가 되어 이미 구현한 `blockPatch`/`documentTree`/`dragHelpers`/`autosaveMachine`이 PM doc의 projection으로 강등되고, `sdui-template`의 node-level subscription 렌더링도 무력화된다.
- ProseMirror 로직을 React로 재구현하지 않는다. PM의 핵심 가치는 schema/transaction이 아니라 `prosemirror-view`의 contentEditable ↔ model 동기화 계층(IME/composition, selection normalization, MutationObserver 기반 DOM diff, browser별 워크어라운드)이다. 이 계층은 React reconciliation과 DOM 소유권이 충돌하는 성질의 코드라 이식이 불가능에 가깝고, 재구현 시 한글 조합 입력부터 깨진다.
- 기존 headless core(Milestone 1~2 완료분)는 전부 유효하다. 폐기되는 것은 Phase 10의 "block별 textarea/input 편집" 방식 하나다.

### 0.2 편집 엔진 경계 (React ↔ ProseMirror ↔ 직접 DOM)

소유권 지도:

| 관심사                                                           | 소유 계층                          | 비고                                                                                |
| ---------------------------------------------------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| block tree 구조, 순서, depth                                     | `sdui-document` (patch engine)     | source of truth                                                                     |
| block 렌더링 (비포커스)                                          | React (`sdui-template` renderer)   | inline JSON을 순수 React span으로 렌더. PM 불필요                                   |
| block chrome (drag handle, indent guide, checkbox, callout icon) | React                              |                                                                                     |
| drag & drop (n-depth 포함)                                       | React (dnd-kit 등) + `dragHelpers` | PM 관여 없음                                                                        |
| block selection (여러 block 선택 모드)                           | React                              | Notion식 block selection layer                                                      |
| slash menu, toolbar, presence UI                                 | React                              |                                                                                     |
| 포커스된 block 내부 텍스트 입력/IME/caret/inline mark            | ProseMirror                        | 문서당 PM 인스턴스 1개, 포커스된 block에만 마운트                                   |
| paste (inline 텍스트)                                            | ProseMirror                        | block 단위 paste는 React 층에서 patch로 처리                                        |
| 직접 DOM 조작                                                    | 최소 2곳만 허용                    | ① block 간 caret 이동 시 goal-column 측정(`coordsAtPos`) ② drop indicator 위치 계산 |

경계를 넘는 이벤트는 전부 "PM keymap이 가로채서 block 층에 위임"으로 통일한다:

| 입력 이벤트 (PM 내부에서 발생)          | 처리                                                                    |
| --------------------------------------- | ----------------------------------------------------------------------- |
| Enter                                   | PM이 소비하지 않음 → `block.split` patch 생성, 새 block으로 포커스 이동 |
| Backspace (block 맨 앞)                 | `block.merge` patch → 이전 block과 병합, caret은 병합 지점              |
| Tab / Shift-Tab                         | `block.move` patch (indent/outdent)                                     |
| ArrowUp (첫 줄) / ArrowDown (마지막 줄) | 이웃 block으로 포커스 전환 + goal-column 유지                           |
| `# `, `- `, `[] `, `1. ` inputrule      | block type 변경 patch (`block.update` 또는 replace)                     |
| 텍스트 입력/inline mark/조합 입력       | PM이 전부 소비. block 층 관여 금지 (IME 안전)                           |
| 여러 block에 걸친 selection 시도        | PM selection 해제 → React block selection mode 진입                     |

핵심 규칙: **ProseMirror는 block 밖을 절대 모른다. block 층은 PM 내부 텍스트 상태를 절대 직접 조작하지 않는다.** 통신은 (a) 마운트 시 inline JSON 주입, (b) commit 시 inline JSON + plain text 회수, (c) keymap 위임 콜백 — 이 3개 통로뿐이다.

### 0.3 inline content 모델

```ts
// block.state 확장
state: {
  content?: SduiInlineNode[];  // PM 호환 inline node JSON (text + marks + hard_break + mention 등)
  text?: string;               // content에서 파생된 plain text (검색/SSR/fallback용, commit 시 함께 갱신)
}
```

- 비포커스 block: `state.content`를 React가 직접 span/strong/a 태그로 렌더 (PM 불필요 → 1000개 block이어도 PM 인스턴스 1개).
- 포커스 block: `state.content` → PM doc 생성 → 편집 → blur/debounce 시 `block.update` patch로 커밋.
- `content/plainText.ts`의 추출 로직은 `state.text` 우선, 없으면 `state.content` walk로 확장한다.

### 0.4 n-depth drag & drop 검증

**결론: 가능. 이미 기반이 맞게 설계되어 있고, 하이브리드와 충돌 없음.** DnD는 전적으로 React/block 층 관심사라 PM 도입과 직교한다.

이미 확보된 것 (`drag/dragHelpers.ts`):

- `flattenDocumentBlocks` — n-depth tree를 depth 포함 flat list로 투영 (dnd-kit sortable 입력 형태)
- `createNestedBlockMovePatch` — before/inside/after 3-position drop → `block.move` patch, same-parent index 보정 포함
- patch engine의 cycle 방지 (자기 자신/descendant 아래로 move 금지) — subtree째 드래그해도 안전
- `block.move`는 children을 통째로 옮기므로 n-depth subtree 이동이 patch 1개

남은 작업 (Phase 18):

- **depth projection**: 드래그 중 pointer의 수평 offset으로 목표 depth를 계산해 before/after/inside를 결정 (dnd-kit 공식 nested sortable 패턴). 현재 helper는 position을 입력으로 받으므로 projection 계산기만 추가하면 됨.
- collapsed subtree: 접힌 block 드래그 시 descendants를 overlay에서 숨기고 drop 대상에서 제외
- drop indicator 렌더링 (depth 시각화 포함), auto-scroll
- 드래그 중 포커스된 block이 있으면 PM commit 후 unmount (드래그 중 편집 상태 금지)

### 0.5 실시간 편집 검증

**결론: 단계적으로 가능. 하이브리드가 오히려 유리하다.** block이 곧 충돌 단위라서 협업 granularity가 자연스럽게 잡힌다.

| 단계         | 범위                                | 메커니즘                                                                                                                                                                                       |
| ------------ | ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1 (MVP)     | 동시 편집 감지                      | block-level patch + version, 같은 block 충돌은 LWW + conflict 알림 (기존 플랜 Phase 15 그대로)                                                                                                 |
| R2           | block presence                      | `BlockPresence`로 "누가 어느 block 편집 중" 표시, 편집 중 block soft-lock 옵션                                                                                                                 |
| R3           | 다른 block 동시 편집 무손실         | patch broadcast + rebase. **주의: index 기반 `block.move`/`block.insert`는 동시 삽입 시 위치가 틀어짐** → 이 단계에서 sibling 순서를 fractional index(order key)로 전환하거나 서버 rebase 필수 |
| R4 (필요 시) | 같은 문단 character-level 동시 편집 | block별 Yjs `XmlFragment` + `y-prosemirror`를 포커스 block에만 바인딩. 문서 전체 Yjs doc 1개 + block당 fragment 구조라 하이브리드와 정확히 호환                                                |

- R4까지 가도 아키텍처 변경 없음: PM은 이미 block 내부에만 있으므로 y-prosemirror 바인딩 지점이 명확하다. 전체 문서 단일 PM doc였다면 R1~R3의 "block 단위 저장/권한/부분 로드"가 오히려 어려웠다.
- 리스크 1개 선반영 필요: R3의 index 취약성. Phase 16에서 patch에 `expectedVersion`(block 단위)을 넣어 최소한 감지는 가능하게 한다.

### 0.6 방향 판단

**지금 방향 잘못되지 않았다. 계속 구현해도 된다.** 근거:

1. Milestone 1~2 산출물(schema, patch engine, tree engine, permission, autosave, SDUI adapter, drag helpers)은 편집 엔진 선택과 무관한 문서 도메인 계층이다. PM을 쓰든 안 쓰든 전부 필요했다. 매몰 비용 아님.
2. 잘못된 것은 단 하나, Phase 10의 "textarea/input 편집" — notion editor 목표(inline mark, markdown shortcut, block 간 caret 이동, selection comment)와 구조적으로 막힌다. textarea는 rich text로 진화할 수 없다.
3. 따라서 pivot 지점은 "지금"이 최적이다. headless core 완성 직후 + UI 본격 착수 직전. textarea 기반 UI를 만들었다면 그게 진짜 매몰 비용이 됐다.

---

## 1. 결정 요약

### 1.1 최종 방향

기존 `@lodado/sdui-template`를 문서 block renderer/runtime으로 활용하고, 새 패키지 `@lodado/sdui-document`에서 문서 도메인, block patch, autosave, permission, content helper를 제공한다.

```text
@lodado/sdui-template
→ SDUI node normalization
→ node-level subscription
→ React rendering runtime

@lodado/sdui-document
→ document domain model
→ block document contract
→ document tree operation
→ block patch operation
→ autosave state machine
→ permission decision
→ plain text/link extraction
```

### 1.2 핵심 판단

| 선택지                    | 판단                                                                                               |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| MobX 도입                 | 하지 않음. 기존 `SduiLayoutStore` subscription 구조로 대체 가능                                    |
| ProseMirror 도입          | 하이브리드로 도입 (0장). block tree는 `sdui-document` 소유, 포커스 block의 inline 편집에만 PM 사용 |
| Yjs/Hocuspocus 도입       | 초기에는 하지 않음. block-level patch/version 기반으로 시작                                        |
| 새 패키지 생성            | `packages/sdui-document` 생성                                                                      |
| 기존 `sdui-template` 수정 | 최소화. 필요한 public API 부족이 확인될 때만 수정                                                  |

---

## 2. 제품 범위 재정의

### 2.1 만들 것

이 프로젝트의 목표는 “Notion clone”이 아니라 다음이다.

```text
SDUI 기반 clean-room block document system
```

즉, 서버가 JSON 문서 구조를 내려주고, 클라이언트가 block 단위로 렌더링/편집/저장하는 시스템이다.

### 2.2 MVP에 포함할 기능

- 문서 도메인 모델
- 컬렉션/문서 트리 모델
- SDUI block document schema
- paragraph block
- heading block
- checklist block
- divider block
- callout block
- image/file metadata block
- document link block
- block insert/update/delete/move patch
- autosave state machine
- permission decision helper
- plain text extraction
- document link extraction
- 기본 테스트

### 2.3 MVP에서 제외할 기능

- 전체 문서 단일 ProseMirror doc (inline 전용 PM schema는 Phase 17에서 도입)
- MobX store
- Yjs/Hocuspocus realtime collaboration
- character-level concurrent editing
- complex rich text marks
- table editing
- selection-based comment anchor
- markdown paste 완전 지원
- public share UI
- object storage 실제 구현
- search provider 실제 구현

---

## 3. 목표 아키텍처

```text
packages/sdui-document/
  src/
    index.ts

    schema/
      ids.ts
      workspace.ts
      collection.ts
      document.ts
      block.ts
      event.ts
      patch.ts
      index.ts

    tree/
      documentTree.ts
      moveDocument.ts
      lifecycle.ts
      treeErrors.ts
      index.ts

    blocks/
      blockFactory.ts
      blockGuards.ts
      blockPatch.ts
      blockPath.ts
      index.ts

    permissions/
      actions.ts
      policy.ts
      index.ts

    autosave/
      autosaveMachine.ts
      index.ts

    content/
      walkBlocks.ts
      plainText.ts
      links.ts
      index.ts

    repositories/
      contracts.ts
      index.ts

    collaboration/
      contracts.ts
      index.ts

    search/
      contracts.ts
      index.ts

    storage/
      contracts.ts
      index.ts

    __tests__/
      tree.test.ts
      blockPatch.test.ts
      permissions.test.ts
      autosave.test.ts
      content.test.ts
```

---

## 4. 패키지 경계

### 4.1 `@lodado/sdui-template`

기존 책임을 유지한다.

- SDUI layout document normalization
- node-level state repository
- subscription manager
- React rendering hooks
- node rendering

변경은 최소화한다.

필요할 수 있는 변경:

- document block 렌더링에 필요한 public helper export
- node state update API가 부족할 경우 최소 보강
- renderer story/example 추가

### 4.2 `@lodado/sdui-document`

새 책임을 가진다.

- 문서 도메인 타입
- document tree operation
- block patch operation
- autosave 상태 전이
- permission contract
- content utility
- adapter interface

React 의존성은 초기에는 넣지 않는다.

### 4.3 나중에 고려할 패키지

초기에는 만들지 않는다.

```text
packages/sdui-document-react
packages/sdui-document-blocks
packages/sdui-document-collaboration
```

필요가 확인되면 분리한다.

---

## 5. 데이터 모델 초안

### 5.1 Document

```ts
type SduiDocumentState = 'draft' | 'published' | 'archived' | 'deleted'

type SduiDocument = {
  id: string
  workspaceId: string
  collectionId?: string
  parentDocumentId?: string
  title: string
  state: SduiDocumentState
  content: SduiDocumentContent
  version: number
  createdAt: string
  updatedAt: string
}
```

### 5.2 Document content

```ts
type SduiDocumentContent = {
  schemaVersion: '1.0'
  root: SduiDocumentBlock
}
```

### 5.3 Block

```ts
type SduiDocumentBlock = {
  id: string
  type: SduiDocumentBlockType
  state?: Record<string, unknown>
  attributes?: Record<string, unknown>
  children?: SduiDocumentBlock[]
}
```

### 5.4 Block type

```ts
type SduiDocumentBlockType =
  | 'document.root'
  | 'document.paragraph'
  | 'document.heading'
  | 'document.checklist'
  | 'document.divider'
  | 'document.callout'
  | 'document.image'
  | 'document.file'
  | 'document.link'
```

### 5.5 Patch

```ts
type SduiDocumentPatch =
  | {
      type: 'block.insert'
      parentId: string
      index: number
      block: SduiDocumentBlock
    }
  | {
      type: 'block.update'
      blockId: string
      state?: Record<string, unknown>
      attributes?: Record<string, unknown>
    }
  | {
      type: 'block.delete'
      blockId: string
    }
  | {
      type: 'block.move'
      blockId: string
      parentId: string
      index: number
    }
```

---

## 6. 단계별 구현 플랜

## Phase 0. 준비와 기준 확정

### 목표

새 패키지가 기존 monorepo 규칙을 따르도록 준비한다.

### 작업

1. 기존 패키지 구조 확인
   - `packages/sdui-template/package.json`
   - `packages/sdui-template/tsconfig.json`
   - `packages/sdui-template/jest.config.js`
   - `packages/sdui-template/rollup.config.mjs`
2. 새 패키지 이름 확정
   - 기본값: `@lodado/sdui-document`
3. MVP 범위 확정
   - ProseMirror 없음
   - MobX 없음
   - React 없음
   - 순수 TypeScript domain package

### 산출물

- 이 플랜 문서
- 구현 범위 합의

### 완료 조건

- [ ] 새 패키지 이름 확정
- [ ] MVP 제외 기능 합의
- [ ] 구현 시작 가능

---

## Phase 1. 패키지 스캐폴딩

### 목표

`packages/sdui-document`를 생성하고 build/test/lint 명령이 동작하게 한다.

### 작업 파일

```text
packages/sdui-document/package.json
packages/sdui-document/tsconfig.json
packages/sdui-document/jest.config.js
packages/sdui-document/rollup.config.mjs
packages/sdui-document/src/index.ts
packages/sdui-document/README.md
```

### 작업 내용

1. `package.json` 생성
2. TypeScript config 생성
3. Jest config 생성
4. Rollup config 생성
5. `src/index.ts` 생성
6. smoke test 추가

### 테스트

```bash
pnpm --filter @lodado/sdui-document test
pnpm --filter @lodado/sdui-document build
```

### 완료 조건

- [ ] package가 workspace에서 인식됨
- [ ] test 명령 성공
- [ ] build 명령 성공
- [ ] public export smoke test 통과

---

## Phase 2. Schema 타입 구현

### 목표

문서 시스템의 public type contract를 만든다.

### 작업 파일

```text
packages/sdui-document/src/schema/ids.ts
packages/sdui-document/src/schema/workspace.ts
packages/sdui-document/src/schema/collection.ts
packages/sdui-document/src/schema/document.ts
packages/sdui-document/src/schema/block.ts
packages/sdui-document/src/schema/event.ts
packages/sdui-document/src/schema/patch.ts
packages/sdui-document/src/schema/index.ts
packages/sdui-document/src/__tests__/schema.test.ts
```

### 구현 내용

- branded id type 또는 단순 string alias
- workspace model
- collection model
- document model
- block model
- event model
- patch model

### 권장 단순화

초기에는 runtime validation을 넣지 않는다.

```text
zod schema는 나중에 API boundary가 생길 때 추가한다.
```

### 완료 조건

- [ ] 모든 public type이 `src/index.ts`에서 export됨
- [ ] `SduiDocument`는 draft 상태에서 `collectionId` 없이 생성 가능
- [ ] `SduiDocumentContent`는 `root` block을 가진다
- [ ] block type union이 정의됨
- [ ] patch type union이 정의됨

---

## Phase 3. Block traversal/content helper

### 목표

block tree를 안전하게 순회하고, 검색/링크 추출의 기반을 만든다.

### 작업 파일

```text
packages/sdui-document/src/content/walkBlocks.ts
packages/sdui-document/src/content/plainText.ts
packages/sdui-document/src/content/links.ts
packages/sdui-document/src/content/index.ts
packages/sdui-document/src/__tests__/content.test.ts
```

### 구현 API

```ts
walkDocumentBlocks(content, visitor)
extractPlainText(content)
extractDocumentLinks(content)
```

### 구현 규칙

- root부터 depth-first 순회
- 알 수 없는 block type도 순회 가능
- `state.text`가 string이면 plain text로 추출
- `document.link` block에서 target document id 또는 href 추출
- 빈 text/없는 children에 안전해야 함

### 테스트 케이스

- paragraph text 추출
- heading text 추출
- nested checklist text 추출
- document link 추출
- empty content 안전 처리

### 완료 조건

- [ ] plain text extraction 테스트 통과
- [ ] link extraction 테스트 통과
- [ ] unknown block type에서도 crash 없음

---

## Phase 4. Block patch engine

### 목표

문서 content에 patch를 적용하는 순수 함수를 만든다.

### 작업 파일

```text
packages/sdui-document/src/blocks/blockPath.ts
packages/sdui-document/src/blocks/blockGuards.ts
packages/sdui-document/src/blocks/blockPatch.ts
packages/sdui-document/src/blocks/blockFactory.ts
packages/sdui-document/src/blocks/index.ts
packages/sdui-document/src/__tests__/blockPatch.test.ts
```

### 구현 API

```ts
applyDocumentPatch(content, patch): SduiDocumentContent
applyDocumentPatches(content, patches): SduiDocumentContent
findBlockById(content, blockId): SduiDocumentBlock | undefined
```

### Patch 동작

| Patch          | 동작                                                 |
| -------------- | ---------------------------------------------------- |
| `block.insert` | parent children의 index 위치에 block 삽입            |
| `block.update` | block state/attributes shallow merge                 |
| `block.delete` | block과 descendants 제거                             |
| `block.move`   | block을 기존 위치에서 제거 후 새 parent/index에 삽입 |

### 실패 타입

```ts
BlockNotFound
ParentBlockNotFound
InvalidBlockMove
RootBlockCannotBeDeleted
```

### 중요한 규칙

- root block 삭제 금지
- block을 자기 자신 아래로 이동 금지
- block을 자기 descendant 아래로 이동 금지
- patch 적용은 원본 content를 mutate하지 않음

### 테스트 케이스

- block insert
- block update
- block delete
- block move
- root delete 실패
- descendant 아래 move 실패
- immutability 보장

### 완료 조건

- [ ] 모든 patch 테스트 통과
- [ ] patch 적용 함수가 pure function임
- [ ] 실패 케이스가 명확한 error를 반환하거나 throw함

---

## Phase 5. Document tree engine

### 목표

문서 간 parent/collection 관계를 조작하는 tree operation을 만든다.

### 작업 파일

```text
packages/sdui-document/src/tree/documentTree.ts
packages/sdui-document/src/tree/moveDocument.ts
packages/sdui-document/src/tree/lifecycle.ts
packages/sdui-document/src/tree/treeErrors.ts
packages/sdui-document/src/tree/index.ts
packages/sdui-document/src/__tests__/tree.test.ts
```

### 구현 API

```ts
moveDocument(input): MoveDocumentResult
archiveDocumentSubtree(input): DocumentTreeResult
restoreDocumentSubtree(input): DocumentTreeResult
getDocumentDescendantIds(documents, documentId): string[]
```

### Move 규칙

- 문서는 자기 자신 아래로 이동할 수 없음
- 문서는 자기 descendant 아래로 이동할 수 없음
- target parent가 있으면 target parent가 존재해야 함
- target collection이 바뀌면 descendants의 collectionId도 함께 변경
- draft 문서는 collection 없이 존재 가능
- published 문서를 collection 밖으로 이동시키는 것은 기본적으로 금지

### 테스트 케이스

- root document 생성/이동
- child document 이동
- sibling reorder
- cross-collection move
- descendant collectionId 전파
- cycle prevention
- archive subtree
- restore subtree

### 완료 조건

- [ ] cycle prevention 테스트 통과
- [ ] cross-collection move 테스트 통과
- [ ] archive/restore subtree 테스트 통과

---

## Phase 6. Permission policy

### 목표

서버와 클라이언트가 공유할 수 있는 pure permission decision helper를 만든다.

### 작업 파일

```text
packages/sdui-document/src/permissions/actions.ts
packages/sdui-document/src/permissions/policy.ts
packages/sdui-document/src/permissions/index.ts
packages/sdui-document/src/__tests__/permissions.test.ts
```

### Action

```ts
type SduiDocumentAction =
  | 'read'
  | 'update'
  | 'createChild'
  | 'move'
  | 'archive'
  | 'delete'
  | 'restore'
  | 'comment'
  | 'share'
  | 'downloadAttachment'
```

### Actor

```ts
type SduiDocumentActor = {
  id: string
  workspaceRole: 'admin' | 'member' | 'guest'
  collectionRole?: 'manager' | 'editor' | 'viewer'
  documentRole?: 'editor' | 'viewer'
}
```

### API

```ts
canPerformDocumentAction(input): PermissionDecision
```

### 테스트 케이스

- admin read/update/delete 가능
- viewer update 불가
- editor update 가능
- guest read는 explicit permission 없으면 불가
- read 가능 but update 불가면 collaboration readOnly 가능

### 완료 조건

- [ ] permission matrix 테스트 통과
- [ ] readOnly decision을 표현 가능
- [ ] deny reason이 제공됨

---

## Phase 7. Autosave state machine

### 목표

UI/editor와 독립적인 autosave 상태 전이 모델을 만든다.

### 작업 파일

```text
packages/sdui-document/src/autosave/autosaveMachine.ts
packages/sdui-document/src/autosave/index.ts
packages/sdui-document/src/__tests__/autosave.test.ts
```

### 상태

```ts
type AutosaveStatus = 'idle' | 'dirty' | 'saving' | 'saved' | 'failed' | 'offline'
```

### 핵심 모델

```ts
type AutosaveState = {
  status: AutosaveStatus
  localVersion: number
  acknowledgedVersion: number
  pendingPatchCount: number
  error?: string
}
```

### 이벤트

```ts
type AutosaveEvent =
  | { type: 'local.change'; patchCount?: number }
  | { type: 'save.request' }
  | { type: 'save.success'; acknowledgedVersion: number }
  | { type: 'save.failure'; error: string }
  | { type: 'network.offline' }
  | { type: 'network.online' }
```

### 중요한 규칙

- local change는 version을 증가시킨다
- save success가 오래된 version이면 무시한다
- save failure는 dirty data를 버리지 않는다
- offline 중 local change는 pending 상태로 유지한다

### 테스트 케이스

- idle → dirty
- dirty → saving → saved
- saving 중 local change 발생
- stale save success 무시
- failure 후 retry
- offline/online transition

### 완료 조건

- [ ] autosave state transition 테스트 통과
- [ ] stale response 방지 테스트 통과
- [ ] dirty preservation 테스트 통과

---

## Phase 8. Repository/adapter contracts

### 목표

실제 DB/API/storage/search/collaboration 구현 없이 책임 경계를 타입으로 고정한다.

### 작업 파일

```text
packages/sdui-document/src/repositories/contracts.ts
packages/sdui-document/src/collaboration/contracts.ts
packages/sdui-document/src/search/contracts.ts
packages/sdui-document/src/storage/contracts.ts
```

### Document repository

```ts
interface SduiDocumentRepository {
  getDocument(id: string): Promise<SduiDocument | undefined>
  savePatches(input: SaveDocumentPatchesInput): Promise<SaveDocumentPatchesResult>
  moveDocument(input: MoveDocumentInput): Promise<MoveDocumentResult>
}
```

### Search indexer

```ts
interface SduiDocumentSearchIndexer {
  indexDocument(input: IndexDocumentInput): Promise<void>
  removeDocument(input: RemoveDocumentInput): Promise<void>
  search(input: SearchDocumentsInput): Promise<SearchDocumentsResult>
}
```

### Attachment storage

```ts
interface SduiDocumentAttachmentStorage {
  createUpload(input: CreateUploadInput): Promise<CreateUploadResult>
  createDownloadUrl(input: CreateDownloadUrlInput): Promise<CreateDownloadUrlResult>
}
```

### Collaboration placeholder

초기에는 realtime 구현이 아니라 contract만 둔다.

```ts
interface SduiDocumentCollaborationAdapter {
  connect(input: CollaborationConnectInput): Promise<CollaborationSession>
}
```

### 완료 조건

- [ ] adapter interfaces가 public export됨
- [ ] 구현체는 없음
- [ ] runtime dependency 없음

---

## Phase 9. sdui-template 연동 설계

### 목표

`SduiDocumentContent`를 `SduiLayoutDocument`로 변환하는 adapter를 만든다.

### 작업 파일

```text
packages/sdui-document/src/sdui/toSduiLayout.ts
packages/sdui-document/src/sdui/fromSduiLayout.ts
packages/sdui-document/src/sdui/index.ts
packages/sdui-document/src/__tests__/sduiAdapter.test.ts
```

### 방향

`@lodado/sdui-document`가 `@lodado/sdui-template`에 직접 의존할지 여부는 이 Phase에서 결정한다.

#### Option A. 직접 의존

```text
@lodado/sdui-document → @lodado/sdui-template types import
```

장점:

- type-safe adapter 가능
- 사용성이 좋음

단점:

- domain package가 renderer package에 묶임

#### Option B. structural typing

```text
SduiLayoutDocument shape만 자체 type으로 맞춤
```

장점:

- 결합도 낮음

단점:

- type drift 가능

### 추천

초기에는 Option B로 시작한다.

```text
ponytail: 직접 dependency는 실제 adapter 사용처가 생긴 뒤 추가한다.
```

### 완료 조건

- [ ] document content를 SDUI layout document shape로 변환 가능
- [ ] block id/type/state/attributes/children 보존
- [ ] adapter 테스트 통과

---

## Phase 10. React block editor MVP

### 목표

headless package가 안정화된 뒤, 실제 편집 가능한 block UI를 붙인다.

### 위치 선택

초기 후보:

```text
packages/sdui-template-component/src/features/document/
```

또는 새 패키지:

```text
packages/sdui-document-react/
```

### 추천

처음에는 별도 패키지를 만들지 말고, 예제/스토리 중심으로 검증한다.

```text
apps/docs/src/stories/DocumentEditor.stories.tsx
```

필요가 커지면 `packages/sdui-document-react`로 분리한다.

### MVP block components

- ParagraphBlock
- HeadingBlock
- ChecklistBlock
- DividerBlock
- CalloutBlock
- ImageBlock
- DocumentLinkBlock

### 편집 방식

> 2026-07-04 업데이트: 아래 textarea/input 방식은 **스캐폴딩 검증용으로만** 사용한다.
> 실제 텍스트 편집은 Phase 17의 FocusedBlockEditor(ProseMirror)로 교체된다.
> textarea 기반 UX를 다듬는 데 시간을 쓰지 말 것 — patch 연결/렌더링 검증이 끝나면 즉시 Phase 16으로 넘어간다.

| Block     | 입력 방식           |
| --------- | ------------------- |
| paragraph | textarea 또는 input |
| heading   | input               |
| checklist | checkbox + input    |
| callout   | textarea            |
| image     | metadata form       |
| divider   | editable 없음       |
| link      | input/select        |

### 완료 조건

- [ ] Storybook에서 문서 렌더링 가능
- [ ] paragraph 수정 가능
- [ ] block insert 가능
- [ ] block delete 가능
- [ ] block move 가능
- [ ] patch가 autosave machine으로 전달됨

---

## Phase 11. Slash command MVP

### 목표

block insert UX를 단순하게 제공한다.

### 범위

- `/paragraph`
- `/heading`
- `/todo`
- `/divider`
- `/callout`
- `/image`
- `/link`

### 구현 방식

초기에는 ProseMirror suggestion plugin 없이 단순 UI로 구현한다.

```text
block toolbar button
또는
paragraph input이 '/'로 시작하면 command menu 표시
```

### 완료 조건

- [ ] slash menu 후보 필터링 가능
- [ ] 선택 시 block.insert patch 생성
- [ ] 권한이 없으면 command 비활성화

---

## Phase 12. Autosave integration

### 목표

block patch queue와 autosave state machine을 연결한다.

### 흐름

```text
block edit
→ patch 생성
→ local content에 patch 적용
→ patch queue append
→ autosave local.change
→ debounce
→ savePatches 호출
→ version ack
→ queue clear
```

### 실패 처리

- save 실패 시 patch queue 유지
- 사용자에게 failed 상태 표시
- retry 가능
- stale ack 무시

### 완료 조건

- [ ] save success 시 clean 상태
- [ ] save failure 시 dirty/pending 유지
- [ ] 저장 중 추가 편집 시 최신 patch 유지
- [ ] stale response가 최신 content를 덮지 않음

---

## Phase 13. 권한 기반 UI gating

### 목표

permission policy를 UI에 연결한다.

### 흐름

```text
server document payload
→ actor/document/collection role
→ canPerformDocumentAction
→ block editor editable/readOnly 결정
```

### 적용 위치

- document read
- block edit
- block insert
- block delete
- block move
- attachment download
- comment button placeholder

### 완료 조건

- [ ] viewer는 edit control이 숨겨짐 또는 disabled
- [ ] readOnly 상태에서도 document rendering 가능
- [ ] write action은 UI뿐 아니라 save adapter에서도 거부 가능

---

## Phase 14. Search/link 기반 기능

### 목표

plain text extraction과 link extraction을 이용해 검색/백링크 준비를 한다.

### 구현 범위

- `extractPlainText`
- `extractDocumentLinks`
- `DocumentRelationship` type
- indexing event contract

### 아직 하지 않을 것

- 실제 search provider
- ranking
- permission-filtered server search

### 완료 조건

- [ ] document content에서 검색용 text 추출 가능
- [ ] document link 관계 추출 가능
- [ ] 같은 content를 여러 번 처리해도 같은 relationship 결과

---

## Phase 15. Collaboration 준비

### 목표

Yjs 없이도 나중 확장 가능한 block-level collaboration contract를 둔다.

### 초기 모델

```ts
type BlockPresence = {
  userId: string
  documentId: string
  blockId?: string
  status: 'viewing' | 'editing'
  lastActiveAt: string
}
```

### 충돌 정책 MVP

- 같은 block 동시 수정은 last-write-wins + version conflict detection
- 다른 block 동시 수정은 patch merge
- conflict 발생 시 UI에서 reload/retry 안내

### 완료 조건

- [ ] presence type 정의
- [ ] block-level conflict error type 정의
- [ ] Yjs 의존성 없음

---

## Phase 16. Inline content model + split/merge patch (headless)

### 목표

ProseMirror 통합 전에, 하이브리드에 필요한 도메인 계약을 headless로 완성한다. React/PM 의존성 없음.

### 작업 파일

```text
packages/sdui-document/src/schema/inline.ts
packages/sdui-document/src/schema/patch.ts          (block.split / block.merge 추가)
packages/sdui-document/src/blocks/blockPatch.ts     (split/merge 적용 + inverse patch)
packages/sdui-document/src/content/plainText.ts     (state.content walk 지원)
packages/sdui-document/src/__tests__/inline.test.ts
packages/sdui-document/src/__tests__/blockSplitMerge.test.ts
```

### 구현 내용

1. `SduiInlineNode` type — PM 호환 inline JSON (text + marks: bold/italic/code/link, hard_break, 확장 여지: mention)
2. patch 확장

   ```ts
   | { type: 'block.split'; blockId; offset 또는 splitContent: [SduiInlineNode[], SduiInlineNode[]]; newBlockId }
   | { type: 'block.merge'; blockId; intoBlockId }
   ```

3. `applyDocumentPatch`가 inverse patch를 함께 반환 (app-level undo 스택 기반)
4. patch에 block 단위 `expectedVersion?` 필드 (0.5 R3 대비, 검증은 아직 안 함)
5. `extractPlainText`가 `state.text` 우선 → 없으면 `state.content`에서 파생

### 완료 조건

- [ ] split: caret offset 기준으로 content 분할, children은 원본 block에 유지(또는 정책 명시)
- [ ] merge: intoBlock 뒤에 content 이어붙임, 병합 offset 반환 (caret 복원용)
- [ ] split → merge 왕복 시 원본 복원 (property 테스트)
- [ ] 모든 patch가 inverse patch 반환
- [ ] React/PM 의존성 없음 유지

---

## Phase 17. FocusedBlockEditor — ProseMirror inline 엔진 통합

### 목표

포커스된 text block 1개에만 ProseMirror를 마운트하는 편집기를 만든다. 0.2 경계 규칙을 코드로 고정한다.

### 의존성

```text
prosemirror-model / prosemirror-state / prosemirror-view
prosemirror-keymap / prosemirror-history / prosemirror-commands / prosemirror-inputrules
```

### 위치

```text
apps/docs 스토리 검증 후 packages/sdui-document-react (또는 sdui-template-component/features/document)
```

### 구현 내용

1. **inline 전용 PM schema**: `doc → inline*` 1-depth. block node 없음. marks: bold/italic/code/link
2. **FocusedBlockEditor 컴포넌트**
   - mount: `state.content` → PM doc, caret 위치 복원 (선두/말미/goal-column/병합 offset)
   - unmount(blur)/debounce: PM doc → `SduiInlineNode[]` + plain text → `block.update` patch 커밋
   - React는 PM 마운트 컨테이너 div만 제공. PM 내부 DOM 불간섭 (`contentEditable` 영역에 React children 금지)
3. **keymap 위임** (0.2 표 그대로): Enter→split, Backspace@선두→merge, Tab/Shift-Tab→move, Arrow 경계→포커스 전환 콜백
4. **inputrules**: `# `→heading, `- `→checklist 후보, `[] `→checklist, `1. `→(numbered 후보) — block type 변경 patch 위임
5. **비포커스 렌더러**: `SduiInlineNode[]` → React span 렌더 (sdui-template block 컴포넌트에서 사용)
6. **IME 규칙**: composition 중 commit/unmount 금지 (`view.composing` 체크)

### 테스트

- PM ↔ SduiInlineNode 왕복 직렬화 unit test
- keymap 위임 콜백 unit test (jsdom)
- Storybook + Playwright: 한글 조합 입력, Enter 분할, Backspace 병합, Tab indent E2E

### 완료 조건

- [ ] 문서당 PM 인스턴스 최대 1개 (block 수와 무관)
- [ ] 한글 조합 입력 중 block 분할/커밋이 조합을 깨지 않음
- [ ] Enter/Backspace/Tab/Arrow가 전부 patch 또는 포커스 전환으로 표현됨
- [ ] blur 후 재포커스 시 내용/caret 손실 없음
- [ ] 비포커스 block은 PM 없이 inline mark 렌더링

---

## Phase 18. Block selection + n-depth drag & drop UI

### 목표

block 층 상호작용을 완성한다. 전부 React 관심사, PM 관여 없음.

### 구현 내용

1. **depth projection**: 드래그 중 수평 offset → 목표 depth → before/after/inside 산출 (dnd-kit nested sortable 패턴), `createNestedBlockMovePatch`에 연결
2. drop indicator (depth 시각화), auto-scroll, collapsed subtree 제외 처리
3. **block selection mode**: PM 밖 드래그/Esc/handle 클릭으로 진입, Shift-클릭 범위 선택, 선택 상태에서 delete/move/copy patch
4. 드래그 시작 시 포커스 block commit + PM unmount

### 완료 조건

- [ ] 3-depth 이상 트리에서 subtree 드래그 이동 E2E 통과
- [ ] 자기 descendant로 drop 시도 시 UI에서 차단 (patch engine 에러에 도달 전)
- [ ] block selection에서 여러 block 삭제/이동 가능

---

## Phase 19. Realtime R1~R2

### 목표

0.5 로드맵의 R1(충돌 감지) + R2(presence)를 구현한다. Yjs 없음.

### 구현 내용

1. `savePatches`에 block 단위 `expectedVersion` 검증 → version conflict 에러 반환
2. conflict 시 UI: 해당 block reload/retry 안내 (autosave machine failed 경로 재사용)
3. `BlockPresence` broadcast contract 구현 (adapter interface, mock 구현)
4. 편집 중 block에 presence 표시, soft-lock 옵션

### 완료 조건

- [ ] 같은 block 동시 수정 시 나중 저장이 conflict로 감지됨
- [ ] 다른 block 동시 수정은 양쪽 모두 저장됨
- [ ] presence가 block 단위로 표시됨
- [ ] R3(fractional index/rebase), R4(y-prosemirror)는 착수 전 재평가

---

## 7. 테스트 전략

### 7.1 Unit tests

필수:

```text
tree.test.ts
blockPatch.test.ts
permissions.test.ts
autosave.test.ts
content.test.ts
sduiAdapter.test.ts
```

### 7.2 Integration tests

나중에 추가:

```text
document editing flow
patch queue + autosave
permission-gated editing
sdui renderer integration
```

### 7.3 Storybook/manual tests

나중에 추가:

```text
DocumentEditor.stories.tsx
ReadOnlyDocument.stories.tsx
AutosaveFailure.stories.tsx
SlashCommand.stories.tsx
```

---

## 8. 검증 명령

각 Phase 종료 시 최소 실행:

```bash
pnpm --filter @lodado/sdui-document test
pnpm --filter @lodado/sdui-document build
```

UI integration 이후:

```bash
pnpm test
pnpm build
pnpm storybook
```

---

## 9. 주요 리스크와 대응

| 리스크                             | 설명                                                                               | 대응                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| PM ↔ block 층 경계 붕괴            | PM이 block 구조까지 침범하거나 React가 PM 내부 DOM을 건드리면 하이브리드 장점 소멸 | 0.2 경계 규칙 고정. 통신은 3개 통로(주입/커밋/keymap 위임)만     |
| contenteditable/IME 복잡도         | 한글 조합 입력, selection, paste가 어려움                                          | 전부 ProseMirror에 위임. React로 재구현 금지                     |
| 동시 편집 시 index 충돌            | index 기반 insert/move는 동시 편집 시 위치가 틀어짐                                | patch에 block 단위 expectedVersion, R3에서 fractional index 검토 |
| collaboration 기대치               | Notion식 동시 문장 편집은 어려움                                                   | block-level patch/version 충돌 감지로 시작                       |
| 기존 SDUI store와 문서 도메인 혼재 | renderer와 domain 책임이 섞일 수 있음                                              | `sdui-document`는 headless 유지                                  |
| patch merge 오류                   | move/delete/update 순서에 따라 버그 가능                                           | patch engine unit test 강화                                      |
| tree cycle bug                     | 문서 트리 불변 조건 깨질 수 있음                                                   | move operation에서 descendant 검사 필수                          |
| 권한 우회                          | UI gating만 믿으면 위험                                                            | adapter/repository contract에서도 permission 재검사 명시         |

---

## 10. 구현 순서 체크리스트

### Milestone 1. Headless core

- [ ] `packages/sdui-document` 생성
- [ ] package build/test 세팅
- [ ] schema type 구현
- [ ] content traversal 구현
- [ ] block patch engine 구현
- [ ] document tree engine 구현
- [ ] permission policy 구현
- [ ] autosave machine 구현
- [ ] repository contracts 구현

### Milestone 2. SDUI adapter

- [ ] document block → SDUI layout 변환
- [ ] SDUI layout → document block 변환 가능성 검토
- [ ] adapter test 작성
- [ ] 기존 `sdui-template` public API 부족 여부 확인

### Milestone 3. Editor MVP

- [ ] Storybook example 생성
- [ ] paragraph edit
- [ ] heading edit
- [ ] checklist edit
- [ ] block insert/delete/move
- [ ] slash command MVP
- [ ] autosave mock adapter 연결
- [ ] readOnly mode

### Milestone 4. Server contract 준비

- [ ] savePatches contract 확정
- [ ] document version conflict 정의
- [ ] search indexing event 정의
- [ ] attachment metadata contract 정의
- [ ] presence contract 정의

### Milestone 4.5. Hybrid editor (Phase 16~19)

- [ ] inline content model + split/merge patch (Phase 16)
- [ ] FocusedBlockEditor — PM inline 엔진 (Phase 17)
- [ ] block selection + n-depth DnD UI (Phase 18)
- [ ] realtime R1(conflict 감지) + R2(presence) (Phase 19)

### Milestone 5. 고급 기능 후보

- [ ] inline mark model 검토 → Phase 16으로 승격됨
- [ ] block-level comment 구현
- [ ] mention block/link 구현
- [ ] real backend adapter 구현
- [ ] collaboration adapter 검토

---

## 11. Acceptance Criteria

최소 성공 기준:

- [ ] ProseMirror 없이 block document를 표현할 수 있다.
- [ ] MobX 없이 document state 변경을 patch로 표현할 수 있다.
- [ ] `sdui-template` renderer에 전달 가능한 SDUI document shape로 변환할 수 있다.
- [ ] paragraph/heading/checklist/divider/callout/link/image block을 표현할 수 있다.
- [ ] block insert/update/delete/move가 순수 함수로 동작한다.
- [ ] autosave 상태 머신이 stale response를 막는다.
- [ ] 권한 정책이 readOnly/editable을 구분한다.
- [ ] 문서 트리는 cycle을 만들 수 없다.
- [ ] 테스트로 핵심 불변 조건을 검증한다.

---

## 12. Non-goals

- Outline 원본 구현 구조 재현
- ProseMirror transaction model 재구현
- MobX store 재도입
- Yjs CRDT 초기 구현
- Notion 수준의 selection UX 구현
- 복잡한 table editor 구현
- 모든 markdown shortcut 구현
- 특정 DB/storage/search vendor 고정

---

## 13. ProseMirror 도입 결정 기록 (2026-07-04 확정)

원래 이 절은 "나중에 필요해지면 재검토" 조건 목록이었다. notion형 outline editor가 확정 목표가 되면서 조건 중 다수(inline marks, markdown shortcut, block 간 caret 이동, 향후 selection comment)가 확실시되어 **하이브리드 도입으로 확정**했다. 상세는 0장.

확정 범위:

- 도입: inline 전용 PM schema, 포커스 block 단일 인스턴스, keymap 위임, inputrules
- 계속 금지: 전체 문서 단일 PM doc, PM view 로직의 React 재구현, block 구조를 PM transaction으로 표현

재평가 트리거 (하이브리드 → 단일 PM doc 재검토 조건):

- 여러 block에 걸친 네이티브 텍스트 selection이 block selection mode로 대체 불가능하다고 판명될 때
- table cell 편집이 block 조합으로 표현 불가능할 때

현재 판단: 두 경우 모두 Notion이 하이브리드 계열 구조로 해결한 전례가 있어 가능성 낮음.

---

## 14. 권장 첫 구현 PR

첫 PR은 작게 유지한다.

```text
PR 1: @lodado/sdui-document headless core

포함:
- package scaffold
- schema types
- content helpers
- block patch engine
- document tree engine
- permission policy
- autosave machine
- unit tests

제외:
- React UI
- Storybook
- backend adapter
- collaboration
```

PR 1 완료 후에야 UI PR로 넘어간다.

---

## 15. 한 줄 원칙

```text
sdui-template로 문서를 그린다.
sdui-document로 문서 의미를 관리한다.
patch로 편집을 표현한다.
ProseMirror는 block 내부 텍스트만 담당한다. block 밖으로 나오지 않는다.
Yjs는 증명된 필요가 생길 때까지 미룬다.
```
