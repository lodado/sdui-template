import{j as e}from"./jsx-runtime-Dyb75U6t.js";import{D as p,a as c,b as t,P as o,f as n,d,B as s,C as l}from"./FeatureTable-DJZJkgHx.js";import{S as m}from"./SduiLayoutRenderer-CxGdvl22.js";import{s as u}from"./sduiComponents-CR7Pjv35.js";import"./iframe-dH36H_jw.js";import"./preload-helper-ggYluGXI.js";import"./index-uELlQkdg.js";import"./index-Beeh_KMy.js";import"./index-Bi-4VgrH.js";import"./index-BYtP4k2R.js";import"./schemas-D-ljss90.js";const P={title:"Document/Architecture/6. sdui-template-component (Library)",parameters:{layout:"fullscreen",docs:{description:{component:"SDUI 렌더러에 꽂아 쓰는 Radix 기반 컴포넌트 라이브러리 @lodado/sdui-template-component — 통합 레지스트리, 컴파운드 컴포넌트, 폼 검증, Canvas3D 렌더 전략 주입."}}}},a=({document:i})=>e.jsx(m,{document:i,components:u}),D={version:"1.0.0",metadata:{id:"basics",name:"Basics"},root:{id:"root",type:"Div",state:{style:{display:"flex",gap:12,alignItems:"center",flexWrap:"wrap"}},children:[{id:"btn-primary",type:"Button",state:{appearance:"primary"},children:[{id:"btn-primary-t",type:"Span",state:{text:"Primary"}}]},{id:"btn-subtle",type:"Button",state:{appearance:"subtle"},children:[{id:"btn-subtle-t",type:"Span",state:{text:"Subtle"}}]},{id:"badge-1",type:"Badge",state:{label:8,appearance:"default"}},{id:"toggle-1",type:"Toggle",state:{isChecked:!0,label:"알림"}}]}},h={version:"1.0.0",metadata:{id:"dropdown",name:"Dropdown compound"},root:{id:"dropdown-root",type:"Dropdown",state:{selectedId:"1",open:!1},children:[{id:"dd-trigger",type:"DropdownTrigger",children:[{id:"dd-btn",type:"Button",state:{appearance:"default"},children:[{id:"dd-value",type:"DropdownValue",state:{placeholder:"옵션 선택",options:[{id:"1",label:"Option 1"},{id:"2",label:"Option 2"},{id:"3",label:"Option 3"}]}}]}]},{id:"dd-content",type:"DropdownContent",state:{side:"bottom",sideOffset:4},children:[{id:"dd-item-1",type:"DropdownItem",state:{value:"1",label:"Option 1"}},{id:"dd-item-2",type:"DropdownItem",state:{value:"2",label:"Option 2"}},{id:"dd-item-3",type:"DropdownItem",state:{value:"3",label:"Option 3"}}]}]}},x=`import { sduiComponents, createSduiComponents } from '@lodado/sdui-template-component'

// 기본 맵 — 타입 문자열 → 팩토리. 그대로 렌더러에 주입.
<SduiLayoutRenderer document={doc} components={sduiComponents} />

// 커스터마이즈가 필요하면 팩토리로 생성해 주입점을 넘김.
const components = createSduiComponents({ canvas3DRenderStrategy })
<SduiLayoutRenderer document={doc} components={components} />`,y=`// 컴파운드 컴포넌트는 "여러 SDUI 타입"으로 분해됩니다.
// Dropdown / DropdownTrigger / DropdownContent / DropdownItem / DropdownValue
{
  type: 'Dropdown', state: { selectedId: '1', open: false },
  children: [
    { type: 'DropdownTrigger', children: [{ type: 'Button', children: [{ type: 'DropdownValue', state: { options } }] }] },
    { type: 'DropdownContent', children: [
      { type: 'DropdownItem', state: { value: '1', label: 'Option 1' } },
    ]},
  ],
}
// 부모 타입이 상태를 소유하고, 자식 타입은 context로 소비 — 트리 그대로가 곧 컴파운드 구조.`,g=`import { sduiComponents, registerSchemas } from '@lodado/sdui-template-component'
import { z } from 'zod'

// 폼 ID별 zod 스키마를 미리 등록.
registerSchemas({
  loginForm: z.object({
    email: z.string().email(),
    password: z.string().min(8),
  }),
})

// 문서에서 Form 이 schema 이름으로 스키마를 찾아 제출 시 검증.
// { type: 'Form', state: { schemaName: 'loginForm' }, children: [ TextField…, Button ] }
<SduiLayoutRenderer document={doc} components={sduiComponents} />`,C=`import { createSduiComponents } from '@lodado/sdui-template-component'
import { myRenderStrategy } from './my-canvas3d-renderers'

// Canvas3D 는 기본 렌더 전략이 없습니다(무거운 3D 의존성을 코어에서 분리).
// 소비자가 전략을 주입해야 실제로 그려집니다.
const components = createSduiComponents({ canvas3DRenderStrategy: myRenderStrategy })
// { type: 'Canvas3D', children: [{ type: 'Canvas3DCollection', children: [{ type: 'Canvas3DItem' }] }] }`,j=()=>e.jsxs(p,{accent:"components",children:[e.jsx(c,{kicker:"Package · @lodado/sdui-template-component",title:"렌더러에 꽂는 Radix 기반 컴포넌트 세트",lead:"sdui-template 이 '어떻게 그릴지'라면, 이 패키지는 '무엇을 그릴지'입니다. Button·Dialog·Dropdown·Form 등 40여 개 타입을 하나의 맵으로 제공해 SduiLayoutRenderer 에 그대로 주입합니다.",pills:["sduiComponents","createSduiComponents","compound","registerSchemas","Radix UI","Canvas3D"]}),e.jsxs(t,{index:"6.1",label:"Registry",title:"통합 레지스트리 · 한 맵으로 주입",children:[e.jsx(o,{children:e.jsxs("p",{children:[e.jsx("code",{children:"sduiComponents"})," 는 타입 문자열을 ",e.jsx("code",{children:"ComponentFactory"})," 로 잇는 하나의 맵입니다. 렌더러의"," ",e.jsx("code",{children:"components"})," 로 넘기면 끝. 주입점(예: Canvas3D 렌더 전략)이 필요하면"," ",e.jsx("code",{children:"createSduiComponents(options)"})," 로 맵을 만들어 넘깁니다."]})}),e.jsx(n,{file:"app/sduiComponents.tsx",code:x}),e.jsx(d,{title:"Basic components",hint:"모두 같은 sduiComponents 맵으로 렌더",children:e.jsx(a,{document:D})})]}),e.jsxs(t,{index:"6.2",label:"Compound",title:"컴파운드 컴포넌트 · 타입으로 분해",children:[e.jsx(o,{children:e.jsxs("p",{children:["Dialog·Dropdown·Popover 같은 복합 위젯은 ",e.jsx("strong",{children:"여러 SDUI 타입의 트리"}),"로 표현됩니다. 부모 타입이 열림/선택 상태를 소유하고 자식 타입은 context로 소비하므로, JSON 트리 구조가 그대로 컴파운드 구조가 됩니다."]})}),e.jsx(n,{file:"shared/ui/dropdown/*",code:y}),e.jsx(d,{title:"Dropdown compound",hint:"트리거를 눌러 열기 — 상태는 Dropdown 노드가 소유",children:e.jsx(a,{document:h})}),e.jsx(s,{items:["Dialog · Trigger · Portal · Content · Header · Body · Footer","Dropdown · Trigger · Content · Item · Value","Popover · Trigger · Content · Close"]})]}),e.jsxs(t,{index:"6.3",label:"Forms",title:"폼 검증 · zod 스키마 등록",children:[e.jsx(o,{children:e.jsxs("p",{children:["서버가 폼 구조를 JSON으로 내려도 검증 규칙은 코드에 있어야 안전합니다. ",e.jsx("code",{children:"registerSchemas"})," 로 폼 ID별 zod 스키마를 등록해 두면, 문서의 ",e.jsx("code",{children:"Form"})," 노드가 이름으로 스키마를 찾아 제출 시 검증합니다."]})}),e.jsx(n,{file:"features/form/types.ts",code:g}),e.jsx(s,{items:["registerSchemas","registerSchema","getSchema","react-hook-form","zod resolver"]})]}),e.jsxs(t,{index:"6.4",label:"Injection",title:"Canvas3D · 렌더 전략 주입",children:[e.jsx(o,{children:e.jsxs("p",{children:["무거운 3D 의존성을 코어에 넣지 않기 위해 ",e.jsx("code",{children:"Canvas3D"})," 는 ",e.jsx("strong",{children:"기본 렌더 전략이 없습니다"}),". 소비자가 ",e.jsxs("code",{children:["createSduiComponents(","{ canvas3DRenderStrategy }",")"]})," 로 전략을 주입해야 실제로 그려집니다 — 의존성 역전으로 번들과 관심사를 분리하는 패턴."]})}),e.jsx(n,{file:"shared/ui/canvas-3d/*",code:C}),e.jsxs(l,{icon:"◆",children:[e.jsx("strong",{children:"왜 주입인가:"}),' Three.js 같은 라이브러리를 라이브러리 코어가 강제로 끌고 오면 3D를 안 쓰는 앱까지 번들이 커집니다. 전략 주입으로 "쓰는 사람만" 비용을 냅니다.']})]})]}),r={name:"sdui-template-component (Library)",render:()=>e.jsx(j,{})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'sdui-template-component (Library)',
  render: () => <LibraryPage />
}`,...r.parameters?.docs?.source}}};const T=["Library"];export{r as Library,T as __namedExportsOrder,P as default};
