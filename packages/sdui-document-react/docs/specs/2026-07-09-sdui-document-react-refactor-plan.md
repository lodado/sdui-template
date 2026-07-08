# sdui-document-react 리팩토링 플랜

- 날짜: 2026-07-09
- 대상: `packages/sdui-document-react` (react 편집기 셸만)
- 근거: 구루 4렌즈 병렬 감사 (React 훅 아키텍처 / 함수형 코어(Bernhardt·Hickey) / 테스트가능성(Feathers) / Clean Architecture·상태관리)
- 선행: core 패키지 리팩토링(P1+P2)은 이미 main에 머지됨. 이 플랜은 그 위에서 진행.
- 성격: **이 문서는 `/clear` 후 콜드 실행용.** 각 커밋은 자기완결적. 파일 경로·라인·함수명 모두 명시.

---

## 0. 콜드 스타트 컨텍스트 (먼저 읽을 것)

### 이 패키지가 하는 일

core(`@lodado/sdui-document`)는 순수 헤드리스 문서 모델(불변 패치, 순수 리듀서). 이 패키지는 그 위의 **imperative shell** — ProseMirror 기반 편집 UI, 드래그, 키보드, 클립보드, 렌더 모델.

### 감사 총평

**아키텍처는 의도적으로 건강함. RESTRUCTURE급 문제 0건.** 갓 파일들은 대부분 (a) 안전하게 SPLIT 가능하거나 (b) 순수 로직이 hook에 갇혀 테스트만 부족. 4렌즈 전원 "점진적 리팩토링 준비됨, 대규모 재작성 불필요".

### 절대 깨면 안 되는 불변식 (silent-failure — 에러 없이 잘못 동작)

리팩토링 중 아래를 건드리면 테스트가 못 잡고 런타임만 틀어짐. 각 커밋 전 재확인:

1. **RenderModelStore per-id 불변식 3종** (`editor/renderModel/entry.ts`):

   - `deriveEntry`가 value-equal 입력에 대해 **같은 객체 참조 반환** (shallowEqualEntry, ~line 97-99)
   - `reconcile`의 `prev === next` short-circuit (~line 161-163) — core 구조적 공유에 의존
   - `dropSubtree`의 whole-tree liveness 체크 (~line 123-128) — 블록이 같은 배치에서 부모 이동 시 "칸 사라짐" 버그 방지
   - `applyOrdinals` (~line 137-152)가 out-of-band로 `changed`에 push하는 예외 경로
   - 깨지면: stale render(under-render) 또는 over-render, 조용히. `renderCount.test.tsx`/`nestedRenderCount.test.tsx`가 유일한 감지선.

2. **publish 순서** (`editor/hooks/useDocumentPatches.ts:64-70`): `onPublish`(renderStore.sync → docStore.setSnapshot) → `docRef.current = next` → `onContentChange`. 이 순서 뒤집으면 부모 리렌더가 stale render-model 읽는 레이스.

3. **IME `composing` 가드** (`focused-block/FocusedBlockEditor.tsx:~223` commitNow, `focused-block/pm/slashMenuPlugin.ts:~160`): composition 중 commit 금지. 한/일/중 입력 손상. **현재 테스트 0** — 모든 PM 테스트가 `composing: false` 하드코딩.

4. **marks 레지스트리 순서 = PM 스키마 mark 순서** (`marks/index.ts:16-19`), **1:1 name 계약** (`marks/types.ts:14`): mark 이름이 PM mark 이름 겸 도메인 타입. 깨지면 focus swap 시 static 렌더와 live PM 뷰 desync.

### 실행 규칙

- **Tidy First**: 구조 변경 커밋과 동작 변경 커밋 분리.
- 각 커밋 후 `pnpm --filter @lodado/sdui-document-react test` 그린. 상태관리/렌더 건드린 커밋은 루트 `pnpm run test`까지.
- 순수 추출은 **동작 보존** — 기존 hook은 추출된 순수함수를 호출만. 기존 통합 테스트가 회귀 감시.
- 브랜치: `refactor/sdui-document-react-core`.

---

## 목표 / 비목표

### 목표

