import{j as s}from"./jsx-runtime-Cn5vU2bi.js";import{C as d,S as i,s as o}from"./sduiComponents-C3NvGM3k.js";import"./iframe-C9NbDJzv.js";import"./preload-helper-ggYluGXI.js";import"./index-DqsrmGy_.js";import"./index-CUFHkYWu.js";const g={title:"Shared/UI/Card",component:d,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Card** component is a container component that provides a visual card with rounded corners, shadow, and background color. It's used to group related content together in a visually distinct container.

## Features

### Visual Design
- **Rounded corners**: Soft, modern appearance
- **Shadow**: Subtle elevation effect
- **Background**: Neutral subtle background color
- **Padding**: Generous spacing for content

### Optional Title
- **Header text**: Optional title prop for card header
- **Bold styling**: Title uses bold font weight
- **Proper spacing**: Title has bottom margin

## Integration

- ✅ **SDUI template system** integration
- ✅ **Accessibility features** built-in
- ✅ **Flexible content**: Accepts any React children

## Common Use Cases

- Content grouping
- Section containers
- Feature showcases
- Information panels
- List containers
        `}}}},t={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",attributes:{},children:[{id:"card-content",type:"Span",state:{text:"Card content goes here"},attributes:{className:"text-[var(--color-text-default)]"}}]}]}};return s.jsx(i,{document:e,components:o})},parameters:{docs:{description:{story:`
## Overview

The **default card configuration** represents the most commonly used variant in the design system.

## Configuration

- **Background**: Neutral subtle
- **Rounded corners**: Large radius
- **Shadow**: Subtle elevation
- **Padding**: Generous spacing

## Usage

This is the recommended starting point for most card implementations. Use this variant for grouping related content.
        `}}}},n={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",state:{title:"Learning Guide"},attributes:{},children:[{id:"card-content",type:"Span",state:{text:"Card content with title header"},attributes:{className:"text-[var(--color-text-default)]"}}]}]}};return s.jsx(i,{document:e,components:o})},parameters:{docs:{description:{story:`
## Overview

**Card with title** includes an optional header text that appears at the top of the card.

## Characteristics

- **Title**: Bold, dark text
- **Spacing**: Proper margin between title and content
- **Hierarchy**: Clear visual hierarchy

## Best Practices

- Use descriptive titles
- Keep titles concise
- Reserve for important sections

## When to Use

- Section headers
- Feature groups
- Content categories
        `}}}},r={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",state:{title:"Learning Guide"},attributes:{},children:[{id:"list-container",type:"Div",attributes:{className:"flex flex-col gap-3"},children:[{id:"list-1",type:"List",state:{disabled:!1},attributes:{},children:[{id:"list-1-icon",type:"ListIcon",state:{iconColor:"blue"},attributes:{},children:[{id:"list-1-icon-svg",type:"Span",state:{text:"📖"}}]},{id:"list-1-content",type:"Div",attributes:{className:"flex flex-1 flex-col gap-1"},children:[{id:"list-1-title",type:"Span",state:{text:"1. Read an Article"},attributes:{className:"text-base font-semibold text-[var(--color-text-default)]"}},{id:"list-1-description",type:"Span",state:{text:"Read today's featured article and save new words"},attributes:{className:"text-sm text-[var(--color-text-subtle)]"}}]}]}]}]}]}};return s.jsx(i,{document:e,components:o})},parameters:{docs:{description:{story:`
## Overview

**Card with list items** demonstrates how Card can be used as a container for List components, creating a structured navigation or action list.

## Characteristics

- **Card container**: Provides visual grouping
- **List items**: Interactive navigation elements
- **Proper spacing**: Items are properly spaced

## Best Practices

- Use for grouped actions
- Maintain consistent spacing
- Consider card title for context

## When to Use

- Navigation sections
- Action lists
- Feature groups
- Learning guides
        `}}}},a={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-sdui",type:"Card",state:{title:"SDUI Card Example"},attributes:{className:"w-full max-w-md"},children:[{id:"card-sdui-content",type:"Div",attributes:{className:"space-y-2"},children:[{id:"card-sdui-text-1",type:"Text",state:{text:"This card is rendered via SDUI Layout Document."}},{id:"card-sdui-text-2",type:"Text",state:{text:"The structure is defined in JSON format."}}]}]}]}};return s.jsx(i,{document:e,components:o})},parameters:{docs:{description:{story:`
## Overview

**SDUI Integration** demonstrates how Card component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: Card structure is defined in JSON
2. **Component Factory**: sduiComponents provides component mapping
3. **Renderer**: SduiLayoutRenderer renders the document
4. **State Management**: Card state is managed via SDUI subscription

## Benefits

- **Server-driven**: Content structure from server
- **Type-safe**: Zod schema validation
- **Dynamic**: State updates without page reload
- **Flexible**: Easy to modify structure

## Use Cases

- Dynamic content sections
- User-customizable layouts
- A/B testing layouts
- Content management systems
        `}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
          id: 'card-1',
          type: 'Card',
          attributes: {},
          children: [{
            id: 'card-content',
            type: 'Span',
            state: {
              text: 'Card content goes here'
            },
            attributes: {
              className: 'text-[var(--color-text-default)]'
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
## Overview

The **default card configuration** represents the most commonly used variant in the design system.

## Configuration

- **Background**: Neutral subtle
- **Rounded corners**: Large radius
- **Shadow**: Subtle elevation
- **Padding**: Generous spacing

## Usage

This is the recommended starting point for most card implementations. Use this variant for grouping related content.
        \`
      }
    }
  }
}`,...t.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
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
          id: 'card-1',
          type: 'Card',
          state: {
            title: 'Learning Guide'
          },
          attributes: {},
          children: [{
            id: 'card-content',
            type: 'Span',
            state: {
              text: 'Card content with title header'
            },
            attributes: {
              className: 'text-[var(--color-text-default)]'
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
## Overview

**Card with title** includes an optional header text that appears at the top of the card.

## Characteristics

- **Title**: Bold, dark text
- **Spacing**: Proper margin between title and content
- **Hierarchy**: Clear visual hierarchy

## Best Practices

- Use descriptive titles
- Keep titles concise
- Reserve for important sections

## When to Use

- Section headers
- Feature groups
- Content categories
        \`
      }
    }
  }
}`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
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
          id: 'card-1',
          type: 'Card',
          state: {
            title: 'Learning Guide'
          },
          attributes: {},
          children: [{
            id: 'list-container',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-3'
            },
            children: [{
              id: 'list-1',
              type: 'List',
              state: {
                disabled: false
              },
              attributes: {},
              children: [{
                id: 'list-1-icon',
                type: 'ListIcon',
                state: {
                  iconColor: 'blue'
                },
                attributes: {},
                children: [{
                  id: 'list-1-icon-svg',
                  type: 'Span',
                  state: {
                    text: '📖'
                  }
                }]
              }, {
                id: 'list-1-content',
                type: 'Div',
                attributes: {
                  className: 'flex flex-1 flex-col gap-1'
                },
                children: [{
                  id: 'list-1-title',
                  type: 'Span',
                  state: {
                    text: '1. Read an Article'
                  },
                  attributes: {
                    className: 'text-base font-semibold text-[var(--color-text-default)]'
                  }
                }, {
                  id: 'list-1-description',
                  type: 'Span',
                  state: {
                    text: "Read today's featured article and save new words"
                  },
                  attributes: {
                    className: 'text-sm text-[var(--color-text-subtle)]'
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
## Overview

**Card with list items** demonstrates how Card can be used as a container for List components, creating a structured navigation or action list.

## Characteristics

- **Card container**: Provides visual grouping
- **List items**: Interactive navigation elements
- **Proper spacing**: Items are properly spaced

## Best Practices

- Use for grouped actions
- Maintain consistent spacing
- Consider card title for context

## When to Use

- Navigation sections
- Action lists
- Feature groups
- Learning guides
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
          id: 'card-sdui',
          type: 'Card',
          state: {
            title: 'SDUI Card Example'
          },
          attributes: {
            className: 'w-full max-w-md'
          },
          children: [{
            id: 'card-sdui-content',
            type: 'Div',
            attributes: {
              className: 'space-y-2'
            },
            children: [{
              id: 'card-sdui-text-1',
              type: 'Text',
              state: {
                text: 'This card is rendered via SDUI Layout Document.'
              }
            }, {
              id: 'card-sdui-text-2',
              type: 'Text',
              state: {
                text: 'The structure is defined in JSON format.'
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

**SDUI Integration** demonstrates how Card component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: Card structure is defined in JSON
2. **Component Factory**: sduiComponents provides component mapping
3. **Renderer**: SduiLayoutRenderer renders the document
4. **State Management**: Card state is managed via SDUI subscription

## Benefits

- **Server-driven**: Content structure from server
- **Type-safe**: Zod schema validation
- **Dynamic**: State updates without page reload
- **Flexible**: Easy to modify structure

## Use Cases

- Dynamic content sections
- User-customizable layouts
- A/B testing layouts
- Content management systems
        \`
      }
    }
  }
}`,...a.parameters?.docs?.source}}};const y=["Default","WithTitle","WithListItems","SduiIntegration"];export{t as Default,a as SduiIntegration,r as WithListItems,n as WithTitle,y as __namedExportsOrder,g as default};
