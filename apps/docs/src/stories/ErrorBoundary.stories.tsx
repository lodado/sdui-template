/* eslint-disable local-rules/no-console-log */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-console, no-debugger */

import {
  type ComponentFactory,
  type SduiLayoutDocument,
  SduiLayoutRenderer,
} from '@lodado/sdui-template'
import {
  AlertErrorPolicy,
  createErrorPolicy,
  type ErrorPolicy,
  ErrorReportingProvider,
  type ErrorSituation,
  sduiComponents,
} from '@lodado/sdui-template-component'
import type { Meta, StoryObj } from '@storybook/react-vite'
import React, { useState } from 'react'

const meta: Meta = {
  title: 'Shared/UI/ErrorBoundary',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `
## Overview

**ErrorBoundary** is built into the Div component, automatically catching and isolating errors that occur in child components.

## Default Behavior

- ✅ **Automatic Error Isolation**: Div components are wrapped with ErrorBoundary by default, preventing the entire app from crashing when errors occur
- ✅ **Fallback UI**: Default error messages are displayed when errors occur
- ✅ **Error Isolation**: Errors in one Div do not affect other Divs

## Error Policy Configuration

If you need error logging, notifications, analytics, etc., use **ErrorReportingProvider** and **ErrorPolicy**.

### Basic Usage

\`\`\`typescript
import {
  ErrorReportingProvider,
  createErrorPolicy,
  AlertErrorPolicy,
} from '@lodado/sdui-template-component'

// Create Policy
const errorPolicy = createErrorPolicy.builder()
  .add(new AlertErrorPolicy())
  .build()

// Wrap with Provider
<ErrorReportingProvider policy={errorPolicy}>
  <SduiLayoutRenderer document={document} components={componentMap} />
</ErrorReportingProvider>
\`\`\`

### Custom Policy Implementation

\`\`\`typescript
class LoggingErrorPolicy implements ErrorPolicy {
  constructor(private logger: (msg: string) => void) {}

  handleSituation(situation: ErrorSituation): void {
    this.logger(\`Error: \${situation.error.message} at \${situation.context.nodeId}\`)
  }
}

const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(console.error))
  .add(new AlertErrorPolicy())
  .build()
\`\`\`

## Policy Chaining

You can combine multiple policies:

\`\`\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .add(new AlertErrorPolicy())
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .withOptions({ execution: 'parallel' })
  .build()
\`\`\`
        `,
      },
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default error isolation behavior
export const DefaultErrorIsolation: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6 space-y-4',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'ErrorBoundary Default Behavior',
            },
            attributes: {
              className: 'text-lg font-bold mb-4 block',
            },
          },
          {
            id: 'description',
            type: 'Span',
            state: {
              text: 'Div components are wrapped with ErrorBoundary by default, so errors are isolated. Even if an error occurs in one of the two Divs below, the other Div continues to work normally.',
            },
            attributes: {
              className: 'text-gray-600 mb-4 block',
            },
          },
          {
            id: 'normal-div',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-green-300 rounded bg-green-50',
            },
            children: [
              {
                id: 'normal-text',
                type: 'Span',
                state: {
                  text: 'Normal Div - This Div is not affected even if an error occurs',
                },
                attributes: {
                  className: 'text-green-700',
                },
              },
            ],
          },
          {
            id: 'error-div',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-red-300 rounded bg-red-50',
            },
            children: [
              {
                id: 'error-button',
                type: 'ErrorButton',
              },
            ],
          },
        ],
      },
    }

    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false)

      const handleClick = () => {
        setShouldThrow(true)
      }

      if (shouldThrow) {
        throw new Error('An error occurred! But other Divs continue to work normally.')
      }

      return (
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Error
        </button>
      )
    }

    return (
      <SduiLayoutRenderer
        document={document}
        components={{
          ...sduiComponents,
          ErrorButton: ErrorButtonFactory,
        }}
      />
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Default Error Isolation

Div components are wrapped with ErrorBoundary by default, so when errors occur in child components:

- ✅ **Error Isolation**: Errors in one Div do not affect other Divs
- ✅ **Fallback UI**: Default error messages are displayed when errors occur
- ✅ **App Stability**: The entire app does not crash

In the example above, clicking the "Trigger Error" button will only put that Div in an error state, while the normal Div above continues to work normally.
        `,
      },
    },
  },
}

// Alert Policy usage example
export const WithAlertPolicy: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'AlertErrorPolicy Usage Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4 block',
            },
          },
          {
            id: 'description',
            type: 'Span',
            state: {
              text: 'Using ErrorReportingProvider and AlertErrorPolicy, you can display error notifications to users via browser alert when errors occur.',
            },
            attributes: {
              className: 'text-gray-600 mb-4 block',
            },
          },
          {
            id: 'error-container',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-gray-300 rounded bg-gray-50',
            },
            children: [
              {
                id: 'error-button',
                type: 'ErrorButton',
              },
            ],
          },
        ],
      },
    }

    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false)

      const handleClick = () => {
        setShouldThrow(true)
      }

      if (shouldThrow) {
        throw new Error('An error occurred due to button click!')
      }

      return (
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Error (Show Alert)
        </button>
      )
    }

    const errorPolicy = createErrorPolicy.builder()
      .add(new AlertErrorPolicy())
      .build()

    return (
      <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer
          document={document}
          components={{
            ...sduiComponents,
            ErrorButton: ErrorButtonFactory,
          }}
        />
      </ErrorReportingProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Using AlertErrorPolicy

To display error notifications to users via alert when errors occur, use **ErrorReportingProvider** and **AlertErrorPolicy**.

### Setup

\`\`\`typescript
import {
  ErrorReportingProvider,
  createErrorPolicy,
  AlertErrorPolicy,
} from '@lodado/sdui-template-component'

// Create Policy
const errorPolicy = createErrorPolicy.builder()
  .add(new AlertErrorPolicy())
  .build()

// Wrap with Provider
<ErrorReportingProvider policy={errorPolicy}>
  <SduiLayoutRenderer document={document} components={componentMap} />
</ErrorReportingProvider>
\`\`\`

### How It Works

1. When an error occurs, ErrorBoundary catches it
2. The Policy in ErrorReportingProvider handles the error situation
3. AlertErrorPolicy displays the error message via browser alert

### Customization

\`\`\`typescript
// Custom message format
const policy = new AlertErrorPolicy({
  formatMessage: (situation) => {
    return \`Error: \${situation.error.message} (Node: \${situation.context.nodeId})\`
  },
})

// Show alert only on catch phase (default)
const policy = new AlertErrorPolicy({
  onlyOnCatch: true,
})
\`\`\`
        `,
      },
    },
  },
}

