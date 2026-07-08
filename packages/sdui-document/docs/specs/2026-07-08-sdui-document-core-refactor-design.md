# sdui-document Core 리팩토링 설계 (P1 + P2)

- 날짜: 2026-07-08
- 대상: `packages/sdui-document` (core만, react 패키지 제외)
- 근거: 구루 4렌즈 감사 (Clean Architecture / Simple Made Easy / Refactoring / 타입 설계) — 전 영역 RESTRUCTURE 0건, "관례로만 지켜지는 불변식" 제거가 목표
- 원칙: **Tidy First** — 동작 변경 커밋과 구조 변경 커밋을 절대 섞지 않는다. 기존 481개 테스트는 모든 커밋에서 그린 유지.

---

## 목표

1. **조용한 실패(silent failure) 제거** — 새 패치 variant 추가, 파생 캐시 desync, copy-on-write 누락이 컴파일 에러 또는 명시적 런타임 에러가 되도록 (P1)
2. **거짓말하는 API 제거** — 호출되지 않는 zod 스키마, 내부를 노출하는 `export *`, 패치 엔진인데 `code`라는 이름 (P1/P2)
3. **중복된 지식 단일화** — 트리 순회 로직 2벌, blockquote 직렬화 2벌, 리스트 타입 목록 2벌 (P2)

## 비목표 (이번 스펙에서 하지 않는 것)

- `SduiDocumentBlock`의 discriminated union화 (P3) — 77파일 fan-in, 협업 기능 본격화 전 재평가
- `blocks/schema/block.ts`의 역방향 import 역전 (P3)
- `SduiBlockTypeModule` fat interface 분해 — feature 응집이 정답, 유지
- 범용 `defineTextBlockType` 팩토리 — rule of three 미충족
- `children` 배열 순서 + fractional `position` 이중 저장 해소 — 현재 쓰기 규율 완벽, 물리면 그때 수정
- react 패키지 일체

---

## P1 — 정확성 (동작 변경 커밋)

### P1-1. 패치 switch 전수 exhaustiveness 강제

**문제:** `blocks/code/patch/inverse.ts:131-136`의 `default: return []`, `apply.ts` switch의 암묵적 fallthrough, `collaboration/blockVersions.ts`·`patch/structuralSharing.ts`의 `default` 폴백. 새 `SduiDocumentPatch` variant 추가 시 컴파일 통과 후 런타임에서 조용히 no-op(빈 undo 등) 생성.

**설계:**

- `blocks/schema/assertNever.ts` 신설:

  ```ts
  export function assertNever(value: never, context: string): never {
    throw new Error(`Unhandled case in ${context}: ${JSON.stringify(value)}`)
  }
  ```

- 4개 switch(`apply.ts`, `inverse.ts`, `blockVersions.ts`의 2곳, `structuralSharing.ts`)에서 `default` 폴백 제거, 모든 variant를 명시적 case로 나열, 마지막에 `default: return assertNever(patch, '...')`.
- `document.setTitle`처럼 "이 레이어에서 의도적으로 아무것도 안 함"인 경우는 **명시적 case + 이유 주석**으로 표기해 `default`와 구분한다. 현재 `inverse.ts:131`의 `case 'document.setTitle': return []`가 한 줄 아래 `default: return []`와 텍스트상 구분 불가능한 문제를 해소.
- `apply.ts`(`applyDocumentPatch`)가 `document.setTitle`을 받으면: 명시적 case에서 **throw** (`InvalidPatchTargetError` 신설, P1-4의 에러 계층 참조). 이 variant는 상위 `patch/document.ts`(`applyPatchToDocument`)가 가로채는 것이 계약이므로, 직접 호출은 프로그래머 오류다. 조용한 no-op → 시끄러운 실패로 전환.
  - 대안으로 union을 `SduiContentPatch | SduiDocumentPatch`로 타입 분리하는 안이 있었으나, `blocks/schema/patch.ts` 소비자 전체에 리플이 생겨 P3로 보류. throw가 최소 수정.

**테스트:** 새 variant를 추가하는 시나리오는 컴파일 타임 보장이므로 타입 테스트(`// @ts-expect-error` 스타일) 1개 + `applyDocumentPatch(content, setTitlePatch)`가 throw하는 단위 테스트 1개.

### P1-2. `state.text` 파생 캐시 동기화 강제

