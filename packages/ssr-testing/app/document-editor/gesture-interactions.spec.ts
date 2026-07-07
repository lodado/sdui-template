import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

/**
 * Gesture interaction E2E — the drag/selection channels must not fight:
 *
 * 1. native text selection — including PARTIAL selections crossing block
 *    boundaries (mid-block-a → mid-block-b), which native copy serializes
 * 2. inline text drag (HTML5 dnd off a single-block selection)
 * 3. block structure drag (dnd-kit, ⠿ handle only)
 * plus click-to-focus (single PM instance).
 */
const EDITOR = '[data-sdui-document-editor]'
const EDITABLE = '[contenteditable="true"]'

async function inlineRootBox(page: Page, blockId: string) {
  const root = page.locator(`[data-block-id="${blockId}"] [data-inline-root]`).first()
  const box = await root.boundingBox()
  if (!box) {
    throw new Error(`inline root geometry unavailable for ${blockId}`)
  }

  return box
}

/** Mouse-drags a horizontal text selection inside one block's inline root. */
async function selectTextByDrag(page: Page, blockId: string, fromRatio: number, toRatio: number) {
  const box = await inlineRootBox(page, blockId)
  const y = box.y + box.height / 2
  await page.mouse.move(box.x + box.width * fromRatio, y)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * toRatio, y, { steps: 5 })
  await page.mouse.up()
}

async function nativeSelectionText(page: Page): Promise<string> {
  return page.evaluate(() => window.getSelection()?.toString() ?? '')
}

/**
 * Viewport point at `ratio` across a block's rendered TEXT (not the inline
 * root box, which stretches to the full row width past the text end).
 */
async function textPoint(page: Page, blockId: string, ratio: number): Promise<{ x: number; y: number }> {
  return page.evaluate(
    ([id, r]) => {
      const root = document.querySelector(`[data-block-id="${id}"] [data-inline-root]`)!
      const range = document.createRange()
      range.selectNodeContents(root)
      const rect = range.getBoundingClientRect()

      return { x: rect.x + rect.width * Number(r), y: rect.y + rect.height / 2 }
    },
    [blockId, String(ratio)],
  )
}

/** Drags from mid-text of one block into mid-text of another (crossing rows). */
async function dragAcrossBlocks(page: Page, fromBlockId: string, toBlockId: string) {
  const from = await textPoint(page, fromBlockId, 0.4)
  const to = await textPoint(page, toBlockId, 0.5)
  await page.mouse.move(from.x, from.y)
  await page.mouse.down()
  await page.mouse.move(to.x, to.y, { steps: 8 })
  await page.mouse.up()
}

