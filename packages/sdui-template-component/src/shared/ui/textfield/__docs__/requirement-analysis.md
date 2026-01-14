---
description: Requirements Analysis - TextField Component
---

# Requirements Analysis: TextField Component

## Input

- **Product Description**: TextField 컴포넌트는 사용자로부터 텍스트 입력을 받는 입력 필드 컴포넌트입니다. Label, Container, Help message, Left Icon, Placeholder, Right Icon 등의 요소로 구성되며, 다양한 상태(Default, Focus, Error, Disabled)를 지원합니다.
- **Primary Users**: SDUI 개발자, UI/UX 디자이너, 최종 사용자
- **Constraints**:
  - React 18+, TypeScript 4.3+
  - SDUI 템플릿 시스템과의 통합 필수
  - WCAG 2.1 AA 접근성 준수
  - CSS 기반 스타일링 (CSS variables 또는 Tailwind)
- **Existing APIs**: `@lodado/sdui-template`의 SDUI 통합 API
- **Design Reference**: Figma 디자인 문서 (node-id: 141-5363)

---

## 1) Problem

**Problem Statement**: 사용자로부터 텍스트 입력을 받기 위한 TextField 컴포넌트가 필요합니다. 디자인 시스템 스펙에 따라 Label(optional), Container, Help message(optional), Left Icon(optional), Placeholder, Right Icon(optional) 등의 요소를 지원하며, 다양한 상태(Default, Focus, Error, Disabled)와 상호작용을 지원해야 합니다.

**User Value**:

- 일관된 텍스트 입력 인터페이스 제공
- 명확한 라벨과 도움말로 사용자 가이드 제공
- 접근성 준수로 모든 사용자가 동등하게 사용 가능
- 다양한 상태 피드백으로 사용자 경험 개선

**Business Value**:

- 디자인 시스템 준수로 브랜드 일관성 유지
- 개발자 생산성 향상 (재사용 가능한 컴포넌트)
- 접근성 준수로 법적 요구사항 충족
- 사용자 경험 개선으로 전환율 향상

**Success Criteria**:

- Label, Container, Help message, Left Icon, Placeholder, Right Icon 요소 모두 지원
- Default, Focus, Error, Disabled 상태 모두 지원
- WCAG 2.1 AA 접근성 준수
- SDUI 템플릿 시스템과 통합 가능
- TypeScript 타입 정의 완료
- 시나리오 테스트 커버리지 100%

---

## 2) Actors & Use cases

### Actors

1. **SDUI Developer**: SDUI 템플릿 시스템을 사용하는 개발자
2. **UI/UX Designer**: 디자인 시스템을 사용하는 디자이너
3. **End User**: 최종 사용자 (마우스/키보드/스크린 리더 사용자)

### Use Cases

**SDUI Developer**:

1. TextField 컴포넌트를 import하여 사용
2. Label prop 설정 (optional)
3. Placeholder prop 설정
4. Help message prop 설정 (optional)
5. Left Icon prop 설정 (optional)
6. Right Icon prop 설정 (optional)
7. Error 상태 설정
8. Disabled 상태 설정
9. onChange 이벤트 핸들러 연결
10. onFocus/onBlur 이벤트 핸들러 연결
11. SDUI 문서에서 컴포넌트 사용 (ComponentFactory)
12. nodeId를 통한 상태 구독
13. eventId를 통한 이벤트 발생
14. 폼 검증과 통합

**UI/UX Designer**:

1. 디자인 시스템 스펙과 일치하는지 확인
2. 각 상태별 시각적 피드백 확인 (Default/Focus/Error/Disabled)
3. Label, Help message의 가독성 확인
4. Icon 위치와 크기 확인
5. 접근성 기능 확인 (키보드 네비게이션, 포커스 표시, 라벨 연결)

**End User**:

1. 마우스로 입력 필드 클릭하여 포커스
2. 키보드(Tab)로 입력 필드 포커스
3. 텍스트 입력
4. Placeholder를 통한 입력 가이드 확인
5. Help message를 통한 도움말 확인
6. Error 상태에서 오류 메시지 확인
7. Right Icon을 통한 추가 기능 사용 (예: 텍스트 지우기, 비밀번호 보기/숨기기)
8. 스크린 리더로 입력 필드 정보 인지
9. Disabled 상태에서 상호작용 불가 확인
10. Focus 상태의 시각적 피드백 인지

