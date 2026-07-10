import{j as e}from"./jsx-runtime-Dyb75U6t.js";import{g as r}from"./FeatureTable-DJZJkgHx.js";import"./iframe-dH36H_jw.js";import"./preload-helper-ggYluGXI.js";const a={title:"Document/Deep Dive/24 · 폼 검증",parameters:{layout:"fullscreen",docs:{description:{component:"서버가 내려준 폼 구조에 코드로 등록한 zod 스키마를 이름으로 연결해 제출 시 검증하는 방법."}}}},s=[{num:"01",title:"스키마 등록",body:e.jsxs(e.Fragment,{children:[e.jsx("code",{children:"registerSchemas"})," 로 폼 ID별 zod 스키마를 코드에서 미리 등록합니다."]})},{num:"02",title:"Form이 이름으로 조회",body:e.jsxs(e.Fragment,{children:["문서의 ",e.jsx("code",{children:"Form"})," 노드가 ",e.jsx("code",{children:"schemaName"})," 으로 등록된 스키마를 찾아냅니다."]})},{num:"03",title:"제출 시 검증",body:e.jsxs(e.Fragment,{children:[e.jsx("code",{children:"react-hook-form"})," 이 zod resolver로 제출 시점에 값을 검증합니다."]})}],t=`import { sduiComponents, registerSchemas } from '@lodado/sdui-template-component'
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
<SduiLayoutRenderer document={doc} components={sduiComponents} />`,m={accent:"components",kicker:"Deep Dive · @lodado/sdui-template-component",title:"폼 검증 · zod 스키마 등록",lead:"서버가 폼 구조를 JSON으로 내려도 검증 규칙은 코드에 있어야 안전합니다. registerSchemas로 폼 ID별 zod 스키마를 등록해 두면, 문서의 Form 노드가 이름으로 스키마를 찾아 제출 시 검증합니다.",pills:["registerSchemas","zod","react-hook-form","schema by name"],steps:s,sections:[{index:"24.1",label:"Forms",title:"zod 스키마를 이름으로",blocks:[{kind:"prose",body:e.jsxs(e.Fragment,{children:["서버가 폼 구조를 JSON으로 내려도 검증 규칙은 코드에 있어야 안전합니다. ",e.jsx("code",{children:"registerSchemas"})," 로 폼 ID별 zod 스키마를 등록해 두면, 문서의 ",e.jsx("code",{children:"Form"})," 노드가 이름으로 스키마를 찾아 제출 시 검증합니다."]})},{kind:"code",file:"features/form/types.ts",code:t},{kind:"badges",items:["registerSchemas","registerSchema","getSchema","react-hook-form","zod resolver"]}]}]},o={name:"폼 검증",render:()=>e.jsx(r,{config:m})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: '폼 검증',
  render: () => <DeepDiveTemplate config={config} />
}`,...o.parameters?.docs?.source}}};const l=["FormValidation"];export{o as FormValidation,l as __namedExportsOrder,a as default};
