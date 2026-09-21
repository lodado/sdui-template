const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const { Linter } = require('eslint')
const parser = require('@typescript-eslint/parser')
const plugin = require('../index.js')

const declarations = `
declare module '@lodado/sdui-template' {
  export type NodeState = { title: string; count: number; onClickData: string; getTitle: () => string }
  export function useSduiNodeSubscription(...args: unknown[]): { state: NodeState; attributes: { className: string } }
  export function useSduiNodeReference(...args: unknown[]): { state: NodeState }
  export function useSduiVariable<T = unknown>(...args: unknown[]): T
  export function useSduiVariables(...args: unknown[]): NodeState
  export function useRenderNode(...args: unknown[]): { renderChildren(ids: string[]): unknown }
  export function useSduiLayoutAction(...args: unknown[]): { updateNodeState(id: string, value: unknown): void }
}
declare module 'external-component' {
  export default function ExternalComponent(props: { title: string }): JSX.Element
}
declare namespace JSX {
  type Element = unknown
  interface ElementChildrenAttribute { children: {} }
  interface IntrinsicElements { [name: string]: Record<string, unknown> }
}
`

function lint(files, entry = 'entry.tsx', options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-plugin-sdui-'))
  fs.writeFileSync(path.join(root, 'sdui.d.ts'), declarations)
  fs.writeFileSync(
    path.join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: { strict: true, jsx: 'preserve', module: 'commonjs', target: 'es2020', skipLibCheck: true },
      include: ['**/*'],
    }),
  )
  for (const [name, source] of Object.entries(files)) {
    const file = path.join(root, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, source)
  }
  const linter = new Linter()
  linter.defineParser('typescript-eslint', parser)
  linter.defineRule('sdui/no-hook-data-prop-drilling', plugin.rules['no-hook-data-prop-drilling'])
  const filename = path.join(root, entry)
  const messages = linter.verify(
    fs.readFileSync(filename, 'utf8'),
    {
      parser: 'typescript-eslint',
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        project: path.join(root, 'tsconfig.json'),
        tsconfigRootDir: root,
      },
      rules: { 'sdui/no-hook-data-prop-drilling': 'error' },
      ...options,
    },
    filename,
  )
  fs.rmSync(root, { recursive: true, force: true })
  return messages
}

function errors(files, entry) {
  const messages = lint(files, entry)
  assert.deepEqual(
    messages.filter((message) => message.ruleId !== 'sdui/no-hook-data-prop-drilling'),
    [],
    JSON.stringify(messages),
  )
  return messages.filter((message) => message.severity === 2)
}

function lintOrder(files, entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'eslint-plugin-sdui-order-'))
  fs.writeFileSync(path.join(root, 'sdui.d.ts'), declarations)
  fs.writeFileSync(
    path.join(root, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: { strict: true, jsx: 'preserve', module: 'commonjs', target: 'es2020', skipLibCheck: true },
      include: ['**/*'],
    }),
  )
  for (const [name, source] of Object.entries(files)) {
    const file = path.join(root, name)
    fs.mkdirSync(path.dirname(file), { recursive: true })
    fs.writeFileSync(file, source)
  }
  const linter = new Linter()
  linter.defineParser('typescript-eslint', parser)
  linter.defineRule('sdui/no-hook-data-prop-drilling', plugin.rules['no-hook-data-prop-drilling'])
  const config = {
    parser: 'typescript-eslint',
    parserOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      ecmaFeatures: { jsx: true },
      project: path.join(root, 'tsconfig.json'),
      tsconfigRootDir: root,
    },
    rules: { 'sdui/no-hook-data-prop-drilling': 'error' },
  }
  const results = entries.map((entry) =>
    linter.verify(fs.readFileSync(path.join(root, entry), 'utf8'), config, path.join(root, entry)),
  )
  fs.rmSync(root, { recursive: true, force: true })
  return results
}

test('allows hook data into Child, but rejects Child to GrandChild drilling', () => {
  const messages = errors({
    'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'
      const Child = (props: { title: string }) => <GrandChild title={props.title} />
      const GrandChild = (props: { title: string }) => <div>{props.title}</div>
      export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
  })
  assert.equal(messages.length, 1)
})

