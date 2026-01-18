import{j as t}from"./jsx-runtime-ByZOKGhl.js";import{R as f}from"./iframe-C6gHqnx-.js";import{c as x,u as C,b,S,T as w,D,a as c}from"./Text-Cc0p3dYf.js";import{c as N}from"./index-BE1xsiQq.js";import{o as I,s as T}from"./types-lBip4we0.js";import"./preload-helper-ggYluGXI.js";const L=N("rounded-xl bg-[var(--color-background-neutral-subtle)] shadow-sm p-6",{variants:{},defaultVariants:{}}),l=f.forwardRef(({children:e,className:n,nodeId:r,eventId:p,title:a,...m},g)=>{const y=L(),v=x(y,n);return t.jsxs("div",{ref:g,className:v,"data-node-id":r,"data-event-id":p,...m,children:[a&&t.jsx("h3",{className:"mb-4 text-lg font-bold text-[var(--color-text-default)]",children:a}),e]})});l.displayName="Card";l.__docgenInfo={description:`Card component

@description
Card component for creating container cards with optional title.
Supports design system specifications with rounded corners, shadow, and background color.
Integrates with SDUI template system.

@example
\`\`\`tsx
<Card title="학습 가이드">
  <div>Card content</div>
</Card>
\`\`\`

@example
\`\`\`tsx
// SDUI integration
<Card nodeId="card-1" title="Section Title">
  <div>Content</div>
</Card>
\`\`\``,methods:[],displayName:"Card",props:{children:{required:!1,tsType:{name:"ReactReactNode",raw:"React.ReactNode"},description:"Card content"},className:{required:!1,tsType:{name:"string"},description:"Additional CSS classes"},nodeId:{required:!1,tsType:{name:"string"},description:"SDUI node ID for integration"},eventId:{required:!1,tsType:{name:"string"},description:"Event ID for event emission"},title:{required:!1,tsType:{name:"string"},description:"Optional header text"}}};const U=I({title:T().optional()}),h=({id:e,parentPath:n=[]})=>{const{childrenIds:r,attributes:p,state:a}=C({nodeId:e,schema:U}),{renderChildren:m}=b({nodeId:e,parentPath:n}),g=r.length>0?m(r):void 0;return t.jsx(l,{nodeId:e,...p,...a,children:g})};h.displayName="CardContainer";h.__docgenInfo={description:"",methods:[],displayName:"CardContainer",props:{id:{required:!0,tsType:{name:"string"},description:""},parentPath:{required:!1,tsType:{name:"Array",elements:[{name:"string"}],raw:"string[]"},description:"",defaultValue:{value:"[]",computed:!1}}}};function u(){return{Card:(e,n)=>t.jsx(h,{id:e,parentPath:n}),Div:(e,n)=>t.jsx(D,{id:e,parentPath:n}),Text:e=>t.jsx(w,{id:e}),Span:e=>t.jsx(S,{id:e})}}const F={title:"Shared/UI/Card",component:l,tags:["autodocs"],parameters:{docs:{description:{component:`
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
        `}}}},s={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",attributes:{},children:[{id:"card-content",type:"Span",state:{text:"Card content goes here"},attributes:{className:"text-[var(--color-text-default)]"}}]}]}};return t.jsx(c,{document:e,components:u()})},parameters:{docs:{description:{story:`
## Overview

The **default card configuration** represents the most commonly used variant in the design system.

## Configuration

- **Background**: Neutral subtle
- **Rounded corners**: Large radius
- **Shadow**: Subtle elevation
- **Padding**: Generous spacing

## Usage

This is the recommended starting point for most card implementations. Use this variant for grouping related content.
        `}}}},i={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",state:{title:"Learning Guide"},attributes:{},children:[{id:"card-content",type:"Span",state:{text:"Card content with title header"},attributes:{className:"text-[var(--color-text-default)]"}}]}]}};return t.jsx(c,{document:e,components:u()})},parameters:{docs:{description:{story:`
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
        `}}}},o={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-1",type:"Card",state:{title:"Learning Guide"},attributes:{},children:[{id:"list-container",type:"Div",attributes:{className:"flex flex-col gap-3"},children:[{id:"list-1",type:"List",state:{disabled:!1},attributes:{},children:[{id:"list-1-icon",type:"ListIcon",state:{iconColor:"blue"},attributes:{},children:[{id:"list-1-icon-svg",type:"Span",state:{text:"📖"}}]},{id:"list-1-content",type:"Div",attributes:{className:"flex flex-1 flex-col gap-1"},children:[{id:"list-1-title",type:"Span",state:{text:"1. Read an Article"},attributes:{className:"text-base font-semibold text-[var(--color-text-default)]"}},{id:"list-1-description",type:"Span",state:{text:"Read today's featured article and save new words"},attributes:{className:"text-sm text-[var(--color-text-subtle)]"}}]}]}]}]}]}};return t.jsx(c,{document:e,components:u()})},parameters:{docs:{description:{story:`
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
        `}}}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-4"},children:[{id:"card-sdui",type:"Card",state:{title:"SDUI Card Example"},attributes:{className:"w-full max-w-md"},children:[{id:"card-sdui-content",type:"Div",attributes:{className:"space-y-2"},children:[{id:"card-sdui-text-1",type:"Text",state:{text:"This card is rendered via SDUI Layout Document."}},{id:"card-sdui-text-2",type:"Text",state:{text:"The structure is defined in JSON format."}}]}]}]}};return t.jsx(c,{document:e,components:u()})},parameters:{docs:{description:{story:`
## Overview

**SDUI Integration** demonstrates how Card component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: Card structure is defined in JSON
2. **Component Factory**: getCardComponents() provides component mapping
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
        `}}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
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
    return <SduiLayoutRenderer document={document} components={getCardComponents()} />;
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
    return <SduiLayoutRenderer document={document} components={getCardComponents()} />;
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
}`,...i.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
    return <SduiLayoutRenderer document={document} components={getCardComponents()} />;
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
}`,...o.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
    return <SduiLayoutRenderer document={document} components={getCardComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

**SDUI Integration** demonstrates how Card component works with the Server-Driven UI template system.

## How It Works

1. **Layout Document**: Card structure is defined in JSON
2. **Component Factory**: getCardComponents() provides component mapping
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
}`,...d.parameters?.docs?.source}}};const A=["Default","WithTitle","WithListItems","SduiIntegration"];export{s as Default,d as SduiIntegration,o as WithListItems,i as WithTitle,A as __namedExportsOrder,F as default};
