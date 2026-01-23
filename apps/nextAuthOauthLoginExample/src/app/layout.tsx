import '@lodado/sdui-design-files/index.css'
import '@lodado/sdui-design-files/layout.css'
import './globals.css'

import { getServerSession } from 'next-auth/next'
import type { ReactNode } from 'react'

import { authOptions } from './lib/auth'
import Providers from './providers'

export const metadata = {
  title: 'NextAuth OAuth Login Example',
  description: 'GitHub OAuth login with NextAuth and SDUI',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
