import { isEmptyDocument } from '@lodado/sdui-document'
import { type RefObject, useEffect } from 'react'

import { useDocumentContent } from './DocumentContentContext'

/**
 * Reflects the empty-document placeholder condition as `data-doc-empty` on the
 * editor container. Empty-ness is a whole-doc predicate (it depends on the sole
 * block's text), so it lives with the doc snapshot store, not the container —
 * this null leaf re-renders per commit in isolation and paints the attribute via
 * the container ref, leaving the container's own render count at one.
 */
export const DocEmptyFlag = ({ containerRef }: { containerRef: RefObject<HTMLElement> }) => {
  const content = useDocumentContent()

  // useEffect (not layout): a child's layout effect runs before the PARENT
  // container's ref is attached, so containerRef would be null. Passive effects
  // run after the whole commit, once the ref exists.
  useEffect(() => {
    const el = containerRef.current
    if (!el) {
      return
    }
    // ponytail: DOM write instead of a container re-render — the whole point is the container never re-renders
    el.toggleAttribute('data-doc-empty', content ? isEmptyDocument(content) : false)
  }, [content, containerRef])

  return null
}
