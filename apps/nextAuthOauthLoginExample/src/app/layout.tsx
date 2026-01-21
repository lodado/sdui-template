import './globals.css'

import type { ReactNode } from 'react'

import Providers from './providers'

export const metadata = {
  title: 'NextAuth OAuth Login Example',
  description: 'GitHub OAuth login with NextAuth and SDUI',
}

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

export default RootLayout
