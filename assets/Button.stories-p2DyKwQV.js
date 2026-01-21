import{j as i}from"./jsx-runtime-Cb4Z16sN.js";import{B as g}from"./Button-BZms-g6p.js";import{S as $,T as z,D,a as s}from"./Text-xwKBzp0m.js";import{B as T}from"./ButtonContainer-BG3NHme-.js";import"./iframe-CpJpjxFN.js";import"./preload-helper-ggYluGXI.js";import"./index-D16ifo--.js";import"./index-CwaGITsL.js";import"./types-lBip4we0.js";function a(){return{Button:(e,t)=>i.jsx(T,{id:e,parentPath:t}),Div:(e,t)=>i.jsx(D,{id:e,parentPath:t}),Text:e=>i.jsx(z,{id:e}),Span:e=>i.jsx($,{id:e})}}const k={title:"Shared/UI/Button",component:g,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Button** component is an interactive element that triggers specific actions when clicked. It's a fundamental UI component used throughout the application for user interactions.

## Features

### Visual Variants
- **Filled**: Solid background, highest emphasis
- **Outline**: Transparent with border, medium emphasis
- **Text**: No background/border, lowest emphasis

### Sizes
- **L (Large)**: 40px height, 16px text
- **M (Medium)**: 32px height, 14px text (default)
- **S (Small)**: 24px height, 12px text (text buttons only)

### Types
- **Primary**: Main action color scheme
- **Secondary**: Alternative action color scheme

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Enter & Space keys)
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers

## Common Use Cases

