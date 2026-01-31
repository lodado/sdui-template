---
description: Requirements Analysis - Button Component (ADS Style)
---

# Requirements Analysis: Button Component (ADS Style)

## Input

- **Product Description**: Button 컴포넌트는 Atlassian Design System (ADS) 스펙을 따르는 상호작용 요소로, 클릭 시 지정된 액션이 실행되며 일반적으로 폼 제출, 페이지 이동 등의 작업에 사용됩니다.
- **Primary Users**: SDUI 개발자, UI/UX 디자이너, 최종 사용자
- **Constraints**:
  - React 18+, TypeScript 4.3+
  - SDUI 템플릿 시스템과의 통합 필수
  - WCAG 2.1 AA 접근성 준수
  - Tailwind CSS 기반 스타일링
  - ADS (Atlassian Design System) 스펙 준수
- **Existing APIs**: `@lodado/sdui-template`의 SDUI 통합 API

---

## 1) Problem

**Problem Statement**: ADS 스펙에 따라 Button 컴포넌트가 5가지 appearance (default/primary/subtle/warning/danger), 2가지 spacing (default/compact)을 지원해야 하며, 로딩/선택/아이콘 상태와 함께 State(Default/Hover/Press/Focus/Disabled)를 모두 지원해야 합니다.

**User Value**:

- ADS 스펙과 일치하는 일관된 버튼 컴포넌트 사용
- 10가지 기본 조합 + 상태 옵션을 통한 다양한 UI 요구사항 충족
- 로딩/선택/아이콘 상태 지원으로 향상된 UX

**Business Value**:

- ADS 디자인 시스템 준수로 브랜드 일관성 유지
- 개발자 생산성 향상
- Figma 디자인과 1:1 매핑

**Success Criteria**:

- appearance(default/primary/subtle/warning/danger) 5가지 지원
- spacing(default/compact) 2가지 지원
- 총 10가지 기본 조합 모두 동작
- isLoading, isSelected, iconBefore, iconAfter 상태 지원
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

1. Button 컴포넌트를 import하여 사용
2. appearance(default/primary/subtle/warning/danger) prop 전달
3. spacing(default/compact) prop 전달
4. isDisabled 상태 설정
5. isLoading 로딩 상태 설정
6. isSelected 선택 상태 설정
7. iconBefore/iconAfter 아이콘 설정
8. onClick 이벤트 핸들러 연결
9. SDUI 문서에서 컴포넌트 사용 (ComponentFactory)
10. nodeId를 통한 상태 구독
11. eventId를 통한 이벤트 발생

**UI/UX Designer**:

1. ADS 스펙과 일치하는지 확인
2. 각 appearance별 spacing 조합 검증
3. State별 시각적 피드백 확인 (Default/Hover/Press/Focus/Disabled)
4. 로딩/선택 상태 시각적 피드백 확인
5. 아이콘 배치 확인 (iconBefore/iconAfter)
6. 접근성 기능 확인 (키보드 네비게이션, 포커스 표시)

**End User**:

1. 마우스로 버튼 클릭
2. 키보드(Tab/Enter/Space)로 버튼 활성화
3. 스크린 리더로 버튼 정보 인지
4. Disabled 상태에서 상호작용 불가 확인
5. Loading 상태에서 로딩 스피너 인지
6. Selected 상태의 시각적 피드백 인지
7. Hover/Press 상태의 시각적 피드백 인지

---

## 3) FR (table)

