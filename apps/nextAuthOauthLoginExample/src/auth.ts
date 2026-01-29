import NextAuth from 'next-auth'
import GitHub from "next-auth/providers/github";

import { isProduction, requireEnv } from '@/app/lib/env'
import { persistUserAvatar } from '@/app/lib/supabase'

export const sessionMaxAgeSeconds = 60 * 15
export const refreshCookieName = 'sdui-refresh-token'
export const sessionCookieName = isProduction
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

const nextAuth = NextAuth({
  providers: [
    GitHub ({
      clientId: requireEnv('GITHUB_CLIENT_ID') ,
      clientSecret: requireEnv('GITHUB_CLIENT_SECRET') ,
    }),
  ],
  secret: requireEnv('NEXTAUTH_SECRET'),
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAgeSeconds,
  },
  cookies: {
    sessionToken: {
      name: sessionCookieName,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: isProduction,
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (!session.user) {
        return session
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.sub ?? '',
        },
      }
    },
  },
  events: {
    async signIn({ user }) {
      if (user.id) {
        await persistUserAvatar({ userId: user.id, imageUrl: user.image })
      }
    },
  },
})

/* eslint-disable prefer-destructuring */
// NOTE: Cannot use destructuring due to TypeScript type inference issue with @auth/core providers
// signIn and signOut are used from 'next-auth/react' in client components
export const auth = nextAuth.auth
export const handlers = nextAuth.handlers
/* eslint-enable prefer-destructuring */
