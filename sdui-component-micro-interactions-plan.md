# sdui-template-component 마이크로 인터랙션 플랜 (ADS/Framer 수준)

> **이 문서는 AI 에이전트에게 그대로 전달하는 실행 프롬프트다.**
> 시니어 인터랙션 디자이너 관점의 스펙이며, 각 항목은 "왜(문제) → 스펙(ADS/Framer 기준) → 구현 가이드(파일·코드) → 완료 조건(AC)" 순서다.
> 벤치마크는 **Atlassian Design System(Jira)** 의 기능적 모션과 **Framer** 의 촉각적 마감이다. 스펙이 애매하면 "Jira/Framer 실제 제품이라면 어떻게 움직이는가"를 기준으로 판단하라.
>
> **Goal:** `@lodado/sdui-template-component` 전 컴포넌트에 토큰 기반 마이크로 인터랙션을 추가하고, 현재 죽어 있는 enter/exit 애니메이션을 자체 keyframes로 수리한다.
> **Tech Stack:** Tailwind v4(CSS-first, `apps/docs/src/globals.css`의 `@source`가 패키지 src를 스캔) + cva(class-variance-authority) + Radix UI. 스타일은 각 컴포넌트의 `*-variants.ts`에 있다.

---

## 0. 실행 규칙 (반드시 지켜라)

1. **코드 수정 전에 대상 파일과 이웃 파일을 먼저 읽어라.** 각 컴포넌트는 `컴포넌트.tsx + *-variants.ts + __tests__/` 구조다. variants 파일의 기존 배열-join 스타일을 그대로 따르라.
2. **작업 전 감사(audit) 먼저.** §1의 "알려진 사실"을 검증하고, 컴포넌트별 현재 모션 상태 표(이미 구현/죽은 클래스/미구현)를 만들어 보고한 뒤 착수하라.
3. **새 의존성 금지.** `framer-motion`, `tailwindcss-animate`, `tw-animate-css` 전부 도입하지 마라. 디자인 시스템은 자체 keyframes(§3)로 자립해야 한다. 소비자가 플러그인을 설치해야만 움직이는 라이브러리를 만들지 마라.
4. **`transform`/`opacity`만 애니메이션.** `height`, `width`, `top/left`, `margin` 등 레이아웃 속성 애니메이션 금지. `transition-all` 금지(발견하면 명시적 속성 목록으로 교체).
5. **모든 duration/easing은 모션 토큰 경유.** 하드코딩 `duration-200` 류를 발견하면 토큰으로 교체하라. 유일한 예외: 로딩 스피너(§5.1)는 고정 duration을 쓴다.
6. **`prefers-reduced-motion`은 토큰 레벨에서 처리한다(§3).** 개별 컴포넌트에 `motion-reduce:` 클래스를 흩뿌리지 마라. 예외(스피너)만 별도 표기.
7. **a11y는 기능의 일부다.** 기존 `focus-visible` 링을 모션이 가리거나 지연시키면 안 된다. 포커스 링은 transition 없이 즉시 나타나야 한다.
8. **FSD 유지.** 공유 모션 상수는 `src/shared/lib/motion.ts`(신규)에 두고 `shared/lib/index.ts`로 노출한다. slice 간 내부 파일 직접 import 금지.
9. **Phase 하나씩 진행하라.** 각 Phase 종료 시: 모노레포 루트에서 `pnpm run test` 통과(실패 시 다음 Phase 진행 금지) → 해당 컴포넌트 스토리 갱신 → 변경 요약 + AC 체크 결과 보고 → conventional commit(`feat(component): …`).
10. **마지막에:** `pnpm --filter @lodado/sdui-mcp build`(MCP 지식 재생성 — 리포 규칙), `pnpm changeset`(sdui-design-files·sdui-template-component minor). 퍼블리시는 하지 마라. CI 소관.

---

## 1. 현재 인벤토리 & 알려진 사실 (2026-07 감사 기준)

**컴포넌트 목록**

- `src/shared/ui/`: badge, button, canvas-3d, card, checkbox, div, dropdown, icon, list, popover, tag, text, textfield, toggle(switch), tooltip
- `src/features/`: dialog, form(Form/FormField), title(Title/TitleLogo)

**알려진 사실 — 감사에서 반드시 재확인하라**