---

## 3) FR (table)

| ID   | Feature                    | Description                                    | Priority | Testable Statement                                                              |
| ---- | -------------------------- | ---------------------------------------------- | -------- | ------------------------------------------------------------------------------- |
| FR1  | Label Support              | Label(optional) 표시 지원                       | MUST     | Given label="Email", when rendered, then label displayed above input field     |
| FR2  | Container                  | 텍스트 입력 영역(Container) 지원               | MUST     | Given rendered, then input container displayed with proper styling             |
| FR3  | Placeholder Support        | Placeholder 텍스트 표시 지원                   | MUST     | Given placeholder="Enter email", when rendered, then placeholder displayed     |
| FR4  | Help Message Support       | Help message(optional) 표시 지원               | MUST     | Given helpMessage="Enter your email", when rendered, then help message displayed |
| FR5  | Left Icon Support          | Left Icon(optional) 표시 지원                   | SHOULD   | Given leftIcon, when rendered, then left icon displayed inside input container  |
| FR6  | Right Icon Support         | Right Icon(optional) 표시 지원                  | SHOULD   | Given rightIcon, when rendered, then right icon displayed inside input container |
| FR7  | State Default              | Default 상태 지원                               | MUST     | Given default state, when rendered, then default styles applied                  |
| FR8  | State Focus                | 포커스 상태 표시                                | MUST     | Given focus event, when focused, then focus styles applied                      |
| FR9  | State Error                | Error 상태 및 오류 메시지 표시                 | MUST     | Given error=true, when rendered, then error styles and message displayed        |
| FR10 | State Disabled             | Disabled 상태에서 상호작용 차단                | MUST     | Given disabled=true, when clicked, then input not focused                       |
| FR11 | Text Input                 | 텍스트 입력 기능                                | MUST     | Given user input, when typed, then value updated                                 |
| FR12 | onChange Handler           | onChange 이벤트 핸들러 지원                     | MUST     | Given onChange handler, when value changed, then handler called with new value  |
| FR13 | onFocus/onBlur Handler     | onFocus/onBlur 이벤트 핸들러 지원               | MUST     | Given onFocus handler, when focused, then handler called                        |
| FR14 | Keyboard Navigation        | Tab 키로 포커스 이동                            | MUST     | Given keyboard focus, when Tab pressed, then focus moves to next element        |
| FR15 | Right Icon Click Handler   | Right Icon 클릭 이벤트 핸들러 지원              | SHOULD   | Given rightIcon onClick, when clicked, then handler called                      |
| FR16 | SDUI Integration           | nodeId를 통한 SDUI 통합                         | MUST     | Given nodeId, when used with SDUI, then component subscribes to node state     |
| FR17 | Event Emission             | eventId를 통한 이벤트 발생                      | SHOULD   | Given eventId, when event occurs, then event can be emitted                     |
| FR18 | TypeScript Types           | 모든 props에 대한 TypeScript 타입 정의          | MUST     | Given TypeScript project, when imported, then types are available and correct    |
| FR19 | Custom Styling             | className을 통한 스타일 오버라이드              | COULD    | Given className prop, when provided, then merged with default styles            |
| FR20 | Value Control              | controlled/uncontrolled 컴포넌트 지원          | MUST     | Given value prop, when provided, then controlled mode, else uncontrolled mode   |
| FR21 | Input Types                | text, email, password, number 등 input type 지원 | MUST     | Given type="email", when rendered, then email input type applied                 |
| FR22 | Max Length                 | maxLength 속성 지원                             | SHOULD   | Given maxLength=100, when typed, then input limited to 100 characters           |
| FR23 | Required Field             | required 속성 지원                              | SHOULD   | Given required=true, when rendered, then required attribute set                 |
| FR24 | Auto Complete              | autocomplete 속성 지원                          | COULD    | Given autocomplete="email", when rendered, then autocomplete attribute set      |

---

## 4) NFR (table)