1. **순수 결정 로직을 hook에서 추출** → milliseconds 단위 데이터 in/out 단위테스트 가능화 (현재 DOM 시뮬레이션으로만 커버). `useEditorHandlers`·`useRangeOperations` 중심.
2. **선행 characterization 테스트**로 미커버 고위험 동작 고정 (IME, rich clipboard, autoscroll/long-press) — 리팩토링 전에.
3. **갓 파일 분할** — 안전한 SPLIT만 (ColumnResizeGutter, FocusedBlockEditor 메뉴/툴바, useRangeOperations 관심사).
4. **작은 정리** — dead shim 삭제, 매직스트링→상수, PM 경계 reach-in 수정.

### 비목표 (하지 않음)

- **RenderModelStore / entry.ts 로직 변경** — KEEP, 불변식 위험. (매직넘버 추출 정도만 허용)
- **SduiDocumentEditor 전면 재작성** — TIDY만. 5번째 store 실제 필요 전까지 store-factory 추출 보류(YAGNI).
- **useBlockPointerDrag 분할** — 이미 순수부 추출됨, 단일 책임. 테스트만 추가.
- **useSelectionKeyboard / useInlineTextDragDrop 분할** — 응집적, KEEP.
- **marks/\* 구조 변경** — 의도된 colocation. 문서 표현만 정정.
- **publish 순서 / EditorRuntime 구조** 변경.

---

## Phase A — 안전망 (characterization 테스트, 동작 변경 0)

리팩토링 전 미커버 고위험 동작 고정. 전부 기존 테스트 패턴 재사용.

### 재사용할 기존 테스트 하네스

- **View-free PM 상태 테스트**: `focused-block/__tests__/keymapDelegation.test.ts` — `createFocusedBlockEditorState`로 EditorState 만들고 `{ state, dispatch, composing }` 최소 객체로 플러그인 키다운 호출. `composing?` 슬롯 이미 존재.
- **pmView 테스트 핸들**: `FocusedBlockEditor.tsx:~422`가 `container.pmView = view` 노출 (테스트가 실제 PM 트랜잭션 구동용). `FocusedBlockEditor.test.tsx:116-119` 참고.
- **real-gesture-through-real-editor**: `editor/__tests__/touchBlockDrag.test.tsx`, `liveDropGesture.test.tsx` — 실제 SduiDocumentEditor 렌더, jsdom 부재분(`elementFromPoint`, PointerEvent, `getBoundingClientRect`)만 목킹.
- **scenario 네이밍**: `describe('as is: <precondition>') → describe('when <action>') → it('to be: <expected>')` (crossBlockClipboard.scenario.test.tsx, undoRedo.test.tsx).
- **patchTestUtils**: `editor/__tests__/patchTestUtils.ts` — 패치 diff 헬퍼, 새 assertion 전 확인.

### A-1. IME/composition characterization (최고 우선 — 위험 1위)

- 대상: `FocusedBlockEditor.commitNow` (`FocusedBlockEditor.tsx:~222-228`), `slashMenuPlugin.ts:~160`.
- keymapDelegation 하네스 확장: `composing: true`로 세팅 → blur/commit 시 `onCommit` **호출 안 됨** 검증, `compositionend` 후 호출됨 검증.
- 또는 `pmView` 핸들로 실제 `compositionstart`/`update`/`end` 이벤트 디스패치.
- 파일: `focused-block/__tests__/imeComposition.test.ts` (신규).

### A-2. Rich-JSON 클립보드 라운드트립 (위험 3위)

- 대상: `useRangeOperations` `parseInlineClipboard`(~line 44), `SDUI_INLINE_MIME`, `serializeRangeInline`(~452), `mutateRange`(~161).
- 현재 plain-text paste만 시나리오됨. rich 경로(마크 보존 copy→paste 왕복)는 미검증.
- `crossBlockClipboard.scenario.test.tsx` 확장: 마크 있는 범위 copy → 다른 위치 paste → 마크 보존 assert.

### A-3. Autoscroll + long-press 타이머 (위험 2·5위)

- 대상: `useBlockPointerDrag` autoscroll ramp(~line 288-293), long-press 타이머(`setTimeout(activate, TOUCH_LONG_PRESS_MS)`, ~line 475).
- `touchBlockDrag.test.tsx` 확장 + `jest.useFakeTimers()` + `jest.advanceTimersByTime(TOUCH_LONG_PRESS_MS)`.
- autoscroll이 컬럼 경계 근처 드래그 중 발동하는 상호작용 경로(스크롤 재-hit-test로 stale activeId/overId) 커버.

