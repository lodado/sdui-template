import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { isProduction } from '@/app/lib/env'
import { revokeRefreshToken } from '@/app/lib/refresh-token'
import { refreshCookieName } from '@/auth'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get(refreshCookieName)?.value

  // Revoke refresh token from the database if it exists
  if (refreshToken) {
    try {
      await revokeRefreshToken(refreshToken)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke refresh token:', error)
      // Remove the cookie even if revocation fails
    }
  }

  // Remove refresh token cookie
  cookieStore.set(refreshCookieName, '', {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProduction,
    path: '/',
    maxAge: 0,
  })

  return NextResponse.json({ status: 'logged-out' })
}