| ID    | Requirement                     | Target                                          | Measurement Method   | Priority |
| ----- | ------------------------------- | ----------------------------------------------- | -------------------- | -------- |
| NFR1  | Performance - Bundle Size       | < 8KB (gzipped)                                 | Bundle analyzer      | MUST     |
| NFR2  | Performance - Render Time       | < 16ms for initial render (60fps)                | React Profiler       | MUST     |
| NFR3  | Performance - Input Response    | 입력 반응 시간 < 16ms (60fps)                    | Performance API      | MUST     |
| NFR4  | Accessibility - WCAG           | WCAG 2.1 AA compliant                           | Manual testing       | MUST     |
| NFR5  | Accessibility - Keyboard        | Tab 키보드 네비게이션 지원                      | Manual testing       | MUST     |
| NFR6  | Accessibility - Screen Reader   | NVDA, JAWS, VoiceOver 지원                      | Manual testing       | MUST     |
| NFR7  | Accessibility - Focus Indicator | 명확한 포커스 표시 (2px 이상)                   | Visual inspection    | MUST     |
| NFR8  | Accessibility - Label Connection | label과 input 연결 (for/id 또는 aria-labelledby) | Code review          | MUST     |
| NFR9  | Accessibility - Error Announcement | 오류 메시지 스크린 리더 알림 (aria-live)        | Manual testing       | MUST     |
| NFR10 | Accessibility - Color Contrast  | 텍스트/배경 대비비율 4.5:1 이상 (AA)            | Color contrast tool  | MUST     |
| NFR11 | Compatibility - React           | React 18+                                       | Type definitions     | MUST     |
| NFR12 | Compatibility - TypeScript      | TypeScript 4.3+                                 | Type checking        | MUST     |
| NFR13 | Compatibility - Next.js         | Next.js 13+ (App Router)                        | Integration tests    | MUST     |
| NFR14 | Compatibility - Browsers        | Chrome, Firefox, Safari, Edge 최신 2개 버전      | Browser testing      | MUST     |
| NFR15 | Reliability - Error Handling    | 잘못된 prop 전달 시 기본값 사용                 | Error boundary tests | SHOULD   |
| NFR16 | Maintainability - Documentation | JSDoc 및 Storybook 문서화                       | Code review          | MUST     |
| NFR17 | Security - XSS Prevention      | React auto-escaping, no dangerouslySetInnerHTML | Code review          | MUST     |
| NFR18 | Security - Input Sanitization   | 사용자 입력 sanitization (애플리케이션 레이어)  | Code review          | SHOULD   |
| NFR19 | Design System Compliance        | 디자인 시스템 스펙과 100% 일치                  | Visual regression    | MUST     |
| NFR20 | Form Integration                | HTML5 form 요소와 통합 가능                      | Integration tests    | MUST     |

---

## 5) Out of scope

- **Textarea Component**: 여러 줄 텍스트 입력 (별도 컴포넌트)
- **Autocomplete/Dropdown**: 자동완성 기능 (별도 컴포넌트)
- **Date/Time Picker**: 날짜/시간 선택 (별도 컴포넌트)
- **Rich Text Editor**: 리치 텍스트 에디터 (별도 컴포넌트)
- **File Upload**: 파일 업로드 기능 (별도 컴포넌트)
- **Form Validation Logic**: 폼 검증 로직 (애플리케이션 레이어에서 처리)
- **Masked Input**: 입력 마스킹 (예: 전화번호 형식) (별도 컴포넌트 또는 prop으로 확장 가능)
- **Character Counter**: 글자 수 카운터 (별도 컴포넌트 또는 prop으로 확장 가능)
- **Input Group**: 여러 입력 필드 그룹화 (별도 컴포넌트)
- **Floating Label**: 플로팅 라벨 애니메이션 (현재 스펙에 없음)
- **Theming System**: 커스텀 테마 설정 (CSS variables 또는 Tailwind 사용)
- **Animation Library**: 복잡한 애니메이션 (CSS transitions만 사용)
- **Internationalization**: 다국어 지원 (애플리케이션 레이어에서 처리)

---

## 6) User flows

### Flow 1: 기본 텍스트 입력 (Happy Path)

```
1. Developer imports TextField from library
2. Developer sets label="Email", placeholder="Enter your email"
3. Component renders with label above input field
4. Component renders with placeholder inside input field
5. User clicks on input field
6. Input field receives focus (focus styles applied)
7. User types "user@example.com"
8. onChange handler is called with "user@example.com"
9. Value is updated and displayed
10. User clicks outside input field
11. Input field loses focus (blur event)
12. onBlur handler is called
```