// Custom Policy implementation example
export const WithCustomPolicy: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Custom Policy Implementation Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4 block',
            },
          },
          {
            id: 'description',
            type: 'Span',
            state: {
              text: 'You can implement custom error handling such as logging, analytics, and notifications by implementing the ErrorPolicy interface.',
            },
            attributes: {
              className: 'text-gray-600 mb-4 block',
            },
          },
          {
            id: 'error-container',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-gray-300 rounded bg-gray-50',
            },
            children: [
              {
                id: 'error-button',
                type: 'ErrorButton',
              },
            ],
          },
          {
            id: 'log-container',
            type: 'Div',
            attributes: {
              className: 'mt-4 p-4 border border-blue-300 rounded bg-blue-50',
            },
            children: [
              {
                id: 'log-title',
                type: 'Span',
                state: {
                  text: 'Error Log (Check Console):',
                },
                attributes: {
                  className: 'font-semibold mb-2 block',
                },
              },
              {
                id: 'log-content',
                type: 'Span',
                state: {
                  text: 'Open the browser developer tools console to view error logs.',
                },
                attributes: {
                  className: 'text-sm text-gray-600',
                },
              },
            ],
          },
        ],
      },
    }

    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false)

      const handleClick = () => {
        setShouldThrow(true)
      }

      if (shouldThrow) {
        throw new Error('This error is handled by a custom Policy!')
      }

      return (
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Error (Custom Policy)
        </button>
      )
    }

    // Custom Policy implementation
    class LoggingErrorPolicy implements ErrorPolicy {
      private logger: (msg: string) => void

      constructor(logger: (msg: string) => void) {
        this.logger = logger
      }

      handleSituation(situation: ErrorSituation): void {
        const { error, context } = situation
        const timestamp = new Date(context.timestamp).toLocaleString()
        const logMessage = `[${timestamp}] Error at ${context.nodeId || 'unknown'}: ${error.message}`
        this.logger(logMessage)
      }
    }

    const errorPolicy = createErrorPolicy.builder()
      // eslint-disable-next-line no-console
      .add(new LoggingErrorPolicy(console.error))
      .add(new AlertErrorPolicy())
      .build()

    return (
      <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer
          document={document}
          components={{
            ...sduiComponents,
            ErrorButton: ErrorButtonFactory,
          }}
        />
      </ErrorReportingProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Custom Policy Implementation

You can create your own error handling logic by implementing the **ErrorPolicy** interface.

### Policy Interface

\`\`\`typescript
interface ErrorPolicy {
  handleSituation(situation: ErrorSituation): void | Promise<void>
}
\`\`\`

### Implementation Example

\`\`\`typescript
class LoggingErrorPolicy implements ErrorPolicy {
  constructor(private logger: (msg: string) => void) {}

  handleSituation(situation: ErrorSituation): void {
    const { error, context } = situation
    this.logger(\`Error: \${error.message} at \${context.nodeId}\`)
  }
}

// Usage
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(console.error))
  .add(new AlertErrorPolicy())
  .build()
\`\`\`

### ErrorSituation Information

The Policy receives the following information:

- \`error\`: The Error object that occurred
- \`errorInfo\`: React ErrorInfo (provided from componentDidCatch)
- \`context\`: Error context (nodeId, componentName, timestamp, etc.)
- \`lifecycle\`: Lifecycle information (phase: 'catch' | 'recovery' | 'mount' | etc.)

### Policy Chaining

You can combine multiple policies:

\`\`\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .add(new AlertErrorPolicy())
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .withOptions({ execution: 'parallel' }) // Parallel execution
  .build()
\`\`\`
        `,
      },
    },
  },
}

