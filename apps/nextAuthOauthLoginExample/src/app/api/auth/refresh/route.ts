import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { encode } from 'next-auth/jwt'

import { auth, refreshCookieName, sessionCookieName, sessionMaxAgeSeconds } from '@/auth'
import { isProduction, requireEnv } from '@/app/lib/env'
import {
  createRefreshToken,
  findRefreshToken,
  refreshTokenMaxAgeSeconds,
  rotateRefreshToken,
  storeRefreshToken,
} from '@/app/lib/refresh-token'

const refreshCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProduction,
  path: '/',
  maxAge: refreshTokenMaxAgeSeconds,
}

const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: isProduction,
  path: '/',
  maxAge: sessionMaxAgeSeconds,
}

export async function POST() {
  const cookieStore = await cookies()
  const session = await auth()

  if (session?.user?.id) {
    const refreshToken = createRefreshToken()

    await storeRefreshToken({
      token: refreshToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    })

    cookieStore.set(refreshCookieName, refreshToken, refreshCookieOptions)

    return NextResponse.json({ status: 'refresh-token-issued' })
  }

  const existingRefreshToken = cookieStore.get(refreshCookieName)?.value

  if (!existingRefreshToken) {
    return NextResponse.json({ error: 'No refresh token' }, { status: 401 })
  }

  const storedToken = await findRefreshToken(existingRefreshToken)

  if (!storedToken) {
    cookieStore.set(refreshCookieName, '', { ...refreshCookieOptions, maxAge: 0 })
    return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 })
  }

  const nextRefreshToken = createRefreshToken()
  await rotateRefreshToken({ previousToken: storedToken, nextToken: nextRefreshToken })
  cookieStore.set(refreshCookieName, nextRefreshToken, refreshCookieOptions)

  const sessionToken = await encode({
    token: {
      sub: storedToken.user_id,
      name: storedToken.user_name ?? undefined,
      email: storedToken.user_email ?? undefined,
      picture: storedToken.user_image ?? undefined,
    },
    secret: requireEnv('NEXTAUTH_SECRET'),
    maxAge: sessionMaxAgeSeconds,
    salt: sessionCookieName,
  })

  cookieStore.set(sessionCookieName, sessionToken, sessionCookieOptions)

  return NextResponse.json({ status: 'session-refreshed' })
}