### Flow 2: Error 상태 (Happy Path)

```
1. Developer sets error=true, errorMessage="Invalid email format"
2. Component renders with error styles (red border, red text)
3. Component displays error message below input field
4. User sees error state visually
5. Screen reader announces error message
6. User corrects input
7. Developer sets error=false
8. Component returns to default state
9. Error message is hidden
```

### Flow 3: Right Icon 클릭 (Happy Path)

```
1. Developer sets rightIcon={<ClearIcon />}, onRightIconClick={handleClear}
2. Component renders with right icon inside input field
3. User types some text
4. User clicks right icon
5. onRightIconClick handler is called
6. Text is cleared (or other action performed)
7. Input field value is updated
```

### Flow 4: Disabled 상태 (Happy Path)

```
1. Developer sets disabled=true
2. Component renders with disabled styles
3. Input field is not focusable (tabIndex=-1)
4. User attempts to click input field
5. Input field does not receive focus
6. User attempts keyboard navigation (Tab)
7. Input field is skipped
8. onChange handler is NOT called
```

### Flow 5: SDUI Integration (Happy Path)

```
1. Developer uses TextField with nodeId="textfield-1"
2. Component subscribes to SDUI node state via useSduiNodeSubscription
3. Server updates node state (e.g., value: "new value", error: true)
4. Component receives updated state
5. Component re-renders with updated value and error state
6. User sees updated TextField
```

### Flow 6: 키보드 네비게이션 (Happy Path)

```
1. User presses Tab key
2. Focus moves to TextField
3. TextField receives focus (focus styles applied)
4. Screen reader announces label and placeholder
5. User types text
6. User presses Tab key again
7. Focus moves to next focusable element
8. TextField loses focus (blur event)
9. onBlur handler is called
```

### Flow 7: Help Message 표시 (Happy Path)

```
1. Developer sets helpMessage="Enter a valid email address"
2. Component renders with help message below input field
3. User sees help message
4. Screen reader can announce help message (if properly connected)
```

### Flow 8: Left Icon 표시 (Happy Path)

```
1. Developer sets leftIcon={<EmailIcon />}
2. Component renders with left icon inside input field
3. Icon is positioned before placeholder/text
4. Text input area is adjusted to accommodate icon
```

### Flow 9: Controlled Component (Happy Path)

```
1. Developer sets value="initial value", onChange={handleChange}
2. Component renders with "initial value" displayed
3. User types new text
4. onChange handler is called with new value
5. Developer updates state with new value
6. Component re-renders with updated value
```

### Flow 10: Uncontrolled Component (Happy Path)

```
1. Developer does not set value prop
2. Component uses internal state
3. User types text
4. Component updates internal state
5. Value is displayed immediately
6. Developer can access value via ref
```

### Flow 11: Invalid Props (Failure Path)

```
1. Developer passes invalid type prop (e.g., type="invalid")
2. Component uses default type="text"
3. Component continues to render with default type
```

### Flow 12: 빠른 입력 (Edge Case)

```
1. User rapidly types text
2. onChange handler is called for each keystroke
3. Component updates value for each keystroke
4. No visual glitches or performance issues
5. All keystrokes are captured correctly
```

---

## 7) Data/State model

### Component Props

**TextField Component**:

- `label?: string` (optional) - 입력 필드 위에 표시되는 라벨
- `placeholder?: string` (optional) - 입력 필드 내부에 표시되는 플레이스홀더
- `helpMessage?: string` (optional) - 입력 필드 아래에 표시되는 도움말
- `error?: boolean` (default: false) - 에러 상태 여부
- `errorMessage?: string` (optional) - 에러 메시지 (error=true일 때 표시)
- `disabled?: boolean` (default: false) - 비활성화 상태 여부
- `value?: string` (optional) - controlled 컴포넌트용 값
- `defaultValue?: string` (optional) - uncontrolled 컴포넌트용 초기값
- `onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void` - 값 변경 핸들러
- `onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void` - 포커스 핸들러
- `onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void` - 블러 핸들러
- `leftIcon?: React.ReactNode` (optional) - 왼쪽 아이콘
- `rightIcon?: React.ReactNode` (optional) - 오른쪽 아이콘
- `onRightIconClick?: (event: React.MouseEvent) => void` (optional) - 오른쪽 아이콘 클릭 핸들러
- `type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'` (default: 'text')
- `maxLength?: number` (optional) - 최대 입력 길이
- `required?: boolean` (default: false) - 필수 입력 여부
- `autocomplete?: string` (optional) - 자동완성 힌트
- `className?: string` (optional) - 추가 CSS 클래스
- `nodeId?: string` (optional) - SDUI 통합용 노드 ID
- `eventId?: string` (optional) - 이벤트 발생용 이벤트 ID
- `id?: string` (optional) - input 요소의 id (label 연결용)
- `name?: string` (optional) - form 제출용 name 속성

