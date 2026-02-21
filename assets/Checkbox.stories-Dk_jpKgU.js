import{j as t}from"./jsx-runtime-_1jvc9L0.js";import{c as u,S as n,s as o}from"./sduiComponents-BS8e01iU.js";import"./iframe-jzwLdUya.js";import"./preload-helper-ggYluGXI.js";import"./index-Ik36_hCC.js";import"./index-CxOifdYY.js";const L={title:"Shared/UI/Checkbox",component:u.Root,tags:["autodocs"],argTypes:{disabled:{control:"boolean",description:"Whether the checkbox is disabled",table:{defaultValue:{summary:"false"}}},required:{control:"boolean",description:"Whether the checkbox is required",table:{defaultValue:{summary:"false"}}},error:{control:"boolean",description:"Whether the checkbox has an error",table:{defaultValue:{summary:"false"}}}},parameters:{docs:{description:{component:`
## Overview

The **Checkbox** component follows the Atlassian Design System (ADS) specifications.
A checkbox is used to select one or more options from a list.

## Compound Pattern

The Checkbox component uses a compound pattern with three subcomponents:

- **Checkbox.Root**: Provides context and manages shared state (disabled, required, error)
- **Checkbox.Checkbox**: The actual checkbox input (Radix UI based)
- **Checkbox.Label**: Label text that connects to the checkbox

## Size

- **Box size**: 14px × 14px (Figma spec)
- **Border radius**: 2px
- **Focus ring**: 2px border inset by 3px

## States

- **checked**: Checkbox is selected
- **unchecked**: Checkbox is not selected
- **indeterminate**: Partially selected (e.g., "Select all")
- **disabled**: Non-interactive state
- **required**: Shows asterisk indicator
- **error**: Applies error styling to label

## Colors

| State | Background | Border |
|-------|------------|--------|
| Unchecked | White | Gray (#8c8f97) |
| Checked | Blue (#0052cc) | Blue (#0052cc) |
| Indeterminate | Blue (#0052cc) | Blue (#0052cc) |
| Error (Unchecked) | White | Red (#e2483d) |
| Error (Checked) | Red (#e2483d) | Red (#e2483d) |
| Error (Indeterminate) | Red (#e2483d) | Red (#e2483d) |
| Disabled | Light Gray (rgba(23,23,23,0.03)) | None |
| Focus | White | Blue (#4688ec) - 2px ring |

## Integration

- ✅ **SDUI template system** integration
- ✅ **Keyboard navigation** (Space & Enter keys)
- ✅ **Accessibility features** (role="checkbox", aria-checked)
- ✅ **Form integration** (hidden input with name)
        `}}}},c={args:{disabled:!1,required:!1,error:!1},render:e=>{const k={version:"1.0.0",root:{id:"checkbox-root",type:"Checkbox",state:{disabled:e.disabled,required:e.required,error:e.error},children:[{id:"checkbox-label",type:"CheckboxLabel",state:{text:"Accept terms and conditions"}},{id:"checkbox-input",type:"CheckboxCheckbox",state:{checked:!1}}]}};return t.jsx("div",{className:"p-4",children:t.jsx(n,{document:k,components:o})})},parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different checkbox configurations.

### Available Controls

- **disabled**: Enable/disable the checkbox
- **required**: Show required indicator (asterisk)
- **error**: Apply error styling to label
        `}}}},r={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4 p-4"},children:[{id:"checkbox-root",type:"Checkbox",state:{},children:[{id:"checkbox-label",type:"CheckboxLabel",state:{text:"Accept terms"}},{id:"checkbox-input",type:"CheckboxCheckbox",state:{checked:!1}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Default Checkbox

Basic checkbox in unchecked state. Click to toggle.
        `}}}},a={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4 p-4"},children:[{id:"checkbox-root",type:"Checkbox",state:{},children:[{id:"checkbox-label",type:"CheckboxLabel",state:{text:"Accept terms"}},{id:"checkbox-input",type:"CheckboxCheckbox",state:{checked:!0}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Checked State

Checkbox in checked state with checkmark icon.
        `}}}},d={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-4"},children:[{id:"checkbox-1",type:"Checkbox",state:{},children:[{id:"label-1",type:"CheckboxLabel",state:{text:"Select all"}},{id:"input-1",type:"CheckboxCheckbox",state:{indeterminate:!0}}]},{id:"checkbox-2",type:"Checkbox",state:{error:!0},children:[{id:"label-2",type:"CheckboxLabel",state:{text:"Select all (with error)"}},{id:"input-2",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Indeterminate State

Checkbox in indeterminate state (e.g., "Select all" when some items are selected).
Displays a horizontal dash icon instead of a checkmark.
        `}}}},i={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-4"},children:[{id:"checkbox-1",type:"Checkbox",state:{disabled:!0},children:[{id:"label-1",type:"CheckboxLabel",state:{text:"Disabled unchecked"}},{id:"input-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-2",type:"Checkbox",state:{disabled:!0},children:[{id:"label-2",type:"CheckboxLabel",state:{text:"Disabled checked"}},{id:"input-2",type:"CheckboxCheckbox",state:{checked:!0}}]},{id:"checkbox-3",type:"Checkbox",state:{disabled:!0},children:[{id:"label-3",type:"CheckboxLabel",state:{text:"Disabled indeterminate"}},{id:"input-3",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Disabled State

Checkboxes in disabled state (unchecked, checked, and indeterminate).
Disabled checkboxes have a light gray background and no border.
        `}}}},s={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex items-center gap-4 p-4"},children:[{id:"checkbox-root",type:"Checkbox",state:{required:!0},children:[{id:"checkbox-label",type:"CheckboxLabel",state:{text:"Accept terms and conditions"}},{id:"checkbox-input",type:"CheckboxCheckbox",state:{checked:!1}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Required State

Checkbox with required indicator (asterisk) displayed next to label.
        `}}}},l={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-4"},children:[{id:"checkbox-1",type:"Checkbox",state:{error:!0},children:[{id:"label-1",type:"CheckboxLabel",state:{text:"Error unchecked"}},{id:"input-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-2",type:"Checkbox",state:{error:!0},children:[{id:"label-2",type:"CheckboxLabel",state:{text:"Error checked"}},{id:"input-2",type:"CheckboxCheckbox",state:{checked:!0}}]},{id:"checkbox-3",type:"Checkbox",state:{error:!0},children:[{id:"label-3",type:"CheckboxLabel",state:{text:"Error indeterminate"}},{id:"input-3",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Error State

Checkboxes with error styling. When in error state:
- Unchecked: Red border, white background
- Checked: Red background and border
- Indeterminate: Red background and border
- Label text is also styled in red
        `}}}},b={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-6 p-4"},children:[{id:"section-default",type:"Div",children:[{id:"title-default",type:"Span",state:{text:"Default States"},attributes:{className:"text-sm font-semibold mb-3 block"}},{id:"default-group",type:"Div",attributes:{className:"flex flex-col gap-3"},children:[{id:"checkbox-default-1",type:"Checkbox",state:{},children:[{id:"label-default-1",type:"CheckboxLabel",state:{text:"Unchecked"}},{id:"input-default-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-default-2",type:"Checkbox",state:{},children:[{id:"label-default-2",type:"CheckboxLabel",state:{text:"Checked"}},{id:"input-default-2",type:"CheckboxCheckbox",state:{checked:!0}}]},{id:"checkbox-default-3",type:"Checkbox",state:{},children:[{id:"label-default-3",type:"CheckboxLabel",state:{text:"Indeterminate"}},{id:"input-default-3",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}]},{id:"section-error",type:"Div",children:[{id:"title-error",type:"Span",state:{text:"Error States"},attributes:{className:"text-sm font-semibold mb-3 block"}},{id:"error-group",type:"Div",attributes:{className:"flex flex-col gap-3"},children:[{id:"checkbox-error-1",type:"Checkbox",state:{error:!0},children:[{id:"label-error-1",type:"CheckboxLabel",state:{text:"Error unchecked"}},{id:"input-error-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-error-2",type:"Checkbox",state:{error:!0},children:[{id:"label-error-2",type:"CheckboxLabel",state:{text:"Error checked"}},{id:"input-error-2",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-error-3",type:"Checkbox",state:{error:!0},children:[{id:"label-error-3",type:"CheckboxLabel",state:{text:"Error indeterminate"}},{id:"input-error-3",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}]},{id:"section-disabled",type:"Div",children:[{id:"title-disabled",type:"Span",state:{text:"Disabled States"},attributes:{className:"text-sm font-semibold mb-3 block"}},{id:"disabled-group",type:"Div",attributes:{className:"flex flex-col gap-3"},children:[{id:"checkbox-disabled-1",type:"Checkbox",state:{disabled:!0},children:[{id:"label-disabled-1",type:"CheckboxLabel",state:{text:"Disabled unchecked"}},{id:"input-disabled-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-disabled-2",type:"Checkbox",state:{disabled:!0},children:[{id:"label-disabled-2",type:"CheckboxLabel",state:{text:"Disabled checked"}},{id:"input-disabled-2",type:"CheckboxCheckbox",state:{checked:!0}}]},{id:"checkbox-disabled-3",type:"Checkbox",state:{disabled:!0},children:[{id:"label-disabled-3",type:"CheckboxLabel",state:{text:"Disabled indeterminate"}},{id:"input-disabled-3",type:"CheckboxCheckbox",state:{indeterminate:!0}}]}]}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## All States

Comprehensive view of all checkbox states matching the Figma design specification.
Shows default, error, and disabled states for unchecked, checked, and indeterminate variants.
        `}}}},h={render:()=>{const e={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex flex-col gap-4 p-4"},children:[{id:"checkbox-1",type:"Checkbox",state:{},children:[{id:"label-1",type:"CheckboxLabel",state:{text:"Option 1"}},{id:"input-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-2",type:"Checkbox",state:{},children:[{id:"label-2",type:"CheckboxLabel",state:{text:"Option 2"}},{id:"input-2",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-3",type:"Checkbox",state:{},children:[{id:"label-3",type:"CheckboxLabel",state:{text:"Option 3"}},{id:"input-3",type:"CheckboxCheckbox",state:{checked:!1}}]}]}};return t.jsx(n,{document:e,components:o})},parameters:{docs:{description:{story:`
## Compound Pattern

Multiple checkboxes using the compound pattern. Each checkbox has its own Root, Label, and Checkbox components.
        `}}}},p={render:()=>{const e={version:"1.0.0",root:{id:"checkbox-root",type:"Checkbox",state:{disabled:!1,required:!0,error:!1},children:[{id:"checkbox-label",type:"CheckboxLabel",state:{text:"Accept terms and conditions"}},{id:"checkbox-input",type:"CheckboxCheckbox",state:{checked:!1}}]}};return t.jsx("div",{className:"p-4",children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:`
## SDUI Integration

Checkbox rendered from SDUI document. The document defines the structure and state, and the SDUI renderer creates the component tree.

### SDUI Document Structure

\`\`\`json
{
  "id": "checkbox-root",
  "type": "Checkbox",
  "state": {
    "disabled": false,
    "required": true,
    "error": false
  },
  "children": [
    {
      "id": "checkbox-label",
      "type": "CheckboxLabel",
      "state": { "text": "Accept terms and conditions" }
    },
    {
      "id": "checkbox-input",
      "type": "CheckboxCheckbox",
      "state": { "checked": false }
    }
  ]
}
\`\`\`
        `}}}},x={render:()=>{const e={version:"1.0.0",root:{id:"container",type:"Div",children:[{id:"checkbox-1",type:"Checkbox",state:{},children:[{id:"label-1",type:"CheckboxLabel",state:{text:"Option 1"}},{id:"input-1",type:"CheckboxCheckbox",state:{checked:!1}}]},{id:"checkbox-2",type:"Checkbox",state:{},children:[{id:"label-2",type:"CheckboxLabel",state:{text:"Option 2"}},{id:"input-2",type:"CheckboxCheckbox",state:{checked:!0}}]},{id:"checkbox-3",type:"Checkbox",state:{disabled:!0},children:[{id:"label-3",type:"CheckboxLabel",state:{text:"Option 3 (disabled)"}},{id:"input-3",type:"CheckboxCheckbox",state:{checked:!1}}]}]}};return t.jsx("div",{className:"flex flex-col gap-4 p-4",children:t.jsx(n,{document:e,components:o})})},parameters:{docs:{description:{story:`
## Multiple SDUI Checkboxes

Multiple checkboxes rendered from SDUI document, demonstrating different states.
        `}}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    disabled: false,
    required: false,
    error: false
  },
  render: args => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'checkbox-root',
        type: 'Checkbox',
        state: {
          disabled: args.disabled,
          required: args.required,
          error: args.error
        },
        children: [{
          id: 'checkbox-label',
          type: 'CheckboxLabel',
          state: {
            text: 'Accept terms and conditions'
          }
        }, {
          id: 'checkbox-input',
          type: 'CheckboxCheckbox',
          state: {
            checked: false
          }
        }]
      }
    };
    return <div className="p-4">
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different checkbox configurations.

