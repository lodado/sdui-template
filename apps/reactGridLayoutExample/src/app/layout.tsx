import '@lodado/sdui-design-files/index.css'
import '@lodado/sdui-design-files/layout.css'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import './globals.css'

import React from 'react'

export const metadata = {
  title: 'React Grid Layout SDUI Example',
  description: 'React Grid Layout with SDUI state and shape toggles.',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

export default RootLayout
