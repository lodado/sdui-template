import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { refreshCookieName } from '@/app/lib/auth'
import { isProduction } from '@/app/lib/env'
import { revokeRefreshToken } from '@/app/lib/refresh-token'

export async function POST() {
  const cookieStore = cookies()
  const refreshToken = cookieStore.get(refreshCookieName)?.value

  // 리프레시 토큰이 있으면 DB에서 revoke 처리
  if (refreshToken) {
    try {
      await revokeRefreshToken(refreshToken)
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to revoke refresh token:', error)
      // 에러가 나도 쿠키는 삭제
    }
  }

  // 리프레시 토큰 쿠키 삭제
  cookieStore.set(refreshCookieName, '', {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: isProduction,
    path: '/',
    maxAge: 0,
  })

  return NextResponse.json({ status: 'logged-out' })
}
