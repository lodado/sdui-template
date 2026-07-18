import { readFileSync } from 'fs'
import { join } from 'path'

const motionCss = readFileSync(join(__dirname, '../motion.css'), 'utf-8')

describe('motion.css tokens', () => {
  it('defines the three duration tokens', () => {
    expect(motionCss).toContain('--motion-duration-fast:')
    expect(motionCss).toContain('--motion-duration-medium:')
    expect(motionCss).toContain('--motion-duration-slow:')
  })

  it('defines the four easing tokens', () => {
    expect(motionCss).toContain('--motion-ease-out:')
    expect(motionCss).toContain('--motion-ease-in:')
    expect(motionCss).toContain('--motion-ease-in-out:')
    expect(motionCss).toContain('--motion-ease-spring:')
  })

  it('zeroes durations under prefers-reduced-motion', () => {
    const reducedBlock = motionCss.slice(motionCss.indexOf('@media (prefers-reduced-motion: reduce)'))
    expect(reducedBlock).toContain('--motion-duration-fast: 0ms')
    expect(reducedBlock).toContain('--motion-duration-medium: 0ms')
    expect(reducedBlock).toContain('--motion-duration-slow: 0ms')
  })

  it('prefixes every keyframe with sdui-', () => {
    const keyframeNames = [...motionCss.matchAll(/@keyframes\s+([\w-]+)/g)].map((m) => m[1])
    expect(keyframeNames.length).toBeGreaterThan(0)
    keyframeNames.forEach((name) => expect(name).toMatch(/^sdui-/))
  })
})
