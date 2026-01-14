# Storybook GitHub Pages 배포 가이드

이 문서는 스토리북을 GitHub Pages에 배포하는 방법을 설명합니다.

## GitHub 저장소 설정 (필수)

### 1. GitHub Pages 활성화 ⚠️ 필수

**반드시 설정해야 합니다!**

1. GitHub 저장소로 이동
2. **Settings** (설정) 탭 클릭
3. 왼쪽 사이드바에서 **Pages** 메뉴 클릭
4. **Source** 섹션에서 **GitHub Actions** 선택
5. 저장 (별도 저장 버튼이 없으면 자동 저장됨)

### 2. GitHub Actions 권한 확인 ✅ (기본값으로 활성화됨)

일반적으로 기본값으로 활성화되어 있지만, 확인이 필요한 경우:

1. **Settings** → **Actions** → **General**
2. **Workflow permissions** 섹션 확인
3. **Read and write permissions** 선택되어 있는지 확인
4. **Allow GitHub Actions to create and approve pull requests** 체크 (선택사항)

### 3. 환경 변수 및 시크릿 설정 ❌ 불필요

**별도로 설정할 필요 없습니다!**

- `GITHUB_TOKEN`: GitHub Actions에서 자동으로 제공되는 시크릿입니다
- `PUBLIC_URL`: 워크플로우에서 자동으로 설정됩니다 (`/${{ github.event.repository.name }}/`)

## 자동 배포 설정

### 4. 워크플로우 동작

다음 경우에 자동으로 배포됩니다:

- `main` 브랜치에 push할 때
- 다음 경로의 파일이 변경될 때:
  - `apps/docs/**`
  - `packages/**`
  - `.github/workflows/deploy-storybook.yml`
  - `.github/workflows/storybook-deploy-reusable.yml`

### 5. 수동 배포

GitHub Actions 탭에서 **Deploy Storybook to GitHub Pages** 워크플로우를 선택하고 **Run workflow** 버튼을 클릭하여 수동으로 배포할 수 있습니다.

## 배포 프로세스

1. **의존성 설치**: pnpm을 사용하여 프로젝트 의존성 설치
2. **빌드**: 스토리북을 정적 파일로 빌드 (`apps/docs/storybook-static/`)
3. **배포**: `gh-pages` 브랜치에 배포

## 배포된 사이트 접근

배포가 완료되면 다음 URL에서 접근할 수 있습니다:

```
https://[사용자명].github.io/[저장소명]/
```

예: `https://lodado.github.io/sdui-template/`

## 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드를 테스트할 수 있습니다:

```bash
# 루트 디렉토리에서
pnpm build-storybook

# 빌드 결과 확인
ls apps/docs/storybook-static/
```

## 문제 해결

### 배포가 실패하는 경우

1. **GitHub Pages 설정 확인** (가장 중요!)
   - Settings → Pages → Source가 **GitHub Actions**로 설정되어 있는지 확인
2. GitHub Actions 탭에서 워크플로우 실행 로그 확인
3. 빌드 오류가 있는지 확인
4. Actions 권한 확인 (Settings → Actions → General → Workflow permissions)

### 사이트가 표시되지 않는 경우

1. 배포가 완료되었는지 확인 (보통 1-2분 소요)
2. 브라우저 캐시를 지우고 다시 시도
3. GitHub Pages 설정에서 올바른 브랜치(`gh-pages`)가 선택되었는지 확인

### 경로 문제 (404 오류)

스토리북 설정에서 `base` 경로가 올바르게 설정되어 있는지 확인하세요. 환경 변수 `PUBLIC_URL`이 자동으로 설정됩니다.

## 관련 파일

- `.github/workflows/deploy-storybook.yml`: 메인 배포 워크플로우
- `.github/workflows/storybook-deploy-reusable.yml`: 재사용 가능한 배포 워크플로우
- `apps/docs/.storybook/main.ts`: 스토리북 설정 (base 경로 포함)
