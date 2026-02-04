import{j as e}from"./jsx-runtime-MKzguXD9.js";import{B as a,S as d,s as c}from"./sduiComponents-BR0Vzf8a.js";import"./iframe-B-zN9yCt.js";import"./preload-helper-ggYluGXI.js";import"./index-D3T0tnVM.js";import"./index-CSF7y5Rp.js";const f={title:"Shared/UI/Badge",component:a,tags:["autodocs"],argTypes:{label:{control:"text",description:"Badge label content (numeric value or string)",table:{defaultValue:{summary:"25"}}},appearance:{control:"select",options:["default"],description:"Badge appearance variant",table:{defaultValue:{summary:"default"}}}},parameters:{docs:{description:{component:`
## Overview

The **Badge** component follows the Atlassian Design System (ADS) specifications. A badge is a visual indicator for numeric values such as tallies and scores.

## Design Specs

- Height: 16px
- Min Width: 24px
- Padding: 4px horizontal (xxsmall)
- Border Radius: 2px
- Border: none
- Font Size: 12px (Body S)
- Line Height: 16px
- Background: neutral300 (#dddee1)
- Text Color: neutral1000 (#292a2e)

## Appearance Variants

| Appearance | Description |
|------------|-------------|
| \`default\` | Default neutral appearance |

## Features

- **label**: Supports both numeric and string values
- **props spread**: All HTML div attributes supported

## Integration

- ✅ **SDUI template system** integration

## Usage

Badges are typically used to display:
- Notification counts
- Unread message counts
- Item quantities
- Scores or tallies
        `}}}},s={args:{label:25,appearance:"default"},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different badge configurations.

### Available Controls

- **label**: Badge label (number or string)
- **appearance**: Appearance variant (currently only 'default')
        `}}}},n={render:()=>e.jsxs("div",{className:"flex items-center justify-center p-4 gap-4",children:[e.jsx(a,{label:0}),e.jsx(a,{label:1}),e.jsx(a,{label:5}),e.jsx(a,{label:25}),e.jsx(a,{label:99}),e.jsx(a,{label:999})]}),parameters:{docs:{description:{story:`
## Numeric Labels

Badges can display numeric values from 0 to any number.
        `}}}},t={render:()=>e.jsxs("div",{className:"flex items-center justify-center p-4 gap-4",children:[e.jsx(a,{label:"99+"}),e.jsx(a,{label:"New"}),e.jsx(a,{label:"!"})]}),parameters:{docs:{description:{story:`
## String Labels

Badges can also display string values for special cases like "99+" or custom labels.
        `}}}},r={render:()=>e.jsxs("div",{className:"flex flex-col items-center justify-center p-4 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Messages"}),e.jsx(a,{label:3})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Notifications"}),e.jsx(a,{label:12})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Tasks"}),e.jsx(a,{label:99})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Alerts"}),e.jsx(a,{label:"99+"})]})]}),parameters:{docs:{description:{story:`
## Notification Counts

Common use case: displaying notification counts next to menu items or buttons.
        `}}}},i={render:()=>{const o={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-wrap items-center justify-center p-4 gap-4"},children:[{id:"badge-1",type:"Badge",state:{label:0}},{id:"badge-2",type:"Badge",state:{label:5}},{id:"badge-3",type:"Badge",state:{label:25}},{id:"badge-4",type:"Badge",state:{label:99}},{id:"badge-5",type:"Badge",state:{label:"99+"}}]}};return e.jsx(d,{document:o,components:c})},parameters:{docs:{description:{story:`
## SDUI Integration

Badges rendered via SDUI document structure.

\`\`\`json
{
  "id": "badge-1",
  "type": "Badge",
  "state": { "label": 25 }
}
\`\`\`
        `}}}},l={render:()=>e.jsxs("div",{className:"flex flex-col items-center justify-center p-4 gap-4",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Default"}),e.jsx(a,{label:25})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{children:"Custom Class"}),e.jsx(a,{label:25,className:"opacity-75"})]})]}),parameters:{docs:{description:{story:`
## Custom Styling

Badges support custom className for additional styling.
        `}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    label: 25,
    appearance: 'default'
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different badge configurations.

### Available Controls

- **label**: Badge label (number or string)
- **appearance**: Appearance variant (currently only 'default')
        \`
      }
    }
  }
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Badge label={0} />
      <Badge label={1} />
      <Badge label={5} />
      <Badge label={25} />
      <Badge label={99} />
      <Badge label={999} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Numeric Labels

Badges can display numeric values from 0 to any number.
        \`
      }
    }
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Badge label="99+" />
      <Badge label="New" />
      <Badge label="!" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## String Labels

Badges can also display string values for special cases like "99+" or custom labels.
        \`
      }
    }
  }
}`,...t.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center gap-2">
        <span>Messages</span>
        <Badge label={3} />
      </div>
      <div className="flex items-center gap-2">
        <span>Notifications</span>
        <Badge label={12} />
      </div>
      <div className="flex items-center gap-2">
        <span>Tasks</span>
        <Badge label={99} />
      </div>
      <div className="flex items-center gap-2">
        <span>Alerts</span>
        <Badge label="99+" />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Notification Counts

Common use case: displaying notification counts next to menu items or buttons.
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-wrap items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'badge-1',
          type: 'Badge',
          state: {
            label: 0
          }
        }, {
          id: 'badge-2',
          type: 'Badge',
          state: {
            label: 5
          }
        }, {
          id: 'badge-3',
          type: 'Badge',
          state: {
            label: 25
          }
        }, {
          id: 'badge-4',
          type: 'Badge',
          state: {
            label: 99
          }
        }, {
          id: 'badge-5',
          type: 'Badge',
          state: {
            label: '99+'
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
## SDUI Integration

Badges rendered via SDUI document structure.

\\\`\\\`\\\`json
{
  "id": "badge-1",
  "type": "Badge",
  "state": { "label": 25 }
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center gap-2">
        <span>Default</span>
        <Badge label={25} />
      </div>
      <div className="flex items-center gap-2">
        <span>Custom Class</span>
        <Badge label={25} className="opacity-75" />
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Custom Styling

Badges support custom className for additional styling.
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};const y=["Playground","NumericLabels","StringLabels","NotificationCounts","SduiIntegration","WithCustomStyling"];export{r as NotificationCounts,n as NumericLabels,s as Playground,i as SduiIntegration,t as StringLabels,l as WithCustomStyling,y as __namedExportsOrder,f as default};