1. **[결정적] `animate-in`/`animate-out`/`fade-in-0`/`zoom-in-95`/`slide-in-from-*` 클래스는 전부 죽은 클래스다.** dialog·dropdown·popover·tooltip variants에 쓰여 있지만, 이 유틸리티를 만드는 `tailwindcss-animate`(v3용)도 `tw-animate-css`(v4용)도 리포 어디에도 설치되어 있지 않다(리포 전체 package.json grep으로 확인됨). `apps/docs`는 Tailwind v4 CSS-first(`@import 'tailwindcss'`)라 해당 CSS가 생성되지 않는다. **즉 현재 Dialog/Dropdown/Popover/Tooltip은 애니메이션 없이 즉시 나타나고 사라진다.** 이 죽은 클래스들은 §4에서 자체 keyframes 클래스로 교체한다.
2. 모션 토큰이 없다. `packages/sdui-design-files/src/`에는 colors.css와 layout.css뿐이다.
3. `prefers-reduced-motion` 처리가 component 패키지에 전혀 없다(sdui-document-react 스타일 3개 파일에만 존재).
4. 현재 transition 상태: button `transition-colors`(duration 미지정), toggle `transition-colors duration-200` + thumb `transition-transform duration-200`(하드코딩), checkbox `transition-all duration-200`(규칙 위반), dialog close 버튼 `transition-colors`. card는 transition 없음.
5. Button에는 `LoadingSpinner` 컴포넌트와 `isLoading` variant가 이미 있다(`Button.tsx:11`). 로딩 중 label은 `opacity-0` 처리.
6. 스토리는 `apps/docs/src/stories/<컴포넌트>.stories.tsx`. 테스트는 Jest, 각 컴포넌트 `__tests__/`.

---

## 2. 모션 원칙 (모든 스펙의 판단 기준)

1. **빠르다.** 마이크로 인터랙션은 70–300ms. 사용자를 기다리게 하는 모션은 버그다.
2. **기능적이다.** 모든 모션은 상태 변화(열림/닫힘/선택/에러)를 설명한다. 장식용 모션 금지. (ADS 원칙)
3. **enter는 감속(ease-out), exit는 가속(ease-in), exit가 enter보다 빠르다.** 사라지는 것은 사용자가 이미 결정한 일이다.
4. **눌리는 것은 눌린 느낌을 준다.** press에 미세한 scale-down. (Framer 촉각)
5. **즉각적이어야 하는 것은 애니메이션하지 않는다.** 메뉴 항목 hover 하이라이트, 포커스 링은 transition 없이 즉시. (네이티브 메뉴/ADS 동작)

---

## 3. Phase 0 — 모션 파운데이션

### 3.1 모션 토큰 + keyframes

**문제:** 토큰 없이 컴포넌트마다 duration을 하드코딩하면 시스템 전체의 리듬이 어긋나고 reduced-motion을 일괄 처리할 수 없다.

**구현:** `packages/sdui-design-files/src/motion.css` 신규 생성, 아래 내용 그대로:

```css
/**
 * SDUI Design Files - Motion Tokens
 *
 * ADS/Framer 모션 원칙: transform/opacity만, enter=ease-out, exit=ease-in(더 빠르게).
 * keyframes는 전역 네임스페이스이므로 sdui- 프리픽스 필수.
 */
:root {
  --motion-duration-fast: 100ms;   /* hover/press 피드백, 소형 서피스 exit */
  --motion-duration-medium: 150ms; /* 소형 서피스 enter(tooltip/dropdown/popover), 대형 exit */
  --motion-duration-slow: 250ms;   /* 대형 서피스 enter(dialog) */

  --motion-ease-out: cubic-bezier(0.2, 0, 0, 1);       /* 감속 - enter */
  --motion-ease-in: cubic-bezier(0.4, 0, 1, 1);        /* 가속 - exit */
  --motion-ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);  /* 색/상태 전환 */
  --motion-ease-spring: cubic-bezier(0.16, 1, 0.3, 1); /* 오버슈트 - toggle thumb, check pop */
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-duration-fast: 0ms;
    --motion-duration-medium: 0ms;
    --motion-duration-slow: 0ms;
  }
}

@keyframes sdui-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes sdui-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}
@keyframes sdui-pop-in {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes sdui-pop-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.97); }
}
@keyframes sdui-dialog-in {
  from { opacity: 0; transform: translate(-50%, -48%) scale(0.96); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
@keyframes sdui-dialog-out {
  from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  to { opacity: 0; transform: translate(-50%, -49%) scale(0.98); }
}
@keyframes sdui-check-pop {
  from { opacity: 0; transform: scale(0.6); }
  to { opacity: 1; transform: scale(1); }
}
@keyframes sdui-error-in {
  from { opacity: 0; transform: translateY(-2px); }
  to { opacity: 1; transform: translateY(0); }
}
```

