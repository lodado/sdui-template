import{j as a}from"./jsx-runtime-DXp8tebo.js";import{r as p}from"./iframe-bYlks92W.js";import{S as y,s as m,E as g}from"./sduiComponents-BGXf9eNj.js";import"./preload-helper-ggYluGXI.js";import"./index-BW_zSv78.js";import"./index-B-D2papd.js";class h{constructor(r={}){this.options=r,this.options={onlyOnCatch:!0,formatMessage:o=>{const{error:e,context:i}=o,t=i.nodeId?` (Node: ${i.nodeId})`:"";return`에러가 발생했습니다:

${e.message}${t}`},...r}}handleSituation(r){if(this.options.onlyOnCatch&&r.lifecycle.phase!=="catch")return;const o=this.options.formatMessage(r);alert(o)}}class f{constructor(r,o={}){this.policies=r,this.options=o,this.options={execution:"sequential",stopOnError:!1,...o}}async handleSituation(r){if(this.policies.length!==0)if(this.options.execution==="parallel")await Promise.allSettled(this.policies.map(o=>this.executePolicy(o,r)));else for(let o=0;o<this.policies.length;o+=1){const e=this.policies[o];await this.executePolicy(e,r)}}async executePolicy(r,o){try{await r.handleSituation(o)}catch(e){if(this.options.stopOnError)throw e;console.error("Error in policy handler:",e)}}}class P{constructor(){this.policies=[],this.options={}}add(r){return r&&this.policies.push(r),this}addIf(r,o){if(r){const e=typeof o=="function"?o():o;this.policies.push(e)}return this}addMany(...r){return r.forEach(o=>this.add(o)),this}withOptions(r){return this.options={...this.options,...r},this}build(){return this.policies.length===0?null:this.policies.length===1?this.policies[0]:new f(this.policies,this.options)}}const b={builder:()=>new P,chain:(...n)=>{const r=new P;return r.addMany(...n),r.build()}},A={title:"Shared/UI/ErrorBoundary",tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},s={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6 space-y-4"},children:[{id:"title",type:"Span",state:{text:"ErrorBoundary Default Behavior"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"Div components are wrapped with ErrorBoundary by default, so errors are isolated. Even if an error occurs in one of the two Divs below, the other Div continues to work normally."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"normal-div",type:"Div",attributes:{className:"p-4 border border-green-300 rounded bg-green-50"},children:[{id:"normal-text",type:"Span",state:{text:"Normal Div - This Div is not affected even if an error occurs"},attributes:{className:"text-green-700"}}]},{id:"error-div",type:"Div",attributes:{className:"p-4 border border-red-300 rounded bg-red-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[o,e]=p.useState(!1),i=()=>{e(!0)};if(o)throw new Error("An error occurred! But other Divs continue to work normally.");return a.jsx("button",{onClick:i,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error"})};return a.jsx(y,{document:n,components:{...m,ErrorButton:r}})},parameters:{docs:{description:{story:`
## Default Error Isolation

Div components are wrapped with ErrorBoundary by default, so when errors occur in child components:

- ✅ **Error Isolation**: Errors in one Div do not affect other Divs
- ✅ **Fallback UI**: Default error messages are displayed when errors occur
- ✅ **App Stability**: The entire app does not crash

In the example above, clicking the "Trigger Error" button will only put that Div in an error state, while the normal Div above continues to work normally.
        `}}}},l={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"AlertErrorPolicy Usage Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"Using ErrorReportingProvider and AlertErrorPolicy, you can display error notifications to users via browser alert when errors occur."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[e,i]=p.useState(!1),t=()=>{i(!0)};if(e)throw new Error("An error occurred due to button click!");return a.jsx("button",{onClick:t,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Show Alert)"})},o=b.builder().add(new h).build();return a.jsx(g,{policy:o,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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
        `}}}},d={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Custom Policy Implementation Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"You can implement custom error handling such as logging, analytics, and notifications by implementing the ErrorPolicy interface."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]},{id:"log-container",type:"Div",attributes:{className:"mt-4 p-4 border border-blue-300 rounded bg-blue-50"},children:[{id:"log-title",type:"Span",state:{text:"Error Log (Check Console):"},attributes:{className:"font-semibold mb-2 block"}},{id:"log-content",type:"Span",state:{text:"Open the browser developer tools console to view error logs."},attributes:{className:"text-sm text-gray-600"}}]}]}},r=()=>{const[i,t]=p.useState(!1),c=()=>{t(!0)};if(i)throw new Error("This error is handled by a custom Policy!");return a.jsx("button",{onClick:c,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Custom Policy)"})};class o{constructor(t){this.logger=t}handleSituation(t){const{error:c,context:E}=t,w=`[${new Date(E.timestamp).toLocaleString()}] Error at ${E.nodeId||"unknown"}: ${c.message}`;this.logger(w)}}const e=b.builder().add(new o(console.error)).add(new h).build();return a.jsx(g,{policy:e,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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
        `}}}},u={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Policy Chaining Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"You can chain multiple policies together. The example below handles both logging and Alert simultaneously."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[i,t]=p.useState(!1),c=()=>{t(!0)};if(i)throw new Error("This error is handled by chained policies!");return a.jsx("button",{onClick:c,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Chained)"})};class o{handleSituation(t){console.log("[LoggingPolicy]",t.error.message,t.context.nodeId)}}const e=b.builder().add(new o).add(new h).build();return a.jsx(g,{policy:e,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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
        `}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6 space-y-4'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'ErrorBoundary Default Behavior'
          },
          attributes: {
            className: 'text-lg font-bold mb-4 block'
          }
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'Div components are wrapped with ErrorBoundary by default, so errors are isolated. Even if an error occurs in one of the two Divs below, the other Div continues to work normally.'
          },
          attributes: {
            className: 'text-gray-600 mb-4 block'
          }
        }, {
          id: 'normal-div',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-green-300 rounded bg-green-50'
          },
          children: [{
            id: 'normal-text',
            type: 'Span',
            state: {
              text: 'Normal Div - This Div is not affected even if an error occurs'
            },
            attributes: {
              className: 'text-green-700'
            }
          }]
        }, {
          id: 'error-div',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-red-300 rounded bg-red-50'
          },
          children: [{
            id: 'error-button',
            type: 'ErrorButton'
          }]
        }]
      }
    };
    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      const handleClick = () => {
        setShouldThrow(true);
      };
      if (shouldThrow) {
        throw new Error('An error occurred! But other Divs continue to work normally.');
      }
      return <button onClick={handleClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Trigger Error
        </button>;
    };
    return <SduiLayoutRenderer document={document} components={{
      ...sduiComponents,
      ErrorButton: ErrorButtonFactory
    }} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Default Error Isolation

