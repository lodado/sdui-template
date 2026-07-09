import{j as e}from"./jsx-runtime-DiXa-lBB.js";import{S as p}from"./marked.esm-lzu47DTe.js";import{c as o}from"./block-CtGQPaNA.js";import{r as h}from"./iframe-CZ4IIPOh.js";import{g as c,S as g,j as b}from"./SduiDocumentEditor-CgjqnSTA.js";import{S as v}from"./SduiDocumentViewer-CT1d38gr.js";import{b as x}from"./SduiLayoutRenderer-gV_C9lT7.js";import{s as u}from"./sduiComponents-C8SbbWzc.js";import"./schemas-Cci_sPZ2.js";import"./preload-helper-ggYluGXI.js";import"./apply-BaHQGFVK.js";import"./generate-CBS9Nabc.js";import"./index-BaxEpJ4J.js";import"./index-_HwedgUL.js";import"./index-USHisANu.js";import"./documentHistory-DN5HMk3K.js";import"./index-DkykxaJC.js";const C=()=>{const{store:t}=x();return h.useSyncExternalStore(r=>t.subscribeVersion(r),()=>t.state.variables,()=>t.state.variables)},l=t=>C()[t],Y={title:"Document/SDUI Layout Block",parameters:{layout:"padded",docs:{description:{component:"The `document.sdui` block embeds a server-defined SDUI layout document inside a text document — the hybrid direction: notion-like blocks and `SduiLayoutRenderer` widgets in one page. The host controls what may render via `SduiComponentsProvider` (no provider → placeholder, same blocked-by-default posture as iframe embeds)."}}},tags:["autodocs"],excludeStories:["hybridContent"]},S={version:"1.0",root:{id:"promo-card",type:"Card",attributes:{className:"shadow-md"},children:[{id:"promo-title",type:"Text",state:{text:"Server-driven widget"}},{id:"promo-body",type:"Text",state:{text:"This card is an SDUI layout document rendered inside a document block."}},{id:"promo-cta",type:"Button",state:{text:"Server-defined CTA"}}]}},m={schemaVersion:"1.0",root:o({id:"root",type:"document.root",children:[o({id:"h",type:"document.heading",state:{text:"Hybrid document"},attributes:{level:1}}),o({id:"p1",type:"document.paragraph",state:{text:"Everything above and below is a normal editable block. The card in the middle is server-driven UI."}}),o({id:"widget",type:p,attributes:{document:S}}),o({id:"p2",type:"document.paragraph",state:{text:"Text after the widget."}})]})},d={render:()=>e.jsx(c,{value:u,children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(g,{content:m,onContentChange:()=>{}})})})},s={render:()=>e.jsx(c,{value:u,children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(v,{content:m})})})},a={render:()=>e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(v,{content:m})})};function k(t){return(t.root.children??[]).filter(r=>r.attributes?.checked===!0).length}const f=()=>{const t=l("doc.checkedCount"),r=l("doc.checklistTotal");return e.jsxs("div",{style:{padding:16,borderRadius:12,background:"#eef2ff",fontWeight:600},children:["Progress (server-driven widget): ",t??0," / ",r??0," done"]})},w={...u,Progress:()=>e.jsx(f,{})},P={schemaVersion:"1.0",root:o({id:"root",type:"document.root",children:[o({id:"h",type:"document.heading",state:{text:"Checklist with live widget"},attributes:{level:2}}),o({id:"t1",type:"document.checklist",state:{text:"Write the doc"},attributes:{checked:!0}}),o({id:"t2",type:"document.checklist",state:{text:"Review it"},attributes:{checked:!1}}),o({id:"t3",type:"document.checklist",state:{text:"Ship it"},attributes:{checked:!1}}),o({id:"progress",type:p,attributes:{document:{version:"1.0",root:{id:"progress-root",type:"Progress"}}}})]})},n={render:()=>{const[t,r]=h.useState(P);return e.jsx(c,{value:w,children:e.jsx(b,{value:i=>({"doc.checkedCount":k(i),"doc.checklistTotal":(i.root.children??[]).filter(y=>y.type==="document.checklist").length}),children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(g,{content:t,onContentChange:i=>r(i)})})})})}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <SduiComponentsProvider value={sduiComponents}>
      <div style={{
      maxWidth: 760,
      margin: '0 auto'
    }}>
        <SduiDocumentEditor content={hybridContent} onContentChange={() => {}} />
      </div>
    </SduiComponentsProvider>
}`,...d.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <SduiComponentsProvider value={sduiComponents}>
      <div style={{
      maxWidth: 760,
      margin: '0 auto'
    }}>
        <SduiDocumentViewer content={hybridContent} />
      </div>
    </SduiComponentsProvider>
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 760,
    margin: '0 auto'
  }}>
      <SduiDocumentViewer content={hybridContent} />
    </div>
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [content, setContent] = useState(bridgeContent);
    return <SduiComponentsProvider value={bridgeComponents}>
        <SduiDocumentBridgeProvider value={doc => ({
        'doc.checkedCount': countChecked(doc),
        'doc.checklistTotal': (doc.root.children ?? []).filter(child => child.type === 'document.checklist').length
      })}>
          <div style={{
          maxWidth: 760,
          margin: '0 auto'
        }}>
            <SduiDocumentEditor content={content} onContentChange={next => setContent(next)} />
          </div>
        </SduiDocumentBridgeProvider>
      </SduiComponentsProvider>;
  }
}`,...n.parameters?.docs?.source},description:{story:"Toggle the checklists — the embedded widget updates through the document→layout variable bridge.",...n.parameters?.docs?.description}}};const q=["hybridContent","InEditor","InViewer","BlockedWithoutProvider","StateBridge"];export{a as BlockedWithoutProvider,d as InEditor,s as InViewer,n as StateBridge,q as __namedExportsOrder,Y as default,m as hybridContent};