**커밋 A**: `test(sdui-document-react): IME/rich-clipboard/autoscroll characterization 안전망`

---

## Phase B — 순수 로직 추출 (최고 레버리지, 동작 보존)

### B-1. useEditorHandlers 순수 결정 로직 추출

- 파일: `editor/hooks/useEditorHandlers.ts` (641L, 18 핸들러). 신규 `editor/handlerLogic.ts` (순수).
- **패턴**: 각 핸들러의 순수 계산부를 `(doc, args) => { patches: SduiDocumentPatch[]; focus?: FocusTarget; selection?: ... }` 순수함수로 추출. hook은 그 결과로 `applyPatches`/`store.set`/`refocus` **효과만** 실행.
- **추출 대상 (레버리지 순):**
  1. `split` (~line 258-300) — Notion split 정책(빈 리스트→paragraph, toggle→insertToggleChild, else block.split + 조건부 setType). **최고가치** — 3갈래 분기가 table-driven 테스트 딱. 현재 `notionKeyboard.test.tsx` DOM 시뮬로만 검증.
  2. `mergeBackward` (~line 302-330) — `(doc, blockId) => patch + focus`, `orderedTextBlocks()` 사용.
  3. `indent`/`outdent` (~line 332-375) — sibling/parent lookup + 단일 block.move.
  4. `moveBlock` (~line 417-448) — bounds-check + 패치 구성.
  5. `turnInto` (~line 394-415) — 패치 구성.
  6. `applyMenuType` (~line 131-177) — `(doc, blockId, item, attrs, extraState) => { patches, targetId } | null` (이미 순수 근접).
  7. 6개 one-liner: `toggleChecked`, `toggleCollapsed`, `setCodeLanguage`, `setCalloutIcon`, `setBlockAlign`, `setImageLayout` (~line 191-223) — 인자만 읽는 클로저, trivial 추출.
- **효과로 남길 것**: `handleClick`/`focusBlock`/`escape`/`openBlockActions` (store.set), `duplicateBlock`(injected id 생성 — 임의성), `blockMenuSelect`/`blockMenuFilePicked`(파일피커·URL.createObjectURL·async upload), `history`(passthrough).
- **주의**: `latest` ref 패턴(line 58-59) 유지. 추출 함수는 `docRef.current`를 인자로 받음(참조 아닌 값).
- 신규 테스트: `editor/__tests__/handlerLogic.test.ts` — split 3분기, merge, indent/outdent table-driven.

**커밋 B-1**: `refactor(sdui-document-react): useEditorHandlers 순수 결정 로직 handlerLogic.ts 추출 + 단위테스트`

### B-2. useRangeOperations 순수 range 로직 추출

- 파일: `editor/hooks/useRangeOperations.ts` (551L). 신규 `editor/rangePatchLogic.ts` (순수).
- **추출 대상 (전부 `(content, range, ...) => T` 순수, DOM/store 무접촉):**
  - `perBlockRange` (~220), `coveredTextBlocks` (~226), `isMarkActive` (~231), `uniformAttr` (~243), `patchRangeMarks`(~256 → `computeRangeMarkPatches`), `serializeRangeText`(~439), `serializeRangeInline`(~452), `mutateRange`의 패치 계산부(~161-218, `applyPatches`/refocus 효과만 hook에).
  - `parseInlineClipboard`(~44)는 이미 모듈스코프 — 좋은 예, 그대로.
- **효과로 남길 것**: `currentRange`(DOM selection 읽기), `restoreSelection`(DOM 변이), `buildSnapshot`(rect 측정), selectionchange/scroll/resize `useEffect`, `handleClipboard`(preventDefault·clipboardData).
- **네이밍 충돌 주의**: hook 내 `toggleMark`(~277)가 `prosemirror-commands`의 `toggleMark`와 충돌 — 추출 시 `toggleRangeMark`로 리네임.
- **최고 레버리지**: cross-block range 편집 = 블록 에디터 최고 버그 유발 경로. 현재 4개 DOM 시뮬 스위트(crossBlockDelete/Replace/Marks/Clipboard)로만 검증 → 순수 단위테스트로 값싸게.
- 신규 테스트: `editor/__tests__/rangePatchLogic.test.ts`.

