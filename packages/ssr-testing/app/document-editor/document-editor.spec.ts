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

test.describe('Keyboard shortcuts (Phase 24 — Outline parity)', () => {
  // PM "Mod-" resolves to Meta on macOS browsers, Ctrl elsewhere.
  const MOD = process.platform === 'darwin' ? 'Meta' : 'Control'

  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('Ctrl-Shift-1로 paragraph가 h1으로 turn-into 된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('Control+Shift+Digit1')

    await expect(page.locator('[data-block-id="p1"] h1')).toHaveCount(1)

    // Ctrl-Shift-0 turns it back into a paragraph
    await page.keyboard.press('Control+Shift+Digit0')
    await expect(page.locator('[data-block-id="p1"] h1')).toHaveCount(0)
    await expect(page.locator('[data-block-id="p1"] p')).toHaveCount(1)
  })

  test('**bold** 입력 시 bold mark가 적용되고 커밋 후 정적 뷰에 남는다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    await page.keyboard.type(' **bold**')

    await expect(page.locator(`${EDITABLE} strong`)).toHaveText('bold')

    await page.locator(EDITOR).getByText('Second').click()
    await expect(page.locator('[data-block-id="p1"] strong')).toHaveText('bold')
  })

  test('"[] " 입력으로 checklist가 되고 Mod-Enter로 토글된다', async ({ page }) => {
    await focusBlock(page, 'Third')
    await page.keyboard.press('Home')
    await page.keyboard.type('[] ')

    const checkbox = page.locator('[data-block-id="p3"] .checkbox')
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')

    await page.keyboard.press(`${MOD}+Enter`)
    await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  })

  test('Mod-Alt-ArrowDown으로 블록이 아래 sibling과 자리를 바꾼다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press(`${MOD}+Alt+ArrowDown`)

    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p2')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p1')
  })

  test('Mod-Alt-ArrowDown 이동 후 focus 상태에서 Mod-Z/Mod-Shift-Z로 undo/redo 된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press(`${MOD}+Alt+ArrowDown`)

    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p2')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p1')

    // undo the move
    await page.keyboard.press(`${MOD}+z`)
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p1')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p2')

    // redo the move
    await page.keyboard.press(`${MOD}+Shift+z`)
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p2')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p1')
  })

  test('Shift-Enter로 hard break가 들어간다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('End')
    await page.keyboard.press('Shift+Enter')

    await expect(page.locator(`${EDITABLE} br:not(.ProseMirror-trailingBreak)`)).toHaveCount(1)
  })

  test('selection 모드: 방향키로 이동, Enter로 편집 재진입', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('Escape')
    await expect(page.locator('[data-block-id="p1"]')).toHaveAttribute('data-selected', 'true')

    await page.keyboard.press('ArrowDown')
    await expect(page.locator('[data-block-id="p2"]')).toHaveAttribute('data-selected', 'true')
    await expect(page.locator('[data-block-id="p1"]')).not.toHaveAttribute('data-selected', 'true')

    await page.keyboard.press('Enter')
    await expect(page.locator(EDITABLE)).toHaveCount(1)
    await expect(page.locator('[data-block-id="p2"] [contenteditable="true"]')).toHaveCount(1)
  })

  test('selection 모드: Mod-D로 블록이 복제된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await page.keyboard.press('Escape')

    await page.keyboard.press(`${MOD}+KeyD`)

    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows).toHaveCount(4)
    await expect(rows.nth(1)).toContainText('First')
    await expect(rows.nth(1)).not.toHaveAttribute('data-block-id', 'p1')
  })
})

test.describe('Selection formatting toolbar', () => {
  const TOOLBAR = '.sdui-doc-toolbar'

  /**
   * Word-select inside the PM editable. The editable is display:block (full
   * row width), so a centered dblclick would land right of the text and
   * select nothing — aim at the first word instead.
   */
  async function selectFirstWord(page: Page) {
    await page.locator(EDITABLE).dblclick({ position: { x: 12, y: 12 } })
    await expect(page.locator(TOOLBAR)).toBeVisible()
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('캐럿(collapsed)에서는 툴바가 없고, 더블클릭 선택 시 툴바가 뜬다', async ({ page }) => {
    await focusBlock(page, 'First')
    await expect(page.locator(TOOLBAR)).toHaveCount(0)

    await selectFirstWord(page)
  })

  test('Bold 버튼 클릭 시 선택 텍스트에 <strong>이 적용되고 blur 커밋 후 정적 뷰에 남는다', async ({ page }) => {
    await focusBlock(page, 'First')
    await selectFirstWord(page)

    await page.getByRole('button', { name: 'Bold' }).click()
    await expect(page.locator(`${EDITABLE} strong`)).toContainText('First')

    // blur commits the mark through the normal block.update channel
    await page.locator(EDITOR).getByText('Second').click()
    await expect(page.locator('[data-block-id="p1"] strong')).toContainText('First')
  })

  test('활성 mark는 aria-pressed로 표시되고 재클릭 시 해제된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await selectFirstWord(page)

    const bold = page.getByRole('button', { name: 'Bold' })
    await bold.click()
    await expect(bold).toHaveAttribute('aria-pressed', 'true')

    await bold.click()
    await expect(bold).toHaveAttribute('aria-pressed', 'false')
    await expect(page.locator(`${EDITABLE} strong`)).toHaveCount(0)
  })

  test('highlight 팔레트에서 색을 고르면 mark[data-color]가 적용된다', async ({ page }) => {
    await focusBlock(page, 'First')
    await selectFirstWord(page)

    await page.getByRole('button', { name: 'Highlight' }).click()
    await page.getByRole('button', { name: 'Highlight Coral' }).click()

    await expect(page.locator(`${EDITABLE} mark[data-color="#FDEA9B"]`)).toContainText('First')
  })
})

