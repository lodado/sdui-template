# 테스트 에러 분석 결과

## 테스트 실행 결과 요약
- **실패한 테스트**: 14개
- **성공한 테스트**: 125개
- **실패한 테스트 스위트**: 2개 (`textfield.styles.test.tsx`, `div.logic.test.tsx`)

---

## 1. TextField 스타일 테스트 에러 (8개)

### 문제 원인
테스트 코드가 **구식 CSS 변수 이름**을 기대하지만, 실제 컴포넌트는 **새로운 semantic CSS 변수 이름**을 사용하고 있습니다.

| 테스트 케이스 | 기대값 (테스트) | 실제값 (컴포넌트) | 파일 위치 | 라인 |
|--------------|----------------|-----------------|----------|------|
| Default border color | `border-[var(--color-gray-200)]` | `border-[var(--color-border-input)]` | `textfield.styles.test.tsx` | 23 |
| Default background | `bg-white` | `bg-[var(--color-background-input-default)]` | `textfield.styles.test.tsx` | 24 |
| Error border color | `border-[var(--color-red-500)]` | `border-[var(--color-border-danger)]` | `textfield.styles.test.tsx` | 43 |
| Error outline color | `focus-within:outline-[var(--color-red-500)]` | `focus-within:outline-[var(--color-border-danger)]` | `textfield.styles.test.tsx` | 44 |
| Disabled background | `bg-[var(--color-gray-100)]` | `bg-[var(--color-background-disabled)]` | `textfield.styles.test.tsx` | 63 |
| Label text color (normal) | `text-[var(--color-gray-900)]` | `text-[var(--color-text-default)]` | `textfield.styles.test.tsx` | 150 |
| Label text color (error) | `text-[var(--color-red-500)]` | `text-[var(--color-text-danger)]` | `textfield.styles.test.tsx` | 167 |
| Help message color (normal) | `text-[var(--color-gray-600)]` | `text-[var(--color-text-subtle)]` | `textfield.styles.test.tsx` | 188 |
| Error message color | `text-[var(--color-red-500)]` | `text-[var(--color-text-danger)]` | `textfield.styles.test.tsx` | 205 |
| Placeholder color | `placeholder:text-[var(--color-gray-300)]` | `placeholder:text-[var(--color-text-subtlest)]` | `textfield.styles.test.tsx` | 223 |

### 해결 방법
테스트 파일의 CSS 변수 이름을 실제 컴포넌트에서 사용하는 semantic 변수 이름으로 업데이트해야 합니다.

**매핑 관계:**
- `--color-gray-200` → `--color-border-input`
- `--color-red-500` → `--color-border-danger` (border), `--color-text-danger` (text)
- `--color-gray-100` → `--color-background-disabled`
- `--color-gray-900` → `--color-text-default`
- `--color-gray-600` → `--color-text-subtle`
- `--color-gray-300` → `--color-text-subtlest`
- `bg-white` → `bg-[var(--color-background-input-default)]`

---

## 2. Div 로직 테스트 에러 (1개)

### 문제 원인
Lazy component가 의도적으로 에러를 던지는 테스트 케이스에서, 에러가 발생하고 있습니다.

| 테스트 케이스 | 에러 메시지 | 파일 위치 | 라인 |
|--------------|-----------|----------|------|
| Lazy component error handling | `Error: Lazy component error` | `div.logic.test.tsx` | 599 |

### 상세 내용
```typescript
const ErrorLazyComponent = lazy(() =>
  Promise.resolve({
    default: () => {
      throw new Error('Lazy component error')  // 라인 599
    },
  }),
)
```

### 분석
- 이 테스트는 **의도적으로 에러를 발생시키는** lazy component를 테스트하는 케이스입니다.
- ErrorBoundary가 에러를 잡아서 error fallback을 표시하는지 확인하는 테스트입니다.
- 하지만 실제로는 에러가 제대로 처리되지 않고 console.error로 출력되고 있습니다.
- 테스트는 `waitFor`를 사용하여 에러 fallback이 표시되는지 확인하지만, 에러가 발생하는 과정에서 문제가 있을 수 있습니다.

### 해결 방법
1. ErrorBoundary가 lazy component의 에러를 제대로 잡는지 확인
2. Suspense와 ErrorBoundary의 조합이 올바르게 동작하는지 확인
3. 테스트의 타임아웃이나 에러 처리 로직을 조정

---

## 3. 경고 메시지

### TypeScript 버전 경고
```
ts-jest[versions] (WARN) Version 5.9.3 of typescript installed has not been tested with ts-jest. 
If you're experiencing issues, consider using a supported version (>=4.3.0 <5.0.0-0).
```

**영향도**: 낮음 (경고일 뿐, 테스트 실행에는 문제 없음)

**해결 방법**: 
- TypeScript 버전을 다운그레이드하거나
- ts-jest를 업그레이드하거나
- 경고를 무시 (현재 테스트는 정상 실행됨)

---

## 요약

| 에러 유형 | 개수 | 심각도 | 해결 난이도 |
|---------|------|--------|-----------|
| CSS 변수 이름 불일치 | 10 | 중 | 낮음 (테스트 수정) |
| Lazy component 에러 처리 | 1 | 중 | 중간 (로직 확인 필요) |
| TypeScript 버전 경고 | - | 낮음 | 낮음 (선택적) |

**권장 조치 순서:**
1. ✅ TextField 스타일 테스트의 CSS 변수 이름 업데이트 (우선순위 높음)
2. ⚠️ Div lazy component 에러 처리 로직 확인 (우선순위 중간)
3. ℹ️ TypeScript 버전 경고 처리 (우선순위 낮음)