### Component State (internal)

**Visual States** (CSS-based):

- `default`: 기본 상태 (포커스 없음, 에러 없음)
- `focus`: 포커스 상태 (입력 필드에 포커스가 있을 때)
- `error`: 에러 상태 (error=true일 때)
- `disabled`: 비활성화 상태 (disabled=true일 때)

**State Transitions**:

```
Default --[focus]--> Focus
Focus --[blur]--> Default
Default --[error=true]--> Error
Error --[error=false]--> Default
Default --[disabled=true]--> Disabled
Disabled --[disabled=false]--> Default
Focus --[error=true]--> Error (Focus + Error)
```

**Value State** (controlled/uncontrolled):

- Controlled: `value` prop으로 외부에서 제어
- Uncontrolled: 내부 `useState`로 관리, `defaultValue`로 초기값 설정

**SDUI Integration**:

- Node state from `useSduiNodeSubscription`
- Event emission via EventMapper pattern
- Component factory pattern for rendering

---

## 8) Interfaces

### Component API

```typescript
interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'> {
  /** Label displayed above the input field */
  label?: string
  /** Placeholder text displayed inside the input field */
  placeholder?: string
  /** Help message displayed below the input field */
  helpMessage?: string
  /** Error state */
  error?: boolean
  /** Error message displayed when error is true */
  errorMessage?: string
  /** Disabled state */
  disabled?: boolean
  /** Controlled value */
  value?: string
  /** Uncontrolled default value */
  defaultValue?: string
  /** Change event handler */
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  /** Focus event handler */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Blur event handler */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void
  /** Left icon displayed inside the input field */
  leftIcon?: React.ReactNode
  /** Right icon displayed inside the input field */
  rightIcon?: React.ReactNode
  /** Right icon click handler */
  onRightIconClick?: (event: React.MouseEvent) => void
  /** Input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search'
  /** Maximum input length */
  maxLength?: number
  /** Required field indicator */
  required?: boolean
  /** Autocomplete hint */
  autocomplete?: string
  /** Additional CSS classes */
  className?: string
  /** SDUI node ID for integration */
  nodeId?: string
  /** Event ID for event emission */
  eventId?: string
}

export const TextField: React.ForwardRefExoticComponent<TextFieldProps & React.RefAttributes<HTMLInputElement>>
```

### SDUI Integration

```typescript
// ComponentFactory pattern
const TextFieldFactory: ComponentFactory = (id, renderNode) => {
  return (
    <TextField
      nodeId={id}
      label={renderNode.props.label}
      placeholder={renderNode.props.placeholder}
      helpMessage={renderNode.props.helpMessage}
      error={renderNode.props.error}
      errorMessage={renderNode.props.errorMessage}
      disabled={renderNode.props.disabled}
      value={renderNode.props.value}
      type={renderNode.props.type}
    />
  )
}

// Usage with SDUI
;<SduiLayoutRenderer
  document={document}
  components={{
    TextField: TextFieldFactory,
  }}
/>
```

### Event Emission

```typescript
// Event handler signature
type EventHandler = (eventId: string, props: Record<string, unknown>) => void

// EventMapper integration
;<EventMapper nodeId={nodeId} onEvent={handleEvent}>
  <TextField eventId="input-change" onChange={handleChange} />
</EventMapper>
```

### Form Integration

```typescript
// HTML5 form integration
<form onSubmit={handleSubmit}>
  <TextField
    label="Email"
    type="email"
    name="email"
    required
    id="email-input"
  />
  <button type="submit">Submit</button>
</form>
```

---

## 9) Risks / Open questions / Assumptions

### Risks

