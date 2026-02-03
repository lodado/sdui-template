import{j as t}from"./jsx-runtime-Cn5vU2bi.js";import{u as E,d as F,e as J,S as l,s as c}from"./sduiComponents-C3NvGM3k.js";import{r as y,R as V}from"./iframe-C9NbDJzv.js";import"./index-DqsrmGy_.js";import"./index-CUFHkYWu.js";import"./preload-helper-ggYluGXI.js";function q(e,o){const n=F(),r=V.useRef(null),s=V.useRef(null),u=y.useSyncExternalStore(p=>{const d=e.map(a=>n.subscribeNode(a,p)),i=n.subscribeVersion(p);return()=>{d.forEach(a=>a()),i()}},()=>{const p=n.getSnapshot(),d=e.map(a=>p[a]||"none"),i=e.join(",");return r.current&&r.current.nodeIdsKey===i&&r.current.values.length===d.length&&r.current.values.every((a,g)=>a===d[g])?r.current.values:(r.current={nodeIdsKey:i,values:d},d)},()=>{const p=e.join(",");if(s.current&&s.current.nodeIdsKey===p)return s.current.values;const d=n.getServerSnapshot(),i=e.map(a=>d[a]||"none");return s.current={nodeIdsKey:p,values:i},i}),{nodes:m}=n.state,w=y.useMemo(()=>u.join(":"),[u]);return y.useMemo(()=>e.map(p=>{const d=m[p],i=d?.childrenIds||[],a=d?.state||{},g=d?.attributes,W=d?.reference;let k;if(o){const M=o.safeParse(a);if(!M.success)throw new Error(`State validation failed for referenced node "${p}": ${M.error.message}`);k=M.data}else k=a;return{node:d,type:d?.type,state:k,childrenIds:i,attributes:g,reference:W,exists:!!d}}),[e,m,o,w])}function H(e){const{nodeId:o,schema:n}=e,{reference:r}=E({nodeId:o}),s=y.useMemo(()=>r?Array.isArray(r)?r:[r]:[],[r]),u=q(s,n),{referencedNodes:m,referencedNodesMap:w}=y.useMemo(()=>{const p=u.map((i,a)=>({id:s[a],node:i.node,type:i.type,state:i.state,attributes:i.attributes,exists:i.exists})),d={};return p.forEach(i=>{d[i.id]=i}),{referencedNodes:p,referencedNodesMap:d}},[u,s]);return{referencedNodes:m,referencedNodesMap:w,reference:r,hasReference:s.length>0}}const $=({id:e})=>{const{attributes:o}=E({nodeId:e}),{referencedNodes:n,hasReference:r}=H({nodeId:e}),s=o?.className,u=o?.options;if(!r||n.length===0)return t.jsx("span",{className:s,children:"No reference"});const w=n[0]?.state?.selectedId,p=u?.find(d=>d.id===w)?.label||w||"None";return t.jsx("span",{className:s,children:p})};$.displayName="ReferenceText";const K=({id:e})=>{const{attributes:o}=E({nodeId:e}),{referencedNodes:n,hasReference:r}=H({nodeId:e}),s=o?.className,u=o?.optionsMap;return r?t.jsx("div",{className:s,children:n.map((m,w)=>{const p=m?.state?.selectedId,i=u?.[m.id]?.find(a=>a.id===p)?.label||p||"None";return t.jsxs("div",{children:[t.jsxs("span",{className:"text-gray-500",children:[m.id,":"]})," ",t.jsx("span",{className:"font-medium",children:i})]},m.id||w)})}):t.jsx("div",{className:s,children:"No references configured"})};K.displayName="ReferenceDisplay";const b={...c,ReferenceText:e=>t.jsx($,{id:e}),ReferenceDisplay:e=>t.jsx(K,{id:e})},Z={title:"Shared/UI/Dropdown",component:J.Root,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Dropdown** component follows the Atlassian Design System (ADS) specifications and uses the **Compound Pattern**.

## Compound Pattern Structure

\`\`\`json
{
  "id": "dropdown-root",
  "type": "Dropdown",
  "state": { "open": false, "selectedId": "opt-1" },
  "children": [
    { "type": "DropdownTrigger", ... },
    { "type": "DropdownContent", "state": { "side": "bottom" },
      "children": [
        { "type": "DropdownItem", "state": { "value": "opt-1", "label": "Option 1" } }
      ]
    }
  ]
}
\`\`\`

---

## Why Provider Pattern?

### The Problem

In SDUI, components are rendered from JSON documents. Unlike React components that share state via props drilling or Context, SDUI nodes are **isolated** - each node only knows its own \`id\`, \`state\`, and \`attributes\`.

**How does a DropdownItem know which Dropdown's \`selectedId\` to compare against?**

### The Solution: Provider Pattern

The **Provider Pattern** solves this by:

1. **Provider (Root)**: The \`Dropdown\` component holds shared state (\`open\`, \`selectedId\`)
2. **Subscriber (Children)**: Child components subscribe to the provider's state via \`providerId\`

\`\`\`
┌─────────────────────────────────────────────┐
│  Dropdown (id: "dropdown-root")             │
│  state: { open: false, selectedId: "opt-1" }│
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  DropdownTrigger                    │    │
│  │  → subscribes to "dropdown-root"    │    │
│  │  → toggles open state on click      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  DropdownContent                    │    │
│  │  → subscribes to "dropdown-root"    │    │
│  │                                     │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │  DropdownItem (value: opt-1)│    │    │
│  │  │  → compares with selectedId │    │    │
│  │  │  → updates selectedId       │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
\`\`\`

### Why Not Just Use React Context?

| Approach | SDUI Compatibility | Serializable | Nested Support |
|----------|-------------------|--------------|----------------|
| React Context only | ❌ Lost on SSR/hydration | ❌ Not JSON | ⚠️ Complex |
| Props drilling | ❌ Not possible in SDUI | ✅ Yes | ❌ Verbose |
| **providerId + Context** | ✅ Full support | ✅ Yes | ✅ Explicit |

**Key benefits of providerId:**

1. **SDUI documents are JSON** - Must be serializable for server-side rendering
2. **Explicit targeting** - Nested dropdowns can reference specific providers
3. **Store-based state** - Changes tracked in SDUI store, enabling debugging/time-travel

---

## providerId Inheritance

**providerId is optional!** Child components automatically inherit from parent Dropdown context.

### How it works:

1. If \`state.providerId\` is specified → use that explicit ID
2. If omitted → inherit from nearest parent \`Dropdown\` via React Context

### When to use explicit providerId:

- **Nested dropdowns**: Inner dropdown's children should reference the inner provider
- **Cross-referencing**: A component outside the tree needs to reference a specific dropdown
- **Dynamic scenarios**: Provider ID changes at runtime

### Example: Nested Dropdowns

\`\`\`json
{
  "id": "outer-dropdown",
  "type": "Dropdown",
  "children": [
    {
      "id": "inner-dropdown",
      "type": "Dropdown",
      "children": [
        {
          "type": "DropdownItem",
          "state": {
            "providerId": "inner-dropdown",  // Explicit - targets inner dropdown
            "value": "inner-opt"
          }
        }
      ]
    }
  ]
}
\`\`\`

---

## Key Rules

| Field | Location | Examples |
|-------|----------|----------|
| HTML attributes | \`attributes\` | \`className\`, \`id\`, \`style\`, \`data-*\` |
| Radix UI props | \`state\` | \`side\`, \`sideOffset\`, \`align\`, \`disabled\` |
| SDUI-specific | \`state\` | \`providerId\` (optional), \`value\`, \`label\`, \`open\` |

## Features

- Keyboard navigation (Arrow keys, Enter, Escape)
- Custom trigger support via compound pattern
- Automatic providerId inheritance from parent context
- Reference pattern for external state display
        `}}}},U=[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}],j=[{id:"open",label:"Open"},{id:"in-progress",label:"In Progress"},{id:"review",label:"In Review"},{id:"done",label:"Done"},{id:"closed",label:"Closed"}],L=[{id:"highest",label:"Highest"},{id:"high",label:"High"},{id:"medium",label:"Medium"},{id:"low",label:"Low"},{id:"lowest",label:"Lowest"}],D={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-default",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-default-trigger",type:"DropdownTrigger",children:[{id:"dropdown-default-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-default-value",type:"DropdownValue",state:{placeholder:"Default Style",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-default-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-default-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-default-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-default-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-default-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Default Appearance

Neutral button with border. Uses \`DropdownValue\` to display selected option.
        `}}}},f={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-primary",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-primary-trigger",type:"DropdownTrigger",children:[{id:"dropdown-primary-btn",type:"Button",state:{appearance:"primary"},children:[{id:"dropdown-primary-value",type:"DropdownValue",state:{placeholder:"Primary Style",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-primary-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-primary-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-primary-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-primary-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-primary-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Primary Appearance

Brand blue filled button trigger. Uses \`DropdownValue\` to display selected option.
        `}}}},h={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-subtle",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-subtle-trigger",type:"DropdownTrigger",children:[{id:"dropdown-subtle-btn",type:"Button",state:{appearance:"subtle"},children:[{id:"dropdown-subtle-value",type:"DropdownValue",state:{placeholder:"Subtle Style",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-subtle-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-subtle-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-subtle-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-subtle-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-subtle-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Subtle Appearance

Transparent button without border. Uses \`DropdownValue\` to display selected option.
        `}}}},v={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-1",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-1-trigger",type:"DropdownTrigger",children:[{id:"dropdown-1-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-1-value",type:"DropdownValue",state:{placeholder:"Default",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-1-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-1-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-1-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-1-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-1-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-2",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-2-trigger",type:"DropdownTrigger",children:[{id:"dropdown-2-btn",type:"Button",state:{appearance:"primary"},children:[{id:"dropdown-2-value",type:"DropdownValue",state:{placeholder:"Primary",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-2-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-2-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-2-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-2-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-2-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-3",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-3-trigger",type:"DropdownTrigger",children:[{id:"dropdown-3-btn",type:"Button",state:{appearance:"subtle"},children:[{id:"dropdown-3-value",type:"DropdownValue",state:{placeholder:"Subtle",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"},{id:"4",label:"Option 4"}]}}]}]},{id:"dropdown-3-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-3-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-3-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-3-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-3-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## All Appearances Comparison

Side-by-side comparison of all appearance variants with dynamic labels.
        `}}}},I={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-default-spacing",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"default-trigger",type:"DropdownTrigger",state:{providerId:"dropdown-default-spacing"},children:[{id:"default-btn",type:"Button",state:{spacing:"default"},children:[{id:"default-text",type:"Span",state:{text:"Default (32px)"}}]}]},{id:"default-content",type:"DropdownContent",state:{providerId:"dropdown-default-spacing",side:"bottom",sideOffset:4},children:U.map((o,n)=>({id:`default-item-${n}`,type:"DropdownItem",state:{providerId:"dropdown-default-spacing",value:o.id,label:o.label}}))}]},{id:"dropdown-compact-spacing",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"compact-trigger",type:"DropdownTrigger",state:{providerId:"dropdown-compact-spacing"},children:[{id:"compact-btn",type:"Button",state:{spacing:"compact"},children:[{id:"compact-text",type:"Span",state:{text:"Compact (24px)"}}]}]},{id:"compact-content",type:"DropdownContent",state:{providerId:"dropdown-compact-spacing",side:"bottom",sideOffset:4,spacing:"compact"},children:U.map((o,n)=>({id:`compact-item-${n}`,type:"DropdownItem",state:{providerId:"dropdown-compact-spacing",value:o.id,label:o.label}}))}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Spacing Variants

Side-by-side comparison of default (32px) and compact (24px) spacing.
        `}}}},x={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-enabled",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-enabled-trigger",type:"DropdownTrigger",children:[{id:"dropdown-enabled-btn",type:"Button",state:{appearance:"default",isDisabled:!1},children:[{id:"dropdown-enabled-text",type:"Span",state:{text:"Enabled"}}]}]},{id:"dropdown-enabled-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-enabled-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-enabled-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-enabled-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-enabled-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-disabled",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-disabled-trigger",type:"DropdownTrigger",children:[{id:"dropdown-disabled-btn",type:"Button",state:{appearance:"default",isDisabled:!0},children:[{id:"dropdown-disabled-text",type:"Span",state:{text:"Disabled"}}]}]},{id:"dropdown-disabled-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-disabled-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-disabled-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-disabled-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-disabled-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Disabled State

Comparison of enabled and disabled dropdown triggers.
        `}}}},O={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-disabled-options",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"trigger",type:"DropdownTrigger",state:{providerId:"dropdown-disabled-options"},children:[{id:"btn",type:"Button",children:[{id:"text",type:"Span",state:{text:"Options with Disabled"}}]}]},{id:"content",type:"DropdownContent",state:{providerId:"dropdown-disabled-options",side:"bottom",sideOffset:4},children:[{id:"item-0",type:"DropdownItem",state:{providerId:"dropdown-disabled-options",value:"1",label:"Available Option 1"}},{id:"item-1",type:"DropdownItem",state:{providerId:"dropdown-disabled-options",value:"2",label:"Disabled Option",disabled:!0}},{id:"item-2",type:"DropdownItem",state:{providerId:"dropdown-disabled-options",value:"3",label:"Available Option 2"}},{id:"item-3",type:"DropdownItem",state:{providerId:"dropdown-disabled-options",value:"4",label:"Another Disabled",disabled:!0}},{id:"item-4",type:"DropdownItem",state:{providerId:"dropdown-disabled-options",value:"5",label:"Available Option 3"}}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Options with Disabled Items

Individual options can be disabled while keeping the dropdown functional.
        `}}}},S={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-wrap gap-4 p-8"},children:[{id:"dropdown-bottom",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-bottom-trigger",type:"DropdownTrigger",children:[{id:"dropdown-bottom-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-bottom-text",type:"Span",state:{text:"Bottom ↓"}}]}]},{id:"dropdown-bottom-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-bottom-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-bottom-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-bottom-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-bottom-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-top",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-top-trigger",type:"DropdownTrigger",children:[{id:"dropdown-top-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-top-text",type:"Span",state:{text:"Top ↑"}}]}]},{id:"dropdown-top-content",type:"DropdownContent",state:{side:"top",sideOffset:4},children:[{id:"dropdown-top-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-top-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-top-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-top-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-left",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-left-trigger",type:"DropdownTrigger",children:[{id:"dropdown-left-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-left-text",type:"Span",state:{text:"← Left"}}]}]},{id:"dropdown-left-content",type:"DropdownContent",state:{side:"left",sideOffset:4},children:[{id:"dropdown-left-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-left-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-left-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-left-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-right",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-right-trigger",type:"DropdownTrigger",children:[{id:"dropdown-right-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-right-text",type:"Span",state:{text:"Right →"}}]}]},{id:"dropdown-right-content",type:"DropdownContent",state:{side:"right",sideOffset:4},children:[{id:"dropdown-right-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-right-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-right-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-right-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Placement Options

Control where the menu appears relative to the trigger button.

- \`bottom\`: Below trigger (default)
- \`top\`: Above trigger
- \`left\`: Left of trigger
- \`right\`: Right of trigger
        `}}}},C={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Reference Pattern Example"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"The dropdown selection updates the display below via SDUI reference."},attributes:{className:"text-sm text-gray-600 block"}},{id:"content",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"priority-dropdown",type:"Dropdown",state:{selectedId:"medium",open:!1},children:[{id:"priority-dropdown-trigger",type:"DropdownTrigger",children:[{id:"priority-dropdown-btn",type:"Button",state:{appearance:"primary"},children:[{id:"priority-dropdown-text",type:"Span",state:{text:"Select Priority"}}]}]},{id:"priority-dropdown-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"priority-dropdown-item-0",type:"DropdownItem",state:{value:"highest",label:"Highest"}},{id:"priority-dropdown-item-1",type:"DropdownItem",state:{value:"high",label:"High"}},{id:"priority-dropdown-item-2",type:"DropdownItem",state:{value:"medium",label:"Medium"}},{id:"priority-dropdown-item-3",type:"DropdownItem",state:{value:"low",label:"Low"}},{id:"priority-dropdown-item-4",type:"DropdownItem",state:{value:"lowest",label:"Lowest"}}]}]},{id:"display-box",type:"Div",attributes:{className:"flex items-center gap-2 px-3 py-2 bg-gray-100 rounded"},children:[{id:"label",type:"Span",state:{text:"Selected:"},attributes:{className:"text-sm text-gray-500"}},{id:"value",type:"ReferenceText",reference:"priority-dropdown",attributes:{className:"font-medium",options:L}}]}]}]}};return t.jsx(l,{document:e,components:b})},parameters:{docs:{description:{story:`
## Reference Pattern

Uses \`useSduiNodeReference\` hook to subscribe to dropdown state changes.

The \`ReferenceText\` component displays the currently selected value from the referenced dropdown.
        `}}}},N={render:()=>{const n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-lg"},children:[{id:"title",type:"Span",state:{text:"Cascading Dropdowns"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Two dropdowns with selections displayed via reference."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdowns-row",type:"Div",attributes:{className:"flex items-start gap-4"},children:[{id:"category-field",type:"Div",attributes:{className:"space-y-1"},children:[{id:"category-label",type:"Span",state:{text:"Category"},attributes:{className:"text-xs text-gray-500 block"}},{id:"category-dropdown",type:"Dropdown",state:{selectedId:"frontend",open:!1},children:[{id:"category-dropdown-trigger",type:"DropdownTrigger",children:[{id:"category-dropdown-btn",type:"Button",state:{appearance:"default"},children:[{id:"category-dropdown-text",type:"Span",state:{text:"Select category"}}]}]},{id:"category-dropdown-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"category-dropdown-item-0",type:"DropdownItem",state:{value:"frontend",label:"Frontend"}},{id:"category-dropdown-item-1",type:"DropdownItem",state:{value:"backend",label:"Backend"}},{id:"category-dropdown-item-2",type:"DropdownItem",state:{value:"devops",label:"DevOps"}}]}]}]},{id:"tech-field",type:"Div",attributes:{className:"space-y-1"},children:[{id:"tech-label",type:"Span",state:{text:"Technology"},attributes:{className:"text-xs text-gray-500 block"}},{id:"tech-dropdown",type:"Dropdown",state:{selectedId:"react",open:!1},children:[{id:"tech-dropdown-trigger",type:"DropdownTrigger",children:[{id:"tech-dropdown-btn",type:"Button",state:{appearance:"default"},children:[{id:"tech-dropdown-text",type:"Span",state:{text:"Select technology"}}]}]},{id:"tech-dropdown-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"tech-dropdown-item-0",type:"DropdownItem",state:{value:"react",label:"React"}},{id:"tech-dropdown-item-1",type:"DropdownItem",state:{value:"vue",label:"Vue"}},{id:"tech-dropdown-item-2",type:"DropdownItem",state:{value:"angular",label:"Angular"}}]}]}]}]},{id:"summary-box",type:"Div",attributes:{className:"mt-4 p-3 bg-gray-50 rounded text-sm"},children:[{id:"summary-label",type:"Span",state:{text:"Selection: "},attributes:{className:"text-gray-500"}},{id:"category-value",type:"ReferenceText",reference:"category-dropdown",attributes:{className:"font-medium",options:[{id:"frontend",label:"Frontend"},{id:"backend",label:"Backend"},{id:"devops",label:"DevOps"}]}},{id:"arrow",type:"Span",state:{text:" → "},attributes:{className:"text-gray-400"}},{id:"tech-value",type:"ReferenceText",reference:"tech-dropdown",attributes:{className:"font-medium",options:[{id:"react",label:"React"},{id:"vue",label:"Vue"},{id:"angular",label:"Angular"}]}}]}]}};return t.jsx(l,{document:n,components:b})},parameters:{docs:{description:{story:`
## Cascading Dropdowns

Both dropdowns' selections are displayed in the summary using \`ReferenceText\` components.
        `}}}},T={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-lg"},children:[{id:"title",type:"Span",state:{text:"Multiple References"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"A single node can reference multiple dropdowns using an array of IDs."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdowns-row",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"status-dropdown",type:"Dropdown",state:{selectedId:"in-progress",open:!1},children:[{id:"status-dropdown-trigger",type:"DropdownTrigger",children:[{id:"status-dropdown-btn",type:"Button",state:{appearance:"default"},children:[{id:"status-dropdown-text",type:"Span",state:{text:"Status"}}]}]},{id:"status-dropdown-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"status-dropdown-item-0",type:"DropdownItem",state:{value:"open",label:"Open"}},{id:"status-dropdown-item-1",type:"DropdownItem",state:{value:"in-progress",label:"In Progress"}},{id:"status-dropdown-item-2",type:"DropdownItem",state:{value:"review",label:"In Review"}},{id:"status-dropdown-item-3",type:"DropdownItem",state:{value:"done",label:"Done"}},{id:"status-dropdown-item-4",type:"DropdownItem",state:{value:"closed",label:"Closed"}}]}]},{id:"priority-dropdown-2",type:"Dropdown",state:{selectedId:"high",open:!1},children:[{id:"priority-dropdown-2-trigger",type:"DropdownTrigger",children:[{id:"priority-dropdown-2-btn",type:"Button",state:{appearance:"default"},children:[{id:"priority-dropdown-2-text",type:"Span",state:{text:"Priority"}}]}]},{id:"priority-dropdown-2-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"priority-dropdown-2-item-0",type:"DropdownItem",state:{value:"highest",label:"Highest"}},{id:"priority-dropdown-2-item-1",type:"DropdownItem",state:{value:"high",label:"High"}},{id:"priority-dropdown-2-item-2",type:"DropdownItem",state:{value:"medium",label:"Medium"}},{id:"priority-dropdown-2-item-3",type:"DropdownItem",state:{value:"low",label:"Low"}},{id:"priority-dropdown-2-item-4",type:"DropdownItem",state:{value:"lowest",label:"Lowest"}}]}]}]},{id:"summary-box",type:"Div",attributes:{className:"mt-4 p-3 bg-yellow-50 rounded border border-yellow-200"},children:[{id:"summary-title",type:"Span",state:{text:"Summary (ReferenceDisplay with multiple refs)"},attributes:{className:"text-sm font-medium text-yellow-800 block mb-2"}},{id:"summary-display",type:"ReferenceDisplay",reference:["status-dropdown","priority-dropdown-2"],attributes:{className:"text-sm text-yellow-700 space-y-1",optionsMap:{"status-dropdown":j,"priority-dropdown-2":L}}}]}]}};return t.jsx(l,{document:e,components:b})},parameters:{docs:{description:{story:`
## Multiple References

The \`ReferenceDisplay\` component demonstrates referencing multiple dropdowns:

\`\`\`json
{
  "type": "ReferenceDisplay",
  "reference": ["status-dropdown", "priority-dropdown"]
}
\`\`\`
        `}}}},R={render:()=>{const e={version:"1.0.0",root:{id:"dropdown-root",type:"Dropdown",state:{selectedId:"option-1",open:!1},children:[{id:"trigger",type:"DropdownTrigger",state:{providerId:"dropdown-root"},children:[{id:"trigger-btn",type:"Button",state:{appearance:"primary"},children:[{id:"trigger-text",type:"Span",state:{text:"Custom Button Trigger"}}]}]},{id:"content",type:"DropdownContent",state:{providerId:"dropdown-root",side:"bottom",sideOffset:4,align:"start"},children:[{id:"item-1",type:"DropdownItem",state:{providerId:"dropdown-root",value:"option-1",label:"Option 1"}},{id:"item-2",type:"DropdownItem",state:{providerId:"dropdown-root",value:"option-2",label:"Option 2"}},{id:"item-3",type:"DropdownItem",state:{providerId:"dropdown-root",value:"option-3",label:"Option 3"}},{id:"item-4",type:"DropdownItem",state:{providerId:"dropdown-root",value:"option-4",label:"Option 4",disabled:!0}}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Compound Pattern with providerId

The basic compound pattern structure:

\`\`\`json
{
  "type": "Dropdown",
  "id": "dropdown-root",
  "state": { "selectedId": "option-1", "open": false },
  "children": [
    { "type": "DropdownTrigger", "state": { "providerId": "dropdown-root" } },
    { "type": "DropdownContent", "state": { "providerId": "dropdown-root" },
      "children": [
        { "type": "DropdownItem", "state": { "providerId": "dropdown-root", "value": "opt-1", "label": "Option 1" } }
      ]
    }
  ]
}
\`\`\`

### Key Points:
- All child components use \`state.providerId\` to subscribe to the parent Dropdown's state
- Radix UI props (\`side\`, \`sideOffset\`, \`disabled\`) go in \`state\`, not \`attributes\`
        `}}}},B={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Compound Pattern + Reference"},attributes:{className:"font-medium block"}},{id:"dropdown-compound",type:"Dropdown",state:{selectedId:"medium",open:!1},children:[{id:"trigger",type:"DropdownTrigger",state:{providerId:"dropdown-compound"},children:[{id:"trigger-btn",type:"Button",state:{appearance:"primary"},children:[{id:"trigger-text",type:"Span",state:{text:"Select Priority"}}]}]},{id:"content",type:"DropdownContent",state:{providerId:"dropdown-compound",side:"bottom",sideOffset:4},children:L.map((o,n)=>({id:`priority-item-${n}`,type:"DropdownItem",state:{providerId:"dropdown-compound",value:o.id,label:o.label}}))}]},{id:"result-box",type:"Div",attributes:{className:"p-3 bg-gray-50 rounded text-sm"},children:[{id:"result-label",type:"Span",state:{text:"Selected: "},attributes:{className:"text-gray-600"}},{id:"result-value",type:"ReferenceText",reference:"dropdown-compound",attributes:{className:"font-semibold text-gray-900",options:L}}]}]}};return t.jsx(l,{document:e,components:b})},parameters:{docs:{description:{story:`
## Compound Pattern with Reference

Combines compound pattern (providerId) with reference for external state display.
        `}}}},P={render:()=>{const e=[{id:"cut",label:"Cut"},{id:"copy",label:"Copy"},{id:"paste",label:"Paste"}],o={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Independent Dropdowns"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Each Dropdown uses its own providerId."},attributes:{className:"text-sm text-gray-600 block"}},{id:"dropdowns-row",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"outer-dropdown",type:"Dropdown",state:{selectedId:"in-progress",open:!1},children:[{id:"outer-trigger",type:"DropdownTrigger",state:{providerId:"outer-dropdown"},children:[{id:"outer-btn",type:"Button",children:[{id:"outer-text",type:"Span",state:{text:"Main Menu"}}]}]},{id:"outer-content",type:"DropdownContent",state:{providerId:"outer-dropdown",side:"bottom",sideOffset:4},children:j.map((n,r)=>({id:`outer-item-${r}`,type:"DropdownItem",state:{providerId:"outer-dropdown",value:n.id,label:n.label}}))}]},{id:"inner-dropdown",type:"Dropdown",state:{selectedId:"copy",open:!1},children:[{id:"inner-trigger",type:"DropdownTrigger",state:{providerId:"inner-dropdown"},children:[{id:"inner-btn",type:"Button",state:{appearance:"subtle"},children:[{id:"inner-text",type:"Span",state:{text:"Edit Menu"}}]}]},{id:"inner-content",type:"DropdownContent",state:{providerId:"inner-dropdown",side:"bottom",sideOffset:4},children:e.map((n,r)=>({id:`inner-item-${r}`,type:"DropdownItem",state:{providerId:"inner-dropdown",value:n.id,label:n.label}}))}]}]},{id:"summary-box",type:"Div",attributes:{className:"p-3 bg-blue-50 rounded text-sm"},children:[{id:"summary-text",type:"Span",state:{text:"Main: "},attributes:{className:"text-blue-700"}},{id:"main-value",type:"ReferenceText",reference:"outer-dropdown",attributes:{className:"font-medium text-blue-800",options:j}},{id:"separator",type:"Span",state:{text:" | Edit: "},attributes:{className:"text-blue-500"}},{id:"edit-value",type:"ReferenceText",reference:"inner-dropdown",attributes:{className:"font-medium text-blue-800",options:e}}]}]}};return t.jsx(l,{document:o,components:b})},parameters:{docs:{description:{story:"\n## Independent Dropdowns with providerId\n\nEach Dropdown maintains its own state via its unique `id`. Child components use `state.providerId` to target which Dropdown to subscribe to.\n        "}}}},A={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4 p-4 border rounded-lg max-w-md"},children:[{id:"title",type:"Span",state:{text:"Custom Trigger Styles"},attributes:{className:"font-medium block"}},{id:"triggers-row",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"dropdown-primary",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-primary-trigger",type:"DropdownTrigger",children:[{id:"dropdown-primary-btn",type:"Button",state:{appearance:"primary"},children:[{id:"dropdown-primary-text",type:"Span",state:{text:"Primary"}}]}]},{id:"dropdown-primary-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-primary-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-primary-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-primary-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-primary-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-default",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-default-trigger",type:"DropdownTrigger",children:[{id:"dropdown-default-btn",type:"Button",state:{appearance:"default"},children:[{id:"dropdown-default-text",type:"Span",state:{text:"Default"}}]}]},{id:"dropdown-default-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-default-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-default-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-default-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-default-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]},{id:"dropdown-subtle",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dropdown-subtle-trigger",type:"DropdownTrigger",children:[{id:"dropdown-subtle-btn",type:"Button",state:{appearance:"subtle"},children:[{id:"dropdown-subtle-text",type:"Span",state:{text:"Subtle"}}]}]},{id:"dropdown-subtle-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dropdown-subtle-item-0",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dropdown-subtle-item-1",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dropdown-subtle-item-2",type:"DropdownItem",state:{value:"3",label:"Option 3"}},{id:"dropdown-subtle-item-3",type:"DropdownItem",state:{value:"4",label:"Option 4"}}]}]}]}]}};return t.jsx(l,{document:e,components:c})},parameters:{docs:{description:{story:`
## Custom Trigger Styles

The compound pattern allows any component as a trigger via the \`DropdownTrigger\` wrapper.
        `}}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-default',
        type: 'Dropdown',
        state: {
          selectedId: '1',
          open: false
        },
        children: [{
          id: 'dropdown-default-trigger',
          type: 'DropdownTrigger',
          children: [{
            id: 'dropdown-default-btn',
            type: 'Button',
            state: {
              appearance: 'default'
            },
            children: [{
              id: 'dropdown-default-value',
              type: 'DropdownValue',
              state: {
                placeholder: 'Default Style',
                options: [{
                  id: '1',
                  label: 'Option 1'
                }, {
                  id: '2',
                  label: 'Option 2'
                }, {
                  id: '3',
                  label: 'Option 3'
                }, {
                  id: '4',
                  label: 'Option 4'
                }]
              }
            }]
          }]
        }, {
          id: 'dropdown-default-content',
          type: 'DropdownContent',
          state: {
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'dropdown-default-item-0',
            type: 'DropdownItem',
            state: {
              value: '1',
              label: 'Option 1'
            }
          }, {
            id: 'dropdown-default-item-1',
            type: 'DropdownItem',
            state: {
              value: '2',
              label: 'Option 2'
            }
          }, {
            id: 'dropdown-default-item-2',
            type: 'DropdownItem',
            state: {
              value: '3',
              label: 'Option 3'
            }
          }, {
            id: 'dropdown-default-item-3',
            type: 'DropdownItem',
            state: {
              value: '4',
              label: 'Option 4'
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
## Default Appearance

Neutral button with border. Uses \\\`DropdownValue\\\` to display selected option.
        \`
      }
    }
  }
}`,...D.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-primary',
        type: 'Dropdown',
        state: {
          selectedId: '1',
          open: false
        },
        children: [{
          id: 'dropdown-primary-trigger',
          type: 'DropdownTrigger',
          children: [{
            id: 'dropdown-primary-btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'dropdown-primary-value',
              type: 'DropdownValue',
              state: {
                placeholder: 'Primary Style',
                options: [{
                  id: '1',
                  label: 'Option 1'
                }, {
                  id: '2',
                  label: 'Option 2'
                }, {
                  id: '3',
                  label: 'Option 3'
                }, {
                  id: '4',
                  label: 'Option 4'
                }]
              }
            }]
          }]
        }, {
          id: 'dropdown-primary-content',
          type: 'DropdownContent',
          state: {
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'dropdown-primary-item-0',
            type: 'DropdownItem',
            state: {
              value: '1',
              label: 'Option 1'
            }
          }, {
            id: 'dropdown-primary-item-1',
            type: 'DropdownItem',
            state: {
              value: '2',
              label: 'Option 2'
            }
          }, {
            id: 'dropdown-primary-item-2',
            type: 'DropdownItem',
            state: {
              value: '3',
              label: 'Option 3'
            }
          }, {
            id: 'dropdown-primary-item-3',
            type: 'DropdownItem',
            state: {
              value: '4',
              label: 'Option 4'
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
## Primary Appearance

Brand blue filled button trigger. Uses \\\`DropdownValue\\\` to display selected option.
        \`
      }
    }
  }
}`,...f.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-subtle',
        type: 'Dropdown',
        state: {
          selectedId: '1',
          open: false
        },
        children: [{
          id: 'dropdown-subtle-trigger',
          type: 'DropdownTrigger',
          children: [{
            id: 'dropdown-subtle-btn',
            type: 'Button',
            state: {
              appearance: 'subtle'
            },
            children: [{
              id: 'dropdown-subtle-value',
              type: 'DropdownValue',
              state: {
                placeholder: 'Subtle Style',
                options: [{
                  id: '1',
                  label: 'Option 1'
                }, {
                  id: '2',
                  label: 'Option 2'
                }, {
                  id: '3',
                  label: 'Option 3'
                }, {
                  id: '4',
                  label: 'Option 4'
                }]
              }
            }]
          }]
        }, {
          id: 'dropdown-subtle-content',
          type: 'DropdownContent',
          state: {
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'dropdown-subtle-item-0',
            type: 'DropdownItem',
            state: {
              value: '1',
              label: 'Option 1'
            }
          }, {
            id: 'dropdown-subtle-item-1',
            type: 'DropdownItem',
            state: {
              value: '2',
              label: 'Option 2'
            }
          }, {
            id: 'dropdown-subtle-item-2',
            type: 'DropdownItem',
            state: {
              value: '3',
              label: 'Option 3'
            }
          }, {
            id: 'dropdown-subtle-item-3',
            type: 'DropdownItem',
            state: {
              value: '4',
              label: 'Option 4'
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
## Subtle Appearance

Transparent button without border. Uses \\\`DropdownValue\\\` to display selected option.
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-1-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-1-btn',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'dropdown-1-value',
                type: 'DropdownValue',
                state: {
                  placeholder: 'Default',
                  options: [{
                    id: '1',
                    label: 'Option 1'
                  }, {
                    id: '2',
                    label: 'Option 2'
                  }, {
                    id: '3',
                    label: 'Option 3'
                  }, {
                    id: '4',
                    label: 'Option 4'
                  }]
                }
              }]
            }]
          }, {
            id: 'dropdown-1-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-1-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-1-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-1-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-1-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-2',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-2-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-2-btn',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'dropdown-2-value',
                type: 'DropdownValue',
                state: {
                  placeholder: 'Primary',
                  options: [{
                    id: '1',
                    label: 'Option 1'
                  }, {
                    id: '2',
                    label: 'Option 2'
                  }, {
                    id: '3',
                    label: 'Option 3'
                  }, {
                    id: '4',
                    label: 'Option 4'
                  }]
                }
              }]
            }]
          }, {
            id: 'dropdown-2-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-2-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-2-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-2-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-2-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-3',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-3-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-3-btn',
              type: 'Button',
              state: {
                appearance: 'subtle'
              },
              children: [{
                id: 'dropdown-3-value',
                type: 'DropdownValue',
                state: {
                  placeholder: 'Subtle',
                  options: [{
                    id: '1',
                    label: 'Option 1'
                  }, {
                    id: '2',
                    label: 'Option 2'
                  }, {
                    id: '3',
                    label: 'Option 3'
                  }, {
                    id: '4',
                    label: 'Option 4'
                  }]
                }
              }]
            }]
          }, {
            id: 'dropdown-3-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-3-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-3-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-3-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-3-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
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
## All Appearances Comparison

Side-by-side comparison of all appearance variants with dynamic labels.
        \`
      }
    }
  }
}`,...v.parameters?.docs?.source}}};I.parameters={...I.parameters,docs:{...I.parameters?.docs,source:{originalSource:`{
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
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'default-trigger',
            type: 'DropdownTrigger',
            state: {
              providerId: 'dropdown-default-spacing'
            },
            children: [{
              id: 'default-btn',
              type: 'Button',
              state: {
                spacing: 'default'
              },
              children: [{
                id: 'default-text',
                type: 'Span',
                state: {
                  text: 'Default (32px)'
                }
              }]
            }]
          }, {
            id: 'default-content',
            type: 'DropdownContent',
            state: {
              providerId: 'dropdown-default-spacing',
              side: 'bottom',
              sideOffset: 4
            },
            children: sampleOptions.map((opt, idx) => ({
              id: \`default-item-\${idx}\`,
              type: 'DropdownItem',
              state: {
                providerId: 'dropdown-default-spacing',
                value: opt.id,
                label: opt.label
              }
            }))
          }]
        }, {
          id: 'dropdown-compact-spacing',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'compact-trigger',
            type: 'DropdownTrigger',
            state: {
              providerId: 'dropdown-compact-spacing'
            },
            children: [{
              id: 'compact-btn',
              type: 'Button',
              state: {
                spacing: 'compact'
              },
              children: [{
                id: 'compact-text',
                type: 'Span',
                state: {
                  text: 'Compact (24px)'
                }
              }]
            }]
          }, {
            id: 'compact-content',
            type: 'DropdownContent',
            state: {
              providerId: 'dropdown-compact-spacing',
              side: 'bottom',
              sideOffset: 4,
              spacing: 'compact'
            },
            children: sampleOptions.map((opt, idx) => ({
              id: \`compact-item-\${idx}\`,
              type: 'DropdownItem',
              state: {
                providerId: 'dropdown-compact-spacing',
                value: opt.id,
                label: opt.label
              }
            }))
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
## Spacing Variants

Side-by-side comparison of default (32px) and compact (24px) spacing.
        \`
      }
    }
  }
}`,...I.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-enabled-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-enabled-btn',
              type: 'Button',
              state: {
                appearance: 'default',
                isDisabled: false
              },
              children: [{
                id: 'dropdown-enabled-text',
                type: 'Span',
                state: {
                  text: 'Enabled'
                }
              }]
            }]
          }, {
            id: 'dropdown-enabled-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-enabled-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-enabled-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-enabled-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-enabled-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-disabled',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-disabled-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-disabled-btn',
              type: 'Button',
              state: {
                appearance: 'default',
                isDisabled: true
              },
              children: [{
                id: 'dropdown-disabled-text',
                type: 'Span',
                state: {
                  text: 'Disabled'
                }
              }]
            }]
          }, {
            id: 'dropdown-disabled-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-disabled-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-disabled-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-disabled-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-disabled-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
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
## Disabled State

Comparison of enabled and disabled dropdown triggers.
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-disabled-options',
        type: 'Dropdown',
        state: {
          selectedId: '1',
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DropdownTrigger',
          state: {
            providerId: 'dropdown-disabled-options'
          },
          children: [{
            id: 'btn',
            type: 'Button',
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Options with Disabled'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'DropdownContent',
          state: {
            providerId: 'dropdown-disabled-options',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'item-0',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-disabled-options',
              value: '1',
              label: 'Available Option 1'
            }
          }, {
            id: 'item-1',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-disabled-options',
              value: '2',
              label: 'Disabled Option',
              disabled: true
            }
          }, {
            id: 'item-2',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-disabled-options',
              value: '3',
              label: 'Available Option 2'
            }
          }, {
            id: 'item-3',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-disabled-options',
              value: '4',
              label: 'Another Disabled',
              disabled: true
            }
          }, {
            id: 'item-4',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-disabled-options',
              value: '5',
              label: 'Available Option 3'
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
## Options with Disabled Items

Individual options can be disabled while keeping the dropdown functional.
        \`
      }
    }
  }
}`,...O.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-wrap gap-4 p-8'
        },
        children: [{
          id: 'dropdown-bottom',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-bottom-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-bottom-btn',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'dropdown-bottom-text',
                type: 'Span',
                state: {
                  text: 'Bottom ↓'
                }
              }]
            }]
          }, {
            id: 'dropdown-bottom-content',
            type: 'DropdownContent',
            state: {
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-bottom-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-bottom-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-bottom-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-bottom-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-top',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-top-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-top-btn',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'dropdown-top-text',
                type: 'Span',
                state: {
                  text: 'Top ↑'
                }
              }]
            }]
          }, {
            id: 'dropdown-top-content',
            type: 'DropdownContent',
            state: {
              side: 'top',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-top-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-top-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-top-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-top-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-left',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-left-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-left-btn',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'dropdown-left-text',
                type: 'Span',
                state: {
                  text: '← Left'
                }
              }]
            }]
          }, {
            id: 'dropdown-left-content',
            type: 'DropdownContent',
            state: {
              side: 'left',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-left-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-left-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-left-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-left-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
          }]
        }, {
          id: 'dropdown-right',
          type: 'Dropdown',
          state: {
            selectedId: '1',
            open: false
          },
          children: [{
            id: 'dropdown-right-trigger',
            type: 'DropdownTrigger',
            children: [{
              id: 'dropdown-right-btn',
              type: 'Button',
              state: {
                appearance: 'default'
              },
              children: [{
                id: 'dropdown-right-text',
                type: 'Span',
                state: {
                  text: 'Right →'
                }
              }]
            }]
          }, {
            id: 'dropdown-right-content',
            type: 'DropdownContent',
            state: {
              side: 'right',
              sideOffset: 4
            },
            children: [{
              id: 'dropdown-right-item-0',
              type: 'DropdownItem',
              state: {
                value: '1',
                label: 'Option 1'
              }
            }, {
              id: 'dropdown-right-item-1',
              type: 'DropdownItem',
              state: {
                value: '2',
                label: 'Option 2'
              }
            }, {
              id: 'dropdown-right-item-2',
              type: 'DropdownItem',
              state: {
                value: '3',
                label: 'Option 3'
              }
            }, {
              id: 'dropdown-right-item-3',
              type: 'DropdownItem',
              state: {
                value: '4',
                label: 'Option 4'
              }
            }]
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
## Placement Options

Control where the menu appears relative to the trigger button.

- \\\`bottom\\\`: Below trigger (default)
- \\\`top\\\`: Above trigger
- \\\`left\\\`: Left of trigger
- \\\`right\\\`: Right of trigger
        \`
      }
    }
  }
}`,...S.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
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
            text: 'Reference Pattern Example'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'The dropdown selection updates the display below via SDUI reference.'
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
            state: {
              selectedId: 'medium',
              open: false
            },
            children: [{
              id: 'priority-dropdown-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'priority-dropdown-btn',
                type: 'Button',
                state: {
                  appearance: 'primary'
                },
                children: [{
                  id: 'priority-dropdown-text',
                  type: 'Span',
                  state: {
                    text: 'Select Priority'
                  }
                }]
              }]
            }, {
              id: 'priority-dropdown-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'priority-dropdown-item-0',
                type: 'DropdownItem',
                state: {
                  value: 'highest',
                  label: 'Highest'
                }
              }, {
                id: 'priority-dropdown-item-1',
                type: 'DropdownItem',
                state: {
                  value: 'high',
                  label: 'High'
                }
              }, {
                id: 'priority-dropdown-item-2',
                type: 'DropdownItem',
                state: {
                  value: 'medium',
                  label: 'Medium'
                }
              }, {
                id: 'priority-dropdown-item-3',
                type: 'DropdownItem',
                state: {
                  value: 'low',
                  label: 'Low'
                }
              }, {
                id: 'priority-dropdown-item-4',
                type: 'DropdownItem',
                state: {
                  value: 'lowest',
                  label: 'Lowest'
                }
              }]
            }]
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
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={extendedSduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Reference Pattern

Uses \\\`useSduiNodeReference\\\` hook to subscribe to dropdown state changes.

The \\\`ReferenceText\\\` component displays the currently selected value from the referenced dropdown.
        \`
      }
    }
  }
}`,...C.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
            text: 'Cascading Dropdowns'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'Two dropdowns with selections displayed via reference.'
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
              state: {
                selectedId: 'frontend',
                open: false
              },
              children: [{
                id: 'category-dropdown-trigger',
                type: 'DropdownTrigger',
                children: [{
                  id: 'category-dropdown-btn',
                  type: 'Button',
                  state: {
                    appearance: 'default'
                  },
                  children: [{
                    id: 'category-dropdown-text',
                    type: 'Span',
                    state: {
                      text: 'Select category'
                    }
                  }]
                }]
              }, {
                id: 'category-dropdown-content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                  sideOffset: 4
                },
                children: [{
                  id: 'category-dropdown-item-0',
                  type: 'DropdownItem',
                  state: {
                    value: 'frontend',
                    label: 'Frontend'
                  }
                }, {
                  id: 'category-dropdown-item-1',
                  type: 'DropdownItem',
                  state: {
                    value: 'backend',
                    label: 'Backend'
                  }
                }, {
                  id: 'category-dropdown-item-2',
                  type: 'DropdownItem',
                  state: {
                    value: 'devops',
                    label: 'DevOps'
                  }
                }]
              }]
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
              state: {
                selectedId: 'react',
                open: false
              },
              children: [{
                id: 'tech-dropdown-trigger',
                type: 'DropdownTrigger',
                children: [{
                  id: 'tech-dropdown-btn',
                  type: 'Button',
                  state: {
                    appearance: 'default'
                  },
                  children: [{
                    id: 'tech-dropdown-text',
                    type: 'Span',
                    state: {
                      text: 'Select technology'
                    }
                  }]
                }]
              }, {
                id: 'tech-dropdown-content',
                type: 'DropdownContent',
                state: {
                  side: 'bottom',
                  sideOffset: 4
                },
                children: [{
                  id: 'tech-dropdown-item-0',
                  type: 'DropdownItem',
                  state: {
                    value: 'react',
                    label: 'React'
                  }
                }, {
                  id: 'tech-dropdown-item-1',
                  type: 'DropdownItem',
                  state: {
                    value: 'vue',
                    label: 'Vue'
                  }
                }, {
                  id: 'tech-dropdown-item-2',
                  type: 'DropdownItem',
                  state: {
                    value: 'angular',
                    label: 'Angular'
                  }
                }]
              }]
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
## Cascading Dropdowns