`packages/sdui-design-files/src/index.css`에 `@import './motion.css';` 추가.

> reduced-motion에서 duration 토큰이 0ms가 되면 모든 transition/animation이 즉시 완료된다(상태 변화 자체는 유지). Radix exit 애니메이션도 0ms면 즉시 unmount라 안전하다.

### 3.2 공유 모션 클래스 조각

**구현:** `packages/sdui-template-component/src/shared/lib/motion.ts` 신규 생성, 아래 내용 그대로. `shared/lib/index.ts`에서 export 추가:

```ts
/**
 * 모션 클래스 조각 - 각 *-variants.ts에서 조합해 사용한다.
 * duration/easing 값 변경은 @lodado/sdui-design-files의 motion.css 토큰에서만.
 */
export const MOTION = {
  /** 플로팅 서피스 enter/exit - Radix data-state 필요 */
  surface: [
    'data-[state=open]:animate-[sdui-pop-in_var(--motion-duration-medium)_var(--motion-ease-out)]',
    'data-[state=closed]:animate-[sdui-pop-out_var(--motion-duration-fast)_var(--motion-ease-in)]',
  ].join(' '),
  /** 오버레이(blanket) fade */
  overlay: [
    'data-[state=open]:animate-[sdui-fade-in_var(--motion-duration-slow)_var(--motion-ease-out)]',
    'data-[state=closed]:animate-[sdui-fade-out_var(--motion-duration-medium)_var(--motion-ease-in)]',
  ].join(' '),
  /** hover/active 색 전환 */
  colors: 'transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-in-out)]',
  /** 누름 피드백 - 색 전환 + active scale */
  pressable: [
    'transition-[color,background-color,border-color,box-shadow,transform]',
    'duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)]',
    'active:scale-[0.97]',
  ].join(' '),
} as const
```

> Tailwind arbitrary value에서 `_`는 공백으로 변환된다: `animate-[sdui-pop-in_var(--motion-duration-medium)_var(--motion-ease-out)]` → `animation: sdui-pop-in var(--motion-duration-medium) var(--motion-ease-out)`.

### 3.3 테스트

- `packages/sdui-design-files`(Jest 설정 있음)에 `src/__tests__/motion.test.ts`: motion.css 파일을 문자열로 읽어 (1) 토큰 3종+easing 4종 정의 존재, (2) `prefers-reduced-motion` 블록 존재, (3) 모든 keyframe 이름이 `sdui-` 프리픽스인지 검증.
- `sdui-template-component`에 `src/shared/lib/__tests__/motion.test.ts`: `MOTION.surface`가 `data-[state=open]`과 `data-[state=closed]`를 모두 포함하는지, `MOTION.pressable`이 `active:scale`을 포함하는지.

### AC

- [ ] motion.css가 index.css를 통해 로드되고, Storybook 브라우저 devtools에서 `--motion-duration-fast` 토큰이 조회된다
- [ ] OS 모션 감소 설정(또는 devtools 에뮬레이션) 시 duration 토큰이 0ms
- [ ] `MOTION` 상수가 패키지 Public API 경로로 import 가능
- [ ] 위 테스트 통과, 루트 `pnpm run test` 통과

---

## 4. Phase 1 — 플로팅 서피스 수리 + 업그레이드 (최우선 가치)

> 죽은 클래스(§1-1) 때문에 현재 아무 애니메이션이 없는 곳이다. 네 컴포넌트 모두 같은 패턴: **죽은 `animate-in` 계열 클래스를 전부 제거하고 `MOTION.surface`/`MOTION.overlay` + Radix transform-origin 변수로 교체.**

### 4.1 Tooltip (`shared/ui/tooltip/tooltip-variants.ts`)

**스펙:** enter `sdui-pop-in` medium/ease-out, exit `sdui-pop-out` fast/ease-in. 뜨는 방향 기준점: `origin-[var(--radix-tooltip-content-transform-origin)]`. Radix Provider의 `delayDuration=300`, `skipDelayDuration=250`(한 번 뜬 뒤 인접 트리거는 즉시)을 명시 prop으로 설정 — Framer/Jira의 "warm-up" 동작.

**AC:**

- [ ] hover 300ms 후 트리거 쪽에서 스케일-페이드 인, 벗어나면 더 빠르게 아웃
- [ ] 연속 hover 시 두 번째 툴팁은 지연 없이 표시

