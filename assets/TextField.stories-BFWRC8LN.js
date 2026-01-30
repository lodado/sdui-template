import{j as t}from"./jsx-runtime-D4-xOupc.js";/* empty css               */import{a9 as v,S as n,s as i}from"./sduiComponents-BCppMfUV.js";import"./iframe-CNeGMKeE.js";import"./preload-helper-ggYluGXI.js";import"./index-C94IiFzP.js";const T=()=>t.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"w-5 h-5",children:[t.jsx("path",{d:"M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"M22 6l-10 7L2 6",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]}),w=()=>t.jsxs("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"w-5 h-5",children:[t.jsx("circle",{cx:"11",cy:"11",r:"8",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"}),t.jsx("path",{d:"m21 21-4.35-4.35",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})]}),F=()=>t.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",className:"w-5 h-5",children:t.jsx("path",{d:"M18 6L6 18M6 6l12 12",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"})}),b=e=>()=>t.jsx(e,{}),g=()=>({...i,SVG_email:b(T),SVG_search:b(w),SVG_clear:b(F)}),W={title:"Shared/UI/TextField",component:v,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

The **TextField** component is an input field that accepts text input from users. Built with flexibility and accessibility in mind.

## Architecture

Uses the **Compound Component pattern** to flexibly arrange:
- **Label**: Field identifier
- **Input**: Text input element
- **HelpMessage**: Guidance and error messages

## Layout Options

The **Wrapper** component allows you to choose:
- **Vertical layout**: Stacked (default, mobile-friendly)
- **Horizontal layout**: Side-by-side (compact)
- **Custom layout**: Full control with CSS Grid/Flexbox

## Features

### States
- ✅ Default (empty)
- ✅ Focus (active)
- ✅ Filled (with value)
- ✅ Disabled (read-only)
- ✅ Error (validation failure)

### Additional Features
- ✅ **Icons**: Left and/or right icons
- ✅ **Validation**: Built-in error handling
- ✅ **Accessibility**: ARIA attributes, keyboard navigation
- ✅ **Help messages**: Contextual guidance

## Use Cases

- Form inputs
- Search fields
- Data entry
- User authentication
        `}}}},r={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Placeholder"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The default state of the TextField component. This is the initial, empty state where the field is ready for user input. The border uses the default color and no error or help messages are displayed."}}}},a={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Placeholder"}}]}]}]}]}};return t.jsxs("div",{children:[t.jsx(n,{document:e,components:i}),t.jsx("p",{className:"text-sm text-gray-600 mt-2",children:"Click on the input to see focus state"})]})},parameters:{docs:{description:{story:"The focus state occurs when the input field is active and ready for typing. The border color changes to indicate focus, and the field is ready to accept user input. This state is triggered when the user clicks or tabs into the field."}}}},s={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Placeholder",value:"Placeholder"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The filled state shows when the user has entered a value. A clear icon appears on the right side of the input, allowing users to quickly clear the field. This provides better UX by making it easy to reset the input without manually deleting all text."}}}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,disabled:!0,required:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Placeholder"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The disabled state makes the field read-only and non-interactive. Disabled fields appear with reduced opacity and cannot be focused or edited. This is useful for displaying pre-filled information that shouldn't be changed or when the field is temporarily unavailable."}}}},l={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!0,errorMessage:"Help message",required:!1},attributes:{disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Placeholder",value:"Placeholder"}},{id:"textfield-help-message",type:"TextFieldHelpMessage",state:{text:"Help message"},attributes:{error:!0}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The error state displays when validation fails or an error occurs. The border turns red and an error message appears below the input field. This provides immediate feedback to users about what needs to be corrected."}}}},o={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,helpMessage:"Enter your email address",required:!1},attributes:{disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"}},{id:"textfield-help-message",type:"TextFieldHelpMessage",state:{text:"Enter your email address"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The vertical layout (default) stacks the label, input, and help message vertically. This is the most common layout and provides the best readability, especially on mobile devices. The label appears above the input, and help/error messages appear below."}}}},c={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"horizontal"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"The horizontal layout places the label and input side by side. The label takes up flex-1 space, allowing it to grow and fill available space while the input maintains its width. This layout is useful when you need to save vertical space or create a more compact form design."}}}},p={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"Shows how to add a label to the TextField. Labels provide context about what information should be entered in the field. They are automatically associated with the input for accessibility, improving screen reader support and form usability."}}}},u={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,helpMessage:"Enter a valid email address",required:!1},attributes:{disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"}},{id:"textfield-help-message",type:"TextFieldHelpMessage",state:{text:"Enter a valid email address"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"Demonstrates how to add a help message to provide additional guidance to users. Help messages appear below the input field and remain visible even when the field is in an error state. They are useful for explaining format requirements or providing context about the expected input."}}}},h={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!0,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"}}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"Demonstrates a required field. When the required prop is set, the label displays a visual indicator (typically an asterisk) to show that the field must be filled. This helps users understand which fields are mandatory before submitting the form."}}}},m={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"container",type:"Div",attributes:{className:"w-[328px] flex flex-col gap-8"},children:[{id:"state-default",type:"Div",attributes:{className:"flex flex-col gap-2"},children:[{id:"state-default-title",type:"Span",state:{text:"State 1. Default"},attributes:{className:"text-base font-bold mb-2"}},{id:"state-default-desc",type:"Span",state:{text:"Default state ready for input"},attributes:{className:"text-sm text-gray-600 mb-2"}},{id:"textfield-default",type:"TextField",children:[{id:"wrapper-default",type:"TextFieldWrapper",children:[{id:"input-default",type:"TextFieldInput",attributes:{placeholder:"Placeholder"}}]}]}]},{id:"state-filled",type:"Div",attributes:{className:"flex flex-col gap-2"},children:[{id:"state-filled-title",type:"Span",state:{text:"State 3. Filled"},attributes:{className:"text-base font-bold mb-2"}},{id:"state-filled-desc",type:"Span",state:{text:"Filled state with completed input"},attributes:{className:"text-sm text-gray-600 mb-2"}},{id:"textfield-filled",type:"TextField",children:[{id:"wrapper-filled",type:"TextFieldWrapper",children:[{id:"input-filled",type:"TextFieldInput",attributes:{placeholder:"Placeholder",value:"Placeholder"}}]}]}]},{id:"state-disabled",type:"Div",attributes:{className:"flex flex-col gap-2"},children:[{id:"state-disabled-title",type:"Span",state:{text:"State 4. Disabled"},attributes:{className:"text-base font-bold mb-2"}},{id:"state-disabled-desc",type:"Span",state:{text:"Disabled state unable to input"},attributes:{className:"text-sm text-gray-600 mb-2"}},{id:"textfield-disabled",type:"TextField",attributes:{disabled:!0},children:[{id:"wrapper-disabled",type:"TextFieldWrapper",children:[{id:"input-disabled",type:"TextFieldInput",attributes:{placeholder:"Placeholder"}}]}]}]},{id:"state-error",type:"Div",attributes:{className:"flex flex-col gap-2"},children:[{id:"state-error-title",type:"Span",state:{text:"State 5. Error"},attributes:{className:"text-base font-bold mb-2"}},{id:"state-error-desc",type:"Span",state:{text:"Error state"},attributes:{className:"text-sm text-gray-600 mb-2"}},{id:"textfield-error",type:"TextField",attributes:{error:!0,errorMessage:"Help message"},children:[{id:"wrapper-error",type:"TextFieldWrapper",children:[{id:"input-error",type:"TextFieldInput",attributes:{placeholder:"Placeholder",value:"Placeholder"}},{id:"help-message-error",type:"TextFieldHelpMessage"}]}]}]}]}]}};return t.jsx(n,{document:e,components:i})},parameters:{docs:{description:{story:"A comprehensive showcase of all TextField states in one view. This includes Default (empty), Focus (active), Filled (with value and clear icon), Disabled (read-only), and Error (validation failure). This helps designers and developers understand the complete state system and choose the appropriate state for their use case."}}}},f={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Email"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Enter your email"},state:{iconLocation:"left"},children:[{id:"left-icon",type:"Icon",attributes:{size:"w-5 h-5"},children:[{id:"email-icon-svg",type:"SVG_email"}]}]}]}]}]}]}};return t.jsx(n,{document:e,components:g()})},parameters:{docs:{description:{story:"Demonstrates how to add a left icon to the TextField input. Left icons are useful for indicating the type of input expected, such as an email icon for email fields or a search icon for search fields. The icon appears inside the input field on the left side."}}}},x={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Search"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Search...",value:"Search query"},state:{iconLocation:"right"},children:[{id:"right-icon",type:"Icon",attributes:{size:"w-5 h-5"},children:[{id:"clear-icon-svg",type:"SVG_clear"}]}]}]}]}]}]}};return t.jsx(n,{document:e,components:g()})},parameters:{docs:{description:{story:"Demonstrates how to add a right icon to the TextField input. Right icons are commonly used for actions like clearing the input field or showing/hiding passwords. The icon appears inside the input field on the right side and can be made clickable."}}}},y={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex justify-center p-20 bg-gray-100"},children:[{id:"textfield-container",type:"Div",attributes:{className:"w-[328px]"},children:[{id:"textfield",type:"TextField",state:{error:!1,required:!1,disabled:!1},children:[{id:"textfield-wrapper",type:"TextFieldWrapper",attributes:{orientation:"vertical"},children:[{id:"textfield-label",type:"TextFieldLabel",state:{text:"Search"}},{id:"textfield-input",type:"TextFieldInput",attributes:{placeholder:"Search...",value:"Search query"},state:{iconLocation:"both"},children:[{id:"left-icon",type:"Icon",attributes:{size:"w-5 h-5"},children:[{id:"search-icon-svg",type:"SVG_search"}]},{id:"right-icon",type:"Icon",attributes:{size:"w-5 h-5"},children:[{id:"clear-icon-svg",type:"SVG_clear"}]}]}]}]}]}]}};return t.jsx(n,{document:e,components:g()})},parameters:{docs:{description:{story:"Demonstrates a TextField with both left and right icons. This is useful for search fields where you want to indicate the search functionality with a left icon and provide a clear action with a right icon. Both icons work together to enhance the user experience."}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Placeholder'
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
        story: 'The default state of the TextField component. This is the initial, empty state where the field is ready for user input. The border uses the default color and no error or help messages are displayed.'
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
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Placeholder'
                }
              }]
            }]
          }]
        }]
      }
    };
    return <div>
        <SduiLayoutRenderer document={document} components={sduiComponents} />
        <p className="text-sm text-gray-600 mt-2">Click on the input to see focus state</p>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: 'The focus state occurs when the input field is active and ready for typing. The border color changes to indicate focus, and the field is ready to accept user input. This state is triggered when the user clicks or tabs into the field.'
      }
    }
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Placeholder',
                  value: 'Placeholder'
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
        story: 'The filled state shows when the user has entered a value. A clear icon appears on the right side of the input, allowing users to quickly clear the field. This provides better UX by making it easy to reset the input without manually deleting all text.'
      }
    }
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              disabled: true,
              required: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Placeholder'
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
        story: "The disabled state makes the field read-only and non-interactive. Disabled fields appear with reduced opacity and cannot be focused or edited. This is useful for displaying pre-filled information that shouldn't be changed or when the field is temporarily unavailable."
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
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: true,
              errorMessage: 'Help message',
              required: false
            },
            attributes: {
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Placeholder',
                  value: 'Placeholder'
                }
              }, {
                id: 'textfield-help-message',
                type: 'TextFieldHelpMessage',
                state: {
                  text: 'Help message'
                },
                attributes: {
                  error: true
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
        story: 'The error state displays when validation fails or an error occurs. The border turns red and an error message appears below the input field. This provides immediate feedback to users about what needs to be corrected.'
      }
    }
  }
}`,...l.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              helpMessage: 'Enter your email address',
              required: false
            },
            attributes: {
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
                }
              }, {
                id: 'textfield-help-message',
                type: 'TextFieldHelpMessage',
                state: {
                  text: 'Enter your email address'
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
        story: 'The vertical layout (default) stacks the label, input, and help message vertically. This is the most common layout and provides the best readability, especially on mobile devices. The label appears above the input, and help/error messages appear below.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'horizontal'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
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
        story: 'The horizontal layout places the label and input side by side. The label takes up flex-1 space, allowing it to grow and fill available space while the input maintains its width. This layout is useful when you need to save vertical space or create a more compact form design.'
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
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
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
        story: 'Shows how to add a label to the TextField. Labels provide context about what information should be entered in the field. They are automatically associated with the input for accessibility, improving screen reader support and form usability.'
      }
    }
  }
}`,...p.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              helpMessage: 'Enter a valid email address',
              required: false
            },
            attributes: {
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
                }
              }, {
                id: 'textfield-help-message',
                type: 'TextFieldHelpMessage',
                state: {
                  text: 'Enter a valid email address'
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
        story: 'Demonstrates how to add a help message to provide additional guidance to users. Help messages appear below the input field and remain visible even when the field is in an error state. They are useful for explaining format requirements or providing context about the expected input.'
      }
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
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: true,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
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
        story: 'Demonstrates a required field. When the required prop is set, the label displays a visual indicator (typically an asterisk) to show that the field must be filled. This helps users understand which fields are mandatory before submitting the form.'
      }
    }
  }
}`,...h.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'container',
          type: 'Div',
          attributes: {
            className: 'w-[328px] flex flex-col gap-8'
          },
          children: [{
            id: 'state-default',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2'
            },
            children: [{
              id: 'state-default-title',
              type: 'Span',
              state: {
                text: 'State 1. Default'
              },
              attributes: {
                className: 'text-base font-bold mb-2'
              }
            }, {
              id: 'state-default-desc',
              type: 'Span',
              state: {
                text: 'Default state ready for input'
              },
              attributes: {
                className: 'text-sm text-gray-600 mb-2'
              }
            }, {
              id: 'textfield-default',
              type: 'TextField',
              children: [{
                id: 'wrapper-default',
                type: 'TextFieldWrapper',
                children: [{
                  id: 'input-default',
                  type: 'TextFieldInput',
                  attributes: {
                    placeholder: 'Placeholder'
                  }
                }]
              }]
            }]
          }, {
            id: 'state-filled',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2'
            },
            children: [{
              id: 'state-filled-title',
              type: 'Span',
              state: {
                text: 'State 3. Filled'
              },
              attributes: {
                className: 'text-base font-bold mb-2'
              }
            }, {
              id: 'state-filled-desc',
              type: 'Span',
              state: {
                text: 'Filled state with completed input'
              },
              attributes: {
                className: 'text-sm text-gray-600 mb-2'
              }
            }, {
              id: 'textfield-filled',
              type: 'TextField',
              children: [{
                id: 'wrapper-filled',
                type: 'TextFieldWrapper',
                children: [{
                  id: 'input-filled',
                  type: 'TextFieldInput',
                  attributes: {
                    placeholder: 'Placeholder',
                    value: 'Placeholder'
                  }
                }]
              }]
            }]
          }, {
            id: 'state-disabled',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2'
            },
            children: [{
              id: 'state-disabled-title',
              type: 'Span',
              state: {
                text: 'State 4. Disabled'
              },
              attributes: {
                className: 'text-base font-bold mb-2'
              }
            }, {
              id: 'state-disabled-desc',
              type: 'Span',
              state: {
                text: 'Disabled state unable to input'
              },
              attributes: {
                className: 'text-sm text-gray-600 mb-2'
              }
            }, {
              id: 'textfield-disabled',
              type: 'TextField',
              attributes: {
                disabled: true
              },
              children: [{
                id: 'wrapper-disabled',
                type: 'TextFieldWrapper',
                children: [{
                  id: 'input-disabled',
                  type: 'TextFieldInput',
                  attributes: {
                    placeholder: 'Placeholder'
                  }
                }]
              }]
            }]
          }, {
            id: 'state-error',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-2'
            },
            children: [{
              id: 'state-error-title',
              type: 'Span',
              state: {
                text: 'State 5. Error'
              },
              attributes: {
                className: 'text-base font-bold mb-2'
              }
            }, {
              id: 'state-error-desc',
              type: 'Span',
              state: {
                text: 'Error state'
              },
              attributes: {
                className: 'text-sm text-gray-600 mb-2'
              }
            }, {
              id: 'textfield-error',
              type: 'TextField',
              attributes: {
                error: true,
                errorMessage: 'Help message'
              },
              children: [{
                id: 'wrapper-error',
                type: 'TextFieldWrapper',
                children: [{
                  id: 'input-error',
                  type: 'TextFieldInput',
                  attributes: {
                    placeholder: 'Placeholder',
                    value: 'Placeholder'
                  }
                }, {
                  id: 'help-message-error',
                  type: 'TextFieldHelpMessage'
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
        story: 'A comprehensive showcase of all TextField states in one view. This includes Default (empty), Focus (active), Filled (with value and clear icon), Disabled (read-only), and Error (validation failure). This helps designers and developers understand the complete state system and choose the appropriate state for their use case.'
      }
    }
  }
}`,...m.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Email'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Enter your email'
                },
                state: {
                  iconLocation: 'left'
                },
                children: [{
                  id: 'left-icon',
                  type: 'Icon',
                  attributes: {
                    size: 'w-5 h-5'
                  },
                  children: [{
                    id: 'email-icon-svg',
                    type: 'SVG_email'
                  }]
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to add a left icon to the TextField input. Left icons are useful for indicating the type of input expected, such as an email icon for email fields or a search icon for search fields. The icon appears inside the input field on the left side.'
      }
    }
  }
}`,...f.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Search'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Search...',
                  value: 'Search query'
                },
                state: {
                  iconLocation: 'right'
                },
                children: [{
                  id: 'right-icon',
                  type: 'Icon',
                  attributes: {
                    size: 'w-5 h-5'
                  },
                  children: [{
                    id: 'clear-icon-svg',
                    type: 'SVG_clear'
                  }]
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates how to add a right icon to the TextField input. Right icons are commonly used for actions like clearing the input field or showing/hiding passwords. The icon appears inside the input field on the right side and can be made clickable.'
      }
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
          className: 'flex justify-center p-20 bg-gray-100'
        },
        children: [{
          id: 'textfield-container',
          type: 'Div',
          attributes: {
            className: 'w-[328px]'
          },
          children: [{
            id: 'textfield',
            type: 'TextField',
            state: {
              error: false,
              required: false,
              disabled: false
            },
            children: [{
              id: 'textfield-wrapper',
              type: 'TextFieldWrapper',
              attributes: {
                orientation: 'vertical'
              },
              children: [{
                id: 'textfield-label',
                type: 'TextFieldLabel',
                state: {
                  text: 'Search'
                }
              }, {
                id: 'textfield-input',
                type: 'TextFieldInput',
                attributes: {
                  placeholder: 'Search...',
                  value: 'Search query'
                },
                state: {
                  iconLocation: 'both'
                },
                children: [{
                  id: 'left-icon',
                  type: 'Icon',
                  attributes: {
                    size: 'w-5 h-5'
                  },
                  children: [{
                    id: 'search-icon-svg',
                    type: 'SVG_search'
                  }]
                }, {
                  id: 'right-icon',
                  type: 'Icon',
                  attributes: {
                    size: 'w-5 h-5'
                  },
                  children: [{
                    id: 'clear-icon-svg',
                    type: 'SVG_clear'
                  }]
                }]
              }]
            }]
          }]
        }]
      }
    };
    return <SduiLayoutRenderer document={document} components={getTextFieldComponentsWithSVG()} />;
  },
  parameters: {
    docs: {
      description: {
        story: 'Demonstrates a TextField with both left and right icons. This is useful for search fields where you want to indicate the search functionality with a left icon and provide a clear action with a right icon. Both icons work together to enhance the user experience.'
      }
    }
  }
}`,...y.parameters?.docs?.source}}};const k=["Default","Focus","Filled","Disabled","Error","VerticalLayout","HorizontalLayout","WithLabel","WithHelpMessage","Required","AllStates","WithLeftIcon","WithRightIcon","WithBothIcons"];export{m as AllStates,r as Default,d as Disabled,l as Error,s as Filled,a as Focus,c as HorizontalLayout,h as Required,o as VerticalLayout,y as WithBothIcons,u as WithHelpMessage,p as WithLabel,f as WithLeftIcon,x as WithRightIcon,k as __namedExportsOrder,W as default};
