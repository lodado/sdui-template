import { devices, expect, test } from '@playwright/test'

/**
 * Touch-device block chrome: on (hover: none) and (pointer: coarse) the ⠿ drag
 * handle and '+' insert button must appear only on the focused/selected block,
 * not pinned on every block (chrome.css coarse-pointer override).
 *
 * Chromium-only: Playwright's touch/mobile emulation flips the hover/pointer
 * media features reliably only in Chromium.
 */
const pixel7 = devices['Pixel 7']

test.use({
  viewport: pixel7.viewport,
  userAgent: pixel7.userAgent,
  hasTouch: true,
  isMobile: true,
})

test.describe('블록 핸들 — 터치 디바이스', () => {
  test.skip(({ browserName }) => browserName !== 'chromium', 'touch media emulation requires Chromium')

  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })

    // sanity: the coarse-pointer media block under test is actually active
    const coarse = await page.evaluate(() => window.matchMedia('(hover: none) and (pointer: coarse)').matches)
    test.skip(!coarse, 'environment does not emulate coarse pointer')
  })

  test('포커스 전에는 모든 블록의 +/⠿ 핸들이 숨겨진다', async ({ page }) => {
    await expect(page.locator('[data-block-id="p1"] [data-plus-handle]')).toHaveCSS('opacity', '0')
    await expect(page.locator('[data-block-id="p1"] [data-drag-handle]')).toHaveCSS('opacity', '0')
    await expect(page.locator('[data-block-id="p2"] [data-plus-handle]')).toHaveCSS('opacity', '0')
    await expect(page.locator('[data-block-id="p2"] [data-drag-handle]')).toHaveCSS('opacity', '0')
  })

  test('블록을 탭하면 그 블록의 핸들만 나타난다', async ({ page }) => {
    await page.locator('[data-sdui-document-editor]').getByText('First').tap()
    await expect(page.locator('[contenteditable="true"]')).toHaveCount(1)

    await expect(page.locator('[data-block-id="p1"] [data-plus-handle]')).toHaveCSS('opacity', '1')
    await expect(page.locator('[data-block-id="p1"] [data-drag-handle]')).toHaveCSS('opacity', '1')

    // other blocks stay clean — the pre-fix bug pinned these to opacity 1
    await expect(page.locator('[data-block-id="p2"] [data-plus-handle]')).toHaveCSS('opacity', '0')
    await expect(page.locator('[data-block-id="p2"] [data-drag-handle]')).toHaveCSS('opacity', '0')
  })
})