- Form submissions
- Navigation actions
- Dialog confirmations
- Feature toggles
        `}}}},o={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

The **default button configuration** represents the most commonly used variant in the design system.

## Configuration

- **Style**: Filled
- **Size**: Medium (M)
- **Type**: Primary

## Usage

This is the recommended starting point for most button implementations. Use this variant for primary actions that need clear visual emphasis.
        `}}}},r={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Filled Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Filled buttons** feature a solid background color and provide the highest visual emphasis among all button styles.

## Characteristics

- Solid background color
- Highest visual weight
- Strong call-to-action presence

## Best Practices

- Use for **primary actions** only
- Limit to **1-2 per screen** to maintain hierarchy
- Reserve for the most important user actions

## When to Use

- Submit forms
- Confirm critical actions
- Primary navigation
        `}}}},l={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"outline",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Outline Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Outline buttons** feature a transparent background with a visible border, providing medium visual emphasis.

## Characteristics

- Transparent background
- Visible border
- Medium visual weight

## Best Practices

- Use for **secondary actions**
- Pair with filled buttons for hierarchy
- Suitable for cancel/dismiss actions

## When to Use

- Secondary form actions
- Cancel buttons
- Alternative navigation options
        `}}}},c={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"text",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Text Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Text buttons** have no background or border, relying solely on text color for visibility. They provide the least visual emphasis.

## Characteristics

- No background or border
- Lowest visual weight
- Minimal visual footprint

## Size Support

Unlike filled and outline buttons, text buttons support **all three sizes**:
- **L** (Large)
- **M** (Medium)
- **S** (Small)

## Best Practices

- Use for **tertiary actions**
- Ideal for less critical actions
- Great for compact UIs

## When to Use

- Tertiary actions
- Link-like buttons
- Compact interfaces
- Mobile-friendly designs
        `}}}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"L",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Size L"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Large buttons (Size L)** are the most prominent size, ideal for important call-to-action elements.

## Specifications

- **Height**: 40px
- **Text size**: 16px
- **Visual weight**: High

## Best Use Cases

- Hero section CTAs
- Primary user flows
- Landing page actions
- Mobile-friendly touch targets

## When to Use

Use Size L when you need maximum visibility and want to guide users toward the primary action.
        `}}}},u={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Size M"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Medium buttons (Size M)** are the default size and the most versatile option for general use.

## Specifications

- **Height**: 32px
- **Text size**: 14px
- **Visual weight**: Medium

## Why Default?

- Balanced proportions
- Works well in most contexts
- Good readability
- Standard touch target size

## Best Use Cases

- Standard form buttons
- General UI actions
- Navigation elements
- Most common use cases
        `}}}},p={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"text",size:"S",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Size S"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Small buttons (Size S)** provide a compact option for space-constrained interfaces.

## Specifications

- **Height**: 24px
- **Text size**: 12px
- **Visual weight**: Low

## Important Note

⚠️ **Size S is only available for text buttons**, not filled or outline buttons.

## Best Use Cases

- Compact toolbars
- Inline actions
- Dense interfaces
- Secondary actions in tight spaces

## When to Use

Use Size S when space is limited but you still need a clickable action element.
        `}}}},m={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"primary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Primary Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Primary buttons** use the primary color scheme from the design system, indicating the most important action.

## Characteristics

- Primary brand color
- Highest priority indication
- Main call-to-action

## Best Practices

- Use for **the most important action** on a page
- Typically only **one per screen**
- Should be visually distinct from secondary buttons

## Common Use Cases

- Submit forms
- Save changes
- Confirm actions
- Primary navigation
        `}}}},b={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"secondary",disabled:!1},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Secondary Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Secondary buttons** use the secondary color scheme, indicating important but less critical actions.

## Characteristics

- Secondary brand color
- Medium priority indication
- Alternative action option

## Best Practices

- Use alongside primary buttons
- Provides alternative actions
- Maintains visual hierarchy

## Common Use Cases

- Cancel actions
- Alternative options
- Secondary form actions
- Additional navigation paths
        `}}}},y={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"button-1",type:"Button",state:{buttonStyle:"filled",size:"M",buttonType:"primary",disabled:!0},attributes:{type:"button"},children:[{id:"button-text",type:"Span",state:{text:"Disabled Button"}}]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

**Disabled buttons** are non-interactive elements that indicate an action is currently unavailable.

## Visual Characteristics

- Reduced opacity (50%)
- Non-clickable state
- Maintains visual style
- Clear "unavailable" indication

## Behavior

- ❌ Cannot be clicked
- ❌ Keyboard navigation disabled
- ❌ No hover/press states
- ✅ Visual style preserved

## When to Use

- Form validation pending
- Permission restrictions
- Loading states
- Conditional availability

## Best Practices

- Provide clear feedback about why disabled
- Consider showing tooltip explaining restriction
- Re-enable when conditions are met
        `}}}},x={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-6"},children:[{id:"title",type:"Span",state:{text:"Filled Style - All Combinations"},attributes:{className:"text-lg font-bold mb-4"}},{id:"buttons-container",type:"Div",attributes:{className:"flex flex-wrap gap-4"},children:[...["L","M"].flatMap(t=>["primary","secondary"].map((n,C)=>({id:`button-filled-${t}-${n}`,type:"Button",state:{buttonStyle:"filled",size:t,buttonType:n},children:[{id:`button-text-filled-${t}-${n}`,type:"Span",state:{text:`Filled ${t} ${n}`}}]})))]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

Displays **all available combinations** of filled button style variants.

## Available Combinations

Filled buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Filled L Primary
2. Filled L Secondary
3. Filled M Primary
4. Filled M Secondary

## Usage

Use this reference to see all filled button options at a glance and choose the appropriate combination for your use case.
        `}}}},h={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-6"},children:[{id:"title",type:"Span",state:{text:"Outline Style - All Combinations"},attributes:{className:"text-lg font-bold mb-4"}},{id:"buttons-container",type:"Div",attributes:{className:"flex flex-wrap gap-4"},children:[...["L","M"].flatMap(t=>["primary","secondary"].map(n=>({id:`button-outline-${t}-${n}`,type:"Button",state:{buttonStyle:"outline",size:t,buttonType:n},children:[{id:`button-text-outline-${t}-${n}`,type:"Span",state:{text:`Outline ${t} ${n}`}}]})))]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

Displays **all available combinations** of outline button style variants.

## Available Combinations

Outline buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Outline L Primary
2. Outline L Secondary
3. Outline M Primary
4. Outline M Secondary

## Usage

Use this reference to see all outline button options and choose the appropriate combination for secondary actions.
        `}}}},f={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-6"},children:[{id:"title",type:"Span",state:{text:"Text Style - All Combinations"},attributes:{className:"text-lg font-bold mb-4"}},{id:"buttons-container",type:"Div",attributes:{className:"flex flex-wrap gap-4"},children:[...["L","M","S"].flatMap(t=>["primary","secondary"].map(n=>({id:`button-text-${t}-${n}`,type:"Button",state:{buttonStyle:"text",size:t,buttonType:n},children:[{id:`button-text-text-${t}-${n}`,type:"Span",state:{text:`Text ${t} ${n}`}}]})))]}]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

Displays **all available combinations** of text button style variants.

## Available Combinations

Text buttons support:
- **3 sizes**: L, M, S (unique!)
- **2 types**: Primary, Secondary
- **Total**: 6 combinations

## Unique Feature

✨ **Text buttons are the only style** that supports the small (S) size variant.

## Combinations Shown

1. Text L Primary
2. Text L Secondary
3. Text M Primary
4. Text M Secondary
5. Text S Primary
6. Text S Secondary

## Usage

Use this reference to see all text button options, including the compact Size S variant.
        `}}}},v={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"States - Default, Hover, Press, Disabled"},attributes:{className:"text-lg font-bold mb-4"}},...["filled","outline","text"].map(t=>({id:`style-${t}`,type:"Div",attributes:{className:"flex flex-col gap-2"},children:[{id:`style-title-${t}`,type:"Span",state:{text:`${t.charAt(0).toUpperCase()+t.slice(1)} Style`},attributes:{className:"text-base font-semibold capitalize"}},{id:`buttons-row-${t}`,type:"Div",attributes:{className:"flex gap-4 items-center"},children:[{id:`button-default-${t}`,type:"Div",attributes:{className:"flex flex-col gap-1"},children:[{id:`label-default-${t}`,type:"Span",state:{text:"Default"},attributes:{className:"text-xs mb-1"}},{id:`button-default-btn-${t}`,type:"Button",state:{buttonStyle:t,size:"M",buttonType:"primary"},children:[{id:`button-text-default-${t}`,type:"Span",state:{text:"Label"}}]}]},{id:`button-hover-${t}`,type:"Div",attributes:{className:"flex flex-col gap-1"},children:[{id:`label-hover-${t}`,type:"Span",state:{text:"Hover (hover to see)"},attributes:{className:"text-xs mb-1"}},{id:`button-hover-btn-${t}`,type:"Button",state:{buttonStyle:t,size:"M",buttonType:"primary"},children:[{id:`button-text-hover-${t}`,type:"Span",state:{text:"Label"}}]}]},{id:`button-press-${t}`,type:"Div",attributes:{className:"flex flex-col gap-1"},children:[{id:`label-press-${t}`,type:"Span",state:{text:"Press (click to see)"},attributes:{className:"text-xs mb-1"}},{id:`button-press-btn-${t}`,type:"Button",state:{buttonStyle:t,size:"M",buttonType:"primary"},children:[{id:`button-text-press-${t}`,type:"Span",state:{text:"Label"}}]}]},{id:`button-disabled-${t}`,type:"Div",attributes:{className:"flex flex-col gap-1"},children:[{id:`label-disabled-${t}`,type:"Span",state:{text:"Disabled"},attributes:{className:"text-xs mb-1"}},{id:`button-disabled-btn-${t}`,type:"Button",state:{buttonStyle:t,size:"M",buttonType:"primary"},attributes:{disabled:!0},children:[{id:`button-text-disabled-${t}`,type:"Span",state:{text:"Label"}}]}]}]}]}))]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

