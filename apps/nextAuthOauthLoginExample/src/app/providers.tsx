'use client'

import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus>
      {children}
    </SessionProvider>
  )
}

export default Providers
