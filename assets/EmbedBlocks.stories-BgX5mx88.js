import{j as e}from"./jsx-runtime-mA-n-d6H.js";import{B as i,V as n,E as s}from"./marked.esm-CEb0ui0X.js";import{c as l}from"./block-CtGQPaNA.js";import{a as r,S as a}from"./SduiDocumentEditor-DoX-MrUG.js";import"./iframe-CBmONYCU.js";import"./preload-helper-ggYluGXI.js";import"./schemas-BKIZ752n.js";import"./apply-vgUm-Yiu.js";import"./generate-CBS9Nabc.js";import"./index-CynUYlTt.js";import"./index-dCEBnlvI.js";import"./index-DP-BN3tX.js";import"./index-CcR-zJDu.js";import"./documentHistory-CAg6iL5B.js";const B={title:"Document/Embed Blocks",parameters:{layout:"padded",docs:{description:{component:"Embed-family blocks (plan-03): `bookmark` (unfurl card, metadata persisted at edit time), `video` (YouTube/Vimeo facade — thumbnail first, iframe on click), and `embed` (generic iframe gated by a host allowlist; disallowed hosts render a fallback card)."}}},tags:["autodocs"]},d={schemaVersion:"1.0",root:l({id:"root",type:"document.root",children:[{id:"h1",type:"document.heading",state:{text:"Bookmark"},attributes:{level:3}},{id:"bm",type:i,attributes:{url:"https://github.com/lodado/sdui-template",title:"@lodado/sdui-template",description:"Server-Driven UI template library for React with subscription-based rendering.",faviconUrl:"https://github.com/favicon.ico"}},{id:"h2",type:"document.heading",state:{text:"Video"},attributes:{level:3}},{id:"vid",type:n,attributes:{url:"https://youtu.be/dQw4w9WgXcQ",provider:"youtube",videoId:"dQw4w9WgXcQ",aspectRatio:"16:9"}},{id:"h3",type:"document.heading",state:{text:"Embed (allowlisted)"},attributes:{level:3}},{id:"emb",type:s,attributes:{url:"https://codepen.io/team/codepen/embed/PNaGbb",height:320}}]})},t={render:()=>e.jsx(r,{value:{allowedHosts:["codepen.io","codesandbox.io"]},children:e.jsx("div",{style:{maxWidth:720,margin:"0 auto"},children:e.jsx(a,{content:d,readOnly:!0})})})},o={render:()=>e.jsx(r,{value:{allowedHosts:[]},children:e.jsx("div",{style:{maxWidth:720,margin:"0 auto"},children:e.jsx(a,{content:d,readOnly:!0})})}),parameters:{docs:{description:{story:"With an empty allowlist the embed falls back to a link card — the document data never forces an iframe."}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <SduiEmbedConfigProvider value={{
    allowedHosts: ['codepen.io', 'codesandbox.io']
  }}>
      <div style={{
      maxWidth: 720,
      margin: '0 auto'
    }}>
        <SduiDocumentEditor content={content} readOnly />
      </div>
    </SduiEmbedConfigProvider>
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <SduiEmbedConfigProvider value={{
    allowedHosts: []
  }}>
      <div style={{
      maxWidth: 720,
      margin: '0 auto'
    }}>
        <SduiDocumentEditor content={content} readOnly />
      </div>
    </SduiEmbedConfigProvider>,
  parameters: {
    docs: {
      description: {
        story: 'With an empty allowlist the embed falls back to a link card — the document data never forces an iframe.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};const S=["AllThree","EmbedBlockedByAllowlist"];export{t as AllThree,o as EmbedBlockedByAllowlist,S as __namedExportsOrder,B as default};
