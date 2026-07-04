import { positionDropIndicatorOverlay } from '../hooks/dropIndicatorOverlay'

const INDENT_WIDTH = 24

function createDom() {
  const container = document.createElement('div')
  const row = document.createElement('div')
  row.setAttribute('data-block-id', 'target')
  row.setAttribute('data-depth', '1')
  const rowContent = document.createElement('div')
  row.appendChild(rowContent)
  container.appendChild(row)

  const overlay = document.createElement('div')
  overlay.style.display = 'none'
  container.appendChild(overlay)

  return { container, overlay }
}

describe('positionDropIndicatorOverlay', () => {
  describe('as is: hidden overlay with a valid drop projection (EP: happy partition)', () => {
    describe('when painted for a drop one level deeper than the row (BVA: depth +1)', () => {
      it('to be: visible, shifted by one indent unit, tagged with the position', () => {
        const { container, overlay } = createDom()

        positionDropIndicatorOverlay(
          overlay,
          container,
          { overId: 'target', position: 'inside', depth: 2 },
          INDENT_WIDTH,
        )

        expect(overlay.style.display).toBe('block')
        expect(overlay.getAttribute('data-drop-position')).toBe('inside')
        // jsdom rects are zero — the offset comes purely from the depth delta
        expect(overlay.style.transform).toBe(`translate(${INDENT_WIDTH}px, 0px)`)
        expect(overlay.style.width).toBe(`${INDENT_WIDTH}px`)
      })
    })

    describe('when painted at the same depth as the row (BVA: depth delta 0)', () => {
      it('to be: no horizontal shift', () => {
        const { container, overlay } = createDom()

        positionDropIndicatorOverlay(
          overlay,
          container,
          { overId: 'target', position: 'after', depth: 1 },
          INDENT_WIDTH,
        )

        expect(overlay.style.transform).toBe('translate(0px, 0px)')
        expect(overlay.getAttribute('data-drop-position')).toBe('after')
      })
    })
  })

  describe('as is: visible overlay (EP: hide partition)', () => {
    describe('when painted with a null projection', () => {
      it('to be: hidden and untagged', () => {
        const { container, overlay } = createDom()
        positionDropIndicatorOverlay(
          overlay,
          container,
          { overId: 'target', position: 'after', depth: 1 },
          INDENT_WIDTH,
        )

        positionDropIndicatorOverlay(overlay, container, null, INDENT_WIDTH)

        expect(overlay.style.display).toBe('none')
        expect(overlay.hasAttribute('data-drop-position')).toBe(false)
      })
    })

    describe('when the over row does not exist in the DOM (EP: stale projection)', () => {
      it('to be: hidden', () => {
        const { container, overlay } = createDom()

        positionDropIndicatorOverlay(
          overlay,
          container,
          { overId: 'missing', position: 'after', depth: 1 },
          INDENT_WIDTH,
        )

        expect(overlay.style.display).toBe('none')
      })
    })

    describe('when the block id contains selector metacharacters (EP: injection partition)', () => {
      it('to be: no throw, overlay hidden', () => {
        const { container, overlay } = createDom()

        expect(() =>
          positionDropIndicatorOverlay(
            overlay,
            container,
            { overId: '"]\\evil', position: 'after', depth: 1 },
            INDENT_WIDTH,
          ),
        ).not.toThrow()
        expect(overlay.style.display).toBe('none')
      })
    })
  })
})
