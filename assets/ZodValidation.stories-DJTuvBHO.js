import{j as e}from"./jsx-runtime-CZLhImQn.js";import{g as t}from"./FeatureTable-MTQZOPns.js";import"./iframe-B8KYAuVr.js";import"./preload-helper-ggYluGXI.js";const l={title:"Document/Deep Dive/20 · Zod 검증",parameters:{layout:"fullscreen",docs:{description:{component:"구독 시 schema를 넘겨 노드 상태를 Zod로 검증하고, 성공 시 반환 state 타입을 스키마로 좁히는 경계 안전 지점."}}}},s=[{num:"01",title:"스키마 정의",body:e.jsxs(e.Fragment,{children:["노드 상태의 모양을 ",e.jsx("code",{children:"z.object"})," 로 선언합니다. 이 스키마가 곧 신뢰의 계약이 됩니다."]})},{num:"02",title:"구독 시 검증",body:e.jsxs(e.Fragment,{children:[e.jsx("code",{children:"useSduiNodeSubscription"})," 에 ",e.jsx("code",{children:"schema"})," 를 넘기면 구독하면서 동시에 ",e.jsx("code",{children:"safeParse"})," ","로 검증합니다. 유효하지 않으면 throw 합니다."]})},{num:"03",title:"타입 좁힘",body:e.jsxs(e.Fragment,{children:["검증에 성공하면 반환 ",e.jsx("code",{children:"state"})," 타입이 ",e.jsx("code",{children:"z.infer"})," 로 스키마까지 좁혀집니다."]}),wide:!0}],d=`import { z } from 'zod'

const toggleStateSchema = z.object({
  isChecked: z.boolean(),
  label: z.string(),
})

// 구독하면서 동시에 검증 — 실패 시 throw, 성공 시 타입이 스키마로 좁혀짐
const { state } = useSduiNodeSubscription({
  nodeId: 'toggle-1',
  schema: toggleStateSchema,
})
state.isChecked // boolean 으로 타입 추론`,r={accent:"renderer",kicker:"Deep Dive · @lodado/sdui-template",title:"Zod 검증 · 경계에서 안전하게",lead:"구독 시 schema를 넘기면 노드 상태를 Zod로 검증하고 성공 시 반환 state 타입이 스키마로 좁혀집니다. 서버가 내려준 신뢰할 수 없는 JSON을 시스템 경계에서 안전하게 다루는 지점입니다.",pills:["zod","safeParse","z.infer","schema on subscribe"],steps:s,stepsIntro:"스키마를 한 번 정의하면, 구독하는 순간 검증과 타입 좁힘이 함께 따라옵니다.",sections:[{index:"20.1",label:"Validation",title:"구독하며 검증",blocks:[{kind:"prose",body:e.jsxs(e.Fragment,{children:["구독 시 ",e.jsx("code",{children:"schema"})," 를 넘기면 노드 상태를 Zod로 검증하고, 성공 시 반환 ",e.jsx("code",{children:"state"})," 타입이 스키마로 좁혀집니다. 서버가 내려준 신뢰할 수 없는 JSON을 시스템 경계에서 안전하게 다루는 지점입니다."]})},{kind:"code",file:"react-wrapper/hooks/useSduiNodeSubscription.ts",code:d},{kind:"badges",items:["SduiLayoutDocument","SduiLayoutNode","z.infer<TSchema>","safeParse","throw on invalid"]}]}]},o={name:"Zod 검증",render:()=>e.jsx(t,{config:r})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Zod 검증',
  render: () => <DeepDiveTemplate config={config} />
}`,...o.parameters?.docs?.source}}};const m=["ZodValidation"];export{o as ZodValidation,m as __namedExportsOrder,l as default};
