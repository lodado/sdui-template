import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Block menu E2E — slash command + '+' gutter button.
 *
 * Real-browser coverage for the insert flow: the slash PM plugin, the Radix
 * popover menu (keyboard-driven via delegation), Notion insert semantics
 * (empty converts in place / non-empty inserts below), and one-step undo.
 */
const EDITOR = '[data-sdui-document-editor]'
const EDITABLE = '[contenteditable="true"]'
const MENU = '[role="listbox"][aria-label="Insert block"]'

async function focusBlock(page: Page, text: string) {
  await page.locator(EDITOR).getByText(text).click()
  await expect(page.locator(EDITABLE)).toHaveCount(1)
}

test.describe('Block menu (slash command + plus button)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('"/head" 입력 시 메뉴가 필터링되고 Enter로 heading이 삽입된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    // the slash trigger requires a boundary (block start or whitespace)
    await page.keyboard.type(' /head')

    await expect(page.locator(MENU)).toBeVisible()
    await expect(page.locator(`${MENU} [role="option"]`)).toHaveCount(3)

    await page.keyboard.press('Enter')

    // non-empty block → new heading sibling below, focused
    const inserted = page.locator('[data-block-id="gen-1"]')
    await expect(inserted.locator('h1')).toHaveCount(1)
    // the /head trigger text was removed from the source block
    await expect(page.locator('[data-block-id="p1"]')).not.toContainText('/head')
    await expect(page.locator('[data-block-id="p1"]')).toContainText('First')
  })

  test('Escape는 메뉴만 닫고 입력한 텍스트와 편집 상태는 유지한다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    await page.keyboard.type(' /he')
    await expect(page.locator(MENU)).toBeVisible()

    await page.keyboard.press('Escape')

    await expect(page.locator(MENU)).toHaveCount(0)
    // still editing the same block, typed text kept (Notion behavior).
    // Order-insensitive: End does not move the caret on firefox/webkit.
    await expect(page.locator(EDITABLE)).toHaveCount(1)
    await expect(page.locator(EDITABLE)).toContainText('/he')
    await expect(page.locator(EDITABLE)).toContainText('First')
  })

  test("'+' 버튼: hover로 나타나고 클릭하면 새 문단 + 메뉴가 열린다", async ({ page }) => {
    const plus = page.locator('[data-plus-handle][aria-label="Add block below p1"]')
    // hidden via opacity (hover-reveal), so Playwright still reports it visible
    await expect(plus).toHaveCSS('opacity', '0')

    await page.locator('[data-block-id="p1"] [data-block-row]').hover()
    await expect(plus).toHaveCSS('opacity', '1')
    await plus.click()

    // fresh paragraph below p1, focused, menu open with the full item list
    await expect(page.locator(MENU)).toBeVisible()
    const focusedRow = page.locator('[data-block-id]', { has: page.locator(EDITABLE) })
    await expect(focusedRow).toHaveAttribute('data-block-id', 'gen-1')
    await expect(page.locator(`${MENU} [role="option"]`)).toHaveCount(10)

    // Escape leaves an empty paragraph ready for typing
    await page.keyboard.press('Escape')
    await expect(page.locator(MENU)).toHaveCount(0)
    await expect(page.locator('[data-block-id="gen-1"]')).toHaveCount(1)
  })

  test("빈 블록에서 '/divider'는 블록을 제자리에서 변환한다", async ({ page }) => {
    // '+' creates an empty paragraph (gen-1) with the menu already open
    await page.locator('[data-block-id="p1"] [data-block-row]').hover()
    await page.locator('[data-plus-handle][aria-label="Add block below p1"]').click()
    await expect(page.locator(MENU)).toBeVisible()

    await page.keyboard.type('div')
    await page.keyboard.press('Enter')

    // same block id converted — no extra sibling beyond the trailing invariant
    await expect(page.locator('[data-block-id="gen-1"] hr')).toHaveCount(1)
  })

  test('슬래시 삽입은 Ctrl-Z 한 번으로 되돌려진다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    await page.keyboard.type(' /head')
    await page.keyboard.press('Enter')
    await expect(page.locator('[data-block-id="gen-1"] h1')).toHaveCount(1)

    // the new block's PM session has no inline history — Mod-Z bubbles to the
    // block layer and rolls back the whole insert in one step
    await page.keyboard.press('Control+z')

    await expect(page.locator('[data-block-id="gen-1"]')).toHaveCount(0)
    await expect(page.locator('[data-block-id="p1"]')).toContainText('First')
  })
})
