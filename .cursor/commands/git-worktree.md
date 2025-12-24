---
description: design-flow
---

역할: 너는 Git에 익숙한 개발 에이전트다. 아래에서 말하는 “git worktree”는 ‘브랜치/PR 전략’이 아니라, 작업이 섞이지 않도록 ‘새 작업공간(Worktree)을 만들어 그 안에서만 개발하는 실행 규칙’을 의미한다.

목표:

- 기존 작업 디렉토리(현재 폴더)에서는 절대 코드 수정/커밋하지 않는다.
- 반드시 새로 만든 Git worktree 디렉토리 안에서만 작업한다.
- 작업 브랜치는 새로 만들고, 그 브랜치와 worktree가 1:1로 매핑되도록 한다.

정의 (Git worktree):

- 하나의 Git 저장소(.git)를 공유하면서, 서로 다른 워킹 디렉토리를 여러 개 만들 수 있는 Git 기능이다.
- 각 worktree는 서로 다른 브랜치를 체크아웃할 수 있어, “작업 내용이 섞이는 문제”를 구조적으로 방지한다.
- 같은 레포를 여러 번 clone하지 않고도 병렬 작업/에이전트 분리를 할 수 있다.

절차:

1. 현재 내가 있는 디렉토리가 Git repo인지 확인한다.

   - git rev-parse --show-toplevel
   - 실패하면 중단하고, 왜 실패했는지(레포 아님/경로 문제)만 보고한다.

2. 새 브랜치를 만든다 (작업명은 {TASK}로 치환)

   - 브랜치명 규칙: agent/{TASK}
   - 예: agent/timepicker-allowedlist-fix

3. 새 worktree를 만든다

   - worktree 경로 규칙: ../.worktrees/{TASK}
   - 명령:
     git worktree add -b agent/{TASK} ../.worktrees/{TASK} HEAD
   - 이미 브랜치가 있으면 -b 없이:
     git worktree add ../.worktrees/{TASK} agent/{TASK}

4. 이후 모든 작업은 반드시 해당 worktree 폴더로 이동해서 한다.

   - cd ../.worktrees/{TASK}
   - 여기서만 파일 수정/테스트/커밋 수행.
   - 원본 디렉토리에서는 절대 파일 수정/커밋 금지.

5. 작업 중 준수 규칙:

   - 작업 전: git status 로 깨끗한 상태인지 확인
   - 커밋: 의미 단위로 자주 커밋하고 메시지는 명확히 작성
   - 테스트/빌드가 있으면 커밋 전 실행
   - 변경사항 확인: git diff, git status
   - 절대 금지: 원본 디렉토리에서 git commit / 파일 수정

6. 종료 시 정리(선택):
   - worktree 제거 전, 변경사항 커밋/푸시 여부 확인
   - 제거:
     cd (레포 루트 또는 아무 곳)
     git worktree remove ../.worktrees/{TASK}
   - 브랜치까지 삭제는 선택(원격 반영 여부에 따라 신중):
     git branch -d agent/{TASK}

산출물:

- 위 절차를 실제로 실행할 때 필요한 커맨드들을, 내가 제공한 {TASK}에 맞춰 “그대로 복사-실행 가능” 형태로 나열해라.
- 각 단계마다 성공/실패 시 다음 액션을 짧게 덧붙여라.

중요:

- 너는 지금부터 ‘원본 작업폴더’에서 파일을 수정하지 않는다.
- 모든 수정은 ‘새 worktree 폴더’에서만 수행한다.

# 0) 레포 확인 (루트 경로 출력되어야 정상)

git rev-parse --show-toplevel

# 1) (권장) 현재 상태가 깨끗한지 확인

git status

# 2) 새 worktree + 새 브랜치 생성 (브랜치가 아직 없을 때)

git worktree add -b "agent/{TASK}" "../.worktrees/{TASK}" HEAD

# 3) 해당 worktree로 이동 (이 폴더에서만 작업)

cd "../.worktrees/{TASK}"

# 4) 작업/테스트/커밋

git status

# ... edit

git add -A
git commit -m "feat: {TASK} ..."

# worktree 폴더 제거 (먼저 cd 로 빠져나오기)

cd "$(git rev-parse --show-toplevel)"
git worktree remove "../.worktrees/{TASK}"

# (선택) 로컬 브랜치 삭제

git branch -d "agent/{TASK}"
