'use client'

import {
  type ComponentFactory,
  useRenderNode,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
import { Button } from '@lodado/sdui-template-component'
import { signIn, signOut, useSession } from 'next-auth/react'
import type { PropsWithChildren } from 'react'

import { useRefreshSession } from './use-refresh-session'

const containerClasses = {
  center: 'layout-center',
  start: 'layout-start',
}

type TextState = {
  text?: string
}

type CardState = {
  tone?: 'dark' | 'light'
}

type ContainerState = {
  align?: keyof typeof containerClasses
}

type AuthButtonState = {
  label?: string
}

type StatusPanelState = {
  title?: string
}

const Container = ({ id }: { id: string }) => {
  const { childrenIds, state } = useSduiNodeSubscription<ContainerState>({ nodeId: id })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id })

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

const Card = ({ id }: { id: string }) => {
  const { childrenIds, state } = useSduiNodeSubscription<CardState>({ nodeId: id })
  const { renderNode, currentPath } = useRenderNode({ nodeId: id })
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

const Title = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<TextState>({ nodeId: id })
  return <h1 className="title">{state.text}</h1>
}

const Description = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<TextState>({ nodeId: id })
  return <p className="description">{state.text}</p>
}

const Hint = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<TextState>({ nodeId: id })
  return <p className="hint">{state.text}</p>
}

const CardSection = ({ children }: PropsWithChildren) => {
  return <div className="panel">{children}</div>
}

const AuthButton = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<AuthButtonState>({ nodeId: id })
  const { status } = useSession()
  const { isRefreshing } = useRefreshSession()

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
          onClick={() => signOut()}
        >
          로그아웃
        </Button>
        <span className="auth-hint">
          {isRefreshing ? '리프레시 토큰 확인 중...' : '세션이 만료되면 자동으로 갱신됩니다.'}
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

const StatusPanel = ({ id }: { id: string }) => {
  const { state } = useSduiNodeSubscription<StatusPanelState>({ nodeId: id })
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

export const sduiComponents: Record<string, ComponentFactory> = {
  Container: (id) => <Container id={id} />,
  Card: (id) => <Card id={id} />,
  Title: (id) => <Title id={id} />,
  Description: (id) => <Description id={id} />,
  AuthButton: (id) => <AuthButton id={id} />,
  StatusPanel: (id) => <StatusPanel id={id} />,
  Hint: (id) => <Hint id={id} />,
}
