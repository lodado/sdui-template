import { cardVariants } from '../card-variants'

describe('cardVariants interactivity', () => {
  it('static card (default) has no hover/press motion', () => {
    const classes = cardVariants({})
    expect(classes).not.toContain('hover:-translate-y-px')
    expect(classes).not.toContain('active:scale-[0.99]')
  })

  it('interactive card lifts on hover and settles on press', () => {
    const classes = cardVariants({ isInteractive: true })
    expect(classes).toContain('hover:-translate-y-px')
    expect(classes).toContain('active:scale-[0.99]')
    expect(classes).toContain('duration-[var(--motion-duration-fast)]')
  })
})