### 4.2 Dropdown (`shared/ui/dropdown/dropdown-variants.ts`)

**스펙:**

- Content: `MOTION.surface` + `origin-[var(--radix-dropdown-menu-content-transform-origin)]` — 트리거에서 자라나듯 열림. SubContent도 동일.
- **메뉴 항목 하이라이트는 즉각(transition 제거).** 항목에 `transition-colors`류가 있으면 삭제하라 — 원칙 §2-5. hover와 키보드 `data-[highlighted]`가 동일 스타일인지 확인.
- 체크박스/라디오 항목의 체크 표시는 `sdui-check-pop` medium/spring.

**AC:**

- [ ] 열림: 트리거 기준점에서 pop-in / 닫힘: 더 빠른 pop-out
- [ ] 항목 하이라이트가 마우스 이동 속도를 따라오며 지연 없음
- [ ] 서브메뉴도 자기 기준점에서 pop-in

### 4.3 Popover (`shared/ui/popover/popover-variants.ts`)

**스펙:** Dropdown Content와 동일 — `MOTION.surface` + `origin-[var(--radix-popover-content-transform-origin)]`. 화살표(있다면)는 content와 한 몸으로 움직여야 하며 별도 애니메이션 금지.

**AC:**

- [ ] 열림/닫힘 pop-in/out, 기준점 정확
- [ ] Popover.stories.tsx에서 4방향(side) 전부 기준점이 트리거 쪽

### 4.4 Dialog (`features/dialog/dialog-variants.ts`)

**스펙:**

- Overlay: `MOTION.overlay` (fade slow/ease-out, out은 medium/ease-in).
- Content: 죽은 클래스와 `duration-200` 제거 →
  `data-[state=open]:animate-[sdui-dialog-in_var(--motion-duration-slow)_var(--motion-ease-out)]` +
  `data-[state=closed]:animate-[sdui-dialog-out_var(--motion-duration-medium)_var(--motion-ease-in)]`
  (keyframe이 `translate(-50%,-50%)`를 포함하므로 기존 `translate-x/y` 정적 클래스와 충돌하지 않는지 확인 — 애니메이션 중에는 keyframe transform이 이긴다).
- 열릴 때 살짝 아래(-48%)에서 떠오르며 등장, 닫힐 때 미세하게 가라앉으며 사라짐 — Jira 모달 감각.
- Close/Confirm/Cancel 버튼: `transition-colors` → `MOTION.pressable`.

**AC:**

- [ ] 오버레이 fade와 컨텐츠 rise-in이 동시에, 닫힘은 더 빠름
- [ ] Esc/오버레이 클릭 닫힘에서도 exit 애니메이션 재생
- [ ] 버튼 press 시 눌림 피드백

### Phase 1 공통 검증

- [ ] 네 variants 파일에서 `animate-in|animate-out|fade-in-0|fade-out-0|zoom-|slide-in-from|slide-out-to` grep 결과 0건
- [ ] 루트 `pnpm run test` 통과, 각 스토리에서 열림/닫힘 육안 확인

---

## 5. Phase 2 — 코어 컨트롤

### 5.1 Button (`shared/ui/button/button-variants.ts`, `Button.tsx`)

**문제:** hover 색은 바뀌지만 duration이 브라우저 기본이고, 눌러도 눌린 느낌이 없다.

**스펙:**

- base의 `transition-colors` → `MOTION.pressable` (fast 색 전환 + `active:scale-[0.97]`).
- `isDisabled`/`isLoading` true일 때는 scale 피드백이 없어야 한다 — 이미 `pointer-events-none`이라 자동 충족되는지 테스트로 확인.
- 로딩 전환: label `opacity-0` 스왑에 `transition-opacity duration-[var(--motion-duration-fast)]` 추가(레이아웃 시프트 금지 유지). `LoadingSpinner`는 회전 애니메이션이 실제 동작하는지 감사(Tailwind v4 내장 `animate-spin`이면 OK). **스피너는 reduced-motion 예외** — 진행 중 표시는 필수 정보다. 버튼 루트에 `aria-busy` 확인, 없으면 추가.

**테스트(BVA):** `buttonVariants({ isDisabled: true })`에 `pointer-events-none` 포함 / 기본값에 `active:scale-[0.97]` 포함 / 로딩 시 `aria-busy="true"` 렌더.

**AC:**

- [ ] press 시 미세 축소, 뗄 때 복귀 (5개 appearance 전부)
- [ ] disabled/loading에서 press 피드백 없음
- [ ] 로딩 진입 시 label이 페이드로 사라지고 스피너 등장, 버튼 폭 변화 없음

