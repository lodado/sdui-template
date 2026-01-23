import type { SduiLayoutDocument } from '@lodado/sdui-template'

export const loginDocument: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'next-auth-oauth-login',
    name: 'NextAuth OAuth Login Example',
  },
  root: {
    id: 'root',
    type: 'Div',
    attributes: {
      className: 'min-h-[70vh] flex w-full items-center justify-center',
      as: 'section',
    },
    children: [
      {
        id: 'layout-frame',
        type: 'Div',
        attributes: {
          className: 'w-full max-w-[540px]',
        },
        children: [
          {
            id: 'card',
            type: 'Card',
            attributes: {
              className:
                'rounded-[24px] border border-white/12 bg-white/[0.06] p-8 px-6 shadow-[0_24px_60px_rgba(15,15,24,0.45)] flex flex-col gap-4',
            },
            children: [
              // Title Section
              {
                id: 'title-container',
                type: 'Div',
                attributes: {
                  as: 'h2',
                  className: 'mb-4',
                },
                children: [
                  {
                    id: 'title',
                    type: 'Text',
                    state: {
                      text: 'GitHub OAuth Login (NextAuth + SDUI)',
                    },
                    attributes: {
                      className: 'text-2xl font-bold',
                    },
                  },
                ],
              },

              // Description Section
              {
                id: 'description-container',
                type: 'Div',
                attributes: {
                  className: 'mb-4',
                },
                children: [
                  {
                    id: 'description',
                    type: 'Text',
                    state: {
                      text: 'NextAuth를 이용해 GitHub 로그인을 수행하고, SDUI 템플릿으로 화면을 구성합니다.',
                    },
                    attributes: {
                      className: '',
                    },
                  },
                ],
              },

              // Auth Area - Replaces old AuthButton
              {
                id: 'auth-area',
                type: 'AuthSwitch',
                children: [
                  // Loading State
                  {
                    id: 'auth-loading',
                    type: 'AuthSlot',
                    state: {
                      slot: 'loading',
                    },
                    children: [
                      {
                        id: 'loading-btn',
                        type: 'Button',
                        state: {
                          buttonStyle: 'outline',
                          size: 'M',
                          buttonType: 'secondary',
                          disabled: true,
                        },
                        children: [
                          {
                            id: 'loading-text',
                            type: 'Span',
                            state: {
                              text: '세션 확인 중...',
                            },
                          },
                        ],
                      },
                    ],
                  },

                  // Authenticated State
                  {
                    id: 'auth-logged-in',
                    type: 'AuthSlot',
                    state: {
                      slot: 'authenticated',
                    },
                    children: [
                      {
                        id: 'logout-wrapper',
                        type: 'Div',
                        attributes: {
                          className: 'flex flex-col gap-2',
                        },
                        children: [
                          {
                            id: 'logout-btn',
                            type: 'LogoutButton',
                            state: {
                              text: '로그아웃',
                              callbackUrl: '/',
                              buttonStyle: 'filled',
                              size: 'M',
                              buttonType: 'secondary',
                            },
                          },
                          {
                            id: 'session-hint',
                            type: 'SessionHint',
                            state: {
                              refreshingText: '리프레시 토큰 확인 중...',
                              normalText: '세션 만료 3분 전 자동 갱신됩니다.',
                              className: 'text-xs text-white/60',
                            },
                          },
                        ],
                      },
                    ],
                  },

                  // Unauthenticated State
                  {
                    id: 'auth-logged-out',
                    type: 'AuthSlot',
                    state: {
                      slot: 'unauthenticated',
                    },
                    children: [
                      {
                        id: 'login-btn',
                        type: 'LoginButton',
                        state: {
                          label: 'GitHub로 로그인',
                          provider: 'github',
                          callbackUrl: '/',
                          buttonStyle: 'outline',
                          size: 'M',
                          buttonType: 'secondary',
                        },
                      },
                    ],
                  },
                ],
              },

              // Status Panel - Replaces old StatusPanel
              {
                id: 'status-panel',
                type: 'Div',
                attributes: {
                  className: 'rounded-2xl border border-white/12 bg-black/40 p-4',
                },
                children: [
                  // Header
                  {
                    id: 'status-header',
                    type: 'Div',
                    attributes: {
                      className: 'flex items-center justify-between',
                    },
                    children: [
                      {
                        id: 'status-title',
                        type: 'Text',
                        state: {
                          text: '로그인 상태',
                        },
                        attributes: {
                          as: 'h2',
                          className: 'm-0 text-[13px] font-semibold',
                        },
                      },
                      {
                        id: 'refresh-btn',
                        type: 'RefreshButton',
                        state: {
                          text: '세션 갱신',
                          refreshingText: '갱신 중',
                        },
                      },
                    ],
                  },

                  // Session Fields
                  {
                    id: 'status-fields',
                    type: 'Div',
                    attributes: {
                      className: 'mt-3 flex flex-col gap-2 text-xs text-white/75',
                    },
                    children: [
                      {
                        id: 'field-status',
                        type: 'SessionField',
                        state: {
                          dataKey: 'status',
                          label: '세션 상태',
                        },
                      },
                      {
                        id: 'field-user',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.user.name',
                          label: '사용자',
                          fallback: '알 수 없음',
                        },
                      },
                      {
                        id: 'field-email',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.user.email',
                          label: '이메일',
                          fallback: '알 수 없음',
                        },
                      },
                      {
                        id: 'field-expires',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.expires',
                          label: '세션 만료',
                          fallback: '알 수 없음',
                        },
                      },
                      {
                        id: 'field-refresh',
                        type: 'SessionField',
                        state: {
                          dataKey: 'lastRefreshAt',
                          label: '최근 리프레시',
                          fallback: '아직 없음',
                          formatter: 'date',
                        },
                      },
                    ],
                  },

                  // Error Message
                  {
                    id: 'session-error',
                    type: 'SessionError',
                    state: {
                      className: 'm-0 mt-2 text-[#fca5a5]',
                    },
                  },
                ],
              },

              // Token Hint Section
              {
                id: 'token-hint-container',
                type: 'Div',
                attributes: {
                  className: 'mt-4',
                },
                children: [
                  {
                    id: 'token-hint',
                    type: 'Text',
                    state: {
                      text: 'JWT는 httpOnly 쿠키에 저장되며, 리프레시 토큰은 Supabase DB에 저장됩니다.',
                    },
                    attributes: {
                      className: 'text-sm text-gray-600',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
}
