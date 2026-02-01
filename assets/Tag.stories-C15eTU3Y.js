import{j as e}from"./jsx-runtime-Bn5U2jj6.js";import{R as T}from"./iframe-DStpXkDC.js";import{T as t,S as v,s as y}from"./sduiComponents-Dza7yqs-.js";import"./preload-helper-ggYluGXI.js";import"./index-Bj-pHb08.js";import"./index-DRxj8KRh.js";const N={title:"Shared/UI/Tag",component:t,tags:["autodocs"],argTypes:{text:{control:"text",description:"Tag text content",table:{defaultValue:{summary:"Tag"}}},color:{control:"select",options:["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"],description:"Tag color variant",table:{defaultValue:{summary:"standard"}}},isRemovable:{control:"boolean",description:"Whether to show remove button",table:{defaultValue:{summary:"false"}}},isLink:{control:"boolean",description:"Whether to render as link style with underline",table:{defaultValue:{summary:"false"}}}},parameters:{docs:{description:{component:`
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

- **isRemovable**: Shows a close button for removing tags
- **isLink**: Renders with underline for link-style tags
- **iconBefore**: Supports icon before text

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Backspace/Delete to remove)
- ✅ **Accessibility features** built-in
        `}}}},n={args:{text:"Tag",color:"standard",isRemovable:!1,isLink:!1},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different tag configurations.

### Available Controls

- **text**: Tag text content
- **color**: 11 color variants
- **isRemovable**: Show/hide remove button
- **isLink**: Enable link style
        `}}}},l={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Standard",color:"standard"})}),parameters:{docs:{description:{story:"Default neutral gray tag."}}}},i={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Blue",color:"blue"})}),parameters:{docs:{description:{story:"Blue accent tag for information."}}}},c={render:()=>e.jsx("div",{className:"flex items-center justify-center p-4 gap-4",children:e.jsx(t,{text:"Red",color:"red"})}),parameters:{docs:{description:{story:"Red accent tag for danger/error."}}}},d={render:()=>{const a=["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"];return e.jsx("div",{className:"flex flex-wrap items-center justify-center p-4 gap-2",children:a.map(r=>e.jsx(t,{text:r.charAt(0).toUpperCase()+r.slice(1),color:r},r))})},parameters:{docs:{description:{story:`
## All Color Variants

Visual comparison of all 11 color variants.
        `}}}},p={render:()=>{const[a,r]=T.useState(["React","TypeScript","Tailwind"]),o=s=>{r(b=>b.filter(h=>h!==s))};return e.jsxs("div",{className:"flex flex-col items-center justify-center p-4 gap-4",children:[e.jsx("div",{className:"flex flex-wrap gap-2",children:a.map(s=>e.jsx(t,{text:s,color:"blue",isRemovable:!0,onRemove:()=>o(s)},s))}),a.length===0&&e.jsx("p",{className:"text-gray-500",children:"All tags removed"}),a.length<3&&e.jsx("button",{type:"button",className:"text-sm text-blue-500 underline",onClick:()=>r(["React","TypeScript","Tailwind"]),children:"Reset tags"})]})},parameters:{docs:{description:{story:`
## Removable Tags

Tags with a close button. Click the X to remove a tag.
        `}}}},m={render:()=>e.jsxs("div",{className:"flex items-center justify-center p-4 gap-4",children:[e.jsx(t,{text:"Link Tag",color:"blue",isLink:!0,onClick:()=>alert("Tag clicked!")}),e.jsx(t,{text:"With href",color:"purple",isLink:!0,href:"https://atlassian.design"})]}),parameters:{docs:{description:{story:`
## Link Style Tags

Tags rendered with underline text, indicating clickable links.
        `}}}},u={render:()=>e.jsxs("div",{className:"flex items-center justify-center p-4 gap-4",children:[e.jsx(t,{text:"Settings",color:"standard",iconBefore:e.jsxs("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:[e.jsx("path",{d:"M12 15a3 3 0 100-6 3 3 0 000 6z"}),e.jsx("path",{fillRule:"evenodd",d:"M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z",clipRule:"evenodd"})]})}),e.jsx(t,{text:"User",color:"blue",iconBefore:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{fillRule:"evenodd",d:"M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z",clipRule:"evenodd"})})})]}),parameters:{docs:{description:{story:`
## Tags with Icons

Tags can have an icon before the text using the \`iconBefore\` prop.
        `}}}},g={render:()=>e.jsxs("div",{className:"flex flex-wrap items-center justify-center p-4 gap-2",children:[e.jsx(t,{text:"Removable with Icon",color:"green",isRemovable:!0,iconBefore:e.jsx("svg",{viewBox:"0 0 24 24",fill:"currentColor",className:"w-full h-full",children:e.jsx("path",{fillRule:"evenodd",d:"M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z",clipRule:"evenodd"})}),onRemove:()=>alert("Remove clicked!")}),e.jsx(t,{text:"Link + Removable",color:"purple",isLink:!0,isRemovable:!0,onRemove:()=>alert("Remove clicked!")})]}),parameters:{docs:{description:{story:`
## Combined Features

Tags can combine multiple features like icons, removable, and link style.
        `}}}},x={render:()=>{const a={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-wrap items-center justify-center p-4 gap-2"},children:[{id:"tag-1",type:"Tag",state:{text:"Standard",color:"standard"}},{id:"tag-2",type:"Tag",state:{text:"Blue",color:"blue"}},{id:"tag-3",type:"Tag",state:{text:"Red",color:"red"}},{id:"tag-4",type:"Tag",state:{text:"Green",color:"green"}},{id:"tag-5",type:"Tag",state:{text:"Purple",color:"purple"}}]}};return e.jsx(v,{document:a,components:y})},parameters:{docs:{description:{story:`
## SDUI Integration

Tags rendered via SDUI document structure.

\`\`\`json
{
  "id": "tag-1",
  "type": "Tag",
  "state": { "text": "Standard", "color": "standard" }
}
\`\`\`
        `}}}},f={render:()=>{const r={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-6"},children:[{id:"title",type:"Span",state:{text:"Tag Colors Matrix"},attributes:{className:"text-xl font-bold"}},{id:"subtitle",type:"Span",state:{text:"11 Color Variants"},attributes:{className:"text-sm text-gray-600 mb-4"}},{id:"tags-grid",type:"Div",attributes:{className:"grid grid-cols-4 gap-4"},children:["standard","blue","red","yellow","green","teal","purple","grey","lime","orange","magenta"].map(o=>({id:`tag-${o}`,type:"Tag",state:{text:o.charAt(0).toUpperCase()+o.slice(1),color:o}}))}]}};return e.jsx(v,{document:r,components:y})},parameters:{docs:{description:{story:`
## Complete Colors Matrix

All 11 tag color variants displayed in a grid via SDUI.
        `}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    text: 'Tag',
    color: 'standard',
    isRemovable: false,
    isLink: false
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
- **isRemovable**: Show/hide remove button
- **isLink**: Enable link style
        \`
      }
    }
  }
}`,...n.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
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
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
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
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
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
}`,...d.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [tags, setTags] = React.useState(['React', 'TypeScript', 'Tailwind']);
    const handleRemove = (tag: string) => {
      setTags(prev => prev.filter(t => t !== tag));
    };
    return <div className="flex flex-col items-center justify-center p-4 gap-4">
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => <Tag key={tag} text={tag} color="blue" isRemovable onRemove={() => handleRemove(tag)} />)}
        </div>
        {tags.length === 0 && <p className="text-gray-500">All tags removed</p>}
        {tags.length < 3 && <button type="button" className="text-sm text-blue-500 underline" onClick={() => setTags(['React', 'TypeScript', 'Tailwind'])}>
            Reset tags
          </button>}
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Removable Tags

Tags with a close button. Click the X to remove a tag.
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center justify-center p-4 gap-4">
      <Tag text="Link Tag" color="blue" isLink onClick={() => alert('Tag clicked!')} />
      <Tag text="With href" color="purple" isLink href="https://atlassian.design" />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Link Style Tags

Tags rendered with underline text, indicating clickable links.
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
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
}`,...u.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap items-center justify-center p-4 gap-2">
      <Tag text="Removable with Icon" color="green" isRemovable iconBefore={<svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
            <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
          </svg>} onRemove={() => alert('Remove clicked!')} />
      <Tag text="Link + Removable" color="purple" isLink isRemovable onRemove={() => alert('Remove clicked!')} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## Combined Features

Tags can combine multiple features like icons, removable, and link style.
        \`
      }
    }
  }
}`,...g.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
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
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
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
}`,...f.parameters?.docs?.source}}};const L=["Playground","ColorStandard","ColorBlue","ColorRed","AllColors","Removable","LinkStyle","WithIcon","Combined","SduiIntegration","ColorsMatrix"];export{d as AllColors,i as ColorBlue,c as ColorRed,l as ColorStandard,f as ColorsMatrix,g as Combined,m as LinkStyle,n as Playground,p as Removable,x as SduiIntegration,u as WithIcon,L as __namedExportsOrder,N as default};
