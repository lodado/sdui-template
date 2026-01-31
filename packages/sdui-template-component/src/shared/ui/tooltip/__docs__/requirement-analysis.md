---
description: Requirements Analysis - Tooltip Component (ADS Style)
---

# Requirements Analysis: Tooltip Component (ADS Style)

## Input

- **Product Description**: Tooltip 컴포넌트는 Atlassian Design System (ADS) 스펙을 따르는 플로팅 레이블로, 마우스 호버 또는 키보드 포커스 시 UI 요소에 대한 부가 정보를 표시합니다.
- **Primary Users**: SDUI 개발자, UI/UX 디자이너, 최종 사용자
- **Constraints**:
  - React 18+, TypeScript 4.3+
  - SDUI 템플릿 시스템과의 통합 필수
  - WCAG 2.1 AA 접근성 준수
  - Tailwind CSS 기반 스타일링
  - ADS (Atlassian Design System) 스펙 준수
  - Radix UI Tooltip 프리미티브 기반
- **Existing APIs**: `@lodado/sdui-template`의 SDUI 통합 API, `@radix-ui/react-tooltip`

---

## 1) Problem

**Problem Statement**: ADS 스펙에 따라 Tooltip 컴포넌트가 4가지 side (top/right/bottom/left), 3가지 align (start/center/end)을 지원해야 하며, 지연 시간 설정, 화살표 표시 옵션, 제어/비제어 모드를 모두 지원해야 합니다.

**User Value**:

- 마우스 호버/키보드 포커스 시 즉시 피드백 제공
- 12가지 위치 조합을 통한 유연한 배치
- 접근성 지원으로 스크린 리더 사용자도 정보 접근 가능

**Business Value**:

- ADS 디자인 시스템 준수로 브랜드 일관성 유지
- 개발자 생산성 향상
- Figma 디자인과 1:1 매핑

**Success Criteria**:

- side (top/right/bottom/left) 4가지 지원
- align (start/center/end) 3가지 지원
- 총 12가지 위치 조합 모두 동작
- delayDuration 지연 시간 설정 지원
- showArrow 화살표 옵션 지원
- 제어(controlled)/비제어(uncontrolled) 모드 지원
- WCAG 2.1 AA 접근성 준수
- SDUI 템플릿 시스템과 통합 가능
- TypeScript 타입 정의 완료
- 시나리오 테스트 커버리지 100%

---

## 2) Actors & Use cases

### Actors

1. **SDUI Developer**: SDUI 템플릿 시스템을 사용하는 개발자
2. **UI/UX Designer**: ADS 디자인 시스템을 사용하는 디자이너
3. **End User**: 최종 사용자 (마우스/키보드/스크린 리더 사용자)

### Use Cases

**SDUI Developer**:

1. Tooltip 컴포넌트를 import하여 사용
2. content prop으로 툴팁 내용 설정
3. side (top/right/bottom/left) prop 전달
4. align (start/center/end) prop 전달
5. sideOffset/alignOffset으로 위치 미세 조정
6. delayDuration으로 지연 시간 설정
7. showArrow로 화살표 표시
8. open/onOpenChange로 제어 모드 사용
9. SDUI 문서에서 컴포넌트 사용 (ComponentFactory)
10. nodeId를 통한 상태 구독

**UI/UX Designer**:

1. ADS 스펙과 일치하는지 확인
2. 각 side별 align 조합 검증
3. 지연 시간 적절성 확인 (너무 빠르지 않게)
4. 화살표 스타일 확인
5. 접근성 기능 확인 (키보드 네비게이션)

**End User**:

1. 마우스로 요소 호버하여 툴팁 확인
2. Tab 키로 요소 포커스하여 툴팁 확인
3. Escape 키로 툴팁 닫기
4. 스크린 리더로 툴팁 내용 인지
5. 툴팁 위에 마우스 호버 (hoverable content)

---

## 3) FR (table)

