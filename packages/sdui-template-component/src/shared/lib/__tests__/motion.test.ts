import { MOTION } from '../motion'

describe('MOTION class fragments', () => {
  it('surface animates both open and closed states', () => {
    expect(MOTION.surface).toContain('data-[state=open]:animate-[sdui-pop-in')
    expect(MOTION.surface).toContain('data-[state=closed]:animate-[sdui-pop-out')
  })

  it('overlay fades both states', () => {
    expect(MOTION.overlay).toContain('data-[state=open]:animate-[sdui-fade-in')
    expect(MOTION.overlay).toContain('data-[state=closed]:animate-[sdui-fade-out')
  })

  it('pressable adds an active scale feedback', () => {
    expect(MOTION.pressable).toContain('active:scale-[0.97]')
  })

  it('drives every duration off a motion token', () => {
    expect(MOTION.colors).toContain('duration-[var(--motion-duration-fast)]')
    expect(MOTION.pressable).toContain('duration-[var(--motion-duration-fast)]')
  })
})
