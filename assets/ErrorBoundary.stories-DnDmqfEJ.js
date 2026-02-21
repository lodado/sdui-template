import{j as a}from"./jsx-runtime-slN4ere-.js";import{r as p}from"./iframe-Bf5Fj-MD.js";import{S as y,s as m,E as h}from"./sduiComponents-daN0Jbtk.js";import"./preload-helper-ggYluGXI.js";import"./index-nk0-osR5.js";import"./index-BW5zYQhE.js";class g{constructor(r={}){this.options=r,this.options={onlyOnCatch:!0,formatMessage:e=>{const{error:o,context:i}=e,t=i.nodeId?` (Node: ${i.nodeId})`:"";return`에러가 발생했습니다:

${o.message}${t}`},...r}}handleSituation(r){if(this.options.onlyOnCatch&&r.lifecycle.phase!=="catch")return;const e=this.options.formatMessage(r);alert(e)}}class P{constructor(r,e={}){this.policies=r,this.options=e,this.options={execution:"sequential",stopOnError:!1,...e}}async handleSituation(r){if(this.policies.length!==0)if(this.options.execution==="parallel")await Promise.allSettled(this.policies.map(e=>this.executePolicy(e,r)));else for(let e=0;e<this.policies.length;e+=1){const o=this.policies[e];await this.executePolicy(o,r)}}async executePolicy(r,e){try{await r.handleSituation(e)}catch(o){if(this.options.stopOnError)throw o;console.error("Error in policy handler:",o)}}}class b{constructor(){this.policies=[],this.options={}}add(r){return r&&this.policies.push(r),this}addIf(r,e){if(r){const o=typeof e=="function"?e():e;this.policies.push(o)}return this}addMany(...r){return r.forEach(e=>this.add(e)),this}withOptions(r){return this.options={...this.options,...r},this}build(){return this.policies.length===0?null:this.policies.length===1?this.policies[0]:new P(this.policies,this.options)}}const E={builder:()=>new b,chain:(...n)=>{const r=new b;return r.addMany(...n),r.build()}},A={title:"Shared/UI/ErrorBoundary",tags:["autodocs"],parameters:{docs:{description:{component:`
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

### ErrorSituation Structure

When an error occurs, the Policy receives an **ErrorSituation** object with the following structure:

\`\`\`typescript
interface ErrorSituation {
  // Error object (JavaScript Error instance)
  error: Error
  
  // React ErrorInfo (from componentDidCatch)
  errorInfo?: React.ErrorInfo
  
  // Context information
  context: ErrorContext
  
  // Lifecycle information
  lifecycle: {
    phase: 'mount' | 'update' | 'unmount' | 'catch' | 'recovery'
    previousState?: { hasError: boolean; error: Error | null }
    currentState: { hasError: boolean; error: Error | null }
  }
  
  // Additional metadata
  metadata?: Record<string, unknown>
}
\`\`\`

#### Error Object Properties

The \`error\` field is a standard JavaScript **Error** object with the following properties:

- **\`error.message\`**: Error message string
- **\`error.name\`**: Error type name (e.g., 'Error', 'TypeError', 'ReferenceError')
- **\`error.stack\`**: Stack trace (if available)
- **\`error.cause\`**: Cause error (if chained, ES2022+)

Common error types:
- \`Error\`: Generic error
- \`TypeError\`: Type-related errors (e.g., accessing property of undefined)
- \`ReferenceError\`: Reference errors (e.g., undefined variable)
- \`SyntaxError\`: Syntax errors (usually caught at compile time)
- \`RangeError\`: Range errors (e.g., array index out of bounds)

#### ErrorContext Properties

The \`context\` field provides metadata about where the error occurred:

- **\`context.nodeId\`**: SDUI node ID where the error occurred (optional)
- **\`context.componentName\`**: Component name (default: 'ErrorBoundary')
- **\`context.timestamp\`**: Error timestamp (milliseconds since epoch)
- **\`context.errorBoundaryId\`**: ErrorBoundary ID for distinguishing multiple boundaries (optional)
- **\`context.parentPath\`**: SDUI hierarchy path (array of parent node IDs)
- **\`context.metadata\`**: Additional custom metadata (optional)

#### Lifecycle Phases

The \`lifecycle.phase\` indicates when the error situation was reported:

- **\`'catch'\`**: Error was caught by \`componentDidCatch\` (most common)
- **\`'mount'\`**: ErrorBoundary was mounted (informational)
- **\`'update'\`**: ErrorBoundary state changed from no-error to error state
- **\`'recovery'\`**: ErrorBoundary recovered from error state (error cleared)
- **\`'unmount'\`**: ErrorBoundary is unmounting with an error still present

#### React ErrorInfo

The \`errorInfo\` field (when available) contains React-specific error information:

- **\`errorInfo.componentStack\`**: Component stack trace showing the component hierarchy
- Additional React internal error details

### Custom Policy Implementation

\`\`\`typescript
interface ErrorPolicy {
  handleSituation(situation: ErrorSituation): void | Promise<void>
}

class LoggingErrorPolicy implements ErrorPolicy {
  constructor(private logger: (msg: string) => void) {}

  handleSituation(situation: ErrorSituation): void {
    const { error, context, lifecycle } = situation
    
    // Access error properties
    const errorType = error.name
    const errorMessage = error.message
    const stackTrace = error.stack
    
    // Access context
    const nodeId = context.nodeId
    const timestamp = new Date(context.timestamp)
    const parentPath = context.parentPath
    
    // Access lifecycle
    const phase = lifecycle.phase
    const isRecovery = lifecycle.phase === 'recovery'
    
    this.logger(\`[\${errorType}] \${errorMessage} at node \${nodeId} (phase: \${phase})\`)
  }
}

const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(console.error))
  .add(new AlertErrorPolicy())
  .build()
\`\`\`

### Policy Builder API

The \`createErrorPolicy\` provides a fluent builder API:

\`\`\`typescript
// Basic usage
const policy = createErrorPolicy.builder()
  .add(new AlertErrorPolicy())
  .build()

// Conditional addition
const policy = createErrorPolicy.builder()
  .add(new LoggingErrorPolicy(logger))
  .addIf(isProduction, new SentryErrorPolicy(sentry))
  .addIf(hasNotification, new NotificationErrorPolicy(notifier))
  .build()

// Add multiple policies at once
const policy = createErrorPolicy.builder()
  .addMany(
    new LoggingErrorPolicy(logger),
    new AlertErrorPolicy(),
    new AnalyticsErrorPolicy(analytics)
  )
  .build()

// Execution options
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({
    execution: 'parallel', // 'sequential' (default) or 'parallel'
    stopOnError: true,     // Stop execution if a policy throws (default: false)
  })
  .build()

// Direct chaining (alternative to builder)
const policy = createErrorPolicy.chain(
  new LoggingErrorPolicy(logger),
  new AlertErrorPolicy(),
  new AnalyticsErrorPolicy(analytics)
)
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
        `}}}},s={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6 space-y-4"},children:[{id:"title",type:"Span",state:{text:"ErrorBoundary Default Behavior"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"Div components are wrapped with ErrorBoundary by default, so errors are isolated. Even if an error occurs in one of the two Divs below, the other Div continues to work normally."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"normal-div",type:"Div",attributes:{className:"p-4 border border-green-300 rounded bg-green-50"},children:[{id:"normal-text",type:"Span",state:{text:"Normal Div - This Div is not affected even if an error occurs"},attributes:{className:"text-green-700"}}]},{id:"error-div",type:"Div",attributes:{className:"p-4 border border-red-300 rounded bg-red-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[e,o]=p.useState(!1),i=()=>{o(!0)};if(e)throw new Error("An error occurred! But other Divs continue to work normally.");return a.jsx("button",{onClick:i,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error"})};return a.jsx(y,{document:n,components:{...m,ErrorButton:r}})},parameters:{docs:{description:{story:`
## Default Error Isolation

Div components are wrapped with ErrorBoundary by default, so when errors occur in child components:

- ✅ **Error Isolation**: Errors in one Div do not affect other Divs
- ✅ **Fallback UI**: Default error messages are displayed when errors occur
- ✅ **App Stability**: The entire app does not crash

In the example above, clicking the "Trigger Error" button will only put that Div in an error state, while the normal Div above continues to work normally.
        `}}}},l={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"AlertErrorPolicy Usage Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"Using ErrorReportingProvider and AlertErrorPolicy, you can display error notifications to users via browser alert when errors occur."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[o,i]=p.useState(!1),t=()=>{i(!0)};if(o)throw new Error("An error occurred due to button click!");return a.jsx("button",{onClick:t,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Show Alert)"})},e=E.builder().add(new g).build();return a.jsx(h,{policy:e,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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
    const { error, context, lifecycle } = situation
    const nodeInfo = context.nodeId ? \` (Node: \${context.nodeId})\` : ''
    const phaseInfo = lifecycle.phase !== 'catch' ? \` [Phase: \${lifecycle.phase}]\` : ''
    return \`Error: \${error.message}\${nodeInfo}\${phaseInfo}\`
  },
})

// Show alert only on catch phase (default: true)
// When true, alerts are shown only when errors are caught
// When false, alerts are shown for all lifecycle phases (mount, update, recovery, etc.)
const policy = new AlertErrorPolicy({
  onlyOnCatch: true, // Only show on 'catch' phase (default)
})

// Show alerts for all phases
const policy = new AlertErrorPolicy({
  onlyOnCatch: false, // Show for all phases: 'catch', 'mount', 'update', 'recovery', 'unmount'
})

// Complete customization example
const policy = new AlertErrorPolicy({
  onlyOnCatch: true,
  formatMessage: (situation) => {
    const { error, context, lifecycle } = situation
    const timestamp = new Date(context.timestamp).toLocaleString()
    const location = context.parentPath?.join(' > ') || 'root'
    
    return [
      \`에러가 발생했습니다\`,
      \`\`,
      \`메시지: \${error.message}\`,
      \`타입: \${error.name}\`,
      \`위치: \${location}\`,
      \`노드: \${context.nodeId || 'N/A'}\`,
      \`단계: \${lifecycle.phase}\`,
      \`시간: \${timestamp}\`,
    ].join('\\n')
  },
})
\`\`\`

#### AlertErrorPolicy Options

- **\`onlyOnCatch\`** (boolean, default: \`true\`):
  - When \`true\`: Only show alerts during the 'catch' phase (when errors are actually caught)
  - When \`false\`: Show alerts for all lifecycle phases (mount, update, recovery, unmount)
  - Recommended: Keep \`true\` to avoid alert spam during normal lifecycle events

- **\`formatMessage\`** (function, optional):
  - Custom function to format the alert message
  - Receives the full \`ErrorSituation\` object
  - Should return a string that will be displayed in the alert
  - Default: Shows error message and node ID
        `}}}},d={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Custom Policy Implementation Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"You can implement custom error handling such as logging, analytics, and notifications by implementing the ErrorPolicy interface."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]},{id:"log-container",type:"Div",attributes:{className:"mt-4 p-4 border border-blue-300 rounded bg-blue-50"},children:[{id:"log-title",type:"Span",state:{text:"Error Log (Check Console):"},attributes:{className:"font-semibold mb-2 block"}},{id:"log-content",type:"Span",state:{text:"Open the browser developer tools console to view error logs."},attributes:{className:"text-sm text-gray-600"}}]}]}},r=()=>{const[i,t]=p.useState(!1),c=()=>{t(!0)};if(i)throw new Error("This error is handled by a custom Policy!");return a.jsx("button",{onClick:c,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Custom Policy)"})};class e{constructor(t){this.logger=t}handleSituation(t){const{error:c,context:f}=t,w=`[${new Date(f.timestamp).toLocaleString()}] Error at ${f.nodeId||"unknown"}: ${c.message}`;this.logger(w)}}const o=E.builder().add(new e(console.error)).add(new g).build();return a.jsx(h,{policy:o,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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

The Policy receives an **ErrorSituation** object with detailed error information:

#### Error Object (\`situation.error\`)

Standard JavaScript Error object with:
- **\`error.message\`**: Error message string
- **\`error.name\`**: Error type ('Error', 'TypeError', 'ReferenceError', etc.)
- **\`error.stack\`**: Stack trace (if available)
- **\`error.cause\`**: Chained error (ES2022+)

Example:
\`\`\`typescript
const errorType = situation.error.name // 'TypeError'
const errorMessage = situation.error.message // 'Cannot read property...'
const stackTrace = situation.error.stack // Full stack trace
\`\`\`

#### ErrorInfo (\`situation.errorInfo\`)

React ErrorInfo (available during catch phase):
- **\`errorInfo.componentStack\`**: Component stack trace showing React component hierarchy

Example:
\`\`\`typescript
if (situation.errorInfo) {
  const componentStack = situation.errorInfo.componentStack
  // Shows which components were in the tree when error occurred
}
\`\`\`

#### Context (\`situation.context\`)

Metadata about where the error occurred:
- **\`context.nodeId\`**: SDUI node ID (string | undefined)
- **\`context.componentName\`**: Component name (default: 'ErrorBoundary')
- **\`context.timestamp\`**: Error timestamp (number, milliseconds)
- **\`context.errorBoundaryId\`**: ErrorBoundary identifier (string | undefined)
- **\`context.parentPath\`**: SDUI hierarchy path (string[] | undefined)
- **\`context.metadata\`**: Custom metadata (Record<string, unknown> | undefined)

Example:
\`\`\`typescript
const { context } = situation
const nodeId = context.nodeId || 'unknown'
const timestamp = new Date(context.timestamp).toISOString()
const location = context.parentPath?.join(' > ') || 'root'
\`\`\`

#### Lifecycle (\`situation.lifecycle\`)

Lifecycle phase and state information:
- **\`lifecycle.phase\`**: Current phase
  - \`'catch'\`: Error caught by componentDidCatch (most common)
  - \`'mount'\`: ErrorBoundary mounted
  - \`'update'\`: State changed from no-error to error
  - \`'recovery'\`: Recovered from error state
  - \`'unmount'\`: Unmounting with error present
- **\`lifecycle.previousState\`**: Previous error state (optional)
- **\`lifecycle.currentState\`**: Current error state

Example:
\`\`\`typescript
const { lifecycle } = situation
const phase = lifecycle.phase // 'catch' | 'mount' | 'update' | 'recovery' | 'unmount'
const isRecovery = phase === 'recovery'
const hadError = lifecycle.previousState?.hasError
const hasError = lifecycle.currentState.hasError
\`\`\`

#### Complete Example

\`\`\`typescript
class ComprehensiveErrorPolicy implements ErrorPolicy {
  handleSituation(situation: ErrorSituation): void {
    // Error details
    const { error, errorInfo, context, lifecycle } = situation
    
    // Error information
    const errorType = error.name
    const errorMessage = error.message
    const stackTrace = error.stack
    
    // Context information
    const nodeId = context.nodeId || 'unknown'
    const timestamp = new Date(context.timestamp).toISOString()
    const location = context.parentPath?.join(' > ') || 'root'
    
    // Lifecycle information
    const phase = lifecycle.phase
    const isRecovery = phase === 'recovery'
    
    // React component stack (if available)
    const componentStack = errorInfo?.componentStack
    
    // Log comprehensive error report
    console.error({
      type: errorType,
      message: errorMessage,
      stack: stackTrace,
      nodeId,
      timestamp,
      location,
      phase,
      isRecovery,
      componentStack,
    })
  }
}
\`\`\`

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
        `}}}},u={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Policy Chaining Example"},attributes:{className:"text-lg font-bold mb-4 block"}},{id:"description",type:"Span",state:{text:"You can chain multiple policies together. The example below handles both logging and Alert simultaneously."},attributes:{className:"text-gray-600 mb-4 block"}},{id:"error-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"error-button",type:"ErrorButton"}]}]}},r=()=>{const[i,t]=p.useState(!1),c=()=>{t(!0)};if(i)throw new Error("This error is handled by chained policies!");return a.jsx("button",{onClick:c,className:"px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600",children:"Trigger Error (Chained)"})};class e{handleSituation(t){console.log("[LoggingPolicy]",t.error.message,t.context.nodeId)}}const o=E.builder().add(new e).add(new g).build();return a.jsx(h,{policy:o,children:a.jsx(y,{document:n,components:{...m,ErrorButton:r}})})},parameters:{docs:{description:{story:`
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

The builder supports various execution options:

\`\`\`typescript
// Sequential execution (default)
// Policies execute one after another, waiting for each to complete
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .build()
// Execution order: policy1 → policy2

// Parallel execution
// All policies execute simultaneously (faster, but no guaranteed order)
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ execution: 'parallel' })
  .build()
// Execution: policy1 || policy2 (simultaneously)

// Stop on error
// If a policy throws an error, stop executing remaining policies
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ stopOnError: true })
  .build()
// If policy1 throws, policy2 won't execute

// Combined options
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .add(policy3)
  .withOptions({
    execution: 'parallel',  // Execute all policies in parallel
    stopOnError: false,      // Continue even if one policy fails (default)
  })
  .build()
\`\`\`

#### Execution Mode Comparison

- **Sequential (\`'sequential'\`)**: 
  - Policies execute in order (policy1 → policy2 → policy3)
  - Each policy waits for the previous one to complete
  - Use when policies depend on each other or need ordered execution
  - Default mode

- **Parallel (\`'parallel'\`)**:
  - All policies execute simultaneously
  - Faster execution, but order is not guaranteed
  - Use when policies are independent
  - If one policy fails, others continue (unless \`stopOnError: true\`)

#### Error Handling in Policies

When a policy's \`handleSituation\` throws an error:

- **\`stopOnError: false\`** (default): 
  - Error is caught and logged
  - Remaining policies continue execution
  - Useful for non-critical policies (e.g., analytics)

- **\`stopOnError: true\`**:
  - Execution stops immediately
  - Remaining policies are not executed
  - Use when policies are critical and failures should be propagated

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
    const { error, context, lifecycle } = situation
    const nodeInfo = context.nodeId ? \\\` (Node: \\\${context.nodeId})\\\` : ''
    const phaseInfo = lifecycle.phase !== 'catch' ? \\\` [Phase: \\\${lifecycle.phase}]\\\` : ''
    return \\\`Error: \\\${error.message}\\\${nodeInfo}\\\${phaseInfo}\\\`
  },
})

// Show alert only on catch phase (default: true)
// When true, alerts are shown only when errors are caught
// When false, alerts are shown for all lifecycle phases (mount, update, recovery, etc.)
const policy = new AlertErrorPolicy({
  onlyOnCatch: true, // Only show on 'catch' phase (default)
})

// Show alerts for all phases
const policy = new AlertErrorPolicy({
  onlyOnCatch: false, // Show for all phases: 'catch', 'mount', 'update', 'recovery', 'unmount'
})

// Complete customization example
const policy = new AlertErrorPolicy({
  onlyOnCatch: true,
  formatMessage: (situation) => {
    const { error, context, lifecycle } = situation
    const timestamp = new Date(context.timestamp).toLocaleString()
    const location = context.parentPath?.join(' > ') || 'root'
    
    return [
      \\\`에러가 발생했습니다\\\`,
      \\\`\\\`,
      \\\`메시지: \\\${error.message}\\\`,
      \\\`타입: \\\${error.name}\\\`,
      \\\`위치: \\\${location}\\\`,
      \\\`노드: \\\${context.nodeId || 'N/A'}\\\`,
      \\\`단계: \\\${lifecycle.phase}\\\`,
      \\\`시간: \\\${timestamp}\\\`,
    ].join('\\\\n')
  },
})
\\\`\\\`\\\`

#### AlertErrorPolicy Options

- **\\\`onlyOnCatch\\\`** (boolean, default: \\\`true\\\`):
  - When \\\`true\\\`: Only show alerts during the 'catch' phase (when errors are actually caught)
  - When \\\`false\\\`: Show alerts for all lifecycle phases (mount, update, recovery, unmount)
  - Recommended: Keep \\\`true\\\` to avoid alert spam during normal lifecycle events

- **\\\`formatMessage\\\`** (function, optional):
  - Custom function to format the alert message
  - Receives the full \\\`ErrorSituation\\\` object
  - Should return a string that will be displayed in the alert
  - Default: Shows error message and node ID
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

The Policy receives an **ErrorSituation** object with detailed error information:

#### Error Object (\\\`situation.error\\\`)

Standard JavaScript Error object with:
- **\\\`error.message\\\`**: Error message string
- **\\\`error.name\\\`**: Error type ('Error', 'TypeError', 'ReferenceError', etc.)
- **\\\`error.stack\\\`**: Stack trace (if available)
- **\\\`error.cause\\\`**: Chained error (ES2022+)

Example:
\\\`\\\`\\\`typescript
const errorType = situation.error.name // 'TypeError'
const errorMessage = situation.error.message // 'Cannot read property...'
const stackTrace = situation.error.stack // Full stack trace
\\\`\\\`\\\`

#### ErrorInfo (\\\`situation.errorInfo\\\`)

React ErrorInfo (available during catch phase):
- **\\\`errorInfo.componentStack\\\`**: Component stack trace showing React component hierarchy

Example:
\\\`\\\`\\\`typescript
if (situation.errorInfo) {
  const componentStack = situation.errorInfo.componentStack
  // Shows which components were in the tree when error occurred
}
\\\`\\\`\\\`

#### Context (\\\`situation.context\\\`)

Metadata about where the error occurred:
- **\\\`context.nodeId\\\`**: SDUI node ID (string | undefined)
- **\\\`context.componentName\\\`**: Component name (default: 'ErrorBoundary')
- **\\\`context.timestamp\\\`**: Error timestamp (number, milliseconds)
- **\\\`context.errorBoundaryId\\\`**: ErrorBoundary identifier (string | undefined)
- **\\\`context.parentPath\\\`**: SDUI hierarchy path (string[] | undefined)
- **\\\`context.metadata\\\`**: Custom metadata (Record<string, unknown> | undefined)

Example:
\\\`\\\`\\\`typescript
const { context } = situation
const nodeId = context.nodeId || 'unknown'
const timestamp = new Date(context.timestamp).toISOString()
const location = context.parentPath?.join(' > ') || 'root'
\\\`\\\`\\\`

#### Lifecycle (\\\`situation.lifecycle\\\`)

Lifecycle phase and state information:
- **\\\`lifecycle.phase\\\`**: Current phase
  - \\\`'catch'\\\`: Error caught by componentDidCatch (most common)
  - \\\`'mount'\\\`: ErrorBoundary mounted
  - \\\`'update'\\\`: State changed from no-error to error
  - \\\`'recovery'\\\`: Recovered from error state
  - \\\`'unmount'\\\`: Unmounting with error present
- **\\\`lifecycle.previousState\\\`**: Previous error state (optional)
- **\\\`lifecycle.currentState\\\`**: Current error state

Example:
\\\`\\\`\\\`typescript
const { lifecycle } = situation
const phase = lifecycle.phase // 'catch' | 'mount' | 'update' | 'recovery' | 'unmount'
const isRecovery = phase === 'recovery'
const hadError = lifecycle.previousState?.hasError
const hasError = lifecycle.currentState.hasError
\\\`\\\`\\\`

#### Complete Example

\\\`\\\`\\\`typescript
class ComprehensiveErrorPolicy implements ErrorPolicy {
  handleSituation(situation: ErrorSituation): void {
    // Error details
    const { error, errorInfo, context, lifecycle } = situation
    
    // Error information
    const errorType = error.name
    const errorMessage = error.message
    const stackTrace = error.stack
    
    // Context information
    const nodeId = context.nodeId || 'unknown'
    const timestamp = new Date(context.timestamp).toISOString()
    const location = context.parentPath?.join(' > ') || 'root'
    
    // Lifecycle information
    const phase = lifecycle.phase
    const isRecovery = phase === 'recovery'
    
    // React component stack (if available)
    const componentStack = errorInfo?.componentStack
    
    // Log comprehensive error report
    console.error({
      type: errorType,
      message: errorMessage,
      stack: stackTrace,
      nodeId,
      timestamp,
      location,
      phase,
      isRecovery,
      componentStack,
    })
  }
}
\\\`\\\`\\\`

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

The builder supports various execution options:

\\\`\\\`\\\`typescript
// Sequential execution (default)
// Policies execute one after another, waiting for each to complete
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .build()
// Execution order: policy1 → policy2

// Parallel execution
// All policies execute simultaneously (faster, but no guaranteed order)
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ execution: 'parallel' })
  .build()
// Execution: policy1 || policy2 (simultaneously)

// Stop on error
// If a policy throws an error, stop executing remaining policies
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .withOptions({ stopOnError: true })
  .build()
// If policy1 throws, policy2 won't execute

// Combined options
const policy = createErrorPolicy.builder()
  .add(policy1)
  .add(policy2)
  .add(policy3)
  .withOptions({
    execution: 'parallel',  // Execute all policies in parallel
    stopOnError: false,      // Continue even if one policy fails (default)
  })
  .build()
\\\`\\\`\\\`

#### Execution Mode Comparison

- **Sequential (\\\`'sequential'\\\`)**: 
  - Policies execute in order (policy1 → policy2 → policy3)
  - Each policy waits for the previous one to complete
  - Use when policies depend on each other or need ordered execution
  - Default mode

- **Parallel (\\\`'parallel'\\\`)**:
  - All policies execute simultaneously
  - Faster execution, but order is not guaranteed
  - Use when policies are independent
  - If one policy fails, others continue (unless \\\`stopOnError: true\\\`)

#### Error Handling in Policies

When a policy's \\\`handleSituation\\\` throws an error:

- **\\\`stopOnError: false\\\`** (default): 
  - Error is caught and logged
  - Remaining policies continue execution
  - Useful for non-critical policies (e.g., analytics)

- **\\\`stopOnError: true\\\`**:
  - Execution stops immediately
  - Remaining policies are not executed
  - Use when policies are critical and failures should be propagated

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
}`,...u.parameters?.docs?.source}}};const T=["DefaultErrorIsolation","WithAlertPolicy","WithCustomPolicy","PolicyChaining"];export{s as DefaultErrorIsolation,u as PolicyChaining,l as WithAlertPolicy,d as WithCustomPolicy,T as __namedExportsOrder,A as default};
