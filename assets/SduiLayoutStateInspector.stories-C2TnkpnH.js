import{j as o}from"./jsx-runtime-kN5q7ta_.js";import"./marked.esm-CEb0ui0X.js";import{c as r}from"./block-CtGQPaNA.js";import{E as a}from"./EditorWithStateInspector-tnEOjtfA.js";import{S as d}from"./SduiLayoutRenderer-BIgj9fpk.js";import{S as n}from"./SduiLayoutStateInspector-HSdn9hhu.js";import{s as i}from"./sduiComponents-D7qirgaL.js";import"./iframe-5GmD24nK.js";import"./preload-helper-ggYluGXI.js";import"./schemas-BKIZ752n.js";import"./toSduiLayout-DQvzG4Yh.js";import"./SduiDocumentEditor-KJa1TNIW.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./index-DDZoHRzQ.js";import"./index-DMGz4e4h.js";import"./index-CPc4hXF3.js";import"./documentHistory-CAg6iL5B.js";import"./index-BjY1jkyd.js";const C={title:"Debug/SDUI Layout State Inspector",parameters:{layout:"padded",docs:{description:{component:"Inspect sdui-template internal JSON: denormalized document, normalized nodes map, and store metadata. Use the connected variant inside SduiLayoutRenderer, or pass a layout document directly."}}},tags:["autodocs"]},s={version:"1.0.0",metadata:{id:"inspector-demo",name:"Toggle demo"},root:{id:"root",type:"Div",children:[{id:"toggle-1",type:"Toggle",state:{isChecked:!1,label:"Subscribe to store changes"}},{id:"toggle-2",type:"Toggle",state:{isChecked:!0,label:"Only changed nodes re-render"}}]}},e={name:"Live store (SduiLayoutRenderer)",render:()=>o.jsx("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:16,background:"#fff"},children:o.jsx(d,{document:s,components:i,children:o.jsx(n,{title:"Live SduiLayoutStore",maxHeight:480})})}),parameters:{docs:{description:{story:"Toggle switches mutate SduiLayoutStore. The inspector is rendered as a child of SduiLayoutRenderer (inside SduiLayoutProvider) and updates live when you flip toggles — check the Nodes tab."}}}},c={schemaVersion:"1.0",root:r({id:"document-root",type:"document.root",children:[r({id:"heading-1",type:"document.heading",state:{content:[{type:"text",text:"Edit me — watch layout JSON",marks:[{type:"bold"}]}],text:"Edit me — watch layout JSON"},attributes:{level:1}}),r({id:"paragraph-1",type:"document.paragraph",state:{text:"Type, split blocks with Enter, indent with Tab. The right panel shows domain content and the lowered SDUI layout."}})]})},t={name:"Document editor → layout JSON",render:()=>o.jsx(a,{content:c,title:"Editor → toSduiLayoutDocument"}),parameters:{docs:{description:{story:"When @lodado/sdui-document-react applies patches, the parent tracks SduiDocumentContent and runs toSduiLayoutDocument on each change. The inspector shows what sdui-template would normalize/render."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};const I=["ConnectedToRenderer","DocumentReactEditFlow"];export{e as ConnectedToRenderer,t as DocumentReactEditFlow,I as __namedExportsOrder,C as default};
