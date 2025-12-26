import type { ComponentFactory, SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer, useSduiNodeSubscription } from '@lodado/sdui-template'
import { Button } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React from 'react'

const meta: Meta<typeof SduiLayoutRenderer> = {
  title: 'SDUI/SduiLayoutRenderer',
  component: SduiLayoutRenderer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'SDUI Layout Document를 렌더링하는 최상위 컴포넌트입니다.',
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof SduiLayoutRenderer>

// 기본 문서 예제
const basicDocument: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    state: {
      layout: { x: 0, y: 0, w: 12, h: 1 },
    },
  },
}

// Button 컴포넌트 (팩토리 외부로 이동)
const ButtonComponent: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state, attributes } = useSduiNodeSubscription({
    nodeId,
  })

  const variant = (attributes?.variant as string) || 'primary'
  const size = (attributes?.size as string) || 'md'
  const disabled = (attributes?.disabled as boolean) || false
  const children = (attributes?.children as React.ReactNode) || 'Button'

  return (
    <Button
      nodeId={nodeId}
      variant={variant as any}
      size={size as any}
      disabled={disabled}
      onClick={() => {
        // Button clicked
      }}
    >
      {children}
    </Button>
  )
}

// Button 컴포넌트 팩토리
const ButtonFactory: ComponentFactory = (nodeId) => {
  return <ButtonComponent nodeId={nodeId} />
}

// Button 컴포넌트를 사용하는 문서 예제
const buttonDocument: SduiLayoutDocument = {
  version: '1.0.0',
  root: {
    id: 'root',
    type: 'Container',
    state: {
      layout: { x: 0, y: 0, w: 12, h: 1 },
    },
    children: [
      {
        id: 'button-1',
        type: 'Button',
        state: {
          layout: { x: 0, y: 0, w: 4, h: 1 },
        },
        attributes: {
          variant: 'primary',
          size: 'md',
          children: 'Click Me',
        },
      },
    ],
  },
}

export const Basic: Story = {
  args: {
    document: basicDocument,
  },
}

export const WithButton: Story = {
  args: {
    document: buttonDocument,
    components: {
      Button: ButtonFactory,
    },
  },
}

export const WithCustomComponents: Story = {
  args: {
    document: {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Container',
        state: {
          layout: { x: 0, y: 0, w: 12, h: 1 },
        },
        children: [
          {
            id: 'button-primary',
            type: 'Button',
            state: {
              layout: { x: 0, y: 0, w: 3, h: 1 },
            },
            attributes: {
              variant: 'primary',
              children: 'Primary',
            },
          },
          {
            id: 'button-secondary',
            type: 'Button',
            state: {
              layout: { x: 3, y: 0, w: 3, h: 1 },
            },
            attributes: {
              variant: 'secondary',
              children: 'Secondary',
            },
          },
          {
            id: 'button-outline',
            type: 'Button',
            state: {
              layout: { x: 6, y: 0, w: 3, h: 1 },
            },
            attributes: {
              variant: 'outline',
              children: 'Outline',
            },
          },
          {
            id: 'button-ghost',
            type: 'Button',
            state: {
              layout: { x: 9, y: 0, w: 3, h: 1 },
            },
            attributes: {
              variant: 'ghost',
              children: 'Ghost',
            },
          },
        ],
      },
    },
    components: {
      Button: ButtonFactory,
    },
  },
}