// Policy chaining example
export const PolicyChaining: Story = {
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6',
        },
        children: [
          {
            id: 'title',
            type: 'Span',
            state: {
              text: 'Policy Chaining Example',
            },
            attributes: {
              className: 'text-lg font-bold mb-4 block',
            },
          },
          {
            id: 'description',
            type: 'Span',
            state: {
              text: 'You can chain multiple policies together. The example below handles both logging and Alert simultaneously.',
            },
            attributes: {
              className: 'text-gray-600 mb-4 block',
            },
          },
          {
            id: 'error-container',
            type: 'Div',
            attributes: {
              className: 'p-4 border border-gray-300 rounded bg-gray-50',
            },
            children: [
              {
                id: 'error-button',
                type: 'ErrorButton',
              },
            ],
          },
        ],
      },
    }

    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false)

      const handleClick = () => {
        setShouldThrow(true)
      }

      if (shouldThrow) {
        throw new Error('This error is handled by chained policies!')
      }

      return (
        <button
          onClick={handleClick}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Trigger Error (Chained)
        </button>
      )
    }

    // Multiple Policy combination
    class LoggingErrorPolicy implements ErrorPolicy {
      handleSituation(situation: ErrorSituation): void {

        console.log('[LoggingPolicy]', situation.error.message, situation.context.nodeId)
      }
    }

    const errorPolicy = createErrorPolicy.builder()
      .add(new LoggingErrorPolicy())
      .add(new AlertErrorPolicy())
      .build()

    return (
      <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer
          document={document}
          components={{
            ...sduiComponents,
            ErrorButton: ErrorButtonFactory,
          }}
        />
      </ErrorReportingProvider>
    )
  },
  parameters: {
    docs: {
      description: {
        story: `
## Policy Chaining

You can combine multiple policies. Use the Builder pattern for easy chaining.

### Basic Chaining

\`\`\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .add(new AlertErrorPolicy())
  .add(new AnalyticsErrorPolicy(analytics))
  .build()
\`\`\`

### Conditional Addition

\`\`\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .addIf(hasNotification, new NotificationErrorPolicy(notifier))
  .build()
\`\`\`

### Execution Options

\`\`\`typescript
// Sequential execution (default)
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .build()

// Parallel execution
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ execution: 'parallel' })
  .build()

// Stop on error
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ stopOnError: true })
  .build()
\`\`\`

### Direct Array Passing

\`\`\`typescript
const policy = createErrorPolicy.chain(
  new LoggingErrorPolicy(logger),
  new AlertErrorPolicy(),
  new AnalyticsErrorPolicy(analytics)
)
\`\`\`
        `,
      },
    },
  },
}
