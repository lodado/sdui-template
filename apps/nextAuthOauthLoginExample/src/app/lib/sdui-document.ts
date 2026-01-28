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
                      text: 'Use NextAuth to sign in with GitHub and render the UI with the SDUI template.',
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
                              text: 'Checking session...',
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
                              text: 'Log out',
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
                              refreshingText: 'Checking refresh token...',
                              normalText: 'Automatically refreshes 3 minutes before session expiration.',
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
                          label: 'Sign in with GitHub',
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
                          text: 'Login status',
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
                          text: 'Refresh session',
                          refreshingText: 'Refreshing',
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
                          label: 'Session status',
                        },
                      },
                      {
                        id: 'field-user',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.user.name',
                          label: 'User',
                          fallback: 'Unknown',
                        },
                      },
                      {
                        id: 'field-email',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.user.email',
                          label: 'Email',
                          fallback: 'Unknown',
                        },
                      },
                      {
                        id: 'field-expires',
                        type: 'SessionField',
                        state: {
                          dataKey: 'session.expires',
                          label: 'Session expires',
                          fallback: 'Unknown',
                        },
                      },
                      {
                        id: 'field-refresh',
                        type: 'SessionField',
                        state: {
                          dataKey: 'lastRefreshAt',
                          label: 'Last refresh',
                          fallback: 'Not yet',
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
                      text: 'JWTs are stored in httpOnly cookies, and refresh tokens are stored in the Supabase database.',
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