### 5.2 Checkbox (`shared/ui/checkbox/`)

**문제:** `transition-all duration-200`(규칙 위반) + 체크 표시가 뚝 나타남.

**스펙:**

- `transition-all duration-200` → `MOTION.colors` (+ 필요시 `transition-[...]`에 `box-shadow` 추가).
- 체크 인디케이터(Radix Indicator 또는 체크 아이콘)에 `data-[state=checked]:animate-[sdui-check-pop_var(--motion-duration-medium)_var(--motion-ease-spring)]` — 체크가 "탁" 하고 박히는 느낌(Framer). 해제는 애니메이션 없이 즉시(해제를 기다리게 하지 마라).
- indeterminate 대시도 같은 pop 적용.
- 박스 hover 시 border 색 전환은 fast.

**AC:**

- [ ] 체크 시 스프링 pop, 해제 시 즉시 사라짐
- [ ] label 클릭 토글에서도 동일 동작
- [ ] `transition-all` grep 0건

### 5.3 Toggle/Switch (`shared/ui/toggle/toggle-variants.ts`)

**문제:** thumb이 `duration-200` 선형 이동 — 기계적이고 하드코딩.

**스펙:**

- track: `transition-colors duration-200` → `MOTION.colors`.
- thumb: `transition-transform duration-200` → `transition-transform duration-[var(--motion-duration-medium)] ease-[var(--motion-ease-spring)]` — 살짝 오버슈트하며 안착(Framer 스위치 감각).
- `ToggleIcons`의 opacity 전환도 토큰 duration으로 통일.

**AC:**

- [ ] thumb이 스프링 커브로 이동, 색 크로스페이드 동기화
- [ ] 하드코딩 `duration-200` grep 0건 (toggle 폴더)

### 5.4 TextField (`shared/ui/textfield/textfield-variants.ts`)

**스펙:**

- focus 시 border/ring: `transition-[border-color,box-shadow] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-in-out)]`. **단 `focus-visible` 아웃라인 자체는 즉시**(원칙 §2-5) — ring을 box-shadow 토큰 색 전환으로 처리하고 있는지 감사 후 결정.
- error 상태 진입 시 border 색 전환 fast. **shake 금지** — ADS는 흔들지 않는다. 에러 메시지 등장은 §6.4 Form에서.
- clear 버튼(있다면) hover: `MOTION.colors`.

**AC:**

- [ ] focus/blur 시 부드러운 ring 전환, 키보드 포커스 인지 지연 없음
- [ ] error on/off 시 색 전환만, 레이아웃 점프 없음

---

## 6. Phase 3 — 컨테이너·피드백

### 6.1 Card (`shared/ui/card/card-variants.ts`)

**스펙:** **클릭 가능한 카드에만** 모션. 감사: Card에 interactive 구분(onClick/href/variant)이 있는지 확인 — 없으면 `isInteractive` variant 추가(기본 false).

- interactive: `transition-[transform,box-shadow] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-out)] hover:-translate-y-px hover:shadow-md active:translate-y-0 active:scale-[0.99]` (shadow 값은 기존 elevation 토큰/클래스 재사용).
- 정적 카드: 모션 없음. 장식 금지.

**AC:**

- [ ] interactive 카드만 hover 부양 + press 안착
- [ ] `cardVariants({ isInteractive: false })`에 hover transform 미포함 (테스트)

### 6.2 List (`shared/ui/list/list-variants.ts`)

**스펙:** row hover 배경 `MOTION.colors`(fast). selected 상태 전환도 fast. 항목이 메뉴 역할(키보드 하이라이트)이라면 Dropdown과 같이 즉각으로 — 감사 후 어느 쪽인지 보고하고 결정.

**AC:** [ ] hover/selected 전환이 일관된 fast 리듬

### 6.3 Tag / Badge (`shared/ui/tag`, `shared/ui/badge`)

**스펙:** Tag 삭제(X) 버튼 hover: `MOTION.colors`. **Tag 제거(unmount) 애니메이션은 이번 범위에서 제외** — unmount 제어권이 소비자에게 있어 라이브러리 단독으로 안전하게 못 만든다. Badge는 정적 표시 컴포넌트 — 모션 없음이 정답.

**AC:** [ ] X 버튼 hover 피드백, 그 외 변경 없음

### 6.4 Form / FormField (`features/form/`)

**스펙:**

