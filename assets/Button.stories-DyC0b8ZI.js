import{j as e}from"./jsx-runtime-DUBfAHyP.js";import{B as C,S as a,s as r}from"./sduiComponents-CIZ_YZ_f.js";import"./iframe-BlPWZXJW.js";import"./preload-helper-ggYluGXI.js";import"./index-uHiNjf4U.js";import"./index-3oRyq0qU.js";const W={title:"Shared/UI/Button",component:C,tags:["autodocs"],argTypes:{appearance:{control:"select",options:["default","primary","subtle","warning","danger"],description:"Button appearance style",table:{defaultValue:{summary:"default"}}},spacing:{control:"select",options:["default","compact"],description:"Button spacing (size)",table:{defaultValue:{summary:"default"}}},isDisabled:{control:"boolean",description:"Whether the button is disabled",table:{defaultValue:{summary:"false"}}},isLoading:{control:"boolean",description:"Whether the button is in loading state",table:{defaultValue:{summary:"false"}}},isSelected:{control:"boolean",description:"Whether the button is selected (toggle state)",table:{defaultValue:{summary:"false"}}}},parameters:{docs:{description:{component:`
## Overview

The **Button** component follows the Atlassian Design System (ADS) specifications. It's an interactive element that triggers specific actions when clicked.

## Appearance Variants

| Appearance | Description | Use Case |
|------------|-------------|----------|
| \`default\` | Neutral button with border | Secondary actions |
| \`primary\` | Brand blue filled button | Primary actions |
| \`subtle\` | Transparent button, no border | Tertiary actions |
| \`warning\` | Yellow/orange filled button | Warning actions |
| \`danger\` | Red filled button | Destructive actions |

## Spacing Options

| Spacing | Height | Description |
|---------|--------|-------------|
| \`default\` | 32px | Standard button size |
| \`compact\` | 24px | Compact button for dense UIs |

## States

- **isDisabled**: Non-interactive disabled state
- **isLoading**: Shows spinner, blocks interaction
- **isSelected**: Toggle/selected state with visual feedback

## Icons

- **iconBefore**: Icon before the label (16px)
- **iconAfter**: Icon after the label (12px)

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Enter & Space keys)
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers
        `}}}},c={args:{appearance:"default",spacing:"default",isDisabled:!1,isLoading:!1,isSelected:!1,children:"Button"},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different button configurations.

### Available Controls

- **appearance**: default, primary, subtle, warning, danger
- **spacing**: default (32px), compact (24px)
- **isDisabled**: Enable/disable the button
- **isLoading**: Show loading spinner
- **isSelected**: Toggle selected state
        `}}}},p={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-default",type:"Button",state:{appearance:"default"},children:[{id:"text",type:"Span",state:{text:"Default"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Default Appearance

Neutral button with border. Use for secondary actions that need less visual emphasis.

### Characteristics
- Transparent background with border
- Uses \`--color-border-default\` for border
- \`--color-text-default\` for text color
        `}}}},d={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-primary",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Primary"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Primary Appearance

Brand blue filled button for primary actions. The highest visual emphasis.

### Characteristics
- Solid brand blue background
- White text for contrast
- Use for the most important action on a page
        `}}}},l={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-subtle",type:"Button",state:{appearance:"subtle"},children:[{id:"text",type:"Span",state:{text:"Subtle"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Subtle Appearance

Transparent button without border. Lowest visual emphasis, similar to text links.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for tertiary actions or link-like buttons
        `}}}},u={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-warning",type:"Button",state:{appearance:"warning"},children:[{id:"text",type:"Span",state:{text:"Warning"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Warning Appearance

Yellow/orange filled button for warning actions.

### Characteristics
- Warning background color
- Dark text for contrast
- Use for actions that need user attention but aren't destructive
        `}}}},m={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-danger",type:"Button",state:{appearance:"danger"},children:[{id:"text",type:"Span",state:{text:"Danger"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Danger Appearance

Red filled button for destructive actions.

### Characteristics
- Danger/red background color
- White text for contrast
- Use for delete, remove, or other destructive actions
        `}}}},b={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-default-spacing",type:"Button",state:{appearance:"primary",spacing:"default"},children:[{id:"text",type:"Span",state:{text:"Default (32px)"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Default Spacing

Standard button size with 32px height.

### Specifications
- **Height**: 32px minimum
- **Padding**: 12px horizontal
- **Font size**: 14px
        `}}}},f={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-compact-spacing",type:"Button",state:{appearance:"primary",spacing:"compact"},children:[{id:"text",type:"Span",state:{text:"Compact (24px)"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Compact Spacing

Smaller button size with 24px height for dense UIs.

### Specifications
- **Height**: 24px minimum
- **Padding**: 8px horizontal
- **Font size**: 12px
        `}}}},y={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-disabled",type:"Button",state:{appearance:"primary",isDisabled:!0},children:[{id:"text",type:"Span",state:{text:"Disabled"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Disabled State

Non-interactive button indicating an action is unavailable.

### Behavior
- Cannot be clicked
- Keyboard navigation disabled
- Visual feedback: reduced opacity, disabled colors
- \`aria-disabled="true"\` for accessibility
        `}}}},x={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-loading",type:"Button",state:{appearance:"primary",isLoading:!0},children:[{id:"text",type:"Span",state:{text:"Loading..."}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Loading State

Shows a spinner and blocks interaction during async operations.

### Behavior
- Spinner animation displayed
- Click events blocked
- Original content hidden but preserves width
- \`aria-busy="true"\` for accessibility
- Icons are hidden during loading
        `}}}},g={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4 gap-4"},children:[{id:"btn-selected",type:"Button",state:{appearance:"default",isSelected:!0},children:[{id:"text",type:"Span",state:{text:"Selected"}}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Selected State

Toggle/selected state for buttons that act as toggles.

### Behavior
- Visual feedback with selected background color
- \`aria-pressed="true"\` for accessibility
- Can be combined with any appearance
- Useful for toggle buttons, filters, etc.
        `}}}},h={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(C,{appearance:"primary",iconBefore:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",stroke:"currentColor",strokeWidth:"2",fill:"none"})}),children:"Search"})}),parameters:{docs:{description:{story:`
## Icon Before Label

Add an icon before the button label using \`iconBefore\` prop.

### Specifications
- Icon size: 16x16px
- Gap between icon and label: 6px
- Icon inherits text color
        `}}}},S={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(C,{appearance:"default",iconAfter:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M19 9l-7 7-7-7",stroke:"currentColor",strokeWidth:"2",fill:"none"})}),children:"Dropdown"})}),parameters:{docs:{description:{story:`
## Icon After Label

Add an icon after the button label using \`iconAfter\` prop.

### Specifications
- Icon size: 12x12px (smaller for chevrons)
- Gap between label and icon: 6px
- Commonly used for dropdown indicators
        `}}}},v={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(C,{appearance:"primary",iconBefore:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M12 4v16m8-8H4",stroke:"currentColor",strokeWidth:"2",fill:"none"})}),iconAfter:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{d:"M19 9l-7 7-7-7",stroke:"currentColor",strokeWidth:"2",fill:"none"})}),children:"Add Item"})}),parameters:{docs:{description:{story:`
## Both Icons

Buttons can have both iconBefore and iconAfter simultaneously.

### Use Case
- Split button patterns
- Complex action indicators
        `}}}},D={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"All Appearances"},attributes:{className:"text-xl font-bold"}},{id:"buttons-row",type:"Div",attributes:{className:"flex flex-wrap gap-4 items-center"},children:["default","primary","subtle","warning","danger"].map(s=>({id:`btn-${s}`,type:"Button",state:{appearance:s},children:[{id:`text-${s}`,type:"Span",state:{text:s.charAt(0).toUpperCase()+s.slice(1)}}]}))}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## All Appearances Overview

Visual comparison of all 5 appearance variants side by side.

| Appearance | Use Case |
|------------|----------|
| Default | Secondary actions |
| Primary | Primary actions |
| Subtle | Tertiary/link-like |
| Warning | Attention needed |
| Danger | Destructive actions |
        `}}}},B={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"Spacing Comparison"},attributes:{className:"text-xl font-bold"}},{id:"comparison-row",type:"Div",attributes:{className:"flex gap-8 items-end"},children:[{id:"default-col",type:"Div",attributes:{className:"flex flex-col gap-2 items-center"},children:[{id:"default-label",type:"Span",state:{text:"Default (32px)"},attributes:{className:"text-sm font-medium"}},{id:"default-btn",type:"Button",state:{appearance:"primary",spacing:"default"},children:[{id:"default-text",type:"Span",state:{text:"Button"}}]}]},{id:"compact-col",type:"Div",attributes:{className:"flex flex-col gap-2 items-center"},children:[{id:"compact-label",type:"Span",state:{text:"Compact (24px)"},attributes:{className:"text-sm font-medium"}},{id:"compact-btn",type:"Button",state:{appearance:"primary",spacing:"compact"},children:[{id:"compact-text",type:"Span",state:{text:"Button"}}]}]}]}]}};return e.jsx(a,{document:t,components:r})},parameters:{docs:{description:{story:`
## Spacing Side-by-Side

Compare default and compact spacing options.

| Spacing | Height | Padding | Font |
|---------|--------|---------|------|
| Default | 32px | 12px | 14px |
| Compact | 24px | 8px | 12px |
        `}}}},N={render:()=>{const s={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"States Matrix"},attributes:{className:"text-xl font-bold mb-4"}},{id:"header",type:"Div",attributes:{className:"grid grid-cols-6 gap-4 items-center mb-2"},children:[{id:"h-appearance",type:"Span",state:{text:"Appearance"},attributes:{className:"font-bold"}},{id:"h-default",type:"Span",state:{text:"Default"},attributes:{className:"text-center text-sm"}},{id:"h-disabled",type:"Span",state:{text:"Disabled"},attributes:{className:"text-center text-sm"}},{id:"h-loading",type:"Span",state:{text:"Loading"},attributes:{className:"text-center text-sm"}},{id:"h-selected",type:"Span",state:{text:"Selected"},attributes:{className:"text-center text-sm"}},{id:"h-hover",type:"Span",state:{text:"Hover (try)"},attributes:{className:"text-center text-sm"}}]},...["default","primary","subtle","warning","danger"].map(n=>({id:`row-${n}`,type:"Div",attributes:{className:"grid grid-cols-6 gap-4 items-center"},children:[{id:`label-${n}`,type:"Span",state:{text:n.charAt(0).toUpperCase()+n.slice(1)},attributes:{className:"font-medium capitalize"}},{id:`btn-default-${n}`,type:"Button",state:{appearance:n},children:[{id:`text-default-${n}`,type:"Span",state:{text:"Button"}}]},{id:`btn-disabled-${n}`,type:"Button",state:{appearance:n,isDisabled:!0},children:[{id:`text-disabled-${n}`,type:"Span",state:{text:"Button"}}]},{id:`btn-loading-${n}`,type:"Button",state:{appearance:n,isLoading:!0},children:[{id:`text-loading-${n}`,type:"Span",state:{text:"Button"}}]},{id:`btn-selected-${n}`,type:"Button",state:{appearance:n,isSelected:!0},children:[{id:`text-selected-${n}`,type:"Span",state:{text:"Button"}}]},{id:`btn-hover-${n}`,type:"Button",state:{appearance:n},children:[{id:`text-hover-${n}`,type:"Span",state:{text:"Button"}}]}]}))]}};return e.jsx(a,{document:s,components:r})},parameters:{docs:{description:{story:`
## Complete States Matrix

A comprehensive view of all appearance variants across different states.

### States Shown
- **Default**: Normal interactive state
- **Disabled**: Non-interactive, reduced opacity
- **Loading**: Spinner shown, interaction blocked
- **Selected**: Toggle/selected state
- **Hover**: Hover over to see hover state
        `}}}},w={render:()=>{const t=["default","primary","subtle","warning","danger"],n={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-8 p-6"},children:[{id:"title",type:"Span",state:{text:"Complete Button Matrix (ADS Style)"},attributes:{className:"text-2xl font-bold"}},{id:"subtitle",type:"Span",state:{text:"5 Appearances × 2 Spacings = 10 Combinations"},attributes:{className:"text-sm text-gray-600 mb-4"}},...["default","compact"].map(o=>({id:`section-${o}`,type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:`section-title-${o}`,type:"Span",state:{text:`Spacing: ${o} (${o==="default"?"32px":"24px"})`},attributes:{className:"text-lg font-semibold"}},{id:`buttons-${o}`,type:"Div",attributes:{className:"flex flex-wrap gap-4 items-center"},children:t.map(i=>({id:`btn-${o}-${i}`,type:"Button",state:{appearance:i,spacing:o},children:[{id:`text-${o}-${i}`,type:"Span",state:{text:i.charAt(0).toUpperCase()+i.slice(1)}}]}))}]}))]}};return e.jsx(a,{document:n,components:r})},parameters:{docs:{description:{story:`
## Complete Button Matrix

All 10 button combinations organized by spacing.

### Matrix Overview

| Spacing \\ Appearance | Default | Primary | Subtle | Warning | Danger |
|----------------------|---------|---------|--------|---------|--------|
| Default (32px) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Compact (24px) | ✓ | ✓ | ✓ | ✓ | ✓ |

### Usage Guidelines

- **Primary actions**: Use \`primary\` appearance
- **Secondary actions**: Use \`default\` appearance
- **Tertiary actions**: Use \`subtle\` appearance
- **Warning actions**: Use \`warning\` appearance
- **Destructive actions**: Use \`danger\` appearance
        `}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    appearance: 'default',
    spacing: 'default',
    isDisabled: false,
    isLoading: false,
    isSelected: false,
    children: 'Button'
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different button configurations.

### Available Controls

- **appearance**: default, primary, subtle, warning, danger
- **spacing**: default (32px), compact (24px)
- **isDisabled**: Enable/disable the button
- **isLoading**: Show loading spinner
- **isSelected**: Toggle selected state
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-default',
          type: 'Button',
          state: {
            appearance: 'default'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Default'
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

Neutral button with border. Use for secondary actions that need less visual emphasis.

### Characteristics
- Transparent background with border
- Uses \\\`--color-border-default\\\` for border
- \\\`--color-text-default\\\` for text color
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-primary',
          type: 'Button',
          state: {
            appearance: 'primary'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Primary'
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

Brand blue filled button for primary actions. The highest visual emphasis.

### Characteristics
- Solid brand blue background
- White text for contrast
- Use for the most important action on a page
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-subtle',
          type: 'Button',
          state: {
            appearance: 'subtle'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Subtle'
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

Transparent button without border. Lowest visual emphasis, similar to text links.

### Characteristics
- Transparent background, no border
- Subtle text color
- Use for tertiary actions or link-like buttons
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-warning',
          type: 'Button',
          state: {
            appearance: 'warning'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Warning'
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
## Warning Appearance

Yellow/orange filled button for warning actions.

### Characteristics
- Warning background color
- Dark text for contrast
- Use for actions that need user attention but aren't destructive
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
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-danger',
          type: 'Button',
          state: {
            appearance: 'danger'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Danger'
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
## Danger Appearance

Red filled button for destructive actions.

### Characteristics
- Danger/red background color
- White text for contrast
- Use for delete, remove, or other destructive actions
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-default-spacing',
          type: 'Button',
          state: {
            appearance: 'primary',
            spacing: 'default'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Default (32px)'
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
## Default Spacing

Standard button size with 32px height.

### Specifications
- **Height**: 32px minimum
- **Padding**: 12px horizontal
- **Font size**: 14px
        \`
      }
    }
  }
}`,...b.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-compact-spacing',
          type: 'Button',
          state: {
            appearance: 'primary',
            spacing: 'compact'
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Compact (24px)'
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
## Compact Spacing

Smaller button size with 24px height for dense UIs.

### Specifications
- **Height**: 24px minimum
- **Padding**: 8px horizontal
- **Font size**: 12px
        \`
      }
    }
  }
}`,...f.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-disabled',
          type: 'Button',
          state: {
            appearance: 'primary',
            isDisabled: true
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Disabled'
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
## Disabled State

Non-interactive button indicating an action is unavailable.

### Behavior
- Cannot be clicked
- Keyboard navigation disabled
- Visual feedback: reduced opacity, disabled colors
- \\\`aria-disabled="true"\\\` for accessibility
        \`
      }
    }
  }
}`,...y.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-loading',
          type: 'Button',
          state: {
            appearance: 'primary',
            isLoading: true
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Loading...'
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
## Loading State

Shows a spinner and blocks interaction during async operations.

### Behavior
- Spinner animation displayed
- Click events blocked
- Original content hidden but preserves width
- \\\`aria-busy="true"\\\` for accessibility
- Icons are hidden during loading
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4 gap-4'
        },
        children: [{
          id: 'btn-selected',
          type: 'Button',
          state: {
            appearance: 'default',
            isSelected: true
          },
          children: [{
            id: 'text',
            type: 'Span',
            state: {
              text: 'Selected'
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
## Selected State

Toggle/selected state for buttons that act as toggles.

### Behavior
- Visual feedback with selected background color
- \\\`aria-pressed="true"\\\` for accessibility
- Can be combined with any appearance
- Useful for toggle buttons, filters, etc.
        \`
      }
    }
  }
}`,...g.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Button appearance="primary" iconBefore={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>}>
        Search
      </Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Icon Before Label

Add an icon before the button label using \\\`iconBefore\\\` prop.

### Specifications
- Icon size: 16x16px
- Gap between icon and label: 6px
- Icon inherits text color
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Button appearance="default" iconAfter={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>}>
        Dropdown
      </Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Icon After Label

Add an icon after the button label using \\\`iconAfter\\\` prop.

### Specifications
- Icon size: 12x12px (smaller for chevrons)
- Gap between label and icon: 6px
- Commonly used for dropdown indicators
        \`
      }
    }
  }
}`,...S.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Button appearance="primary" iconBefore={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>} iconAfter={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M19 9l-7 7-7-7" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>}>
        Add Item
      </Button>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Both Icons

Buttons can have both iconBefore and iconAfter simultaneously.

### Use Case
- Split button patterns
- Complex action indicators
        \`
      }
    }
  }
}`,...v.parameters?.docs?.source}}};D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
            text: 'All Appearances'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'buttons-row',
          type: 'Div',
          attributes: {
            className: 'flex flex-wrap gap-4 items-center'
          },
          children: (['default', 'primary', 'subtle', 'warning', 'danger'] as const).map(appearance => ({
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
          }))
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## All Appearances Overview

Visual comparison of all 5 appearance variants side by side.

| Appearance | Use Case |
|------------|----------|
| Default | Secondary actions |
| Primary | Primary actions |
| Subtle | Tertiary/link-like |
| Warning | Attention needed |
| Danger | Destructive actions |
        \`
      }
    }
  }
}`,...D.parameters?.docs?.source}}};B.parameters={...B.parameters,docs:{...B.parameters?.docs,source:{originalSource:`{
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
            text: 'Spacing Comparison'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'comparison-row',
          type: 'Div',
          attributes: {
            className: 'flex gap-8 items-end'
          },
          children: [{
            id: 'default-col',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2 items-center'
            },
            children: [{
              id: 'default-label',
              type: 'Span',
              state: {
                text: 'Default (32px)'
              },
              attributes: {
                className: 'text-sm font-medium'
              }
            }, {
              id: 'default-btn',
              type: 'Button',
              state: {
                appearance: 'primary',
                spacing: 'default'
              },
              children: [{
                id: 'default-text',
                type: 'Span',
                state: {
                  text: 'Button'
                }
              }]
            }]
          }, {
            id: 'compact-col',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2 items-center'
            },
            children: [{
              id: 'compact-label',
              type: 'Span',
              state: {
                text: 'Compact (24px)'
              },
              attributes: {
                className: 'text-sm font-medium'
              }
            }, {
              id: 'compact-btn',
              type: 'Button',
              state: {
                appearance: 'primary',
                spacing: 'compact'
              },
              children: [{
                id: 'compact-text',
                type: 'Span',
                state: {
                  text: 'Button'
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
## Spacing Side-by-Side

Compare default and compact spacing options.

| Spacing | Height | Padding | Font |
|---------|--------|---------|------|
| Default | 32px | 12px | 14px |
| Compact | 24px | 8px | 12px |
        \`
      }
    }
  }
}`,...B.parameters?.docs?.source}}};N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
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
            text: 'States Matrix'
          },
          attributes: {
            className: 'text-xl font-bold mb-4'
          }
        },
        // Header row
        {
          id: 'header',
          type: 'Div',
          attributes: {
            className: 'grid grid-cols-6 gap-4 items-center mb-2'
          },
          children: [{
            id: 'h-appearance',
            type: 'Span',
            state: {
              text: 'Appearance'
            },
            attributes: {
              className: 'font-bold'
            }
          }, {
            id: 'h-default',
            type: 'Span',
            state: {
              text: 'Default'
            },
            attributes: {
              className: 'text-center text-sm'
            }
          }, {
            id: 'h-disabled',
            type: 'Span',
            state: {
              text: 'Disabled'
            },
            attributes: {
              className: 'text-center text-sm'
            }
          }, {
            id: 'h-loading',
            type: 'Span',
            state: {
              text: 'Loading'
            },
            attributes: {
              className: 'text-center text-sm'
            }
          }, {
            id: 'h-selected',
            type: 'Span',
            state: {
              text: 'Selected'
            },
            attributes: {
              className: 'text-center text-sm'
            }
          }, {
            id: 'h-hover',
            type: 'Span',
            state: {
              text: 'Hover (try)'
            },
            attributes: {
              className: 'text-center text-sm'
            }
          }]
        },
        // Data rows
        ...appearances.map(appearance => ({
          id: \`row-\${appearance}\`,
          type: 'Div',
          attributes: {
            className: 'grid grid-cols-6 gap-4 items-center'
          },
          children: [{
            id: \`label-\${appearance}\`,
            type: 'Span',
            state: {
              text: appearance.charAt(0).toUpperCase() + appearance.slice(1)
            },
            attributes: {
              className: 'font-medium capitalize'
            }
          }, {
            id: \`btn-default-\${appearance}\`,
            type: 'Button',
            state: {
              appearance
            },
            children: [{
              id: \`text-default-\${appearance}\`,
              type: 'Span',
              state: {
                text: 'Button'
              }
            }]
          }, {
            id: \`btn-disabled-\${appearance}\`,
            type: 'Button',
            state: {
              appearance,
              isDisabled: true
            },
            children: [{
              id: \`text-disabled-\${appearance}\`,
              type: 'Span',
              state: {
                text: 'Button'
              }
            }]
          }, {
            id: \`btn-loading-\${appearance}\`,
            type: 'Button',
            state: {
              appearance,
              isLoading: true
            },
            children: [{
              id: \`text-loading-\${appearance}\`,
              type: 'Span',
              state: {
                text: 'Button'
              }
            }]
          }, {
            id: \`btn-selected-\${appearance}\`,
            type: 'Button',
            state: {
              appearance,
              isSelected: true
            },
            children: [{
              id: \`text-selected-\${appearance}\`,
              type: 'Span',
              state: {
                text: 'Button'
              }
            }]
          }, {
            id: \`btn-hover-\${appearance}\`,
            type: 'Button',
            state: {
              appearance
            },
            children: [{
              id: \`text-hover-\${appearance}\`,
              type: 'Span',
              state: {
                text: 'Button'
              }
            }]
          }]
        }))]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Complete States Matrix

A comprehensive view of all appearance variants across different states.

### States Shown
- **Default**: Normal interactive state
- **Disabled**: Non-interactive, reduced opacity
- **Loading**: Spinner shown, interaction blocked
- **Selected**: Toggle/selected state
- **Hover**: Hover over to see hover state
        \`
      }
    }
  }
}`,...N.parameters?.docs?.source}}};w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  render: () => {
    const appearances = ['default', 'primary', 'subtle', 'warning', 'danger'] as const;
    const spacings = ['default', 'compact'] as const;
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
            text: 'Complete Button Matrix (ADS Style)'
          },
          attributes: {
            className: 'text-2xl font-bold'
          }
        }, {
          id: 'subtitle',
          type: 'Span',
          state: {
            text: '5 Appearances × 2 Spacings = 10 Combinations'
          },
          attributes: {
            className: 'text-sm text-gray-600 mb-4'
          }
        }, ...spacings.map(spacing => ({
          id: \`section-\${spacing}\`,
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-4'
          },
          children: [{
            id: \`section-title-\${spacing}\`,
            type: 'Span',
            state: {
              text: \`Spacing: \${spacing} (\${spacing === 'default' ? '32px' : '24px'})\`
            },
            attributes: {
              className: 'text-lg font-semibold'
            }
          }, {
            id: \`buttons-\${spacing}\`,
            type: 'Div',
            attributes: {
              className: 'flex flex-wrap gap-4 items-center'
            },
            children: appearances.map(appearance => ({
              id: \`btn-\${spacing}-\${appearance}\`,
              type: 'Button',
              state: {
                appearance,
                spacing
              },
              children: [{
                id: \`text-\${spacing}-\${appearance}\`,
                type: 'Span',
                state: {
                  text: appearance.charAt(0).toUpperCase() + appearance.slice(1)
                }
              }]
            }))
          }]
        }))]
      }
    };
    return <SduiLayoutRenderer document={document} components={sduiComponents} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Complete Button Matrix

All 10 button combinations organized by spacing.

### Matrix Overview

| Spacing \\\\ Appearance | Default | Primary | Subtle | Warning | Danger |
|----------------------|---------|---------|--------|---------|--------|
| Default (32px) | ✓ | ✓ | ✓ | ✓ | ✓ |
| Compact (24px) | ✓ | ✓ | ✓ | ✓ | ✓ |

### Usage Guidelines

- **Primary actions**: Use \\\`primary\\\` appearance
- **Secondary actions**: Use \\\`default\\\` appearance
- **Tertiary actions**: Use \\\`subtle\\\` appearance
- **Warning actions**: Use \\\`warning\\\` appearance
- **Destructive actions**: Use \\\`danger\\\` appearance
        \`
      }
    }
  }
}`,...w.parameters?.docs?.source}}};const I=["Playground","AppearanceDefault","AppearancePrimary","AppearanceSubtle","AppearanceWarning","AppearanceDanger","SpacingDefault","SpacingCompact","StateDisabled","StateLoading","StateSelected","WithIconBefore","WithIconAfter","WithBothIcons","AllAppearances","SpacingComparison","StatesMatrix","CompleteMatrix"];export{D as AllAppearances,m as AppearanceDanger,p as AppearanceDefault,d as AppearancePrimary,l as AppearanceSubtle,u as AppearanceWarning,w as CompleteMatrix,c as Playground,f as SpacingCompact,B as SpacingComparison,b as SpacingDefault,y as StateDisabled,x as StateLoading,g as StateSelected,N as StatesMatrix,v as WithBothIcons,S as WithIconAfter,h as WithIconBefore,I as __namedExportsOrder,W as default};
