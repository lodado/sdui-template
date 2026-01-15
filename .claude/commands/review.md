---
name: review
description: "무순서/병렬 코드리뷰: PM + Arch + UX + DX (Evidence+Reasoning 강제, 통합 리포트)"
---

너는 리뷰 오케스트레이터다.
아래 4개의 리뷰를 "순서 강제 없이" 모두 수행하고, 마지막에 통합 리포트를 작성한다.

# 1) 공통 규칙(Evidence + Reasoning 강제)
- 모든 체크 항목/이슈/OK 판정에는 반드시 아래 2개를 포함한다.
  1) Evidence(근거): 파일경로/라인(가능하면), 코드 스니펫(짧게), 테스트 케이스, 로그, LSP 진단, 스펙 문장 등 "검증 가능한 근거"
  2) Reasoning(논리): 왜 이게 PASS/FAIL인지, 어떤 영향(사용자/운영/유지보수/DX)을 주는지
- 근거 부족 시 반드시 "INSUFFICIENT EVIDENCE"로 표시하고 질문/추가 확인을 요구한다.
- 근거 없는 평가(느낌/취향/추정)는 금지.
- 모든 이슈는 Severity(P0~P3)로 분류한다.

# 2) 리뷰 출력 포맷(각 에이전트 공통)
## Verdict
- ✅ OK / ⚠️ CONDITIONAL / ❌ BLOCK

## Checklist (항목별)
- [항목명]
  - Status: PASS / PARTIAL / FAIL / INSUFFICIENT EVIDENCE
  - Evidence:
  - Reasoning:
  - Fix Suggestion: (FAIL/PARTIAL일 때 필수)
  - Required Tests: (FAIL/PARTIAL일 때 필수)

## Issues
- P0/P1/P2/P3로 구분
- 각 이슈 Evidence+Reasoning 필수

---

# 3) 리뷰 요청 (순서 강제 없음)

## (A) PM / 스펙 기반 검증
@pm-spec-enforcer
스펙/요구사항 문서를 기준으로 FR/NFR 체크리스트를 작성하고 검증하라.
각 항목 Evidence+Reasoning 필수.
Verdict는 ✅/⚠️/❌로 명시하라.

---

## (B) 아키텍처 / 유지보수성 검증
@toxic-architect
경계/의존성 방향/추상화/타입 계약/에러 전파/테스트 가능성/변경 용이성 관점에서 리뷰하라.
각 항목 Evidence+Reasoning 필수.
반드시 MVP Refactor / Ideal Refactor 두 옵션을 제시하라.
Verdict는 ✅/⚠️/❌로 명시하라.

---

## (C) UX / 접근성/반응형 검증
@ux-art-obsessed
반응형(320/375/768/1024/1440), 접근성(tab/focus/aria), 상태UX(loading/empty/error), 색상 대비/상태색/다크모드 관점에서 QA하라.
각 이슈에 재현 조건(뷰포트/테마/입력)을 포함하고 Evidence+Reasoning 필수.
Verdict는 ✅/⚠️/❌로 명시하라.

---

## (D) DX / 개발자 경험 검증
@mz-dx-rager
API 사용성/일관성/에러 메시지/actionability/문서-예제/로컬 개발 흐름을 리뷰하라.
DX 비용을 수치화하라:
- 첫 사용까지 단계 수
- 실수하기 쉬운 포인트 수
- 디버깅 정보 누락 수
각 항목 Evidence+Reasoning 필수.
최소 개선(PR 1개) + 근본 개선(설계 변경) 제시.
Verdict는 ✅/⚠️/❌로 명시하라.

---

# 4) Final Output(통합 리포트)
위 4개 리뷰 결과를 취합하여 아래 포맷으로 통합하라.

## Merge Decision
- ✅ MERGE
- ⚠️ MERGE AFTER FIXES
- ❌ DO NOT MERGE

## Verdict Summary
- PM:
- Arch:
- UX:
- DX:

## Must-fix (P0/P1)
- (Evidence+Reasoning 포함)

## Should-fix (P2/P3)
- (Evidence+Reasoning 포함)

## Open Questions
- INSUFFICIENT EVIDENCE 항목 모음

## Recommended Fix Plan
- Fix Order(추천 수정 순서 1..N)
- Suggested commits (최대 3개)
- Required tests to run
