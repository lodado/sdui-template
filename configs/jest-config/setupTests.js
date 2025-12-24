import '@testing-library/jest-dom'

// ResizeObserver polyfill for jsdom
if (typeof window !== 'undefined') {
  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      disconnect = () => {}
      observe = () => {}
      unobserve = () => {}
    }
}