test.describe('제스처 상호작용 (충돌 검증)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('한 블록 안 텍스트 드래그는 네이티브 선택으로 남는다', async ({ page }) => {
    await selectTextByDrag(page, 'p1', 0.02, 0.35)

    expect((await nativeSelectionText(page)).length).toBeGreaterThan(0)
    // and the click that ends the drag must NOT steal focus into PM
    await expect(page.locator(EDITABLE)).toHaveCount(0)
  })

  test('블록 경계를 넘는 드래그는 부분 텍스트 네이티브 선택으로 유지된다', async ({ page }) => {
    await dragAcrossBlocks(page, 'p1', 'p2')

    const selected = await nativeSelectionText(page)
    // partial tail of "First" + partial head of "Second", no ⠿ glyph leaked in
    expect(selected).not.toContain('⠿')
    const lines = selected.split('\n').filter((line) => line.length > 0)
    expect(lines).toHaveLength(2)
    expect('First'.endsWith(lines[0])).toBe(true)
    expect(lines[0].length).toBeLessThan('First'.length)
    expect('Second'.startsWith(lines[1])).toBe(true)
    expect(lines[1].length).toBeLessThan('Second'.length)
    // ends without stealing focus into PM
    await expect(page.locator(EDITABLE)).toHaveCount(0)
  })

  test('부분 크로스 블록 선택 → Mod-C: 클립보드에 부분 텍스트가 이어져 담긴다', async ({
    page,
    context,
    browserName,
  }) => {
    test.skip(browserName !== 'chromium', 'clipboard read permission is Chromium-only in Playwright')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    await dragAcrossBlocks(page, 'p1', 'p2')
    const selected = await nativeSelectionText(page)

    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyC' : 'Control+KeyC')

    // newline count between blocks differs between Selection.toString and the
    // clipboard serializer — compare the non-empty lines
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText())
    const clipboardLines = clipboardText.split(/\r?\n/).filter((line) => line.length > 0)
    expect(clipboardLines).toEqual(selected.split('\n').filter((line) => line.length > 0))
    expect(clipboardText).not.toContain('⠿')
  })

  test('a 중간~b 중간 복사 → 다른 블록에 붙여넣기: 줄 구조가 살아서 붙는다', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard read permission is Chromium-only in Playwright')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // the user flow: partial cross-block selection → copy
    await dragAcrossBlocks(page, 'p1', 'p2')
    const selectedLines = (await nativeSelectionText(page)).split('\n').filter((line) => line.length > 0)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyC' : 'Control+KeyC')

    // focus p3 (caret at start) and paste
    await page.locator(EDITOR).getByText('Third').click()
    await expect(page.locator(EDITABLE)).toHaveCount(1)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyV' : 'Control+KeyV')

    // one block boundary in the copy → exactly one hard_break <br>
    // (rich text/html path: block boundaries, not raw newline count)
    await expect(page.locator(`${EDITABLE} br`)).toHaveCount(1)
    await expect(page.locator(EDITABLE)).toContainText(`${selectedLines[0]}${selectedLines[1]}Third`)

    // blur commits: the static view keeps the hard_break
    await page.locator(EDITOR).getByText('First').click()
    const staticHtml = await page.locator('[data-block-id="p3"] [data-inline-root]').first().innerHTML()
    expect(staticHtml).toContain('<br')
    await expect(page.locator('[data-block-id="p3"]')).toContainText(`${selectedLines[0]}${selectedLines[1]}Third`)
  })

  test('bold가 걸린 텍스트를 복사→붙여넣기하면 mark가 따라온다', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard read permission is Chromium-only in Playwright')
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])

    // arrange: make "First" bold via the selection toolbar, commit by blurring
    await page.locator(EDITOR).getByText('First').click()
    await page.locator(EDITABLE).dblclick({ position: { x: 12, y: 12 } })
    await page.getByRole('button', { name: 'Bold' }).click()
    await page.locator(EDITOR).getByText('Third').click()
    await expect(page.locator('[data-block-id="p1"] strong')).toContainText('First')

    // partial cross-block selection (tail of bold "First" + head of "Second") → copy
    await dragAcrossBlocks(page, 'p1', 'p2')
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyC' : 'Control+KeyC')

    // paste into p3
    await page.locator(EDITOR).getByText('Third').click()
    await expect(page.locator(EDITABLE)).toHaveCount(1)
    await page.keyboard.press(process.platform === 'darwin' ? 'Meta+KeyV' : 'Control+KeyV')

    // the bold mark traveled with the pasted fragment
    const pastedBold = page.locator(`${EDITABLE} strong`)
    await expect(pastedBold).toHaveCount(1)
    const boldText = (await pastedBold.textContent()) ?? ''
    expect(boldText.length).toBeGreaterThan(0)
    expect('First'.endsWith(boldText)).toBe(true)
    await expect(page.locator(`${EDITABLE} br`)).toHaveCount(1)

    // and survives the commit to the static view
    await page.locator(EDITOR).getByText('Second').click()
    await expect(page.locator('[data-block-id="p3"] strong')).toContainText(boldText)
  })

  test('클릭 한 번은 여전히 PM 포커스를 연다', async ({ page }) => {
    await page.locator(EDITOR).getByText('First').click()

    await expect(page.locator(EDITABLE)).toHaveCount(1)
  })

  test('⠿ 핸들 블록 드래그(dnd-kit)는 텍스트 선택을 만들지 않는다', async ({ page }) => {
    const handle = page.locator('[data-drag-handle][aria-label="Drag block p3"]')
    const targetRow = page.locator('[data-block-id="p1"] [data-block-row]').first()
    await page.locator('[data-block-id="p3"] [data-block-row]').first().hover()
    const handleBox = await handle.boundingBox()
    const targetBox = await targetRow.boundingBox()
    if (!handleBox || !targetBox) {
      throw new Error('drag geometry unavailable')
    }

    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)
    await page.mouse.down()
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 8, handleBox.y + handleBox.height / 2, { steps: 3 })
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height * 0.1, { steps: 10 })
    await page.mouse.up()

    // block moved (dnd-kit won), no text selection appeared
    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p3')
    expect(await nativeSelectionText(page)).toBe('')
  })
})

test.describe('인라인 텍스트 드래그 (HTML5)', () => {
  test.beforeEach(async ({ page, browserName }) => {
    test.skip(browserName !== 'chromium', 'HTML5 drag simulation is reliable on Chromium only')
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  /**
   * Playwright's synthetic mouse cannot enter the OS drag loop, so a raw
   * mouse gesture on a selection never fires dragstart (verified by probe:
   * only selectstart fires). The drag events are dispatched synthetically
   * instead — the app-side path (selection capture, session, real
   * caretRangeFromPoint offset mapping, patches, refocus) runs for real.
   */
  test('선택한 텍스트를 다른 블록으로 드래그하면 이동한다', async ({ page }) => {
    // word-select "First" inside the static p1 (dblclick keeps the selection:
    // the click-to-focus guard skips non-collapsed selections)
    await page
      .locator('[data-block-id="p1"] [data-inline-root]')
      .first()
      .dblclick({ position: { x: 12, y: 8 } })
    expect(await nativeSelectionText(page)).toBe('First')

    // dragstart on the source (separate tick: the deferred focus-clear runs like a real drag)
    await page.evaluate(() => {
      const source = document.querySelector('[data-block-id="p1"] [data-inline-root]')!
      source.dispatchEvent(
        new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer: new DataTransfer() }),
      )
    })

    // dragover + drop on the middle of p2's text
    await page.evaluate(() => {
      const target = document.querySelector('[data-block-id="p2"] [data-inline-root]')!
      const rect = target.getBoundingClientRect()
      const init = {
        bubbles: true,
        cancelable: true,
        dataTransfer: new DataTransfer(),
        clientX: rect.x + rect.width / 2,
        clientY: rect.y + rect.height / 2,
      }
      target.dispatchEvent(new DragEvent('dragover', init))
      target.dispatchEvent(new DragEvent('drop', init))
    })

    // text landed inside p2 at the caret position, source range removed from p1
    await expect(page.locator('[data-block-id="p2"]')).toContainText('First')
    const p1Text = await page.locator('[data-block-id="p1"] [data-inline-root]').first().textContent()
    expect(p1Text ?? '').not.toContain('First')
    // drop focuses the target block with PM mounted
    await expect(page.locator(`[data-block-id="p2"] ${EDITABLE}`)).toHaveCount(1)
  })
})
