import{j as t}from"./jsx-runtime-D3vVTwfV.js";import{r as f,R as G}from"./iframe-CgFUUG19.js";import{u as q,d as Z,e as x,S as c,s as u}from"./sduiComponents-BGkBxpaZ.js";import"./preload-helper-ggYluGXI.js";import"./index-D1eDAnL8.js";import"./index-9Gwk3rus.js";function ee(e,n){const a=Z(),i=G.useRef(null),p=G.useRef(null),g=f.useSyncExternalStore(d=>{const r=e.map(o=>a.subscribeNode(o,d)),s=a.subscribeVersion(d);return()=>{r.forEach(o=>o()),s()}},()=>{const d=a.getSnapshot(),r=e.map(o=>d[o]||"none"),s=e.join(",");return i.current&&i.current.nodeIdsKey===s&&i.current.values.length===r.length&&i.current.values.every((o,S)=>o===r[S])?i.current.values:(i.current={nodeIdsKey:s,values:r},r)},()=>{const d=e.join(",");if(p.current&&p.current.nodeIdsKey===d)return p.current.values;const r=a.getServerSnapshot(),s=e.map(o=>r[o]||"none");return p.current={nodeIdsKey:d,values:s},s}),{nodes:m}=a.state,b=f.useMemo(()=>g.join(":"),[g]);return f.useMemo(()=>e.map(d=>{const r=m[d],s=r?.childrenIds||[],o=r?.state||{},S=r?.attributes,Y=r?.reference;let _;if(n){const $=n.safeParse(o);if(!$.success)throw new Error(`State validation failed for referenced node "${d}": ${$.error.message}`);_=$.data}else _=o;return{node:r,type:r?.type,state:_,childrenIds:s,attributes:S,reference:Y,exists:!!r}}),[e,m,n,b])}function J(e){const{nodeId:n,schema:a}=e,{reference:i}=q({nodeId:n}),p=f.useMemo(()=>i?Array.isArray(i)?i:[i]:[],[i]),g=ee(p,a),{referencedNodes:m,referencedNodesMap:b}=f.useMemo(()=>{const d=g.map((s,o)=>({id:p[o],node:s.node,type:s.type,state:s.state,attributes:s.attributes,exists:s.exists})),r={};return d.forEach(s=>{r[s.id]=s}),{referencedNodes:d,referencedNodesMap:r}},[g,p]);return{referencedNodes:m,referencedNodesMap:b,reference:i,hasReference:p.length>0}}const Q=({id:e})=>{const{attributes:n}=q({nodeId:e}),{referencedNodes:a,hasReference:i}=J({nodeId:e}),p=n?.className,g=n?.prefix,m=n?.suffix,b=n?.options;if(!i||a.length===0)return t.jsx("span",{className:p,"data-node-id":e,children:"No reference"});const d=a[0],r=d?.state?.selectedId,s=d?.state?.selectedIds;let o="";return s&&s.length>0?b?o=s.map(S=>b.find(Y=>Y.id===S)?.label||S).join(", "):o=s.join(", "):r?b?o=b.find(S=>S.id===r)?.label||r:o=r:o="None",t.jsxs("span",{className:p,"data-node-id":e,children:[g,o,m]})};Q.displayName="ReferenceText";const X=({id:e})=>{const{attributes:n}=q({nodeId:e}),{referencedNodes:a,hasReference:i}=J({nodeId:e}),p=n?.className,g=n?.optionsMap;return i?t.jsx("div",{className:p,"data-node-id":e,children:a.map((m,b)=>{const d=m?.state?.selectedId,s=g?.[m.id]?.find(o=>o.id===d)?.label||d||"None";return t.jsxs("div",{children:[t.jsxs("span",{className:"text-gray-500",children:[m.id,":"]})," ",t.jsx("span",{className:"font-medium",children:s})]},m.id||b)})}):t.jsx("div",{className:p,"data-node-id":e,children:"No references configured"})};X.displayName="ReferenceDisplay";const h={...u,ReferenceText:e=>t.jsx(Q,{id:e}),ReferenceDisplay:e=>t.jsx(X,{id:e})},ie={title:"Shared/UI/Dropdown",component:x,tags:["autodocs"],argTypes:{appearance:{control:"select",options:["default","primary","subtle"],description:"Trigger button appearance",table:{defaultValue:{summary:"default"}}},spacing:{control:"select",options:["default","compact","cozy"],description:"Dropdown spacing/size",table:{defaultValue:{summary:"default"}}},placement:{control:"select",options:["bottom-start","bottom-end","bottom","top-start","top-end","top","left","right"],description:"Menu placement relative to trigger",table:{defaultValue:{summary:"bottom-start"}}},isDisabled:{control:"boolean",description:"Whether the dropdown is disabled",table:{defaultValue:{summary:"false"}}},isMultiSelect:{control:"boolean",description:"Enable multi-selection with checkboxes",table:{defaultValue:{summary:"false"}}},triggerLabel:{control:"text",description:"Label displayed on trigger button"}},parameters:{docs:{description:{component:`
## Overview

The **DropdownMenu** component follows the Atlassian Design System (ADS) specifications. It provides a menu of options triggered by a button.

## Appearance Variants

| Appearance | Description | Use Case |
|------------|-------------|----------|
| \`default\` | Neutral button with border | Standard dropdowns |
| \`primary\` | Brand blue filled button | Primary actions |
| \`subtle\` | Transparent button, no border | Inline/compact use |

## Spacing Options

| Spacing | Trigger Height | Description |
|---------|----------------|-------------|
| \`default\` | 32px | Standard size |
| \`compact\` | 24px | Compact/dense UIs |
| \`cozy\` | 32px | Alias for default |

## Selection Modes

- **Single Select**: One option at a time (default)
- **Multi Select**: Multiple options with checkboxes

## Features

- Keyboard navigation (Arrow keys, Enter, Escape)
- Focus management
- ARIA attributes for accessibility
- SDUI template integration
        `}}}},l=[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}],w=[{id:"open",label:"Open"},{id:"in-progress",label:"In Progress"},{id:"review",label:"In Review"},{id:"done",label:"Done"},{id:"closed",label:"Closed"}],y=[{id:"highest",label:"Highest"},{id:"high",label:"High"},{id:"medium",label:"Medium"},{id:"low",label:"Low"},{id:"lowest",label:"Lowest"}],D={args:{triggerLabel:"Select option",appearance:"default",spacing:"default",placement:"bottom-start",isDisabled:!1,isMultiSelect:!1,options:l},render:e=>{const[n,a]=f.useState(),[i,p]=f.useState([]);return t.jsx(x,{...e,selectedId:n,selectedIds:i,onSelect:a,onSelectionChange:p})},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different dropdown configurations.

### Available Controls

- **appearance**: default, primary, subtle
- **spacing**: default, compact, cozy
- **placement**: bottom-start, bottom-end, top-start, etc.
- **isDisabled**: Enable/disable the dropdown
- **isMultiSelect**: Enable checkbox multi-selection
- **triggerLabel**: Customize trigger button text
        `}}}},v={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-default",type:"Dropdown",attributes:{triggerLabel:"Default",appearance:"default",options:l},state:{selectedId:"1"}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Default Appearance

Neutral button with border. Standard dropdown trigger style.

### Characteristics
- Transparent background with border
- Uses \`--color-border-default\` for border
- \`--color-text-default\` for text color
        `}}}},N={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-primary",type:"Dropdown",attributes:{triggerLabel:"Primary",appearance:"primary",options:l},state:{selectedId:"1"}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Primary Appearance

Brand blue filled button trigger. Use when dropdown is a primary action.

### Characteristics
- Solid brand blue background
- White text for contrast
- Higher visual emphasis
        `}}}},I={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-subtle",type:"Dropdown",attributes:{triggerLabel:"Subtle",appearance:"subtle",options:l},state:{selectedId:"1"}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Subtle Appearance

Transparent button without border. Minimal visual footprint.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for inline/compact scenarios
        `}}}},L={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-1",type:"Dropdown",attributes:{triggerLabel:"Default",appearance:"default",options:l},state:{selectedId:"1"}},{id:"dropdown-2",type:"Dropdown",attributes:{triggerLabel:"Primary",appearance:"primary",options:l},state:{selectedId:"2"}},{id:"dropdown-3",type:"Dropdown",attributes:{triggerLabel:"Subtle",appearance:"subtle",options:l},state:{selectedId:"3"}}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## All Appearances Comparison

Side-by-side comparison of all appearance variants.
        `}}}},R={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-spacing-default",type:"Dropdown",attributes:{triggerLabel:"Default Spacing (32px)",spacing:"default",options:l}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Default Spacing

Standard trigger height (32px). Suitable for most use cases.
        `}}}},M={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-spacing-compact",type:"Dropdown",attributes:{triggerLabel:"Compact Spacing (24px)",spacing:"compact",options:l}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Compact Spacing

Smaller trigger height (24px). Use in dense UIs or tables.
        `}}}},O={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-default-spacing",type:"Dropdown",attributes:{triggerLabel:"Default",spacing:"default",options:l}},{id:"dropdown-compact-spacing",type:"Dropdown",attributes:{triggerLabel:"Compact",spacing:"compact",options:l}}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## All Spacings Comparison

Side-by-side comparison of spacing variants.
        `}}}},k={render:()=>{const e=()=>{const[n,a]=f.useState("open");return t.jsxs("div",{className:"space-y-2",children:[t.jsxs("p",{className:"text-sm text-gray-600",children:["Selected: ",n||"None"]}),t.jsx(x,{triggerLabel:"Select Status",options:w,selectedId:n,onSelect:a})]})};return t.jsx(e,{})},parameters:{docs:{description:{story:`
## Single Select Mode

Default selection mode. Only one option can be selected at a time.

- Selected option shows a checkmark
- Clicking an option selects it and closes the menu
        `}}}},C={render:()=>{const e=()=>{const[n,a]=f.useState(["high","medium"]);return t.jsxs("div",{className:"space-y-2",children:[t.jsxs("p",{className:"text-sm text-gray-600",children:["Selected: ",n.join(", ")||"None"]}),t.jsx(x,{triggerLabel:"Select Priorities",options:y,isMultiSelect:!0,selectedIds:n,onSelectionChange:a})]})};return t.jsx(e,{})},parameters:{docs:{description:{story:`
## Multi Select Mode

Enable \`isMultiSelect\` for checkbox-based multi-selection.

- Each option has a checkbox
- Multiple options can be selected
- Menu stays open for additional selections
        `}}}},T={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-single",type:"Dropdown",attributes:{triggerLabel:"Select Status",options:w},state:{selectedId:"in-progress"}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Single Select (SDUI)

SDUI document example for single selection dropdown.
        `}}}},A={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-multi",type:"Dropdown",attributes:{triggerLabel:"Select Priorities",isMultiSelect:!0,options:y},state:{selectedIds:["high","medium"]}}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Multi Select (SDUI)

SDUI document example for multi-selection dropdown with checkboxes.
        `}}}},j={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-enabled",type:"Dropdown",attributes:{triggerLabel:"Enabled",options:l}},{id:"dropdown-disabled",type:"Dropdown",attributes:{triggerLabel:"Disabled",isDisabled:!0,options:l}}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Disabled State

Comparison of enabled and disabled dropdown triggers.
        `}}}},U={render:()=>{const n={version:"1.0.0",root:{id:"dropdown-disabled-options",type:"Dropdown",attributes:{triggerLabel:"Options with Disabled",options:[{id:"1",label:"Available Option 1"},{id:"2",label:"Disabled Option",disabled:!0},{id:"3",label:"Available Option 2"},{id:"4",label:"Another Disabled",disabled:!0},{id:"5",label:"Available Option 3"}]}}};return t.jsx(c,{document:n,components:u})},parameters:{docs:{description:{story:`
## Options with Disabled Items

Individual options can be disabled while keeping the dropdown functional.
        `}}}},P={render:()=>t.jsxs("div",{className:"flex flex-wrap gap-4 p-8",children:[t.jsx(x,{triggerLabel:"Bottom Start",placement:"bottom-start",options:l}),t.jsx(x,{triggerLabel:"Bottom End",placement:"bottom-end",options:l}),t.jsx(x,{triggerLabel:"Top Start",placement:"top-start",options:l}),t.jsx(x,{triggerLabel:"Top End",placement:"top-end",options:l})]}),parameters:{docs:{description:{story:`
## Placement Options

Control where the menu appears relative to the trigger button.

- \`bottom-start\`: Below trigger, aligned to start (default)
- \`bottom-end\`: Below trigger, aligned to end
- \`top-start\`: Above trigger, aligned to start
- \`top-end\`: Above trigger, aligned to end
        `}}}},E={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4 border rounded-lg max-w-md"},children:[{id:"header",type:"Div",attributes:{className:"flex justify-between items-center mb-4"},children:[{id:"title",type:"Span",state:{text:"Task: Implement feature"},attributes:{className:"font-medium"}},{id:"status-dropdown",type:"Dropdown",attributes:{triggerLabel:"In Progress",appearance:"subtle",spacing:"compact",options:w},state:{selectedId:"in-progress"}}]},{id:"description",type:"Span",state:{text:"Implement the new authentication feature with OAuth support."},attributes:{className:"text-sm text-gray-600"}}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Status Selector

A practical example showing a task card with a status selector dropdown.
        `}}}},F={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-2 p-4 bg-gray-50 rounded-lg"},children:[{id:"label",type:"Span",state:{text:"Filter by:"},attributes:{className:"text-sm text-gray-600"}},{id:"status-filter",type:"Dropdown",attributes:{triggerLabel:"Status",spacing:"compact",isMultiSelect:!0,options:w},state:{selectedIds:["open","in-progress"]}},{id:"priority-filter",type:"Dropdown",attributes:{triggerLabel:"Priority",spacing:"compact",isMultiSelect:!0,options:y},state:{selectedIds:["high"]}}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Filter Dropdowns

Multiple dropdowns used as filters. Uses compact spacing and multi-select mode.
        `}}}},B={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 max-w-sm"},children:[{id:"field-wrapper",type:"Div",attributes:{className:"space-y-1"},children:[{id:"label",type:"Span",state:{text:"Priority"},attributes:{className:"text-sm font-medium"}},{id:"priority-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select priority",options:y},state:{selectedId:"medium"}},{id:"help-text",type:"Span",state:{text:"Set the priority level for this task."},attributes:{className:"text-xs text-gray-500"}}]}]}};return t.jsx(c,{document:e,components:u})},parameters:{docs:{description:{story:`
## Form Field Dropdown

Dropdown used as a form field with label and help text.
        `}}}},W={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Reference Example (SDUI)"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"The dropdown selection updates the display below in real-time via SDUI reference."},attributes:{className:"text-sm text-gray-600 block"}},{id:"content",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"priority-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select Priority",options:y},state:{selectedId:"medium"}},{id:"display-box",type:"Div",attributes:{className:"flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"},children:[{id:"label",type:"Span",state:{text:"Selected:"},attributes:{className:"text-sm text-gray-500"}},{id:"value",type:"ReferenceText",reference:"priority-dropdown",attributes:{className:"font-medium",options:y}}]}]},{id:"info-box",type:"Div",attributes:{className:"mt-4 p-3 bg-blue-50 rounded text-sm"},children:[{id:"info-text",type:"Span",state:{text:"ReferenceText component uses useSduiNodeReference hook to subscribe to dropdown state changes."},attributes:{className:"text-blue-800"}}]}]}};return t.jsx(c,{document:e,components:h})},parameters:{docs:{description:{story:`
## Reference Pattern (SDUI)

This example uses a custom \`ReferenceText\` component that:
1. Has \`reference: 'priority-dropdown'\` to link to the dropdown
2. Uses \`useSduiNodeReference\` hook to subscribe to referenced node's state
3. Automatically re-renders when dropdown selection changes

### Custom Component Implementation
\`\`\`tsx
const ReferenceText = ({ id }) => {
  const { referencedNodes } = useSduiNodeReference({ nodeId: id })
  const selectedId = referencedNodes[0]?.state?.selectedId
  return <span>{selectedId}</span>
}
\`\`\`
        `}}}},V={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Dynamic Trigger Label (SDUI)"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Select a status and see the value update below via reference."},attributes:{className:"text-sm text-gray-600 block"}},{id:"status-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select status...",options:w},state:{selectedId:void 0}},{id:"result-box",type:"Div",attributes:{className:"p-3 bg-gray-50 rounded text-sm"},children:[{id:"result-label",type:"Span",state:{text:"You selected: "},attributes:{className:"text-gray-600"}},{id:"result-value",type:"ReferenceText",reference:"status-dropdown",attributes:{className:"font-semibold text-gray-900",options:w}}]}]}};return t.jsx(c,{document:e,components:h})},parameters:{docs:{description:{story:`
## Dynamic Trigger Label (SDUI)

The \`ReferenceText\` component subscribes to the dropdown's state and displays the selected label.

- Initial state: \`selectedId: undefined\` → displays "None"
- After selection: displays the selected option's label
        `}}}},z={render:()=>{const e=[{id:"frontend",label:"Frontend"},{id:"backend",label:"Backend"},{id:"devops",label:"DevOps"}],n=[{id:"react",label:"React"},{id:"vue",label:"Vue"},{id:"angular",label:"Angular"}],a={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-lg"},children:[{id:"title",type:"Span",state:{text:"Cascading Dropdowns (SDUI)"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Two dropdowns - select both and see the summary update via reference."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdowns-row",type:"Div",attributes:{className:"flex items-start gap-4"},children:[{id:"category-field",type:"Div",attributes:{className:"space-y-1"},children:[{id:"category-label",type:"Span",state:{text:"Category"},attributes:{className:"text-xs text-gray-500 block"}},{id:"category-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select category",options:e},state:{selectedId:"frontend"}}]},{id:"tech-field",type:"Div",attributes:{className:"space-y-1"},children:[{id:"tech-label",type:"Span",state:{text:"Technology"},attributes:{className:"text-xs text-gray-500 block"}},{id:"tech-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select technology",options:n},state:{selectedId:"react"}}]}]},{id:"summary-box",type:"Div",attributes:{className:"mt-4 p-3 bg-gray-50 rounded text-sm"},children:[{id:"summary-label",type:"Span",state:{text:"Selection: "},attributes:{className:"text-gray-500"}},{id:"category-value",type:"ReferenceText",reference:"category-dropdown",attributes:{className:"font-medium",options:e}},{id:"arrow",type:"Span",state:{text:" → "},attributes:{className:"text-gray-400"}},{id:"tech-value",type:"ReferenceText",reference:"tech-dropdown",attributes:{className:"font-medium",options:n}}]}]}};return t.jsx(c,{document:a,components:h})},parameters:{docs:{description:{story:"\n## Cascading Dropdowns (SDUI)\n\nBoth dropdowns' selections are displayed in the summary using `ReferenceText` components.\n\nEach `ReferenceText` has its own `reference` to the respective dropdown:\n- `category-value` references `category-dropdown`\n- `tech-value` references `tech-dropdown`\n        "}}}},H={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-lg"},children:[{id:"title",type:"Span",state:{text:"Multi-Select with Reference (SDUI)"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Select multiple priorities and see the selection displayed below via ReferenceText."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdown-field",type:"Div",attributes:{className:"space-y-1"},children:[{id:"dropdown-label",type:"Span",state:{text:"Priority Filter"},attributes:{className:"text-xs text-gray-500 block"}},{id:"priority-dropdown",type:"Dropdown",attributes:{triggerLabel:"Select priorities",appearance:"primary",isMultiSelect:!0,options:y},state:{selectedIds:["high","medium"]}}]},{id:"result-box",type:"Div",attributes:{className:"mt-4 p-3 bg-green-50 rounded text-sm"},children:[{id:"result-label",type:"Span",state:{text:"Selected priorities: "},attributes:{className:"text-green-700"}},{id:"result-value",type:"ReferenceText",reference:"priority-dropdown",attributes:{className:"font-semibold text-green-800",options:y}}]}]}};return t.jsx(c,{document:e,components:h})},parameters:{docs:{description:{story:`
## Multi-Select with Reference (SDUI)

The \`ReferenceText\` component also supports multi-select dropdowns.

When \`selectedIds\` is an array, it displays all selected labels joined by commas.
        `}}}},K={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-lg"},children:[{id:"title",type:"Span",state:{text:"Multiple References (SDUI)"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"A single node can reference multiple dropdowns using an array of IDs."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdowns-row",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"status-dropdown",type:"Dropdown",attributes:{triggerLabel:"Status",spacing:"compact",options:w},state:{selectedId:"in-progress"}},{id:"priority-dropdown",type:"Dropdown",attributes:{triggerLabel:"Priority",spacing:"compact",options:y},state:{selectedId:"high"}}]},{id:"summary-box",type:"Div",attributes:{className:"mt-4 p-3 bg-yellow-50 rounded border border-yellow-200"},children:[{id:"summary-title",type:"Span",state:{text:"Summary (ReferenceDisplay with multiple refs)"},attributes:{className:"text-sm font-medium text-yellow-800 block mb-2"}},{id:"summary-display",type:"ReferenceDisplay",reference:["status-dropdown","priority-dropdown"],attributes:{className:"text-sm text-yellow-700 space-y-1",optionsMap:{"status-dropdown":w,"priority-dropdown":y}}}]},{id:"code-box",type:"Div",attributes:{className:"mt-4 p-3 bg-gray-800 rounded text-sm"},children:[{id:"code-text",type:"Span",state:{text:'reference: ["status-dropdown", "priority-dropdown"]'},attributes:{className:"text-green-400 font-mono"}}]}]}};return t.jsx(c,{document:e,components:h})},parameters:{docs:{description:{story:`
## Multiple References (SDUI)

The \`ReferenceDisplay\` component demonstrates multiple references:

\`\`\`json
{
  "id": "summary-display",
  "type": "ReferenceDisplay",
  "reference": ["status-dropdown", "priority-dropdown"],
  "attributes": {
    "optionsMap": {
      "status-dropdown": [...],
      "priority-dropdown": [...]
    }
  }
}
\`\`\`

### ReferenceDisplay Implementation

\`\`\`tsx
const { referencedNodes } = useSduiNodeReference({ nodeId })

return referencedNodes.map(refNode => (
  <div key={refNode.id}>
    {refNode.id}: {refNode.state.selectedId}
  </div>
))
\`\`\`
        `}}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    triggerLabel: 'Select option',
    appearance: 'default',
    spacing: 'default',
    placement: 'bottom-start',
    isDisabled: false,
    isMultiSelect: false,
    options: sampleOptions
  },
  render: args => {
    const [selectedId, setSelectedId] = useState<string | undefined>();
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    return <DropdownMenu {...args} selectedId={selectedId} selectedIds={selectedIds} onSelect={setSelectedId} onSelectionChange={setSelectedIds} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different dropdown configurations.

### Available Controls

- **appearance**: default, primary, subtle
- **spacing**: default, compact, cozy
- **placement**: bottom-start, bottom-end, top-start, etc.
- **isDisabled**: Enable/disable the dropdown
- **isMultiSelect**: Enable checkbox multi-selection
- **triggerLabel**: Customize trigger button text
        \`
      }
    }
  }
}`,...D.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-default',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Default',
          appearance: 'default',
          options: sampleOptions
        },
        state: {
          selectedId: '1'
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Default Appearance

Neutral button with border. Standard dropdown trigger style.

### Characteristics
- Transparent background with border
- Uses \\\`--color-border-default\\\` for border
- \\\`--color-text-default\\\` for text color
        \`
      }
    }
  }
}`,...v.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-primary',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Primary',
          appearance: 'primary',
          options: sampleOptions
        },
        state: {
          selectedId: '1'
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Primary Appearance

Brand blue filled button trigger. Use when dropdown is a primary action.

### Characteristics
- Solid brand blue background
- White text for contrast
- Higher visual emphasis
        \`
      }
    }
  }
}`,...N.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-subtle',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Subtle',
          appearance: 'subtle',
          options: sampleOptions
        },
        state: {
          selectedId: '1'
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Subtle Appearance

Transparent button without border. Minimal visual footprint.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for inline/compact scenarios
        \`
      }
    }
  }
}`,...I.parameters?.docs?.source}}};L.parameters={...L.parameters,docs:{...L.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-4'
        },
        children: [{
          id: 'dropdown-1',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Default',
            appearance: 'default',
            options: sampleOptions
          },
          state: {
            selectedId: '1'
          }
        }, {
          id: 'dropdown-2',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Primary',
            appearance: 'primary',
            options: sampleOptions
          },
          state: {
            selectedId: '2'
          }
        }, {
          id: 'dropdown-3',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Subtle',
            appearance: 'subtle',
            options: sampleOptions
          },
          state: {
            selectedId: '3'
          }
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## All Appearances Comparison

