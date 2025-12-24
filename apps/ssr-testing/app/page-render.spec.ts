import { test, expect } from '@playwright/test'

/**
 * 페이지 렌더링 테스트
 *
 * SDUI Template SSR Testing 페이지가 올바르게 렌더링되는지 확인합니다.
 */
test.describe('페이지 렌더링', () => {
  test('메인 페이지가 올바르게 로드되고 렌더링된다', async ({ page }) => {
    await page.goto('/')

    // 페이지 타이틀 확인
    await expect(page).toHaveTitle(/Create Next App/)

    // 메인 헤딩 확인
    const heading = page.getByRole('heading', { name: 'SDUI Template SSR Testing' })
    await expect(heading).toBeVisible()

    // 설명 텍스트 확인
    const description = page.getByText('Next.js App Router를 사용한 Server-Driven UI 테스트 페이지입니다.')
    await expect(description).toBeVisible()
  })

  test('SDUI 레이아웃 컴포넌트들이 올바르게 렌더링된다', async ({ page }) => {
    await page.goto('/')

    // 페이지가 완전히 로드될 때까지 대기
    await page.waitForLoadState('networkidle')

    // GridLayout 컨테이너 확인
    const layoutContainer = page.locator('[data-testid="grid-layout"]').first()
    await expect(layoutContainer).toBeVisible({ timeout: 10000 })

    // Toggle 컴포넌트들이 렌더링되는지 확인 (label 텍스트로 확인)
    const toggle1Label = page.getByText('알림 받기')
    const toggle2Label = page.getByText('다크 모드')
    const toggle3Label = page.getByText('자동 저장')

    await expect(toggle1Label).toBeVisible({ timeout: 10000 })
    await expect(toggle2Label).toBeVisible({ timeout: 10000 })
    await expect(toggle3Label).toBeVisible({ timeout: 10000 })

    // Toggle 버튼들이 렌더링되는지 확인 (data-testid 사용)
    const toggle1Button = page.locator('[data-testid="toggle-button-toggle-1"]')
    const toggle2Button = page.locator('[data-testid="toggle-button-toggle-2"]')
    const toggle3Button = page.locator('[data-testid="toggle-button-toggle-3"]')

    await expect(toggle1Button).toBeVisible({ timeout: 10000 })
    await expect(toggle2Button).toBeVisible({ timeout: 10000 })
    await expect(toggle3Button).toBeVisible({ timeout: 10000 })
  })

  test('Toggle 컴포넌트의 초기 상태가 올바르게 설정된다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // 첫 번째 토글: checked=false (aria-pressed로 확인)
    const toggle1 = page.locator('[data-testid="toggle-button-toggle-1"]')
    await expect(toggle1).toBeVisible({ timeout: 10000 })
    await expect(toggle1).toHaveAttribute('aria-pressed', 'false')

    // 두 번째 토글: checked=true
    const toggle2 = page.locator('[data-testid="toggle-button-toggle-2"]')
    await expect(toggle2).toBeVisible({ timeout: 10000 })
    await expect(toggle2).toHaveAttribute('aria-pressed', 'true')

    // 세 번째 토글: checked=false
    const toggle3 = page.locator('[data-testid="toggle-button-toggle-3"]')
    await expect(toggle3).toBeVisible({ timeout: 10000 })
    await expect(toggle3).toHaveAttribute('aria-pressed', 'false')
  })

  test('Toggle 컴포넌트가 클릭 시 상태가 변경된다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const toggle1 = page.locator('[data-testid="toggle-button-toggle-1"]')

    // 초기 상태 확인
    await expect(toggle1).toBeVisible({ timeout: 10000 })
    await expect(toggle1).toHaveAttribute('aria-pressed', 'false')

    // 클릭하여 상태 변경
    await toggle1.click()
    // 상태 변경이 반영될 때까지 잠시 대기
    await page.waitForTimeout(100)
    await expect(toggle1).toHaveAttribute('aria-pressed', 'true')

    // 다시 클릭하여 원래 상태로 복귀
    await toggle1.click()
    await page.waitForTimeout(100)
    await expect(toggle1).toHaveAttribute('aria-pressed', 'false')
  })

  test('페이지가 반응형으로 렌더링된다', async ({ page }) => {
    // 모바일 뷰포트
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const heading = page.getByRole('heading', { name: 'SDUI Template SSR Testing' })
    await expect(heading).toBeVisible()

    // 데스크톱 뷰포트
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(heading).toBeVisible()
  })

  test('페이지에 에러가 없이 렌더링된다', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      errors.push(error.message)
    })

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')

    // 기본 렌더링 확인
    await expect(page.getByRole('heading', { name: 'SDUI Template SSR Testing' })).toBeVisible()

    // 에러가 없는지 확인 (SDUI Layout Error는 예상된 에러이므로 제외)
    const unexpectedErrors = errors.filter((error) => !error.includes('SDUI Layout Error'))

    expect(unexpectedErrors).toHaveLength(0)
  })
})
