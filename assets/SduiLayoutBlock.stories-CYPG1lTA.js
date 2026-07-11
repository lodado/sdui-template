import{j as e}from"./jsx-runtime-H4OobEdJ.js";import{r as l}from"./iframe-DXfu0nKd.js";import{h as a,s as g}from"./nestedDragContent-T--pAmPO.js";import"./marked.esm-OLVWZYWK.js";import{j as c,S as p,k as S}from"./SduiDocumentEditor-Dhci3RLH.js";import{S as h}from"./SduiDocumentViewer-CQjYoekc.js";import{b as C}from"./SduiLayoutRenderer-Dp_9QutM.js";import{s as u}from"./sduiComponents-DcbSAUiM.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-gPleAzvH.js";import"./schemas-D-ljss90.js";import"./apply-CXtmqEGE.js";import"./generate-CBS9Nabc.js";import"./index-DRs303X9.js";import"./index-Bqjcu1N1.js";import"./index-DosIFmwh.js";import"./documentHistory-vrpHvdYx.js";import"./index-Df7Wmu72.js";const x=()=>{const{store:t}=C();return l.useSyncExternalStore(n=>t.subscribeVersion(n),()=>t.state.variables,()=>t.state.variables)},m=t=>x()[t],A={title:"Document/Hybrid/SDUI Layout Block",parameters:{layout:"padded",docs:{description:{component:"The `document.sdui` block embeds a server-defined SDUI layout document inside a text document — the hybrid direction: notion-like blocks and `SduiLayoutRenderer` widgets in one page. The host controls what may render via `SduiComponentsProvider` (no provider → placeholder, same blocked-by-default posture as iframe embeds)."}}},tags:["autodocs"]},r={render:()=>e.jsx(c,{value:u,children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(p,{content:a,onContentChange:()=>{}})})})},i={render:()=>e.jsx(c,{value:u,children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(h,{content:a})})})},d={render:()=>e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(h,{content:a})})};function b(t){return(t.root.children??[]).filter(n=>n.attributes?.checked===!0).length}const y=()=>{const t=m("doc.checkedCount"),n=m("doc.checklistTotal");return e.jsxs("div",{style:{padding:16,borderRadius:12,background:"#eef2ff",fontWeight:600},children:["Progress (server-driven widget): ",t??0," / ",n??0," done"]})},k={...u,Progress:()=>e.jsx(y,{})},s={render:()=>{const[t,n]=l.useState(g);return e.jsx(c,{value:k,children:e.jsx(S,{value:o=>({"doc.checkedCount":b(o),"doc.checklistTotal":(o.root.children??[]).filter(v=>v.type==="document.checklist").length}),children:e.jsx("div",{style:{maxWidth:760,margin:"0 auto"},children:e.jsx(p,{content:t,onContentChange:o=>n(o)})})})})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <SduiComponentsProvider value={sduiComponents}>
      <div style={{
      maxWidth: 760,
      margin: '0 auto'
    }}>
        <SduiDocumentEditor content={hybridSduiContent} onContentChange={() => {}} />
      </div>
    </SduiComponentsProvider>
}`,...r.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <SduiComponentsProvider value={sduiComponents}>
      <div style={{
      maxWidth: 760,
      margin: '0 auto'
    }}>
        <SduiDocumentViewer content={hybridSduiContent} />
      </div>
    </SduiComponentsProvider>
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 760,
    margin: '0 auto'
  }}>
      <SduiDocumentViewer content={hybridSduiContent} />
    </div>
}`,...d.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [content, setContent] = useState(stateBridgeContent);
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
}`,...s.parameters?.docs?.source}}};const F=["InEditor","InViewer","BlockedWithoutProvider","StateBridge"];export{d as BlockedWithoutProvider,r as InEditor,i as InViewer,s as StateBridge,F as __namedExportsOrder,A as default};