Demonstrates the **interactive states** of buttons across all three styles (filled, outline, text).

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Visual feedback on hover
- Indicates interactivity

### 3. Press/Active
- Click/press state
- Immediate feedback
- Confirms interaction

### 4. Disabled
- Non-interactive state
- Reduced opacity
- Clear "unavailable" indication

## Consistency

All styles maintain **consistent state behavior** while using their respective color schemes, ensuring a cohesive user experience across all button variants.

## Try It

- **Hover** over buttons to see hover states
- **Click** buttons to see press/active states
- Observe disabled buttons for non-interactive state
        `}}}},S={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-8 p-6"},children:[{id:"title",type:"Span",state:{text:"Button - All Combinations"},attributes:{className:"text-2xl font-bold mb-2"}},{id:"note",type:"Span",state:{text:"*To reduce complexity, styles are separated into individual components rather than being properties"},attributes:{className:"text-sm text-gray-600 mb-4"}},...["filled","outline","text"].map(t=>({id:`section-${t}`,type:"Div",attributes:{className:"flex flex-col gap-6 border-t border-gray-200 pt-6"},children:[{id:`section-title-${t}`,type:"Span",state:{text:`Button_${t.charAt(0).toUpperCase()+t.slice(1)}`},attributes:{className:"text-xl font-bold capitalize"}},{id:`sizes-section-${t}`,type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:`sizes-title-${t}`,type:"Span",state:{text:"Size"},attributes:{className:"text-base font-semibold"}},{id:`sizes-container-${t}`,type:"Div",attributes:{className:"flex gap-4 flex-wrap"},children:(t==="text"?["L","M","S"]:["L","M"]).map(n=>({id:`size-item-${t}-${n}`,type:"Div",attributes:{className:"flex flex-col gap-2 items-center"},children:[{id:`size-label-${t}-${n}`,type:"Span",state:{text:`Size ${n}`},attributes:{className:"text-sm font-bold"}},{id:`size-button-${t}-${n}`,type:"Button",state:{buttonStyle:t,size:n,buttonType:"primary"},children:[{id:`size-button-text-${t}-${n}`,type:"Span",state:{text:"Label"}}]}]}))}]},{id:`types-section-${t}`,type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:`types-title-${t}`,type:"Span",state:{text:"Type"},attributes:{className:"text-base font-semibold"}},{id:`types-container-${t}`,type:"Div",attributes:{className:"flex gap-4 flex-wrap"},children:["primary","secondary"].map(n=>({id:`type-item-${t}-${n}`,type:"Div",attributes:{className:"flex flex-col gap-2 items-center"},children:[{id:`type-label-${t}-${n}`,type:"Span",state:{text:`Type ${n.charAt(0).toUpperCase()+n.slice(1)}`},attributes:{className:"text-sm font-bold"}},{id:`type-button-${t}-${n}`,type:"Button",state:{buttonStyle:t,size:"M",buttonType:n},children:[{id:`type-button-text-${t}-${n}`,type:"Span",state:{text:"Label"}}]}]}))}]}]}))]}};return i.jsx(s,{document:e,components:a()})},parameters:{docs:{description:{story:`