### Available Controls

- **disabled**: Enable/disable the checkbox
- **required**: Show required indicator (asterisk)
- **error**: Apply error styling to label
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-4 p-4'
        },
        children: [{
          id: 'checkbox-root',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'checkbox-label',
            type: 'CheckboxLabel',
            state: {
              text: 'Accept terms'
            }
          }, {
            id: 'checkbox-input',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
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
## Default Checkbox

Basic checkbox in unchecked state. Click to toggle.
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
          className: 'flex items-center gap-4 p-4'
        },
        children: [{
          id: 'checkbox-root',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'checkbox-label',
            type: 'CheckboxLabel',
            state: {
              text: 'Accept terms'
            }
          }, {
            id: 'checkbox-input',
            type: 'CheckboxCheckbox',
            state: {
              checked: true
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
## Checked State

Checkbox in checked state with checkmark icon.
        \`
      }
    }
  }
}`,...a.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-4'
        },
        children: [{
          id: 'checkbox-1',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-1',
            type: 'CheckboxLabel',
            state: {
              text: 'Select all'
            }
          }, {
            id: 'input-1',
            type: 'CheckboxCheckbox',
            state: {
              indeterminate: true
            }
          }]
        }, {
          id: 'checkbox-2',
          type: 'Checkbox',
          state: {
            error: true
          },
          children: [{
            id: 'label-2',
            type: 'CheckboxLabel',
            state: {
              text: 'Select all (with error)'
            }
          }, {
            id: 'input-2',
            type: 'CheckboxCheckbox',
            state: {
              indeterminate: true
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
## Indeterminate State

Checkbox in indeterminate state (e.g., "Select all" when some items are selected).
Displays a horizontal dash icon instead of a checkmark.
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-4'
        },
        children: [{
          id: 'checkbox-1',
          type: 'Checkbox',
          state: {
            disabled: true
          },
          children: [{
            id: 'label-1',
            type: 'CheckboxLabel',
            state: {
              text: 'Disabled unchecked'
            }
          }, {
            id: 'input-1',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }, {
          id: 'checkbox-2',
          type: 'Checkbox',
          state: {
            disabled: true
          },
          children: [{
            id: 'label-2',
            type: 'CheckboxLabel',
            state: {
              text: 'Disabled checked'
            }
          }, {
            id: 'input-2',
            type: 'CheckboxCheckbox',
            state: {
              checked: true
            }
          }]
        }, {
          id: 'checkbox-3',
          type: 'Checkbox',
          state: {
            disabled: true
          },
          children: [{
            id: 'label-3',
            type: 'CheckboxLabel',
            state: {
              text: 'Disabled indeterminate'
            }
          }, {
            id: 'input-3',
            type: 'CheckboxCheckbox',
            state: {
              indeterminate: true
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
## Disabled State

Checkboxes in disabled state (unchecked, checked, and indeterminate).
Disabled checkboxes have a light gray background and no border.
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex items-center gap-4 p-4'
        },
        children: [{
          id: 'checkbox-root',
          type: 'Checkbox',
          state: {
            required: true
          },
          children: [{
            id: 'checkbox-label',
            type: 'CheckboxLabel',
            state: {
              text: 'Accept terms and conditions'
            }
          }, {
            id: 'checkbox-input',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
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
## Required State

Checkbox with required indicator (asterisk) displayed next to label.
        \`
      }
    }
  }
}`,...s.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-4'
        },
        children: [{
          id: 'checkbox-1',
          type: 'Checkbox',
          state: {
            error: true
          },
          children: [{
            id: 'label-1',
            type: 'CheckboxLabel',
            state: {
              text: 'Error unchecked'
            }
          }, {
            id: 'input-1',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }, {
          id: 'checkbox-2',
          type: 'Checkbox',
          state: {
            error: true
          },
          children: [{
            id: 'label-2',
            type: 'CheckboxLabel',
            state: {
              text: 'Error checked'
            }
          }, {
            id: 'input-2',
            type: 'CheckboxCheckbox',
            state: {
              checked: true
            }
          }]
        }, {
          id: 'checkbox-3',
          type: 'Checkbox',
          state: {
            error: true
          },
          children: [{
            id: 'label-3',
            type: 'CheckboxLabel',
            state: {
              text: 'Error indeterminate'
            }
          }, {
            id: 'input-3',
            type: 'CheckboxCheckbox',
            state: {
              indeterminate: true
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
## Error State

Checkboxes with error styling. When in error state:
- Unchecked: Red border, white background
- Checked: Red background and border
- Indeterminate: Red background and border
- Label text is also styled in red
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-6 p-4'
        },
        children: [{
          id: 'section-default',
          type: 'Div',
          children: [{
            id: 'title-default',
            type: 'Span',
            state: {
              text: 'Default States'
            },
            attributes: {
              className: 'text-sm font-semibold mb-3 block'
            }
          }, {
            id: 'default-group',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-3'
            },
            children: [{
              id: 'checkbox-default-1',
              type: 'Checkbox',
              state: {},
              children: [{
                id: 'label-default-1',
                type: 'CheckboxLabel',
                state: {
                  text: 'Unchecked'
                }
              }, {
                id: 'input-default-1',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false
                }
              }]
            }, {
              id: 'checkbox-default-2',
              type: 'Checkbox',
              state: {},
              children: [{
                id: 'label-default-2',
                type: 'CheckboxLabel',
                state: {
                  text: 'Checked'
                }
              }, {
                id: 'input-default-2',
                type: 'CheckboxCheckbox',
                state: {
                  checked: true
                }
              }]
            }, {
              id: 'checkbox-default-3',
              type: 'Checkbox',
              state: {},
              children: [{
                id: 'label-default-3',
                type: 'CheckboxLabel',
                state: {
                  text: 'Indeterminate'
                }
              }, {
                id: 'input-default-3',
                type: 'CheckboxCheckbox',
                state: {
                  indeterminate: true
                }
              }]
            }]
          }]
        }, {
          id: 'section-error',
          type: 'Div',
          children: [{
            id: 'title-error',
            type: 'Span',
            state: {
              text: 'Error States'
            },
            attributes: {
              className: 'text-sm font-semibold mb-3 block'
            }
          }, {
            id: 'error-group',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-3'
            },
            children: [{
              id: 'checkbox-error-1',
              type: 'Checkbox',
              state: {
                error: true
              },
              children: [{
                id: 'label-error-1',
                type: 'CheckboxLabel',
                state: {
                  text: 'Error unchecked'
                }
              }, {
                id: 'input-error-1',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false
                }
              }]
            }, {
              id: 'checkbox-error-2',
              type: 'Checkbox',
              state: {
                error: true
              },
              children: [{
                id: 'label-error-2',
                type: 'CheckboxLabel',
                state: {
                  text: 'Error checked'
                }
              }, {
                id: 'input-error-2',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false
                }
              }]
            }, {
              id: 'checkbox-error-3',
              type: 'Checkbox',
              state: {
                error: true
              },
              children: [{
                id: 'label-error-3',
                type: 'CheckboxLabel',
                state: {
                  text: 'Error indeterminate'
                }
              }, {
                id: 'input-error-3',
                type: 'CheckboxCheckbox',
                state: {
                  indeterminate: true
                }
              }]
            }]
          }]
        }, {
          id: 'section-disabled',
          type: 'Div',
          children: [{
            id: 'title-disabled',
            type: 'Span',
            state: {
              text: 'Disabled States'
            },
            attributes: {
              className: 'text-sm font-semibold mb-3 block'
            }
          }, {
            id: 'disabled-group',
            type: 'Div',
            attributes: {
              className: 'flex flex-col gap-3'
            },
            children: [{
              id: 'checkbox-disabled-1',
              type: 'Checkbox',
              state: {
                disabled: true
              },
              children: [{
                id: 'label-disabled-1',
                type: 'CheckboxLabel',
                state: {
                  text: 'Disabled unchecked'
                }
              }, {
                id: 'input-disabled-1',
                type: 'CheckboxCheckbox',
                state: {
                  checked: false
                }
              }]
            }, {
              id: 'checkbox-disabled-2',
              type: 'Checkbox',
              state: {
                disabled: true
              },
              children: [{
                id: 'label-disabled-2',
                type: 'CheckboxLabel',
                state: {
                  text: 'Disabled checked'
                }
              }, {
                id: 'input-disabled-2',
                type: 'CheckboxCheckbox',
                state: {
                  checked: true
                }
              }]
            }, {
              id: 'checkbox-disabled-3',
              type: 'Checkbox',
              state: {
                disabled: true
              },
              children: [{
                id: 'label-disabled-3',
                type: 'CheckboxLabel',
                state: {
                  text: 'Disabled indeterminate'
                }
              }, {
                id: 'input-disabled-3',
                type: 'CheckboxCheckbox',
                state: {
                  indeterminate: true
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
        story: \`
## All States

Comprehensive view of all checkbox states matching the Figma design specification.
Shows default, error, and disabled states for unchecked, checked, and indeterminate variants.
        \`
      }
    }
  }
}`,...b.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex flex-col gap-4 p-4'
        },
        children: [{
          id: 'checkbox-1',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-1',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 1'
            }
          }, {
            id: 'input-1',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }, {
          id: 'checkbox-2',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-2',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 2'
            }
          }, {
            id: 'input-2',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }, {
          id: 'checkbox-3',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-3',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 3'
            }
          }, {
            id: 'input-3',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
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
## Compound Pattern

Multiple checkboxes using the compound pattern. Each checkbox has its own Root, Label, and Checkbox components.
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'checkbox-root',
        type: 'Checkbox',
        state: {
          disabled: false,
          required: true,
          error: false
        },
        children: [{
          id: 'checkbox-label',
          type: 'CheckboxLabel',
          state: {
            text: 'Accept terms and conditions'
          }
        }, {
          id: 'checkbox-input',
          type: 'CheckboxCheckbox',
          state: {
            checked: false
          }
        }]
      }
    };
    return <div className="p-4">
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## SDUI Integration

Checkbox rendered from SDUI document. The document defines the structure and state, and the SDUI renderer creates the component tree.

### SDUI Document Structure

\\\`\\\`\\\`json
{
  "id": "checkbox-root",
  "type": "Checkbox",
  "state": {
    "disabled": false,
    "required": true,
    "error": false
  },
  "children": [
    {
      "id": "checkbox-label",
      "type": "CheckboxLabel",
      "state": { "text": "Accept terms and conditions" }
    },
    {
      "id": "checkbox-input",
      "type": "CheckboxCheckbox",
      "state": { "checked": false }
    }
  ]
}
\\\`\\\`\\\`
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'container',
        type: 'Div',
        children: [{
          id: 'checkbox-1',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-1',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 1'
            }
          }, {
            id: 'input-1',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }, {
          id: 'checkbox-2',
          type: 'Checkbox',
          state: {},
          children: [{
            id: 'label-2',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 2'
            }
          }, {
            id: 'input-2',
            type: 'CheckboxCheckbox',
            state: {
              checked: true
            }
          }]
        }, {
          id: 'checkbox-3',
          type: 'Checkbox',
          state: {
            disabled: true
          },
          children: [{
            id: 'label-3',
            type: 'CheckboxLabel',
            state: {
              text: 'Option 3 (disabled)'
            }
          }, {
            id: 'input-3',
            type: 'CheckboxCheckbox',
            state: {
              checked: false
            }
          }]
        }]
      }
    };
    return <div className="flex flex-col gap-4 p-4">
        <SduiLayoutRenderer document={document} components={sduiComponents} />
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Multiple SDUI Checkboxes

Multiple checkboxes rendered from SDUI document, demonstrating different states.
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const D=["Playground","Default","Checked","Indeterminate","Disabled","Required","Error","AllStates","CompoundPattern","SduiIntegration","SduiMultipleCheckboxes"];export{b as AllStates,a as Checked,h as CompoundPattern,r as Default,i as Disabled,l as Error,d as Indeterminate,c as Playground,s as Required,p as SduiIntegration,x as SduiMultipleCheckboxes,D as __namedExportsOrder,L as default};
