import{j as e}from"./jsx-runtime-Bn5U2jj6.js";import{a,S as o,s as i,b,D as n}from"./sduiComponents-Dza7yqs-.js";import"./iframe-DStpXkDC.js";import"./preload-helper-ggYluGXI.js";import"./index-Bj-pHb08.js";import"./index-DRxj8KRh.js";const z={title:"Features/Dialog",component:a,tags:["autodocs"],argTypes:{size:{control:"select",options:["small","medium","large","xlarge"],description:"Dialog size",table:{defaultValue:{summary:"small"}}},hasCloseButton:{control:"boolean",description:"Whether to show close button",table:{defaultValue:{summary:"true"}}},title:{control:"text",description:"Dialog title"},description:{control:"text",description:"Dialog description (optional)"}},parameters:{docs:{description:{component:`
## Overview

The **Dialog** component is a modal overlay following the Atlassian Design System (ADS) specifications. It provides a focused interaction layer for important content or actions.

## Size Variants

| Size | Width | Use Case |
|------|-------|----------|
| \`small\` | 400px | Simple confirmations, alerts |
| \`medium\` | 600px | Forms, settings |
| \`large\` | 800px | Complex content, tables |
| \`xlarge\` | 968px | Full page-like content |

## Appearance Variants (ConfirmDialog)

| Appearance | Description |
|------------|-------------|
| \`default\` | Neutral confirmation |
| \`danger\` | Destructive actions (delete, remove) |
| \`warning\` | Warning actions |

## Features

- Compound component pattern for flexibility
- Keyboard navigation (Escape to close)
- Focus trap and restoration
- ARIA attributes for accessibility
- SDUI template integration
        `}}}},r={args:{title:"Modal Title",description:"This is a description of the dialog content.",size:"small",hasCloseButton:!0},render:t=>e.jsx(a,{...t,trigger:e.jsx("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Open Dialog"}),children:e.jsx("p",{className:"text-sm text-gray-600",children:"Dialog body content goes here. You can put any content inside the dialog."})}),parameters:{docs:{description:{story:`
## Interactive Playground

Use the controls panel to experiment with different dialog configurations.

### Available Controls

- **size**: small, medium, large, xlarge
- **hasCloseButton**: Show/hide close button
- **title**: Dialog title text
- **description**: Optional description text
        `}}}},l={render:()=>{const t={version:"1.0.0",root:{id:"dialog-small",type:"Dialog",state:{open:!1},children:[{id:"trigger",type:"DialogTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open Small Dialog"}}]}]},{id:"portal",type:"DialogPortal",children:[{id:"content",type:"DialogContent",attributes:{size:"small"},children:[{id:"header",type:"DialogHeader",attributes:{title:"Small Dialog (400px)",hasCloseButton:!0}},{id:"body",type:"DialogBody",children:[{id:"body-text",type:"Span",state:{text:"This is a small dialog, perfect for simple confirmations and alerts."}}]},{id:"footer",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Confirm"}}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## Small Size (400px)

The smallest dialog size. Best for:
- Simple confirmations
- Alert messages
- Quick actions
        `}}}},s={render:()=>{const t={version:"1.0.0",root:{id:"dialog-medium",type:"Dialog",state:{open:!1},children:[{id:"trigger",type:"DialogTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open Medium Dialog"}}]}]},{id:"portal",type:"DialogPortal",children:[{id:"content",type:"DialogContent",attributes:{size:"medium"},children:[{id:"header",type:"DialogHeader",attributes:{title:"Medium Dialog (600px)",hasCloseButton:!0}},{id:"body",type:"DialogBody",children:[{id:"body-text",type:"Span",state:{text:"This is a medium dialog. Suitable for forms, settings panels, and moderate content."}}]},{id:"footer",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Save"}}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## Medium Size (600px)

A balanced dialog size. Best for:
- Forms and inputs
- Settings panels
- Moderate content
        `}}}},d={render:()=>{const t={version:"1.0.0",root:{id:"dialog-large",type:"Dialog",state:{open:!1},children:[{id:"trigger",type:"DialogTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open Large Dialog"}}]}]},{id:"portal",type:"DialogPortal",children:[{id:"content",type:"DialogContent",attributes:{size:"large"},children:[{id:"header",type:"DialogHeader",attributes:{title:"Large Dialog (800px)",hasCloseButton:!0}},{id:"body",type:"DialogBody",children:[{id:"body-text",type:"Span",state:{text:"This is a large dialog. Ideal for complex content, data tables, and detailed views."}}]},{id:"footer",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Apply"}}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## Large Size (800px)

A spacious dialog size. Best for:
- Complex content
- Data tables
- Detailed views
        `}}}},c={render:()=>{const t={version:"1.0.0",root:{id:"dialog-xlarge",type:"Dialog",state:{open:!1},children:[{id:"trigger",type:"DialogTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Open XLarge Dialog"}}]}]},{id:"portal",type:"DialogPortal",children:[{id:"content",type:"DialogContent",attributes:{size:"xlarge"},children:[{id:"header",type:"DialogHeader",attributes:{title:"XLarge Dialog (968px)",hasCloseButton:!0}},{id:"body",type:"DialogBody",children:[{id:"body-text",type:"Span",state:{text:"This is an extra large dialog. Use for full page-like content, comprehensive forms, or complex workflows."}}]},{id:"footer",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Submit"}}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## XLarge Size (968px)

The largest dialog size. Best for:
- Full page-like content
- Comprehensive forms
- Complex workflows
        `}}}},p={render:()=>e.jsx(b,{trigger:e.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"Default Confirm"}),title:"Confirm Action",size:"small",appearance:"default",confirmLabel:"Confirm",cancelLabel:"Cancel",onConfirm:()=>alert("Confirmed!"),children:e.jsx("p",{className:"text-sm text-gray-600",children:"Are you sure you want to proceed with this action?"})}),parameters:{docs:{description:{story:`
## Default Appearance

Neutral confirmation dialog. Use for general confirmations that don't have destructive consequences.
        `}}}},g={render:()=>e.jsx(b,{trigger:e.jsx("button",{className:"px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700",children:"Delete Item"}),title:"Delete Item",description:"This action cannot be undone.",size:"small",appearance:"danger",confirmLabel:"Delete",cancelLabel:"Cancel",onConfirm:()=>alert("Deleted!"),children:e.jsx("p",{className:"text-sm text-gray-600",children:"Are you sure you want to delete this item? All associated data will be permanently removed."})}),parameters:{docs:{description:{story:`
## Danger Appearance

Red-themed confirmation dialog. Use for destructive actions like:
- Delete operations
- Permanent removals
- Irreversible changes
        `}}}},m={render:()=>e.jsx(b,{trigger:e.jsx("button",{className:"px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600",children:"Proceed with Caution"}),title:"Warning",description:"This may have unintended consequences.",size:"small",appearance:"warning",confirmLabel:"Proceed",cancelLabel:"Cancel",onConfirm:()=>alert("Proceeded!"),children:e.jsx("p",{className:"text-sm text-gray-600",children:"This action may affect other parts of the system. Please review before proceeding."})}),parameters:{docs:{description:{story:`
## Warning Appearance

Yellow-themed confirmation dialog. Use for actions that need attention:
- Potential side effects
- Important changes
- Actions requiring review
        `}}}},u={render:()=>{const t={version:"1.0.0",root:{id:"dialog-form",type:"Dialog",state:{open:!1},children:[{id:"trigger",type:"DialogTrigger",children:[{id:"btn",type:"Button",state:{appearance:"primary"},children:[{id:"text",type:"Span",state:{text:"Edit Profile"}}]}]},{id:"portal",type:"DialogPortal",children:[{id:"content",type:"DialogContent",attributes:{size:"medium"},children:[{id:"header",type:"DialogHeader",attributes:{title:"Edit Profile",hasCloseButton:!0}},{id:"body",type:"DialogBody",children:[{id:"form-container",type:"Div",attributes:{className:"space-y-4"},children:[{id:"name-field",type:"TextField",state:{label:"Name",placeholder:"Enter your name"}},{id:"email-field",type:"TextField",state:{label:"Email",placeholder:"Enter your email",type:"email"}}]}]},{id:"footer",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Save Changes"}}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## Dialog with Form

A practical example showing a dialog with form fields inside. This pattern is common for:
- Edit forms
- Settings dialogs
- User profile updates
        `}}}},y={render:()=>{const t={version:"1.0.0",root:{id:"root",type:"Div",attributes:{className:"flex gap-4"},children:[{id:"dialog-save",type:"Dialog",state:{open:!1},children:[{id:"trigger-save",type:"DialogTrigger",children:[{id:"btn-save",type:"Button",state:{appearance:"primary"},children:[{id:"text-save",type:"Span",state:{text:"Save Draft"}}]}]},{id:"portal-save",type:"DialogPortal",children:[{id:"content-save",type:"DialogContent",attributes:{size:"small"},children:[{id:"header-save",type:"DialogHeader",attributes:{title:"Save Draft?",hasCloseButton:!0}},{id:"body-save",type:"DialogBody",children:[{id:"body-text-save",type:"Span",state:{text:"Your changes will be saved as a draft. You can continue editing later."}}]},{id:"footer-save",type:"DialogFooter",attributes:{cancelLabel:"Discard",confirmLabel:"Save Draft"}}]}]}]},{id:"dialog-delete",type:"Dialog",state:{open:!1},children:[{id:"trigger-delete",type:"DialogTrigger",children:[{id:"btn-delete",type:"Button",state:{appearance:"danger"},children:[{id:"text-delete",type:"Span",state:{text:"Delete"}}]}]},{id:"portal-delete",type:"DialogPortal",children:[{id:"content-delete",type:"DialogContent",attributes:{size:"small"},children:[{id:"header-delete",type:"DialogHeader",attributes:{title:"Delete Item?",hasCloseButton:!0}},{id:"body-delete",type:"DialogBody",children:[{id:"body-text-delete",type:"Span",state:{text:"This action cannot be undone. Are you sure you want to delete this item?"}}]},{id:"footer-delete",type:"DialogFooter",attributes:{cancelLabel:"Cancel",confirmLabel:"Delete",appearance:"danger"}}]}]}]}]}};return e.jsx(o,{document:t,components:i})},parameters:{docs:{description:{story:`
## Confirmation Pattern

Multiple confirmation dialogs showing different use cases:
- **Save Draft**: Default appearance for neutral actions
- **Delete**: Danger appearance for destructive actions
        `}}}},h={render:()=>e.jsxs(n.Root,{children:[e.jsx(n.Trigger,{children:e.jsx("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Open Compound Dialog"})}),e.jsxs(n.Portal,{children:[e.jsx(n.Overlay,{}),e.jsxs(n.Content,{size:"medium",children:[e.jsxs(n.Header,{children:[e.jsxs("div",{className:"flex-1",children:[e.jsx(n.Title,{children:"Compound Pattern"}),e.jsx(n.Description,{children:"This dialog uses the compound component pattern for maximum flexibility."})]}),e.jsx(n.Close,{})]}),e.jsxs(n.Body,{children:[e.jsx("p",{className:"text-sm text-gray-600 mb-4",children:"The compound pattern gives you full control over the dialog structure. You can customize each part independently."}),e.jsxs("ul",{className:"text-sm text-gray-600 list-disc pl-5 space-y-1",children:[e.jsx("li",{children:"Dialog.Root - Context provider"}),e.jsx("li",{children:"Dialog.Trigger - Opens the dialog"}),e.jsx("li",{children:"Dialog.Portal - Renders in portal"}),e.jsx("li",{children:"Dialog.Overlay - Background blanket"}),e.jsx("li",{children:"Dialog.Content - Main container"}),e.jsx("li",{children:"Dialog.Header - Title area"}),e.jsx("li",{children:"Dialog.Body - Content area"}),e.jsx("li",{children:"Dialog.Footer - Action buttons"})]})]}),e.jsxs(n.Footer,{children:[e.jsx(n.Close,{asChild:!0,children:e.jsx("button",{className:"px-4 py-2 text-gray-600 hover:bg-gray-100 rounded",children:"Cancel"})}),e.jsx("button",{className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",children:"Got it!"})]})]})]})]}),parameters:{docs:{description:{story:`
## Compound Component Pattern

This example demonstrates the full compound component pattern, giving you maximum control over the dialog structure.

Each sub-component can be styled and positioned independently.
        `}}}},x={render:()=>e.jsxs("div",{className:"flex flex-wrap gap-4",children:[e.jsx(a,{trigger:e.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"Small (400px)"}),title:"Small Dialog",size:"small",children:e.jsx("p",{className:"text-sm text-gray-600",children:"This is a small dialog."})}),e.jsx(a,{trigger:e.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"Medium (600px)"}),title:"Medium Dialog",size:"medium",children:e.jsx("p",{className:"text-sm text-gray-600",children:"This is a medium dialog."})}),e.jsx(a,{trigger:e.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"Large (800px)"}),title:"Large Dialog",size:"large",children:e.jsx("p",{className:"text-sm text-gray-600",children:"This is a large dialog."})}),e.jsx(a,{trigger:e.jsx("button",{className:"px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300",children:"XLarge (968px)"}),title:"XLarge Dialog",size:"xlarge",children:e.jsx("p",{className:"text-sm text-gray-600",children:"This is an extra large dialog."})})]}),parameters:{docs:{description:{story:`
## All Sizes Comparison

Quick comparison of all available dialog sizes. Click each button to see the different widths.
        `}}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  args: {
    title: 'Modal Title',
    description: 'This is a description of the dialog content.',
    size: 'small',
    hasCloseButton: true
  },
  render: args => <SimpleDialog {...args} trigger={<button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Dialog
        </button>}>
      <p className="text-sm text-gray-600">
        Dialog body content goes here. You can put any content inside the dialog.
      </p>
    </SimpleDialog>,
  parameters: {
    docs: {
      description: {
        story: \`
## Interactive Playground

Use the controls panel to experiment with different dialog configurations.

### Available Controls

- **size**: small, medium, large, xlarge
- **hasCloseButton**: Show/hide close button
- **title**: Dialog title text
- **description**: Optional description text
        \`
      }
    }
  }
}`,...r.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-small',
        type: 'Dialog',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DialogTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open Small Dialog'
              }
            }]
          }]
        }, {
          id: 'portal',
          type: 'DialogPortal',
          children: [{
            id: 'content',
            type: 'DialogContent',
            attributes: {
              size: 'small'
            },
            children: [{
              id: 'header',
              type: 'DialogHeader',
              attributes: {
                title: 'Small Dialog (400px)',
                hasCloseButton: true
              }
            }, {
              id: 'body',
              type: 'DialogBody',
              children: [{
                id: 'body-text',
                type: 'Span',
                state: {
                  text: 'This is a small dialog, perfect for simple confirmations and alerts.'
                }
              }]
            }, {
              id: 'footer',
              type: 'DialogFooter',
              attributes: {
                cancelLabel: 'Cancel',
                confirmLabel: 'Confirm'
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
## Small Size (400px)

The smallest dialog size. Best for:
- Simple confirmations
- Alert messages
- Quick actions
        \`
      }
    }
  }
}`,...l.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-medium',
        type: 'Dialog',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DialogTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open Medium Dialog'
              }
            }]
          }]
        }, {
          id: 'portal',
          type: 'DialogPortal',
          children: [{
            id: 'content',
            type: 'DialogContent',
            attributes: {
              size: 'medium'
            },
            children: [{
              id: 'header',
              type: 'DialogHeader',
              attributes: {
                title: 'Medium Dialog (600px)',
                hasCloseButton: true
              }
            }, {
              id: 'body',
              type: 'DialogBody',
              children: [{
                id: 'body-text',
                type: 'Span',
                state: {
                  text: 'This is a medium dialog. Suitable for forms, settings panels, and moderate content.'
                }
              }]
            }, {
              id: 'footer',
              type: 'DialogFooter',
              attributes: {
                cancelLabel: 'Cancel',
                confirmLabel: 'Save'
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
## Medium Size (600px)

A balanced dialog size. Best for:
- Forms and inputs
- Settings panels
- Moderate content
        \`
      }
    }
  }
}`,...s.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-large',
        type: 'Dialog',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DialogTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open Large Dialog'
              }
            }]
          }]
        }, {
          id: 'portal',
          type: 'DialogPortal',
          children: [{
            id: 'content',
            type: 'DialogContent',
            attributes: {
              size: 'large'
            },
            children: [{
              id: 'header',
              type: 'DialogHeader',
              attributes: {
                title: 'Large Dialog (800px)',
                hasCloseButton: true
              }
            }, {
              id: 'body',
              type: 'DialogBody',
              children: [{
                id: 'body-text',
                type: 'Span',
                state: {
                  text: 'This is a large dialog. Ideal for complex content, data tables, and detailed views.'
                }
              }]
            }, {
              id: 'footer',
              type: 'DialogFooter',
              attributes: {
                cancelLabel: 'Cancel',
                confirmLabel: 'Apply'
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
## Large Size (800px)

A spacious dialog size. Best for:
- Complex content
- Data tables
- Detailed views
        \`
      }
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-xlarge',
        type: 'Dialog',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DialogTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Open XLarge Dialog'
              }
            }]
          }]
        }, {
          id: 'portal',
          type: 'DialogPortal',
          children: [{
            id: 'content',
            type: 'DialogContent',
            attributes: {
              size: 'xlarge'
            },
            children: [{
              id: 'header',
              type: 'DialogHeader',
              attributes: {
                title: 'XLarge Dialog (968px)',
                hasCloseButton: true
              }
            }, {
              id: 'body',
              type: 'DialogBody',
              children: [{
                id: 'body-text',
                type: 'Span',
                state: {
                  text: 'This is an extra large dialog. Use for full page-like content, comprehensive forms, or complex workflows.'
                }
              }]
            }, {
              id: 'footer',
              type: 'DialogFooter',
              attributes: {
                cancelLabel: 'Cancel',
                confirmLabel: 'Submit'
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
## XLarge Size (968px)

The largest dialog size. Best for:
- Full page-like content
- Comprehensive forms
- Complex workflows
        \`
      }
    }
  }
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ConfirmDialog trigger={<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
          Default Confirm
        </button>} title="Confirm Action" size="small" appearance="default" confirmLabel="Confirm" cancelLabel="Cancel" onConfirm={() => alert('Confirmed!')}>
      <p className="text-sm text-gray-600">
        Are you sure you want to proceed with this action?
      </p>
    </ConfirmDialog>,
  parameters: {
    docs: {
      description: {
        story: \`
## Default Appearance

Neutral confirmation dialog. Use for general confirmations that don't have destructive consequences.
        \`
      }
    }
  }
}`,...p.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ConfirmDialog trigger={<button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Item
        </button>} title="Delete Item" description="This action cannot be undone." size="small" appearance="danger" confirmLabel="Delete" cancelLabel="Cancel" onConfirm={() => alert('Deleted!')}>
      <p className="text-sm text-gray-600">
        Are you sure you want to delete this item? All associated data will be permanently removed.
      </p>
    </ConfirmDialog>,
  parameters: {
    docs: {
      description: {
        story: \`
## Danger Appearance

Red-themed confirmation dialog. Use for destructive actions like:
- Delete operations
- Permanent removals
- Irreversible changes
        \`
      }
    }
  }
}`,...g.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <ConfirmDialog trigger={<button className="px-4 py-2 bg-yellow-500 text-black rounded hover:bg-yellow-600">
          Proceed with Caution
        </button>} title="Warning" description="This may have unintended consequences." size="small" appearance="warning" confirmLabel="Proceed" cancelLabel="Cancel" onConfirm={() => alert('Proceeded!')}>
      <p className="text-sm text-gray-600">
        This action may affect other parts of the system. Please review before proceeding.
      </p>
    </ConfirmDialog>,
  parameters: {
    docs: {
      description: {
        story: \`
## Warning Appearance

Yellow-themed confirmation dialog. Use for actions that need attention:
- Potential side effects
- Important changes
- Actions requiring review
        \`
      }
    }
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'dialog-form',
        type: 'Dialog',
        state: {
          open: false
        },
        children: [{
          id: 'trigger',
          type: 'DialogTrigger',
          children: [{
            id: 'btn',
            type: 'Button',
            state: {
              appearance: 'primary'
            },
            children: [{
              id: 'text',
              type: 'Span',
              state: {
                text: 'Edit Profile'
              }
            }]
          }]
        }, {
          id: 'portal',
          type: 'DialogPortal',
          children: [{
            id: 'content',
            type: 'DialogContent',
            attributes: {
              size: 'medium'
            },
            children: [{
              id: 'header',
              type: 'DialogHeader',
              attributes: {
                title: 'Edit Profile',
                hasCloseButton: true
              }
            }, {
              id: 'body',
              type: 'DialogBody',
              children: [{
                id: 'form-container',
                type: 'Div',
                attributes: {
                  className: 'space-y-4'
                },
                children: [{
                  id: 'name-field',
                  type: 'TextField',
                  state: {
                    label: 'Name',
                    placeholder: 'Enter your name'
                  }
                }, {
                  id: 'email-field',
                  type: 'TextField',
                  state: {
                    label: 'Email',
                    placeholder: 'Enter your email',
                    type: 'email'
                  }
                }]
              }]
            }, {
              id: 'footer',
              type: 'DialogFooter',
              attributes: {
                cancelLabel: 'Cancel',
                confirmLabel: 'Save Changes'
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
## Dialog with Form

A practical example showing a dialog with form fields inside. This pattern is common for:
- Edit forms
- Settings dialogs
- User profile updates
        \`
      }
    }
  }
}`,...u.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    const document: SduiLayoutDocument = {
      version: '1.0.0',
      root: {
        id: 'root',
        type: 'Div',
        attributes: {
          className: 'flex gap-4'
        },
        children: [{
          id: 'dialog-save',
          type: 'Dialog',
          state: {
            open: false
          },
          children: [{
            id: 'trigger-save',
            type: 'DialogTrigger',
            children: [{
              id: 'btn-save',
              type: 'Button',
              state: {
                appearance: 'primary'
              },
              children: [{
                id: 'text-save',
                type: 'Span',
                state: {
                  text: 'Save Draft'
                }
              }]
            }]
          }, {
            id: 'portal-save',
            type: 'DialogPortal',
            children: [{
              id: 'content-save',
              type: 'DialogContent',
              attributes: {
                size: 'small'
              },
              children: [{
                id: 'header-save',
                type: 'DialogHeader',
                attributes: {
                  title: 'Save Draft?',
                  hasCloseButton: true
                }
              }, {
                id: 'body-save',
                type: 'DialogBody',
                children: [{
                  id: 'body-text-save',
                  type: 'Span',
                  state: {
                    text: 'Your changes will be saved as a draft. You can continue editing later.'
                  }
                }]
              }, {
                id: 'footer-save',
                type: 'DialogFooter',
                attributes: {
                  cancelLabel: 'Discard',
                  confirmLabel: 'Save Draft'
                }
              }]
            }]
          }]
        }, {
          id: 'dialog-delete',
          type: 'Dialog',
          state: {
            open: false
          },
          children: [{
            id: 'trigger-delete',
            type: 'DialogTrigger',
            children: [{
              id: 'btn-delete',
              type: 'Button',
              state: {
                appearance: 'danger'
              },
              children: [{
                id: 'text-delete',
                type: 'Span',
                state: {
                  text: 'Delete'
                }
              }]
            }]
          }, {
            id: 'portal-delete',
            type: 'DialogPortal',
            children: [{
              id: 'content-delete',
              type: 'DialogContent',
              attributes: {
                size: 'small'
              },
              children: [{
                id: 'header-delete',
                type: 'DialogHeader',
                attributes: {
                  title: 'Delete Item?',
                  hasCloseButton: true
                }
              }, {
                id: 'body-delete',
                type: 'DialogBody',
                children: [{
                  id: 'body-text-delete',
                  type: 'Span',
                  state: {
                    text: 'This action cannot be undone. Are you sure you want to delete this item?'
                  }
                }]
              }, {
                id: 'footer-delete',
                type: 'DialogFooter',
                attributes: {
                  cancelLabel: 'Cancel',
                  confirmLabel: 'Delete',
                  appearance: 'danger'
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
## Confirmation Pattern

Multiple confirmation dialogs showing different use cases:
- **Save Draft**: Default appearance for neutral actions
- **Delete**: Danger appearance for destructive actions
        \`
      }
    }
  }
}`,...y.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Dialog.Root>
      <Dialog.Trigger>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Open Compound Dialog
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay />
        <Dialog.Content size="medium">
          <Dialog.Header>
            <div className="flex-1">
              <Dialog.Title>Compound Pattern</Dialog.Title>
              <Dialog.Description>
                This dialog uses the compound component pattern for maximum flexibility.
              </Dialog.Description>
            </div>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <p className="text-sm text-gray-600 mb-4">
              The compound pattern gives you full control over the dialog structure.
              You can customize each part independently.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Dialog.Root - Context provider</li>
              <li>Dialog.Trigger - Opens the dialog</li>
              <li>Dialog.Portal - Renders in portal</li>
              <li>Dialog.Overlay - Background blanket</li>
              <li>Dialog.Content - Main container</li>
              <li>Dialog.Header - Title area</li>
              <li>Dialog.Body - Content area</li>
              <li>Dialog.Footer - Action buttons</li>
            </ul>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.Close asChild>
              <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">
                Cancel
              </button>
            </Dialog.Close>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Got it!
            </button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>,
  parameters: {
    docs: {
      description: {
        story: \`
## Compound Component Pattern

This example demonstrates the full compound component pattern, giving you maximum control over the dialog structure.

Each sub-component can be styled and positioned independently.
        \`
      }
    }
  }
}`,...h.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-wrap gap-4">
      <SimpleDialog trigger={<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Small (400px)
          </button>} title="Small Dialog" size="small">
        <p className="text-sm text-gray-600">This is a small dialog.</p>
      </SimpleDialog>

      <SimpleDialog trigger={<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Medium (600px)
          </button>} title="Medium Dialog" size="medium">
        <p className="text-sm text-gray-600">This is a medium dialog.</p>
      </SimpleDialog>

      <SimpleDialog trigger={<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            Large (800px)
          </button>} title="Large Dialog" size="large">
        <p className="text-sm text-gray-600">This is a large dialog.</p>
      </SimpleDialog>

      <SimpleDialog trigger={<button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
            XLarge (968px)
          </button>} title="XLarge Dialog" size="xlarge">
        <p className="text-sm text-gray-600">This is an extra large dialog.</p>
      </SimpleDialog>
    </div>,
  parameters: {
    docs: {
      description: {
        story: \`
## All Sizes Comparison

Quick comparison of all available dialog sizes. Click each button to see the different widths.
        \`
      }
    }
  }
}`,...x.parameters?.docs?.source}}};const T=["Playground","SizeSmall","SizeMedium","SizeLarge","SizeXLarge","AppearanceDefault","AppearanceDanger","AppearanceWarning","WithFormContent","ConfirmationPattern","CompoundPatternExample","AllSizes"];export{x as AllSizes,g as AppearanceDanger,p as AppearanceDefault,m as AppearanceWarning,h as CompoundPatternExample,y as ConfirmationPattern,r as Playground,d as SizeLarge,s as SizeMedium,l as SizeSmall,c as SizeXLarge,u as WithFormContent,T as __namedExportsOrder,z as default};