- 에러 메시지 등장: `animate-[sdui-error-in_var(--motion-duration-medium)_var(--motion-ease-out)]` — 살짝 위에서 fade-in. 사라짐은 즉시.
- 에러 메시지 컨테이너에 `aria-live="polite"` 존재 확인, 없으면 추가(모션보다 중요).
- 필드 error border 전환은 §5.4와 동일 토큰.

**AC:**

- [ ] submit 실패 시 에러 메시지가 fade-in, 스크린리더 통지
- [ ] 에러 해제 시 즉시 제거

### 6.5 명시적 제외 (작업하지 마라)

`text`, `div`, `icon`(색은 부모 `MOTION.colors` 상속), `canvas-3d`, `badge`, `title`(감사에서 인터랙티브 요소가 발견되면 hover에 `MOTION.colors`만). 이유: 정적 콘텐츠에 모션은 장식이다(원칙 §2-2).

---

## 7. Phase 4 — 문서화·정합·릴리스 준비

1. **Motion 스토리:** `apps/docs/src/stories/Motion.stories.tsx` 신규 — Colors.stories.tsx 스타일로 duration/easing 토큰 표 + 각 easing 비교 데모 + reduced-motion 안내 한 단락. 대표 인터랙션(버튼 press, 체크 pop, dropdown open) 라이브 데모 포함.
2. **README:** `packages/sdui-template-component/README.md`에 "Motion" 섹션 — 토큰 표, `MOTION` 조각 사용법, reduced-motion 정책, 스피너 예외.
3. **정합 노트(코드 변경 아님, 문서 한 줄):** `sdui-document-react-ux-improvement-plan.md` §4.2의 `--doc-duration-*` 토큰은 추후 이 모션 토큰을 소스로 alias 해야 한다고 두 플랜이 서로 참조하도록 표기. 이번에 sdui-document-react를 건드리지는 마라.
4. **MCP 재생성:** `pnpm --filter @lodado/sdui-mcp build` (component/story 변경 후 필수 — 리포 규칙).
5. **changeset:** `pnpm changeset` — `@lodado/sdui-design-files` minor(토큰 추가), `@lodado/sdui-template-component` minor(모션 추가, 죽은 클래스 제거는 동작상 개선이므로 breaking 아님).
6. 최종 검증: 루트에서 `pnpm run test && pnpm typecheck && pnpm lint`, `pnpm test:e2e`(기존 Playwright 회귀 없음), `pnpm storybook`으로 전 스토리 육안 점검.

---

## 8. 벤치마크 체크리스트 (최종 검수용)

작업 완료 후 Storybook에서 실제로 조작해 채워 보고하라. (◎ Jira/Framer보다 낫다 / ○ 동급 / △ 미달 / ✕ 없음)

| 항목 | 목표 | 결과 |
| --- | --- | --- |
| 플로팅 서피스 enter/exit (tooltip/dropdown/popover) | ○ (현재 ✕) | |
| Dialog 오버레이+컨텐츠 rise-in/out | ○ (현재 ✕) | |
| transform-origin 방향 정합 | ○ | |
| Button press 피드백 + 로딩 전환 | ○ | |
| Checkbox 체크 pop | ○ | |
| Toggle 스프링 안착 | ◎ | |
| TextField focus/error 전환 | ○ | |
| Interactive Card 부양/안착 | ○ | |
| Form 에러 등장 + aria-live | ◎ | |
| 메뉴 하이라이트 즉각성 (애니메이션 안 함) | ○ | |
| duration/easing 토큰 일원화 (하드코딩 0건) | ◎ | |
| prefers-reduced-motion 일괄 대응 | ◎ | |

---

## 9. 진행 순서 요약

1. **감사 보고:** §1 사실 검증 + 컴포넌트별 현재 모션 상태 표 → 보고 후 착수
2. Phase 0 (토큰+MOTION+테스트) → `pnpm run test` → commit
3. Phase 1 (플로팅 4종 수리) → 테스트/스토리 → 보고 → commit
4. Phase 2 (코어 컨트롤 4종) → 테스트/스토리 → 보고 → commit
5. Phase 3 (컨테이너·피드백) → 테스트/스토리 → 보고 → commit
6. Phase 4 (문서/MCP/changeset) → 최종 검증 → 벤치마크 체크리스트 채워 최종 보고

각 단계에서 루트 `pnpm run test` 실패 상태로 다음 단계 진행 금지. 브랜치는 `feat/component-micro-interactions` (또는 `agent/*`), PR 대상 `main`.
