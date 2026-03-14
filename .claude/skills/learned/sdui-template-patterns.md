---
name: sdui-template-patterns
description: Coding patterns extracted from sdui-template repository — commit conventions, component workflow, file co-change patterns
version: 1.0.0
source: local-git-analysis
analyzed_commits: 200
---

# sdui-template Repository Patterns

## Commit Conventions

Conventional Commits를 사용합니다. 200개 커밋 분석 결과:

| Prefix | Count | 용도 |
|--------|-------|------|
| `feat:` | 54 | 새 컴포넌트·기능 추가 |
| `chore:` | 29 | 설정·의존성·도구 변경 |
| `refactor:` | 22 | 내부 구조 개선 (기능 변화 없음) |
| `docs:` | 5 | README, 스토리북 문서 |
| `fix:` | 5 | 버그 수정 |
| `test:` | 5 | 테스트 추가·수정 |
| `build:` | 2 | CI/CD 워크플로우 |

**스코프 패턴** — 컴포넌트 추가 시 스코프 명시:

```
feat(badge): add Badge component from Figma
feat(dropdown): add DropdownMenu component with Radix UI
feat(Checkbox): add compound checkbox component
```

---

## New Component Addition Workflow

새 컴포넌트 추가 시 **반드시 함께 수정되는 파일 세트** (co-change pattern):

```
packages/sdui-template-component/src/shared/ui/{name}/
  ├── {Name}.tsx                          # UI 컴포넌트 (props 기반, 순수 렌더링)
  ├── {Name}Container.tsx                 # SDUI Container (useSduiNodeSubscription)
  ├── types.ts                            # Props/State 타입 정의
  ├── {name}-variants.ts                  # CSS variants (class-variance-authority)
  ├── index.ts                            # 컴포넌트 export
  └── __tests__/
      ├── {name}.logic.test.tsx           # UI 로직 단위 테스트
      └── {name}.sdui.test.tsx            # SDUI 통합 테스트

packages/sdui-template-component/src/shared/ui/index.ts   # ← 항상 수정
packages/sdui-template-component/src/app/sduiComponents.tsx  # ← 항상 수정
apps/docs/src/stories/{Name}.stories.tsx                   # ← 항상 수정
```

**체크리스트:**

- [ ] `{Name}.tsx` — UI 컴포넌트 (Radix UI 래핑)
- [ ] `{Name}Container.tsx` — SDUI Container
- [ ] `types.ts` — Zod schema + TypeScript 타입
- [ ] `{name}-variants.ts` — appearance/size variants
- [ ] `index.ts` — named export
- [ ] `__tests__/{name}.logic.test.tsx`
- [ ] `__tests__/{name}.sdui.test.tsx`
- [ ] `shared/ui/index.ts` — 라이브러리 export 추가
- [ ] `sduiComponents.tsx` — SDUI 컴포넌트 맵 등록
- [ ] `stories/{Name}.stories.tsx` — Storybook 문서

---

## Component Architecture (UI / Container Separation)

모든 컴포넌트는 **UI 레이어**와 **SDUI Container 레이어**로 분리됩니다.

```typescript
// {Name}.tsx — UI Layer (순수 React, SDUI 의존성 없음)
interface BadgeProps {
  label: string | number
  appearance?: BadgeAppearance
  className?: string
}

export const Badge = ({ label, appearance = 'default', className }: BadgeProps) => (
  <div className={badgeVariants({ appearance, className })}>
    {label}
  </div>
)

// {Name}Container.tsx — SDUI Layer (store 구독)
export const BadgeContainer = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<typeof badgeStateSchema>({
    nodeId: id,
    schema: badgeStateSchema,
  })
  const typedState = state as BadgeState

  return <Badge label={typedState.label ?? ''} appearance={typedState.appearance} />
}

// sduiComponents.tsx — 등록
export const sduiComponents = {
  Badge: (id) => <BadgeContainer id={id} />,
}
```

---

## Test File Pattern

두 종류의 테스트를 분리합니다:

```typescript
// {name}.logic.test.tsx — UI 컴포넌트 단위 테스트
describe('Badge', () => {
  it('renders label', () => {
    render(<Badge label={25} />)
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})

// {name}.sdui.test.tsx — SDUI 통합 테스트
describe('BadgeContainer (SDUI)', () => {
  it('renders from document', () => {
    const document = {
      version: '1.0.0',
      root: { id: 'badge', type: 'Badge', state: { label: 25 } }
    }
    render(<SduiLayoutRenderer document={document} components={sduiComponents} />)
    expect(screen.getByText('25')).toBeInTheDocument()
  })
})
```

---

## Figma → Component Workflow

컴포넌트는 Figma 디자인에서 시작합니다:

1. `/figma-sync` — Figma에서 디자인 파악
2. `/figma-pr` — isolated worktree에서 구현 후 PR 생성

```
feat(componentName): add {ComponentName} component from Figma
```

---

## Most Frequently Changed Files

| 파일 | 변경 횟수 | 의미 |
|------|-----------|------|
| `sduiComponents.tsx` | 13 | 컴포넌트 추가 시 항상 수정 |
| `shared/ui/index.ts` | 11 | 컴포넌트 export 항상 수정 |
| `Button.stories.tsx` | 8 | 가장 많이 참조되는 스토리 |
| `TextField.stories.tsx` | 7 | 복잡한 compound component |

---

## When to Use

- 새 컴포넌트 추가 시 파일 구조 참고
- 커밋 메시지 작성 시 prefix/scope 결정
- SDUI Container 구현 패턴 참고
- 테스트 파일 분리 기준 판단