| ID   | Feature              | Description                                                | Priority | Testable Statement                                                            |
| ---- | -------------------- | ---------------------------------------------------------- | -------- | ----------------------------------------------------------------------------- |
| FR1  | Appearance Support   | appearance(default/primary/subtle/warning/danger) 지원     | MUST     | Given appearance="primary", when rendered, then primary styles applied        |
| FR2  | Spacing Support      | spacing(default/compact) 지원                              | MUST     | Given spacing="compact", when rendered, then compact size styles applied      |
| FR3  | State Default        | Default 상태 지원                                          | MUST     | Given default state, when rendered, then default styles applied               |
| FR4  | State Hover          | 마우스 호버 시 Hover 상태 표시                             | MUST     | Given hover event, when mouse over, then hover styles applied                 |
| FR5  | State Press          | 클릭/키보드 활성화 시 Press 상태 표시                      | MUST     | Given click/keyboard event, when activated, then press styles applied         |
| FR6  | State Disabled       | isDisabled=true 상태에서 상호작용 차단                     | MUST     | Given isDisabled=true, when clicked, then onClick not called                  |
| FR7  | State Loading        | isLoading=true 상태에서 스피너 표시 및 상호작용 차단       | MUST     | Given isLoading=true, when rendered, then spinner shown, onClick not called   |
| FR8  | State Selected       | isSelected=true 상태에서 선택 스타일 표시                  | MUST     | Given isSelected=true, when rendered, then selected styles applied            |
| FR9  | Icon Before          | iconBefore prop으로 라벨 앞 아이콘 표시                    | MUST     | Given iconBefore, when rendered, then icon shown before label                 |
| FR10 | Icon After           | iconAfter prop으로 라벨 뒤 아이콘 표시                     | MUST     | Given iconAfter, when rendered, then icon shown after label                   |
| FR11 | All Combinations     | 모든 appearance/spacing 조합 지원 (10가지)                 | MUST     | Given all combinations, when rendered, then all 10 combinations work          |
| FR12 | Event Handling       | onClick 이벤트 핸들러 지원                                 | MUST     | Given onClick handler, when clicked, then handler called with event           |
| FR13 | Keyboard Navigation  | Enter/Space 키로 버튼 활성화                               | MUST     | Given keyboard focus, when Enter/Space pressed, then onClick called           |
| FR14 | SDUI Integration     | nodeId를 통한 SDUI 통합                                    | MUST     | Given nodeId, when used with SDUI, then component subscribes to node state    |
| FR15 | Event Emission       | eventId를 통한 이벤트 발생                                 | SHOULD   | Given eventId, when event occurs, then event can be emitted                   |
| FR16 | TypeScript Types     | 모든 props에 대한 TypeScript 타입 정의                     | MUST     | Given TypeScript project, when imported, then types are available and correct |
| FR17 | Custom Styling       | className을 통한 스타일 오버라이드                         | COULD    | Given className prop, when provided, then merged with default styles          |

---

## 4) NFR (table)

| ID    | Requirement                     | Target                                          | Measurement Method   | Priority |
| ----- | ------------------------------- | ----------------------------------------------- | -------------------- | -------- |
| NFR1  | Performance - Bundle Size       | < 5KB (gzipped)                                 | Bundle analyzer      | MUST     |
| NFR2  | Performance - Render Time       | < 16ms for initial render (60fps)               | React Profiler       | MUST     |
| NFR3  | Performance - State Transitions | Hover/Press 상태 전환 < 100ms                   | Performance API      | SHOULD   |
| NFR4  | Accessibility - WCAG            | WCAG 2.1 AA compliant                           | Manual testing       | MUST     |
| NFR5  | Accessibility - Keyboard        | Tab/Enter/Space 키보드 네비게이션 지원          | Manual testing       | MUST     |
| NFR6  | Accessibility - Screen Reader   | NVDA, JAWS, VoiceOver 지원                      | Manual testing       | MUST     |
| NFR7  | Accessibility - Focus Indicator | 명확한 포커스 표시 (2px 이상)                   | Visual inspection    | MUST     |
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

- **Animation Library**: 복잡한 애니메이션 (CSS transitions만 사용)
- **Form Validation**: 폼 검증 로직 (애플리케이션 레이어에서 처리)
- **Theming System**: 커스텀 테마 설정 (CSS variables 또는 Tailwind 사용)
- **Button Group**: 버튼 그룹 컴포넌트 (별도 컴포넌트)
- **Dropdown Button**: 드롭다운 버튼 (별도 컴포넌트)
- **Split Button**: 스플릿 버튼 (별도 컴포넌트)
- **Tooltip Integration**: 툴팁 통합 (별도 컴포넌트로 처리)

---

## 6) User flows

### Flow 1: Primary Button 사용 (Happy Path)

```
1. Developer imports Button from library
2. Developer sets appearance="primary"
3. Developer sets onClick handler
4. Component renders with Primary appearance
5. User hovers over button
6. Button shows Hover state (visual feedback)
7. User clicks button
8. Button shows Press state briefly
9. onClick handler is called
10. Button returns to Default state
```

### Flow 2: Compact Danger Button 사용 (Happy Path)

```
1. Developer imports Button from library
2. Developer sets appearance="danger", spacing="compact"
3. Component renders with Danger appearance, Compact size (24px height)
4. User tabs to button (keyboard navigation)
5. Button receives focus (visible focus indicator)
6. User presses Enter
7. onClick handler is called
8. Focus moves to next element
```

### Flow 3: Loading State (Happy Path)