**커밋 B-2**: `refactor(sdui-document-react): useRangeOperations 순수 range 패치 로직 rangePatchLogic.ts 추출 + 단위테스트`

### B-3. useBlockPointerDrag autoscroll 델타 추출 (소규모)

- `computeOverRatio`(~64, 이미 순수+테스트됨 `resolveOverRatio.test.ts`) 패턴으로 autoscroll ramp(~288-293) → `computeAutoScrollDelta(pointerY, top, bottom, edgeBand, maxSpeed): number` 순수 추출.
- 이유: 현재 inline+미테스트. 나머지 순수부(`hasPassedThreshold`, `projectBlockDrop`, `buildBlockDropPatches`)는 이미 추출됨 — 직접 단위테스트만 추가(현재 DOM 경유).
- 신규 테스트: `editor/__tests__/computeAutoScrollDelta.test.ts` + `hasPassedThreshold`/`projectBlockDrop`/`buildBlockDropPatches` 직접 단위테스트.

**커밋 B-3**: `refactor(sdui-document-react): autoscroll 델타 순수 추출 + 드래그 순수함수 직접 단위테스트`

### B-4. renderHook 단위테스트 (동작 변경 0, 코드 변경 0)

- `useEditorHandlers`(이미 DI 친화 — `UseEditorHandlersInput`으로 store/docRef/applyPatches/generateBlockId 주입)와 `useSelectionKeyboard`(DOM 무접촉, 100% 테스트 가능)에 `renderHook` 단위테스트 추가.
- 이유: 현재 실패 시 "SduiDocumentEditor.test.tsx의 뭔가 깨짐"으로만 attribution. 내부 리팩토링 전 hook별 실패 귀속 확보.
- **프로덕션 코드 변경 불필요** — 테스트 파일만.

**커밋 B-4**: `test(sdui-document-react): useEditorHandlers/useSelectionKeyboard renderHook 단위테스트`

---

## Phase C — 구조 분할 (동작 보존, 커밋당 1주제)

### C-1. ColumnResizeGutter 분리

- `editor/BlockNode.tsx` (455L)의 ColumnResizeGutter 서브컴포넌트(~line 84-201, 120줄: live preview, tooltip, 키보드 resize, escape, ARIA) → 신규 `editor/ColumnResizeGutter.tsx` + `useColumnResize()` 훅.
- BlockNode는 단순 routing 컴포넌트로 축소.
- `columnResize.test.tsx` 그린 유지. 매직넘버 `KEYBOARD_RESIZE_STEP`(0.05) 경계값 테스트(MIN_COLUMN_RATIO 도달) 추가 권장.

**커밋 C-1**: `refactor(sdui-document-react): ColumnResizeGutter를 BlockNode에서 분리`

### C-2. FocusedBlockEditor 메뉴/툴바 발행 분리

- `focused-block/FocusedBlockEditor.tsx` (547L). PM 라이프사이클(mount→retire) 코어는 **분리 불가, 유지**.
- 추출: 스냅샷/툴바 발행(`setSnapshot`, `toolbarProps` memo, publish effect) → `useSelectionSnapshotPublish()` 훅. (`useBlockMenuState`는 이미 추출됨 — 재사용.)
- **주의**: IME 가드(retired flag, commitNow, `!view.composing`)는 PM 라이프사이클에 묶임 — 추출 금지. A-1 테스트가 감시.
- 위임 콜백 조립(onSplit/onMerge/onNavigate → commitNow 후 delegate) 순서 보존(commitNow가 delegate **전**).

**커밋 C-2**: `refactor(sdui-document-react): FocusedBlockEditor 스냅샷/툴바 발행 훅 분리`

### C-3. useEditorHandlers 핸들러 그룹 분할 (선택)

- B-1으로 순수부 빠지면 hook 얇아짐. 남은 효과 핸들러를 카테고리별 분할 검토:
  - selection / structural / file(pendingFilePickRef) 그룹.