Side-by-side comparison of all appearance variants.
        \`
      }
    }
  }
}`,...L.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-spacing-default',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Default Spacing (32px)',
          spacing: 'default',
          options: sampleOptions
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Default Spacing

Standard trigger height (32px). Suitable for most use cases.
        \`
      }
    }
  }
}`,...R.parameters?.docs?.source}}};M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-spacing-compact',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Compact Spacing (24px)',
          spacing: 'compact',
          options: sampleOptions
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Compact Spacing

Smaller trigger height (24px). Use in dense UIs or tables.
        \`
      }
    }
  }
}`,...M.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-4'
        },
        children: [{
          id: 'dropdown-default-spacing',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Default',
            spacing: 'default',
            options: sampleOptions
          }
        }, {
          id: 'dropdown-compact-spacing',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Compact',
            spacing: 'compact',
            options: sampleOptions
          }
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## All Spacings Comparison

Side-by-side comparison of spacing variants.
        \`
      }
    }
  }
}`,...O.parameters?.docs?.source}}};k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  render: () => {
    const SingleSelectExample = () => {
      const [selectedId, setSelectedId] = useState<string>('open');
      return <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected: {selectedId || 'None'}</p>
          <DropdownMenu triggerLabel="Select Status" options={statusOptions} selectedId={selectedId} onSelect={setSelectedId} />
        </div>;
    };
    return <SingleSelectExample />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Single Select Mode

Default selection mode. Only one option can be selected at a time.

- Selected option shows a checkmark
- Clicking an option selects it and closes the menu
        \`
      }
    }
  }
}`,...k.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => {
    const MultiSelectExample = () => {
      const [selectedIds, setSelectedIds] = useState<string[]>(['high', 'medium']);
      return <div className="space-y-2">
          <p className="text-sm text-gray-600">Selected: {selectedIds.join(', ') || 'None'}</p>
          <DropdownMenu triggerLabel="Select Priorities" options={priorityOptions} isMultiSelect selectedIds={selectedIds} onSelectionChange={setSelectedIds} />
        </div>;
    };
    return <MultiSelectExample />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Multi Select Mode

Enable \\\`isMultiSelect\\\` for checkbox-based multi-selection.

- Each option has a checkbox
- Multiple options can be selected
- Menu stays open for additional selections
        \`
      }
    }
  }
}`,...C.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-single',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Select Status',
          options: statusOptions
        },
        state: {
          selectedId: 'in-progress'
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Single Select (SDUI)

SDUI document example for single selection dropdown.
        \`
      }
    }
  }
}`,...T.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-multi',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Select Priorities',
          isMultiSelect: true,
          options: priorityOptions
        },
        state: {
          selectedIds: ['high', 'medium']
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Multi Select (SDUI)

SDUI document example for multi-selection dropdown with checkboxes.
        \`
      }
    }
  }
}`,...A.parameters?.docs?.source}}};j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-4'
        },
        children: [{
          id: 'dropdown-enabled',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Enabled',
            options: sampleOptions
          }
        }, {
          id: 'dropdown-disabled',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Disabled',
            isDisabled: true,
            options: sampleOptions
          }
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Disabled State

