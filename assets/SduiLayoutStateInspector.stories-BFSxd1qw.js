import{j as o}from"./jsx-runtime-mA-n-d6H.js";import"./marked.esm-CEb0ui0X.js";import{c as r}from"./block-CtGQPaNA.js";import{E as a}from"./EditorWithStateInspector-BLEOy-QV.js";import{S as d}from"./SduiLayoutRenderer-Dnhr9FUr.js";import{S as i}from"./SduiLayoutStateInspector-CLherFMb.js";import{s as n}from"./sduiComponents-Bh5wK3mF.js";import"./iframe-CBmONYCU.js";import"./preload-helper-ggYluGXI.js";import"./schemas-BKIZ752n.js";import"./toSduiLayout-DQvzG4Yh.js";import"./SduiDocumentEditor-DoX-MrUG.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./index-CynUYlTt.js";import"./index-dCEBnlvI.js";import"./index-DP-BN3tX.js";import"./index-CcR-zJDu.js";import"./documentHistory-CAg6iL5B.js";import"./index-CDV7cqJ4.js";import"./Button-DwzDj1Tt.js";const N={title:"Debug/SDUI Layout State Inspector",parameters:{layout:"padded",docs:{description:{component:"Inspect sdui-template internal JSON: denormalized document, normalized nodes map, and store metadata. Use the connected variant inside SduiLayoutRenderer, or pass a layout document directly."}}},tags:["autodocs"]},s={version:"1.0.0",metadata:{id:"inspector-demo",name:"Toggle demo"},root:{id:"root",type:"Div",children:[{id:"toggle-1",type:"Toggle",state:{isChecked:!1,label:"Subscribe to store changes"}},{id:"toggle-2",type:"Toggle",state:{isChecked:!0,label:"Only changed nodes re-render"}}]}},e={name:"Live store (SduiLayoutRenderer)",render:()=>o.jsx("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:16,background:"#fff"},children:o.jsx(d,{document:s,components:n,children:o.jsx(i,{title:"Live SduiLayoutStore",maxHeight:480})})}),parameters:{docs:{description:{story:"Toggle switches mutate SduiLayoutStore. The inspector is rendered as a child of SduiLayoutRenderer (inside SduiLayoutProvider) and updates live when you flip toggles — check the Nodes tab."}}}},c={schemaVersion:"1.0",root:r({id:"document-root",type:"document.root",children:[r({id:"heading-1",type:"document.heading",state:{content:[{type:"text",text:"Edit me — watch layout JSON",marks:[{type:"bold"}]}],text:"Edit me — watch layout JSON"},attributes:{level:1}}),r({id:"paragraph-1",type:"document.paragraph",state:{text:"Type, split blocks with Enter, indent with Tab. The right panel shows domain content and the lowered SDUI layout."}})]})},t={name:"Document editor → layout JSON",render:()=>o.jsx(a,{content:c,title:"Editor → toSduiLayoutDocument"}),parameters:{docs:{description:{story:"When @lodado/sdui-document-react applies patches, the parent tracks SduiDocumentContent and runs toSduiLayoutDocument on each change. The inspector shows what sdui-template would normalize/render."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: 'Live store (SduiLayoutRenderer)',
  render: () => <div style={{
    border: '1px solid #e2e8f0',
    borderRadius: 8,
    padding: 16,
    background: '#fff'
  }}>
      <SduiLayoutRenderer document={toggleDocument} components={sduiComponents}>
        <SduiLayoutStateInspector title="Live SduiLayoutStore" maxHeight={480} />
      </SduiLayoutRenderer>
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Toggle switches mutate SduiLayoutStore. The inspector is rendered as a child of SduiLayoutRenderer ' + '(inside SduiLayoutProvider) and updates live when you flip toggles — check the Nodes tab.'
      }
    }
  }
}`,...e.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: 'Document editor → layout JSON',
  render: () => <EditorWithStateInspector content={sampleContent} title="Editor → toSduiLayoutDocument" />,
  parameters: {
    docs: {
      description: {
        story: 'When @lodado/sdui-document-react applies patches, the parent tracks SduiDocumentContent and runs ' + 'toSduiLayoutDocument on each change. The inspector shows what sdui-template would normalize/render.'
      }
    }
  }
}`,...t.parameters?.docs?.source}}};const O=["ConnectedToRenderer","DocumentReactEditFlow"];export{e as ConnectedToRenderer,t as DocumentReactEditFlow,O as __namedExportsOrder,N as default};