1. **상태 관리 복잡도**
   - **Risk**: Default/Focus/Error/Disabled 4가지 상태와 controlled/uncontrolled 모드 관리 복잡
   - **Mitigation**: CSS 기반 상태 관리 (focus, disabled), React hooks로 값 관리, 명확한 prop 인터페이스

2. **접근성 회귀**
   - **Risk**: label-input 연결, error 메시지 알림, 포커스 관리 등 접근성 기능 누락 가능
   - **Mitigation**: 접근성 테스트 자동화, 스크린 리더 수동 테스트, ARIA 속성 적절히 사용

3. **성능 이슈**
   - **Risk**: 빠른 입력 시 onChange 핸들러 호출 빈도로 인한 성능 저하 가능
   - **Mitigation**: debounce는 애플리케이션 레이어에서 처리, 컴포넌트는 최소한의 렌더링만 수행

4. **Icon 위치 및 크기**
   - **Risk**: Left/Right Icon의 위치와 크기가 디자인 시스템과 불일치 가능
   - **Mitigation**: 디자인 토큰 사용, 시각적 회귀 테스트, 명확한 스펙 문서화

5. **에러 메시지 표시 전략**
   - **Risk**: 에러 메시지가 helpMessage와 충돌하거나 접근성 문제 발생 가능
   - **Mitigation**: 에러 상태일 때는 errorMessage 우선 표시, aria-live로 스크린 리더 알림

### Open Questions

1. **Help Message vs Error Message**
   - **Question**: helpMessage와 errorMessage를 동시에 표시할 수 있는가?
   - **Decision**: error=true일 때는 errorMessage만 표시, helpMessage는 숨김

2. **Label 필수 여부**
   - **Question**: Label이 필수인가, optional인가?
   - **Decision**: Optional (디자인 스펙에 따라), 단 접근성을 위해 aria-label은 권장

3. **Right Icon 클릭 시 포커스 처리**
   - **Question**: Right Icon 클릭 시 input에 포커스가 유지되어야 하는가?
   - **Decision**: Right Icon 클릭 시에도 input 포커스 유지 (일반적인 UX 패턴)

4. **Placeholder vs Label**
   - **Question**: Placeholder와 Label을 동시에 사용할 수 있는가?
   - **Decision**: 가능 (Label은 위에, Placeholder는 input 내부에)

5. **Controlled vs Uncontrolled 기본값**
   - **Question**: value prop이 없을 때 uncontrolled로 동작하는가?
   - **Decision**: value prop이 있으면 controlled, 없으면 uncontrolled (React 표준 패턴)

6. **에러 상태 시 포커스 동작**
   - **Question**: 에러 상태일 때 자동으로 포커스를 input에 맞춰야 하는가?
   - **Decision**: 자동 포커스는 하지 않음 (애플리케이션 레이어에서 처리)

### Assumptions

1. 디자인 시스템에서 제공하는 CSS 변수가 정의되어 있음 (@lodado/sdui-design-files)
2. CSS variables 또는 Tailwind CSS를 사용한 스타일링
3. React 18+ 사용
4. TypeScript 필수
5. SDUI 템플릿 시스템과의 통합 필수
6. 모든 상태 전환은 CSS transitions로 처리 가능
7. 접근성은 WCAG 2.1 AA 기준 준수
8. HTML5 form 요소와 통합 가능
9. Left/Right Icon은 React.ReactNode로 전달 (컴포넌트 또는 SVG)
10. 폼 검증 로직은 애플리케이션 레이어에서 처리
11. 에러 메시지는 주로 검증 실패 시 표시됨
12. Placeholder는 힌트 제공용이며, 라벨을 대체하지 않음

---

## 10) MVP + next steps

### MVP Scope

**Phase 1: Core Implementation**

- TextField 컴포넌트 구현
- Label(optional) 표시
- Container (input 요소) 구현
- Placeholder 표시
- Help message(optional) 표시
- Error 상태 및 errorMessage 표시
- Disabled 상태 지원
- Focus 상태 스타일링
- onChange 이벤트 핸들링
- onFocus/onBlur 이벤트 핸들링
- Controlled/Uncontrolled 모드 지원
- 기본 input type 지원 (text, email, password)
- 키보드 네비게이션 (Tab)
- SDUI 통합 (nodeId)
- TypeScript 타입 정의
- 접근성 속성 지원 (label-input 연결, aria-live, aria-invalid)
- 시나리오 테스트 (20-25개)
- Storybook 문서화

