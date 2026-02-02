import{j as t}from"./jsx-runtime-tVlFJ3QW.js";import{R as S}from"./iframe-jcnljCmR.js";import{j as e,k as i,S as p,s as l}from"./sduiComponents-yGOTnp4e.js";import"./preload-helper-ggYluGXI.js";import"./index-BPS7E_Qt.js";import"./index-B4QvPrAh.js";const P={title:"Shared/UI/Tooltip",component:e,tags:["autodocs"],decorators:[n=>t.jsx(i,{delayDuration:0,children:t.jsx(n,{})})],argTypes:{open:{control:"boolean",description:"Controlled open state"},defaultOpen:{control:"boolean",description:"Default open state",table:{defaultValue:{summary:"false"}}},delayDuration:{control:"number",description:"Delay before tooltip opens in ms",table:{defaultValue:{summary:"300"}}}},parameters:{docs:{description:{component:`
## Overview

The **Tooltip** component is a floating, non-actionable label used to explain a user interface element or feature. It follows the Atlassian Design System (ADS) specifications and uses a **compound pattern** for maximum flexibility.

## Compound Pattern

The Tooltip uses a compound component pattern with the following sub-components:

| Component | Description |
|-----------|-------------|
| \`Tooltip.Provider\` | Global configuration provider |
| \`Tooltip.Root\` | Root component managing open state |
| \`Tooltip.Trigger\` | Element that triggers the tooltip |
| \`Tooltip.Portal\` | Portals content to document.body |
| \`Tooltip.Content\` | The tooltip content container |
| \`Tooltip.Arrow\` | Optional arrow indicator |

## Usage Example

\`\`\`tsx
<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger>
      <button>Hover me</button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content side="top">
        Tooltip text
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>
\`\`\`

## Positioning Options

| Side | Description |
|------|-------------|
| \`top\` | Tooltip appears above the trigger (default) |
| \`right\` | Tooltip appears to the right |
| \`bottom\` | Tooltip appears below |
| \`left\` | Tooltip appears to the left |

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Tab & Escape keys)
- ✅ **Accessibility features** built-in (role="tooltip")
- ✅ **Collision avoidance** - auto-flips when near viewport edge
        `}}}},d={render:()=>t.jsx("div",{className:"flex items-center justify-center p-20",children:t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",children:"Hover me"})}),t.jsx(e.Portal,{children:t.jsx(e.Content,{side:"top",children:"Add to library"})})]})}),parameters:{docs:{description:{story:`
## Compound Pattern - Basic Usage

The compound pattern provides explicit control over each part of the tooltip.

### Structure

\`\`\`tsx
<Tooltip.Root>
  <Tooltip.Trigger>...</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>...</Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
\`\`\`
        `}}}},c={render:()=>t.jsxs("div",{className:"flex items-center justify-center p-20 gap-8",children:[t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Top"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",children:["Top tooltip",t.jsx(e.Arrow,{})]})})]}),t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Right"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"right",children:["Right tooltip",t.jsx(e.Arrow,{})]})})]}),t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Bottom"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"bottom",children:["Bottom tooltip",t.jsx(e.Arrow,{})]})})]}),t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Left"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"left",children:["Left tooltip",t.jsx(e.Arrow,{})]})})]})]}),parameters:{docs:{description:{story:`
## Compound Pattern - With Arrow

Use \`Tooltip.Arrow\` inside \`Tooltip.Content\` to add an arrow indicator.

### Example

\`\`\`tsx
<Tooltip.Content side="top">
  Content
  <Tooltip.Arrow />
</Tooltip.Content>
\`\`\`
        `}}}},u={render:()=>t.jsxs("div",{className:"flex items-center justify-center p-20 gap-8",children:[t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-8 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Start Align"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",align:"start",children:["Aligned to start",t.jsx(e.Arrow,{})]})})]}),t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-8 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Center Align"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",align:"center",children:["Aligned to center",t.jsx(e.Arrow,{})]})})]}),t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-8 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"End Align"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",align:"end",children:["Aligned to end",t.jsx(e.Arrow,{})]})})]})]}),parameters:{docs:{description:{story:"\n## Compound Pattern - Alignments\n\nControl alignment using the `align` prop on `Tooltip.Content`.\n\n| Align | Description |\n|-------|-------------|\n| `start` | Aligns to the start |\n| `center` | Centers on trigger (default) |\n| `end` | Aligns to the end |\n        "}}}},m={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-20"},children:[{id:"tooltip-1",type:"Tooltip",state:{content:"Add to library"},children:[{id:"button-1",type:"Button",state:{appearance:"primary"},children:[{id:"text-1",type:"Span",state:{text:"Hover me"}}]}]}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:n,components:l})})},parameters:{docs:{description:{story:`
