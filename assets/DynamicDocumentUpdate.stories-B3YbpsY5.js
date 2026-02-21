import{j as e}from"./jsx-runtime-slN4ere-.js";import{r as d}from"./iframe-Bf5Fj-MD.js";import{S as c,s as u}from"./sduiComponents-daN0Jbtk.js";import"./preload-helper-ggYluGXI.js";import"./index-nk0-osR5.js";import"./index-BW5zYQhE.js";const v={title:"Example/Dynamic Document Update",component:c,tags:["autodocs"],parameters:{docs:{description:{component:`
## Overview

This example tests the behavior of the SDUI Renderer when **documents are dynamically changed**.

### Test Scenario

1. **Initial State**: 3 toggles are displayed
2. **Button Click**: Clicking the "Add Toggle" button adds one toggle at a time
3. **State Preservation Test**:
   - Click each toggle to change its state (ON/OFF)
   - Click the "Add Toggle" button to update the document
   - **Important**: Verify that existing toggle states are preserved even when the document is updated

### Improvements

- ✅ Store instance is maintained and not recreated
- ✅ Only \`updateLayout\` is called when the document changes
- ✅ Existing subscribers are not disconnected
- ✅ Component state is preserved

### Expected Behavior

- **Existing toggle states (ON/OFF) should be preserved** even when the document is updated
- Only new toggles should be added, existing toggles should not be affected
        `}}}};function a(t){const r=Array.from({length:t},(i,s)=>({id:`toggle-${s+1}`,type:"Toggle",state:{isChecked:!1,label:`Toggle ${s+1}`}}));return{version:"1.0.0",root:{id:"root",type:"Div",state:{},children:r}}}const o={render:()=>{const[t,r]=d.useState(3),[i,s]=d.useState(()=>a(3)),l=()=>{const n=t+1;r(n),s(a(n))},g=()=>{r(3),s(a(3))};return e.jsxs("div",{className:"flex flex-col gap-4 p-4",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsxs("button",{onClick:l,className:"px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors",type:"button",children:["Add Toggle (",t," → ",t+1,")"]}),e.jsx("button",{onClick:g,className:"px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors",type:"button",children:"Reset to 3 Toggles"}),e.jsxs("span",{className:"text-sm text-gray-600",children:["Current: ",t," toggles"]})]}),e.jsxs("div",{className:"border border-gray-300 rounded p-4 bg-gray-50",children:[e.jsx("div",{className:"mb-2 text-sm font-semibold text-gray-700",children:"Instructions:"}),e.jsxs("ol",{className:"list-decimal list-inside text-sm text-gray-600 space-y-1 mb-4",children:[e.jsx("li",{children:"Click each toggle to change its ON/OFF state"}),e.jsx("li",{children:'Click the "Add Toggle" button'}),e.jsx("li",{children:e.jsx("strong",{children:"Verify that existing toggle states are preserved"})}),e.jsx("li",{children:"Newly added toggles start in the OFF state"})]}),e.jsx(c,{document:i,components:u,onLayoutChange:n=>{console.log("Document updated:",n)},onError:n=>{console.error("SDUI Error:",n)}})]}),e.jsxs("div",{className:"text-xs text-gray-500 p-2 bg-gray-100 rounded",children:[e.jsx("strong",{children:"Test Point:"})," Even when the document is updated, existing toggle states (ON/OFF) should be preserved and not reset. If states are reset, it means the store is being recreated."]})]})},parameters:{docs:{description:{story:`
## Dynamic Document Update Test

This story tests the behavior of the SDUI Renderer when **documents are dynamically changed**.

### Test Procedure

1. Initially, 3 toggles are displayed
2. Click each toggle to change its state (ON/OFF)
3. Click the "Add Toggle" button to add a toggle
4. **Verify that existing toggle states are preserved**

### Expected Results

- ✅ Existing toggle states (ON/OFF) are preserved
- ✅ Only new toggles are added
- ✅ Store instance is not recreated
- ✅ Subscriber connections are not broken

### Previous Issues

In the previous implementation, whenever the \`document\` changed:
- ❌ Store instance was recreated
- ❌ Existing subscribers were disconnected
- ❌ Component state was reset

### After Improvement

In the current implementation:
- ✅ Store instance is maintained
- ✅ \`useEffect\` detects \`document\` changes and only calls \`updateLayout\`
- ✅ Existing state is preserved
        `}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
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
              <strong>Verify that existing toggle states are preserved</strong>
            </li>
            <li>Newly added toggles start in the OFF state</li>
          </ol>

          <SduiLayoutRenderer document={document} components={sduiComponents} onLayoutChange={doc => {
          console.log('Document updated:', doc);
        }} onError={error => {
          console.error('SDUI Error:', error);
        }} />
        </div>

        <div className="text-xs text-gray-500 p-2 bg-gray-100 rounded">
          <strong>Test Point:</strong> Even when the document is updated, existing toggle states (ON/OFF) should
          be preserved and not reset. If states are reset, it means the store is being recreated.
        </div>
      </div>;
  },
  parameters: {
    docs: {
      description: {
        story: \`
## Dynamic Document Update Test

This story tests the behavior of the SDUI Renderer when **documents are dynamically changed**.

### Test Procedure

1. Initially, 3 toggles are displayed
2. Click each toggle to change its state (ON/OFF)
3. Click the "Add Toggle" button to add a toggle
4. **Verify that existing toggle states are preserved**

### Expected Results

- ✅ Existing toggle states (ON/OFF) are preserved
- ✅ Only new toggles are added
- ✅ Store instance is not recreated
- ✅ Subscriber connections are not broken

### Previous Issues

In the previous implementation, whenever the \\\`document\\\` changed:
- ❌ Store instance was recreated
- ❌ Existing subscribers were disconnected
- ❌ Component state was reset

### After Improvement

In the current implementation:
- ✅ Store instance is maintained
- ✅ \\\`useEffect\\\` detects \\\`document\\\` changes and only calls \\\`updateLayout\\\`
- ✅ Existing state is preserved
        \`
      }
    }
  }
}`,...o.parameters?.docs?.source},description:{story:`Dynamic Document Update Example

Each time the button is clicked, one toggle is added.
Tests whether existing toggle states are preserved when the document is updated.`,...o.parameters?.docs?.description}}};const C=["DynamicToggleAddition"];export{o as DynamicToggleAddition,C as __namedExportsOrder,v as default};
