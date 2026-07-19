import{j as e}from"./jsx-runtime-mA-n-d6H.js";import"./marked.esm-CEb0ui0X.js";import{o as a,S as d}from"./SduiDocumentEditor-DoX-MrUG.js";import{r as s}from"./iframe-CBmONYCU.js";const c=`# 마크다운 임포트

일반 문단과 **굵게**, \`인라인 코드\` 를 지원합니다.

- [ ] 체크리스트 항목
- [x] 완료된 항목

> 인용문은 callout 블록으로 변환됩니다.

![캡션](https://picsum.photos/seed/md/480/180)
`,i=()=>{const[o,n]=s.useState(c),t=s.useMemo(()=>{try{return{content:a(o)}}catch(r){return{error:r instanceof Error?r.message:"파싱 실패"}}},[o]);return e.jsxs(e.Fragment,{children:[e.jsx("div",{children:e.jsxs("label",{htmlFor:"markdown-import-source",style:{fontSize:12,fontWeight:600,color:"var(--doc-text-subtle)"},children:["Markdown 입력",e.jsx("textarea",{id:"markdown-import-source",className:"sdui-doc__textarea",value:o,spellCheck:!1,onChange:r=>n(r.target.value),style:{marginTop:6}})]})}),e.jsxs("div",{children:[e.jsx("span",{style:{fontSize:12,fontWeight:600,color:"var(--doc-text-subtle)"},children:"변환된 문서"}),e.jsx("div",{style:{marginTop:6,padding:12,borderRadius:8,border:"1px solid var(--doc-border)",background:"var(--doc-surface-raised)",minHeight:150},children:t.content?e.jsx(d,{content:t.content,readOnly:!0}):e.jsx("span",{style:{color:"var(--color-text-danger, #c9372c)",fontSize:13},children:t.error})})]})]})};i.__docgenInfo={description:`markdownToSduiDocumentContent runs the marked lexer and maps tokens onto the
document schema — headings, paragraphs, task lists, blockquotes→callouts,
images. The parsed tree is rendered read-only by the same editor.`,methods:[],displayName:"MarkdownImportDemo"};export{i as M};