Comparison of enabled and disabled dropdown triggers.
        \`
      }
    }
  }
}`,...j.parameters?.docs?.source}}};U.parameters={...U.parameters,docs:{...U.parameters?.docs,source:{originalSource:`{
  render: () => {
    const optionsWithDisabled = [{
      id: '1',
      label: 'Available Option 1'
    }, {
      id: '2',
      label: 'Disabled Option',
      disabled: true
    }, {
      id: '3',
      label: 'Available Option 2'
    }, {
      id: '4',
      label: 'Another Disabled',
      disabled: true
    }, {
      id: '5',
      label: 'Available Option 3'
    }];
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-disabled-options',
        type: 'Dropdown',
        attributes: {
          triggerLabel: 'Options with Disabled',
          options: optionsWithDisabled
        }
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Options with Disabled Items

Individual options can be disabled while keeping the dropdown functional.
        \`
      }
    }
  }
}`,...U.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4 p-8">
      <DropdownMenu triggerLabel="Bottom Start" placement="bottom-start" options={sampleOptions} />
      <DropdownMenu triggerLabel="Bottom End" placement="bottom-end" options={sampleOptions} />
      <DropdownMenu triggerLabel="Top Start" placement="top-start" options={sampleOptions} />
      <DropdownMenu triggerLabel="Top End" placement="top-end" options={sampleOptions} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Placement Options

Control where the menu appears relative to the trigger button.

- \\\`bottom-start\\\`: Below trigger, aligned to start (default)
- \\\`bottom-end\\\`: Below trigger, aligned to end
- \\\`top-start\\\`: Above trigger, aligned to start
- \\\`top-end\\\`: Above trigger, aligned to end
        \`
      }
    }
  }
}`,...P.parameters?.docs?.source}}};E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-4 border rounded-lg max-w-md'
        },
        children: [{
          id: 'header',
          type: 'Div',
          attributes: {
            className: 'flex justify-between items-center mb-4'
          },
          children: [{
            id: 'title',
            type: 'Span',
            state: {
              text: 'Task: Implement feature'
            },
            attributes: {
              className: 'font-medium'
            }
          }, {
            id: 'status-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'In Progress',
              appearance: 'subtle',
              spacing: 'compact',
              options: statusOptions
            },
            state: {
              selectedId: 'in-progress'
            }
          }]
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'Implement the new authentication feature with OAuth support.'
          },
          attributes: {
            className: 'text-sm text-gray-600'
          }
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Status Selector

