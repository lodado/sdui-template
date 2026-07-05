import type { Locator, Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Shift-Enter multiline alignment (Notion parity).
 *
 * A hard break must NOT drag the block chrome to the block's vertical
 * middle: the checkbox and the drag/plus handles stay pinned to the FIRST
 * text line, while single-line blocks keep their original centered position.
 */
const EDITOR = '[data-sdui-document-editor]'
const EDITABLE = '[contenteditable="true"]'

/** One paragraph line box: 16px font × 1.5 line-height. */
const LINE = 24
/** Block vertical padding (--sdui-doc-block-padding-y). */
const PAD_Y = 3
/** Font-metric slack across browsers/platforms. */
const TOLERANCE = 3

async function focusBlock(page: Page, text: string) {
  await page.locator(EDITOR).getByText(text).click()
  await expect(page.locator(EDITABLE)).toHaveCount(1)
}

async function box(locator: Locator) {
  const rect = await locator.boundingBox()
  if (!rect) {
    throw new Error(`no bounding box for ${String(locator)}`)
  }
  return rect
}

async function centerY(locator: Locator) {
  const rect = await box(locator)
  return rect.y + rect.height / 2
}

test.describe('Shift-Enter 멀티라인 정렬', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('체크리스트에서 Shift-Enter로 여러 줄이 되어도 체크박스는 첫 줄에 고정된다', async ({ page }) => {
    await focusBlock(page, 'Third')
    await page.keyboard.press('Home')
    await page.keyboard.type('[] ')
    await page.keyboard.press('End')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('second line')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('third line')

    const content = await box(page.locator('[data-block-id="p3"] .content'))
    expect(content.height).toBeGreaterThanOrEqual(LINE * 3 - TOLERANCE)

    const firstLineCenter = content.y + LINE / 2
    expect(
      Math.abs((await centerY(page.locator('[data-block-id="p3"] .checkbox'))) - firstLineCenter),
    ).toBeLessThanOrEqual(TOLERANCE)
  })

  test('멀티라인 블록에서 드래그 핸들과 + 버튼은 첫 줄 옆에 고정된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('line two')
    await page.keyboard.press('Escape')

    const row = await box(page.locator('[data-block-id="p1"] [data-block-row]').first())
    expect(row.height).toBeGreaterThanOrEqual(LINE * 2)

    const firstLineCenter = row.y + PAD_Y + LINE / 2
    expect(
      Math.abs((await centerY(page.getByRole('button', { name: 'Drag block p1' }))) - firstLineCenter),
    ).toBeLessThanOrEqual(TOLERANCE)
    expect(
      Math.abs((await centerY(page.getByRole('button', { name: 'Add block below p1' }))) - firstLineCenter),
    ).toBeLessThanOrEqual(TOLERANCE)
  })

  test('한 줄 블록의 핸들 위치는 기존과 동일하게 행 중앙이다 (회귀 방지)', async ({ page }) => {
    const row = await box(page.locator('[data-block-id="p2"] [data-block-row]').first())
    const rowCenter = row.y + row.height / 2

    expect(
      Math.abs((await centerY(page.getByRole('button', { name: 'Drag block p2' }))) - rowCenter),
    ).toBeLessThanOrEqual(TOLERANCE)
  })

  test('멀티라인 h1에서도 핸들이 첫 줄 기준으로 정렬된다', async ({ page }) => {
    await focusBlock(page, 'Second')
    await page.keyboard.press('Control+Shift+Digit1')
    await page.keyboard.press('End')
    await page.keyboard.press('Shift+Enter')
    await page.keyboard.type('wrapped')
    await page.keyboard.press('Escape')

    // h1 first line box: 28px font × 1.5 = 42px after the 3px block padding
    const heading = await box(page.locator('[data-block-id="p2"] h1'))
    const firstLineCenter = heading.y + PAD_Y + (28 * 1.5) / 2

    expect(
      Math.abs((await centerY(page.getByRole('button', { name: 'Drag block p2' }))) - firstLineCenter),
    ).toBeLessThanOrEqual(TOLERANCE)
  })
})
