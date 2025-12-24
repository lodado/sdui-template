require('@testing-library/jest-dom')

;(() => {
  window.ResizeObserver =
    window.ResizeObserver ||
    class {
      disconnect = () => {}
      observe = () => {}
      unobserve = () => {}
    }
})()
