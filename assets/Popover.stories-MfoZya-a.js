import{j as t}from"./jsx-runtime-CkluYul2.js";import{P as h,S as n,s as o}from"./sduiComponents-DBXH7IzB.js";import"./iframe-CebLDH8b.js";import"./preload-helper-ggYluGXI.js";import"./index-Bh4ZuiZd.js";import"./index-C_gPOmRA.js";const w={title:"Shared/UI/Popover",component:h.Root,tags:["autodocs"],argTypes:{open:{control:"boolean",description:"Whether the popover is open (controlled)"},modal:{control:"boolean",description:"Whether to enable modal behavior"}},parameters:{docs:{description:{component:`
## Overview

The **Popover** component displays contextual content on trigger. It uses Radix UI Popover primitive for full accessibility support.

## Compound Pattern Structure

\`\`\`json
{
  "id": "popover-root",
  "type": "Popover",
  "state": { "open": false },
  "children": [
    {
      "id": "trigger",
      "type": "PopoverTrigger",
      "children": [
        {
          "id": "trigger-btn",
          "type": "Button",
          "state": { "appearance": "primary" },
          "children": [
            { "id": "btn-text", "type": "Span", "state": { "text": "Open Popover" } }
          ]
        }
      ]
    },
    {
      "id": "content",
      "type": "PopoverContent",
      "state": { "size": "medium", "side": "bottom", "sideOffset": 4 },
      "children": [
        {
          "id": "content-inner",
          "type": "Div",
          "attributes": { "className": "space-y-2" },
          "children": [
            { "id": "title", "type": "Span", "state": { "text": "Popover Title" } },
            { "id": "desc", "type": "Span", "state": { "text": "Content here..." } },
            { "id": "close", "type": "PopoverClose" }
          ]
        }
      ]
    }
  ]
}
\`\`\`

---

## Why Provider Pattern?

### The Problem

In SDUI, components are rendered from JSON documents. Unlike React components that share state via props drilling or Context, SDUI nodes are **isolated** - each node only knows its own \`id\`, \`state\`, and \`attributes\`.

**How does a PopoverTrigger know which Popover's \`open\` state to toggle?**
**How does a PopoverClose button know which Popover to close?**

### The Solution: Provider Pattern

The **Provider Pattern** solves this by:

1. **Provider (Root)**: The \`Popover\` component holds shared state (\`open\`)
2. **Subscriber (Children)**: Child components subscribe to the provider's state via \`providerId\`

\`\`\`
┌─────────────────────────────────────────────┐
│  Popover (id: "popover-root")               │
│  state: { open: false }                     │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  PopoverTrigger                     │    │
│  │  → subscribes to "popover-root"     │    │
│  │  → toggles open state on click      │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │  PopoverContent                     │    │
│  │  → renders when open is true        │    │
│  │  └─────────────────────────────┐    │    │
│  │    PopoverClose                │    │    │
│  │    → subscribes to root        │    │    │
│  │    → sets open to false        │    │    │
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

---

## providerId Inheritance

**providerId is optional!** Child components automatically inherit from parent Popover context.

### How it works:

1. If \`state.providerId\` is specified → use that explicit ID
2. If omitted → inherit from nearest parent \`Popover\` via React Context

### When to use explicit providerId:

- **Nested popovers**: Inner popover's children should reference the inner provider
- **Cross-referencing**: A component outside the tree needs to reference a specific popover
- **Dynamic scenarios**: Provider ID changes at runtime

---

## Key Rules

| Field | Location | Examples |
|-------|----------|----------|
| HTML attributes | \`attributes\` | \`className\`, \`id\`, \`style\`, \`data-*\` |
| Radix UI props | \`state\` | \`size\`, \`side\`, \`sideOffset\`, \`align\` |
| SDUI-specific | \`state\` | \`providerId\` (optional), \`open\` |

## Features

- Compound component pattern for maximum flexibility
- Automatic providerId inheritance from parent context
- Keyboard navigation (Escape to close)
- Click outside to close
- Focus trap and restoration
- ARIA attributes for screen readers
- SDUI template integration
        `}}}},i={render:()=>{const e={version:"1.0.0",root:{id:"popover-basic",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open Popover"}}]}]},{id:"content",type:"PopoverContent",state:{size:"medium",side:"bottom",sideOffset:4},children:[{id:"content-inner",type:"Div",attributes:{className:"space-y-2"},children:[{id:"title",type:"Span",state:{text:"Popover Title"},attributes:{className:"font-semibold block"}},{id:"desc",type:"Span",state:{text:"This is the popover content. Click outside to close."},attributes:{className:"text-sm text-gray-600 block"}}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Basic Popover

A simple popover with trigger button and content.
        `}}}},s={render:()=>{const e={version:"1.0.0",root:{id:"popover-small",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"btn",type:"Button",children:[{id:"text",type:"Span",state:{text:"Small Popover"}}]}]},{id:"content",type:"PopoverContent",state:{size:"small",side:"bottom",sideOffset:4},children:[{id:"text",type:"Span",state:{text:"Small size (192px width)"}}]}]}};return t.jsx(n,{document:e,components:o})}},a={render:()=>{const e={version:"1.0.0",root:{id:"popover-medium",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"btn",type:"Button",children:[{id:"text",type:"Span",state:{text:"Medium Popover"}}]}]},{id:"content",type:"PopoverContent",state:{size:"medium",side:"bottom",sideOffset:4},children:[{id:"text",type:"Span",state:{text:"Medium size (256px width) - Default"}}]}]}};return t.jsx(n,{document:e,components:o})}},p={render:()=>{const e={version:"1.0.0",root:{id:"popover-large",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"btn",type:"Button",children:[{id:"text",type:"Span",state:{text:"Large Popover"}}]}]},{id:"content",type:"PopoverContent",state:{size:"large",side:"bottom",sideOffset:4},children:[{id:"text",type:"Span",state:{text:"Large size (320px width)"}}]}]}};return t.jsx(n,{document:e,components:o})}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex gap-4 flex-wrap"},children:[{id:"popover-small",type:"Popover",state:{open:!1},children:[{id:"trigger-small",type:"PopoverTrigger",children:[{id:"btn-small",type:"Button",children:[{id:"text-small",type:"Span",state:{text:"Small"}}]}]},{id:"content-small",type:"PopoverContent",state:{size:"small",side:"bottom",sideOffset:4},children:[{id:"desc-small",type:"Span",state:{text:"Small: 192px width"}}]}]},{id:"popover-medium",type:"Popover",state:{open:!1},children:[{id:"trigger-medium",type:"PopoverTrigger",children:[{id:"btn-medium",type:"Button",children:[{id:"text-medium",type:"Span",state:{text:"Medium"}}]}]},{id:"content-medium",type:"PopoverContent",state:{size:"medium",side:"bottom",sideOffset:4},children:[{id:"desc-medium",type:"Span",state:{text:"Medium: 256px width (default)"}}]}]},{id:"popover-large",type:"Popover",state:{open:!1},children:[{id:"trigger-large",type:"PopoverTrigger",children:[{id:"btn-large",type:"Button",children:[{id:"text-large",type:"Span",state:{text:"Large"}}]}]},{id:"content-large",type:"PopoverContent",state:{size:"large",side:"bottom",sideOffset:4},children:[{id:"desc-large",type:"Span",state:{text:"Large: 320px width"}}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Size Variants

| Size | Width |
|------|-------|
| small | 192px |
| medium | 256px (default) |
| large | 320px |
        `}}}},c={render:()=>{const e=(r,g,v)=>({id:`popover-${r}`,type:"Popover",state:{open:!1},children:[{id:`trigger-${r}`,type:"PopoverTrigger",children:[{id:`btn-${r}`,type:"Button",children:[{id:`text-${r}`,type:"Span",state:{text:v}}]}]},{id:`content-${r}`,type:"PopoverContent",state:{size:"small",side:g,sideOffset:8},children:[{id:`desc-${r}`,type:"Span",state:{text:`Side: ${g}`}}]}]}),y={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex gap-4 flex-wrap items-center justify-center p-8"},children:[e("top","top","↑ Top"),e("right","right","→ Right"),e("bottom","bottom","↓ Bottom"),e("left","left","← Left")]}};return t.jsx(n,{document:y,components:o})},parameters:{docs:{description:{story:"\n## Placement Options\n\nUse `side` prop in state to control popover position:\n- `top`: Above the trigger\n- `right`: Right of the trigger\n- `bottom`: Below the trigger (default)\n- `left`: Left of the trigger\n        "}}}},l={render:()=>{const e={version:"1.0.0",root:{id:"popover-close",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open with Close Button"}}]}]},{id:"content",type:"PopoverContent",state:{size:"medium",side:"bottom",sideOffset:4},children:[{id:"content-inner",type:"Div",attributes:{className:"relative"},children:[{id:"close",type:"PopoverClose"},{id:"body",type:"Div",attributes:{className:"pr-6 space-y-2"},children:[{id:"title",type:"Span",state:{text:"Popover with Close"},attributes:{className:"font-semibold block"}},{id:"desc",type:"Span",state:{text:"Click the X button or outside to close."},attributes:{className:"text-sm text-gray-600 block"}}]}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## With Close Button

Add a \`PopoverClose\` component inside the content for an explicit close button.
        `}}}},m={render:()=>{const e={version:"1.0.0",root:{id:"popover-compound",type:"Popover",state:{open:!1},children:[{id:"trigger",type:"PopoverTrigger",children:[{id:"trigger-btn",type:"Button",state:{appearance:"primary"},children:[{id:"trigger-text",type:"Span",state:{text:"User Settings"}}]}]},{id:"content",type:"PopoverContent",state:{size:"large",side:"bottom",sideOffset:4,align:"start"},children:[{id:"settings-form",type:"Div",attributes:{className:"space-y-4"},children:[{id:"header",type:"Div",attributes:{className:"flex justify-between items-center"},children:[{id:"title",type:"Span",state:{text:"Settings"},attributes:{className:"font-semibold"}},{id:"close",type:"PopoverClose"}]},{id:"settings-content",type:"Div",attributes:{className:"space-y-3"},children:[{id:"setting-1",type:"Div",attributes:{className:"flex justify-between items-center"},children:[{id:"label-1",type:"Span",state:{text:"Enable notifications"},attributes:{className:"text-sm"}},{id:"toggle-1",type:"Toggle",state:{isChecked:!0,size:"regular"}}]},{id:"setting-2",type:"Div",attributes:{className:"flex justify-between items-center"},children:[{id:"label-2",type:"Span",state:{text:"Dark mode"},attributes:{className:"text-sm"}},{id:"toggle-2",type:"Toggle",state:{isChecked:!1,size:"regular"}}]}]}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Compound Pattern with providerId Inheritance

In this example, \`PopoverTrigger\`, \`PopoverContent\`, and \`PopoverClose\` all automatically inherit the \`providerId\` from their parent \`Popover\` component.

No explicit \`providerId\` is needed in child components' state.

\`\`\`json
{
  "id": "popover-compound",
  "type": "Popover",
  "state": { "open": false },
  "children": [
    {
      "id": "trigger",
      "type": "PopoverTrigger",
      "children": [
        {
          "id": "trigger-btn",
          "type": "Button",
          "state": { "appearance": "primary" },
          "children": [
            { "id": "btn-text", "type": "Span", "state": { "text": "User Settings" } }
          ]
        }
      ]
    },
    {
      "id": "content",
      "type": "PopoverContent",
      "state": { "size": "large", "side": "bottom", "sideOffset": 4 },
      "children": [
        {
          "id": "header",
          "type": "Div",
          "attributes": { "className": "flex justify-between items-center" },
          "children": [
            { "id": "title", "type": "Span", "state": { "text": "Settings" } },
            { "id": "close", "type": "PopoverClose" }
          ]
        },
        {
          "id": "body",
          "type": "Div",
          "children": [
            { "id": "setting-label", "type": "Span", "state": { "text": "Enable notifications" } },
            { "id": "toggle", "type": "Toggle", "state": { "isChecked": true } }
          ]
        }
      ]
    }
  ]
}
\`\`\`
        `}}}},u={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"space-y-4"},children:[{id:"header",type:"Div",children:[{id:"title",type:"Span",state:{text:"Multiple Independent Popovers"},attributes:{className:"font-medium block"}},{id:"desc",type:"Span",state:{text:"Each Popover uses its own providerId via context."},attributes:{className:"text-sm text-gray-600 block"}}]},{id:"popovers-row",type:"Div",attributes:{className:"flex gap-4"},children:[{id:"popover-info",type:"Popover",state:{open:!1},children:[{id:"trigger-info",type:"PopoverTrigger",children:[{id:"btn-info",type:"Button",children:[{id:"text-info",type:"Span",state:{text:"Info"}}]}]},{id:"content-info",type:"PopoverContent",state:{size:"small",side:"bottom"},children:[{id:"info-text",type:"Span",state:{text:"Information popover"},attributes:{className:"text-blue-600"}}]}]},{id:"popover-warning",type:"Popover",state:{open:!1},children:[{id:"trigger-warning",type:"PopoverTrigger",children:[{id:"btn-warning",type:"Button",state:{appearance:"warning"},children:[{id:"text-warning",type:"Span",state:{text:"Warning"}}]}]},{id:"content-warning",type:"PopoverContent",state:{size:"small",side:"bottom"},children:[{id:"warning-text",type:"Span",state:{text:"Warning popover"},attributes:{className:"text-yellow-600"}}]}]},{id:"popover-danger",type:"Popover",state:{open:!1},children:[{id:"trigger-danger",type:"PopoverTrigger",children:[{id:"btn-danger",type:"Button",state:{appearance:"danger"},children:[{id:"text-danger",type:"Span",state:{text:"Danger"}}]}]},{id:"content-danger",type:"PopoverContent",state:{size:"small",side:"bottom"},children:[{id:"danger-text",type:"Span",state:{text:"Danger popover"},attributes:{className:"text-red-600"}}]}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Multiple Independent Popovers

Each Popover component is independent with its own state. Child components inherit \`providerId\` from their respective parent Popover via Context.
        `}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-basic',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open Popover'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'medium',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'content-inner',
            type: 'Div',
            attributes: {
              className: 'space-y-2'
            },
            children: [{
              id: 'title',
              type: 'Span',
              state: {
                text: 'Popover Title'
              },
              attributes: {
                className: 'font-semibold block'
              }
            }, {
              id: 'desc',
              type: 'Span',
              state: {
                text: 'This is the popover content. Click outside to close.'
              },
              attributes: {
                className: 'text-sm text-gray-600 block'
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
## Basic Popover

A simple popover with trigger button and content.
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-small',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Small Popover'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'small',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Small size (192px width)'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-medium',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Medium Popover'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'medium',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Medium size (256px width) - Default'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  }
}`,...a.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-large',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Large Popover'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'large',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Large size (320px width)'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex gap-4 flex-wrap'
        },
        children: [{
          id: 'popover-small',
          type: 'Popover',
          state: {
            open: false
          },
          children: [{
            id: 'trigger-small',
            type: 'PopoverTrigger',
            children: [{
              id: 'btn-small',
              type: 'Button',
              children: [{
                id: 'text-small',
                type: 'Span',
                state: {
                  text: 'Small'
                }
              }]
            }]
          }, {
            id: 'content-small',
            type: 'PopoverContent',
            state: {
              size: 'small',
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'desc-small',
              type: 'Span',
              state: {
                text: 'Small: 192px width'
              }
            }]
          }]
        }, {
          id: 'popover-medium',
          type: 'Popover',
          state: {
            open: false
          },
          children: [{
            id: 'trigger-medium',
            type: 'PopoverTrigger',
            children: [{
              id: 'btn-medium',
              type: 'Button',
              children: [{
                id: 'text-medium',
                type: 'Span',
                state: {
                  text: 'Medium'
                }
              }]
            }]
          }, {
            id: 'content-medium',
            type: 'PopoverContent',
            state: {
              size: 'medium',
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'desc-medium',
              type: 'Span',
              state: {
                text: 'Medium: 256px width (default)'
              }
            }]
          }]
        }, {
          id: 'popover-large',
          type: 'Popover',
          state: {
            open: false
          },
          children: [{
            id: 'trigger-large',
            type: 'PopoverTrigger',
            children: [{
              id: 'btn-large',
              type: 'Button',
              children: [{
                id: 'text-large',
                type: 'Span',
                state: {
                  text: 'Large'
                }
              }]
            }]
          }, {
            id: 'content-large',
            type: 'PopoverContent',
            state: {
              size: 'large',
              side: 'bottom',
              sideOffset: 4
            },
            children: [{
              id: 'desc-large',
              type: 'Span',
              state: {
                text: 'Large: 320px width'
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
## Size Variants

| Size | Width |
|------|-------|
| small | 192px |
| medium | 256px (default) |
| large | 320px |
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const createPopover = (id: string, side: string, label: string) => ({
      id: \`popover-\${id}\`,
      type: 'Popover',
      state: {
        open: false
      },
      children: [{
        id: \`trigger-\${id}\`,
        type: 'PopoverTrigger',
        children: [{
          id: \`btn-\${id}\`,
          type: 'Button',
          children: [{
            id: \`text-\${id}\`,
            type: 'Span',
            state: {
              text: label
            }
          }]
        }]
      }, {
        id: \`content-\${id}\`,
        type: 'PopoverContent',
        state: {
          size: 'small',
          side,
          sideOffset: 8
        },
        children: [{
          id: \`desc-\${id}\`,
          type: 'Span',
          state: {
            text: \`Side: \${side}\`
          }
        }]
      }]
    });
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex gap-4 flex-wrap items-center justify-center p-8'
        },
        children: [createPopover('top', 'top', '↑ Top'), createPopover('right', 'right', '→ Right'), createPopover('bottom', 'bottom', '↓ Bottom'), createPopover('left', 'left', '← Left')]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Placement Options

Use \\\`side\\\` prop in state to control popover position:
- \\\`top\\\`: Above the trigger
- \\\`right\\\`: Right of the trigger
- \\\`bottom\\\`: Below the trigger (default)
- \\\`left\\\`: Left of the trigger
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-close',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open with Close Button'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'medium',
            side: 'bottom',
            sideOffset: 4
          },
          children: [{
            id: 'content-inner',
            type: 'Div',
            attributes: {
              className: 'relative'
            },
            children: [{
              id: 'close',
              type: 'PopoverClose'
            }, {
              id: 'body',
              type: 'Div',
              attributes: {
                className: 'pr-6 space-y-2'
              },
              children: [{
                id: 'title',
                type: 'Span',
                state: {
                  text: 'Popover with Close'
                },
                attributes: {
                  className: 'font-semibold block'
                }
              }, {
                id: 'desc',
                type: 'Span',
                state: {
                  text: 'Click the X button or outside to close.'
                },
                attributes: {
                  className: 'text-sm text-gray-600 block'
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
## With Close Button

Add a \\\`PopoverClose\\\` component inside the content for an explicit close button.
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'popover-compound',
        type: 'Popover',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'PopoverTrigger',
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
                text: 'User Settings'
              }
            }]
          }]
        }, {
          id: 'content',
          type: 'PopoverContent',
          state: {
            size: 'large',
            side: 'bottom',
            sideOffset: 4,
            align: 'start'
          },
          children: [{
            id: 'settings-form',
            type: 'Div',
            attributes: {
              className: 'space-y-4'
            },
            children: [{
              id: 'header',
              type: 'Div',
              attributes: {
                className: 'flex justify-between items-center'
              },
              children: [{
                id: 'title',
                type: 'Span',
                state: {
                  text: 'Settings'
                },
                attributes: {
                  className: 'font-semibold'
                }
              }, {
                id: 'close',
                type: 'PopoverClose'
              }]
            }, {
              id: 'settings-content',
              type: 'Div',
              attributes: {
                className: 'space-y-3'
              },
              children: [{
                id: 'setting-1',
                type: 'Div',
                attributes: {
                  className: 'flex justify-between items-center'
                },
                children: [{
                  id: 'label-1',
                  type: 'Span',
                  state: {
                    text: 'Enable notifications'
                  },
                  attributes: {
                    className: 'text-sm'
                  }
                }, {
                  id: 'toggle-1',
                  type: 'Toggle',
                  state: {
                    isChecked: true,
                    size: 'regular'
                  }
                }]
              }, {
                id: 'setting-2',
                type: 'Div',
                attributes: {
                  className: 'flex justify-between items-center'
                },
                children: [{
                  id: 'label-2',
                  type: 'Span',
                  state: {
                    text: 'Dark mode'
                  },
                  attributes: {
                    className: 'text-sm'
                  }
                }, {
                  id: 'toggle-2',
                  type: 'Toggle',
                  state: {
                    isChecked: false,
                    size: 'regular'
                  }
                }]
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
## Compound Pattern with providerId Inheritance

In this example, \\\`PopoverTrigger\\\`, \\\`PopoverContent\\\`, and \\\`PopoverClose\\\` all automatically inherit the \\\`providerId\\\` from their parent \\\`Popover\\\` component.

No explicit \\\`providerId\\\` is needed in child components' state.

\\\`\\\`\\\`json
{
  "id": "popover-compound",
  "type": "Popover",
  "state": { "open": false },
  "children": [
    {
      "id": "trigger",
      "type": "PopoverTrigger",
      "children": [
        {
          "id": "trigger-btn",
          "type": "Button",
          "state": { "appearance": "primary" },
          "children": [
            { "id": "btn-text", "type": "Span", "state": { "text": "User Settings" } }
          ]
        }
      ]
    },
    {
      "id": "content",
      "type": "PopoverContent",
      "state": { "size": "large", "side": "bottom", "sideOffset": 4 },
      "children": [
        {
          "id": "header",
          "type": "Div",
          "attributes": { "className": "flex justify-between items-center" },
          "children": [
            { "id": "title", "type": "Span", "state": { "text": "Settings" } },
            { "id": "close", "type": "PopoverClose" }
          ]
        },
        {
          "id": "body",
          "type": "Div",
          "children": [
            { "id": "setting-label", "type": "Span", "state": { "text": "Enable notifications" } },
            { "id": "toggle", "type": "Toggle", "state": { "isChecked": true } }
          ]
        }
      ]
    }
  ]
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'space-y-4'
        },
        children: [{
          id: 'header',
          type: 'Div',
          children: [{
            id: 'title',
            type: 'Span',
            state: {
              text: 'Multiple Independent Popovers'
            },
            attributes: {
              className: 'font-medium block'
            }
          }, {
            id: 'desc',
            type: 'Span',
            state: {
              text: 'Each Popover uses its own providerId via context.'
            },
            attributes: {
              className: 'text-sm text-gray-600 block'
            }
          }]
        }, {
          id: 'popovers-row',
          type: 'Div',
          attributes: {
            className: 'flex gap-4'
          },
          children: [{
            id: 'popover-info',
            type: 'Popover',
            state: {
              open: false
            },
            children: [{
              id: 'trigger-info',
              type: 'PopoverTrigger',
              children: [{
                id: 'btn-info',
                type: 'Button',
                children: [{
                  id: 'text-info',
                  type: 'Span',
                  state: {
                    text: 'Info'
                  }
                }]
              }]
            }, {
              id: 'content-info',
              type: 'PopoverContent',
              state: {
                size: 'small',
                side: 'bottom'
              },
              children: [{
                id: 'info-text',
                type: 'Span',
                state: {
                  text: 'Information popover'
                },
                attributes: {
                  className: 'text-blue-600'
                }
              }]
            }]
          }, {
            id: 'popover-warning',
            type: 'Popover',
            state: {
              open: false
            },
            children: [{
              id: 'trigger-warning',
              type: 'PopoverTrigger',
              children: [{
                id: 'btn-warning',
                type: 'Button',
                state: {
                  appearance: 'warning'
                },
                children: [{
                  id: 'text-warning',
                  type: 'Span',
                  state: {
                    text: 'Warning'
                  }
                }]
              }]
            }, {
              id: 'content-warning',
              type: 'PopoverContent',
              state: {
                size: 'small',
                side: 'bottom'
              },
              children: [{
                id: 'warning-text',
                type: 'Span',
                state: {
                  text: 'Warning popover'
                },
                attributes: {
                  className: 'text-yellow-600'
                }
              }]
            }]
          }, {
            id: 'popover-danger',
            type: 'Popover',
            state: {
              open: false
            },
            children: [{
              id: 'trigger-danger',
              type: 'PopoverTrigger',
              children: [{
                id: 'btn-danger',
                type: 'Button',
                state: {
                  appearance: 'danger'
                },
                children: [{
                  id: 'text-danger',
                  type: 'Span',
                  state: {
                    text: 'Danger'
                  }
                }]
              }]
            }, {
              id: 'content-danger',
              type: 'PopoverContent',
              state: {
                size: 'small',
                side: 'bottom'
              },
              children: [{
                id: 'danger-text',
                type: 'Span',
                state: {
                  text: 'Danger popover'
                },
                attributes: {
                  className: 'text-red-600'
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
## Multiple Independent Popovers

Each Popover component is independent with its own state. Child components inherit \\\`providerId\\\` from their respective parent Popover via Context.
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};const N=["Basic","SizeSmall","SizeMedium","SizeLarge","AllSizes","PlacementExamples","WithCloseButton","CompoundPatternSdui","MultiplePopovers"];export{d as AllSizes,i as Basic,m as CompoundPatternSdui,u as MultiplePopovers,c as PlacementExamples,p as SizeLarge,a as SizeMedium,s as SizeSmall,l as WithCloseButton,N as __namedExportsOrder,w as default};
