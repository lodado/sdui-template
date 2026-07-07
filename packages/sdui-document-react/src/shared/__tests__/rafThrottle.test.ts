import { rafThrottle } from '../rafThrottle'

describe('rafThrottle', () => {
  let frames: Map<number, () => void>
  let nextId: number
  let rafSpy: jest.SpyInstance
  let cancelSpy: jest.SpyInstance

  const flush = () => {
    const pending = [...frames.values()]
    frames.clear()
    pending.forEach((cb) => cb())
  }

  beforeEach(() => {
    frames = new Map()
    nextId = 1
    rafSpy = jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      const id = nextId++
      frames.set(id, () => cb(0))
      return id
    })
    cancelSpy = jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((id: number) => {
      frames.delete(id)
    })
  })

  afterEach(() => {
    rafSpy.mockRestore()
    cancelSpy.mockRestore()
  })

  it('coalesces multiple calls in one frame into a single call with the latest args', () => {
    const fn = jest.fn()
    const throttled = rafThrottle(fn)

    throttled(1)
    throttled(2)
    throttled(3)
    expect(fn).not.toHaveBeenCalled() // deferred to the frame

    flush()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(3) // latest args win
  })

  it('schedules a new frame after the previous one fires', () => {
    const fn = jest.fn()
    const throttled = rafThrottle(fn)

    throttled('a')
    flush()
    throttled('b')
    flush()

    expect(fn).toHaveBeenCalledTimes(2)
    expect(fn).toHaveBeenNthCalledWith(2, 'b')
  })

  it('cancel() prevents a pending frame from firing', () => {
    const fn = jest.fn()
    const throttled = rafThrottle(fn)

    throttled('x')
    throttled.cancel()
    flush()

    expect(fn).not.toHaveBeenCalled()
  })

  it('falls back to synchronous invocation when rAF is unavailable', () => {
    rafSpy.mockImplementation(() => {
      throw new Error('should not schedule')
    })
    const original = globalThis.requestAnimationFrame
    // @ts-expect-error simulate SSR: no rAF
    globalThis.requestAnimationFrame = undefined

    const fn = jest.fn()
    const throttled = rafThrottle(fn)
    throttled('sync')

    expect(fn).toHaveBeenCalledWith('sync')
    globalThis.requestAnimationFrame = original
  })
})