```
1. Developer sets isLoading=true
2. Component renders with loading spinner
3. User attempts to click button
4. onClick handler is NOT called
5. Spinner animation plays
6. Developer sets isLoading=false
7. Button returns to interactive state
```

### Flow 4: Button with Icons (Happy Path)

```
1. Developer sets iconBefore={<SearchIcon />}
2. Developer sets iconAfter={<ChevronIcon />}
3. Component renders with icons before and after label
4. Icons are properly sized (before: 16px, after: 12px)
5. User clicks button
6. onClick handler is called
```

### Flow 5: Selected/Toggle State (Happy Path)

```
1. Developer sets isSelected=true
2. Component renders with selected background
3. aria-pressed="true" is set
4. User clicks button
5. Developer toggles isSelected to false
6. Button returns to unselected state
```

### Flow 6: SDUI Integration (Happy Path)

```
1. Developer uses Button with nodeId="button-1"
2. Component subscribes to SDUI node state via useSduiNodeSubscription
3. Server updates node state (e.g., isDisabled: true)
4. Component receives updated state
5. Component re-renders with disabled state
6. User sees updated button (disabled)
```

---

## 7) Data/State model

### Component Props

**Button Component (ADS Style)**:

- `appearance?: 'default' | 'primary' | 'subtle' | 'warning' | 'danger'` (default: 'default')
- `spacing?: 'default' | 'compact'` (default: 'default')
- `isDisabled?: boolean` (default: false)
- `isLoading?: boolean` (default: false)
- `isSelected?: boolean` (default: false)
- `iconBefore?: React.ReactNode`
- `iconAfter?: React.ReactNode`
- `children: React.ReactNode` (required)
- `onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void`
- `nodeId?: string` (SDUI integration)
- `eventId?: string` (event emission)
- `className?: string` (custom styling)
- `type?: 'submit' | 'reset' | 'button'` (default: 'button')
- `asChild?: boolean` (Radix Slot pattern)

### Component State (internal)

**Visual States** (CSS-based):

- `default`: 기본 상태
- `hover`: 마우스 호버 상태
- `press`: 클릭/키보드 활성화 상태
- `focus`: 포커스 상태
- `disabled`: 비활성화 상태

**State Transitions**:

```
Default --[hover]--> Hover
Hover --[mouse leave]--> Default
Hover --[click]--> Press --[mouse up]--> Default
Default --[focus]--> Focus
Focus --[blur]--> Default
Default --[isDisabled=true]--> Disabled
Disabled --[isDisabled=false]--> Default
Default --[isLoading=true]--> Loading (non-interactive)
Loading --[isLoading=false]--> Default
```

**SDUI Integration**:

- Node state from `useSduiNodeSubscription`
- Event emission via EventMapper pattern
- Component factory pattern for rendering

---

## 8) Interfaces

### Component API

```typescript
interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  appearance?: 'default' | 'primary' | 'subtle' | 'warning' | 'danger'
  spacing?: 'default' | 'compact'
  isDisabled?: boolean
  isLoading?: boolean
  isSelected?: boolean
  iconBefore?: React.ReactNode
  iconAfter?: React.ReactNode
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  nodeId?: string
  eventId?: string
  type?: 'submit' | 'reset' | 'button'
  asChild?: boolean
}

export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>
```

### SDUI Integration

```typescript
// ComponentFactory pattern
const ButtonFactory: ComponentFactory = (id, renderNode) => {
  return (
    <Button
      nodeId={id}
      appearance={renderNode.props.appearance}
      spacing={renderNode.props.spacing}
      isDisabled={renderNode.props.isDisabled}
      isLoading={renderNode.props.isLoading}
    />
  )
}

// Usage with SDUI
;<SduiLayoutRenderer
  document={document}
  components={{
    Button: ButtonFactory,
  }}
/>
```

### Event Emission

```typescript
// Event handler signature
type EventHandler = (eventId: string, props: Record<string, unknown>) => void

// EventMapper integration
;<EventMapper nodeId={nodeId} onEvent={handleEvent}>
  <Button eventId="submit-click" />
</EventMapper>
```

---

## 9) Risks / Open questions / Assumptions

### Risks

1. **상태 관리 복잡도**

   - **Risk**: Default/Hover/Press/Focus/Disabled + Loading/Selected 상태 관리 복잡
   - **Mitigation**: CSS 기반 상태 관리 (hover, active, disabled), props 기반 loading/selected