test('flags conditional derived values on second hop', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; const Child = (props: { title: string }) => <GrandChild title={props.title ? 'yes' : 'no'} />; const GrandChild = (props: { title: string }) => <div>{props.title}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    }).length,
    1,
  )
})
test('does not taint a statically overridden spread prop', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; const Child = (props: { title: string }) => <GrandChild title={props.title} />; const GrandChild = (props: { title: string }) => <div>{props.title}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); const stateRecord: Record<string, unknown> = state; return <Child {...stateRecord} title="static" /> }`,
    }).length,
    0,
  )
})
test('keeps object rest clean when remaining fields are static', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; const Child = (props: { count: number }) => <GrandChild {...props} />; const GrandChild = (props: { count: number }) => <div>{props.count}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); const record = { title: state.title, count: 1 }; const { title, ...rest } = record; return <Child {...rest} /> }`,
    }).length,
    0,
  )
})
test('handles default-export named functions and lint order in one TypeScript Program', () => {
  const files = {
    'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; import Child from './child'; export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    'child.tsx': `export default function Child(props: { title: string }) { return <GrandChild title={props.title} /> }; const GrandChild = (props: { title: string }) => <div>{props.title}</div>`,
  }
  const [childFirst, parentAfter] = lintOrder(files, ['child.tsx', 'entry.tsx'])
  const [parentFirst, childAfter] = lintOrder(files, ['entry.tsx', 'child.tsx'])
  for (const result of [childFirst, parentAfter, parentFirst, childAfter])
    assert.deepEqual(
      result.filter((message) => message.ruleId !== 'sdui/no-hook-data-prop-drilling'),
      [],
      JSON.stringify(result),
    )
  assert.equal(childFirst.filter((message) => message.ruleId === 'sdui/no-hook-data-prop-drilling').length, 1)
  assert.equal(childAfter.filter((message) => message.ruleId === 'sdui/no-hook-data-prop-drilling').length, 1)
  assert.equal(parentAfter.filter((message) => message.ruleId === 'sdui/no-hook-data-prop-drilling').length, 0)
  assert.equal(parentFirst.filter((message) => message.ruleId === 'sdui/no-hook-data-prop-drilling').length, 0)
})
test('allows function props but flags invoking a hook-derived function before the next boundary', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; type P = { getTitle: () => string }; const FunctionChild = (props: P) => <GrandChild getTitle={props.getTitle} />; const ValueChild = (props: P) => <GrandChild title={props.getTitle()} />; const GrandChild = (props: P & { title?: string }) => <div>{props.getTitle?.() ?? props.title}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); const { getTitle } = state; return <><FunctionChild getTitle={getTitle} /><ValueChild getTitle={getTitle} /></> }`,
    }).length,
    1,
  )
})

test('does not taint an explicitly safe object rest value', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; type Data = { title: string; safe: string }; const Child = (props: Data) => { const { title, ...rest } = props; return <Grand data={rest} /> }; const Grand = (props: { data: { safe: string } }) => <div>{props.data.safe}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} safe="fixed" /> }`,
    }).length,
    0,
  )
})

test('tracks reassigned aliases inside object literals on the second hop', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; const Child = (props: { data: { title: string } }) => <Grand title={props.data.title} />; const Grand = (props: { title: string }) => <div>{props.title}</div>; export const Entry = () => { const { state } = useSduiNodeSubscription(); let title = ''; title = state.title; return <Child data={{ title }} /> }`,
    }).length,
    1,
  )
})

test('handles a twenty-level branching DAG without quadratic slowdown', () => {
  const files = {
    'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; import Child0 from './child0'; const Unrelated = () => { useSduiNodeSubscription(); return <div /> }; export const Entry = () => <Child0 title="static" />`,
  }
  for (let index = 0; index < 20; index += 1) {
    const next = index + 1
    files[`child${index}.tsx`] =
      index === 19
        ? `export default function Child${index}(props: { title: string }) { return <div>{props.title}</div> }`
        : `import Child${next} from './child${next}'; export default function Child${index}(props: { title: string }) { return <><Child${next} title={props.title} /><Child${next} title={props.title} /></> }`
  }
  const start = performance.now()
  assert.equal(errors(files, 'entry.tsx').length, 0)
  assert.ok(performance.now() - start < 5000)
})

test('does not flag ordinary props without an SDUI hook ancestor', () => {
  assert.equal(
    errors({
      'entry.tsx': `const Child = (props: { title: string }) => <GrandChild title={props.title} />
      const GrandChild = (props: { title: string }) => <span>{props.title}</span>
      export const Entry = () => <Child title="static" />`,
    }).length,
    0,
  )
})

test('tracks aliases, destructuring, transforms, arithmetic, object spreads, and reassignment', () => {
  const messages = errors({
    'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'
      const Child = (props: { title: string; count: number; extra?: string }) => <GrandChild {...props} />
      const GrandChild = (props: { title: string }) => <div>{props.title}</div>
      export const Entry = () => { const { state } = useSduiNodeSubscription(); const { title, count } = state; let alias = title; alias = alias.trim(); const payload = { title: alias, count: count + 1 }; return <Child {...payload} extra="ok" /> }`,
  })
  assert.equal(messages.length, 1)
})

test('tracks transformed scalar values on the second hop', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'
      const Child = (props: { title: string }) => <GrandChild title={props.title.trim()} />
      const GrandChild = (props: { title: string }) => <div>{props.title}</div>
      export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    }).length,
    1,
  )
})

test('still rejects a second-hop prop passed to an unresolved external component', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; import ExternalComponent from 'external-component'
      const Child = (props: { title: string }) => <ExternalComponent title={props.title} />
      export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    }).length,
    1,
  )
})

test('does not flag unrelated safe sibling props or imports shadowed by local bindings', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription as useData } from '@lodado/sdui-template'
      const Child = (props: { title: string; safe: string }) => <div>{props.title}{props.safe}</div>
      export const Entry = () => { const useData = () => ({ state: { title: 'local' } }); const { state } = useData(); return <Child title={state.title} safe="ok" /> }`,
    }).length,
    0,
  )
})

