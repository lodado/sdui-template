import{j as e}from"./jsx-runtime-tVlFJ3QW.js";import{r as u}from"./iframe-jcnljCmR.js";import{i as s,S as k,s as f}from"./sduiComponents-yGOTnp4e.js";import"./preload-helper-ggYluGXI.js";import"./index-BPS7E_Qt.js";import"./index-B4QvPrAh.js";const j={title:"Shared/UI/Toggle",component:s,tags:["autodocs"],argTypes:{size:{control:"select",options:["regular","large"],description:"Toggle size variant",table:{defaultValue:{summary:"regular"}}},isChecked:{control:"boolean",description:"Whether the toggle is checked (controlled)",table:{defaultValue:{summary:"false"}}},isDisabled:{control:"boolean",description:"Whether the toggle is disabled",table:{defaultValue:{summary:"false"}}},isLoading:{control:"boolean",description:"Whether the toggle is in loading state",table:{defaultValue:{summary:"false"}}},label:{control:"text",description:"Accessible label for the toggle"}},parameters:{docs:{description:{component:`
## Overview

The **Toggle** component follows the Atlassian Design System (ADS) specifications.
A toggle is used to view or switch between enabled or disabled states.

## Size Variants

| Size | Width | Height | Dot Size |
|------|-------|--------|----------|
| \`regular\` | 32px | 16px | 12px |
| \`large\` | 40px | 20px | 16px |

## States

- **isChecked**: Controlled checked state
- **defaultChecked**: Initial state (uncontrolled)
- **isDisabled**: Non-interactive disabled state
- **isLoading**: Shows spinner, blocks interaction

## Colors

| State | Background |
|-------|------------|
| Checked | Green (#5b7f24) |
| Unchecked | Dark gray (#292a2e) |

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Space & Enter keys)
- ✅ **Accessibility features** (role="switch", aria-checked)
- ✅ **Form integration** (hidden input with name)
        `}}}},t={args:{size:"regular",isChecked:!1,isDisabled:!1,isLoading:!1,label:"Toggle feature"},render:a=>{const[n,b]=u.useState(a.isChecked);return e.jsx(s,{...a,isChecked:n,onChange:b})},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different toggle configurations.

### Available Controls

- **size**: regular (32x16px), large (40x20px)
- **isChecked**: Toggle checked state
- **isDisabled**: Enable/disable the toggle
- **isLoading**: Show loading spinner
- **label**: Accessible label text
        `}}}},i={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{size:"regular",label:"Regular size"}),e.jsx("span",{className:"text-sm",children:"Regular (32x16px)"})]}),parameters:{docs:{description:{story:`
## Regular Size

Default toggle size with 32x16px dimensions.

### Specifications
- **Width**: 32px
- **Height**: 16px
- **Dot size**: 12px
        `}}}},r={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{size:"large",label:"Large size"}),e.jsx("span",{className:"text-sm",children:"Large (40x20px)"})]}),parameters:{docs:{description:{story:`
## Large Size

Larger toggle size with 40x20px dimensions.

### Specifications
- **Width**: 40px
- **Height**: 20px
- **Dot size**: 16px
        `}}}},l={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{isChecked:!0,label:"Checked toggle"}),e.jsx("span",{className:"text-sm",children:"Checked (green background)"})]}),parameters:{docs:{description:{story:`
## Checked State

Toggle in checked/enabled state with green background.

### Characteristics
- Green background color
- Check icon visible on left
- Dot positioned on right
        `}}}},c={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{isChecked:!1,label:"Unchecked toggle"}),e.jsx("span",{className:"text-sm",children:"Unchecked (gray background)"})]}),parameters:{docs:{description:{story:`
## Unchecked State

Toggle in unchecked/disabled state with gray background.

### Characteristics
- Gray background color
- Cross icon visible on right
- Dot positioned on left
        `}}}},o={render:()=>e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{isDisabled:!0,isChecked:!1,label:"Disabled unchecked"}),e.jsx("span",{className:"text-sm",children:"Disabled (unchecked)"})]}),e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{isDisabled:!0,isChecked:!0,label:"Disabled checked"}),e.jsx("span",{className:"text-sm",children:"Disabled (checked)"})]})]}),parameters:{docs:{description:{story:`
## Disabled State

Non-interactive toggle with reduced opacity.

### Behavior
- Cannot be clicked
- Keyboard navigation disabled
- 50% opacity visual feedback
- \`aria-disabled="true"\` for accessibility
        `}}}},d={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{isLoading:!0,label:"Loading toggle"}),e.jsx("span",{className:"text-sm",children:"Loading (spinner shown)"})]}),parameters:{docs:{description:{story:`
## Loading State

Shows a spinner and blocks interaction during async operations.

### Behavior
- Spinner animation replaces check icon
- Click events blocked
- \`aria-busy="true"\` for accessibility
        `}}}},g={render:()=>{const[a,n]=u.useState(!1);return e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx(s,{isChecked:a,onChange:n,label:"Controlled toggle"}),e.jsxs("span",{className:"text-sm",children:["State: ",a?"ON":"OFF"]})]}),e.jsx("button",{className:"px-3 py-1 bg-blue-500 text-white rounded text-sm w-fit",onClick:()=>n(!a),children:"Toggle externally"})]})},parameters:{docs:{description:{story:"\n## Controlled Mode\n\nToggle state is managed externally via `isChecked` and `onChange`.\n\n### Usage\n```tsx\nconst [checked, setChecked] = useState(false)\n<Toggle isChecked={checked} onChange={setChecked} />\n```\n        "}}}},p={render:()=>e.jsxs("div",{className:"flex items-center gap-4 p-4",children:[e.jsx(s,{defaultChecked:!0,label:"Uncontrolled toggle"}),e.jsx("span",{className:"text-sm",children:"Uncontrolled (defaultChecked=true)"})]}),parameters:{docs:{description:{story:`
## Uncontrolled Mode

Toggle manages its own internal state with \`defaultChecked\`.

### Usage
\`\`\`tsx
<Toggle defaultChecked />
\`\`\`
        `}}}},m={render:()=>{const a={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-4"},children:[{id:"title",type:"Span",state:{text:"SDUI Toggle Examples"},attributes:{className:"text-lg font-bold"}},{id:"toggle-1",type:"Toggle",state:{isChecked:!1,label:"Enable notifications"}},{id:"toggle-2",type:"Toggle",state:{isChecked:!0,label:"Dark mode"}},{id:"toggle-3",type:"Toggle",state:{isChecked:!1,isDisabled:!0,label:"Premium feature (disabled)"}}]}};return e.jsx(k,{document:a,components:f})},parameters:{docs:{description:{story:`
## SDUI Integration

Toggle integrated with SDUI template system.

### Document Structure
\`\`\`json
{
  "id": "toggle-1",
  "type": "Toggle",
  "state": {
    "isChecked": false,
    "label": "Enable notifications"
  }
}
\`\`\`
        `}}}},x={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 p-6",children:[e.jsx("h3",{className:"text-xl font-bold",children:"Size Comparison"}),e.jsxs("div",{className:"flex items-center gap-8",children:[e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{size:"regular",label:"Regular"}),e.jsx("span",{className:"text-xs text-gray-500",children:"Regular (32x16)"})]}),e.jsxs("div",{className:"flex flex-col items-center gap-2",children:[e.jsx(s,{size:"large",label:"Large"}),e.jsx("span",{className:"text-xs text-gray-500",children:"Large (40x20)"})]})]})]}),parameters:{docs:{description:{story:`
## Size Comparison

Visual comparison of regular and large sizes.

| Size | Dimensions | Dot |
|------|------------|-----|
| Regular | 32x16px | 12px |
| Large | 40x20px | 16px |
        `}}}},h={render:()=>e.jsxs("div",{className:"flex flex-col gap-6 p-6",children:[e.jsx("h3",{className:"text-xl font-bold",children:"States Matrix"}),e.jsxs("div",{className:"grid grid-cols-4 gap-4 items-center",children:[e.jsx("span",{className:"font-medium",children:"State"}),e.jsx("span",{className:"text-center text-sm",children:"Unchecked"}),e.jsx("span",{className:"text-center text-sm",children:"Checked"}),e.jsx("span",{className:"text-center text-sm",children:"Description"}),e.jsx("span",{children:"Default"}),e.jsx(s,{isChecked:!1,label:"Default unchecked"}),e.jsx(s,{isChecked:!0,label:"Default checked"}),e.jsx("span",{className:"text-xs text-gray-500",children:"Interactive"}),e.jsx("span",{children:"Disabled"}),e.jsx(s,{isDisabled:!0,isChecked:!1,label:"Disabled unchecked"}),e.jsx(s,{isDisabled:!0,isChecked:!0,label:"Disabled checked"}),e.jsx("span",{className:"text-xs text-gray-500",children:"Non-interactive"}),e.jsx("span",{children:"Loading"}),e.jsx(s,{isLoading:!0,isChecked:!1,label:"Loading unchecked"}),e.jsx(s,{isLoading:!0,isChecked:!0,label:"Loading checked"}),e.jsx("span",{className:"text-xs text-gray-500",children:"Async operation"})]})]}),parameters:{docs:{description:{story:`
## Complete States Matrix

All toggle states in both checked and unchecked variants.

| State | Interaction | Visual |
|-------|-------------|--------|
| Default | Clickable | Full opacity |
| Disabled | Blocked | 50% opacity |
| Loading | Blocked | Spinner shown |
        `}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    size: 'regular',
    isChecked: false,
    isDisabled: false,
    isLoading: false,
    label: 'Toggle feature'
  },
  render: args => {
    const [checked, setChecked] = useState(args.isChecked);
    return <Toggle {...args} isChecked={checked} onChange={setChecked} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different toggle configurations.

### Available Controls

- **size**: regular (32x16px), large (40x20px)
- **isChecked**: Toggle checked state
- **isDisabled**: Enable/disable the toggle
- **isLoading**: Show loading spinner
- **label**: Accessible label text
        \`
      }
    }
  }
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle size="regular" label="Regular size" />
      <span className="text-sm">Regular (32x16px)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Regular Size

Default toggle size with 32x16px dimensions.

### Specifications
- **Width**: 32px
- **Height**: 16px
- **Dot size**: 12px
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle size="large" label="Large size" />
      <span className="text-sm">Large (40x20px)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Large Size

Larger toggle size with 40x20px dimensions.

### Specifications
- **Width**: 40px
- **Height**: 20px
- **Dot size**: 16px
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle isChecked label="Checked toggle" />
      <span className="text-sm">Checked (green background)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Checked State

Toggle in checked/enabled state with green background.

### Characteristics
- Green background color
- Check icon visible on left
- Dot positioned on right
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle isChecked={false} label="Unchecked toggle" />
      <span className="text-sm">Unchecked (gray background)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Unchecked State

Toggle in unchecked/disabled state with gray background.

### Characteristics
- Gray background color
- Cross icon visible on right
- Dot positioned on left
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-4">
        <Toggle isDisabled isChecked={false} label="Disabled unchecked" />
        <span className="text-sm">Disabled (unchecked)</span>
      </div>
      <div className="flex items-center gap-4">
        <Toggle isDisabled isChecked label="Disabled checked" />
        <span className="text-sm">Disabled (checked)</span>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Disabled State

Non-interactive toggle with reduced opacity.

### Behavior
- Cannot be clicked
- Keyboard navigation disabled
- 50% opacity visual feedback
- \\\`aria-disabled="true"\\\` for accessibility
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle isLoading label="Loading toggle" />
      <span className="text-sm">Loading (spinner shown)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Loading State

Shows a spinner and blocks interaction during async operations.

### Behavior
- Spinner animation replaces check icon
- Click events blocked
- \\\`aria-busy="true"\\\` for accessibility
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [checked, setChecked] = useState(false);
    return <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <Toggle isChecked={checked} onChange={setChecked} label="Controlled toggle" />
          <span className="text-sm">State: {checked ? 'ON' : 'OFF'}</span>
        </div>
        <button className="px-3 py-1 bg-blue-500 text-white rounded text-sm w-fit" onClick={() => setChecked(!checked)}>
          Toggle externally
        </button>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Controlled Mode

Toggle state is managed externally via \\\`isChecked\\\` and \\\`onChange\\\`.

### Usage
\\\`\\\`\\\`tsx
const [checked, setChecked] = useState(false)
<Toggle isChecked={checked} onChange={setChecked} />
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...g.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-4 p-4">
      <Toggle defaultChecked label="Uncontrolled toggle" />
      <span className="text-sm">Uncontrolled (defaultChecked=true)</span>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Uncontrolled Mode

Toggle manages its own internal state with \\\`defaultChecked\\\`.

### Usage
\\\`\\\`\\\`tsx
<Toggle defaultChecked />
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-4'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'SDUI Toggle Examples'
          },
          attributes: {
            className: 'text-lg font-bold'
          }
        }, {
          id: 'toggle-1',
          type: 'Toggle',
          state: {
            isChecked: false,
            label: 'Enable notifications'
          }
        }, {
          id: 'toggle-2',
          type: 'Toggle',
          state: {
            isChecked: true,
            label: 'Dark mode'
          }
        }, {
          id: 'toggle-3',
          type: 'Toggle',
          state: {
            isChecked: false,
            isDisabled: true,
            label: 'Premium feature (disabled)'
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

Toggle integrated with SDUI template system.

### Document Structure
\\\`\\\`\\\`json
{
  "id": "toggle-1",
  "type": "Toggle",
  "state": {
    "isChecked": false,
    "label": "Enable notifications"
  }
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 p-6">
      <h3 className="text-xl font-bold">Size Comparison</h3>
      <div className="flex items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <Toggle size="regular" label="Regular" />
          <span className="text-xs text-gray-500">Regular (32x16)</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Toggle size="large" label="Large" />
          <span className="text-xs text-gray-500">Large (40x20)</span>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Size Comparison

Visual comparison of regular and large sizes.

| Size | Dimensions | Dot |
|------|------------|-----|
| Regular | 32x16px | 12px |
| Large | 40x20px | 16px |
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-6 p-6">
      <h3 className="text-xl font-bold">States Matrix</h3>
      <div className="grid grid-cols-4 gap-4 items-center">
        <span className="font-medium">State</span>
        <span className="text-center text-sm">Unchecked</span>
        <span className="text-center text-sm">Checked</span>
        <span className="text-center text-sm">Description</span>

        <span>Default</span>
        <Toggle isChecked={false} label="Default unchecked" />
        <Toggle isChecked label="Default checked" />
        <span className="text-xs text-gray-500">Interactive</span>

        <span>Disabled</span>
        <Toggle isDisabled isChecked={false} label="Disabled unchecked" />
        <Toggle isDisabled isChecked label="Disabled checked" />
        <span className="text-xs text-gray-500">Non-interactive</span>

        <span>Loading</span>
        <Toggle isLoading isChecked={false} label="Loading unchecked" />
        <Toggle isLoading isChecked label="Loading checked" />
        <span className="text-xs text-gray-500">Async operation</span>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Complete States Matrix

All toggle states in both checked and unchecked variants.

| State | Interaction | Visual |
|-------|-------------|--------|
| Default | Clickable | Full opacity |
| Disabled | Blocked | 50% opacity |
| Loading | Blocked | Spinner shown |
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};const T=["Playground","SizeRegular","SizeLarge","StateChecked","StateUnchecked","StateDisabled","StateLoading","Controlled","Uncontrolled","SduiIntegration","SizeComparison","StatesMatrix"];export{g as Controlled,t as Playground,m as SduiIntegration,x as SizeComparison,r as SizeLarge,i as SizeRegular,l as StateChecked,o as StateDisabled,d as StateLoading,c as StateUnchecked,h as StatesMatrix,p as Uncontrolled,T as __namedExportsOrder,j as default};