Both dropdowns' selections are displayed in the summary using \\\`ReferenceText\\\` components.
        \`
      }
    }
  }
}`,...N.parameters?.docs?.source}}};T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
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
            text: 'Multiple References'
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
            state: {
              selectedId: 'in-progress',
              open: false
            },
            children: [{
              id: 'status-dropdown-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'status-dropdown-btn',
                type: 'Button',
                state: {
                  appearance: 'default'
                },
                children: [{
                  id: 'status-dropdown-text',
                  type: 'Span',
                  state: {
                    text: 'Status'
                  }
                }]
              }]
            }, {
              id: 'status-dropdown-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'status-dropdown-item-0',
                type: 'DropdownItem',
                state: {
                  value: 'open',
                  label: 'Open'
                }
              }, {
                id: 'status-dropdown-item-1',
                type: 'DropdownItem',
                state: {
                  value: 'in-progress',
                  label: 'In Progress'
                }
              }, {
                id: 'status-dropdown-item-2',
                type: 'DropdownItem',
                state: {
                  value: 'review',
                  label: 'In Review'
                }
              }, {
                id: 'status-dropdown-item-3',
                type: 'DropdownItem',
                state: {
                  value: 'done',
                  label: 'Done'
                }
              }, {
                id: 'status-dropdown-item-4',
                type: 'DropdownItem',
                state: {
                  value: 'closed',
                  label: 'Closed'
                }
              }]
            }]
          }, {
            id: 'priority-dropdown-2',
            type: 'Dropdown',
            state: {
              selectedId: 'high',
              open: false
            },
            children: [{
              id: 'priority-dropdown-2-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'priority-dropdown-2-btn',
                type: 'Button',
                state: {
                  appearance: 'default'
                },
                children: [{
                  id: 'priority-dropdown-2-text',
                  type: 'Span',
                  state: {
                    text: 'Priority'
                  }
                }]
              }]
            }, {
              id: 'priority-dropdown-2-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'priority-dropdown-2-item-0',
                type: 'DropdownItem',
                state: {
                  value: 'highest',
                  label: 'Highest'
                }
              }, {
                id: 'priority-dropdown-2-item-1',
                type: 'DropdownItem',
                state: {
                  value: 'high',
                  label: 'High'
                }
              }, {
                id: 'priority-dropdown-2-item-2',
                type: 'DropdownItem',
                state: {
                  value: 'medium',
                  label: 'Medium'
                }
              }, {
                id: 'priority-dropdown-2-item-3',
                type: 'DropdownItem',
                state: {
                  value: 'low',
                  label: 'Low'
                }
              }, {
                id: 'priority-dropdown-2-item-4',
                type: 'DropdownItem',
                state: {
                  value: 'lowest',
                  label: 'Lowest'
                }
              }]
            }]
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
            reference: ['status-dropdown', 'priority-dropdown-2'],
            attributes: {
              className: 'text-sm text-yellow-700 space-y-1',
              optionsMap: {
                'status-dropdown': statusOptions,
                'priority-dropdown-2': priorityOptions
              }
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
## Multiple References

The \\\`ReferenceDisplay\\\` component demonstrates referencing multiple dropdowns:

\\\`\\\`\\\`json
{
  "type": "ReferenceDisplay",
  "reference": ["status-dropdown", "priority-dropdown"]
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...T.parameters?.docs?.source}}};R.parameters={...R.parameters,docs:{...R.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dropdown-root',
        type: 'Dropdown',
        state: {
          selectedId: 'option-1',
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DropdownTrigger',
          state: {
            providerId: 'dropdown-root'
          },
          children: [{
            id: 'trigger-btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'trigger-text',
              type: 'Span',
              state: {
                text: 'Custom Button Trigger'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'DropdownContent',
          state: {
            providerId: 'dropdown-root',
            side: 'bottom',
            sideOffset: 4,
            align: 'start'
          },
          children: [{
            id: 'item-1',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-root',
              value: 'option-1',
              label: 'Option 1'
            }
          }, {
            id: 'item-2',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-root',
              value: 'option-2',
              label: 'Option 2'
            }
          }, {
            id: 'item-3',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-root',
              value: 'option-3',
              label: 'Option 3'
            }
          }, {
            id: 'item-4',
            type: 'DropdownItem',
            state: {
              providerId: 'dropdown-root',
              value: 'option-4',
              label: 'Option 4',
              disabled: true
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
## Compound Pattern with providerId

The basic compound pattern structure:

\\\`\\\`\\\`json
{
  "type": "Dropdown",
  "id": "dropdown-root",
  "state": { "selectedId": "option-1", "open": false },
  "children": [
    { "type": "DropdownTrigger", "state": { "providerId": "dropdown-root" } },
    { "type": "DropdownContent", "state": { "providerId": "dropdown-root" },
      "children": [
        { "type": "DropdownItem", "state": { "providerId": "dropdown-root", "value": "opt-1", "label": "Option 1" } }
      ]
    }
  ]
}
\\\`\\\`\\\`

### Key Points:
- All child components use \\\`state.providerId\\\` to subscribe to the parent Dropdown's state
- Radix UI props (\\\`side\\\`, \\\`sideOffset\\\`, \\\`disabled\\\`) go in \\\`state\\\`, not \\\`attributes\\\`
        \`
      }
    }
  }
}`,...R.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
            text: 'Compound Pattern + Reference'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'dropdown-compound',
          type: 'Dropdown',
          state: {
            selectedId: 'medium',
            open: false
          },
          children: [{
            id: 'trigger',
            type: 'DropdownTrigger',
            state: {
              providerId: 'dropdown-compound'
            },
            children: [{
              id: 'trigger-btn',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'trigger-text',
                type: 'Span',
                state: {
                  text: 'Select Priority'
                }
              }]
            }]
          }, {
            id: 'content',
            type: 'DropdownContent',
            state: {
              providerId: 'dropdown-compound',
              side: 'bottom',
              sideOffset: 4
            },
            children: priorityOptions.map((opt, idx) => ({
              id: \`priority-item-\${idx}\`,
              type: 'DropdownItem',
              state: {
                providerId: 'dropdown-compound',
                value: opt.id,
                label: opt.label
              }
            }))
          }]
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
              text: 'Selected: '
            },
            attributes: {
              className: 'text-gray-600'
            }
          }, {
            id: 'result-value',
            type: 'ReferenceText',
            reference: 'dropdown-compound',
            attributes: {
              className: 'font-semibold text-gray-900',
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
## Compound Pattern with Reference

Combines compound pattern (providerId) with reference for external state display.
        \`
      }
    }
  }
}`,...B.parameters?.docs?.source}}};P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    const subMenuOptions = [{
      id: 'cut',
      label: 'Cut'
    }, {
      id: 'copy',
      label: 'Copy'
    }, {
      id: 'paste',
      label: 'Paste'
    }];
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
            text: 'Independent Dropdowns'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'desc',
          type: 'Span',
          state: {
            text: 'Each Dropdown uses its own providerId.'
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
            id: 'outer-dropdown',
            type: 'Dropdown',
            state: {
              selectedId: 'in-progress',
              open: false
            },
            children: [{
              id: 'outer-trigger',
              type: 'DropdownTrigger',
              state: {
                providerId: 'outer-dropdown'
              },
              children: [{
                id: 'outer-btn',
                type: 'Button',
                children: [{
                  id: 'outer-text',
                  type: 'Span',
                  state: {
                    text: 'Main Menu'
                  }
                }]
              }]
            }, {
              id: 'outer-content',
              type: 'DropdownContent',
              state: {
                providerId: 'outer-dropdown',
                side: 'bottom',
                sideOffset: 4
              },
              children: statusOptions.map((opt, idx) => ({
                id: \`outer-item-\${idx}\`,
                type: 'DropdownItem',
                state: {
                  providerId: 'outer-dropdown',
                  value: opt.id,
                  label: opt.label
                }
              }))
            }]
          }, {
            id: 'inner-dropdown',
            type: 'Dropdown',
            state: {
              selectedId: 'copy',
              open: false
            },
            children: [{
              id: 'inner-trigger',
              type: 'DropdownTrigger',
              state: {
                providerId: 'inner-dropdown'
              },
              children: [{
                id: 'inner-btn',
                type: 'Button',
                state: {
                  appearance: 'subtle'
                },
                children: [{
                  id: 'inner-text',
                  type: 'Span',
                  state: {
                    text: 'Edit Menu'
                  }
                }]
              }]
            }, {
              id: 'inner-content',
              type: 'DropdownContent',
              state: {
                providerId: 'inner-dropdown',
                side: 'bottom',
                sideOffset: 4
              },
              children: subMenuOptions.map((opt, idx) => ({
                id: \`inner-item-\${idx}\`,
                type: 'DropdownItem',
                state: {
                  providerId: 'inner-dropdown',
                  value: opt.id,
                  label: opt.label
                }
              }))
            }]
          }]
        }, {
          id: 'summary-box',
          type: 'Div',
          attributes: {
            className: 'p-3 bg-blue-50 rounded text-sm'
          },
          children: [{
            id: 'summary-text',
            type: 'Span',
            state: {
              text: 'Main: '
            },
            attributes: {
              className: 'text-blue-700'
            }
          }, {
            id: 'main-value',
            type: 'ReferenceText',
            reference: 'outer-dropdown',
            attributes: {
              className: 'font-medium text-blue-800',
              options: statusOptions
            }
          }, {
            id: 'separator',
            type: 'Span',
            state: {
              text: ' | Edit: '
            },
            attributes: {
              className: 'text-blue-500'
            }
          }, {
            id: 'edit-value',
            type: 'ReferenceText',
            reference: 'inner-dropdown',
            attributes: {
              className: 'font-medium text-blue-800',
              options: subMenuOptions
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
## Independent Dropdowns with providerId

Each Dropdown maintains its own state via its unique \\\`id\\\`. Child components use \\\`state.providerId\\\` to target which Dropdown to subscribe to.
        \`
      }
    }
  }
}`,...P.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
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
            text: 'Custom Trigger Styles'
          },
          attributes: {
            className: 'font-medium block'
          }
        }, {
          id: 'triggers-row',
          type: 'Div',
          attributes: {
            className: 'flex items-center gap-4'
          },
          children: [{
            id: 'dropdown-primary',
            type: 'Dropdown',
            state: {
              selectedId: '1',
              open: false
            },
            children: [{
              id: 'dropdown-primary-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'dropdown-primary-btn',
                type: 'Button',
                state: {
                  appearance: 'primary'
                },
                children: [{
                  id: 'dropdown-primary-text',
                  type: 'Span',
                  state: {
                    text: 'Primary'
                  }
                }]
              }]
            }, {
              id: 'dropdown-primary-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'dropdown-primary-item-0',
                type: 'DropdownItem',
                state: {
                  value: '1',
                  label: 'Option 1'
                }
              }, {
                id: 'dropdown-primary-item-1',
                type: 'DropdownItem',
                state: {
                  value: '2',
                  label: 'Option 2'
                }
              }, {
                id: 'dropdown-primary-item-2',
                type: 'DropdownItem',
                state: {
                  value: '3',
                  label: 'Option 3'
                }
              }, {
                id: 'dropdown-primary-item-3',
                type: 'DropdownItem',
                state: {
                  value: '4',
                  label: 'Option 4'
                }
              }]
            }]
          }, {
            id: 'dropdown-default',
            type: 'Dropdown',
            state: {
              selectedId: '1',
              open: false
            },
            children: [{
              id: 'dropdown-default-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'dropdown-default-btn',
                type: 'Button',
                state: {
                  appearance: 'default'
                },
                children: [{
                  id: 'dropdown-default-text',
                  type: 'Span',
                  state: {
                    text: 'Default'
                  }
                }]
              }]
            }, {
              id: 'dropdown-default-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'dropdown-default-item-0',
                type: 'DropdownItem',
                state: {
                  value: '1',
                  label: 'Option 1'
                }
              }, {
                id: 'dropdown-default-item-1',
                type: 'DropdownItem',
                state: {
                  value: '2',
                  label: 'Option 2'
                }
              }, {
                id: 'dropdown-default-item-2',
                type: 'DropdownItem',
                state: {
                  value: '3',
                  label: 'Option 3'
                }
              }, {
                id: 'dropdown-default-item-3',
                type: 'DropdownItem',
                state: {
                  value: '4',
                  label: 'Option 4'
                }
              }]
            }]
          }, {
            id: 'dropdown-subtle',
            type: 'Dropdown',
            state: {
              selectedId: '1',
              open: false
            },
            children: [{
              id: 'dropdown-subtle-trigger',
              type: 'DropdownTrigger',
              children: [{
                id: 'dropdown-subtle-btn',
                type: 'Button',
                state: {
                  appearance: 'subtle'
                },
                children: [{
                  id: 'dropdown-subtle-text',
                  type: 'Span',
                  state: {
                    text: 'Subtle'
                  }
                }]
              }]
            }, {
              id: 'dropdown-subtle-content',
              type: 'DropdownContent',
              state: {
                side: 'bottom',
                sideOffset: 4
              },
              children: [{
                id: 'dropdown-subtle-item-0',
                type: 'DropdownItem',
                state: {
                  value: '1',
                  label: 'Option 1'
                }
              }, {
                id: 'dropdown-subtle-item-1',
                type: 'DropdownItem',
                state: {
                  value: '2',
                  label: 'Option 2'
                }
              }, {
                id: 'dropdown-subtle-item-2',
                type: 'DropdownItem',
                state: {
                  value: '3',
                  label: 'Option 3'
                }
              }, {
                id: 'dropdown-subtle-item-3',
                type: 'DropdownItem',
                state: {
                  value: '4',
                  label: 'Option 4'
                }
              }]
            }]
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
## Custom Trigger Styles

The compound pattern allows any component as a trigger via the \\\`DropdownTrigger\\\` wrapper.
        \`
      }
    }
  }
}`,...A.parameters?.docs?.source}}};const ee=["AppearanceDefault","AppearancePrimary","AppearanceSubtle","AllAppearances","AllSpacings","Disabled","WithDisabledOptions","PlacementExamples","WithReferenceSdui","CascadingDropdownsSdui","MultipleReferencesSdui","CompoundPatternSdui","CompoundWithReferenceSdui","NestedDropdownsSdui","CustomTriggerSdui"];export{v as AllAppearances,I as AllSpacings,D as AppearanceDefault,f as AppearancePrimary,h as AppearanceSubtle,N as CascadingDropdownsSdui,R as CompoundPatternSdui,B as CompoundWithReferenceSdui,A as CustomTriggerSdui,x as Disabled,T as MultipleReferencesSdui,P as NestedDropdownsSdui,S as PlacementExamples,O as WithDisabledOptions,C as WithReferenceSdui,ee as __namedExportsOrder,Z as default};