**Success Criteria for MVP**:

- TextField 컴포넌트가 모든 기본 기능에서 동작
- 디자인 시스템 스펙과 일치
- 접근성 테스트 통과
- SDUI 통합 동작 확인
- 모든 테스트 통과

**Phase 2: Icon Support**

- Left Icon 표시 및 스타일링
- Right Icon 표시 및 스타일링
- Right Icon 클릭 핸들러 지원
- Icon과 텍스트 간격 조정

**Phase 3: Advanced Features**

- 추가 input type 지원 (number, tel, url, search)
- maxLength 속성 지원
- required 속성 지원
- autocomplete 속성 지원
- 커스텀 스타일링 (className)

### Next Steps (Post-MVP)

1. **성능 최적화**:
   - 번들 크기 최적화
   - 렌더링 성능 최적화
   - 입력 반응 시간 최적화

2. **문서화 강화**:
   - Storybook 스토리 추가 (모든 상태 조합)
   - 사용 예제 추가
   - 폼 통합 가이드

3. **테스트 강화**:
   - 시각적 회귀 테스트
   - 접근성 자동화 테스트
   - 통합 테스트 추가
   - 키보드 네비게이션 테스트

4. **디자인 시스템 통합**:
   - 디자인 토큰 연동
   - 테마 시스템 연동 (향후)

5. **고급 기능**:
   - 입력 마스킹 (별도 컴포넌트 또는 prop으로 확장)
   - 글자 수 카운터 (별도 컴포넌트 또는 prop으로 확장)
   - 자동완성 (별도 컴포넌트)

### Test Strategy

**Scenario Tests (P0, Required)**:

1. Success flow - 기본 텍스트 입력 (uncontrolled)
2. Success flow - 기본 텍스트 입력 (controlled)
3. Success flow - Label 표시
4. Success flow - Placeholder 표시
5. Success flow - Help message 표시
6. Success flow - Focus 상태
7. Success flow - Error 상태 및 errorMessage 표시
8. Success flow - Disabled 상태
9. Success flow - onChange 이벤트 핸들링
10. Success flow - onFocus/onBlur 이벤트 핸들링
11. Success flow - Left Icon 표시
12. Success flow - Right Icon 표시 및 클릭
13. Success flow - 키보드 네비게이션 (Tab)
14. Success flow - input type="email"
15. Success flow - input type="password"
16. SDUI integration - nodeId를 통한 상태 구독
17. Event emission - eventId를 통한 이벤트 발생
18. Boundary: invalid type (defaults to text)
19. Boundary: error=true일 때 helpMessage 숨김
20. Accessibility: label-input 연결 (for/id)
21. Accessibility: aria-live로 error 메시지 알림
22. Accessibility: aria-invalid 속성 설정
23. Accessibility: disabled 상태에서 tabIndex=-1
24. Accessibility: 키보드 포커스 표시
25. Visual: 모든 상태 조합 확인 (Default, Focus, Error, Disabled)

**EP/BVA Application**:

- **label**: with label, without label
- **placeholder**: with placeholder, without placeholder
- **helpMessage**: with helpMessage, without helpMessage
- **error**: true, false
- **errorMessage**: with errorMessage, without errorMessage
- **disabled**: true, false
- **value**: with value (controlled), without value (uncontrolled)
- **leftIcon**: with leftIcon, without leftIcon
- **rightIcon**: with rightIcon, without rightIcon
- **type**: text, email, password, number, tel, url, search (boundary: invalid value)
- **maxLength**: with maxLength, without maxLength
- **required**: true, false

**Deterministic Async**:

- SDUI 상태 구독 테스트 (useSduiNodeSubscription)
- 이벤트 발생 테스트 (EventMapper)
- Focus/Blur 이벤트 타이밍 테스트
- 빠른 입력 시 onChange 호출 테스트

**Visual Regression**:

- 모든 상태 조합 스크린샷 비교 (Default, Focus, Error, Disabled)
- Label/Placeholder/Help message 조합 스크린샷 비교
- Left/Right Icon 조합 스크린샷 비교
- 총 상태 조합 시각적 검증
