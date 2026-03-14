# Component Library Reference Skill Template

**Extracted:** 2026-03-14
**Context:** 컴포넌트 라이브러리를 다른 레포에서도 Claude가 정확히 쓸 수 있게 패키징할 때 사용하는 표준 구조

## Problem

외부 컴포넌트 라이브러리 사용 시 Claude가 각 컴포넌트의 type 문자열, state 스키마, 올바른 JSON 구조를 모르면 잘못된 코드를 생성한다.

## Solution

컴포넌트별 레퍼런스 스킬을 다음 구조로 작성:

1. **Quick Import** — 한 번에 복사 가능한 import 코드
2. **컴포넌트당 테이블** — type 문자열 / 필수·선택 state 정리
3. **최소 JSON 예시** — 바로 쓸 수 있는 SDUI document 조각
4. **Type 전체 목록** — 카테고리별 빠른 조회 테이블

## Structure

```markdown
---
name: [LibraryName]Components
description: Component-by-component reference for [library] — props, state schema, and JSON examples
---

## Quick Import
[copy-paste ready import snippet]

## Key Rules
- state → dynamic props
- attributes → static HTML only
- [library-specific rules]

## [Category] Components

### [ComponentName]

| type | `TypeString` |
|------|-------------|
| state.propName | `type` description |

[minimal JSON example]

## Type Reference
[category → type strings lookup table]
```

## Key Decisions

| 섹션 | 목적 |
|------|------|
| `type` | SDUI document에서 쓰는 정확한 문자열 |
| `state` | 동적 props (Radix props 포함) |
| `attributes` | 정적 HTML attributes만 |
| JSON example | 복사 즉시 사용 가능한 최소 예시 |

## When to Use

- 새 컴포넌트 라이브러리를 SDUI 시스템과 통합할 때
- 기존 라이브러리를 다른 레포에서 사용 가능하게 문서화할 때
- 팀원들이 공통 컴포넌트를 일관성 있게 쓰도록 가이드할 때