**문제:** `state.text`는 `state.content`의 파생 캐시(계약: `patch/inlineState.ts:8`, `blocks/schema/inline.ts:9` "엔진 쓰기마다 갱신"). `splitBlock`/`mergeBlock`은 `toInlineStatePatch`로 동기화하지만, 모든 텍스트 편집이 실제로 타는 `block.update` 경로(`operations.ts:74-76`)는 `stripUndefinedKeys({ ...block.state, ...state })` 단순 머지라서 `content`만 갱신하는 패치가 `text`를 stale 상태로 남긴다.

**설계:**

- `operations.ts`의 `updateBlock` 핸들러에서, 들어오는 `state`에 `content` 키가 존재하면 머지 결과에 대해 `text`를 무조건 재계산해서 덮어쓴다. 재계산은 기존 `toInlineStatePatch`/inline plaintext 유틸을 재사용 — 새 로직 작성 금지.
- 호출자가 `text`를 명시적으로 보냈어도 `content`가 함께 오면 **파생값이 이긴다** (source of truth는 `content`). 이 우선순위를 `inlineState.ts` 주석에 명문화.
- `content` 없이 `text`만 오는 패치는 현행 유지 (plain-text 전용 블록 경로).

**테스트:** `block.update`로 `content`만 변경 → `text`가 새 plain text와 일치하는지. `content`+구식 `text` 동시 전송 → `content` 파생값이 이기는지. 총 2케이스.

### P1-3. copy-on-write 손목록(`touchedBlockIds`) 폐지

**문제:** 불변성이 `structuralSharing.ts:5-24`(`touchedBlockIds` — 패치 종류별 "건드리는 id" 손으로 관리하는 목록)와 `operations.ts`의 실제 in-place 쓰기가 **일치한다는 약속**으로만 성립. 새 연산이 목록에 없는 id를 쓰면 원본 문서가 조용히 변이되고, 컴파일 에러도 테스트 실패도 없다.

**설계 (get-or-copy 방식):**

- `patch/structuralSharing.ts`를 재구성: 사전 일괄 클론(`cloneTouchedPaths` 선행 호출) 대신, **쓰기 시점 lazy copy** 헬퍼를 도입.

  ```ts
  // 패치 1회 적용 스코프에서 생성
  createWriteScope(content) => {
    getWritable(blockId): SduiDocumentBlock  // 최초 접근 시 루트→해당 블록 경로를 클론하고 메모이즈
    getWritableParentOf(blockId): SduiDocumentBlock
    result(): SduiDocumentContent
  }
  ```

- `operations.ts`의 각 연산은 `findBlockById(content, id)`로 찾은 블록에 직접 쓰는 대신 `scope.getWritable(id)`가 돌려준 사본에 쓴다. "무엇을 클론할지"가 "무엇에 쓰는지"에서 **기계적으로 유도**되므로 병렬 목록이 사라진다.
- `touchedBlockIds()` 함수와 패치별 switch 삭제. (P1-1에서 이 switch에 assertNever를 넣는 대신, P1-3에서 함수 자체가 사라지는 순서로 진행해도 됨 — 커밋 순서는 P1-1 → P1-3, P1-3에서 해당 switch 제거.)
- 구조적 공유 계약은 동일: 건드리지 않은 서브트리는 reference 동일 유지. react의 `RenderModelStore` per-id 캐시가 이 계약에 의존하므로 **reference 동일성 테스트를 회귀 테스트로 승격**.

**리스크:** `operations.ts` 전 연산 수정 — P1 중 가장 큰 diff. 완화: 기존 481 테스트 중 patch 계열(blockPatch, patchInverse, columnDropPatches 등 700+줄)이 이미 동작을 고정하고 있고, 추가로 아래 테스트를 선행 작성.

**테스트 (구현 전 RED 작성):**

1. 모든 패치 종류에 대해 "적용 후 원본 `content` deep-freeze 위반 없음" — `Object.freeze` 재귀 적용 후 패치 적용, throw 없어야 함. 이 테스트가 있으면 미래의 어떤 연산 추가도 조용한 변이 불가능.
2. "건드리지 않은 형제 서브트리는 `===` 유지" — 구조적 공유 회귀 방지.

### P1-4. 죽은 zod 스키마 배선 + 에러 계층 정리

**문제 A:** 13개 블록 모듈의 `stateSchema`/`attributesSchema`가 런타임 어디서도 호출되지 않음(monorepo grep 0건). `block-types/types.ts` 주석은 "domain source-of-truth"라 주장 — API 거짓말.

**설계 A:**