- **조건부**: B-1 후에도 hook이 여전히 크면 진행. 아니면 스킵(YAGNI). 각 subset의 `latest` ref 보존 필수.

**커밋 C-3** (조건부): `refactor(sdui-document-react): useEditorHandlers 핸들러 그룹별 분할`

---

## Phase D — 소규모 정리 (Tidy)

### D-1. dead shim 삭제

- `editor/hooks/useNestedBlockDragDrop.ts` (5줄, `ponytail:` 마크된 dead re-export shim, useBlockPointerDrag 재export). 소비처 없음 → 삭제 + import 정리.

### D-2. 매직스트링 → 상수

- `BlockNode.tsx:~279` (`block.type === 'document.toggle'`), `:~407` (`block.type === 'document.code'`) → core의 export 상수(`TOGGLE_BLOCK_TYPE`, `CODE_BLOCK_TYPE`)로 교체. 같은 파일 위쪽 `COLUMN_BLOCK_TYPE` 사용과 일관.
  - **확인 필요**: 이 상수들이 `@lodado/sdui-document` public export인지. (core 커밋 10에서 배럴 큐레이션함 — `TOGGLE_BLOCK_TYPE`/`CODE_BLOCK_TYPE`는 block-types에서 export되어 공개. 미공개면 core index에 추가 후 진행.)

### D-3. PM 경계 reach-in 수정

- `selection-toolbar/selectionSnapshot.ts:5`가 `../focused-block/pm/schema`의 `focusedBlockSchema` + raw `EditorView`/`EditorState`를 sibling 디렉토리에서 직접 reach-in.
- `focused-block` public surface(index)를 통해 필요한 것 재export → selectionSnapshot이 그걸 import. focused-block/pm 내부 변경 시 조용히 깨지는 crack 제거.

### D-4. 문서 정정 (해당 시)

- "PM confined to focused-block/" 주장 → "PM mount는 FocusedBlockEditor, PM schema는 marks/\*에 의도적 colocation" 으로 정정 (README/온보딩 문서 있으면).

**커밋 D**: `refactor(sdui-document-react): dead shim 삭제 + 매직스트링 상수화 + PM 경계 reach-in 정리`

---

## 커밋 순서 (고정)

| #   | 커밋                                               | Phase | 종류          |
| --- | -------------------------------------------------- | ----- | ------------- |
| A   | IME/rich-clipboard/autoscroll characterization     | A     | test          |
| B-1 | useEditorHandlers 순수 추출 (handlerLogic.ts)      | B     | refactor+test |
| B-2 | useRangeOperations 순수 추출 (rangePatchLogic.ts)  | B     | refactor+test |
| B-3 | autoscroll 델타 추출 + 드래그 직접 단위테스트      | B     | refactor+test |
| B-4 | renderHook 단위테스트 (handlers/selectionKeyboard) | B     | test          |
| C-1 | ColumnResizeGutter 분리                            | C     | refactor      |
| C-2 | FocusedBlockEditor 발행 훅 분리                    | C     | refactor      |
| C-3 | useEditorHandlers 그룹 분할 (조건부)               | C     | refactor      |
| D   | dead shim + 매직스트링 + reach-in 정리             | D     | refactor      |

각 커밋 후: `pnpm --filter @lodado/sdui-document-react test` 그린. C-1/C-2(렌더 경로) 후: 루트 `pnpm run test`.

---

## 성공 기준

- [ ] 기존 react 테스트 전부 그린 + 신규 characterization/단위 테스트 추가
- [ ] `useEditorHandlers`의 split/mergeBackward/indent/outdent/6 toggle이 `handlerLogic.ts` 순수함수로 추출, 직접 단위테스트 존재
- [ ] `useRangeOperations`의 range 패치/마크/직렬화가 `rangePatchLogic.ts` 순수함수로 추출, 직접 단위테스트 존재
- [ ] IME `composing: true` 경로에 테스트 존재 (현재 0)
- [ ] rich clipboard 마크 보존 라운드트립 테스트 존재
- [ ] `ColumnResizeGutter.tsx` 분리, BlockNode는 routing 중심
- [ ] `useNestedBlockDragDrop.ts` 삭제, 매직스트링 0, selectionSnapshot reach-in 제거
- [ ] **불변식 무손상 검증**: `renderCount.test.tsx`/`nestedRenderCount.test.tsx` 그린 (per-id 렌더 모델), publish 순서 유지, IME 가드 유지