test('allows typed functions and callback closures at every depth, including nullable callbacks', () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription, useSduiLayoutAction } from '@lodado/sdui-template'
      type P = { onClick?: (() => void) | null }
      const GrandChild = (props: P) => <button onClick={props.onClick ?? undefined}>go</button>
      const Child = (props: P) => <GrandChild onClick={props.onClick} />
      export const Entry = () => { const { state } = useSduiNodeSubscription(); const { updateNodeState } = useSduiLayoutAction(); const onClick = () => updateNodeState('x', state.title); return <Child onClick={onClick} /> }`,
    }).length,
    0,
  )
})

test('rejects data named onClick and mixed data/function object props', () => {
  const messages = errors({
    'entry.tsx': `import { useSduiNodeReference } from '@lodado/sdui-template'
      type P = { onClick?: (() => void) | string; title?: string }
      const Child = (props: P) => <GrandChild {...props} />
      const GrandChild = (props: P) => <div>{props.title}</div>
      export const Entry = () => { const { state } = useSduiNodeReference(); const onClick = state.onClickData; const safe = () => {}; return <Child {...{ onClick, title: state.title, safe }} /> }`,
  })
  assert.equal(messages.length, 1)
})

test('supports named and namespace imports for all six official hooks', () => {
  const messages = errors({
    'entry.tsx': `import * as Sdui from '@lodado/sdui-template'
      import { useSduiVariable, useSduiVariables, useRenderNode, useSduiLayoutAction } from '@lodado/sdui-template'
      const Child = (props: { title: string }) => <GrandChild title={props.title} />
      const GrandChild = (props: { title: string }) => <div>{props.title}</div>
      export const Entry = () => { const a = Sdui.useSduiNodeSubscription().state.title; const b = Sdui.useSduiNodeReference().state.title; const c = useSduiVariable<string>(); const d = useSduiVariables().title; useRenderNode(); useSduiLayoutAction(); return <Child title={a + b + c + d} /> }`,
  })
  assert.equal(messages.length, 1)
})

test('follows cross-file barrel aliases and flags a shared Child when any caller drills data', () => {
  const files = {
    'hooks.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; import { Child } from './barrel'; export const Safe = () => { const { state } = useSduiNodeSubscription(); return <Child title="static" /> }; export const Unsafe = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    'barrel.tsx': `export { Child } from './child'`,
    'child.tsx': `export const Child = (props: { title: string }) => <GrandChild title={props.title} />; const GrandChild = (props: { title: string }) => <div>{props.title}</div>`,
  }
  assert.equal(errors(files, 'hooks.tsx').length, 0)
  assert.equal(errors(files, 'child.tsx').length, 1)
})

test('allows DOM/custom elements and JSX text, and terminates on component cycles', { timeout: 2000 }, () => {
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'
      const Child = (props: { title: string }) => <custom-element data-title={props.title}>text</custom-element>
      export const Entry = () => { const { state } = useSduiNodeSubscription(); return <Child title={state.title} /> }`,
    }).length,
    0,
  )
  assert.equal(
    errors({
      'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template'; export const A = (props: { title: string }) => <B title={props.title} />; export const B = (props: { title: string }) => <A title={props.title} />; export const Entry = () => { const { state } = useSduiNodeSubscription(); return <A title={state.title} /> }`,
    }).length,
    2,
  )
})

test('prop renaming in recursive components does not depend on JSX order', () => {
  for (const children of ['<Leaf value={p.b} /><A a="safe" b={p.a} />', '<A a="safe" b={p.a} /><Leaf value={p.b} />']) {
    assert.equal(
      errors({
        'entry.tsx': `import { useSduiNodeSubscription } from '@lodado/sdui-template';
        function Leaf(p: { value?: string }) { return <span>{p.value}</span> }
        function A(p: { a: string; b?: string }) { return <>${children}</> }
        export function Parent() { const { state } = useSduiNodeSubscription(); return <A a={state.title} /> }`,
      }).length,
      2,
    )
  }
})

test('bounds recursive object shape expansion', () => {
  assert.equal(
    errors({
      'entry.tsx': `function Leaf(p: { value: unknown }) { return <span /> }
      export function A(p: { data: any }) { return <><Leaf value={p.data.title} /><A data={p.data.next} /><A data={p.data.other} /></> }`,
    }).length,
    0,
  )
})

test('reports an actionable error when parser services are unavailable', () => {
  const linter = new Linter()
  linter.defineParser('typescript-eslint', parser)
  linter.defineRule('sdui/no-hook-data-prop-drilling', plugin.rules['no-hook-data-prop-drilling'])
  assert.throws(
    () =>
      linter.verify(
        'const value = 1',
        {
          parser: 'typescript-eslint',
          parserOptions: { ecmaVersion: 2022 },
          rules: { 'sdui/no-hook-data-prop-drilling': 'error' },
        },
        'missing-project.tsx',
      ),
    /parser services|parserOptions\.project|type-aware/i,
  )
})
