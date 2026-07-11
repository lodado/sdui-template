import{j as e}from"./jsx-runtime-DP0j7HmO.js";import{b as F,c as Y,d as z,D as M,H as K,I as G,e as V,T as H,f as J}from"./marked.esm-Ci4fhsQd.js";import{c as Q}from"./block-CtGQPaNA.js";import{i as R,S as _,d as g,t as a,l as p,e as m,f as b}from"./SduiDocumentEditor-BMtSg7s0.js";import{r as x}from"./iframe-Du9bMobq.js";import"./schemas-D-ljss90.js";import"./apply-CLR2MSiX.js";import"./generate-CBS9Nabc.js";import"./index-Bk5Bz11K.js";import"./index-ri0JM_Kc.js";import"./index-CSUpGdgx.js";import"./documentHistory-2lo5fnId.js";import"./SduiLayoutRenderer-Dbokbnvg.js";import"./preload-helper-ggYluGXI.js";let k=0;function n(t="block"){return k+=1,`${t}-${k}`}function W(){k=0}function i(t,{id:o,align:r,children:l}={}){return{id:o??n("bulleted-list"),type:F,state:typeof t=="string"?{text:t}:R(t),...r?{attributes:{align:r}}:{},...l?{children:l}:{}}}function E(t,{id:o,ratio:r}={}){return{id:o??n("column"),type:Y,...r!==void 0?{attributes:{ratio:r}}:{},children:t}}function q(t,{id:o}={}){return{id:o??n("column-list"),type:z,children:t}}function D({id:t}={}){return{id:t??n("divider"),type:M}}function j(t,o=1,{id:r,align:l}={}){return{id:r??n("heading"),type:K,state:typeof t=="string"?{text:t}:R(t),attributes:{level:o,...l?{align:l}:{}}}}function Z({id:t,src:o,alt:r,width:l,height:f,align:h,caption:c}){return{id:t??n("image"),type:G,...c?{state:{text:c}}:{},attributes:{src:o,alt:r,width:l,...f?{height:f}:{},...h?{align:h}:{}}}}function s(t,{id:o,align:r}={}){return{id:o??n("paragraph"),type:V,state:typeof t=="string"?{text:t}:R(t),...r?{attributes:{align:r}}:{}}}function $(t,{id:o}={}){return{id:o??n("tags"),type:H,attributes:{items:t.map(r=>typeof r=="string"?{id:n("tag"),label:r}:{id:r.id??n("tag"),label:r.label,...r.color?{color:r.color}:{}})}}}const X="/sdui-template/assets/resume-profile-D6fvBr08.jpg",B="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",ee="#9065B0",u="#787774",L=t=>j([m(t,ee)],2);W();const te={schemaVersion:"1.0",root:Q({id:"resume-root",type:"document.root",children:[j("이충헌 포트폴리오",1),q([E([Z({src:X,alt:"이충헌 프로필 사진",width:200})],{ratio:1}),E([s([g("AI Native 프론트엔드 엔지니어")]),s("빠르게 설계하고 안정적으로 구현하며, AI 도구를 팀의 워크플로로 만드는 개발자입니다."),s([a("🏠 Github | "),p("https://github.com/lodado","https://github.com/lodado")]),s([a("💻 Blog | "),p("https://lodado.tistory.com/","https://lodado.tistory.com/")]),s("📌 Email | ycp998@naver.com")],{ratio:2})]),L("Skills"),$([{label:"Next.js",color:"blue"},{label:"React",color:"blue"},{label:"TypeScript",color:"blue"},{label:"Zustand",color:"green"},{label:"TanStack Query",color:"green"},{label:"Playwright",color:"orange"},{label:"Vitest",color:"orange"},{label:"Storybook",color:"pink"},{label:"Paddle.js",color:"yellow"},{label:"Vercel",color:"gray"},{label:"Sentry",color:"red"}]),L("Work Experience"),j("프론트엔드",3),s([m("Korea Deep Learning Inc. · 정규직",u)]),s([m("2026년 2월 - 현재 · 6개월",u)]),s([a("시리즈 A "),b("120억 원"),a(" 투자를 유치한 AI OCR/VLM 스타트업에서 Next.js 기반 글로벌 AI SaaS의 프론트엔드 아키텍처, 결제, 품질 자동화 및 성능 최적화를 담당하고 있습니다.")]),s([g("AI 기반 개발 워크플로 구축")]),i("Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 오픈소스로 개발하고, 사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화",{children:[i([a("→ "),p("https://github.com/lodado/playwright-spec-for-AI-Agent","https://github.com/lodado/playwright-spec-for-AI-Agent")])]}),i("디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 Design System MCP를 구축, AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용"),s([g("품질 자동화")]),i([a("사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 "),b("400+"),a(", 단위 테스트 "),b("400+"),a(" 구축 — 배포 후 프론트엔드 프로덕션 버그를 "),b("1개월당 1~2건"),a(" 수준으로 대폭 감소")]),s([g("아키텍처 & 성능")]),i("비정형 N-depth OCR 결과를 재귀적 트리 구조의 Server-Driven UI로 구현",{children:[i([a("→ 템플릿 오픈소스: "),p("https://github.com/lodado/sdui-template","https://github.com/lodado/sdui-template")])]}),i("OCR 데이터를 ID 기반으로 정규화하고 useSyncExternalStore 기반 노드별 구독 구조를 적용, 변경된 컴포넌트만 선택적으로 리렌더링해 대규모 문서에서도 지연 없는 편집 경험 확보"),i([a("코드 스플리팅과 vendor chunk 분리로 초기 JavaScript 번들 "),b("68%"),a(" 감소, 웹폰트 서브셋 적용으로 폰트 리소스 "),b("70%"),a(" 감소")]),s([g("글로벌 결제")]),i("Paddle.js 기반 글로벌 결제 연동 및 구독 플랜별 UI 노출·기능 접근 제어 로직 설계 (State pattern)"),s([m("Next.js · React · TypeScript · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry",u)]),D(),j("Frontend Web Developer",3),s([m("티맥스데이터 · 정규직",u)]),s([m("2022년 10월 - 2026년 1월 · 3년 4개월 · 성남시 · 대면근무",u)]),s("제품 전반에서 재사용할 수 있는 사내 디자인 시스템과 DB 모니터링 플랫폼의 프론트엔드 아키텍처를 설계하고 구축했습니다."),s([g("사내 디자인 시스템 구축")]),i("디자인 시스템을 제안하고 아키텍처 설계부터 컴포넌트 개발·배포 체계 구축까지 주도"),i("Turborepo, Changesets, Rollup 기반 ESM 모노레포 및 패키지 버전 관리 구조 설계"),i("Storybook 기반 컴포넌트 문서화 및 UI 개발 협업 표준 정립"),i("Jest, React Testing Library, GitLab Runner 기반 컴포넌트 테스트·배포 CI/CD 구축"),i("가상화 기반 렌더링을 적용한 공통 대용량 Table 컴포넌트 설계"),i("Radix UI 기반 Compound Component Pattern을 적용해 확장 가능한 컴포넌트 API 구현"),s([m("React.js · JavaScript · HTML 외 보유기술 +4개",u)]),D(),s([a("📌 "),p("ycp998@naver.com","mailto:ycp998@naver.com"),a("  ·  "),p("github.com/lodado","https://github.com/lodado"),a("  ·  "),p("lodado.tistory.com","https://lodado.tistory.com/")])]})},P=t=>({...t,...t.type===J&&t.attributes?.collapsed===!0?{attributes:{...t.attributes,collapsed:!1}}:{},...t.children?{children:t.children.map(P)}:{}}),re=t=>({...t,root:P(t.root)}),ve={title:"Document/Examples/Resume (포트폴리오)",component:_,parameters:{layout:"padded",docs:{description:{component:'A Notion-style portfolio résumé authored with the `@lodado/sdui-document` builders — `tags`/`toggle`/`bookmark` and related blocks. The "PDF 저장" button expands all toggles, switches to a read-only render, and prints to A4 via the browser print pipeline (`@media print` in the editor CSS).'}}},tags:["autodocs"]},oe={display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid var(--sdui-doc-divider, #e5e7eb)",position:"sticky",top:0,background:"var(--sdui-doc-background, #fff)",zIndex:10},se={padding:"2px 8px",borderRadius:999,fontSize:12,fontWeight:600,background:"#efe6f7",color:"#9065B0"},I=`
@media print {
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
  .sysmaster-showcase { display: none !important; }
}
`,ae="https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a",T=["드래그 앤 드롭으로 레이아웃을 조정하는 인터랙션과 progress 애니메이션 구현","breakpoint 기반 반응형 대시보드","차트 렌더링 — Chart.js · Recharts · Canvas"],ie=["React","Chart.js","Recharts","Canvas","Server-Driven UI"],ne=`
.sm-card {
  --sm-accent: #9065b0;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  gap: 0;
  margin: 28px 0;
  border: 1px solid #ececf1;
  border-radius: 16px;
  overflow: hidden;
  background: #fff;
  box-shadow: 0 1px 2px rgba(16, 15, 24, 0.04), 0 12px 32px -18px rgba(144, 101, 176, 0.35);
}
.sm-media {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  border: none;
  border-right: 1px solid #f0eef5;
  background: radial-gradient(120% 120% at 20% 0%, #201a2b 0%, #0c0a12 100%);
  cursor: zoom-in;
  overflow: hidden;
}
.sm-media img {
  display: block;
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.sm-media:hover img { transform: scale(1.04); }
.sm-media__tag {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #fff;
  background: rgba(12, 10, 18, 0.66);
  backdrop-filter: blur(6px);
}
.sm-media__tag::before {
  content: '';
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
}
.sm-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 22px 24px;
}
.sm-eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--sm-accent);
}
.sm-title { margin: 0; font-size: 19px; font-weight: 700; color: #1c1b22; }
.sm-lede { margin: 0; font-size: 13.5px; line-height: 1.6; color: #6b6875; }
.sm-bullets { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; }
.sm-bullets li {
  position: relative;
  padding-left: 20px;
  font-size: 13.5px;
  line-height: 1.55;
  color: #37343f;
}
.sm-bullets li::before {
  content: '';
  position: absolute;
  left: 2px;
  top: 8px;
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: var(--sm-accent);
}
.sm-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px; }
.sm-chip {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
  color: #6d5389;
  background: #f3edf9;
}
.sm-cta {
  align-self: flex-start;
  margin-top: 6px;
  padding: 9px 16px;
  border: none;
  border-radius: 10px;
  font-size: 13.5px;
  font-weight: 600;
  color: #fff;
  background: var(--sm-accent);
  cursor: pointer;
  transition: filter 0.15s ease, transform 0.15s ease;
}
.sm-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
.sm-dialog {
  border: none;
  border-radius: 16px;
  padding: 0;
  width: min(880px, 92vw);
  max-width: 92vw;
  box-shadow: 0 24px 70px -20px rgba(16, 15, 24, 0.55);
}
.sm-dialog::backdrop { background: rgba(16, 15, 24, 0.55); backdrop-filter: blur(2px); }
.sm-dialog__inner { padding: 22px 24px 26px; }
.sm-dialog__head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sm-dialog__head h3 { margin: 0; font-size: 20px; }
.sm-dialog__close {
  border: none;
  background: #f2f1f5;
  border-radius: 8px;
  width: 30px;
  height: 30px;
  cursor: pointer;
  font-size: 14px;
  color: #6b6875;
}
.sm-dialog__close:hover { background: #e7e5ec; }
.sm-dialog img { display: block; width: 100%; height: auto; border-radius: 10px; margin-bottom: 16px; }
.sm-link { color: var(--sm-accent); font-weight: 600; text-decoration: none; }
.sm-link:hover { text-decoration: underline; }

@media (max-width: 640px) {
  .sm-card { grid-template-columns: 1fr; }
  .sm-media { border-right: none; border-bottom: 1px solid #f0eef5; }
  .sm-media img { min-height: 180px; }
}
@media print { .sysmaster-showcase { display: none !important; } }
`,le=()=>{const t=x.useRef(null),o=()=>t.current?.showModal();return e.jsxs("section",{className:"sysmaster-showcase","aria-label":"Sysmaster DB 8 데모",children:[e.jsx("style",{children:ne}),e.jsxs("article",{className:"sm-card",children:[e.jsxs("button",{type:"button",className:"sm-media",onClick:o,"aria-label":"Sysmaster 데모 크게 보기",children:[e.jsx("img",{src:B,alt:"Sysmaster DB 8 대시보드 데모"}),e.jsx("span",{className:"sm-media__tag",children:"Live Demo"})]}),e.jsxs("div",{className:"sm-body",children:[e.jsx("span",{className:"sm-eyebrow",children:"Featured · Tmax Data"}),e.jsx("h3",{className:"sm-title",children:"Sysmaster DB 8 — 실시간 DB 모니터링"}),e.jsx("p",{className:"sm-lede",children:"Tibero DB 모니터링 프로그램의 실시간 Dashboard를 구현. 모니터링 항목을 drag & drop으로 자유롭게 배치·관제."}),e.jsx("ul",{className:"sm-bullets",children:T.map(r=>e.jsx("li",{children:r},r))}),e.jsx("div",{className:"sm-chips",children:ie.map(r=>e.jsx("span",{className:"sm-chip",children:r},r))}),e.jsx("button",{type:"button",className:"sm-cta",onClick:o,children:"상세 보기 →"})]})]}),e.jsx("dialog",{ref:t,className:"sm-dialog",children:e.jsxs("div",{className:"sm-dialog__inner",children:[e.jsxs("div",{className:"sm-dialog__head",children:[e.jsx("h3",{children:"Sysmaster DB 8"}),e.jsx("button",{type:"button",className:"sm-dialog__close",onClick:()=>t.current?.close(),"aria-label":"닫기",children:"✕"})]}),e.jsx("img",{src:B,alt:"Sysmaster DB 8 대시보드 데모 (확대)"}),e.jsx("p",{style:{margin:"0 0 12px",color:u},children:"Tibero DB 모니터링 프로그램 SysmasterDB8의 실시간 Dashboard·Realtime Monitoring 화면을 구현했습니다. 모니터링 항목을 drag & drop으로 자유롭게 배치하고 관제할 수 있습니다."}),e.jsx("ul",{style:{margin:"0 0 16px",paddingLeft:20,lineHeight:1.7},children:T.map(r=>e.jsx("li",{children:r},r))}),e.jsx("a",{className:"sm-link",href:ae,target:"_blank",rel:"noreferrer",children:"Notion에서 전체 보기 →"})]})})]})},N=({editable:t})=>{const o=x.useRef(null),[r,l]=x.useState(te),[f,h]=x.useState(0),[c,C]=x.useState(null),O=()=>{const d=o.current?.getContent()??r;l(d),C(re(d))},U=()=>{const d=o.current?.getContent()??r,v=new Blob([JSON.stringify(d,null,2)],{type:"application/json"}),y=URL.createObjectURL(v),w=document.createElement("a");w.href=y,w.download="resume.json",w.click(),URL.revokeObjectURL(y)};return x.useEffect(()=>{if(!c)return;const d=()=>{C(null),h(y=>y+1)};window.addEventListener("afterprint",d);const v=requestAnimationFrame(()=>{requestAnimationFrame(()=>window.print())});return()=>{cancelAnimationFrame(v),window.removeEventListener("afterprint",d)}},[c]),c?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:I}),e.jsx(_,{content:c,readOnly:!0})]}):e.jsxs("div",{children:[e.jsx("style",{children:I}),e.jsxs("div",{style:oe,children:[e.jsx("span",{style:se,children:t?"편집 모드":"읽기 모드"}),t?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>o.current?.undo(),children:"Undo"}),e.jsx("button",{type:"button",onClick:()=>o.current?.redo(),children:"Redo"}),e.jsx("button",{type:"button",onClick:()=>h(d=>d+1),children:"Reset"}),e.jsx("button",{type:"button",onClick:U,children:"Export JSON"})]}):null,e.jsx("button",{type:"button",onClick:O,children:"PDF 저장"})]}),e.jsx(_,{content:r,apiRef:o,readOnly:!t},f),e.jsx(le,{})]})},A={render:()=>e.jsx(N,{editable:!1})},S={render:()=>e.jsx(N,{editable:!0}),parameters:{docs:{description:{story:'편집 가능한 포트폴리오. 텍스트 선택으로 포매팅 툴바, toggle 클릭으로 프로젝트 상세, "PDF 저장"으로 toggle 전체 펼침 + A4 인쇄.'}}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <ResumeFrame editable={false} />
}`,...A.parameters?.docs?.source}}};S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  render: () => <ResumeFrame editable />,
  parameters: {
    docs: {
      description: {
        story: '편집 가능한 포트폴리오. 텍스트 선택으로 포매팅 툴바, toggle 클릭으로 프로젝트 상세, ' + '"PDF 저장"으로 toggle 전체 펼침 + A4 인쇄.'
      }
    }
  }
}`,...S.parameters?.docs?.source}}};const we=["ReadOnly","Editable"];export{S as Editable,A as ReadOnly,we as __namedExportsOrder,ve as default};
