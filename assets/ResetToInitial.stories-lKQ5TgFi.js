import{j as t}from"./jsx-runtime-DXp8tebo.js";import{r as c}from"./iframe-bYlks92W.js";import{S as u,s as g,d as m}from"./sduiComponents-BGXf9eNj.js";import"./preload-helper-ggYluGXI.js";import"./index-BW_zSv78.js";import"./index-B-D2papd.js";const v={title:"Example/Reset to Initial",component:u,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

This example demonstrates the **reset to initial document** functionality in SDUI.

### Test Scenario

1. **Initial State**: 3 toggles are displayed
2. **State Changes**: Click each toggle to change its state (ON/OFF)
3. **Document Update**: Click "Add Toggle" to add more toggles
4. **Reset to Initial**: Click "Reset to Initial" to restore the document to its initial state

### Key Features

- ✅ Initial document is automatically saved when first loaded
- ✅ \`resetToInitial()\` method restores the document to its initial state
- ✅ All node states are reset to their initial values
- ✅ Document structure returns to the original layout

### Expected Behavior

- **Initial state**: 3 toggles, all in OFF state
- **After changes**: Toggle states can be changed, toggles can be added
- **After reset**: Document returns to initial state (3 toggles, all OFF)
        `}}}};function d(e){const n=Array.from({length:e},(a,o)=>({id:`toggle-${o+1}`,type:"Toggle",state:{isChecked:!1,label:`Toggle ${o+1}`}}));return{version:"1.0.0",root:{id:"root",type:"Div",state:{},children:[...n,{id:"reset-button-container",type:"Div",attributes:{className:"mt-4 flex justify-center"},children:[{id:"reset-button",type:"ResetButton"}]}]}}}const h=()=>{const e=m(),[n,a]=c.useState(null),o=()=>{try{e.resetToInitial(),a(null),console.log("Reset to initial document successful")}catch(r){const l=r instanceof Error?r.message:"Unknown error";a(l),console.error("Reset to initial failed:",l)}};return t.jsxs("div",{className:"flex flex-col gap-2",children:[t.jsx("button",{onClick:o,className:"px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors",type:"button",children:"Reset to Initial"}),n&&t.jsxs("div",{className:"text-xs text-red-600 bg-red-50 p-2 rounded",children:["Error: ",n]})]})},i={render:()=>{const[e,n]=c.useState(3),[a,o]=c.useState(()=>d(3)),r=()=>{const s=e+1;n(s),o(d(s))},l=()=>{n(3),o(d(3))};return t.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[t.jsxs("div",{className:"flex items-center gap-4",children:[t.jsxs("button",{onClick:r,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",type:"button",children:["Add Toggle (",e," → ",e+1,")"]}),t.jsx("button",{onClick:l,className:"px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors",type:"button",children:"Reset to 3 Toggles"}),t.jsxs("span",{className:"text-sm text-gray-600",children:["Current: ",e," toggles"]})]}),t.jsxs("div",{className:"border border-gray-300 rounded p-4 bg-gray-50",children:[t.jsx("div",{className:"mb-2 text-sm font-semibold text-gray-700",children:"Instructions:"}),t.jsxs("ol",{className:"list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4",children:[t.jsx("li",{children:"Click each toggle to change its ON/OFF state"}),t.jsx("li",{children:'Click the "Add Toggle" button'}),t.jsx("li",{children:t.jsx("strong",{children:'Click "Reset to Initial" (rendered via SDUI) to restore the initial document state'})}),t.jsx("li",{children:"Verify that all toggles return to their initial state (3 toggles, all OFF)"})]}),t.jsx(u,{document:a,components:{...g,ResetButton:h},onLayoutChange:s=>{console.log("Document updated:",s)},onError:s=>{console.error("SDUI Error:",s)}})]}),t.jsxs("div",{className:"text-xs text-gray-500 p-2 bg-gray-100 rounded",children:[t.jsx("strong",{children:"Test Point:"}),' The "Reset to Initial" button uses \\`store.resetToInitial()\\` to restore the document to its initial state. This should reset all toggle states to their initial values (all OFF) and restore the document structure to 3 toggles, regardless of how many toggles were added or what states were changed.']})]})},parameters:{docs:{description:{story:`
## Reset to Initial Document Test

This story demonstrates the \`resetToInitial()\` functionality in SDUI.

### Test Procedure

1. Initially, 3 toggles are displayed (all in OFF state)
2. Click each toggle to change its state (ON/OFF)
3. Click "Add Toggle" to add more toggles to the document
4. Click "Reset to Initial" to restore the document to its initial state
5. **Verify that the document returns to 3 toggles, all in OFF state**

### Expected Results

- ✅ Initial document is automatically saved when first loaded
- ✅ \`resetToInitial()\` restores the document to its initial state
- ✅ All toggle states return to their initial values (all OFF)
- ✅ Document structure returns to the original layout (3 toggles)
- ✅ Store instance is maintained (not recreated)

### Implementation Details

- The initial document is saved automatically when \`updateLayout()\` or \`mergeLayout()\` is first called
- \`resetToInitial()\` internally calls \`updateLayout()\` with the saved initial document
- This ensures that all node states, structure, and variables are restored to their initial values

### Use Cases

- **Undo all changes**: Reset the entire document to its initial state
- **Form reset**: Restore form fields to their initial values
- **Configuration reset**: Restore UI configuration to defaults
        `}}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [toggleCount, setToggleCount] = useState(3);
    const [document, setDocument] = useState<SduiLayoutDocument>(() => createDocument(3));
    const handleAddToggle = () => {
      const newCount = toggleCount + 1;
      setToggleCount(newCount);
      setDocument(createDocument(newCount));
    };
    const handleReset = () => {
      setToggleCount(3);
      setDocument(createDocument(3));
    };
    return <div className="flex flex-col gap-4 p-4">
        <div className="flex items-center gap-4">
          <button onClick={handleAddToggle} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors" type="button">
            Add Toggle ({toggleCount} → {toggleCount + 1})
          </button>
          <button onClick={handleReset} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors" type="button">
            Reset to 3 Toggles
          </button>
          <span className="text-sm text-gray-600">
            Current: {toggleCount} toggles
          </span>
        </div>

        <div className="border border-gray-300 rounded p-4 bg-gray-50">
          <div className="mb-2 text-sm font-semibold text-gray-700">
            Instructions:
          </div>
          <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4">
            <li>Click each toggle to change its ON/OFF state</li>
            <li>Click the "Add Toggle" button</li>
            <li>
              <strong>Click "Reset to Initial" (rendered via SDUI) to restore the initial document state</strong>
            </li>
            <li>Verify that all toggles return to their initial state (3 toggles, all OFF)</li>
          </ol>

          <SduiLayoutRenderer document={document} components={{
          ...sduiComponents,
          ResetButton: ResetButtonFactory
        }} onLayoutChange={doc => {
          console.log('Document updated:', doc);
        }} onError={error => {
          console.error('SDUI Error:', error);
        }} />
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          <strong>Test Point:</strong> The "Reset to Initial" button uses \\\`store.resetToInitial()\\\` to restore
          the document to its initial state. This should reset all toggle states to their initial values
          (all OFF) and restore the document structure to 3 toggles, regardless of how many toggles were added
          or what states were changed.
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Reset to Initial Document Test

This story demonstrates the \\\`resetToInitial()\\\` functionality in SDUI.

### Test Procedure

1. Initially, 3 toggles are displayed (all in OFF state)
2. Click each toggle to change its state (ON/OFF)
3. Click "Add Toggle" to add more toggles to the document
4. Click "Reset to Initial" to restore the document to its initial state
5. **Verify that the document returns to 3 toggles, all in OFF state**

### Expected Results

- ✅ Initial document is automatically saved when first loaded
- ✅ \\\`resetToInitial()\\\` restores the document to its initial state
- ✅ All toggle states return to their initial values (all OFF)
- ✅ Document structure returns to the original layout (3 toggles)
- ✅ Store instance is maintained (not recreated)

### Implementation Details

- The initial document is saved automatically when \\\`updateLayout()\\\` or \\\`mergeLayout()\\\` is first called
- \\\`resetToInitial()\\\` internally calls \\\`updateLayout()\\\` with the saved initial document
- This ensures that all node states, structure, and variables are restored to their initial values

### Use Cases

- **Undo all changes**: Reset the entire document to its initial state
- **Form reset**: Restore form fields to their initial values
- **Configuration reset**: Restore UI configuration to defaults
        \`
      }
    }
  }
}`,...i.parameters?.docs?.source},description:{story:`Reset to Initial Example

Demonstrates the resetToInitial() functionality:
1. Initial document is loaded (3 toggles)
2. User can change toggle states and add more toggles
3. Click "Reset to Initial" to restore the initial document state`,...i.parameters?.docs?.description}}};const I=["ResetToInitialExample"];export{i as ResetToInitialExample,I as __namedExportsOrder,v as default};
