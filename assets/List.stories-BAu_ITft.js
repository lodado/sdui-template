import{j as e}from"./jsx-runtime-D2LRXxLP.js";import{a8 as t,S as u,s as v}from"./sduiComponents-DHxdXZOo.js";import"./iframe-DKnaJEuY.js";import"./preload-helper-ggYluGXI.js";import"./index-Bhtou3Fa.js";const y={title:"Shared/UI/List",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **List** component is a compound component pattern for creating interactive navigation list items. It consists of an icon, content (title and description), and an arrow indicator.

## Architecture

Uses the **Compound Component pattern** to flexibly arrange:
- **Icon**: Circular colored background with icon (uses shared Icon component)
- **Content**: Container for title and description
- **Title**: Bold title text
- **Description**: Lighter description text
- **Arrow**: Right-pointing indicator

## Features

### Visual Design
- **Rounded corners**: Soft, modern appearance
- **Hover effects**: Interactive feedback
- **Icon colors**: Blue, green, purple, red, or default
- **Proper spacing**: Consistent gaps between elements

### Interactive States
- **Default**: Ready for interaction
- **Hover**: Background color change
- **Active**: Pressed state feedback
- **Disabled**: Non-interactive state

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** support
- ✅ **Accessibility features** built-in
- ✅ **ARIA attributes** for screen readers
- ✅ **SDUI metadata**: Supports nodeId/eventId data attributes

## Common Use Cases

- Navigation lists
- Action items
- Feature lists
- Learning guides
- Menu items
        `}}}},s=()=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M4 19.5C4 18.3954 4.89543 17.5 6 17.5H18C19.1046 17.5 20 18.3954 20 19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z",fill:"white"}),e.jsx("path",{d:"M6 2.5C5.44772 2.5 5 2.94772 5 3.5V16.5C5 17.0523 5.44772 17.5 6 17.5H18C18.5523 17.5 19 17.0523 19 16.5V3.5C19 2.94772 18.5523 2.5 18 2.5H6Z",fill:"white"})]}),p=()=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("path",{d:"M4 19.5C4 18.3954 4.89543 17.5 6 17.5H18C19.1046 17.5 20 18.3954 20 19.5C20 20.6046 19.1046 21.5 18 21.5H6C4.89543 21.5 4 20.6046 4 19.5Z",fill:"white"}),e.jsx("path",{d:"M6 2.5C5.44772 2.5 5 2.94772 5 3.5V7.5H19V3.5C19 2.94772 18.5523 2.5 18 2.5H6Z",fill:"white"}),e.jsx("path",{d:"M5 9.5H19V16.5C19 17.0523 18.5523 17.5 18 17.5H6C5.44772 17.5 5 17.0523 5 16.5V9.5Z",fill:"white"})]}),m=()=>e.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:[e.jsx("circle",{cx:"12",cy:"12",r:"10",stroke:"white",strokeWidth:"2",fill:"none"}),e.jsx("circle",{cx:"12",cy:"12",r:"3",fill:"white"})]}),h=()=>e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M18 6L6 18M6 6L18 18",stroke:"white",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),o={render:()=>e.jsx("div",{className:"p-4",children:e.jsxs(t,{onClick:()=>console.log("Clicked"),className:"w-[70vw]",nodeId:"storybook-list-default",eventId:"storybook-list-default-click",children:[e.jsx(t.Icon,{color:"blue",children:e.jsx(s,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Read an Article"}),e.jsx(t.Description,{children:"Read today's featured article and save new words"})]}),e.jsx(t.Arrow,{})]})}),parameters:{docs:{description:{story:`
## Overview

The **default list configuration** demonstrates the basic compound component pattern.

## Structure

- **List.Icon**: Blue circular background with book icon (uses shared Icon component)
- **List.Content**: Contains title and description
- **List.Title**: Bold title text
- **List.Description**: Lighter description text
- **List.Arrow**: Right-pointing arrow indicator

## Usage

This is the recommended pattern for creating interactive list items with icons, text, and navigation indicators.
The nodeId and eventId props map to data-node-id and data-event-id attributes for SDUI metadata.
        `}}}},r={render:()=>{const i=[{id:1,iconColor:"blue",title:"1. Read an Article",description:"Read today&apos;s featured article and save new words",icon:e.jsx(s,{})},{id:2,iconColor:"green",title:"2. Review Vocabulary",description:"Check and manage the words you saved",icon:e.jsx(p,{})},{id:3,iconColor:"purple",title:"3. Take a Quiz",description:"Use a quiz to confirm learning progress",icon:e.jsx(m,{})},{id:4,iconColor:"red",title:"4. Review Mistakes",description:"Retry the questions you missed",icon:e.jsx(h,{})}];return e.jsx("div",{className:"p-4",children:e.jsx("div",{className:"flex flex-col gap-3",children:i.map(n=>e.jsxs(t,{onClick:()=>console.log(`Clicked: ${n.title}`),className:"w-[70vw]",children:[e.jsx(t.Icon,{color:n.iconColor,children:n.icon}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:n.title}),e.jsx(t.Description,{children:n.description})]}),e.jsx(t.Arrow,{})]},n.id))})})},parameters:{docs:{description:{story:`
## Overview

**With Multiple Items** demonstrates multiple list items in a vertical layout.

## Figma Design Recreation

This story demonstrates the "Learning Guide" section from the Figma design:

1. **Read an Article** - Blue icon
2. **Review Vocabulary** - Green icon
3. **Take a Quiz** - Purple icon
4. **Review Mistakes** - Red icon

## Icon Colors

- **Blue**: Primary actions
- **Green**: Success/positive actions
- **Purple**: Special features
- **Red**: Important/critical actions

## Best Practices

- Use consistent icon styles
- Maintain color meaning
- Keep descriptions concise
- Ensure proper spacing
        `}}}},a={render:()=>e.jsx("div",{className:"p-4",children:e.jsxs(t,{onClick:i=>{i.preventDefault(),alert("List item clicked!")},className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"blue",children:e.jsx(s,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Interactive List Item"}),e.jsx(t.Description,{children:"Click me to see the interaction"})]}),e.jsx(t.Arrow,{})]})}),parameters:{docs:{description:{story:`
## Overview

**Interactive** demonstrates click event handling in List components.

## Behavior

- **Click handler**: onClick prop receives click events
- **Event object**: Standard React MouseEvent
- **Prevent default**: Can prevent default behavior if needed

## Best Practices

- Provide clear feedback on interaction
- Handle loading states
- Consider navigation vs. action distinction
- Use href for navigation, onClick for actions

## When to Use

- Navigation links
- Action triggers
- Modal openers
- Form submissions
        `}}}},c={render:()=>e.jsx("div",{className:"p-4",children:e.jsxs("div",{className:"flex flex-col gap-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Default"}),e.jsxs(t,{className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"blue",children:e.jsx(s,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Default State"}),e.jsx(t.Description,{children:"Ready for interaction"})]}),e.jsx(t.Arrow,{})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Hover (hover to see)"}),e.jsxs(t,{className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"green",children:e.jsx(p,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Hover State"}),e.jsx(t.Description,{children:"Background changes on hover"})]}),e.jsx(t.Arrow,{})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Disabled"}),e.jsxs(t,{disabled:!0,className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"purple",children:e.jsx(m,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Disabled State"}),e.jsx(t.Description,{children:"Non-interactive, reduced opacity"})]}),e.jsx(t.Arrow,{})]})]})]})}),parameters:{docs:{description:{story:`
## Overview

**States** demonstrates the different interactive states of List components.

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Background color change
- Indicates interactivity

### 3. Disabled
- Non-interactive state
- Reduced opacity (50%)
- No pointer events
- Clear "unavailable" indication

## Consistency

All states maintain **consistent visual behavior** while providing clear feedback to users about the component's current state.
        `}}}},l={render:()=>e.jsx("div",{className:"p-4",children:e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Basic Structure"}),e.jsxs(t,{className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"blue",children:e.jsx(s,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"Compound Pattern"}),e.jsx(t.Description,{children:"Flexible component composition"})]}),e.jsx(t.Arrow,{})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Without Arrow"}),e.jsxs(t,{className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"green",children:e.jsx(p,{})}),e.jsxs(t.Content,{children:[e.jsx(t.Title,{children:"No Arrow"}),e.jsx(t.Description,{children:"Arrow is optional"})]})]})]}),e.jsxs("div",{children:[e.jsx("h3",{className:"mb-2 text-sm font-semibold",children:"Title Only"}),e.jsxs(t,{className:"w-[70vw]",children:[e.jsx(t.Icon,{color:"purple",children:e.jsx(m,{})}),e.jsx(t.Content,{children:e.jsx(t.Title,{children:"Title Only"})}),e.jsx(t.Arrow,{})]})]})]})}),parameters:{docs:{description:{story:`
## Overview

**Compound Pattern** demonstrates the flexibility of the List compound component pattern.

## Flexibility

The compound pattern allows you to:
- **Include or omit** any sub-component
- **Customize** individual parts
- **Compose** different layouts
- **Maintain** consistent styling

## Examples Shown

1. **Basic Structure**: All components included
2. **Without Arrow**: Arrow is optional
3. **Title Only**: Description is optional

## Best Practices

- Use consistent patterns across your app
- Only include necessary components
- Maintain visual hierarchy
- Keep descriptions concise when used
        `}}}},d={render:()=>{const i={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"list-sdui",type:"List",state:{disabled:!1},attributes:{className:"w-[70vw]"},children:[{id:"list-sdui-icon",type:"Div",attributes:{className:"flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500"},children:[{id:"list-sdui-icon-svg",type:"Span",state:{text:"📖"},attributes:{className:"text-white"}}]},{id:"list-sdui-content",type:"Div",attributes:{className:"flex flex-1 flex-col gap-1"},children:[{id:"list-sdui-title",type:"Span",state:{text:"SDUI List Example"},attributes:{className:"text-base font-semibold text-[var(--color-text-default)]"}},{id:"list-sdui-description",type:"Span",state:{text:"This list item is rendered via SDUI Layout Document."},attributes:{className:"text-sm text-[var(--color-text-subtle)]"}}]}]}]}};return e.jsx(u,{document:i,components:v})},parameters:{docs:{description:{story:`
## Overview

**SDUI Integration** demonstrates how List component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: List structure is defined in JSON
2. **Component Factory**: sduiComponents provides component mapping
3. **Renderer**: SduiLayoutRenderer renders the document
4. **State Management**: List state is managed via SDUI subscription

## Benefits

- **Server-driven**: Content structure from server
- **Type-safe**: Zod schema validation
- **Dynamic**: State updates without page reload
- **Flexible**: Easy to modify structure

## Use Cases

- Dynamic navigation lists
- User-customizable menus
- A/B testing layouts
- Content management systems
        `}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <List onClick={() => console.log('Clicked')} className="w-[70vw]" nodeId="storybook-list-default" eventId="storybook-list-default-click">
        <List.Icon color="blue">
          <BookIcon />
        </List.Icon>
        <List.Content>
          <List.Title>Read an Article</List.Title>
          <List.Description>Read today&apos;s featured article and save new words</List.Description>
        </List.Content>
        <List.Arrow />
      </List>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

The **default list configuration** demonstrates the basic compound component pattern.

## Structure

- **List.Icon**: Blue circular background with book icon (uses shared Icon component)
- **List.Content**: Contains title and description
- **List.Title**: Bold title text
- **List.Description**: Lighter description text
- **List.Arrow**: Right-pointing arrow indicator

## Usage

This is the recommended pattern for creating interactive list items with icons, text, and navigation indicators.
The nodeId and eventId props map to data-node-id and data-event-id attributes for SDUI metadata.
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const items = [{
      id: 1,
      iconColor: 'blue' as const,
      title: '1. Read an Article',
      description: 'Read today&apos;s featured article and save new words',
      icon: <BookIcon />
    }, {
      id: 2,
      iconColor: 'green' as const,
      title: '2. Review Vocabulary',
      description: 'Check and manage the words you saved',
      icon: <BooksIcon />
    }, {
      id: 3,
      iconColor: 'purple' as const,
      title: '3. Take a Quiz',
      description: 'Use a quiz to confirm learning progress',
      icon: <TargetIcon />
    }, {
      id: 4,
      iconColor: 'red' as const,
      title: '4. Review Mistakes',
      description: 'Retry the questions you missed',
      icon: <XIcon />
    }];
    return <div className="p-4">
        <div className="flex flex-col gap-3">
          {items.map(item => <List key={item.id} onClick={() => console.log(\`Clicked: \${item.title}\`)} className="w-[70vw]">
              <List.Icon color={item.iconColor}>{item.icon}</List.Icon>
              <List.Content>
                <List.Title>{item.title}</List.Title>
                <List.Description>{item.description}</List.Description>
              </List.Content>
              <List.Arrow />
            </List>)}
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**With Multiple Items** demonstrates multiple list items in a vertical layout.

## Figma Design Recreation

This story demonstrates the "Learning Guide" section from the Figma design:

1. **Read an Article** - Blue icon
2. **Review Vocabulary** - Green icon
3. **Take a Quiz** - Purple icon
4. **Review Mistakes** - Red icon

## Icon Colors

- **Blue**: Primary actions
- **Green**: Success/positive actions
- **Purple**: Special features
- **Red**: Important/critical actions

## Best Practices

- Use consistent icon styles
- Maintain color meaning
- Keep descriptions concise
- Ensure proper spacing
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <List onClick={e => {
      e.preventDefault();
      alert('List item clicked!');
    }} className="w-[70vw]">
        <List.Icon color="blue">
          <BookIcon />
        </List.Icon>
        <List.Content>
          <List.Title>Interactive List Item</List.Title>
          <List.Description>Click me to see the interaction</List.Description>
        </List.Content>
        <List.Arrow />
      </List>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Interactive** demonstrates click event handling in List components.

## Behavior

- **Click handler**: onClick prop receives click events
- **Event object**: Standard React MouseEvent
- **Prevent default**: Can prevent default behavior if needed

## Best Practices

- Provide clear feedback on interaction
- Handle loading states
- Consider navigation vs. action distinction
- Use href for navigation, onClick for actions

## When to Use

- Navigation links
- Action triggers
- Modal openers
- Form submissions
        \`
      }
    }
  }
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <div className="flex flex-col gap-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Default</h3>
          <List className="w-[70vw]">
            <List.Icon color="blue">
              <BookIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Default State</List.Title>
              <List.Description>Ready for interaction</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Hover (hover to see)</h3>
          <List className="w-[70vw]">
            <List.Icon color="green">
              <BooksIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Hover State</List.Title>
              <List.Description>Background changes on hover</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Disabled</h3>
          <List disabled className="w-[70vw]">
            <List.Icon color="purple">
              <TargetIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Disabled State</List.Title>
              <List.Description>Non-interactive, reduced opacity</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**States** demonstrates the different interactive states of List components.

## Interactive States

### 1. Default
- Initial state
- Ready for interaction
- Standard appearance

### 2. Hover
- Mouse over state
- Background color change
- Indicates interactivity

### 3. Disabled
- Non-interactive state
- Reduced opacity (50%)
- No pointer events
- Clear "unavailable" indication

## Consistency

All states maintain **consistent visual behavior** while providing clear feedback to users about the component's current state.
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-semibold">Basic Structure</h3>
          <List className="w-[70vw]">
            <List.Icon color="blue">
              <BookIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Compound Pattern</List.Title>
              <List.Description>Flexible component composition</List.Description>
            </List.Content>
            <List.Arrow />
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Without Arrow</h3>
          <List className="w-[70vw]">
            <List.Icon color="green">
              <BooksIcon />
            </List.Icon>
            <List.Content>
              <List.Title>No Arrow</List.Title>
              <List.Description>Arrow is optional</List.Description>
            </List.Content>
          </List>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-semibold">Title Only</h3>
          <List className="w-[70vw]">
            <List.Icon color="purple">
              <TargetIcon />
            </List.Icon>
            <List.Content>
              <List.Title>Title Only</List.Title>
            </List.Content>
            <List.Arrow />
          </List>
        </div>
      </div>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**Compound Pattern** demonstrates the flexibility of the List compound component pattern.

## Flexibility

The compound pattern allows you to:
- **Include or omit** any sub-component
- **Customize** individual parts
- **Compose** different layouts
- **Maintain** consistent styling

## Examples Shown

1. **Basic Structure**: All components included
2. **Without Arrow**: Arrow is optional
3. **Title Only**: Description is optional

## Best Practices

- Use consistent patterns across your app
- Only include necessary components
- Maintain visual hierarchy
- Keep descriptions concise when used
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
          className: 'p-4'
        },
        children: [{
          id: 'list-sdui',
          type: 'List',
          state: {
            disabled: false
          },
          attributes: {
            className: 'w-[70vw]'
          },
          children: [{
            id: 'list-sdui-icon',
            type: 'Div',
            attributes: {
              className: 'flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500'
            },
            children: [{
              id: 'list-sdui-icon-svg',
              type: 'Span',
              state: {
                text: '📖'
              },
              attributes: {
                className: 'text-white'
              }
            }]
          }, {
            id: 'list-sdui-content',
            type: 'Div',
            attributes: {
              className: 'flex flex-1 flex-col gap-1'
            },
            children: [{
              id: 'list-sdui-title',
              type: 'Span',
              state: {
                text: 'SDUI List Example'
              },
              attributes: {
                className: 'text-base font-semibold text-[var(--color-text-default)]'
              }
            }, {
              id: 'list-sdui-description',
              type: 'Span',
              state: {
                text: 'This list item is rendered via SDUI Layout Document.'
              },
              attributes: {
                className: 'text-sm text-[var(--color-text-subtle)]'
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
## Overview

**SDUI Integration** demonstrates how List component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: List structure is defined in JSON
2. **Component Factory**: sduiComponents provides component mapping
3. **Renderer**: SduiLayoutRenderer renders the document
4. **State Management**: List state is managed via SDUI subscription

## Benefits

- **Server-driven**: Content structure from server
- **Type-safe**: Zod schema validation
- **Dynamic**: State updates without page reload
- **Flexible**: Easy to modify structure

## Use Cases

- Dynamic navigation lists
- User-customizable menus
- A/B testing layouts
- Content management systems
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};const b=["Default","WithMultipleItems","Interactive","States","CompoundPattern","SduiIntegration"];export{l as CompoundPattern,o as Default,a as Interactive,d as SduiIntegration,c as States,r as WithMultipleItems,b as __namedExportsOrder,y as default};
