'use client'

import {
  type ComponentFactory,
  useRenderNode,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
import { Button } from '@lodado/sdui-template-component'
import { signIn, signOut, useSession } from 'next-auth/react'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { z } from 'zod'

import { useRefreshSession } from './use-refresh-session'

// ==================== Zod Schemas ====================

const containerStateSchema = z.object({
  align: z.enum(['center', 'start']).optional(),
})

const cardStateSchema = z.object({
  tone: z.enum(['dark', 'light']).optional(),
})

const textStateSchema = z.object({
  text: z.string().optional(),
})

const authButtonStateSchema = z.object({
  label: z.string().optional(),
})

const statusPanelStateSchema = z.object({
  title: z.string().optional(),
})

// ==================== Type Definitions ====================

type ContainerState = z.infer<typeof containerStateSchema>
type CardState = z.infer<typeof cardStateSchema>
type TextState = z.infer<typeof textStateSchema>
type AuthButtonState = z.infer<typeof authButtonStateSchema>
type StatusPanelState = z.infer<typeof statusPanelStateSchema>

// ==================== Component Definitions ====================

const containerClasses = {
  center: 'layout-center',
  start: 'layout-start',
}

const Container: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { childrenIds, state } = useSduiNodeSubscription<ContainerState>({
    nodeId,
    schema: containerStateSchema,
  })
  const { renderNode, currentPath } = useRenderNode({ nodeId })

  return (
    <section className={containerClasses[state.align ?? 'center']}>
      <div className="layout-frame">
        {childrenIds.map((child) => (
          <div key={child}>{renderNode(child, currentPath)}</div>
        ))}
      </div>
    </section>
  )
}

const Card: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { childrenIds, state } = useSduiNodeSubscription<CardState>({
    nodeId,
    schema: cardStateSchema,
  })
  const { renderNode, currentPath } = useRenderNode({ nodeId })
  const tone = state.tone ?? 'dark'

  return (
    <div className={`card ${tone === 'light' ? 'card-light' : ''}`}>
      <div className="card-content">
        {childrenIds.map((child) => (
          <div key={child}>{renderNode(child, currentPath)}</div>
        ))}
      </div>
    </div>
  )
}

const Title: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription<TextState>({
    nodeId,
    schema: textStateSchema,
  })
  return <h1 className="title">{state.text}</h1>
}

const Description: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription<TextState>({
    nodeId,
    schema: textStateSchema,
  })
  return <p className="description">{state.text}</p>
}

const Hint: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription<TextState>({
    nodeId,
    schema: textStateSchema,
  })
  return <p className="hint">{state.text}</p>
}

const CardSection = ({ children }: PropsWithChildren) => {
  return <div className="panel">{children}</div>
}

const AuthButton: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription<AuthButtonState>({
    nodeId,
    schema: authButtonStateSchema,
  })
  const { status } = useSession()
  const { isRefreshing } = useRefreshSession()

  const handleLogout = async () => {
    try {
      // 먼저 리프레시 토큰 삭제 (DB + 쿠키)
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', error)
    } finally {
      // NextAuth 세션 종료
      await signOut({ callbackUrl: '/' })
    }
  }

  if (status === 'loading') {
    return (
      <Button
        buttonStyle="outline"
        size="M"
        buttonType="secondary"
        className="sdui-button sdui-button--ghost"
        disabled
      >
        세션 확인 중...
      </Button>
    )
  }

  if (status === 'authenticated') {
    return (
      <div className="auth-meta">
        <Button
          buttonStyle="filled"
          size="M"
          buttonType="secondary"
          className="sdui-button sdui-button--secondary"
          onClick={handleLogout}
        >
          로그아웃
        </Button>
        <span className="auth-hint">
          {isRefreshing ? '리프레시 토큰 확인 중...' : '세션 만료 3분 전 자동 갱신됩니다.'}
        </span>
      </div>
    )
  }

  return (
    <Button
      buttonStyle="filled"
      size="M"
      buttonType="primary"
      className="sdui-button sdui-button--primary"
      onClick={() => signIn('github', { callbackUrl: '/' })}
    >
      {state.label ?? 'GitHub 로그인'}
    </Button>
  )
}

const StatusRow = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="status-row">
      <span className="status-label">{label}</span>
      <span className="status-value">{value}</span>
    </div>
  )
}

const StatusPanel: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  const { state } = useSduiNodeSubscription<StatusPanelState>({
    nodeId,
    schema: statusPanelStateSchema,
  })
  const { data: session, status } = useSession()
  const { isRefreshing, lastRefreshAt, errorMessage, refreshSession } = useRefreshSession()

  return (
    <CardSection>
      <div className="panel-header">
        <h2 className="panel-title">{state.title ?? '상태'}</h2>
        <button
          type="button"
          className="panel-action"
          onClick={() => refreshSession()}
          disabled={isRefreshing}
        >
          {isRefreshing ? '갱신 중' : '세션 갱신'}
        </button>
      </div>
      <div className="panel-body">
        <StatusRow label="세션 상태" value={status} />
        <StatusRow label="사용자" value={session?.user?.name ?? '알 수 없음'} />
        <StatusRow label="이메일" value={session?.user?.email ?? '알 수 없음'} />
        <StatusRow label="세션 만료" value={session?.expires ?? '알 수 없음'} />
        <StatusRow
          label="최근 리프레시"
          value={lastRefreshAt ? lastRefreshAt.toLocaleString() : '아직 없음'}
        />
        {errorMessage ? <p className="panel-error">{errorMessage}</p> : null}
      </div>
    </CardSection>
  )
}

// ==================== Component Factories ====================

const ContainerFactory: ComponentFactory = (id) => <Container nodeId={id} />
const CardFactory: ComponentFactory = (id) => <Card nodeId={id} />
const TitleFactory: ComponentFactory = (id) => <Title nodeId={id} />
const DescriptionFactory: ComponentFactory = (id) => <Description nodeId={id} />
const HintFactory: ComponentFactory = (id) => <Hint nodeId={id} />
const AuthButtonFactory: ComponentFactory = (id) => <AuthButton nodeId={id} />
const StatusPanelFactory: ComponentFactory = (id) => <StatusPanel nodeId={id} />

// ==================== Export Component Map ====================

export const sduiComponents: Record<string, ComponentFactory> = {
  Container: ContainerFactory,
  Card: CardFactory,
  Title: TitleFactory,
  Description: DescriptionFactory,
  Hint: HintFactory,
  AuthButton: AuthButtonFactory,
  StatusPanel: StatusPanelFactory,
}