| ID   | Feature              | Description                                | Priority | Testable Statement                                                         |
| ---- | -------------------- | ------------------------------------------ | -------- | -------------------------------------------------------------------------- |
| FR1  | Side Support         | side (top/right/bottom/left) 지원          | MUST     | Given side="bottom", when rendered, then tooltip appears below trigger     |
| FR2  | Align Support        | align (start/center/end) 지원              | MUST     | Given align="start", when rendered, then tooltip aligns to start           |
| FR3  | Side Offset          | sideOffset으로 거리 조절                   | MUST     | Given sideOffset=10, when rendered, then tooltip is 10px from trigger      |
| FR4  | Align Offset         | alignOffset으로 위치 미세 조정             | SHOULD   | Given alignOffset=5, when rendered, then tooltip offset is applied         |
| FR5  | Delay Duration       | delayDuration으로 지연 시간 설정           | MUST     | Given delayDuration=500, when hovered, then tooltip opens after 500ms      |
| FR6  | Show Arrow           | showArrow=true 시 화살표 표시              | SHOULD   | Given showArrow=true, when rendered, then arrow is visible                 |
| FR7  | Controlled Mode      | open/onOpenChange로 제어 모드              | MUST     | Given open=true, when rendered, then tooltip is visible                    |
| FR8  | Uncontrolled Mode    | defaultOpen으로 비제어 모드                | MUST     | Given defaultOpen=true, when rendered, then tooltip starts open            |
| FR9  | Hover Trigger        | 마우스 호버 시 툴팁 표시                   | MUST     | Given trigger, when hovered, then tooltip opens after delay                |
| FR10 | Focus Trigger        | 키보드 포커스 시 툴팁 표시                 | MUST     | Given trigger, when focused via Tab, then tooltip opens instantly          |
| FR11 | Escape Close         | Escape 키로 툴팁 닫기                      | MUST     | Given open tooltip, when Escape pressed, then tooltip closes               |
| FR12 | Content Prop         | content prop으로 내용 설정                 | MUST     | Given content="Help", when rendered, then tooltip shows "Help"             |
| FR13 | All Combinations     | 모든 side/align 조합 지원 (12가지)         | MUST     | Given all combinations, when rendered, then all 12 combinations work       |
| FR14 | SDUI Integration     | nodeId를 통한 SDUI 통합                    | MUST     | Given nodeId, when used with SDUI, then component subscribes to node state |
| FR15 | TypeScript Types     | 모든 props에 대한 TypeScript 타입 정의     | MUST     | Given TypeScript project, when imported, then types are available          |
| FR16 | Custom Styling       | className을 통한 스타일 오버라이드         | COULD    | Given className prop, when provided, then merged with default styles       |
| FR17 | Collision Avoidance  | 화면 경계에서 자동 위치 조정               | SHOULD   | Given side="top" near edge, when rendered, then tooltip flips to bottom    |

---

## 4) NFR (table)

| ID    | Requirement                     | Target                                          | Measurement Method   | Priority |
| ----- | ------------------------------- | ----------------------------------------------- | -------------------- | -------- |
| NFR1  | Performance - Bundle Size       | < 3KB (gzipped)                                 | Bundle analyzer      | MUST     |
| NFR2  | Performance - Render Time       | < 16ms for initial render (60fps)               | React Profiler       | MUST     |
| NFR3  | Performance - Open Animation    | 툴팁 열림/닫힘 애니메이션 < 150ms               | Performance API      | SHOULD   |
| NFR4  | Accessibility - WCAG            | WCAG 2.1 AA compliant                           | Manual testing       | MUST     |
| NFR5  | Accessibility - Keyboard        | Tab/Escape 키보드 네비게이션 지원               | Manual testing       | MUST     |
| NFR6  | Accessibility - Screen Reader   | NVDA, JAWS, VoiceOver 지원                      | Manual testing       | MUST     |
| NFR7  | Accessibility - Role            | role="tooltip" 적용                             | DOM inspection       | MUST     |
| NFR8  | Accessibility - Color Contrast  | 텍스트/배경 대비비율 4.5:1 이상 (AA)            | Color contrast tool  | MUST     |
| NFR9  | Compatibility - React           | React 18+                                       | Type definitions     | MUST     |
| NFR10 | Compatibility - TypeScript      | TypeScript 4.3+                                 | Type checking        | MUST     |
| NFR11 | Compatibility - Next.js         | Next.js 13+ (App Router)                        | Integration tests    | MUST     |
| NFR12 | Reliability - Error Handling    | 잘못된 prop 전달 시 기본값 사용                 | Error boundary tests | SHOULD   |
| NFR13 | Maintainability - Documentation | JSDoc 및 Storybook 문서화                       | Code review          | MUST     |
| NFR14 | Security - XSS Prevention       | React auto-escaping, no dangerouslySetInnerHTML | Code review          | MUST     |
| NFR15 | Design System Compliance        | ADS 스펙과 100% 일치                            | Visual regression    | MUST     |

---

## 5) Out of scope

- **Rich Content**: HTML/컴포넌트 내용 (현재는 텍스트만 지원)
- **Interactive Content**: 툴팁 내 버튼/링크 (Popover 사용 권장)
- **Custom Trigger Events**: 커스텀 트리거 이벤트 (click-to-open 등)
- **Multiple Tooltips**: 한 트리거에 여러 툴팁
- **Theming System**: 커스텀 테마 설정 (CSS variables 또는 Tailwind 사용)
- **Animation Customization**: 커스텀 애니메이션

---

## 6) User flows

