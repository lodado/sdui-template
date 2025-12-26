/**
 * Scenario Test: Parent Path Tracking
 *
 * Tests for parentPath prop propagation through nested component hierarchy
 */

import { render, screen } from '@testing-library/react'
import React from 'react'

import type { ComponentFactory, SduiComponentProps } from '../../components/types'
import { SduiLayoutRenderer } from '../../react-wrapper/components/SduiLayoutRenderer'
import { useRenderNode, useSduiNodeSubscription } from '../../react-wrapper/hooks'
import { createTestDocument } from '../utils/test-utils'

/**
 * 각 레벨의 컴포넌트가 parentPath를 받아서 표시하는 테스트 컴포넌트
 */
const LevelComponent: React.FC<SduiComponentProps> = ({ nodeId, parentPath = [] }) => {
  const { childrenIds } = useSduiNodeSubscription({
    nodeId,
  })

  const { renderNode, currentPath, pathString } = useRenderNode({ nodeId, parentPath })

  return (
    <div data-testid={`level-${nodeId}`} data-parent-path={JSON.stringify(parentPath)} data-current-path={pathString}>
      <div>Node ID: {nodeId}</div>
      <div>Parent Path: {parentPath.length > 0 ? parentPath.join(' > ') : 'none'}</div>
      <div>Current Path: {pathString}</div>
      {childrenIds && childrenIds.length > 0 && (
        <div>
          {childrenIds.map((childId: string) => (
            <React.Fragment key={childId}>{renderNode(childId, currentPath)}</React.Fragment>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * 레벨 컴포넌트 팩토리
 * useRenderNode hook을 사용하여 자식 노드들을 렌더링합니다.
 */
const LevelComponentFactory: ComponentFactory = (id, parentPath) => {
  return <LevelComponent nodeId={id} parentPath={parentPath} />
}

describe('Parent Path Tracking', () => {
  describe('as is: document with 5 levels of nesting', () => {
    describe('when: rendering nested components', () => {
      it('to be: parentPath is correctly propagated through all 5 levels', () => {
        // 5단계 깊이의 노드 트리 생성
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Level',
            children: [
              {
                id: 'level-1',
                type: 'Level',
                children: [
                  {
                    id: 'level-2',
                    type: 'Level',
                    children: [
                      {
                        id: 'level-3',
                        type: 'Level',
                        children: [
                          {
                            id: 'level-4',
                            type: 'Level',
                            children: [
                              {
                                id: 'level-5',
                                type: 'Level',
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{
              Level: LevelComponentFactory,
            }}
          />,
        )

        // Root 레벨 확인 (parentPath가 없어야 함)
        const rootElement = screen.getByTestId('level-root')
        expect(rootElement).toBeInTheDocument()
        expect(rootElement).toHaveAttribute('data-parent-path', JSON.stringify([]))
        expect(rootElement).toHaveAttribute('data-current-path', 'root')
        expect(screen.getByText('Parent Path: none')).toBeInTheDocument()

        // Level 1 확인 (parentPath: ['root'])
        const level1Element = screen.getByTestId('level-level-1')
        expect(level1Element).toBeInTheDocument()
        expect(level1Element).toHaveAttribute('data-parent-path', JSON.stringify(['root']))
        expect(level1Element).toHaveAttribute('data-current-path', 'root > level-1')
        expect(screen.getByText('Parent Path: root')).toBeInTheDocument()

        // Level 2 확인 (parentPath: ['root', 'level-1'])
        const level2Element = screen.getByTestId('level-level-2')
        expect(level2Element).toBeInTheDocument()
        expect(level2Element).toHaveAttribute('data-parent-path', JSON.stringify(['root', 'level-1']))
        expect(level2Element).toHaveAttribute('data-current-path', 'root > level-1 > level-2')
        expect(screen.getByText('Parent Path: root > level-1')).toBeInTheDocument()

        // Level 3 확인 (parentPath: ['root', 'level-1', 'level-2'])
        const level3Element = screen.getByTestId('level-level-3')
        expect(level3Element).toBeInTheDocument()
        expect(level3Element).toHaveAttribute('data-parent-path', JSON.stringify(['root', 'level-1', 'level-2']))
        expect(level3Element).toHaveAttribute('data-current-path', 'root > level-1 > level-2 > level-3')
        expect(screen.getByText('Parent Path: root > level-1 > level-2')).toBeInTheDocument()

        // Level 4 확인 (parentPath: ['root', 'level-1', 'level-2', 'level-3'])
        const level4Element = screen.getByTestId('level-level-4')
        expect(level4Element).toBeInTheDocument()
        expect(level4Element).toHaveAttribute(
          'data-parent-path',
          JSON.stringify(['root', 'level-1', 'level-2', 'level-3']),
        )
        expect(level4Element).toHaveAttribute('data-current-path', 'root > level-1 > level-2 > level-3 > level-4')
        expect(screen.getByText('Parent Path: root > level-1 > level-2 > level-3')).toBeInTheDocument()

        // Level 5 확인 (parentPath: ['root', 'level-1', 'level-2', 'level-3', 'level-4'])
        const level5Element = screen.getByTestId('level-level-5')
        expect(level5Element).toBeInTheDocument()
        expect(level5Element).toHaveAttribute(
          'data-parent-path',
          JSON.stringify(['root', 'level-1', 'level-2', 'level-3', 'level-4']),
        )
        expect(level5Element).toHaveAttribute(
          'data-current-path',
          'root > level-1 > level-2 > level-3 > level-4 > level-5',
        )
        expect(screen.getByText('Parent Path: root > level-1 > level-2 > level-3 > level-4')).toBeInTheDocument()
      })
    })
  })

  describe('as is: document with multiple branches at same level', () => {
    describe('when: rendering siblings', () => {
      it('to be: each sibling receives the same parentPath', () => {
        const document = createTestDocument({
          root: {
            id: 'root',
            type: 'Level',
            children: [
              {
                id: 'sibling-1',
                type: 'Level',
              },
              {
                id: 'sibling-2',
                type: 'Level',
              },
              {
                id: 'sibling-3',
                type: 'Level',
              },
            ],
          },
        })

        render(
          <SduiLayoutRenderer
            document={document}
            components={{
              Level: LevelComponentFactory,
            }}
          />,
        )

        // 모든 형제 노드가 같은 parentPath를 받아야 함
        const sibling1 = screen.getByTestId('level-sibling-1')
        const sibling2 = screen.getByTestId('level-sibling-2')
        const sibling3 = screen.getByTestId('level-sibling-3')

        expect(sibling1).toHaveAttribute('data-parent-path', JSON.stringify(['root']))
        expect(sibling2).toHaveAttribute('data-parent-path', JSON.stringify(['root']))
        expect(sibling3).toHaveAttribute('data-parent-path', JSON.stringify(['root']))
      })
    })
  })
})