- `blocks/schema/validate.ts`의 문서 파스 경로(`parseSduiDocumentContent` 계열)에서 블록별 dispatch: `blockModuleByType[block.type]`이 존재하고 `stateSchema`/`attributesSchema`가 선언돼 있으면 `safeParse`로 검증. 실패 시 어떤 블록·어떤 필드인지 담은 이슈로 전체 parse 실패.
- 레지스트리에 없는 타입(미지 타입 라운드트립)은 검증 스킵 — 열린 union 설계 유지.
- 성능: 검증은 **경계(파스)에서만**. `applyDocumentPatch` 핫패스에는 검증 추가하지 않는다.
- 이 배선이 과하다고 판단되면 대안은 필드 삭제지만, 스키마 자체는 이미 작성돼 있고 경계 검증은 core 원칙(`envelope.ts:57`이 선례)이므로 **배선을 기본안**으로 한다.

**문제 B:** 에러 11종(`blocks/code/errors/` 8종 + `tree/errors/` 2종 + `content/errors/` 1종)에 공통 base 없음. 도메인 에러 전체 캐치에 instanceof 11번 필요. `paragraph.markdown.ts:50-66`의 `throw new Error(...)`는 유일하게 맨 `Error` 사용 — 자기 관례 위반.

**설계 B:**

- `SduiDocumentError extends Error` base class 신설 (`blocks/schema/errors.ts` 또는 기존 errors 폴더 상단). 11종 전부 extends 변경 — 시그니처/name 불변, 구조 변경 커밋.
- `paragraph.markdown.ts`의 bare `Error` → `UnsupportedMarkdownError extends SduiDocumentError` 신설로 교체.
- P1-1의 `InvalidPatchTargetError`도 이 base를 extends.
- markdown `degrade` 정책이 빈 텍스트를 조용히 `[]`로 떨구는 문제(`paragraph.markdown.ts:59-61`): 이번엔 **주석으로 의도 명문화만** 하고 warnings 수집 채널은 P3. (정책 이름과 동작의 불일치는 인지하되, 소비자가 없는 warnings 배관은 YAGNI.)

**테스트:** 잘못된 `state`를 가진 블록 문서가 `parseSduiDocumentContent`에서 거부되는지(블록 타입 2~3종 샘플). 미지 타입 블록은 통과하는지. `catch (e) { e instanceof SduiDocumentError }`로 도메인 에러 전체가 잡히는지 1케이스.

---

## P2 — 구조 정리 (동작 변경 없음, 커밋당 1주제)

### P2-1. `blocks/code/` → `blocks/patch/` rename

- `git mv` + import 경로 일괄 수정. 패키지 외부에는 `index.ts` barrel을 통해서만 노출되므로 외부 영향 없음.
- 기존 `blocks/code/patch/` 하위는 `blocks/patch/engine/`이 아니라 **flatten**: `blocks/patch/{apply,inverse,operations,traverse,structuralSharing,inlineState,document,...}.ts` + 기존 동급 파일(`blockGuards`, `columnResize`, `columnStructure`, `documentHistory`, `patchAnchors`, `trailingBlock`)은 `blocks/patch/` 직하 유지. 디렉토리 한 단계 제거.

### P2-2. 공개 API 선별 (`export *` 17개 제거)

- 절차: ① react 패키지 + apps 전체에서 `@lodado/sdui-document` import 심볼 전수 수집(grep) → ② `index.ts`를 **named export만**으로 재작성 — 수집된 심볼 + 계약상 공개인 것(스키마 타입, 패치 타입, 블록 모듈 API, collaboration/ordering/markdown/sdui 공개 함수) → ③ `pnpm build` + react 패키지 typecheck로 누락 검증.
- `blockPatch.ts:7-17`의 선별 barrel이 이미 모범 — 같은 스타일.
- 내부 전용으로 강등되는 후보: `structuralSharing` 내부, `patchAnchors`/`trailingBlock` 세부, traverse 저수준 함수 중 react가 실제 안 쓰는 것. **react가 쓰는 `findBlockById`, `flattenDocumentBlocks` 등은 공개 유지.**
- 배포 영향: 외부 소비자 기준 breaking 가능 → changeset **minor** (0.x 시맨틱) + CHANGELOG에 제거 심볼 목록 명시.

### P2-3. 트리 순회 중복 제거

- `ordering/rebalance.ts:6-36`의 `findBlock`/`copyPathTo` 재구현 삭제 → `blocks/patch/traverse.ts`에서 export해 import. (ordering → blocks 의존은 기존 방향과 동일, 링 위반 없음.)
- `rebalance.ts:62-63`의 in-place `parentInTree.children = rebalanced`는 P1-3의 write-scope 헬퍼로 통일할 수 있으면 통일, 아니면 `{ ...node }` 스프레드 스타일로 정렬만 맞춤 — 동작 동일.