### Flow 1: 마우스 호버로 툴팁 표시 (Happy Path)

```
1. Developer imports Tooltip from library
2. Developer sets content="Add to library"
3. Developer wraps trigger element with Tooltip
4. Component renders with trigger visible
5. User hovers over trigger
6. After delayDuration (default 300ms), tooltip opens
7. User moves mouse away
8. Tooltip closes
```

### Flow 2: 키보드 포커스로 툴팁 표시 (Happy Path)

```
1. Developer imports Tooltip from library
2. Developer sets content="Help"
3. User presses Tab to focus trigger
4. Tooltip opens instantly (no delay)
5. User presses Escape
6. Tooltip closes
7. User presses Tab again to move focus
8. Tooltip closes when focus leaves
```

### Flow 3: 제어 모드 사용 (Happy Path)

```
1. Developer sets open={isOpen} and onOpenChange={setIsOpen}
2. Developer manages open state externally
3. When isOpen=true, tooltip shows
4. When isOpen=false, tooltip hides
5. onOpenChange is called when user interacts
```

### Flow 4: 화살표와 함께 사용 (Happy Path)

```
1. Developer sets showArrow=true
2. Developer sets side="bottom"
3. Component renders tooltip below trigger
4. Arrow points towards trigger
5. Arrow matches tooltip background color
```

### Flow 5: SDUI 통합 (Happy Path)

```
1. Developer uses Tooltip with nodeId="tooltip-1"
2. Component subscribes to SDUI node state via useSduiNodeSubscription
3. Server updates node state (e.g., content: "Updated text")
4. Component receives updated state
5. Component re-renders with new content
6. User sees updated tooltip
```

### Flow 6: 화면 경계에서 자동 조정 (Failure Mode)

```
1. Developer sets side="top"
2. Trigger is near top edge of viewport
3. User hovers over trigger
4. Radix detects collision with viewport
5. Tooltip automatically flips to side="bottom"
6. User sees tooltip below trigger
```

---

## 7) Data/State model

### Component Props

**Tooltip Component (ADS Style)**:

- `content: React.ReactNode` (required)
- `side?: 'top' | 'right' | 'bottom' | 'left'` (default: 'top')
- `sideOffset?: number` (default: 4)
- `align?: 'start' | 'center' | 'end'` (default: 'center')
- `alignOffset?: number` (default: 0)
- `delayDuration?: number` (default: 300)
- `skipDelayDuration?: number` (default: 300)
- `showArrow?: boolean` (default: false)
- `open?: boolean` (controlled mode)
- `defaultOpen?: boolean` (default: false)
- `onOpenChange?: (open: boolean) => void`
- `children: React.ReactNode` (required, trigger element)
- `className?: string` (custom styling)
- `nodeId?: string` (SDUI integration)

**TooltipProvider Component**:

- `delayDuration?: number` (default: 300)
- `skipDelayDuration?: number` (default: 300)
- `disableHoverableContent?: boolean` (default: false)
- `children: React.ReactNode` (required)

### Component State (internal)

**Open States** (Radix-managed):

- `closed`: 툴팁 숨김
- `delayed-open`: 지연 후 열림 예정
- `instant-open`: 즉시 열림 (포커스 등)

**State Transitions**:

```
Closed --[hover after delay]--> Open
Closed --[focus]--> Open (instant)
Open --[mouse leave]--> Closed
Open --[blur]--> Closed
Open --[Escape]--> Closed
Open --[scroll]--> Closed (optional)
```

**SDUI Integration**:

- Node state from `useSduiNodeSubscription`
- Component factory pattern for rendering

---

## 8) Interfaces

### Component API

```typescript
interface TooltipProps {
  content: React.ReactNode
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  delayDuration?: number
  skipDelayDuration?: number
  showArrow?: boolean
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  nodeId?: string
}

interface TooltipProviderProps {
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
  children: React.ReactNode
}
```

### SDUI Integration

```typescript
// ComponentFactory pattern
const TooltipFactory: ComponentFactory = (id, renderNode, renderChildren) => {
  return <TooltipContainer id={id} parentPath={[]} />
}

// Usage with SDUI
<SduiLayoutRenderer
  document={document}
  components={{
    Tooltip: TooltipFactory,
  }}
/>
```

### SDUI Document Example

```json
{
  "id": "tooltip-1",
  "type": "Tooltip",
  "state": {
    "content": "Add to library",
    "side": "top",
    "showArrow": true
  },
  "children": [
    {
      "id": "button-1",
      "type": "Button",
      "state": { "appearance": "primary" },
      "children": [{ "id": "text-1", "type": "Text", "state": { "content": "+" } }]
    }
  ]
}
```

---

## 9) Risks / Open questions / Assumptions

### Risks

