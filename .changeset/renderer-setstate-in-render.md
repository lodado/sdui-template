---
'@lodado/sdui-template': patch
---

fix(sdui-template): move store merge out of render to stop setState-in-render warning

`SduiLayoutRenderer` ran `updateLayout`/`mergeLayout` inside `useMemo` (the render
phase). When the `document` prop changed after mount, `mergeLayout` synchronously
notified already-subscribed child nodes mid-render, producing React's dev warning
"Cannot update a component while rendering a different component" and risking tearing.

The store is now created and seeded once during the first render (no subscribers exist
yet, so the initial `updateLayout` notifies nobody and SSR/first-paint content is
preserved), and every subsequent `document` change merges in a commit-phase
`useLayoutEffect` (`useEffect` on the server). Public API and render output are
unchanged.
