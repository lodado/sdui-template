'use client'

/**
 * SDUI Layout Renderer
 *
 * SDUI Layout Document를 받아서 전체 UI를 렌더링하는 최상위 컴포넌트입니다.
 * Render Props Pattern: renderNode 함수를 정의하고 하위 컴포넌트에 주입합니다.
 *
 * @param document - SDUI Layout Document (required)
 * @param components - Custom component map (optional, merged with defaults)
 * @param componentOverrides - Component overrides by ID or type (optional, ID > type priority)
 * @param onLayoutChange - Callback when layout changes (optional)
 * @param onError - Error callback (optional)
 *
 * @example
 * ```tsx
 * <SduiLayoutRenderer
 *   document={myDocument}
 *   components={{ CustomChart: CustomChartFactory }}
 *   onError={(error) => console.error(error)}
 * />
 * ```
 *
 * @remarks
 * - Must be wrapped with "use client" directive in Next.js App Router
 * - Component overrides: byNodeId > byNodeType > defaultComponentFactory
 * - Errors are passed to onError callback, component continues rendering if possible
 */

import React, { useMemo } from 'react'

import { componentMap } from '../../components/componentMap'
import type { ComponentFactory } from '../../components/types'
import { SduiLayoutProvider } from '../context'
import { useRenderNode } from '../hooks'
import type { SduiLayoutDocument } from '../../schema'
import { SduiLayoutStore } from '../../store'
import type { SduiLayoutStoreOptions } from '../../store/types'

interface SduiLayoutRendererProps {
  /** SDUI Layout Document */
  document: SduiLayoutDocument
  /** 커스텀 컴포넌트 맵 (componentMap에 추가될 컴포넌트들) */
  components?: Record<string, ComponentFactory>
  /** 1회용 컴포넌트 오버라이드 설정 */
  componentOverrides?: {
    byNodeId?: Record<string, ComponentFactory>
    byNodeType?: Record<string, ComponentFactory>
  }
  /** Layout change callback */
  onLayoutChange?: (document: SduiLayoutDocument) => void
  /** Error callback */
  onError?: (error: Error) => void
}

/**
 * SduiLayoutRenderer 내부 컴포넌트
 *
 * useRenderNode hook을 사용하여 renderNode 함수를 생성하고,
 * 하위 컴포넌트에 주입합니다.
 * 각 컴포넌트는 이 함수를 통해 자식을 렌더링합니다.
 */
const SduiLayoutRendererInner = ({
  id,
  componentMap: customComponentMap,
}: {
  id: string
  componentMap?: Record<string, ComponentFactory>
}) => {
  // renderNode 함수 생성 (Render Props Pattern)
  const renderNode = useRenderNode(customComponentMap)

  return <>{renderNode(id)}</>
}

/**
 * SduiLayoutRenderer
 *
 * SDUI Layout Document를 렌더링하는 최상위 컴포넌트입니다.
 */
export const SduiLayoutRenderer: React.FC<SduiLayoutRendererProps> = ({
  document,
  components,
  componentOverrides,
  onLayoutChange,
  onError,
}) => {
  // Store 인스턴스 생성 및 문서 업데이트
  // components와 componentOverrides는 한 번만 설정되므로 deps에 포함하지 않음
  const store = useMemo(() => {
    try {
      // 문서 유효성 검사
      if (!document || !document.root) {
        throw new Error('Invalid document: missing root')
      }
      if (!document.root.id) {
        throw new Error('Invalid document: root.id is required')
      }

      const options: SduiLayoutStoreOptions = {
        // 스프레드 연산자로 합침 (components → byNodeType → byNodeId 순서, ID 우선)
        componentOverrides: {
          ...components,
          ...componentOverrides?.byNodeType,
          ...componentOverrides?.byNodeId,
        },
      }
      const sduiStore = new SduiLayoutStore(undefined, options)
      sduiStore.updateLayout(document)
      return sduiStore
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)))
      }
      // Return empty store on error
      return new SduiLayoutStore()
    }
  }, [document, components, componentOverrides, onError])

  // Merge component map
  const mergedComponentMap = useMemo(() => {
    return {
      ...componentMap,
      ...components,
    }
  }, [components])

  // root.id가 없으면 렌더링하지 않음 (에러는 이미 onError로 전달됨)
  const rootId = document?.root?.id
  if (!rootId) {
    return null
  }

  return (
    <SduiLayoutProvider store={store}>
      <SduiLayoutRendererInner id={rootId} componentMap={mergedComponentMap} />
    </SduiLayoutProvider>
  )
}

// Export SduiLayoutRendererInner for testing purposes
export { SduiLayoutRendererInner }
