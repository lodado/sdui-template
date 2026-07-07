import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Column split E2E — the horizontal drag-drop channel on top of dnd-kit:
 *
 * 1. ⠿ handle drag to a row's RIGHT/LEFT edge zone creates a columnList
 * 2. the gutter between columns resizes the pair (ratio patches)
 * 3. dragging the last content out of a column dissolves the split
 */
const EDITOR = '[data-sdui-document-editor]'

async function dragHandleToRowEdge(page: Page, activeId: string, overId: string, xRatio: number) {
  const handle = page.locator(`[data-drag-handle][aria-label="Drag block ${activeId}"]`)
  const targetRow = page.locator(`[data-block-id="${overId}"] [data-block-row]`).first()
  await page.locator(`[data-block-id="${activeId}"] [data-block-row]`).first().hover()
  const handleBox = await handle.boundingBox()
  const targetBox = await targetRow.boundingBox()
  if (!handleBox || !targetBox) {
    throw new Error('drag geometry unavailable')
  }

  await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)
  await page.mouse.down()
  // small initial move activates the pointer sensor before aiming at the edge
  await page.mouse.move(handleBox.x + handleBox.width / 2 + 8, handleBox.y + handleBox.height / 2, { steps: 3 })
  await page.mouse.move(targetBox.x + targetBox.width * xRatio, targetBox.y + targetBox.height / 2, { steps: 10 })
  await page.mouse.up()
}

test.describe('컬럼 분할 (가로 드래그)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('⠿ 핸들을 다른 행의 오른쪽 가장자리에 놓으면 2컬럼 분할이 생긴다', async ({ page }) => {
    await dragHandleToRowEdge(page, 'p3', 'p1', 0.95)

    const list = page.locator(`${EDITOR} [data-column-list]`)
    await expect(list).toHaveCount(1)
    const columns = list.locator(':scope > [data-column]')
    await expect(columns).toHaveCount(2)
    // side=right → over(p1) 왼쪽, active(p3) 오른쪽
    await expect(columns.nth(0).locator('[data-block-id="p1"]')).toBeVisible()
    await expect(columns.nth(1).locator('[data-block-id="p3"]')).toBeVisible()
  })

  test('왼쪽 가장자리 드롭은 좌우가 뒤집힌다', async ({ page }) => {
    await dragHandleToRowEdge(page, 'p3', 'p1', 0.05)

    const columns = page.locator(`${EDITOR} [data-column-list] > [data-column]`)
    await expect(columns).toHaveCount(2)
    await expect(columns.nth(0).locator('[data-block-id="p3"]')).toBeVisible()
    await expect(columns.nth(1).locator('[data-block-id="p1"]')).toBeVisible()
  })

  test('행 중앙 드롭은 분할을 만들지 않는다 (세로 이동 유지)', async ({ page }) => {
    await dragHandleToRowEdge(page, 'p3', 'p1', 0.5)

    await expect(page.locator(`${EDITOR} [data-column-list]`)).toHaveCount(0)
  })

  test('거터 드래그로 컬럼 비율이 바뀐다', async ({ page }) => {
    await dragHandleToRowEdge(page, 'p3', 'p1', 0.95)
    const gutter = page.locator('[data-column-resize]').first()
    await expect(gutter).toBeVisible()

    const gutterBox = await gutter.boundingBox()
    if (!gutterBox) {
      throw new Error('gutter geometry unavailable')
    }

    await page.mouse.move(gutterBox.x + gutterBox.width / 2, gutterBox.y + gutterBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(gutterBox.x + gutterBox.width / 2 + 80, gutterBox.y + gutterBox.height / 2, { steps: 5 })
    await page.mouse.up()

    const leftGrow = await page
      .locator(`${EDITOR} [data-column-list] > [data-column]`)
      .first()
      .evaluate((element) => (element as HTMLElement).style.flexGrow)
    expect(Number(leftGrow)).toBeGreaterThan(1)
  })

  test('컬럼의 마지막 블록을 밖으로 빼면 분할이 해체된다', async ({ page }) => {
    await dragHandleToRowEdge(page, 'p3', 'p1', 0.95)
    await expect(page.locator(`${EDITOR} [data-column-list]`)).toHaveCount(1)

    // p3(오른쪽 컬럼의 유일한 블록)를 p2 아래로 세로 드롭 → 빈 컬럼 → 해체
    await dragHandleToRowEdge(page, 'p3', 'p2', 0.5)

    await expect(page.locator(`${EDITOR} [data-column-list]`)).toHaveCount(0)
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible()
    await expect(page.locator('[data-block-id="p3"]')).toBeVisible()
  })
})
