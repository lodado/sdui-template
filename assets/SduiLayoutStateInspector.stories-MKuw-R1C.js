import{j as o}from"./jsx-runtime-DP0j7HmO.js";import"./marked.esm-Ci4fhsQd.js";import{c as r}from"./block-CtGQPaNA.js";import{E as a}from"./EditorWithStateInspector-BHVq-pbv.js";import{S as d}from"./SduiLayoutRenderer-Dbokbnvg.js";import{S as n}from"./SduiLayoutStateInspector-C12lsjr5.js";import{s as i}from"./sduiComponents-DrhERURs.js";import"./iframe-Du9bMobq.js";import"./preload-helper-ggYluGXI.js";import"./schemas-D-ljss90.js";import"./toSduiLayout-ooNGaLo6.js";import"./SduiDocumentEditor-BMtSg7s0.js";import"./apply-CLR2MSiX.js";import"./generate-CBS9Nabc.js";import"./index-Bk5Bz11K.js";import"./index-ri0JM_Kc.js";import"./index-CSUpGdgx.js";import"./documentHistory-2lo5fnId.js";import"./index-Bu-lUwOp.js";const C={title:"Debug/SDUI Layout State Inspector",parameters:{layout:"padded",docs:{description:{component:"Inspect sdui-template internal JSON: denormalized document, normalized nodes map, and store metadata. Use the connected variant inside SduiLayoutRenderer, or pass a layout document directly."}}},tags:["autodocs"]},s={version:"1.0.0",metadata:{id:"inspector-demo",name:"Toggle demo"},root:{id:"root",type:"Div",children:[{id:"toggle-1",type:"Toggle",state:{isChecked:!1,label:"Subscribe to store changes"}},{id:"toggle-2",type:"Toggle",state:{isChecked:!0,label:"Only changed nodes re-render"}}]}},e={name:"Live store (SduiLayoutRenderer)",render:()=>o.jsx("div",{style:{border:"1px solid #e2e8f0",borderRadius:8,padding:16,background:"#fff"},children:o.jsx(d,{document:s,components:i,children:o.jsx(n,{title:"Live SduiLayoutStore",maxHeight:480})})}),parameters:{docs:{description:{story:"Toggle switches mutate SduiLayoutStore. The inspector is rendered as a child of SduiLayoutRenderer (inside SduiLayoutProvider) and updates live when you flip toggles — check the Nodes tab."}}}},c={schemaVersion:"1.0",root:r({id:"document-root",type:"document.root",children:[r({id:"heading-1",type:"document.heading",state:{content:[{type:"text",text:"Edit me — watch layout JSON",marks:[{type:"bold"}]}],text:"Edit me — watch layout JSON"},attributes:{level:1}}),r({id:"paragraph-1",type:"document.paragraph",state:{text:"Type, split blocks with Enter, indent with Tab. The right panel shows domain content and the lowered SDUI layout."}})]})},t={name:"Document editor → layout JSON",render:()=>o.jsx(a,{content:c,title:"Editor → toSduiLayoutDocument"}),parameters:{docs:{description:{story:"When @lodado/sdui-document-react applies patches, the parent tracks SduiDocumentContent and runs toSduiLayoutDocument on each change. The inspector shows what sdui-template would normalize/render."}}}};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
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