1. **Radix UI 의존성**

   - **Risk**: Radix UI 버전 업데이트 시 호환성 문제 가능
   - **Mitigation**: 버전 고정, 업데이트 테스트 자동화

2. **접근성 회귀**

   - **Risk**: 커스터마이징 과정에서 접근성 기능 손상 가능
   - **Mitigation**: 접근성 테스트 자동화, 스크린 리더 수동 테스트

3. **애니메이션 성능**

   - **Risk**: 많은 툴팁 사용 시 성능 저하
   - **Mitigation**: CSS 기반 애니메이션, GPU 가속

4. **Z-index 충돌**
   - **Risk**: 다른 오버레이 컴포넌트와 z-index 충돌
   - **Mitigation**: Portal 사용, z-index 체계 문서화

### Open Questions

1. **delayDuration 기본값**

   - **Question**: 적절한 기본 지연 시간은?
   - **Decision**: 300ms (ADS 권장, Radix 기본값 700ms보다 빠르게)

2. **showArrow 기본값**

   - **Question**: 기본적으로 화살표를 표시할까?
   - **Decision**: false (ADS 스펙 기준 화살표 없음)

3. **hoverable content**
   - **Question**: 툴팁 위에 마우스 호버 시 유지할까?
   - **Decision**: Provider의 disableHoverableContent로 제어 가능

### Assumptions

1. ADS 디자인 시스템에서 제공하는 CSS 변수가 정의되어 있음 (@lodado/sdui-design-files)
2. Tailwind CSS를 사용한 스타일링
3. React 18+ 사용
4. TypeScript 필수
5. SDUI 템플릿 시스템과의 통합 필수
6. Radix UI Tooltip 프리미티브 사용
7. 접근성은 WCAG 2.1 AA 기준 준수

---

## 10) MVP + next steps

### MVP Scope

**Phase 1: Core Implementation**

- Tooltip 컴포넌트 구현 (ADS Style)
- side: top, right, bottom, left 지원
- align: start, center, end 지원
- sideOffset/alignOffset 지원
- delayDuration 지연 시간 지원
- showArrow 화살표 지원
- open/onOpenChange 제어 모드 지원
- 키보드 네비게이션 (Tab, Escape)
- SDUI 통합 (nodeId)
- TypeScript 타입 정의
- 시나리오 테스트
- Storybook 문서화

**Success Criteria for MVP**:

- Tooltip 컴포넌트가 모든 조합(12가지 위치)에서 동작
- ADS 스펙과 일치 (다크 배경, 흰색 텍스트)
- 접근성 테스트 통과
- SDUI 통합 동작 확인
- 모든 테스트 통과

### Next Steps (Post-MVP)

1. **Rich Content 지원**:

   - HTML/컴포넌트 내용 지원
   - Interactive content (links, buttons)

2. **문서화 강화**:

   - Storybook 스토리 추가
   - 사용 예제 추가

3. **테스트 강화**:

   - 시각적 회귀 테스트
   - 접근성 자동화 테스트
   - 통합 테스트 추가

4. **디자인 시스템 통합**:
   - 디자인 토큰 연동
   - 테마 시스템 연동 (향후)

### Test Strategy

**Scenario Tests (P0, Required)**:

1. Hover trigger shows tooltip after delay
2. Focus trigger shows tooltip instantly
3. Escape key closes tooltip
4. Tab key shows/hides tooltip
5. Side positioning - top
6. Side positioning - right
7. Side positioning - bottom
8. Side positioning - left
9. Alignment - start
10. Alignment - center
11. Alignment - end
12. Delay duration - 0ms (instant)
13. Delay duration - default (300ms)
14. Controlled mode - open=true
15. Controlled mode - open=false
16. Arrow rendering - showArrow=true
17. SDUI integration - nodeId
18. Content rendering
19. Custom className merging
20. All side/align combinations (12가지)

**EP/BVA Application**:

- **side**: top (default), right, bottom, left (boundary: invalid value)
- **align**: start, center (default), end (boundary: invalid value)
- **sideOffset**: 0 (min boundary), 4 (default), 100 (large)
- **alignOffset**: -10 (negative), 0 (default), 10 (positive)
- **delayDuration**: 0 (boundary/instant), 300 (default), 1000 (slow)
- **showArrow**: true, false (default)
- **open**: controlled true, controlled false, uncontrolled

**Deterministic Async**:

- 지연 시간 테스트 (fake timers 사용)
- SDUI 상태 구독 테스트 (useSduiNodeSubscription)
- 애니메이션 완료 대기 테스트

**Visual Regression**:

- 모든 side/align 조합 스크린샷 비교
- 화살표 있음/없음 시각적 검증
- 다크 배경, 흰색 텍스트 색상 검증
- 총 12가지 위치 조합 시각적 검증
