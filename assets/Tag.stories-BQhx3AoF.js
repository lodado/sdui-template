import{j as e}from"./jsx-runtime-ByrhRJDZ.js";import{T as t,S as g,s as m}from"./sduiComponents-C8NB1k_1.js";import"./iframe-D99cMFfR.js";import"./preload-helper-ggYluGXI.js";import"./index-D32qjQKj.js";import"./index-BIhXojLK.js";const S={title:"Shared/UI/Tag",component:t,tags:["autodocs"],argTypes:{text:{control:"text",description:"Tag text content",table:{defaultValue:{summary:"Tag"}}},color:{control:"select",options:["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"],description:"Tag color variant",table:{defaultValue:{summary:"standard"}}}},parameters:{docs:{description:{component:`
## Overview

The **Tag** component follows the Atlassian Design System (ADS) specifications. A tag labels UI objects for quick recognition and navigation.

## Color Variants

| Color | Description |
|-------|-------------|
| \`standard\` | Default neutral gray |
| \`blue\` | Blue accent - Information |
| \`red\` | Red accent - Danger/Error |
| \`yellow\` | Yellow accent - Warning |
| \`green\` | Green accent - Success |
| \`teal\` | Teal accent |
| \`purple\` | Purple accent |
| \`grey\` | Grey/muted |
| \`lime\` | Lime accent |
| \`orange\` | Orange accent |
| \`magenta\` | Magenta accent |

## Features

- **iconBefore**: Supports icon before text
- **props spread**: All HTML span attributes supported

## Integration

- ✅ **SDUI template system** integration
        `}}}},n={args:{text:"Tag",color:"standard"},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different tag configurations.

### Available Controls

- **text**: Tag text content
- **color**: 11 color variants
        `}}}},s={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Standard",color:"standard"})}),parameters:{docs:{description:{story:"Default neutral gray tag."}}}},c={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Blue",color:"blue"})}),parameters:{docs:{description:{story:"Blue accent tag for information."}}}},l={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Red",color:"red"})}),parameters:{docs:{description:{story:"Red accent tag for danger/error."}}}},i={render:()=>{const a=["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"];return e.jsx("div",{className:"flex flex-wrap items-center justify-center p-4 gap-2",children:a.map(r=>e.jsx(t,{text:r.charAt(0).toUpperCase()+r.slice(1),color:r},r))})},parameters:{docs:{description:{story:`
## All Color Variants

Visual comparison of all 11 color variants.
        `}}}},d={render:()=>e.jsxs("div",{className:"flex items-center justify-center p-4 gap-4",children:[e.jsx(t,{text:"Settings",color:"standard",iconBefore:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:[e.jsx("path",{d:"M12 15a3 3 0 100-6 3 3 0 000 6z"}),e.jsx("path",{fillRule:"evenodd",d:"M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z",clipRule:"evenodd"})]})}),e.jsx(t,{text:"User",color:"blue",iconBefore:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{fillRule:"evenodd",d:"M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z",clipRule:"evenodd"})})})]}),parameters:{docs:{description:{story:`
## Tags with Icons

Tags can have an icon before the text using the \`iconBefore\` prop.
        `}}}},p={render:()=>{const a={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-wrap items-center justify-center p-4 gap-2"},children:[{id:"tag-1",type:"Tag",state:{text:"Standard",color:"standard"}},{id:"tag-2",type:"Tag",state:{text:"Blue",color:"blue"}},{id:"tag-3",type:"Tag",state:{text:"Red",color:"red"}},{id:"tag-4",type:"Tag",state:{text:"Green",color:"green"}},{id:"tag-5",type:"Tag",state:{text:"Purple",color:"purple"}}]}};return e.jsx(g,{document:a,components:m})},parameters:{docs:{description:{story:`
## SDUI Integration

Tags rendered via SDUI document structure.

\`\`\`json
{
  "id": "tag-1",
  "type": "Tag",
  "state": { "text": "Standard", "color": "standard" }
}
\`\`\`
        `}}}},u={render:()=>{const r={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"Tag Colors Matrix"},attributes:{className:"text-xl font-bold"}},{id:"subtitle",type:"Span",state:{text:"11 Color Variants"},attributes:{className:"text-sm text-gray-600 mb-4"}},{id:"tags-grid",type:"Div",attributes:{className:"grid grid-cols-4 gap-4"},children:["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"].map(o=>({id:`tag-${o}`,type:"Tag",state:{text:o.charAt(0).toUpperCase()+o.slice(1),color:o}}))}]}};return e.jsx(g,{document:r,components:m})},parameters:{docs:{description:{story:`
## Complete Colors Matrix

All 11 tag color variants displayed in a grid via SDUI.
        `}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Tag',
    color: 'standard'
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different tag configurations.

### Available Controls

- **text**: Tag text content
- **color**: 11 color variants
        \`
      }
    }
  }
}`,...n.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Standard" color="standard" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Default neutral gray tag.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Blue" color="blue" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Blue accent tag for information.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Red" color="red" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Red accent tag for danger/error.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const colors = ['standard', 'blue', 'red', 'yellow', 'green', 'teal', 'purple', 'grey', 'lime', 'orange', 'magenta'] as const;
    return <div className="flex flex-wrap items-center justify-center p-4 gap-2">
        {colors.map(color => <Tag key={color} text={color.charAt(0).toUpperCase() + color.slice(1)} color={color} />)}
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## All Color Variants

Visual comparison of all 11 color variants.
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Settings" color="standard" iconBefore={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
            <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
          </svg>} />
      <Tag text="User" color="blue" iconBefore={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
          </svg>} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Tags with Icons

Tags can have an icon before the text using the \\\`iconBefore\\\` prop.
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-wrap items-center justify-center p-4 gap-2'
        },
        children: [{
          id: 'tag-1',
          type: 'Tag',
          state: {
            text: 'Standard',
            color: 'standard'
          }
        }, {
          id: 'tag-2',
          type: 'Tag',
          state: {
            text: 'Blue',
            color: 'blue'
          }
        }, {
          id: 'tag-3',
          type: 'Tag',
          state: {
            text: 'Red',
            color: 'red'
          }
        }, {
          id: 'tag-4',
          type: 'Tag',
          state: {
            text: 'Green',
            color: 'green'
          }
        }, {
          id: 'tag-5',
          type: 'Tag',
          state: {
            text: 'Purple',
            color: 'purple'
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

Tags rendered via SDUI document structure.

\\\`\\\`\\\`json
{
  "id": "tag-1",
  "type": "Tag",
  "state": { "text": "Standard", "color": "standard" }
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const colors = ['standard', 'blue', 'red', 'yellow', 'green', 'teal', 'purple', 'grey', 'lime', 'orange', 'magenta'] as const;
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
            text: 'Tag Colors Matrix'
          },
          attributes: {
            className: 'text-xl font-bold'
          }
        }, {
          id: 'subtitle',
          type: 'Span',
          state: {
            text: '11 Color Variants'
          },
          attributes: {
            className: 'text-sm text-gray-600 mb-4'
          }
        }, {
          id: 'tags-grid',
          type: 'Div',
          attributes: {
            className: 'grid grid-cols-4 gap-4'
          },
          children: colors.map(color => ({
            id: \`tag-\${color}\`,
            type: 'Tag',
            state: {
              text: color.charAt(0).toUpperCase() + color.slice(1),
              color
            }
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
## Complete Colors Matrix

All 11 tag color variants displayed in a grid via SDUI.
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};const b=["Playground","ColorStandard","ColorBlue","ColorRed","AllColors","WithIcon","SduiIntegration","ColorsMatrix"];export{i as AllColors,c as ColorBlue,l as ColorRed,s as ColorStandard,u as ColorsMatrix,n as Playground,p as SduiIntegration,d as WithIcon,b as __namedExportsOrder,S as default};
