import{j as s}from"./jsx-runtime-BP7xIkdw.js";import{D as n,A as i,c,f as l,g as u}from"./nestedDragContent-r1slj9Ca.js";import{r as a,c as p}from"./autosaveMachine-DLDeSOo8.js";import"./marked.esm-CEb0ui0X.js";import{S as m}from"./SduiLayoutRenderer-D4uP9wK8.js";import"./iframe-B-YFzlFs.js";import"./preload-helper-ggYluGXI.js";import"./block-CtGQPaNA.js";import"./toSduiLayout-DQvzG4Yh.js";import"./sduiComponents-AfZPlDts.js";import"./index-BLadDp_R.js";import"./index-CE-KBjR2.js";import"./index-C0iLGTBD.js";import"./index-B9vkfQXZ.js";import"./schemas-BKIZ752n.js";function d(e){const t=a(p(),{type:"local.change",patchCount:2});return e==="dirty"?t:e==="saving"?a(t,{type:"save.request"}):e==="failed"?a(a(t,{type:"save.request"}),{type:"save.failure",error:"network_error"}):e==="offline"?a(t,{type:"network.offline"}):a(a(t,{type:"save.request"}),{type:"save.success",acknowledgedVersion:1})}const x={title:"Document/Adapter",component:m,parameters:{layout:"fullscreen",docs:{description:{component:"Block documents lowered to `SduiLayoutDocument` and rendered through @lodado/sdui-template — no MobX or ProseMirror. Use the controls to explore permission badges and autosave state machine output. For interactive policy details see **Document/Deep Dive/07 · 권한 정책**; for autosave transitions see **06 · Autosave 상태 머신**."}}},tags:["autodocs"]},v={admin:"Admin can perform privileged document actions.",editor:"Editor can apply block patches and save draft changes.",viewer:"Viewer is read-only and should not see edit controls."},f={admin:"Admin access",editor:"Editor access",viewer:"Viewer access"},o={name:"Lifecycle & Permissions",args:{actorRole:"editor",autosaveStatus:"dirty"},argTypes:{actorRole:{control:"select",options:["admin","editor","viewer"],description:"Workspace/collection role — drives `canPerformDocumentAction` badges."},autosaveStatus:{control:"select",options:["dirty","saving","failed","offline","saved"],description:"Reduced autosave state machine output shown in the header badge."}},render:({actorRole:e,autosaveStatus:t})=>s.jsx(n,{title:f[e],subtitle:v[e],content:c,actor:i[e],autosave:d(t)}),parameters:{docs:{description:{story:"Interactive preview of actor role × autosave status. Replaces the previous separate stories for read-only knowledge base, editable draft, saving/failure grids, and the three-column permission matrix."}}}},r={name:"Content Variations",render:()=>s.jsxs("div",{className:"grid min-h-screen gap-8 bg-slate-100 p-6",children:[s.jsx(n,{title:"Nested blocks and document links",subtitle:"Nested semantic blocks are lowered to generic SDUI nodes by the layout adapter.",content:l,actor:i.admin,autosave:d("saved")}),s.jsx(n,{title:"Media and attachment contract",subtitle:"Object storage is represented as document metadata and linked adapter contracts, not direct renderer logic.",content:u,actor:i.editor,autosave:d("offline")})]}),parameters:{docs:{description:{story:"Adapter lowering for nested trees, cross-document links, and media/file metadata — the renderer never talks to object storage directly."}}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: 'Lifecycle & Permissions',
  args: {
    actorRole: 'editor',
    autosaveStatus: 'dirty'
  },
  argTypes: {
    actorRole: {
      control: 'select',
      options: ['admin', 'editor', 'viewer'] satisfies ActorRole[],
      description: 'Workspace/collection role — drives \`canPerformDocumentAction\` badges.'
    },
    autosaveStatus: {
      control: 'select',
      options: ['dirty', 'saving', 'failed', 'offline', 'saved'] satisfies AutosaveStatus[],
      description: 'Reduced autosave state machine output shown in the header badge.'
    }
  },
  render: ({
    actorRole,
    autosaveStatus
  }) => <DocumentPreview title={LIFECYCLE_TITLES[actorRole]} subtitle={LIFECYCLE_SUBTITLES[actorRole]} content={adapterBaseContent} actor={ACTORS[actorRole]} autosave={buildAutosaveState(autosaveStatus)} />,
  parameters: {
    docs: {
      description: {
        story: 'Interactive preview of actor role × autosave status. Replaces the previous separate stories for ' + 'read-only knowledge base, editable draft, saving/failure grids, and the three-column permission matrix.'
      }
    }
  }
}`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: 'Content Variations',
  render: () => <div className="grid min-h-screen gap-8 bg-slate-100 p-6">
      <DocumentPreview title="Nested blocks and document links" subtitle="Nested semantic blocks are lowered to generic SDUI nodes by the layout adapter." content={adapterNestedContent} actor={ACTORS.admin} autosave={buildAutosaveState('saved')} />
      <DocumentPreview title="Media and attachment contract" subtitle="Object storage is represented as document metadata and linked adapter contracts, not direct renderer logic." content={adapterMediaContent} actor={ACTORS.editor} autosave={buildAutosaveState('offline')} />
    </div>,
  parameters: {
    docs: {
      description: {
        story: 'Adapter lowering for nested trees, cross-document links, and media/file metadata — ' + 'the renderer never talks to object storage directly.'
      }
    }
  }
}`,...r.parameters?.docs?.source}}};const P=["LifecycleAndPermissions","ContentVariations"];export{r as ContentVariations,o as LifecycleAndPermissions,P as __namedExportsOrder,x as default};
