import type { NextAuthOptions } from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

import { isProduction, requireEnv } from './env'
import { persistUserAvatar } from './supabase'

export const sessionMaxAgeSeconds = 60 * 15
export const refreshCookieName = 'sdui-refresh-token'
export const sessionCookieName = isProduction
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token'

export const authOptions: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: requireEnv('GITHUB_CLIENT_ID'),
      clientSecret: requireEnv('GITHUB_CLIENT_SECRET'),
    }),
  ],
  secret: requireEnv('NEXTAUTH_SECRET'),
  session: {
    strategy: 'jwt',
    maxAge: sessionMaxAgeSeconds,
  },
  jwt: {
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
}
