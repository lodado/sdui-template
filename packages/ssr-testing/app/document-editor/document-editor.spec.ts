import type { CDPSession, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Hybrid document editor E2E.
 *
 * Verifies the focused-block ProseMirror architecture in a real browser:
 * single PM instance, split/merge/indent via keymap delegation, and —
 * critically — Korean IME composition, which jsdom cannot exercise.
 */
const EDITOR = '[data-sdui-document-editor]'
const EDITABLE = '[contenteditable="true"]'

async function focusBlock(page: Page, text: string) {
  await page.locator(EDITOR).getByText(text).click()
  await expect(page.locator(EDITABLE)).toHaveCount(1)
}

test.describe('Document editor (hybrid ProseMirror)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('블록 클릭 시 ProseMirror 인스턴스가 정확히 하나만 마운트된다', async ({ page }) => {
    await expect(page.locator(EDITABLE)).toHaveCount(0)

    await focusBlock(page, 'First')

    await expect(page.locator(EDITABLE)).toHaveCount(1)

    // moving focus keeps the instance count at one
    await page.locator(EDITOR).getByText('Second').click()
    await expect(page.locator(EDITABLE)).toHaveCount(1)
  })

  test('타이핑 후 다른 블록으로 이동하면 정적 뷰에 커밋된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.type('Edited ')

    await page.locator(EDITOR).getByText('Second').click()

    await expect(page.locator('[data-block-id="p1"]')).toContainText('Edited First')
  })

  test('Enter로 블록이 분할되고 포커스가 새 블록으로 이동한다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('Enter')

    await expect(page.locator('[data-block-id]')).toHaveCount(4)
    const focusedRow = page.locator('[data-block-id]', { has: page.locator(EDITABLE) })
    await expect(focusedRow).toHaveAttribute('data-block-id', 'gen-1')
  })

  test('블록 시작에서 Backspace로 이전 블록과 병합된다', async ({ page }) => {
    await focusBlock(page, 'Second')
    await page.keyboard.press('Backspace')

    await expect(page.locator('[data-block-id="p2"]')).toHaveCount(0)
    await expect(page.locator(EDITABLE)).toContainText('FirstSecond')
  })

  test('Tab으로 들여쓰기, Shift-Tab으로 내어쓰기된다', async ({ page }) => {
    await focusBlock(page, 'Second')
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-block-id="p2"]')).toHaveAttribute('data-depth', '2')

    await page.keyboard.press('Shift+Tab')
    await expect(page.locator('[data-block-id="p2"]')).toHaveAttribute('data-depth', '1')
  })

  test('Escape로 block selection 진입, Backspace로 블록 삭제', async ({ page }) => {
    await focusBlock(page, 'Second')
    await page.keyboard.press('Escape')

    await expect(page.locator(EDITABLE)).toHaveCount(0)
    await expect(page.locator('[data-block-id="p2"]')).toHaveAttribute('data-selected', 'true')

    await page.keyboard.press('Backspace')
    await expect(page.locator('[data-block-id="p2"]')).toHaveCount(0)
  })
})

test.describe('한글 IME 조합 입력', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'IME simulation requires CDP (Chromium only)')
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  /** Simulates the Korean IME composing one syllable then committing it. */
  async function composeSyllable(cdp: CDPSession, steps: string[], committed: string) {
    // composition updates must be strictly sequential
    await steps.reduce(
      (chain, composing) =>
        chain.then(async () => {
          await cdp.send('Input.imeSetComposition', {
            text: composing,
            selectionStart: composing.length,
            selectionEnd: composing.length,
          })
        }),
      Promise.resolve(),
    )
    await cdp.send('Input.insertText', { text: committed })
  }

  test('조합 입력(한글)이 깨지지 않고 커밋된다', async ({ page }) => {
    await focusBlock(page, 'First')
    const cdp = await page.context().newCDPSession(page)

    await composeSyllable(cdp, ['ㅎ', '하', '한'], '한')
    await composeSyllable(cdp, ['ㄱ', '그', '글'], '글')

    await expect(page.locator(EDITABLE)).toContainText('한글First')

    // blur commits the composed text to the static view
    await page.locator(EDITOR).getByText('Second').click()
    await expect(page.locator('[data-block-id="p1"]')).toContainText('한글First')
  })

  test('조합 완료 후 Enter 분할 시 한글이 보존된다', async ({ page }) => {
    await focusBlock(page, 'First')
    const cdp = await page.context().newCDPSession(page)

    await composeSyllable(cdp, ['ㅎ', '하', '한'], '한')
    await page.keyboard.press('Enter')

    // split at caret (after 한): p1 keeps 한, new block gets First
    await expect(page.locator('[data-block-id="p1"]')).toContainText('한')
    await expect(page.locator(EDITABLE)).toContainText('First')
  })
})
