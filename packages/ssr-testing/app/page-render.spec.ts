import { expect,test } from '@playwright/test'

/**
 * Page render tests.
 *
 * Verifies that the SDUI Template SSR Testing page renders correctly.
 */
test.describe('페이지 렌더링', () => {
  test('메인 페이지가 올바르게 로드되고 렌더링된다', async ({ page }) => {
    await page.goto('/')

    // Verify the page title
    await expect(page).toHaveTitle(/Create Next App/)

    // Verify the main heading
    const heading = page.getByRole('heading', { name: 'SDUI Template SSR Testing' })
    await expect(heading).toBeVisible()

    // Verify the description text
    const description = page.getByText('Next.js App Router를 사용한 Server-Driven UI 테스트 페이지입니다.')
    await expect(description).toBeVisible()
  })

  test('SDUI 레이아웃 컴포넌트들이 올바르게 렌더링된다', async ({ page }) => {
    await page.goto('/')

    // Wait until the page fully loads
    await page.waitForLoadState('networkidle')

    // Verify the GridLayout container
    const layoutContainer = page.locator('[data-testid="grid-layout"]').first()
    await expect(layoutContainer).toBeVisible({ timeout: 10000 })

    // Verify the Toggle components render (by aria-label)
    const toggle1 = page.getByRole('switch', { name: '알림 받기' })
    const toggle2 = page.getByRole('switch', { name: '다크 모드' })
    const toggle3 = page.getByRole('switch', { name: '자동 저장' })

    await expect(toggle1).toBeVisible({ timeout: 10000 })
    await expect(toggle2).toBeVisible({ timeout: 10000 })
    await expect(toggle3).toBeVisible({ timeout: 10000 })

    // Verify the Toggle buttons render (using data-node-id)
    const toggle1Button = page.locator('[data-node-id="toggle-1"]')
    const toggle2Button = page.locator('[data-node-id="toggle-2"]')
    const toggle3Button = page.locator('[data-node-id="toggle-3"]')

    await expect(toggle1Button).toBeVisible({ timeout: 10000 })
    await expect(toggle2Button).toBeVisible({ timeout: 10000 })
    await expect(toggle3Button).toBeVisible({ timeout: 10000 })
  })

  test('Toggle 컴포넌트의 초기 상태가 올바르게 설정된다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // First toggle: isChecked=false (check aria-checked - Radix Switch)
    const toggle1 = page.locator('[data-node-id="toggle-1"]')
    await expect(toggle1).toBeVisible({ timeout: 10000 })
    await expect(toggle1).toHaveAttribute('aria-checked', 'false')

    // Second toggle: isChecked=true
    const toggle2 = page.locator('[data-node-id="toggle-2"]')
    await expect(toggle2).toBeVisible({ timeout: 10000 })
    await expect(toggle2).toHaveAttribute('aria-checked', 'true')

    // Third toggle: isChecked=false
    const toggle3 = page.locator('[data-node-id="toggle-3"]')
    await expect(toggle3).toBeVisible({ timeout: 10000 })
    await expect(toggle3).toHaveAttribute('aria-checked', 'false')
  })

  test('Toggle 컴포넌트가 클릭 시 상태가 변경된다', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const toggle1 = page.locator('[data-node-id="toggle-1"]')

    // Verify initial state
    await expect(toggle1).toBeVisible({ timeout: 10000 })
    await expect(toggle1).toHaveAttribute('aria-checked', 'false')

    // Click to change state
    await toggle1.click()
    // Briefly wait for the state change to apply
    await page.waitForTimeout(100)
    await expect(toggle1).toHaveAttribute('aria-checked', 'true')

    // Click again to return to the original state
    await toggle1.click()
    await page.waitForTimeout(100)
    await expect(toggle1).toHaveAttribute('aria-checked', 'false')
  })

  test('페이지가 반응형으로 렌더링된다', async ({ page }) => {
    // Mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    const heading = page.getByRole('heading', { name: 'SDUI Template SSR Testing' })
    await expect(heading).toBeVisible()

    // Desktop viewport
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

    // Verify basic rendering
    await expect(page.getByRole('heading', { name: 'SDUI Template SSR Testing' })).toBeVisible()

    // Verify there are no errors (exclude expected SDUI Layout Error)
    const unexpectedErrors = errors.filter((error) => !error.includes('SDUI Layout Error'))

    expect(unexpectedErrors).toHaveLength(0)
  })
})