## Overview

A **comprehensive showcase** of all button combinations organized by style, providing a complete reference for the button design system.

## Organization

Each style section displays:
- ✅ Available sizes
- ✅ Type variants
- ✅ Interactive states (Default, Hover, Press, Disabled)

## What's Included

### Style Sections
1. **Filled** - All combinations
2. **Outline** - All combinations
3. **Text** - All combinations

### For Each Style
- Size variations
- Type variations (Primary/Secondary)
- State demonstrations

## Purpose

This matrix helps:
- **Designers** understand visual options
- **Developers** choose appropriate variants
- **Teams** maintain design consistency

## Usage

Use this comprehensive reference to:
- Compare all button options
- Understand the complete system
- Make informed design decisions
        `}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

The **default button configuration** represents the most commonly used variant in the design system.

## Configuration

- **Style**: Filled
- **Size**: Medium (M)
- **Type**: Primary

## Usage

This is the recommended starting point for most button implementations. Use this variant for primary actions that need clear visual emphasis.
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Filled Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Filled buttons** feature a solid background color and provide the highest visual emphasis among all button styles.

## Characteristics

- Solid background color
- Highest visual weight
- Strong call-to-action presence

## Best Practices

- Use for **primary actions** only
- Limit to **1-2 per screen** to maintain hierarchy
- Reserve for the most important user actions

## When to Use

- Submit forms
- Confirm critical actions
- Primary navigation
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'outline',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Outline Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Outline buttons** feature a transparent background with a visible border, providing medium visual emphasis.

## Characteristics

- Transparent background
- Visible border
- Medium visual weight

## Best Practices

- Use for **secondary actions**
- Pair with filled buttons for hierarchy
- Suitable for cancel/dismiss actions

## When to Use

- Secondary form actions
- Cancel buttons
- Alternative navigation options
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'text',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Text Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Text buttons** have no background or border, relying solely on text color for visibility. They provide the least visual emphasis.

## Characteristics

- No background or border
- Lowest visual weight
- Minimal visual footprint

## Size Support

Unlike filled and outline buttons, text buttons support **all three sizes**:
- **L** (Large)
- **M** (Medium)
- **S** (Small)

## Best Practices

- Use for **tertiary actions**
- Ideal for less critical actions
- Great for compact UIs

## When to Use

- Tertiary actions
- Link-like buttons
- Compact interfaces
- Mobile-friendly designs
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'L',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Size L'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Large buttons (Size L)** are the most prominent size, ideal for important call-to-action elements.

## Specifications

- **Height**: 40px
- **Text size**: 16px
- **Visual weight**: High

## Best Use Cases

- Hero section CTAs
- Primary user flows
- Landing page actions
- Mobile-friendly touch targets

## When to Use

Use Size L when you need maximum visibility and want to guide users toward the primary action.
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Size M'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Medium buttons (Size M)** are the default size and the most versatile option for general use.

## Specifications

- **Height**: 32px
- **Text size**: 14px
- **Visual weight**: Medium

## Why Default?

- Balanced proportions
- Works well in most contexts
- Good readability
- Standard touch target size

## Best Use Cases

- Standard form buttons
- General UI actions
- Navigation elements
- Most common use cases
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'text',
            size: 'S',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Size S'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Small buttons (Size S)** provide a compact option for space-constrained interfaces.

## Specifications

- **Height**: 24px
- **Text size**: 12px
- **Visual weight**: Low

## Important Note

⚠️ **Size S is only available for text buttons**, not filled or outline buttons.

## Best Use Cases

- Compact toolbars
- Inline actions
- Dense interfaces
- Secondary actions in tight spaces

## When to Use

Use Size S when space is limited but you still need a clickable action element.
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'primary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Primary Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Primary buttons** use the primary color scheme from the design system, indicating the most important action.

## Characteristics

- Primary brand color
- Highest priority indication
- Main call-to-action

## Best Practices

- Use for **the most important action** on a page
- Typically only **one per screen**
- Should be visually distinct from secondary buttons

## Common Use Cases

- Submit forms
- Save changes
- Confirm actions
- Primary navigation
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'secondary',
            disabled: false
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Secondary Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Secondary buttons** use the secondary color scheme, indicating important but less critical actions.

## Characteristics

- Secondary brand color
- Medium priority indication
- Alternative action option

## Best Practices

- Use alongside primary buttons
- Provides alternative actions
- Maintains visual hierarchy

## Common Use Cases

- Cancel actions
- Alternative options
- Secondary form actions
- Additional navigation paths
        \`
      }
    }
  }
}`,...b.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'button-1',
          type: 'Button',
          state: {
            buttonStyle: 'filled',
            size: 'M',
            buttonType: 'primary',
            disabled: true
          },
          attributes: {
            type: 'button'
          },
          children: [{
            id: 'button-text',
            type: 'Span',
            state: {
              text: 'Disabled Button'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Disabled buttons** are non-interactive elements that indicate an action is currently unavailable.

## Visual Characteristics

- Reduced opacity (50%)
- Non-clickable state
- Maintains visual style
- Clear "unavailable" indication

## Behavior

- ❌ Cannot be clicked
- ❌ Keyboard navigation disabled
- ❌ No hover/press states
- ✅ Visual style preserved

## When to Use

- Form validation pending
- Permission restrictions
- Loading states
- Conditional availability

## Best Practices

- Provide clear feedback about why disabled
- Consider showing tooltip explaining restriction
- Re-enable when conditions are met
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
          className: 'flex flex-col gap-4 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Filled Style - All Combinations'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'buttons-container',
          type: 'Div',
          attributes: {
            className: 'flex flex-wrap gap-4'
          },
          children: [...(['L', 'M'] as const).flatMap(size => (['primary', 'secondary'] as const).map((buttonType, index) => ({
            id: \`button-filled-\${size}-\${buttonType}\`,
            type: 'Button',
            state: {
              buttonStyle: 'filled' as const,
              size,
              buttonType
            },
            children: [{
              id: \`button-text-filled-\${size}-\${buttonType}\`,
              type: 'Span',
              state: {
                text: \`Filled \${size} \${buttonType}\`
              }
            }]
          })))]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Displays **all available combinations** of filled button style variants.

## Available Combinations

Filled buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Filled L Primary
2. Filled L Secondary
3. Filled M Primary
4. Filled M Secondary

## Usage

Use this reference to see all filled button options at a glance and choose the appropriate combination for your use case.
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Outline Style - All Combinations'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'buttons-container',
          type: 'Div',
          attributes: {
            className: 'flex flex-wrap gap-4'
          },
          children: [...(['L', 'M'] as const).flatMap(size => (['primary', 'secondary'] as const).map(buttonType => ({
            id: \`button-outline-\${size}-\${buttonType}\`,
            type: 'Button',
            state: {
              buttonStyle: 'outline' as const,
              size,
              buttonType
            },
            children: [{
              id: \`button-text-outline-\${size}-\${buttonType}\`,
              type: 'Span',
              state: {
                text: \`Outline \${size} \${buttonType}\`
              }
            }]
          })))]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Displays **all available combinations** of outline button style variants.

## Available Combinations

Outline buttons support:
- **2 sizes**: L, M
- **2 types**: Primary, Secondary
- **Total**: 4 combinations

## Combinations Shown

1. Outline L Primary
2. Outline L Secondary
3. Outline M Primary
4. Outline M Secondary

## Usage

Use this reference to see all outline button options and choose the appropriate combination for secondary actions.
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Text Style - All Combinations'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'buttons-container',
          type: 'Div',
          attributes: {
            className: 'flex flex-wrap gap-4'
          },
          children: [...(['L', 'M', 'S'] as const).flatMap(size => (['primary', 'secondary'] as const).map(buttonType => ({
            id: \`button-text-\${size}-\${buttonType}\`,
            type: 'Button',
            state: {
              buttonStyle: 'text' as const,
              size,
              buttonType
            },
            children: [{
              id: \`button-text-text-\${size}-\${buttonType}\`,
              type: 'Span',
              state: {
                text: \`Text \${size} \${buttonType}\`
              }
            }]
          })))]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Displays **all available combinations** of text button style variants.

## Available Combinations

Text buttons support:
- **3 sizes**: L, M, S (unique!)
- **2 types**: Primary, Secondary
- **Total**: 6 combinations

## Unique Feature

✨ **Text buttons are the only style** that supports the small (S) size variant.

## Combinations Shown

1. Text L Primary
2. Text L Secondary
3. Text M Primary
4. Text M Secondary
5. Text S Primary
6. Text S Secondary

## Usage

Use this reference to see all text button options, including the compact Size S variant.
        \`
      }
    }
  }
}`,...f.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
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
            text: 'States - Default, Hover, Press, Disabled'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, ...(['filled', 'outline', 'text'] as const).map(buttonStyle => ({
          id: \`style-\${buttonStyle}\`,
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-2'
          },
          children: [{
            id: \`style-title-\${buttonStyle}\`,
            type: 'Span',
            state: {
              text: \`\${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)} Style\`
            },
            attributes: {
              className: 'text-base font-semibold capitalize'
            }
          }, {
            id: \`buttons-row-\${buttonStyle}\`,
            type: 'Div',
            attributes: {
              className: 'flex gap-4 items-center'
            },
            children: [{
              id: \`button-default-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-1'
              },
              children: [{
                id: \`label-default-\${buttonStyle}\`,
                type: 'Span',
                state: {
                  text: 'Default'
                },
                attributes: {
                  className: 'text-xs mb-1'
                }
              }, {
                id: \`button-default-btn-\${buttonStyle}\`,
                type: 'Button',
                state: {
                  buttonStyle,
                  size: 'M',
                  buttonType: 'primary'
                },
                children: [{
                  id: \`button-text-default-\${buttonStyle}\`,
                  type: 'Span',
                  state: {
                    text: 'Label'
                  }
                }]
              }]
            }, {
              id: \`button-hover-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-1'
              },
              children: [{
                id: \`label-hover-\${buttonStyle}\`,
                type: 'Span',
                state: {
                  text: 'Hover (hover to see)'
                },
                attributes: {
                  className: 'text-xs mb-1'
                }
              }, {
                id: \`button-hover-btn-\${buttonStyle}\`,
                type: 'Button',
                state: {
                  buttonStyle,
                  size: 'M',
                  buttonType: 'primary'
                },
                children: [{
                  id: \`button-text-hover-\${buttonStyle}\`,
                  type: 'Span',
                  state: {
                    text: 'Label'
                  }
                }]
              }]
            }, {
              id: \`button-press-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-1'
              },
              children: [{
                id: \`label-press-\${buttonStyle}\`,
                type: 'Span',
                state: {
                  text: 'Press (click to see)'
                },
                attributes: {
                  className: 'text-xs mb-1'
                }
              }, {
                id: \`button-press-btn-\${buttonStyle}\`,
                type: 'Button',
                state: {
                  buttonStyle,
                  size: 'M',
                  buttonType: 'primary'
                },
                children: [{
                  id: \`button-text-press-\${buttonStyle}\`,
                  type: 'Span',
                  state: {
                    text: 'Label'
                  }
                }]
              }]
            }, {
              id: \`button-disabled-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex flex-col gap-1'
              },
              children: [{
                id: \`label-disabled-\${buttonStyle}\`,
                type: 'Span',
                state: {
                  text: 'Disabled'
                },
                attributes: {
                  className: 'text-xs mb-1'
                }
              }, {
                id: \`button-disabled-btn-\${buttonStyle}\`,
                type: 'Button',
                state: {
                  buttonStyle,
                  size: 'M',
                  buttonType: 'primary'
                },
                attributes: {
                  disabled: true
                },
                children: [{
                  id: \`button-text-disabled-\${buttonStyle}\`,
                  type: 'Span',
                  state: {
                    text: 'Label'
                  }
                }]
              }]
            }]
          }]
        }))]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Demonstrates the **interactive states** of buttons across all three styles (filled, outline, text).

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Visual feedback on hover
- Indicates interactivity

### 3. Press/Active
- Click/press state
- Immediate feedback
- Confirms interaction

### 4. Disabled
- Non-interactive state
- Reduced opacity
- Clear "unavailable" indication

## Consistency

All styles maintain **consistent state behavior** while using their respective color schemes, ensuring a cohesive user experience across all button variants.

## Try It

- **Hover** over buttons to see hover states
- **Click** buttons to see press/active states
- Observe disabled buttons for non-interactive state
        \`
      }
    }
  }
}`,...v.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => {
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
            text: 'Button - All Combinations'
          },
          attributes: {
            className: 'text-2xl font-bold mb-2'
          }
        }, {
          id: 'note',
          type: 'Span',
          state: {
            text: '*To reduce complexity, styles are separated into individual components rather than being properties'
          },
          attributes: {
            className: 'text-sm text-gray-600 mb-4'
          }
        }, ...(['filled', 'outline', 'text'] as const).map(buttonStyle => ({
          id: \`section-\${buttonStyle}\`,
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-6 border-t border-gray-200 pt-6'
          },
          children: [{
            id: \`section-title-\${buttonStyle}\`,
            type: 'Span',
            state: {
              text: \`Button_\${buttonStyle.charAt(0).toUpperCase() + buttonStyle.slice(1)}\`
            },
            attributes: {
              className: 'text-xl font-bold capitalize'
            }
          },
          // Sizes section
          {
            id: \`sizes-section-\${buttonStyle}\`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-4'
            },
            children: [{
              id: \`sizes-title-\${buttonStyle}\`,
              type: 'Span',
              state: {
                text: 'Size'
              },
              attributes: {
                className: 'text-base font-semibold'
              }
            }, {
              id: \`sizes-container-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex gap-4 flex-wrap'
              },
              children: (buttonStyle === 'text' ? ['L', 'M', 'S'] as const : ['L', 'M'] as const).map(size => ({
                id: \`size-item-\${buttonStyle}-\${size}\`,
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2 items-center'
                },
                children: [{
                  id: \`size-label-\${buttonStyle}-\${size}\`,
                  type: 'Span',
                  state: {
                    text: \`Size \${size}\`
                  },
                  attributes: {
                    className: 'text-sm font-bold'
                  }
                }, {
                  id: \`size-button-\${buttonStyle}-\${size}\`,
                  type: 'Button',
                  state: {
                    buttonStyle,
                    size,
                    buttonType: 'primary'
                  },
                  children: [{
                    id: \`size-button-text-\${buttonStyle}-\${size}\`,
                    type: 'Span',
                    state: {
                      text: 'Label'
                    }
                  }]
                }]
              }))
            }]
          },
          // Types section
          {
            id: \`types-section-\${buttonStyle}\`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-4'
            },
            children: [{
              id: \`types-title-\${buttonStyle}\`,
              type: 'Span',
              state: {
                text: 'Type'
              },
              attributes: {
                className: 'text-base font-semibold'
              }
            }, {
              id: \`types-container-\${buttonStyle}\`,
              type: 'Div',
              attributes: {
                className: 'flex gap-4 flex-wrap'
              },
              children: (['primary', 'secondary'] as const).map(buttonType => ({
                id: \`type-item-\${buttonStyle}-\${buttonType}\`,
                type: 'Div',
                attributes: {
                  className: 'flex flex-col gap-2 items-center'
                },
                children: [{
                  id: \`type-label-\${buttonStyle}-\${buttonType}\`,
                  type: 'Span',
                  state: {
                    text: \`Type \${buttonType.charAt(0).toUpperCase() + buttonType.slice(1)}\`
                  },
                  attributes: {
                    className: 'text-sm font-bold'
                  }
                }, {
                  id: \`type-button-\${buttonStyle}-\${buttonType}\`,
                  type: 'Button',
                  state: {
                    buttonStyle,
                    size: 'M',
                    buttonType
                  },
                  children: [{
                    id: \`type-button-text-\${buttonStyle}-\${buttonType}\`,
                    type: 'Span',
                    state: {
                      text: 'Label'
                    }
                  }]
                }]
              }))
            }]
          }]
        }))]
      }
    };
    return <SduiLayoutRenderer document={document} components={getButtonComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

A **comprehensive showcase** of all button combinations organized by style, providing a complete reference for the button design system.

## Organization

Each style section displays:
- ✅ Available sizes
- ✅ Type variants
- ✅ Interactive states (Default, Hover, Press, Disabled)

## What's Included

### Style Sections
1. **Filled** - All combinations
2. **Outline** - All combinations
3. **Text** - All combinations

### For Each Style
- Size variations
- Type variations (Primary/Secondary)
- State demonstrations

## Purpose

This matrix helps:
- **Designers** understand visual options
- **Developers** choose appropriate variants
- **Teams** maintain design consistency

## Usage

Use this comprehensive reference to:
- Compare all button options
- Understand the complete system
- Make informed design decisions
        \`
      }
    }
  }
}`,...S.parameters?.docs?.source}}};const j=["Default","Filled","Outline","Text","SizeL","SizeM","SizeS","Primary","Secondary","Disabled","FilledCombinations","OutlineCombinations","TextCombinations","StatesMatrix","AllCombinations"];export{S as AllCombinations,o as Default,y as Disabled,r as Filled,x as FilledCombinations,l as Outline,h as OutlineCombinations,m as Primary,b as Secondary,d as SizeL,u as SizeM,p as SizeS,v as StatesMatrix,c as Text,f as TextCombinations,j as __namedExportsOrder,k as default};