Div components are wrapped with ErrorBoundary by default, so when errors occur in child components:

- ✅ **Error Isolation**: Errors in one Div do not affect other Divs
- ✅ **Fallback UI**: Default error messages are displayed when errors occur
- ✅ **App Stability**: The entire app does not crash

In the example above, clicking the "Trigger Error" button will only put that Div in an error state, while the normal Div above continues to work normally.
        \`
      }
    }
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'AlertErrorPolicy Usage Example'
          },
          attributes: {
            className: 'text-lg font-bold mb-4 block'
          }
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'Using ErrorReportingProvider and AlertErrorPolicy, you can display error notifications to users via browser alert when errors occur.'
          },
          attributes: {
            className: 'text-gray-600 mb-4 block'
          }
        }, {
          id: 'error-container',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-gray-300 rounded bg-gray-50'
          },
          children: [{
            id: 'error-button',
            type: 'ErrorButton'
          }]
        }]
      }
    };
    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      const handleClick = () => {
        setShouldThrow(true);
      };
      if (shouldThrow) {
        throw new Error('An error occurred due to button click!');
      }
      return <button onClick={handleClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Trigger Error (Show Alert)
        </button>;
    };
    const errorPolicy = createErrorPolicy.builder().add(new AlertErrorPolicy()).build();
    return <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer document={document} components={{
        ...sduiComponents,
        ErrorButton: ErrorButtonFactory
      }} />
      </ErrorReportingProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Using AlertErrorPolicy

To display error notifications to users via alert when errors occur, use **ErrorReportingProvider** and **AlertErrorPolicy**.

### Setup

\\\`\\\`\\\`typescript
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
\\\`\\\`\\\`

### How It Works

1. When an error occurs, ErrorBoundary catches it
2. The Policy in ErrorReportingProvider handles the error situation
3. AlertErrorPolicy displays the error message via browser alert

### Customization

\\\`\\\`\\\`typescript
// Custom message format
const policy = new AlertErrorPolicy({
  formatMessage: (situation) => {
    return \\\`Error: \\\${situation.error.message} (Node: \\\${situation.context.nodeId})\\\`
  },
})

// Show alert only on catch phase (default)
const policy = new AlertErrorPolicy({
  onlyOnCatch: true,
})
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Custom Policy Implementation Example'
          },
          attributes: {
            className: 'text-lg font-bold mb-4 block'
          }
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'You can implement custom error handling such as logging, analytics, and notifications by implementing the ErrorPolicy interface.'
          },
          attributes: {
            className: 'text-gray-600 mb-4 block'
          }
        }, {
          id: 'error-container',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-gray-300 rounded bg-gray-50'
          },
          children: [{
            id: 'error-button',
            type: 'ErrorButton'
          }]
        }, {
          id: 'log-container',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-4 border border-blue-300 rounded bg-blue-50'
          },
          children: [{
            id: 'log-title',
            type: 'Span',
            state: {
              text: 'Error Log (Check Console):'
            },
            attributes: {
              className: 'font-semibold mb-2 block'
            }
          }, {
            id: 'log-content',
            type: 'Span',
            state: {
              text: 'Open the browser developer tools console to view error logs.'
            },
            attributes: {
              className: 'text-sm text-gray-600'
            }
          }]
        }]
      }
    };
    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      const handleClick = () => {
        setShouldThrow(true);
      };
      if (shouldThrow) {
        throw new Error('This error is handled by a custom Policy!');
      }
      return <button onClick={handleClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Trigger Error (Custom Policy)
        </button>;
    };

    // Custom Policy implementation
    class LoggingErrorPolicy implements ErrorPolicy {
      private logger: (msg: string) => void;
      constructor(logger: (msg: string) => void) {
        this.logger = logger;
      }
      handleSituation(situation: ErrorSituation): void {
        const {
          error,
          context
        } = situation;
        const timestamp = new Date(context.timestamp).toLocaleString();
        const logMessage = \`[\${timestamp}] Error at \${context.nodeId || 'unknown'}: \${error.message}\`;
        this.logger(logMessage);
      }
    }
    const errorPolicy = createErrorPolicy.builder()
    // eslint-disable-next-line no-console
    .add(new LoggingErrorPolicy(console.error)).add(new AlertErrorPolicy()).build();
    return <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer document={document} components={{
        ...sduiComponents,
        ErrorButton: ErrorButtonFactory
      }} />
      </ErrorReportingProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Custom Policy Implementation

You can create your own error handling logic by implementing the **ErrorPolicy** interface.

### Policy Interface

\\\`\\\`\\\`typescript
interface ErrorPolicy {
  handleSituation(situation: ErrorSituation): void | Promise<void>
}
\\\`\\\`\\\`

### Implementation Example

\\\`\\\`\\\`typescript
class LoggingErrorPolicy implements ErrorPolicy {
  constructor(private logger: (msg: string) => void) {}

  handleSituation(situation: ErrorSituation): void {
    const { error, context } = situation
    this.logger(\\\`Error: \\\${error.message} at \\\${context.nodeId}\\\`)
  }
}

// Usage
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(console.error))
  .add(new AlertErrorPolicy())
  .build()
\\\`\\\`\\\`

### ErrorSituation Information

The Policy receives the following information:

- \\\`error\\\`: The Error object that occurred
- \\\`errorInfo\\\`: React ErrorInfo (provided from componentDidCatch)
- \\\`context\\\`: Error context (nodeId, componentName, timestamp, etc.)
- \\\`lifecycle\\\`: Lifecycle information (phase: 'catch' | 'recovery' | 'mount' | etc.)

### Policy Chaining

You can combine multiple policies:

\\\`\\\`\\\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .add(new AlertErrorPolicy())
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .withOptions({ execution: 'parallel' }) // Parallel execution
  .build()
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Policy Chaining Example'
          },
          attributes: {
            className: 'text-lg font-bold mb-4 block'
          }
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'You can chain multiple policies together. The example below handles both logging and Alert simultaneously.'
          },
          attributes: {
            className: 'text-gray-600 mb-4 block'
          }
        }, {
          id: 'error-container',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-gray-300 rounded bg-gray-50'
          },
          children: [{
            id: 'error-button',
            type: 'ErrorButton'
          }]
        }]
      }
    };
    const ErrorButtonFactory: ComponentFactory = () => {
      const [shouldThrow, setShouldThrow] = useState(false);
      const handleClick = () => {
        setShouldThrow(true);
      };
      if (shouldThrow) {
        throw new Error('This error is handled by chained policies!');
      }
      return <button onClick={handleClick} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
          Trigger Error (Chained)
        </button>;
    };

    // Multiple Policy combination
    class LoggingErrorPolicy implements ErrorPolicy {
      handleSituation(situation: ErrorSituation): void {
        console.log('[LoggingPolicy]', situation.error.message, situation.context.nodeId);
      }
    }
    const errorPolicy = createErrorPolicy.builder().add(new LoggingErrorPolicy()).add(new AlertErrorPolicy()).build();
    return <ErrorReportingProvider policy={errorPolicy}>
        <SduiLayoutRenderer document={document} components={{
        ...sduiComponents,
        ErrorButton: ErrorButtonFactory
      }} />
      </ErrorReportingProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Policy Chaining

You can combine multiple policies. Use the Builder pattern for easy chaining.

### Basic Chaining

\\\`\\\`\\\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .add(new AlertErrorPolicy())
  .add(new AnalyticsErrorPolicy(analytics))
  .build()
\\\`\\\`\\\`

### Conditional Addition

\\\`\\\`\\\`typescript
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .addIf(hasNotification, new NotificationErrorPolicy(notifier))
  .build()
\\\`\\\`\\\`

### Execution Options

\\\`\\\`\\\`typescript
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
\\\`\\\`\\\`

### Direct Array Passing

\\\`\\\`\\\`typescript
const policy = createErrorPolicy.chain(
  new LoggingErrorPolicy(logger),
  new AlertErrorPolicy(),
  new AnalyticsErrorPolicy(analytics)
)
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};const I=["DefaultErrorIsolation","WithAlertPolicy","WithCustomPolicy","PolicyChaining"];export{s as DefaultErrorIsolation,u as PolicyChaining,l as WithAlertPolicy,d as WithCustomPolicy,I as __namedExportsOrder,A as default};