## SDUI - Basic Usage

Tooltip integrated with SDUI template system.

### Document Structure

\`\`\`json
{
  "id": "tooltip-1",
  "type": "Tooltip",
  "state": { "content": "Add to library" },
  "children": [
    { "id": "button-1", "type": "Button", ... }
  ]
}
\`\`\`
        `}}}},g={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - Side Positions"},attributes:{className:"text-xl font-bold"}},{id:"tooltip-row",type:"Div",attributes:{className:"flex gap-8 items-center justify-center py-12"},children:[{id:"tooltip-top",type:"Tooltip",state:{content:"Tooltip on top",side:"top"},children:[{id:"btn-top",type:"Button",state:{appearance:"default"},children:[{id:"text-top",type:"Span",state:{text:"Top"}}]}]},{id:"tooltip-right",type:"Tooltip",state:{content:"Tooltip on right",side:"right"},children:[{id:"btn-right",type:"Button",state:{appearance:"default"},children:[{id:"text-right",type:"Span",state:{text:"Right"}}]}]},{id:"tooltip-bottom",type:"Tooltip",state:{content:"Tooltip on bottom",side:"bottom"},children:[{id:"btn-bottom",type:"Button",state:{appearance:"default"},children:[{id:"text-bottom",type:"Span",state:{text:"Bottom"}}]}]},{id:"tooltip-left",type:"Tooltip",state:{content:"Tooltip on left",side:"left"},children:[{id:"btn-left",type:"Button",state:{appearance:"default"},children:[{id:"text-left",type:"Span",state:{text:"Left"}}]}]}]}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:n,components:l})})},parameters:{docs:{description:{story:`
## SDUI - Side Positions

All 4 side positions demonstrated with SDUI renderer.

### State Options

\`\`\`json
{
  "content": "Tooltip text",
  "side": "top" | "right" | "bottom" | "left"
}
\`\`\`
        `}}}},x={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - With Arrow"},attributes:{className:"text-xl font-bold"}},{id:"tooltip-row",type:"Div",attributes:{className:"flex gap-8 items-center justify-center py-12"},children:[{id:"tooltip-arrow-top",type:"Tooltip",state:{content:"With arrow",side:"top",showArrow:!0},children:[{id:"btn-arrow-top",type:"Button",state:{appearance:"primary"},children:[{id:"text-arrow-top",type:"Span",state:{text:"Top Arrow"}}]}]},{id:"tooltip-arrow-right",type:"Tooltip",state:{content:"With arrow",side:"right",showArrow:!0},children:[{id:"btn-arrow-right",type:"Button",state:{appearance:"primary"},children:[{id:"text-arrow-right",type:"Span",state:{text:"Right Arrow"}}]}]},{id:"tooltip-arrow-bottom",type:"Tooltip",state:{content:"With arrow",side:"bottom",showArrow:!0},children:[{id:"btn-arrow-bottom",type:"Button",state:{appearance:"primary"},children:[{id:"text-arrow-bottom",type:"Span",state:{text:"Bottom Arrow"}}]}]},{id:"tooltip-arrow-left",type:"Tooltip",state:{content:"With arrow",side:"left",showArrow:!0},children:[{id:"btn-arrow-left",type:"Button",state:{appearance:"primary"},children:[{id:"text-arrow-left",type:"Span",state:{text:"Left Arrow"}}]}]}]}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:n,components:l})})},parameters:{docs:{description:{story:`
## SDUI - With Arrow

Enable arrow indicator using \`showArrow: true\` in state.

### State Options

\`\`\`json
{
  "content": "Tooltip text",
  "side": "top",
  "showArrow": true
}
\`\`\`
        `}}}},y={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - Alignments"},attributes:{className:"text-xl font-bold"}},{id:"tooltip-row",type:"Div",attributes:{className:"flex gap-8 items-center justify-center py-12"},children:[{id:"tooltip-start",type:"Tooltip",state:{content:"Aligned to start",side:"top",align:"start",showArrow:!0},children:[{id:"btn-start",type:"Button",state:{appearance:"default"},children:[{id:"text-start",type:"Span",state:{text:"Start Align"}}]}]},{id:"tooltip-center",type:"Tooltip",state:{content:"Aligned to center",side:"top",align:"center",showArrow:!0},children:[{id:"btn-center",type:"Button",state:{appearance:"default"},children:[{id:"text-center",type:"Span",state:{text:"Center Align"}}]}]},{id:"tooltip-end",type:"Tooltip",state:{content:"Aligned to end",side:"top",align:"end",showArrow:!0},children:[{id:"btn-end",type:"Button",state:{appearance:"default"},children:[{id:"text-end",type:"Span",state:{text:"End Align"}}]}]}]}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:n,components:l})})},parameters:{docs:{description:{story:`
## SDUI - Alignments

Control alignment using the \`align\` property in state.

### State Options

\`\`\`json
{
  "content": "Tooltip text",
  "side": "top",
  "align": "start" | "center" | "end"
}
\`\`\`
        `}}}},h={render:()=>{const a={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - With Button Appearances"},attributes:{className:"text-xl font-bold"}},{id:"tooltip-row",type:"Div",attributes:{className:"flex flex-wrap gap-4 items-center justify-center py-8"},children:["default","primary","subtle","warning","danger"].map(o=>({id:`tooltip-${o}`,type:"Tooltip",state:{content:`${o.charAt(0).toUpperCase()+o.slice(1)} button tooltip`,side:"top",showArrow:!0},children:[{id:`btn-${o}`,type:"Button",state:{appearance:o},children:[{id:`text-${o}`,type:"Span",state:{text:o.charAt(0).toUpperCase()+o.slice(1)}}]}]}))}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:a,components:l})})},parameters:{docs:{description:{story:`
## SDUI - With Button Appearances

Tooltips combined with all 5 button appearance variants.

### Integration Example

Tooltip wraps any child component (Button, Icon, etc.) as its trigger.
        `}}}},b={render:()=>{const n=["top","right","bottom","left"],a=["start","center","end"],o={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-8 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - Complete Matrix (12 Combinations)"},attributes:{className:"text-2xl font-bold"}},{id:"subtitle",type:"Span",state:{text:"4 Sides × 3 Alignments = 12 Positions"},attributes:{className:"text-sm text-gray-600"}},...n.map(r=>({id:`section-${r}`,type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:`section-title-${r}`,type:"Span",state:{text:`Side: ${r.charAt(0).toUpperCase()+r.slice(1)}`},attributes:{className:"text-lg font-semibold"}},{id:`buttons-${r}`,type:"Div",attributes:{className:"flex gap-4 items-center justify-center py-8"},children:a.map(s=>({id:`tooltip-${r}-${s}`,type:"Tooltip",state:{content:`${r} / ${s}`,side:r,align:s,showArrow:!0},children:[{id:`btn-${r}-${s}`,type:"Button",state:{appearance:"default"},children:[{id:`text-${r}-${s}`,type:"Span",state:{text:s.charAt(0).toUpperCase()+s.slice(1)}}]}]}))}]}))]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:o,components:l})})},parameters:{docs:{description:{story:`
## SDUI - Complete Position Matrix

All 12 combinations of side (4) × align (3) demonstrated with SDUI renderer.

### Matrix Overview

| Side \\ Align | Start | Center | End |
|---------------|-------|--------|-----|
| Top | ✓ | ✓ | ✓ |
| Right | ✓ | ✓ | ✓ |
| Bottom | ✓ | ✓ | ✓ |
| Left | ✓ | ✓ | ✓ |
        `}}}},T={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"SDUI Tooltip - Real World Example"},attributes:{className:"text-xl font-bold"}},{id:"card",type:"Card",attributes:{className:"p-6 max-w-md"},children:[{id:"card-header",type:"Div",attributes:{className:"flex items-center justify-between mb-4"},children:[{id:"card-title",type:"Span",state:{text:"Project Actions"},attributes:{className:"text-lg font-semibold"}},{id:"tooltip-info",type:"Tooltip",state:{content:"Click actions to manage your project",side:"left"},children:[{id:"info-button",type:"Button",state:{appearance:"subtle",spacing:"compact"},children:[{id:"info-text",type:"Span",state:{text:"?"}}]}]}]},{id:"actions-row",type:"Div",attributes:{className:"flex gap-2"},children:[{id:"tooltip-add",type:"Tooltip",state:{content:"Add new item",side:"bottom",showArrow:!0},children:[{id:"add-button",type:"Button",state:{appearance:"primary"},children:[{id:"add-text",type:"Span",state:{text:"+"}}]}]},{id:"tooltip-edit",type:"Tooltip",state:{content:"Edit selected",side:"bottom",showArrow:!0},children:[{id:"edit-button",type:"Button",state:{appearance:"default"},children:[{id:"edit-text",type:"Span",state:{text:"Edit"}}]}]},{id:"tooltip-save",type:"Tooltip",state:{content:"Save changes",side:"bottom",showArrow:!0},children:[{id:"save-button",type:"Button",state:{appearance:"primary"},children:[{id:"save-text",type:"Span",state:{text:"Save"}}]}]},{id:"tooltip-delete",type:"Tooltip",state:{content:"Delete item (cannot be undone)",side:"bottom",showArrow:!0},children:[{id:"delete-button",type:"Button",state:{appearance:"danger"},children:[{id:"delete-text",type:"Span",state:{text:"Delete"}}]}]}]}]}]}};return t.jsx(i,{delayDuration:0,children:t.jsx(p,{document:n,components:l})})},parameters:{docs:{description:{story:`
## SDUI - Real World Example

A practical example showing tooltips in a card-based action panel.

### Use Cases

- **Action buttons**: Explain button functions
- **Help icons**: Provide context without cluttering UI
- **Danger actions**: Warn users about destructive operations
        `}}}},f={render:()=>{const[n,a]=S.useState(!1);return t.jsxs("div",{className:"flex flex-col items-center justify-center p-20 gap-4",children:[t.jsxs("div",{className:"flex gap-2",children:[t.jsx("button",{className:"px-3 py-1 bg-green-500 text-white rounded text-sm",onClick:()=>a(!0),children:"Open"}),t.jsx("button",{className:"px-3 py-1 bg-red-500 text-white rounded text-sm",onClick:()=>a(!1),children:"Close"})]}),t.jsxs(e.Root,{open:n,onOpenChange:a,children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-gray-200 rounded hover:bg-gray-300",children:"Controlled Tooltip"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",children:["Controlled via external state",t.jsx(e.Arrow,{})]})})]}),t.jsxs("p",{className:"text-sm text-gray-600",children:["Current state: ",n?"Open":"Closed"]})]})},parameters:{docs:{description:{story:`
## Controlled Mode

Use \`open\` and \`onOpenChange\` props for external state control.

### Use Cases

- Programmatic tooltip control
- Multi-step tutorials
- Conditional display
        `}}}},w={render:()=>t.jsxs("div",{className:"flex flex-col gap-6 p-8",children:[t.jsx("h2",{className:"text-xl font-bold",children:"Accessibility Features"}),t.jsx("div",{className:"flex gap-4 items-center",children:t.jsxs(e.Root,{children:[t.jsx(e.Trigger,{children:t.jsx("button",{className:"px-4 py-2 bg-blue-500 text-white rounded focus:ring-2 focus:ring-blue-300 focus:outline-none",children:"Focus me (Tab)"})}),t.jsx(e.Portal,{children:t.jsxs(e.Content,{side:"top",children:["Press Escape to close",t.jsx(e.Arrow,{})]})})]})}),t.jsxs("div",{className:"text-sm text-gray-600 space-y-1",children:[t.jsxs("p",{children:[t.jsx("strong",{children:"Tab:"})," Opens tooltip when trigger receives focus"]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Escape:"})," Closes tooltip"]}),t.jsxs("p",{children:[t.jsx("strong",{children:"Role:"})," tooltip (ARIA role)"]})]})]}),parameters:{docs:{description:{story:`
## Accessibility

Built-in accessibility features:

### Keyboard Navigation
- **Tab**: Focus trigger to show tooltip
- **Escape**: Close tooltip

### ARIA Attributes
- \`role="tooltip"\` on content
- Proper focus management

### Screen Reader Support
- Content announced when shown
- Supports NVDA, JAWS, VoiceOver
        `}}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-20">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Hover me
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top">
            Add to library
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Compound Pattern - Basic Usage

The compound pattern provides explicit control over each part of the tooltip.

### Structure

\\\`\\\`\\\`tsx
<Tooltip.Root>
  <Tooltip.Trigger>...</Tooltip.Trigger>
  <Tooltip.Portal>
    <Tooltip.Content>...</Tooltip.Content>
  </Tooltip.Portal>
</Tooltip.Root>
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-20 gap-8">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Top</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top">
            Top tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Right</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="right">
            Right tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Bottom</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="bottom">
            Bottom tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Left</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="left">
            Left tooltip
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Compound Pattern - With Arrow

Use \\\`Tooltip.Arrow\\\` inside \\\`Tooltip.Content\\\` to add an arrow indicator.

### Example

\\\`\\\`\\\`tsx
<Tooltip.Content side="top">
  Content
  <Tooltip.Arrow />
</Tooltip.Content>
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-20 gap-8">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-8 py-2 bg-gray-200 rounded hover:bg-gray-300">Start Align</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" align="start">
            Aligned to start
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-8 py-2 bg-gray-200 rounded hover:bg-gray-300">Center Align</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" align="center">
            Aligned to center
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button className="px-8 py-2 bg-gray-200 rounded hover:bg-gray-300">End Align</button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" align="end">
            Aligned to end
            <Tooltip.Arrow />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Compound Pattern - Alignments

Control alignment using the \\\`align\\\` prop on \\\`Tooltip.Content\\\`.

| Align | Description |
|-------|-------------|
| \\\`start\\\` | Aligns to the start |
| \\\`center\\\` | Centers on trigger (default) |
| \\\`end\\\` | Aligns to the end |
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-20'
        },
        children: [{
          id: 'tooltip-1',
          type: 'Tooltip',
          state: {
            content: 'Add to library'
          },
          children: [{
            id: 'button-1',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text-1',
              type: 'Span',
              state: {
                text: 'Hover me'
              }
            }]
          }]
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - Basic Usage

Tooltip integrated with SDUI template system.

### Document Structure

\\\`\\\`\\\`json
{
  "id": "tooltip-1",
  "type": "Tooltip",
  "state": { "content": "Add to library" },
  "children": [
    { "id": "button-1", "type": "Button", ... }
  ]
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - Side Positions'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'tooltip-row',
          type: 'Div',
          attributes: {
            className: 'flex gap-8 items-center justify-center py-12'
          },
          children: [{
            id: 'tooltip-top',
            type: 'Tooltip',
            state: {
              content: 'Tooltip on top',
              side: 'top'
            },
            children: [{
              id: 'btn-top',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-top',
                type: 'Span',
                state: {
                  text: 'Top'
                }
              }]
            }]
          }, {
            id: 'tooltip-right',
            type: 'Tooltip',
            state: {
              content: 'Tooltip on right',
              side: 'right'
            },
            children: [{
              id: 'btn-right',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-right',
                type: 'Span',
                state: {
                  text: 'Right'
                }
              }]
            }]
          }, {
            id: 'tooltip-bottom',
            type: 'Tooltip',
            state: {
              content: 'Tooltip on bottom',
              side: 'bottom'
            },
            children: [{
              id: 'btn-bottom',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-bottom',
                type: 'Span',
                state: {
                  text: 'Bottom'
                }
              }]
            }]
          }, {
            id: 'tooltip-left',
            type: 'Tooltip',
            state: {
              content: 'Tooltip on left',
              side: 'left'
            },
            children: [{
              id: 'btn-left',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-left',
                type: 'Span',
                state: {
                  text: 'Left'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - Side Positions

All 4 side positions demonstrated with SDUI renderer.

### State Options

\\\`\\\`\\\`json
{
  "content": "Tooltip text",
  "side": "top" | "right" | "bottom" | "left"
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - With Arrow'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'tooltip-row',
          type: 'Div',
          attributes: {
            className: 'flex gap-8 items-center justify-center py-12'
          },
          children: [{
            id: 'tooltip-arrow-top',
            type: 'Tooltip',
            state: {
              content: 'With arrow',
              side: 'top',
              showArrow: true
            },
            children: [{
              id: 'btn-arrow-top',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'text-arrow-top',
                type: 'Span',
                state: {
                  text: 'Top Arrow'
                }
              }]
            }]
          }, {
            id: 'tooltip-arrow-right',
            type: 'Tooltip',
            state: {
              content: 'With arrow',
              side: 'right',
              showArrow: true
            },
            children: [{
              id: 'btn-arrow-right',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'text-arrow-right',
                type: 'Span',
                state: {
                  text: 'Right Arrow'
                }
              }]
            }]
          }, {
            id: 'tooltip-arrow-bottom',
            type: 'Tooltip',
            state: {
              content: 'With arrow',
              side: 'bottom',
              showArrow: true
            },
            children: [{
              id: 'btn-arrow-bottom',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'text-arrow-bottom',
                type: 'Span',
                state: {
                  text: 'Bottom Arrow'
                }
              }]
            }]
          }, {
            id: 'tooltip-arrow-left',
            type: 'Tooltip',
            state: {
              content: 'With arrow',
              side: 'left',
              showArrow: true
            },
            children: [{
              id: 'btn-arrow-left',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'text-arrow-left',
                type: 'Span',
                state: {
                  text: 'Left Arrow'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - With Arrow

Enable arrow indicator using \\\`showArrow: true\\\` in state.

### State Options

\\\`\\\`\\\`json
{
  "content": "Tooltip text",
  "side": "top",
  "showArrow": true
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - Alignments'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'tooltip-row',
          type: 'Div',
          attributes: {
            className: 'flex gap-8 items-center justify-center py-12'
          },
          children: [{
            id: 'tooltip-start',
            type: 'Tooltip',
            state: {
              content: 'Aligned to start',
              side: 'top',
              align: 'start',
              showArrow: true
            },
            children: [{
              id: 'btn-start',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-start',
                type: 'Span',
                state: {
                  text: 'Start Align'
                }
              }]
            }]
          }, {
            id: 'tooltip-center',
            type: 'Tooltip',
            state: {
              content: 'Aligned to center',
              side: 'top',
              align: 'center',
              showArrow: true
            },
            children: [{
              id: 'btn-center',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-center',
                type: 'Span',
                state: {
                  text: 'Center Align'
                }
              }]
            }]
          }, {
            id: 'tooltip-end',
            type: 'Tooltip',
            state: {
              content: 'Aligned to end',
              side: 'top',
              align: 'end',
              showArrow: true
            },
            children: [{
              id: 'btn-end',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'text-end',
                type: 'Span',
                state: {
                  text: 'End Align'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - Alignments

Control alignment using the \\\`align\\\` property in state.

### State Options

\\\`\\\`\\\`json
{
  "content": "Tooltip text",
  "side": "top",
  "align": "start" | "center" | "end"
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...y.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const appearances = ['default', 'primary', 'subtle', 'warning', 'danger'] as const;
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - With Button Appearances'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'tooltip-row',
          type: 'Div',
          attributes: {
            className: 'flex flex-wrap gap-4 items-center justify-center py-8'
          },
          children: appearances.map(appearance => ({
            id: \`tooltip-\${appearance}\`,
            type: 'Tooltip',
            state: {
              content: \`\${appearance.charAt(0).toUpperCase() + appearance.slice(1)} button tooltip\`,
              side: 'top',
              showArrow: true
            },
            children: [{
              id: \`btn-\${appearance}\`,
              type: 'Button',
              state: {
                appearance
              },
              children: [{
                id: \`text-\${appearance}\`,
                type: 'Span',
                state: {
                  text: appearance.charAt(0).toUpperCase() + appearance.slice(1)
                }
              }]
            }]
          }))
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - With Button Appearances

Tooltips combined with all 5 button appearance variants.

### Integration Example

Tooltip wraps any child component (Button, Icon, etc.) as its trigger.
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const sides = ['top', 'right', 'bottom', 'left'] as const;
    const aligns = ['start', 'center', 'end'] as const;
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-8 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - Complete Matrix (12 Combinations)'
          },
          attributes: {
            className: 'text-2xl font-bold'
          }
        }, {
          id: 'subtitle',
          type: 'Span',
          state: {
            text: '4 Sides × 3 Alignments = 12 Positions'
          },
          attributes: {
            className: 'text-sm text-gray-600'
          }
        }, ...sides.map(side => ({
          id: \`section-\${side}\`,
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-4'
          },
          children: [{
            id: \`section-title-\${side}\`,
            type: 'Span',
            state: {
              text: \`Side: \${side.charAt(0).toUpperCase() + side.slice(1)}\`
            },
            attributes: {
              className: 'text-lg font-semibold'
            }
          }, {
            id: \`buttons-\${side}\`,
            type: 'Div',
            attributes: {
              className: 'flex gap-4 items-center justify-center py-8'
            },
            children: aligns.map(align => ({
              id: \`tooltip-\${side}-\${align}\`,
              type: 'Tooltip',
              state: {
                content: \`\${side} / \${align}\`,
                side,
                align,
                showArrow: true
              },
              children: [{
                id: \`btn-\${side}-\${align}\`,
                type: 'Button',
                state: {
                  appearance: 'default'
                },
                children: [{
                  id: \`text-\${side}-\${align}\`,
                  type: 'Span',
                  state: {
                    text: align.charAt(0).toUpperCase() + align.slice(1)
                  }
                }]
              }]
            }))
          }]
        }))]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - Complete Position Matrix

All 12 combinations of side (4) × align (3) demonstrated with SDUI renderer.

### Matrix Overview

| Side \\\\ Align | Start | Center | End |
|---------------|-------|--------|-----|
| Top | ✓ | ✓ | ✓ |
| Right | ✓ | ✓ | ✓ |
| Bottom | ✓ | ✓ | ✓ |
| Left | ✓ | ✓ | ✓ |
        \`
      }
    }
  }
}`,...b.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Tooltip - Real World Example'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'card',
          type: 'Card',
          attributes: {
            className: 'p-6 max-w-md'
          },
          children: [{
            id: 'card-header',
            type: 'Div',
            attributes: {
              className: 'flex items-center justify-between mb-4'
            },
            children: [{
              id: 'card-title',
              type: 'Span',
              state: {
                text: 'Project Actions'
              },
              attributes: {
                className: 'text-lg font-semibold'
              }
            }, {
              id: 'tooltip-info',
              type: 'Tooltip',
              state: {
                content: 'Click actions to manage your project',
                side: 'left'
              },
              children: [{
                id: 'info-button',
                type: 'Button',
                state: {
                  appearance: 'subtle',
                  spacing: 'compact'
                },
                children: [{
                  id: 'info-text',
                  type: 'Span',
                  state: {
                    text: '?'
                  }
                }]
              }]
            }]
          }, {
            id: 'actions-row',
            type: 'Div',
            attributes: {
              className: 'flex gap-2'
            },
            children: [{
              id: 'tooltip-add',
              type: 'Tooltip',
              state: {
                content: 'Add new item',
                side: 'bottom',
                showArrow: true
              },
              children: [{
                id: 'add-button',
                type: 'Button',
                state: {
                  appearance: 'primary'
                },
                children: [{
                  id: 'add-text',
                  type: 'Span',
                  state: {
                    text: '+'
                  }
                }]
              }]
            }, {
              id: 'tooltip-edit',
              type: 'Tooltip',
              state: {
                content: 'Edit selected',
                side: 'bottom',
                showArrow: true
              },
              children: [{
                id: 'edit-button',
                type: 'Button',
                state: {
                  appearance: 'default'
                },
                children: [{
                  id: 'edit-text',
                  type: 'Span',
                  state: {
                    text: 'Edit'
                  }
                }]
              }]
            }, {
              id: 'tooltip-save',
              type: 'Tooltip',
              state: {
                content: 'Save changes',
                side: 'bottom',
                showArrow: true
              },
              children: [{
                id: 'save-button',
                type: 'Button',
                state: {
                  appearance: 'primary'
                },
                children: [{
                  id: 'save-text',
                  type: 'Span',
                  state: {
                    text: 'Save'
                  }
                }]
              }]
            }, {
              id: 'tooltip-delete',
              type: 'Tooltip',
              state: {
                content: 'Delete item (cannot be undone)',
                side: 'bottom',
                showArrow: true
              },
              children: [{
                id: 'delete-button',
                type: 'Button',
                state: {
                  appearance: 'danger'
                },
                children: [{
                  id: 'delete-text',
                  type: 'Span',
                  state: {
                    text: 'Delete'
                  }
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <TooltipProvider delayDuration={0}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </TooltipProvider>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI - Real World Example

A practical example showing tooltips in a card-based action panel.

### Use Cases

- **Action buttons**: Explain button functions
- **Help icons**: Provide context without cluttering UI
- **Danger actions**: Warn users about destructive operations
        \`
      }
    }
  }
}`,...T.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [open, setOpen] = React.useState(false);
    return <div className="flex flex-col items-center justify-center p-20 gap-4">
        <div className="flex gap-2">
          <button className="px-3 py-1 bg-green-500 text-white rounded text-sm" onClick={() => setOpen(true)}>
            Open
          </button>
          <button className="px-3 py-1 bg-red-500 text-white rounded text-sm" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
        <Tooltip.Root open={open} onOpenChange={setOpen}>
          <Tooltip.Trigger>
            <button className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">
              Controlled Tooltip
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="top">
              Controlled via external state
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
        <p className="text-sm text-gray-600">Current state: {open ? 'Open' : 'Closed'}</p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Controlled Mode

Use \\\`open\\\` and \\\`onOpenChange\\\` props for external state control.

### Use Cases

- Programmatic tooltip control
- Multi-step tutorials
- Conditional display
        \`
      }
    }
  }
}`,...f.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 p-8">
      <h2 className="text-xl font-bold">Accessibility Features</h2>
      <div className="flex gap-4 items-center">
        <Tooltip.Root>
          <Tooltip.Trigger>
            <button className="px-4 py-2 bg-blue-500 text-white rounded focus:ring-2 focus:ring-blue-300 focus:outline-none">
              Focus me (Tab)
            </button>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="top">
              Press Escape to close
              <Tooltip.Arrow />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </div>
      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <strong>Tab:</strong> Opens tooltip when trigger receives focus
        </p>
        <p>
          <strong>Escape:</strong> Closes tooltip
        </p>
        <p>
          <strong>Role:</strong> tooltip (ARIA role)
        </p>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Accessibility

Built-in accessibility features:

### Keyboard Navigation
- **Tab**: Focus trigger to show tooltip
- **Escape**: Close tooltip

### ARIA Attributes
- \\\`role="tooltip"\\\` on content
- Proper focus management

### Screen Reader Support
- Content announced when shown
- Supports NVDA, JAWS, VoiceOver
        \`
      }
    }
  }
}`,...w.parameters?.docs?.source}}};const R=["CompoundPatternBasic","CompoundPatternWithArrow","CompoundPatternAlignments","SduiBasic","SduiSidePositions","SduiWithArrow","SduiAlignments","SduiButtonAppearances","SduiCompleteMatrix","SduiRealWorldExample","SduiControlledMode","Accessibility"];export{w as Accessibility,u as CompoundPatternAlignments,d as CompoundPatternBasic,c as CompoundPatternWithArrow,y as SduiAlignments,m as SduiBasic,h as SduiButtonAppearances,b as SduiCompleteMatrix,f as SduiControlledMode,T as SduiRealWorldExample,g as SduiSidePositions,x as SduiWithArrow,R as __namedExportsOrder,P as default};