### P2-4. block-types 실중복 2건

- **blockquote 직렬화:** `quote.markdown.ts:7-16` ↔ `callout.markdown.ts:8-17` 바이트 동일 로직 → `block-types/shared/blockquote.ts`에 `renderAsBlockquote(block, ctx)` / `hoistLeadingParagraph(tokens, ctx)` 추출, 양쪽에서 호출. (`indentListChildren` 공유 선례와 동일 패턴.)
- **리스트 타입 제2 진실공급원:** `markdown/toMarkdown.ts:16-21`의 `LIST_ITEM_BLOCK_TYPES` 하드코딩 삭제 → `SduiBlockTypeModule`에 `readonly isListItem?: boolean` 추가, bulleted/numbered/checklist/toggle 4개 모듈에 `true` 선언, `toMarkdown.ts`는 `blockModuleByType[type]?.isListItem ?? false`로 조회.

### P2-5. repositories/search 계약 처분 — **[결정 필요]**

- 현황: `repositories/contracts.ts`·`search/contracts.ts`는 monorepo 전체에서 소비자 0 (shape-check 테스트 1개뿐). `permissions/`는 stories에서 실사용 — 유지.
- 옵션 A (권장): **유지 + 파일 상단에 staged-contract 주석** — `savePatches`의 `expectedVersion` 등이 collaboration 로드맵(패치 주석의 "realtime R1 Phase 19")과 맞물려 있어 의도적 선행 설계로 보임.
- 옵션 B: 삭제하고 설계 문서로 이동 — git이 기억하므로 필요 시 복원.
- → 사용자 결정: 저장/검색 어댑터 구현이 현 로드맵에 있으면 A, 없으면 B.

---

## 커밋 계획 (순서 고정)

| #   | 커밋             | 종류       | 내용                                                                               |
| --- | ---------------- | ---------- | ---------------------------------------------------------------------------------- |
| 1   | `test:`          | 안전망     | P1-3 deep-freeze 변이 테스트 + 구조적 공유 `===` 테스트 (현행 구현으로 GREEN 확인) |
| 2   | `refactor:`      | 구조       | P2-1 rename `blocks/code` → `blocks/patch`                                         |
| 3   | `feat:`          | 동작       | P1-1 assertNever + `document.setTitle` throw + 타입/단위 테스트                    |
| 4   | `fix:`           | 동작       | P1-2 `updateBlock` text 재계산 + 테스트                                            |
| 5   | `refactor:`      | 동작(내부) | P1-3 write-scope 도입, `touchedBlockIds` 삭제 — 커밋 1의 테스트가 감시             |
| 6   | `feat:`          | 동작       | P1-4A zod 스키마 배선 + 테스트                                                     |
| 7   | `refactor:`      | 구조       | P1-4B `SduiDocumentError` 계층 + bare Error 교체                                   |
| 8   | `refactor:`      | 구조       | P2-3 traverse 중복 제거                                                            |
| 9   | `refactor:`      | 구조       | P2-4 blockquote 헬퍼 + `isListItem`                                                |
| 10  | `refactor:`      | 구조       | P2-2 공개 API 선별 (마지막 — 앞 단계들이 심볼 지형 바꿈)                           |
| 11  | `docs:`/`chore:` | —          | P2-5 결정 반영 + changeset                                                         |

각 커밋 후 `pnpm run test` (모노레포 루트) 그린 필수. react 패키지 테스트 포함 — core 계약 변화가 react를 깨는지 즉시 감지.

## 성공 기준

- [ ] 481+ 테스트 전부 그린, react 패키지 typecheck/테스트 그린
- [ ] `SduiDocumentPatch`에 variant를 추가하면 컴파일 에러가 나는 switch가 4→0곳의 default-폴백을 가짐 (assertNever 또는 함수 삭제로)
- [ ] deep-freeze 테스트가 모든 패치 종류에 대해 원본 불변 증명
- [ ] `content` 갱신 시 `text` stale 불가능 (테스트로 고정)
- [ ] grep 기준: 호출되지 않는 `stateSchema`/`attributesSchema` 0건 (배선 완료)
- [ ] `index.ts`에 `export *` 0개
- [ ] `blocks/code` 경로 부재, `LIST_ITEM_BLOCK_TYPES` 부재, `rebalance.ts` 내 중복 traverse 부재