A practical example showing a task card with a status selector dropdown.
        \`
      }
    }
  }
}`,...E.parameters?.docs?.source}}};F.parameters={...F.parameters,docs:{...F.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-2 p-4 bg-gray-50 rounded-lg'
        },
        children: [{
          id: 'label',
          type: 'Span',
          state: {
            text: 'Filter by:'
          },
          attributes: {
            className: 'text-sm text-gray-600'
          }
        }, {
          id: 'status-filter',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Status',
            spacing: 'compact',
            isMultiSelect: true,
            options: statusOptions
          },
          state: {
            selectedIds: ['open', 'in-progress']
          }
        }, {
          id: 'priority-filter',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Priority',
            spacing: 'compact',
            isMultiSelect: true,
            options: priorityOptions
          },
          state: {
            selectedIds: ['high']
          }
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Filter Dropdowns

Multiple dropdowns used as filters. Uses compact spacing and multi-select mode.
        \`
      }
    }
  }
}`,...F.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 max-w-sm'
        },
        children: [{
          id: 'field-wrapper',
          type: 'Div',
          attributes: {
            className: 'space-y-1'
          },
          children: [{
            id: 'label',
            type: 'Span',
            state: {
              text: 'Priority'
            },
            attributes: {
              className: 'text-sm font-medium'
            }
          }, {
            id: 'priority-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Select priority',
              options: priorityOptions
            },
            state: {
              selectedId: 'medium'
            }
          }, {
            id: 'help-text',
            type: 'Span',
            state: {
              text: 'Set the priority level for this task.'
            },
            attributes: {
              className: 'text-xs text-gray-500'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Form Field Dropdown

Dropdown used as a form field with label and help text.
        \`
      }
    }
  }
}`,...B.parameters?.docs?.source}}};W.parameters={...W.parameters,docs:{...W.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 p-4 border rounded-lg max-w-md'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Reference Example (SDUI)'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'The dropdown selection updates the display below in real-time via SDUI reference.'
          },
          attributes: {
            className: 'text-sm text-gray-600 block'
          }
        }, {
          id: 'content',
          type: 'Div',
          attributes: {
            className: 'flex items-center gap-4'
          },
          children: [{
            id: 'priority-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Select Priority',
              options: priorityOptions
            },
            state: {
              selectedId: 'medium'
            }
          }, {
            id: 'display-box',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2 px-3 py-2 bg-gray-100 rounded'
            },
            children: [{
              id: 'label',
              type: 'Span',
              state: {
                text: 'Selected:'
              },
              attributes: {
                className: 'text-sm text-gray-500'
              }
            }, {
              id: 'value',
              type: 'ReferenceText',
              reference: 'priority-dropdown',
              attributes: {
                className: 'font-medium',
                options: priorityOptions
              }
            }]
          }]
        }, {
          id: 'info-box',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-3 bg-blue-50 rounded text-sm'
          },
          children: [{
            id: 'info-text',
            type: 'Span',
            state: {
              text: 'ReferenceText component uses useSduiNodeReference hook to subscribe to dropdown state changes.'
            },
            attributes: {
              className: 'text-blue-800'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Reference Pattern (SDUI)

This example uses a custom \\\`ReferenceText\\\` component that:
1. Has \\\`reference: 'priority-dropdown'\\\` to link to the dropdown
2. Uses \\\`useSduiNodeReference\\\` hook to subscribe to referenced node's state
3. Automatically re-renders when dropdown selection changes

### Custom Component Implementation
\\\`\\\`\\\`tsx
const ReferenceText = ({ id }) => {
  const { referencedNodes } = useSduiNodeReference({ nodeId: id })
  const selectedId = referencedNodes[0]?.state?.selectedId
  return <span>{selectedId}</span>
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...W.parameters?.docs?.source}}};V.parameters={...V.parameters,docs:{...V.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 p-4 border rounded-lg max-w-md'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Dynamic Trigger Label (SDUI)'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'Select a status and see the value update below via reference.'
          },
          attributes: {
            className: 'text-sm text-gray-600 block'
          }
        }, {
          id: 'status-dropdown',
          type: 'Dropdown',
          attributes: {
            triggerLabel: 'Select status...',
            options: statusOptions
          },
          state: {
            selectedId: undefined
          }
        }, {
          id: 'result-box',
          type: 'Div',
          attributes: {
            className: 'p-3 bg-gray-50 rounded text-sm'
          },
          children: [{
            id: 'result-label',
            type: 'Span',
            state: {
              text: 'You selected: '
            },
            attributes: {
              className: 'text-gray-600'
            }
          }, {
            id: 'result-value',
            type: 'ReferenceText',
            reference: 'status-dropdown',
            attributes: {
              className: 'font-semibold text-gray-900',
              options: statusOptions
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Dynamic Trigger Label (SDUI)

The \\\`ReferenceText\\\` component subscribes to the dropdown's state and displays the selected label.

- Initial state: \\\`selectedId: undefined\\\` → displays "None"
- After selection: displays the selected option's label
        \`
      }
    }
  }
}`,...V.parameters?.docs?.source}}};z.parameters={...z.parameters,docs:{...z.parameters?.docs,source:{originalSource:`{
  render: () => {
    const categoryOptions = [{
      id: 'frontend',
      label: 'Frontend'
    }, {
      id: 'backend',
      label: 'Backend'
    }, {
      id: 'devops',
      label: 'DevOps'
    }];
    const frontendOptions = [{
      id: 'react',
      label: 'React'
    }, {
      id: 'vue',
      label: 'Vue'
    }, {
      id: 'angular',
      label: 'Angular'
    }];
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 p-4 border rounded-lg max-w-lg'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Cascading Dropdowns (SDUI)'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'Two dropdowns - select both and see the summary update via reference.'
          },
          attributes: {
            className: 'text-sm text-gray-600 block'
          }
        }, {
          id: 'dropdowns-row',
          type: 'Div',
          attributes: {
            className: 'flex items-start gap-4'
          },
          children: [{
            id: 'category-field',
            type: 'Div',
            attributes: {
              className: 'space-y-1'
            },
            children: [{
              id: 'category-label',
              type: 'Span',
              state: {
                text: 'Category'
              },
              attributes: {
                className: 'text-xs text-gray-500 block'
              }
            }, {
              id: 'category-dropdown',
              type: 'Dropdown',
              attributes: {
                triggerLabel: 'Select category',
                options: categoryOptions
              },
              state: {
                selectedId: 'frontend'
              }
            }]
          }, {
            id: 'tech-field',
            type: 'Div',
            attributes: {
              className: 'space-y-1'
            },
            children: [{
              id: 'tech-label',
              type: 'Span',
              state: {
                text: 'Technology'
              },
              attributes: {
                className: 'text-xs text-gray-500 block'
              }
            }, {
              id: 'tech-dropdown',
              type: 'Dropdown',
              attributes: {
                triggerLabel: 'Select technology',
                options: frontendOptions
              },
              state: {
                selectedId: 'react'
              }
            }]
          }]
        }, {
          id: 'summary-box',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-3 bg-gray-50 rounded text-sm'
          },
          children: [{
            id: 'summary-label',
            type: 'Span',
            state: {
              text: 'Selection: '
            },
            attributes: {
              className: 'text-gray-500'
            }
          }, {
            id: 'category-value',
            type: 'ReferenceText',
            reference: 'category-dropdown',
            attributes: {
              className: 'font-medium',
              options: categoryOptions
            }
          }, {
            id: 'arrow',
            type: 'Span',
            state: {
              text: ' → '
            },
            attributes: {
              className: 'text-gray-400'
            }
          }, {
            id: 'tech-value',
            type: 'ReferenceText',
            reference: 'tech-dropdown',
            attributes: {
              className: 'font-medium',
              options: frontendOptions
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Cascading Dropdowns (SDUI)

Both dropdowns' selections are displayed in the summary using \\\`ReferenceText\\\` components.

Each \\\`ReferenceText\\\` has its own \\\`reference\\\` to the respective dropdown:
- \\\`category-value\\\` references \\\`category-dropdown\\\`
- \\\`tech-value\\\` references \\\`tech-dropdown\\\`
        \`
      }
    }
  }
}`,...z.parameters?.docs?.source}}};H.parameters={...H.parameters,docs:{...H.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 p-4 border rounded-lg max-w-lg'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Multi-Select with Reference (SDUI)'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'Select multiple priorities and see the selection displayed below via ReferenceText.'
          },
          attributes: {
            className: 'text-sm text-gray-600 block'
          }
        }, {
          id: 'dropdown-field',
          type: 'Div',
          attributes: {
            className: 'space-y-1'
          },
          children: [{
            id: 'dropdown-label',
            type: 'Span',
            state: {
              text: 'Priority Filter'
            },
            attributes: {
              className: 'text-xs text-gray-500 block'
            }
          }, {
            id: 'priority-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Select priorities',
              appearance: 'primary',
              isMultiSelect: true,
              options: priorityOptions
            },
            state: {
              selectedIds: ['high', 'medium']
            }
          }]
        }, {
          id: 'result-box',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-3 bg-green-50 rounded text-sm'
          },
          children: [{
            id: 'result-label',
            type: 'Span',
            state: {
              text: 'Selected priorities: '
            },
            attributes: {
              className: 'text-green-700'
            }
          }, {
            id: 'result-value',
            type: 'ReferenceText',
            reference: 'priority-dropdown',
            attributes: {
              className: 'font-semibold text-green-800',
              options: priorityOptions
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Multi-Select with Reference (SDUI)

The \\\`ReferenceText\\\` component also supports multi-select dropdowns.

When \\\`selectedIds\\\` is an array, it displays all selected labels joined by commas.
        \`
      }
    }
  }
}`,...H.parameters?.docs?.source}}};K.parameters={...K.parameters,docs:{...K.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4 p-4 border rounded-lg max-w-lg'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Multiple References (SDUI)'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'A single node can reference multiple dropdowns using an array of IDs.'
          },
          attributes: {
            className: 'text-sm text-gray-600 block'
          }
        }, {
          id: 'dropdowns-row',
          type: 'Div',
          attributes: {
            className: 'flex items-center gap-4'
          },
          children: [{
            id: 'status-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Status',
              spacing: 'compact',
              options: statusOptions
            },
            state: {
              selectedId: 'in-progress'
            }
          }, {
            id: 'priority-dropdown',
            type: 'Dropdown',
            attributes: {
              triggerLabel: 'Priority',
              spacing: 'compact',
              options: priorityOptions
            },
            state: {
              selectedId: 'high'
            }
          }]
        }, {
          id: 'summary-box',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-3 bg-yellow-50 rounded border border-yellow-200'
          },
          children: [{
            id: 'summary-title',
            type: 'Span',
            state: {
              text: 'Summary (ReferenceDisplay with multiple refs)'
            },
            attributes: {
              className: 'text-sm font-medium text-yellow-800 block mb-2'
            }
          }, {
            id: 'summary-display',
            type: 'ReferenceDisplay',
            reference: ['status-dropdown', 'priority-dropdown'],
            attributes: {
              className: 'text-sm text-yellow-700 space-y-1',
              optionsMap: {
                'status-dropdown': statusOptions,
                'priority-dropdown': priorityOptions
              }
            }
          }]
        }, {
          id: 'code-box',
          type: 'Div',
          attributes: {
            className: 'mt-4 p-3 bg-gray-800 rounded text-sm'
          },
          children: [{
            id: 'code-text',
            type: 'Span',
            state: {
              text: 'reference: ["status-dropdown", "priority-dropdown"]'
            },
            attributes: {
              className: 'text-green-400 font-mono'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Multiple References (SDUI)

The \\\`ReferenceDisplay\\\` component demonstrates multiple references:

\\\`\\\`\\\`json
{
  "id": "summary-display",
  "type": "ReferenceDisplay",
  "reference": ["status-dropdown", "priority-dropdown"],
  "attributes": {
    "optionsMap": {
      "status-dropdown": [...],
      "priority-dropdown": [...]
    }
  }
}
\\\`\\\`\\\`

### ReferenceDisplay Implementation

\\\`\\\`\\\`tsx
const { referencedNodes } = useSduiNodeReference({ nodeId })

return referencedNodes.map(refNode => (
  <div key={refNode.id}>
    {refNode.id}: {refNode.state.selectedId}
  </div>
))
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...K.parameters?.docs?.source}}};const de=["Playground","AppearanceDefault","AppearancePrimary","AppearanceSubtle","AllAppearances","SpacingDefault","SpacingCompact","AllSpacings","SingleSelect","MultiSelect","SingleSelectSdui","MultiSelectSdui","Disabled","WithDisabledOptions","PlacementExamples","StatusSelector","FilterDropdowns","FormFieldDropdown","WithReferenceSdui","DynamicTriggerLabelSdui","CascadingDropdownsSdui","SyncedDropdownsSdui","MultipleReferencesSdui"];export{L as AllAppearances,O as AllSpacings,v as AppearanceDefault,N as AppearancePrimary,I as AppearanceSubtle,z as CascadingDropdownsSdui,j as Disabled,V as DynamicTriggerLabelSdui,F as FilterDropdowns,B as FormFieldDropdown,C as MultiSelect,A as MultiSelectSdui,K as MultipleReferencesSdui,P as PlacementExamples,D as Playground,k as SingleSelect,T as SingleSelectSdui,M as SpacingCompact,R as SpacingDefault,E as StatusSelector,H as SyncedDropdownsSdui,U as WithDisabledOptions,W as WithReferenceSdui,de as __namedExportsOrder,ie as default};