2. **접근성 회귀**

   - **Risk**: 컴포넌트 구현 과정에서 접근성 기능 누락 가능
   - **Mitigation**: 접근성 테스트 자동화, 스크린 리더 수동 테스트

3. **번들 크기 증가**

   - **Risk**: 로딩 스피너, 아이콘 래퍼 등 추가 기능으로 인한 번들 크기 증가
   - **Mitigation**: Tree-shaking 최적화, CSS 변수 사용, 번들 크기 모니터링

4. **CSS 변수 의존성**
   - **Risk**: @lodado/sdui-design-files 패키지 의존성
   - **Mitigation**: 명확한 의존성 문서화, fallback 색상 제공

### Open Questions

1. **Appearance 기본값**

   - **Question**: 기본 Appearance는 무엇인가?
   - **Decision**: 'default' (ADS 스펙 준수)

2. **Spacing 기본값**

   - **Question**: 기본 Spacing은 무엇인가?
   - **Decision**: 'default' (32px height)

3. **Loading 시 아이콘 처리**
   - **Question**: Loading 상태에서 아이콘은 어떻게 처리하는가?
   - **Decision**: 아이콘 숨김, 스피너만 표시

### Assumptions

1. ADS 디자인 시스템에서 제공하는 CSS 변수가 정의되어 있음 (@lodado/sdui-design-files)
2. Tailwind CSS를 사용한 스타일링
3. React 18+ 사용
4. TypeScript 필수
5. SDUI 템플릿 시스템과의 통합 필수
6. 모든 상태 전환은 CSS transitions로 처리 가능
7. 접근성은 WCAG 2.1 AA 기준 준수

---

## 10) MVP + next steps

### MVP Scope

**Phase 1: Core Implementation**

- Button 컴포넌트 구현 (ADS Style)
- appearance: default, primary, subtle, warning, danger 지원
- spacing: default, compact 지원
- State: Default, Hover, Press, Focus, Disabled 지원
- isLoading 로딩 상태 지원
- isSelected 선택 상태 지원
- iconBefore/iconAfter 아이콘 지원
- onClick 이벤트 핸들링
- 키보드 네비게이션 (Enter, Space)
- SDUI 통합 (nodeId, eventId)
- TypeScript 타입 정의
- 시나리오 테스트 (32개)
- Storybook 문서화

**Success Criteria for MVP**:

- Button 컴포넌트가 모든 조합(10가지 기본)에서 동작
- ADS 스펙과 일치
- 접근성 테스트 통과
- SDUI 통합 동작 확인
- 모든 테스트 통과

### Next Steps (Post-MVP)

1. **성능 최적화**:

   - 번들 크기 최적화
   - 렌더링 성능 최적화
   - State 전환 애니메이션 최적화

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

1. Success flow - appearance="default", spacing="default"
2. Success flow - appearance="primary", spacing="default"
3. Success flow - appearance="subtle", spacing="default"
4. Success flow - appearance="warning", spacing="default"
5. Success flow - appearance="danger", spacing="default"
6. Success flow - spacing="compact" for all appearances
7. Disabled state - isDisabled=true blocks interaction
8. Loading state - isLoading=true shows spinner, blocks interaction
9. Selected state - isSelected=true shows selected styles
10. Icon before - iconBefore renders correctly
11. Icon after - iconAfter renders correctly
12. Both icons - iconBefore + iconAfter renders correctly
13. Loading hides icons - isLoading=true hides icons
14. State transitions - Hover → Press → Default
15. SDUI integration - nodeId를 통한 상태 구독
16. Event emission - eventId를 통한 이벤트 발생
17. Accessibility: focus management
18. Accessibility: keyboard navigation
19. All combinations - 10가지 appearance/spacing 조합

**EP/BVA Application**:

- **appearance**: default, primary, subtle, warning, danger (boundary: invalid value)
- **spacing**: default, compact (boundary: invalid value)
- **State**: Default, Hover, Press, Focus, Disabled
- **isDisabled**: true, false
- **isLoading**: true, false
- **isSelected**: true, false
- **Event handlers**: with handler, without handler

**Deterministic Async**:

- SDUI 상태 구독 테스트 (useSduiNodeSubscription)
- 이벤트 발생 테스트 (EventMapper)
- State 전환 타이밍 테스트 (CSS transitions)

**Visual Regression**:

- 모든 appearance/spacing 조합 스크린샷 비교
- 모든 State 조합 스크린샷 비교
- Loading/Selected 상태 시각적 검증
- 총 10가지 기본 조합 + 상태 옵션 시각적 검증