test.describe('Block drag and drop', () => {
  /**
   * Drags a block's handle onto a vertical position within the target row.
   * ratio 0..1 maps to the row's top..bottom edge (0.5 = middle → nest,
   * 0.1 = top zone → before, 0.9 = bottom zone → after).
   */
  async function dragBlockOnto(page: Page, blockId: string, targetId: string, ratio: number) {
    const handle = page.getByRole('button', { name: `Drag block ${blockId}` })
    const targetRow = page.locator(`[data-block-id="${targetId}"] [data-block-row]`).first()
    const handleBox = await handle.boundingBox()
    const targetBox = await targetRow.boundingBox()
    if (!handleBox || !targetBox) {
      throw new Error('drag geometry unavailable')
    }

    await page.mouse.move(handleBox.x + handleBox.width / 2, handleBox.y + handleBox.height / 2)
    await page.mouse.down()
    // exceed the 4px activation distance before aiming at the target
    await page.mouse.move(handleBox.x + handleBox.width / 2 + 8, handleBox.y + handleBox.height / 2, { steps: 3 })
    await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height * ratio, { steps: 10 })
    await page.mouse.up()
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/document-editor')
    await expect(page.locator('[data-block-id="p1"]')).toBeVisible({ timeout: 15000 })
  })

  test('드래그 핸들은 블록에 호버했을 때만 보인다', async ({ page }) => {
    const handle = page.getByRole('button', { name: 'Drag block p1' })
    const row = page.locator('[data-block-id="p1"] [data-block-row]').first()
    const otherRow = page.locator('[data-block-id="p3"] [data-block-row]').first()

    // Hover-reveal only applies when the primary pointer can hover. Touch-primary
    // (and some headless) environments keep handles always visible by design.
    const hoverReveal = await page.evaluate(() => matchMedia('(hover: hover)').matches)
    test.skip(!hoverReveal, 'hover-reveal requires (hover: hover)')

    // clear any sticky :hover from prior tests / default pointer position
    await page.mouse.move(0, 0)
    await expect(handle).toHaveCSS('opacity', '0')

    await row.hover()
    await expect(handle).toHaveCSS('opacity', '1')

    await otherRow.hover()
    await expect(handle).toHaveCSS('opacity', '0')
  })

  test('블록을 다른 블록 위(중앙)에 놓으면 그 블록의 child로 중첩된다', async ({ page }) => {
    await dragBlockOnto(page, 'p3', 'p2', 0.5)

    await expect(page.locator('[data-block-id="p2"] [data-block-id="p3"]')).toHaveCount(1)
    await expect(page.locator('[data-block-id="p3"]')).toHaveAttribute('data-depth', '2')
  })

  test('블록을 다른 블록의 위쪽 가장자리에 놓으면 그 블록 위(sibling)에 놓인다', async ({ page }) => {
    await dragBlockOnto(page, 'p3', 'p1', 0.1)

    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p3')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p1')
    await expect(page.locator('[data-block-id="p3"]')).toHaveAttribute('data-depth', '1')
  })

  test('블록을 다른 블록의 아래쪽 가장자리에 놓으면 그 블록 바로 아래(sibling)에 놓인다', async ({ page }) => {
    await dragBlockOnto(page, 'p1', 'p2', 0.9)

    const rows = page.locator('[data-sdui-document-editor] > [data-block-id]')
    await expect(rows.nth(0)).toHaveAttribute('data-block-id', 'p2')
    await expect(rows.nth(1)).toHaveAttribute('data-block-id', 'p1')
    await expect(rows.nth(2)).toHaveAttribute('data-block-id', 'p3')
  })

  test('중첩된 child가 있는 부모 위에 놓으면 첫 번째 child 슬롯(인디케이터 라인 위치)에 들어간다', async ({ page }) => {
    // arrange: nest p3 under p2 first
    await dragBlockOnto(page, 'p3', 'p2', 0.5)
    await expect(page.locator('[data-block-id="p2"] [data-block-id="p3"]')).toHaveCount(1)

    // act: drop p1 onto the middle of p2 (which now has child p3)
    await dragBlockOnto(page, 'p1', 'p2', 0.5)

    // assert: p1 lands as the FIRST child — exactly where the indicator pointed
    const children = page.locator('[data-block-id="p2"] [data-block-nested] > [data-block-id]')
    await expect(children.nth(0)).toHaveAttribute('data-block-id', 'p1')
    await expect(children.nth(1)).toHaveAttribute('data-block-id', 'p3')
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
