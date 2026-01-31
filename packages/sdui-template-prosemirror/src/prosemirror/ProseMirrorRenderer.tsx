'use client'

import { useSduiLayoutAction, useSduiNodeSubscription } from '@lodado/sdui-template'
import { baseKeymap } from 'prosemirror-commands'
import { history } from 'prosemirror-history'
import { keymap } from 'prosemirror-keymap'
import { Node as ProseMirrorNode } from 'prosemirror-model'
import { EditorState } from 'prosemirror-state'
import { EditorView } from 'prosemirror-view'
import React, { useEffect, useMemo, useRef } from 'react'

import { defaultProseMirrorSchema } from './schema'
import type { ProseMirrorNodeState } from './types'

const createEmptyDoc = (): ProseMirrorNode => {
  return (
    defaultProseMirrorSchema.topNodeType.createAndFill() ||
    defaultProseMirrorSchema.node('doc', null, [defaultProseMirrorSchema.node('paragraph')])
  )
}

const parseDoc = (doc?: Record<string, unknown>): ProseMirrorNode => {
  if (!doc) {
    return createEmptyDoc()
  }

  try {
    return ProseMirrorNode.fromJSON(defaultProseMirrorSchema, doc)
  } catch (error) {
    return createEmptyDoc()
  }
}

export const ProseMirrorRenderer = ({ id }: { id: string }) => {
  const { state, attributes } = useSduiNodeSubscription({ nodeId: id }) as {
    state: ProseMirrorNodeState
    attributes?: Record<string, unknown>
  }
  const store = useSduiLayoutAction()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const viewRef = useRef<EditorView | null>(null)
  const lastSerializedDocRef = useRef<string | null>(null)
  const initialDocRef = useRef<Record<string, unknown> | undefined>(state?.doc)

  const editable = state?.editable !== false
  const className = typeof attributes?.className === 'string' ? attributes.className : undefined
  const style = typeof attributes?.style === 'object' ? (attributes.style as React.CSSProperties) : undefined

  const plugins = useMemo(() => [history(), keymap(baseKeymap)], [])

  useEffect(() => {
    if (!containerRef.current || viewRef.current) {
      return undefined
    }

    const doc = parseDoc(initialDocRef.current)
    const editorState = EditorState.create({
      schema: defaultProseMirrorSchema,
      doc,
      plugins,
    })

    const view = new EditorView(containerRef.current, {
      state: editorState,
      dispatchTransaction: (transaction) => {
        const nextState = view.state.apply(transaction)
        view.updateState(nextState)

        if (transaction.docChanged || transaction.selectionSet) {
          const nextDoc = nextState.doc.toJSON()
          const serialized = JSON.stringify(nextDoc)
          lastSerializedDocRef.current = serialized
          store.updateNodeState(id, { doc: nextDoc })
        }
      },
    })

    view.setProps({
      editable: () => editable,
    })

    viewRef.current = view
    lastSerializedDocRef.current = JSON.stringify(initialDocRef.current ?? null)

    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [editable, id, plugins, store])

  useEffect(() => {
    const view = viewRef.current
    if (!view) {
      return
    }

    const serializedDoc = JSON.stringify(state?.doc ?? null)
    if (serializedDoc === lastSerializedDocRef.current) {
      return
    }

    const nextDoc = parseDoc(state?.doc)
    const nextState = EditorState.create({
      schema: defaultProseMirrorSchema,
      doc: nextDoc,
      plugins,
    })

    view.updateState(nextState)
    lastSerializedDocRef.current = serializedDoc
  }, [plugins, state?.doc])

  useEffect(() => {
    if (!viewRef.current) {
      return
    }

    viewRef.current.setProps({
      editable: () => editable,
    })
  }, [editable])

  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
      data-testid={`prosemirror-${id}`}
    />
  )
}
