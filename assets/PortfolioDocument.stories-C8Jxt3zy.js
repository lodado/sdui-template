import{j as e}from"./jsx-runtime-H4OobEdJ.js";import{a as U,T as F,b as z,c as M}from"./marked.esm-OLVWZYWK.js";import{c as Y}from"./block-CtGQPaNA.js";import{i as V,S as C,b as m,t as r,l as d,c as n,d as c}from"./SduiDocumentEditor-Dhci3RLH.js";import{r as g}from"./iframe-DXfu0nKd.js";import{n as u,h as S,c as G,p as a,b as s,d as D,a as E,i as K,r as J,e as H}from"./resume-profile-BbD0pQCq.js";import"./schemas-D-ljss90.js";import"./apply-CXtmqEGE.js";import"./generate-CBS9Nabc.js";import"./index-DRs303X9.js";import"./index-Bqjcu1N1.js";import"./index-DosIFmwh.js";import"./documentHistory-vrpHvdYx.js";import"./SduiLayoutRenderer-Dp_9QutM.js";import"./preload-helper-ggYluGXI.js";function v(t,{id:i,tone:o,icon:b,children:x}={}){return{id:i??u("callout"),type:U,state:typeof t=="string"?{text:t}:V(t),...o||b?{attributes:{...o?{tone:o}:{},...b?{icon:b}:{}}}:{},...x?{children:x}:{}}}function Q(t,{id:i}={}){return{id:i??u("tags"),type:F,attributes:{items:t.map(o=>typeof o=="string"?{id:u("tag"),label:o}:{id:o.id??u("tag"),label:o.label,...o.color?{color:o.color}:{}})}}}function W({id:t}={}){return{id:t??u("toc"),type:z}}const I="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",q="#9065B0",p="#787774",k=t=>S([c(t,q)],2);J();const Z={schemaVersion:"1.0",root:Y({id:"portfolio-root",type:"document.root",children:[S("이충헌 포트폴리오",1),G([E([K({src:H,alt:"이충헌 프로필 사진",width:200})],{ratio:1}),E([a([m("AI Native 프론트엔드 엔지니어")]),a("빠르게 설계하고 안정적으로 구현하며, AI 도구를 팀의 워크플로로 만드는 개발자입니다."),a([r("🏠 Github | "),d("https://github.com/lodado","https://github.com/lodado")]),a([r("💻 Blog | "),d("https://lodado.tistory.com/","https://lodado.tistory.com/")]),a("📌 Email | ycp998@naver.com")],{ratio:2})]),W(),k("Highlights"),v([r("E2E 테스트 "),n("400+"),r(" / 단위 테스트 "),n("400+"),r(" 구축 — 배포 후 프론트엔드 프로덕션 버그 "),n("1개월당 1~2건"),r(" 수준으로 대폭 감소")],{tone:"success",icon:"✅"}),v([r("시리즈 A "),n("120억"),r(" 투자 AI OCR/VLM 스타트업에서 글로벌 AI SaaS 프론트엔드 아키텍처·결제·품질 자동화 담당")],{tone:"info",icon:"🚀"}),v("비정형 N-depth OCR 결과를 Server-Driven UI로 구현 — 노드별 구독으로 대규모 문서에서도 지연 없는 편집 경험",{tone:"tip",icon:"⚡"}),k("Skills"),Q([{label:"Next.js",color:"blue"},{label:"React",color:"blue"},{label:"TypeScript",color:"blue"},{label:"Zustand",color:"green"},{label:"TanStack Query",color:"green"},{label:"Playwright",color:"orange"},{label:"Vitest",color:"orange"},{label:"Storybook",color:"pink"},{label:"Paddle.js",color:"yellow"},{label:"Vercel",color:"gray"},{label:"Sentry",color:"red"}]),k("Work Experience"),S("프론트엔드",3),a([c("Korea Deep Learning Inc. · 정규직",p)]),a([c("2026년 2월 - 현재 · 6개월",p)]),a([r("시리즈 A "),n("120억 원"),r(" 투자를 유치한 AI OCR/VLM 스타트업에서 Next.js 기반 글로벌 AI SaaS의 프론트엔드 아키텍처, 결제, 품질 자동화 및 성능 최적화를 담당하고 있습니다.")]),a([m("AI 기반 개발 워크플로 구축")]),s("Playwright 테스트 명세를 AI Agent가 자율 실행·판정하는 QA 도구를 오픈소스로 개발하고, 사내 테스트 프로세스에 도입해 반복적인 수동 QA 검증을 자동화",{children:[s([r("→ "),d("https://github.com/lodado/playwright-spec-for-AI-Agent","https://github.com/lodado/playwright-spec-for-AI-Agent")])]}),s("디자인 시스템 컴포넌트와 사용 규칙을 AI Agent에 제공하는 Design System MCP를 구축, AI 생성 코드가 사내 컨벤션과 디자인 시스템을 준수하도록 개발 워크플로에 적용"),a([m("품질 자동화")]),s([r("사용자 시나리오와 BVA(경계값 분석) 기반으로 E2E 테스트 "),n("400+"),r(", 단위 테스트 "),n("400+"),r(" 구축 — 배포 후 프론트엔드 프로덕션 버그를 "),n("1개월당 1~2건"),r(" 수준으로 대폭 감소")]),a([m("아키텍처 & 성능")]),s("비정형 N-depth OCR 결과를 재귀적 트리 구조의 Server-Driven UI로 구현",{children:[s([r("→ 템플릿 오픈소스: "),d("https://github.com/lodado/sdui-template","https://github.com/lodado/sdui-template")])]}),s("OCR 데이터를 ID 기반으로 정규화하고 useSyncExternalStore 기반 노드별 구독 구조를 적용, 변경된 컴포넌트만 선택적으로 리렌더링해 대규모 문서에서도 지연 없는 편집 경험 확보"),s([r("코드 스플리팅과 vendor chunk 분리로 초기 JavaScript 번들 "),n("30%"),r(" 감소, 웹폰트 서브셋 적용으로 폰트 리소스 "),n("70%"),r(" 감소")]),a([m("글로벌 결제")]),s("Paddle.js 기반 글로벌 결제 연동 및 구독 플랜별 UI 노출·기능 접근 제어 로직 설계 (State pattern)"),a([c("Next.js · React · TypeScript · Zustand · TanStack Query · Playwright · Vitest · Storybook · Paddle.js · Vercel · Sentry",p)]),D(),S("Frontend Web Developer",3),a([c("티맥스데이터 · 정규직",p)]),a([c("2022년 10월 - 2026년 1월 · 3년 4개월 · 성남시 · 대면근무",p)]),a("제품 전반에서 재사용할 수 있는 사내 디자인 시스템과 DB 모니터링 플랫폼의 프론트엔드 아키텍처를 설계하고 구축했습니다."),a([m("사내 디자인 시스템 구축")]),s("디자인 시스템을 제안하고 아키텍처 설계부터 컴포넌트 개발·배포 체계 구축까지 주도"),s("Turborepo, Changesets, Rollup 기반 ESM 모노레포 및 패키지 버전 관리 구조 설계"),s("Storybook 기반 컴포넌트 문서화 및 UI 개발 협업 표준 정립"),s("Jest, React Testing Library, GitLab Runner 기반 컴포넌트 테스트·배포 CI/CD 구축"),s("가상화 기반 렌더링을 적용한 공통 대용량 Table 컴포넌트 설계"),s("Radix UI 기반 Compound Component Pattern을 적용해 확장 가능한 컴포넌트 API 구현"),a([c("React.js · JavaScript · HTML 외 보유기술 +4개",p)]),D(),a([r("📌 "),d("ycp998@naver.com","mailto:ycp998@naver.com"),r("  ·  "),d("github.com/lodado","https://github.com/lodado"),r("  ·  "),d("lodado.tistory.com","https://lodado.tistory.com/")])]})},P=t=>({...t,...t.type===M&&t.attributes?.collapsed===!0?{attributes:{...t.attributes,collapsed:!1}}:{},...t.children?{children:t.children.map(P)}:{}}),X=t=>({...t,root:P(t.root)}),Ae={title:"Document/Examples/Portfolio (포트폴리오)",component:C,parameters:{layout:"padded",docs:{description:{component:'A Notion-style portfolio authored with the `@lodado/sdui-document` builders — `toc`/`callout`/`tags`/`toggle`/`bookmark` on top of the résumé block set. The "PDF 저장" button expands all toggles, switches to a read-only render, and prints to A4 via the browser print pipeline (`@media print` in the editor CSS).'}}},tags:["autodocs"]},$={display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid var(--sdui-doc-divider, #e5e7eb)",position:"sticky",top:0,background:"var(--sdui-doc-background, #fff)",zIndex:10},ee={padding:"2px 8px",borderRadius:999,fontSize:12,fontWeight:600,background:"#efe6f7",color:"#9065B0"},B=`
@media print {
  body { padding: 0 !important; margin: 0 !important; background: #fff !important; }
  .sysmaster-showcase { display: none !important; }
}
`,te="https://silver-blue-23c.notion.site/Sysmaster-DB-8-6af5a3a52a6b42cda8fa227869ac8e1a",N=["드래그 앤 드롭으로 레이아웃을 조정하는 인터랙션과 progress 애니메이션 구현","breakpoint 기반 반응형 대시보드","차트 렌더링 — Chart.js · Recharts · Canvas"],oe=["React","Chart.js","Recharts","Canvas","Server-Driven UI"],re=`
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
`,ae=()=>{const t=g.useRef(null),i=()=>t.current?.showModal();return e.jsxs("section",{className:"sysmaster-showcase","aria-label":"Sysmaster DB 8 데모",children:[e.jsx("style",{children:re}),e.jsxs("article",{className:"sm-card",children:[e.jsxs("button",{type:"button",className:"sm-media",onClick:i,"aria-label":"Sysmaster 데모 크게 보기",children:[e.jsx("img",{src:I,alt:"Sysmaster DB 8 대시보드 데모"}),e.jsx("span",{className:"sm-media__tag",children:"Live Demo"})]}),e.jsxs("div",{className:"sm-body",children:[e.jsx("span",{className:"sm-eyebrow",children:"Featured · Tmax Data"}),e.jsx("h3",{className:"sm-title",children:"Sysmaster DB 8 — 실시간 DB 모니터링"}),e.jsx("p",{className:"sm-lede",children:"Tibero DB 모니터링 프로그램의 실시간 Dashboard를 구현. 모니터링 항목을 drag & drop으로 자유롭게 배치·관제."}),e.jsx("ul",{className:"sm-bullets",children:N.map(o=>e.jsx("li",{children:o},o))}),e.jsx("div",{className:"sm-chips",children:oe.map(o=>e.jsx("span",{className:"sm-chip",children:o},o))}),e.jsx("button",{type:"button",className:"sm-cta",onClick:i,children:"상세 보기 →"})]})]}),e.jsx("dialog",{ref:t,className:"sm-dialog",children:e.jsxs("div",{className:"sm-dialog__inner",children:[e.jsxs("div",{className:"sm-dialog__head",children:[e.jsx("h3",{children:"Sysmaster DB 8"}),e.jsx("button",{type:"button",className:"sm-dialog__close",onClick:()=>t.current?.close(),"aria-label":"닫기",children:"✕"})]}),e.jsx("img",{src:I,alt:"Sysmaster DB 8 대시보드 데모 (확대)"}),e.jsx("p",{style:{margin:"0 0 12px",color:p},children:"Tibero DB 모니터링 프로그램 SysmasterDB8의 실시간 Dashboard·Realtime Monitoring 화면을 구현했습니다. 모니터링 항목을 drag & drop으로 자유롭게 배치하고 관제할 수 있습니다."}),e.jsx("ul",{style:{margin:"0 0 16px",paddingLeft:20,lineHeight:1.7},children:N.map(o=>e.jsx("li",{children:o},o))}),e.jsx("a",{className:"sm-link",href:te,target:"_blank",rel:"noreferrer",children:"Notion에서 전체 보기 →"})]})})]})},L=({editable:t})=>{const i=g.useRef(null),[o,b]=g.useState(Z),[x,R]=g.useState(0),[h,_]=g.useState(null),T=()=>{const l=i.current?.getContent()??o;b(l),_(X(l))},O=()=>{const l=i.current?.getContent()??o,j=new Blob([JSON.stringify(l,null,2)],{type:"application/json"}),f=URL.createObjectURL(j),w=document.createElement("a");w.href=f,w.download="portfolio.json",w.click(),URL.revokeObjectURL(f)};return g.useEffect(()=>{if(!h)return;const l=()=>{_(null),R(f=>f+1)};window.addEventListener("afterprint",l);const j=requestAnimationFrame(()=>{requestAnimationFrame(()=>window.print())});return()=>{cancelAnimationFrame(j),window.removeEventListener("afterprint",l)}},[h]),h?e.jsxs(e.Fragment,{children:[e.jsx("style",{children:B}),e.jsx(C,{content:h,readOnly:!0})]}):e.jsxs("div",{children:[e.jsx("style",{children:B}),e.jsxs("div",{style:$,children:[e.jsx("span",{style:ee,children:t?"편집 모드":"읽기 모드"}),t?e.jsxs(e.Fragment,{children:[e.jsx("button",{type:"button",onClick:()=>i.current?.undo(),children:"Undo"}),e.jsx("button",{type:"button",onClick:()=>i.current?.redo(),children:"Redo"}),e.jsx("button",{type:"button",onClick:()=>R(l=>l+1),children:"Reset"}),e.jsx("button",{type:"button",onClick:O,children:"Export JSON"})]}):null,e.jsx("button",{type:"button",onClick:T,children:"PDF 저장"})]}),e.jsx(C,{content:o,apiRef:i,readOnly:!t},x),e.jsx(ae,{})]})},y={render:()=>e.jsx(L,{editable:!1})},A={render:()=>e.jsx(L,{editable:!0}),parameters:{docs:{description:{story:'편집 가능한 포트폴리오. 텍스트 선택으로 포매팅 툴바, toggle 클릭으로 프로젝트 상세, "PDF 저장"으로 toggle 전체 펼침 + A4 인쇄.'}}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <PortfolioFrame editable={false} />
}`,...y.parameters?.docs?.source}}};A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <PortfolioFrame editable />,
  parameters: {
    docs: {
      description: {
        story: '편집 가능한 포트폴리오. 텍스트 선택으로 포매팅 툴바, toggle 클릭으로 프로젝트 상세, ' + '"PDF 저장"으로 toggle 전체 펼침 + A4 인쇄.'
      }
    }
  }
}`,...A.parameters?.docs?.source}}};const Se=["ReadOnly","Editable"];export{A as Editable,y as ReadOnly,Se as __namedExportsOrder,Ae as default};
