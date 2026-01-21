import type { SduiLayoutDocument } from '@lodado/sdui-template'

export const loginDocument: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'next-auth-oauth-login',
    name: 'NextAuth OAuth Login Example',
  },
  root: {
    id: 'root',
    type: 'Container',
    state: {
      align: 'center',
    },
    children: [
      {
        id: 'card',
        type: 'Card',
        state: {
          tone: 'dark',
        },
        children: [
          {
            id: 'title',
            type: 'Title',
            state: {
              text: 'GitHub OAuth Login (NextAuth + SDUI)',
            },
          },
          {
            id: 'description',
            type: 'Description',
            state: {
              text: 'NextAuth를 이용해 GitHub 로그인을 수행하고, SDUI 템플릿으로 화면을 구성합니다.',
            },
          },
          {
            id: 'auth-button',
            type: 'AuthButton',
            state: {
              label: 'GitHub로 로그인',
            },
          },
          {
            id: 'status-panel',
            type: 'StatusPanel',
            state: {
              title: '로그인 상태',
            },
          },
          {
            id: 'token-hint',
            type: 'Hint',
            state: {
              text: 'JWT는 httpOnly 쿠키에 저장되며, 리프레시 토큰은 Supabase DB에 저장됩니다.',
            },
          },
        ],
      },
    ],
  },
}
