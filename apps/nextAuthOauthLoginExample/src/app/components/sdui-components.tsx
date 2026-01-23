'use client'

/**
 * SDUI Components for NextAuth OAuth Login Example
 *
 * @description
 * This file defines atomic components that integrate NextAuth functionality.
 * Standard components (Div, Card, Text, Span) are provided by @lodado/sdui-template-component
 * and merged in the export section.
 *
 * 🔧 Auth Components:
 *    - LoginButton: OAuth login button (signIn only)
 *    - LogoutButton: Logout button (signOut only)
 *    - SessionHint: Session status hint text
 *    - AuthSwitch: Conditional rendering based on auth status
 *
 * 🔧 Session Components:
 *    - SessionField: Display session data field (label + value)
 *    - RefreshButton: Session refresh button
 *    - SessionError: Error message display
 */

import {
  type ComponentFactory,
  useRenderNode,
  useSduiNodeSubscription,
} from '@lodado/sdui-template'
import { Button, getButtonComponents, getCardComponents, getDivComponents } from '@lodado/sdui-template-component'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'
import { z } from 'zod'

import { useRefreshSession } from './use-refresh-session'

// ============================================================================
// Schemas
// ============================================================================

const loginButtonStateSchema = z.object({
  label: z.string().optional(),
  provider: z.enum(['github', 'google', 'discord']).optional(),
  callbackUrl: z.string().optional(),
  buttonStyle: z.enum(['filled', 'outline', 'text']).optional(),
  size: z.enum(['L', 'M', 'S']).optional(),
  buttonType: z.enum(['primary', 'secondary']).optional(),
})

const logoutButtonStateSchema = z.object({
  text: z.string().optional(),
  callbackUrl: z.string().optional(),
  buttonStyle: z.enum(['filled', 'outline', 'text']).optional(),
  size: z.enum(['L', 'M', 'S']).optional(),
  buttonType: z.enum(['primary', 'secondary']).optional(),
})

const sessionHintStateSchema = z.object({
  refreshingText: z.string().optional(),
  normalText: z.string().optional(),
  className: z.string().optional(),
})

const authSwitchStateSchema = z.object({
  slot: z.enum(['loading', 'authenticated', 'unauthenticated']).optional(),
})

const sessionFieldStateSchema = z.object({
  field: z.enum(['status', 'userName', 'email', 'expires', 'lastRefresh']),
  label: z.string(),
  fallback: z.string().optional(),
})

const refreshButtonStateSchema = z.object({
  text: z.string().optional(),
  refreshingText: z.string().optional(),
  buttonStyle: z.enum(['filled', 'outline', 'text']).optional(),
  size: z.enum(['L', 'M', 'S']).optional(),
  buttonType: z.enum(['primary', 'secondary']).optional(),
})

const sessionErrorStateSchema = z.object({
  className: z.string().optional(),
})

// Type inference
type LoginButtonState = z.infer<typeof loginButtonStateSchema>
type LogoutButtonState = z.infer<typeof logoutButtonStateSchema>
type SessionHintState = z.infer<typeof sessionHintStateSchema>
type AuthSwitchState = z.infer<typeof authSwitchStateSchema>
type SessionFieldState = z.infer<typeof sessionFieldStateSchema>
type RefreshButtonState = z.infer<typeof refreshButtonStateSchema>
type SessionErrorState = z.infer<typeof sessionErrorStateSchema>

// ============================================================================
// Auth Components
// ============================================================================

/**
 * LoginButton Component
 * @description Atomic component - handles OAuth sign in only
 */
const LoginButton: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof loginButtonStateSchema>({
    nodeId,
    schema: loginButtonStateSchema,
  })

  const typedState = state as LoginButtonState

  const handleLogin = () => {
    signIn(typedState.provider ?? 'github', {
      callbackUrl: typedState.callbackUrl ?? '/',
    })
  }

  return (
    <Button
      buttonStyle={typedState.buttonStyle ?? 'outline'}
      size={typedState.size ?? 'M'}
      buttonType={typedState.buttonType ?? 'secondary'}
      onClick={handleLogin}
    >
      {typedState.label ?? 'GitHub 로그인'}
    </Button>
  )
}

/**
 * LogoutButton Component
 * @description Atomic component - handles sign out only
 */
const LogoutButton: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof logoutButtonStateSchema>({
    nodeId,
    schema: logoutButtonStateSchema,
  })

  const typedState = state as LogoutButtonState

  const handleLogout = async () => {
    try {
      // Delete refresh token first (DB + cookie)
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Logout failed:', error)
    } finally {
      // End NextAuth session
      await signOut({ callbackUrl: typedState.callbackUrl ?? '/' })
    }
  }

  return (
    <Button
      buttonStyle={typedState.buttonStyle ?? 'filled'}
      size={typedState.size ?? 'M'}
      buttonType={typedState.buttonType ?? 'secondary'}
      onClick={handleLogout}
    >
      {typedState.text ?? '로그아웃'}
    </Button>
  )
}

/**
 * SessionHint Component
 * @description Atomic component - displays session refresh hint
 */
const SessionHint: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof sessionHintStateSchema>({
    nodeId,
    schema: sessionHintStateSchema,
  })
  const { isRefreshing } = useRefreshSession()

  const typedState = state as SessionHintState

  const text = isRefreshing
    ? (typedState.refreshingText ?? '리프레시 토큰 확인 중...')
    : (typedState.normalText ?? '세션 만료 3분 전 자동 갱신됩니다.')

  return (
    <span className={typedState.className ?? 'text-xs text-white/60'}>
      {text}
    </span>
  )
}

