'use client'

import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

import { RefreshSessionProvider } from '@/app/contexts/refresh-session.context'

type ProvidersProps = {
  children: ReactNode
  session: Session | null
}

const Providers = ({ children, session }: ProvidersProps) => {
  return (
    <SessionProvider session={session} refetchInterval={5 * 60} refetchOnWindowFocus>
      <RefreshSessionProvider>{children}</RefreshSessionProvider>
    </SessionProvider>
  )
}

export default Providers
