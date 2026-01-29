import '@lodado/sdui-design-files/index.css'
import '@lodado/sdui-design-files/layout.css'
import './globals.css'

import type { ReactNode } from 'react'

import { auth } from '@/auth'

import Providers from './providers'

export const metadata = {
  title: 'NextAuth OAuth Login Example',
  description: 'GitHub OAuth login with NextAuth and SDUI',
}

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const session = await auth()

  return (
    <html lang="en">
      <body>
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
