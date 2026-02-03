import{j as n}from"./jsx-runtime-Bj4z8TBp.js";/* empty css               */import{I as v,S as s,s as z}from"./sduiComponents-BsgyM-cI.js";import"./iframe-BUwdTLZu.js";import"./preload-helper-ggYluGXI.js";import"./index-DbP77RFo.js";import"./index-o6-pYDoB.js";const _={title:"Shared/UI/Icon",component:v,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **Icon** component serves as a placeholder for icons that may not be loaded yet or are missing. It accepts SVG children and automatically applies sizing.

## Key Features

- ✅ **Automatic sizing** for SVG children
- ✅ **Placeholder support** for missing icons
- ✅ **Accessibility** built-in
- ✅ **Flexible sizing** options

## Size Options

### Predefined Sizes (Tailwind Spacing Scale)

Based on 4px increments for optimal performance using Tailwind CSS classes:

| Size | Tailwind Class | Calculation |
|------|----------------|-------------|
| 12px | w-3 h-3 | 3 × 4px |
| 16px | w-4 h-4 | 4 × 4px |
| 20px | w-5 h-5 | 5 × 4px |
| 24px | w-6 h-6 | 6 × 4px |
| 32px | w-8 h-8 | 8 × 4px |
| 40px | w-10 h-10 | 10 × 4px |
| 48px | w-12 h-12 | 12 × 4px |
| 64px | w-16 h-16 | 16 × 4px |

### Custom Sizes

Any CSS size value can be used:
- \`"18px"\`
- \`"1.5rem"\`
- \`"28px"\`
- \`"2em"\`

Custom sizes are applied via inline styles.

## Performance

- **Predefined sizes**: Use Tailwind classes (optimal)
- **Custom sizes**: Use inline styles (flexible)
        `}}}},w=()=>n.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M12 2L2 7v10l10 5 10-5V7l-10-5z",fill:"currentColor",stroke:"currentColor",strokeWidth:"1",strokeLinecap:"round",strokeLinejoin:"round"})}),D=()=>n.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M5 12h14M12 5l7 7-7 7",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),I=()=>n.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:n.jsx("path",{d:"M18 6L6 18M6 6l12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),S=e=>()=>n.jsx(e,{}),i=()=>({...z,SVG_sample:S(w),SVG_arrow:S(D),SVG_close:S(I)}),o={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"24px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:{story:"The default icon configuration with a 24px size. This is the most commonly used icon size in the design system. The icon automatically applies the size to SVG children that don't have explicit width and height attributes."}}}},r={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"12px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"12px size icon (w-3 h-3 in Tailwind). This is the smallest predefined size, ideal for inline icons, badges, or compact UI elements. Uses Tailwind classes for optimal performance."}}},a={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"16px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"16px size icon (w-4 h-4 in Tailwind). Commonly used for small icons in buttons, form fields, or navigation items. Uses Tailwind classes for optimal performance."}}},c={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"20px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"20px size icon (w-5 h-5 in Tailwind). A medium-small size suitable for icons in cards, lists, or secondary actions. Uses Tailwind classes for optimal performance."}}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"24px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"24px size icon (w-6 h-6 in Tailwind). This is the default size and the most commonly used icon size. Perfect for primary actions, navigation bars, and general UI elements. Uses Tailwind classes for optimal performance."}}},l={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"32px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"32px size icon (w-8 h-8 in Tailwind). A larger size suitable for prominent icons, feature highlights, or empty states. Uses Tailwind classes for optimal performance."}}},p={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"40px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"40px size icon (w-10 h-10 in Tailwind). A large size ideal for hero sections, feature illustrations, or attention-grabbing UI elements. Uses Tailwind classes for optimal performance."}}},m={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"48px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"48px size icon (w-12 h-12 in Tailwind). An extra-large size perfect for empty states, illustrations, or prominent feature displays. Uses Tailwind classes for optimal performance."}}},u={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"64px"},children:[{id:"icon-svg",type:"SVG_sample"}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"64px size icon (w-16 h-16 in Tailwind). The largest predefined size, ideal for hero sections, large illustrations, or decorative elements. Uses Tailwind classes for optimal performance."}}},h={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center justify-center p-4"},children:[{id:"icon-1",type:"Icon",state:{size:"24px"},attributes:{"aria-label":"Icon placeholder"},children:[]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:`An icon placeholder without any children. This is useful when an icon hasn't loaded yet or is missing. The component automatically sets aria-hidden="true" when no children are provided, but you can override this with an aria-label for accessibility. The placeholder maintains the specified size to prevent layout shifts.`}}},x={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-10 p-20 bg-gray-100"},children:[{id:"icons-container",type:"Div",attributes:{className:"flex gap-10 justify-center items-center bg-white p-20 rounded-lg"},children:["12px","16px","20px","24px","32px","40px","48px","64px"].map((t,b)=>({id:`icon-size-${t}`,type:"Div",attributes:{className:"flex flex-col gap-4 items-center"},children:[{id:`icon-number-${t}`,type:"Div",attributes:{className:"w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold"},children:[{id:`icon-number-text-${t}`,type:"Span",state:{text:String(b+1).padStart(2,"0")}}]},{id:`icon-${t}`,type:"Icon",state:{size:t},children:[{id:`icon-svg-${t}`,type:"SVG_sample"}]}]}))},{id:"sizes-list",type:"Div",attributes:{className:"flex flex-col gap-2"},children:["12px","16px","20px","24px","32px","40px","48px","64px"].map((t,b)=>({id:`size-item-${t}`,type:"Div",attributes:{className:"flex gap-2 items-center"},children:[{id:`size-number-${t}`,type:"Div",attributes:{className:"w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold"},children:[{id:`size-number-text-${t}`,type:"Span",state:{text:String(b+1).padStart(2,"0")}}]},{id:`size-label-${t}`,type:"Span",state:{text:t},attributes:{className:"text-base font-bold"}}]}))}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"Displays all eight predefined icon sizes in a visual grid. This helps designers and developers compare sizes and choose the appropriate one for their use case. All sizes are based on the Tailwind spacing scale (4px increments) and use Tailwind CSS classes for optimal performance."}}},y={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"Different Icon Shapes"},attributes:{className:"text-lg font-bold"}},{id:"icons-container",type:"Div",attributes:{className:"flex gap-6 items-center flex-wrap"},children:[{id:"icon-sample",type:"Icon",state:{size:"24px"},children:[{id:"svg-sample",type:"SVG_sample"}]},{id:"icon-arrow",type:"Icon",state:{size:"24px"},children:[{id:"svg-arrow",type:"SVG_arrow"}]},{id:"icon-close",type:"Icon",state:{size:"24px"},children:[{id:"svg-close",type:"SVG_close"}]}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"Shows how the Icon component works with different icon shapes and styles. The component is flexible and can accommodate any SVG content, whether it's geometric shapes, arrows, close icons, or custom illustrations. All icons maintain consistent sizing regardless of their shape."}}},f={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"Accessibility Examples"},attributes:{className:"text-lg font-bold"}},{id:"examples-container",type:"Div",attributes:{className:"flex flex-col gap-4"},children:[{id:"example-1",type:"Div",attributes:{className:"flex gap-4 items-center"},children:[{id:"icon-accessible",type:"Icon",state:{size:"24px"},attributes:{"aria-label":"Close icon"},children:[{id:"svg-close-accessible",type:"SVG_close"}]},{id:"label-1",type:"Span",state:{text:"With aria-label (accessible)"}}]},{id:"example-2",type:"Div",attributes:{className:"flex gap-4 items-center"},children:[{id:"icon-hidden",type:"Icon",state:{size:"24px"},attributes:{"aria-hidden":!0},children:[{id:"svg-close-hidden",type:"SVG_close"}]},{id:"label-2",type:"Span",state:{text:'With aria-hidden="true" (hidden from screen readers)'}}]},{id:"example-3",type:"Div",attributes:{className:"flex gap-4 items-center"},children:[{id:"icon-placeholder",type:"Icon",state:{size:"24px"}},{id:"label-3",type:"Span",state:{text:'Placeholder (no children) - automatically aria-hidden="true"'}}]}]}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:'Demonstrates accessibility best practices for icons. Icons can be made accessible to screen readers using aria-label, hidden from screen readers using aria-hidden="true", or automatically hidden when used as decorative elements. Placeholder icons without children are automatically hidden from screen readers unless an aria-label is provided.'}}},g={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-8 p-6"},children:[{id:"title",type:"Span",state:{text:"Size Comparison (Tailwind Spacing Scale Reference)"},attributes:{className:"text-lg font-bold"}},{id:"icons-container",type:"Div",attributes:{className:"flex gap-6 items-end"},children:["12px","16px","20px","24px","32px","40px","48px","64px"].map(t=>({id:`icon-size-comp-${t}`,type:"Div",attributes:{className:"flex flex-col gap-2 items-center"},children:[{id:`icon-comp-${t}`,type:"Icon",attributes:{size:t},children:[{id:`svg-comp-${t}`,type:"SVG_sample"}]},{id:`size-label-comp-${t}`,type:"Span",state:{text:t},attributes:{className:"text-sm font-bold"}}]}))}]}};return n.jsx(s,{document:e,components:i()})},parameters:{docs:{description:"A side-by-side comparison of all predefined icon sizes. This visual comparison helps designers and developers understand the size relationships and choose the appropriate size for their design. All sizes are aligned at the bottom to show height differences clearly."}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '24px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: {
        story: "The default icon configuration with a 24px size. This is the most commonly used icon size in the design system. The icon automatically applies the size to SVG children that don't have explicit width and height attributes."
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '12px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '12px size icon (w-3 h-3 in Tailwind). This is the smallest predefined size, ideal for inline icons, badges, or compact UI elements. Uses Tailwind classes for optimal performance.'
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '16px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '16px size icon (w-4 h-4 in Tailwind). Commonly used for small icons in buttons, form fields, or navigation items. Uses Tailwind classes for optimal performance.'
    }
  }
}`,...a.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '20px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '20px size icon (w-5 h-5 in Tailwind). A medium-small size suitable for icons in cards, lists, or secondary actions. Uses Tailwind classes for optimal performance.'
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '24px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '24px size icon (w-6 h-6 in Tailwind). This is the default size and the most commonly used icon size. Perfect for primary actions, navigation bars, and general UI elements. Uses Tailwind classes for optimal performance.'
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '32px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '32px size icon (w-8 h-8 in Tailwind). A larger size suitable for prominent icons, feature highlights, or empty states. Uses Tailwind classes for optimal performance.'
    }
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '40px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '40px size icon (w-10 h-10 in Tailwind). A large size ideal for hero sections, feature illustrations, or attention-grabbing UI elements. Uses Tailwind classes for optimal performance.'
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '48px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '48px size icon (w-12 h-12 in Tailwind). An extra-large size perfect for empty states, illustrations, or prominent feature displays. Uses Tailwind classes for optimal performance.'
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
          className: 'flex items-center justify-center p-4'
        },
        children: [{
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '64px'
          },
          children: [{
            id: 'icon-svg',
            type: 'SVG_sample'
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: '64px size icon (w-16 h-16 in Tailwind). The largest predefined size, ideal for hero sections, large illustrations, or decorative elements. Uses Tailwind classes for optimal performance.'
    }
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
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
          id: 'icon-1',
          type: 'Icon',
          state: {
            size: '24px'
          },
          attributes: {
            'aria-label': 'Icon placeholder'
          },
          children: []
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: 'An icon placeholder without any children. This is useful when an icon hasn\\'t loaded yet or is missing. The component automatically sets aria-hidden="true" when no children are provided, but you can override this with an aria-label for accessibility. The placeholder maintains the specified size to prevent layout shifts.'
    }
  }
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-10 p-20 bg-gray-100'
        },
        children: [{
          id: 'icons-container',
          type: 'Div',
          attributes: {
            className: 'flex gap-10 justify-center items-center bg-white p-20 rounded-lg'
          },
          children: (['12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'] as const).map((size, index) => ({
            id: \`icon-size-\${size}\`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-4 items-center'
            },
            children: [{
              id: \`icon-number-\${size}\`,
              type: 'Div',
              attributes: {
                className: 'w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold'
              },
              children: [{
                id: \`icon-number-text-\${size}\`,
                type: 'Span',
                state: {
                  text: String(index + 1).padStart(2, '0')
                }
              }]
            }, {
              id: \`icon-\${size}\`,
              type: 'Icon',
              state: {
                size
              },
              children: [{
                id: \`icon-svg-\${size}\`,
                type: 'SVG_sample'
              }]
            }]
          }))
        }, {
          id: 'sizes-list',
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-2'
          },
          children: (['12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'] as const).map((size, index) => ({
            id: \`size-item-\${size}\`,
            type: 'Div',
            attributes: {
              className: 'flex gap-2 items-center'
            },
            children: [{
              id: \`size-number-\${size}\`,
              type: 'Div',
              attributes: {
                className: 'w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs font-bold'
              },
              children: [{
                id: \`size-number-text-\${size}\`,
                type: 'Span',
                state: {
                  text: String(index + 1).padStart(2, '0')
                }
              }]
            }, {
              id: \`size-label-\${size}\`,
              type: 'Span',
              state: {
                text: size
              },
              attributes: {
                className: 'text-base font-bold'
              }
            }]
          }))
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: 'Displays all eight predefined icon sizes in a visual grid. This helps designers and developers compare sizes and choose the appropriate one for their use case. All sizes are based on the Tailwind spacing scale (4px increments) and use Tailwind CSS classes for optimal performance.'
    }
  }
}`,...x.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
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
            text: 'Different Icon Shapes'
          },
          attributes: {
            className: 'text-lg font-bold'
          }
        }, {
          id: 'icons-container',
          type: 'Div',
          attributes: {
            className: 'flex gap-6 items-center flex-wrap'
          },
          children: [{
            id: 'icon-sample',
            type: 'Icon',
            state: {
              size: '24px'
            },
            children: [{
              id: 'svg-sample',
              type: 'SVG_sample'
            }]
          }, {
            id: 'icon-arrow',
            type: 'Icon',
            state: {
              size: '24px'
            },
            children: [{
              id: 'svg-arrow',
              type: 'SVG_arrow'
            }]
          }, {
            id: 'icon-close',
            type: 'Icon',
            state: {
              size: '24px'
            },
            children: [{
              id: 'svg-close',
              type: 'SVG_close'
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: "Shows how the Icon component works with different icon shapes and styles. The component is flexible and can accommodate any SVG content, whether it's geometric shapes, arrows, close icons, or custom illustrations. All icons maintain consistent sizing regardless of their shape."
    }
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
            text: 'Accessibility Examples'
          },
          attributes: {
            className: 'text-lg font-bold'
          }
        }, {
          id: 'examples-container',
          type: 'Div',
          attributes: {
            className: 'flex flex-col gap-4'
          },
          children: [{
            id: 'example-1',
            type: 'Div',
            attributes: {
              className: 'flex gap-4 items-center'
            },
            children: [{
              id: 'icon-accessible',
              type: 'Icon',
              state: {
                size: '24px'
              },
              attributes: {
                'aria-label': 'Close icon'
              },
              children: [{
                id: 'svg-close-accessible',
                type: 'SVG_close'
              }]
            }, {
              id: 'label-1',
              type: 'Span',
              state: {
                text: 'With aria-label (accessible)'
              }
            }]
          }, {
            id: 'example-2',
            type: 'Div',
            attributes: {
              className: 'flex gap-4 items-center'
            },
            children: [{
              id: 'icon-hidden',
              type: 'Icon',
              state: {
                size: '24px'
              },
              attributes: {
                'aria-hidden': true
              },
              children: [{
                id: 'svg-close-hidden',
                type: 'SVG_close'
              }]
            }, {
              id: 'label-2',
              type: 'Span',
              state: {
                text: 'With aria-hidden="true" (hidden from screen readers)'
              }
            }]
          }, {
            id: 'example-3',
            type: 'Div',
            attributes: {
              className: 'flex gap-4 items-center'
            },
            children: [{
              id: 'icon-placeholder',
              type: 'Icon',
              state: {
                size: '24px'
              }
            }, {
              id: 'label-3',
              type: 'Span',
              state: {
                text: 'Placeholder (no children) - automatically aria-hidden="true"'
              }
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: 'Demonstrates accessibility best practices for icons. Icons can be made accessible to screen readers using aria-label, hidden from screen readers using aria-hidden="true", or automatically hidden when used as decorative elements. Placeholder icons without children are automatically hidden from screen readers unless an aria-label is provided.'
    }
  }
}`,...f.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
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
            text: 'Size Comparison (Tailwind Spacing Scale Reference)'
          },
          attributes: {
            className: 'text-lg font-bold'
          }
        }, {
          id: 'icons-container',
          type: 'Div',
          attributes: {
            className: 'flex gap-6 items-end'
          },
          children: (['12px', '16px', '20px', '24px', '32px', '40px', '48px', '64px'] as const).map(size => ({
            id: \`icon-size-comp-\${size}\`,
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2 items-center'
            },
            children: [{
              id: \`icon-comp-\${size}\`,
              type: 'Icon',
              attributes: {
                size
              },
              children: [{
                id: \`svg-comp-\${size}\`,
                type: 'SVG_sample'
              }]
            }, {
              id: \`size-label-comp-\${size}\`,
              type: 'Span',
              state: {
                text: size
              },
              attributes: {
                className: 'text-sm font-bold'
              }
            }]
          }))
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getIconComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: 'A side-by-side comparison of all predefined icon sizes. This visual comparison helps designers and developers understand the size relationships and choose the appropriate size for their design. All sizes are aligned at the bottom to show height differences clearly.'
    }
  }
}`,...g.parameters?.docs?.source}}};const A=["Default","Size12px","Size16px","Size20px","Size24px","Size32px","Size40px","Size48px","Size64px","Placeholder","AllSizes","DifferentIcons","Accessibility","SizeComparison"];export{f as Accessibility,x as AllSizes,o as Default,y as DifferentIcons,h as Placeholder,r as Size12px,a as Size16px,c as Size20px,d as Size24px,l as Size32px,p as Size40px,m as Size48px,u as Size64px,g as SizeComparison,A as __namedExportsOrder,_ as default};