## 하지 않을 것 (전원 합의 재확인)

- RenderModelStore/entry.ts 로직 변경 (매직넘버 추출만 허용)
- SduiDocumentEditor store-factory 추출 (5번째 store 실제 등장 전까지 YAGNI)
- useBlockPointerDrag/useSelectionKeyboard/useInlineTextDragDrop 분할
- marks/\* 구조 변경, publish 순서 변경, EditorRuntime 구조 변경

---

## 부록: 실행 기록 — 2차 구루 패널 정정 (2026-07-09, 실행 완료)

4렌즈 재감사(함수형 코어/React 훅/테스트가능성/아키텍처) 전원 AGREE-WITH-CHANGES. 실행 시 플랜 대비 변경 사항:

- **A-1 재설계**: keymapDelegation 하네스 경로 폐기 (delegation keymap은 `composing` 미참조, slashMenu 가드는 `view().update()` 소속 — 하네스 도달 불가). 실제 렌더 + `container.pmView` + `Object.defineProperty(view, 'composing')` getter 오버라이드로 두 가드 직접 검증 (`imeComposition.test.tsx`).
- **A-3 축소**: long-press BVA는 기존 존재 — autoscroll 경로 1건만 추가.
- **B-1 id 규칙**: 순수함수는 pre-generated id "값" 대신 `nextBlockId: () => string` thunk를 받아 **필요할 때만 1회 호출** — 빈 블록 변환 경로의 id 소비 순서(테스트 결정론)를 레거시와 동일하게 보존. `insertToggleChild`/`insertBlockBelow`/`navigate`도 추가 추출, 6개 one-liner는 `blockAttrsPatch` 헬퍼 1개로 수렴 (anemic 방지).
- **B-2 네이밍**: `mutateRange` 순수부 → `computeRangeReplacePatches`, `toggleMark`→`computeToggleRangeMark`, `setMark`→`computeSetRangeMark`, `isMarkActive`→`isRangeMarkActive`.
- **B-3 축소**: `hasPassedThreshold`/`projectBlockDrop`/`buildBlockDropPatches` 직접 단위테스트는 이미 존재(columnDragDrop.test.tsx, resolveOverRatio.test.ts) — `computeAutoScrollDelta` 추출+테스트만 신규.
- **C-1**: `useColumnResize()` 훅 취소 — 드래그 로직은 hook 모양이 아님(AbortController+명령형 DOM). 컴포넌트 파일 추출만.
- **C-2**: 시임 확대 — `useSelectionSnapshotPublish(viewRef, ...)` → `{refreshSnapshot, clearSnapshot, toolbarTurnIntoRef}` 반환. setSnapshot dedup bail 2개 원문 보존. IME 가드/commitNow는 mount effect 잔류.
- **C-3**: 조건부 → **확정 SKIP** (B-1 후 402L 단일 useMemo 응집; 그룹 분할은 `runtime` memo dep-array 리스크만 추가).
- **D-0 신설**: `TOGGLE_BLOCK_TYPE`/`CODE_BLOCK_TYPE`는 core 루트 미공개였음 → sdui-document index export + changeset 별도 커밋.
- **D-2 확대**: 매직스트링 프로덕션 7개 파일 전부 상수화 (BlockNode 2곳만으로는 절반짜리).
- **D-3 정정**: focused-block 배럴 import는 **순환 유발** (배럴이 FocusedBlockEditor 재export → publish 훅 → selectionSnapshot). deep import 유지 + 의도 주석이 올바른 수정.
- **import 방향 규칙**: 순수 로직 파일(`handlerLogic.ts`, `rangePatchLogic.ts`)은 hooks/를 import 금지 — 방향은 hook → 순수함수 단방향 (각 파일 헤더에 명시).

결과: 66 suites/422 tests → 72 suites/508 tests. 커밋: d8233b2(A) f625dab(B-1) 0470196(B-2) 8353a9d(B-3) dff9b32(B-4) 33c580c(C-1) 00a8c45(C-2) c6db278(D-0) 1fbd732(D).
