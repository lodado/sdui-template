import{j as e}from"./jsx-runtime-DxbnSXFt.js";/* empty css               */import{S as c,T as p,D as d,a}from"./Text-keOb2BbV.js";import"./iframe-OK5fRIFX.js";import"./preload-helper-ggYluGXI.js";function i(){return{Div:(t,u)=>e.jsx(d,{id:t,parentPath:u}),Text:t=>e.jsx(p,{id:t}),Span:t=>e.jsx(c,{id:t})}}const v={title:"Shared/UI/Div",component:d,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Div** component is a container component with built-in **Error Boundary** and **Suspense** support, providing robust error handling and loading states out of the box.

## Key Features

### Error Boundary
- ✅ Automatically catches errors from child components
- ✅ Prevents entire app crashes
- ✅ Customizable error fallback UI

### Suspense Support
- ✅ Handles asynchronous component loading
- ✅ Shows loading states during async operations
- ✅ Customizable loading fallback UI

## Integration

When used in the **SDUI template system**, the Div component:
- Integrates seamlessly with SduiLayoutRenderer
- Provides error handling without additional configuration
- Supports async loading patterns

## Best Use Cases

- Wrapping dynamic content
- Components that may fail
- Async component loading
- Error-prone sections
        `}}}},n={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"기본 Div 컴포넌트"},attributes:{className:"text-lg font-bold mb-4"}},{id:"description",type:"Span",state:{text:"Div 컴포넌트는 Error Boundary와 Suspense를 내장하고 있습니다."},attributes:{className:"text-gray-600 mb-4"}},{id:"div-container",type:"Div",attributes:{className:"p-4 border border-gray-300 rounded bg-gray-50"},children:[{id:"div-content",type:"Span",state:{text:"이 div는 Error Boundary와 Suspense로 감싸져 있습니다."}}]}]}};return e.jsx(a,{document:t,components:i()})},parameters:{docs:{description:{story:`
## Overview

Basic usage of the **Div component** demonstrating its core functionality.

## Important Note

⚠️ In actual usage, the Div component should be used with **SduiLayoutRenderer** in the SDUI template system.

## Automatic Features

The component automatically:
- ✅ Wraps children with Error Boundary
- ✅ Wraps children with Suspense
- ✅ Provides error handling
- ✅ Supports async loading

## Configuration

No additional configuration needed - error handling and async loading support are built-in!
        `}}}},r={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Nested Divs 예시"},attributes:{className:"text-lg font-bold mb-4"}},{id:"outer-div",type:"Div",attributes:{className:"p-4 border-2 border-blue-300 rounded bg-blue-50"},children:[{id:"outer-text",type:"Span",state:{text:"Outer Div"},attributes:{className:"font-semibold mb-2"}},{id:"inner-div",type:"Div",attributes:{className:"p-3 border border-blue-500 rounded bg-blue-100"},children:[{id:"inner-text",type:"Span",state:{text:"Inner Div"}}]}]}]}};return e.jsx(a,{document:t,components:i()})},parameters:{docs:{description:{story:`
## Overview

Demonstrates how **Div components** can be nested to create complex layouts.

## Structure

- Outer Div with blue border
- Inner Div nested inside with darker blue border

## Use Cases

- Creating layout sections
- Grouping related content
- Building complex UI structures
        `}}}},s={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Custom Styling 예시"},attributes:{className:"text-lg font-bold mb-4"}},{id:"styled-div",type:"Div",attributes:{className:"p-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg"},children:[{id:"styled-text",type:"Span",state:{text:"This Div has custom styling with gradient background and shadow"},attributes:{className:"text-white font-semibold"}}]}]}};return e.jsx(a,{document:t,components:i()})},parameters:{docs:{description:{story:`
## Overview

Shows how to apply **custom styling** to Div components using className attributes.

## Styling Options

- Tailwind CSS classes
- Custom CSS classes
- Inline styles (via attributes)

## Best Practices

- Use Tailwind utilities for consistency
- Keep styling in attributes for SDUI compatibility
- Maintain design system tokens
        `}}}},o={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"p-6"},children:[{id:"title",type:"Span",state:{text:"Container 예시"},attributes:{className:"text-lg font-bold mb-4"}},{id:"container-div",type:"Div",attributes:{className:"flex flex-col gap-4 p-4 border border-gray-300 rounded"},children:[{id:"item-1",type:"Span",state:{text:"Item 1"},attributes:{className:"p-2 bg-gray-100 rounded"}},{id:"item-2",type:"Span",state:{text:"Item 2"},attributes:{className:"p-2 bg-gray-100 rounded"}},{id:"item-3",type:"Span",state:{text:"Item 3"},attributes:{className:"p-2 bg-gray-100 rounded"}}]}]}};return e.jsx(a,{document:t,components:i()})},parameters:{docs:{description:{story:`
## Overview

Demonstrates using **Div as a container** to group multiple child elements.

## Container Features

- Flexbox layout support
- Gap spacing
- Border and padding
- Grouped content

## Use Cases

- Card layouts
- List containers
- Form sections
- Content grouping
        `}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: '기본 Div 컴포넌트'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'description',
          type: 'Span',
          state: {
            text: 'Div 컴포넌트는 Error Boundary와 Suspense를 내장하고 있습니다.'
          },
          attributes: {
            className: 'text-gray-600 mb-4'
          }
        }, {
          id: 'div-container',
          type: 'Div',
          attributes: {
            className: 'p-4 border border-gray-300 rounded bg-gray-50'
          },
          children: [{
            id: 'div-content',
            type: 'Span',
            state: {
              text: '이 div는 Error Boundary와 Suspense로 감싸져 있습니다.'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getDivComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Basic usage of the **Div component** demonstrating its core functionality.

## Important Note

⚠️ In actual usage, the Div component should be used with **SduiLayoutRenderer** in the SDUI template system.

## Automatic Features

The component automatically:
- ✅ Wraps children with Error Boundary
- ✅ Wraps children with Suspense
- ✅ Provides error handling
- ✅ Supports async loading

## Configuration

No additional configuration needed - error handling and async loading support are built-in!
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
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Nested Divs 예시'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'outer-div',
          type: 'Div',
          attributes: {
            className: 'p-4 border-2 border-blue-300 rounded bg-blue-50'
          },
          children: [{
            id: 'outer-text',
            type: 'Span',
            state: {
              text: 'Outer Div'
            },
            attributes: {
              className: 'font-semibold mb-2'
            }
          }, {
            id: 'inner-div',
            type: 'Div',
            attributes: {
              className: 'p-3 border border-blue-500 rounded bg-blue-100'
            },
            children: [{
              id: 'inner-text',
              type: 'Span',
              state: {
                text: 'Inner Div'
              }
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getDivComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Demonstrates how **Div components** can be nested to create complex layouts.

## Structure

- Outer Div with blue border
- Inner Div nested inside with darker blue border

## Use Cases

- Creating layout sections
- Grouping related content
- Building complex UI structures
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Custom Styling 예시'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'styled-div',
          type: 'Div',
          attributes: {
            className: 'p-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg shadow-lg'
          },
          children: [{
            id: 'styled-text',
            type: 'Span',
            state: {
              text: 'This Div has custom styling with gradient background and shadow'
            },
            attributes: {
              className: 'text-white font-semibold'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getDivComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Shows how to apply **custom styling** to Div components using className attributes.

## Styling Options

- Tailwind CSS classes
- Custom CSS classes
- Inline styles (via attributes)

## Best Practices

- Use Tailwind utilities for consistency
- Keep styling in attributes for SDUI compatibility
- Maintain design system tokens
        \`
      }
    }
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'p-6'
        },
        children: [{
          id: 'title',
          type: 'Span',
          state: {
            text: 'Container 예시'
          },
          attributes: {
            className: 'text-lg font-bold mb-4'
          }
        }, {
          id: 'container-div',
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-4 p-4 border border-gray-300 rounded'
          },
          children: [{
            id: 'item-1',
            type: 'Span',
            state: {
              text: 'Item 1'
            },
            attributes: {
              className: 'p-2 bg-gray-100 rounded'
            }
          }, {
            id: 'item-2',
            type: 'Span',
            state: {
              text: 'Item 2'
            },
            attributes: {
              className: 'p-2 bg-gray-100 rounded'
            }
          }, {
            id: 'item-3',
            type: 'Span',
            state: {
              text: 'Item 3'
            },
            attributes: {
              className: 'p-2 bg-gray-100 rounded'
            }
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getDivComponents()} />;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Overview

Demonstrates using **Div as a container** to group multiple child elements.

## Container Features

- Flexbox layout support
- Gap spacing
- Border and padding
- Grouped content

## Use Cases

- Card layouts
- List containers
- Form sections
- Content grouping
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source}}};const h=["Default","NestedDivs","WithCustomStyling","AsContainer"];export{o as AsContainer,n as Default,r as NestedDivs,s as WithCustomStyling,h as __namedExportsOrder,v as default};
