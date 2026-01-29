# Continuous Learning v2 - 프로젝트 로컬 설정

이 프로젝트 전용으로 continuous learning v2가 설정되었습니다.

## 설치된 파일

```
.claude/
├── settings.json           # PreToolUse/PostToolUse 훅 설정됨
├── hooks/
│   └── observe.sh          # 툴 사용 관찰 스크립트
└── homunculus/
    ├── config.json         # 학습 시스템 설정
    ├── identity.json       # 프로젝트 프로필
    ├── observations.jsonl  # 툴 사용 기록 (자동 생성됨)
    ├── instincts/
    │   ├── personal/       # 자동 학습된 패턴들
    │   └── inherited/      # 외부에서 가져온 패턴들
    └── evolved/
        ├── agents/         # 진화된 에이전트들
        ├── skills/         # 진화된 스킬들
        └── commands/       # 진화된 커맨드들
```

## 어떻게 작동하나?

1. **자동 관찰**: 모든 툴 사용(Edit, Write, Bash 등)이 자동으로 기록됩니다
2. **패턴 감지**: 반복되는 행동, 사용자 수정, 에러 해결 등을 감지합니다
3. **Instinct 생성**: 감지된 패턴들이 "instinct"(본능)으로 저장됩니다
4. **진화**: 관련된 instinct들이 모여서 skill/command/agent로 진화합니다

## 현재 설정

- **관찰 모드**: ✅ 활성화 (모든 툴 사용 기록)
- **백그라운드 분석**: ❌ 비활성화 (수동으로 실행 필요)
- **자동 진화**: ❌ 비활성화 (수동으로 `/evolve` 실행)

## 사용 가능한 명령어

| 명령어 | 설명 |
|--------|------|
| `/instinct-status` | 학습된 모든 instinct 보기 |
| `/evolve` | 관련된 instinct들을 skill/command로 진화시키기 |
| `/instinct-export` | instinct들을 파일로 내보내기 |
| `/instinct-import <file>` | 다른 곳에서 instinct 가져오기 |

## 예시 워크플로우

1. **코딩 작업**: 평소처럼 Claude Code 사용
2. **자동 기록**: 모든 작업이 `observations.jsonl`에 기록됨
3. **주기적으로 확인**: `/instinct-status`로 학습된 패턴 확인
4. **진화**: `/evolve`로 유용한 패턴들을 skill로 만들기

## 설정 변경

`config.json`을 수정하면 됩니다:

- **백그라운드 분석 활성화**: `observer.enabled`를 `true`로 변경
- **자동 진화 활성화**: `evolution.auto_evolve`를 `true`로 변경
- **관찰 비활성화**: `observation.enabled`를 `false`로 변경

## 디스크 사용량

- `observations.jsonl`이 10MB를 넘으면 자동으로 아카이브됩니다
- 아카이브는 `observations.archive/`에 저장됩니다
- 최대 100개의 instinct까지 저장됩니다

## 개인정보

- 모든 데이터는 **이 프로젝트 폴더 안**에만 저장됩니다
- 외부로 전송되지 않습니다
- `/instinct-export`로 명시적으로 내보내기 전까지는 공유되지 않습니다
