'use client'

import type { SduiLayoutDocument } from '@lodado/sdui-template'
import { SduiLayoutRenderer } from '@lodado/sdui-template'

import { componentMap } from './components/componentMap'

/**
 * 예제 SDUI 문서
 *
 * 간단한 그리드 레이아웃과 토글 컴포넌트를 포함한 예제입니다.
 */
const exampleDocument: SduiLayoutDocument = {
  version: '1.0.0',
  metadata: {
    id: 'example-layout',
    name: 'Example Layout',
    description: 'SDUI Template SSR Testing Example',
  },
  root: {
    id: 'root',
    type: 'GridLayout',
    state: {},
    children: [
      {
        id: 'toggle-1',
        type: 'Toggle',
        state: {
          isChecked: false,
          label: '알림 받기',
        },
      },
      {
        id: 'toggle-2',
        type: 'Toggle',
        state: {
          isChecked: true,
          label: '다크 모드',
        },
      },
      {
        id: 'toggle-3',
        type: 'Toggle',
        state: {
          isChecked: false,
          label: '자동 저장',
        },
      },
    ],
  },
}

const Home = () => (
  <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
    <main className="flex-1 w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-black dark:text-zinc-50 mb-2">SDUI Template SSR Testing</h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          Next.js App Router를 사용한 Server-Driven UI 테스트 페이지입니다.
        </p>
      </div>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="h-[400px]">
          <SduiLayoutRenderer
            document={exampleDocument}
            components={componentMap}
             
            onError={(error: Error) => console.error('SDUI Layout Error:', error)}
          />
        </div>
      </div>
    </main>
  </div>
)

export default Home
