import { buttonVariants } from '../button-variants'

describe('buttonVariants press feedback', () => {
  it('adds an active press-scale by default', () => {
    expect(buttonVariants({})).toContain('active:scale-[0.97]')
  })

  it('drives motion off tokens, not hardcoded durations', () => {
    const classes = buttonVariants({})
    expect(classes).toContain('duration-[var(--motion-duration-fast)]')
    expect(classes).not.toContain('duration-200')
  })

  it('disables interaction (and thus press-scale) when disabled', () => {
    expect(buttonVariants({ isDisabled: true })).toContain('pointer-events-none')
  })

  it('disables interaction while loading', () => {
    expect(buttonVariants({ isLoading: true })).toContain('pointer-events-none')
  })
})
