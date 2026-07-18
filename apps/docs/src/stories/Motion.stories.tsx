import { Button } from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

/**
 * Motion foundation for the component library.
 *
 * Tokens live in `@lodado/sdui-design-files/motion.css` and are consumed through
 * the `MOTION` fragments in the component package. `prefers-reduced-motion`
 * zeroes every duration token, so the whole system stills at once.
 */
const meta: Meta = {
  title: 'Foundations/Motion',
  parameters: {
    docs: {
      description: {
        component:
          'Duration/easing tokens and keyframes that drive every micro-interaction. ' +
          'Enter uses ease-out, exit uses ease-in and runs faster. Reduce-motion users get instant state changes.',
      },
    },
  },
}

export default meta
type Story = StoryObj

const DURATIONS = [
  ['--motion-duration-fast', '100ms', 'hover/press feedback, small-surface exit'],
  ['--motion-duration-medium', '150ms', 'small-surface enter, large exit'],
  ['--motion-duration-slow', '250ms', 'large-surface enter (dialog)'],
] as const

const EASINGS = [
  ['--motion-ease-out', 'cubic-bezier(0.2, 0, 0, 1)', 'decelerate — enter'],
  ['--motion-ease-in', 'cubic-bezier(0.4, 0, 1, 1)', 'accelerate — exit'],
  ['--motion-ease-in-out', 'cubic-bezier(0.4, 0, 0.2, 1)', 'color/state transition'],
  ['--motion-ease-spring', 'cubic-bezier(0.16, 1, 0.3, 1)', 'overshoot — thumb, check pop'],
] as const

const KEYFRAMES = [
  'sdui-fade-in',
  'sdui-pop-in',
  'sdui-pop-out',
  'sdui-dialog-in',
  'sdui-check-pop',
  'sdui-error-in',
] as const

const cell: React.CSSProperties = { padding: '8px 12px', borderBottom: '1px solid #e5e7eb', textAlign: 'left' }
const mono: React.CSSProperties = { fontFamily: 'monospace', fontSize: 13 }

export const Tokens: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 32, maxWidth: 720 }}>
      <section>
        <h3>Durations</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {DURATIONS.map(([token, value, use]) => (
              <tr key={token}>
                <td style={{ ...cell, ...mono }}>{token}</td>
                <td style={{ ...cell, ...mono }}>{value}</td>
                <td style={cell}>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Easings</h3>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            {EASINGS.map(([token, value, use]) => (
              <tr key={token}>
                <td style={{ ...cell, ...mono }}>{token}</td>
                <td style={{ ...cell, ...mono }}>{value}</td>
                <td style={cell}>{use}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <p style={{ color: '#626f86', fontSize: 14 }}>
        Under <code>prefers-reduced-motion: reduce</code> the three duration tokens become 0ms, so animations complete
        instantly while state changes still apply.
      </p>
    </div>
  ),
}

export const Keyframes: Story = {
  render: () => {
    const [replay, setReplay] = useState(0)
    return (
      <div style={{ display: 'grid', gap: 24, maxWidth: 720 }}>
        <button
          type="button"
          onClick={() => setReplay((n) => n + 1)}
          style={{ justifySelf: 'start', padding: '6px 12px', border: '1px solid #b7b9be', borderRadius: 4 }}
        >
          Replay
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {KEYFRAMES.map((name) => (
            <div key={`${name}-${replay}`} style={{ display: 'grid', gap: 8, justifyItems: 'center' }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 8,
                  background: 'var(--color-background-brand-bold, #1868db)',
                  animation: `${name} var(--motion-duration-slow) var(--motion-ease-out)`,
                }}
              />
              <span style={mono}>{name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
}

export const PressFeedback: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button appearance="primary">Press me</Button>
      <Button appearance="subtle">Press me</Button>
      <Button appearance="primary" isLoading>
        Loading
      </Button>
      <Button appearance="primary" isDisabled>
        Disabled
      </Button>
    </div>
  ),
}