/**
 * AuthSwitch Component
 * @description Atomic component - renders children based on auth status slot
 */
const AuthSwitch: React.FC<{ nodeId: string; parentPath?: string[] }> = ({ nodeId, parentPath = [] }) => {
  const { childrenIds } = useSduiNodeSubscription({ nodeId })
  const { renderChildren } = useRenderNode({ nodeId, parentPath })
  const { status } = useSession()

  // Find child with matching slot
  const children = renderChildren(childrenIds)

  // Filter children by slot matching current status
  const filteredChildren = React.Children.toArray(children).filter((child) => {
    if (!React.isValidElement(child)) return false

    // Get the child's nodeId from data-node-id attribute or key
    const childNodeId = child.props?.['data-node-id'] || (child.key as string)?.replace('.$', '')

    // We need to find the slot from the store for this child
    // For simplicity, we'll render all children and let them handle visibility
    return true
  })

  return <>{children}</>
}

/**
 * AuthSlot Component
 * @description Wrapper component that shows/hides based on slot matching auth status
 */
const AuthSlot: React.FC<{ nodeId: string; parentPath?: string[] }> = ({ nodeId, parentPath = [] }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state, childrenIds } = useSduiNodeSubscription<typeof authSwitchStateSchema>({
    nodeId,
    schema: authSwitchStateSchema,
  })
  const { renderChildren } = useRenderNode({ nodeId, parentPath })
  const { status } = useSession()

  const typedState = state as AuthSwitchState

  // Only render if slot matches current status
  if (typedState.slot !== status) {
    return null
  }

  return <>{renderChildren(childrenIds)}</>
}

// ============================================================================
// Session Components
// ============================================================================

/**
 * SessionField Component
 * @description Atomic component - displays a session data field
 */
const SessionField: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof sessionFieldStateSchema>({
    nodeId,
    schema: sessionFieldStateSchema,
  })
  const { data: session, status } = useSession()
  const { lastRefreshAt } = useRefreshSession()

  const typedState = state as SessionFieldState
  const fallback = typedState.fallback ?? '알 수 없음'

  let value: string

  switch (typedState.field) {
    case 'status':
      value = status
      break
    case 'userName':
      value = session?.user?.name ?? fallback
      break
    case 'email':
      value = session?.user?.email ?? fallback
      break
    case 'expires':
      value = session?.expires ?? fallback
      break
    case 'lastRefresh':
      value = lastRefreshAt ? lastRefreshAt.toLocaleString() : (typedState.fallback ?? '아직 없음')
      break
    default:
      value = fallback
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-white/50">{typedState.label}</span>
      <span className="text-white/90 text-right">{value}</span>
    </div>
  )
}

/**
 * RefreshButton Component
 * @description Atomic component - session refresh button
 */
const RefreshButton: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof refreshButtonStateSchema>({
    nodeId,
    schema: refreshButtonStateSchema,
  })
  const { isRefreshing, refreshSession } = useRefreshSession()

  const typedState = state as RefreshButtonState

  const buttonText = isRefreshing
    ? (typedState.refreshingText ?? '갱신 중')
    : (typedState.text ?? '세션 갱신')

  return (
    <button
      type="button"
      onClick={() => refreshSession()}
      disabled={isRefreshing}
      className="text-sm text-white/70 hover:text-white disabled:opacity-50"
    >
      {buttonText}
    </button>
  )
}

/**
 * SessionError Component
 * @description Atomic component - displays session error message
 */
const SessionError: React.FC<{ nodeId: string }> = ({ nodeId }) => {
  // @ts-expect-error - Zod schema type compatibility issue between zod versions
  const { state } = useSduiNodeSubscription<typeof sessionErrorStateSchema>({
    nodeId,
    schema: sessionErrorStateSchema,
  })
  const { errorMessage } = useRefreshSession()

  const typedState = state as SessionErrorState

  if (!errorMessage) {
    return null
  }

  return (
    <p className={typedState.className ?? 'm-0 text-[#fca5a5]'}>
      {errorMessage}
    </p>
  )
}

// ============================================================================
// Component Factories
// ============================================================================

const LoginButtonFactory: ComponentFactory = (id) => <LoginButton nodeId={id} />
const LogoutButtonFactory: ComponentFactory = (id) => <LogoutButton nodeId={id} />
const SessionHintFactory: ComponentFactory = (id) => <SessionHint nodeId={id} />
const AuthSwitchFactory: ComponentFactory = (id, parentPath) => <AuthSwitch nodeId={id} parentPath={parentPath} />
const AuthSlotFactory: ComponentFactory = (id, parentPath) => <AuthSlot nodeId={id} parentPath={parentPath} />
const SessionFieldFactory: ComponentFactory = (id) => <SessionField nodeId={id} />
const RefreshButtonFactory: ComponentFactory = (id) => <RefreshButton nodeId={id} />
const SessionErrorFactory: ComponentFactory = (id) => <SessionError nodeId={id} />

// ============================================================================
// Export Component Map
// ============================================================================

export const sduiComponents: Record<string, ComponentFactory> = {
  ...getDivComponents(), // Div, Text, Span
  ...getCardComponents(), // Card
  ...getButtonComponents(), // Button

  // Auth Components
  LoginButton: LoginButtonFactory,
  LogoutButton: LogoutButtonFactory,
  SessionHint: SessionHintFactory,
  AuthSwitch: AuthSwitchFactory,
  AuthSlot: AuthSlotFactory,

  // Session Components
  SessionField: SessionFieldFactory,
  RefreshButton: RefreshButtonFactory,
  SessionError: SessionErrorFactory,
}
