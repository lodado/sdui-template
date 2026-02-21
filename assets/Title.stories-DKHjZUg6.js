import{j as t}from"./jsx-runtime-slN4ere-.js";/* empty css               */import{m as g,S as n,s as o,a as u}from"./sduiComponents-daN0Jbtk.js";import"./iframe-Bf5Fj-MD.js";import"./preload-helper-ggYluGXI.js";import"./index-nk0-osR5.js";import"./index-BW5zYQhE.js";const C={title:"Features/UI/Title",component:g,tags:["autodocs"],parameters:{docs:{description:{component:"The Title component is a header container that provides a flexible layout structure for application headers. It supports three distinct sections (left, middle, and right) and automatically organizes child components based on their type. The component uses design system tokens for consistent styling and is fully responsive, adapting to different screen sizes."}}}},i=`data:image/svg+xml;base64,${btoa('<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12h14M12 5l7 7-7 7" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>')}`,r={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:i,alt:"Company Logo"}}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"A basic Title component with a logo positioned in the left section. The component uses design system tokens for consistent dark background styling."}}}},s={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:i,alt:"Company Logo"}}]},{id:"title-right",type:"TitleRight",children:[{id:"nav-item-1",type:"Div",attributes:{className:"flex items-center gap-4"},children:[{id:"nav-button-1",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Home"}},{id:"nav-button-2",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"About"}},{id:"nav-button-3",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Contact"}}]}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"A Title component with a logo in the left section and navigation items in the right section. Demonstrates the three-section layout system."}}}},a={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:i,alt:"Company Logo"}}]},{id:"title-middle",type:"TitleMiddle",children:[{id:"search-container",type:"Div",attributes:{className:"flex items-center"},children:[{id:"search-text",type:"Div",attributes:{className:"text-[var(--color-text-subtle)] text-sm"},state:{text:"Search..."}}]}]},{id:"title-right",type:"TitleRight",children:[{id:"actions-container",type:"Div",attributes:{className:"flex items-center gap-2"},children:[{id:"action-button-1",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Sign In"}},{id:"action-button-2",type:"Div",attributes:{className:"text-[var(--color-text-default)] cursor-pointer hover:opacity-80"},state:{text:"Sign Up"}}]}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"A complete Title component example using all three sections (left, middle, right). Shows how the component organizes content across the header."}}}},d={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo-secondary",type:"TitleLogo",state:{src:i,alt:"Secondary Logo"}}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"Demonstrates how multiple TitleLogo components can be used within the Title component. Each logo is independently configurable."}}}},c={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:i,alt:"Company Logo"}}]},{id:"title-right",type:"TitleRight",children:[{id:"button-container",type:"Div",attributes:{className:"flex items-center gap-2"},children:[]}]}]}},m=({id:v})=>t.jsxs("div",{className:"flex items-center gap-2",children:[t.jsx(u,{appearance:"subtle",children:"Sign In"}),t.jsx(u,{appearance:"primary",children:"Sign Up"})]}),h={...o,ButtonContainer:()=>t.jsx(m,{id:"button-container"})},y={...e,root:{...e.root,children:[e.root.children[0],{id:"title-right",type:"TitleRight",children:[{id:"button-container",type:"ButtonContainer"}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:y,components:h})})},parameters:{docs:{description:{story:"Shows how to integrate Button components within the Title component. Demonstrates extending the component map with custom components."}}}},l={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[{id:"title-left",type:"TitleLeft",children:[{id:"logo",type:"TitleLogo",state:{src:i,alt:"Company Logo"}}]},{id:"title-middle",type:"TitleMiddle",children:[{id:"middle-content",type:"Div",attributes:{className:"hidden md:flex items-center text-[var(--color-text-default)]"},state:{text:"Middle Section (visible on medium screens and up)"}}]},{id:"title-right",type:"TitleRight",children:[{id:"right-content",type:"Div",attributes:{className:"flex items-center gap-2"},children:[{id:"mobile-menu",type:"Div",attributes:{className:"md:hidden text-[var(--color-text-default)] cursor-pointer"},state:{text:"☰"}},{id:"desktop-nav",type:"Div",attributes:{className:"hidden md:flex items-center gap-4 text-[var(--color-text-default)]"},children:[{id:"nav-1",type:"Div",attributes:{className:"cursor-pointer hover:opacity-80"},state:{text:"Home"}},{id:"nav-2",type:"Div",attributes:{className:"cursor-pointer hover:opacity-80"},state:{text:"About"}}]}]}]}]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"Demonstrates the responsive behavior of the Title component. The component adapts its layout and padding based on screen size using Tailwind CSS breakpoints."}}}},p={render:()=>{const e={version:"1.0.0",root:{id:"title-root",type:"Title",children:[]}};return t.jsx("div",{style:{width:"100%",backgroundColor:"#f0f0f0"},children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:"An empty Title component demonstrating the base structure and styling without any child components."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A basic Title component with a logo positioned in the left section. The component uses design system tokens for consistent dark background styling.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'nav-item-1',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-4'
            },
            children: [{
              id: 'nav-button-1',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Home'
              }
            }, {
              id: 'nav-button-2',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'About'
              }
            }, {
              id: 'nav-button-3',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Contact'
              }
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A Title component with a logo in the left section and navigation items in the right section. Demonstrates the three-section layout system.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-middle',
          type: 'TitleMiddle',
          children: [{
            id: 'search-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center'
            },
            children: [{
              id: 'search-text',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-subtle)] text-sm'
              },
              state: {
                text: 'Search...'
              }
            }]
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'actions-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: [{
              id: 'action-button-1',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Sign In'
              }
            }, {
              id: 'action-button-2',
              type: 'Div',
              attributes: {
                className: 'text-[var(--color-text-default)] cursor-pointer hover:opacity-80'
              },
              state: {
                text: 'Sign Up'
              }
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'A complete Title component example using all three sections (left, middle, right). Shows how the component organizes content across the header.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo-secondary',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Secondary Logo'
            }
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how multiple TitleLogo components can be used within the Title component. Each logo is independently configurable.'
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'button-container',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: []
          }]
        }]
      }
    };

    // Custom component to render buttons
    const ButtonContainer = ({
      id
    }: {
      id: string;
    }) => {
      return <div className="flex items-center gap-2">
          <Button appearance="subtle">
            Sign In
          </Button>
          <Button appearance="primary">
            Sign Up
          </Button>
        </div>;
    };
    const customComponents = {
      ...sduiComponents,
      ButtonContainer: () => <ButtonContainer id="button-container" />
    };

    // Update document to use ButtonContainer
    const updatedDocument: SduiLayoutDocument = {
      ...document,
      root: {
        ...document.root,
        children: [document.root.children![0], {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'button-container',
            type: 'ButtonContainer'
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={updatedDocument} components={customComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows how to integrate Button components within the Title component. Demonstrates extending the component map with custom components.'
      }
    }
  }
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: [{
          id: 'title-left',
          type: 'TitleLeft',
          children: [{
            id: 'logo',
            type: 'TitleLogo',
            state: {
              src: logoSecondarySvg,
              alt: 'Company Logo'
            }
          }]
        }, {
          id: 'title-middle',
          type: 'TitleMiddle',
          children: [{
            id: 'middle-content',
            type: 'Div',
            attributes: {
              className: 'hidden md:flex items-center text-[var(--color-text-default)]'
            },
            state: {
              text: 'Middle Section (visible on medium screens and up)'
            }
          }]
        }, {
          id: 'title-right',
          type: 'TitleRight',
          children: [{
            id: 'right-content',
            type: 'Div',
            attributes: {
              className: 'flex items-center gap-2'
            },
            children: [{
              id: 'mobile-menu',
              type: 'Div',
              attributes: {
                className: 'md:hidden text-[var(--color-text-default)] cursor-pointer'
              },
              state: {
                text: '☰'
              }
            }, {
              id: 'desktop-nav',
              type: 'Div',
              attributes: {
                className: 'hidden md:flex items-center gap-4 text-[var(--color-text-default)]'
              },
              children: [{
                id: 'nav-1',
                type: 'Div',
                attributes: {
                  className: 'cursor-pointer hover:opacity-80'
                },
                state: {
                  text: 'Home'
                }
              }, {
                id: 'nav-2',
                type: 'Div',
                attributes: {
                  className: 'cursor-pointer hover:opacity-80'
                },
                state: {
                  text: 'About'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates the responsive behavior of the Title component. The component adapts its layout and padding based on screen size using Tailwind CSS breakpoints.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'title-root',
        type: 'Title',
        children: []
      }
    };
    return <div style={{
      width: '100%',
      backgroundColor: '#f0f0f0'
    }}>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty Title component demonstrating the base structure and styling without any child components.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};const w=["Basic","WithNavigation","ThreeSections","MultipleLogos","WithButtons","Responsive","Empty"];export{r as Basic,p as Empty,d as MultipleLogos,l as Responsive,a as ThreeSections,c as WithButtons,s as WithNavigation,w as __namedExportsOrder,C as default};
