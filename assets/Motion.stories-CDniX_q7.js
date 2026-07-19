import{j as e}from"./jsx-runtime-C8ciXbTX.js";import{r as c}from"./iframe-BRtNCAqL.js";import{B as o}from"./Button-BtIotH1t.js";import"./preload-helper-ggYluGXI.js";import"./index-CRYuw-kS.js";const j={title:"Foundations/Motion",parameters:{docs:{description:{component:"Duration/easing tokens and keyframes that drive every micro-interaction. Enter uses ease-out, exit uses ease-in and runs faster. Reduce-motion users get instant state changes."}}}},p=[["--motion-duration-fast","100ms","hover/press feedback, small-surface exit"],["--motion-duration-medium","150ms","small-surface enter, large exit"],["--motion-duration-slow","250ms","large-surface enter (dialog)"]],m=[["--motion-ease-out","cubic-bezier(0.2, 0, 0, 1)","decelerate — enter"],["--motion-ease-in","cubic-bezier(0.4, 0, 1, 1)","accelerate — exit"],["--motion-ease-in-out","cubic-bezier(0.4, 0, 0.2, 1)","color/state transition"],["--motion-ease-spring","cubic-bezier(0.16, 1, 0.3, 1)","overshoot — thumb, check pop"]],u=["sdui-fade-in","sdui-pop-in","sdui-pop-out","sdui-dialog-in","sdui-check-pop","sdui-error-in"],s={padding:"8px 12px",borderBottom:"1px solid #e5e7eb",textAlign:"left"},a={fontFamily:"monospace",fontSize:13},i={render:()=>e.jsxs("div",{style:{display:"grid",gap:32,maxWidth:720},children:[e.jsxs("section",{children:[e.jsx("h3",{children:"Durations"}),e.jsx("table",{style:{borderCollapse:"collapse",width:"100%"},children:e.jsx("tbody",{children:p.map(([t,r,n])=>e.jsxs("tr",{children:[e.jsx("td",{style:{...s,...a},children:t}),e.jsx("td",{style:{...s,...a},children:r}),e.jsx("td",{style:s,children:n})]},t))})})]}),e.jsxs("section",{children:[e.jsx("h3",{children:"Easings"}),e.jsx("table",{style:{borderCollapse:"collapse",width:"100%"},children:e.jsx("tbody",{children:m.map(([t,r,n])=>e.jsxs("tr",{children:[e.jsx("td",{style:{...s,...a},children:t}),e.jsx("td",{style:{...s,...a},children:r}),e.jsx("td",{style:s,children:n})]},t))})})]}),e.jsxs("p",{style:{color:"#626f86",fontSize:14},children:["Under ",e.jsx("code",{children:"prefers-reduced-motion: reduce"})," the three duration tokens become 0ms, so animations complete instantly while state changes still apply."]})]})},d={render:()=>{const[t,r]=c.useState(0);return e.jsxs("div",{style:{display:"grid",gap:24,maxWidth:720},children:[e.jsx("button",{type:"button",onClick:()=>r(n=>n+1),style:{justifySelf:"start",padding:"6px 12px",border:"1px solid #b7b9be",borderRadius:4},children:"Replay"}),e.jsx("div",{style:{display:"flex",flexWrap:"wrap",gap:16},children:u.map(n=>e.jsxs("div",{style:{display:"grid",gap:8,justifyItems:"center"},children:[e.jsx("div",{style:{width:64,height:64,borderRadius:8,background:"var(--color-background-brand-bold, #1868db)",animation:`${n} var(--motion-duration-slow) var(--motion-ease-out)`}}),e.jsx("span",{style:a,children:n})]},`${n}-${t}`))})]})}},l={render:()=>e.jsxs("div",{style:{display:"flex",gap:12},children:[e.jsx(o,{appearance:"primary",children:"Press me"}),e.jsx(o,{appearance:"subtle",children:"Press me"}),e.jsx(o,{appearance:"primary",isLoading:!0,children:"Loading"}),e.jsx(o,{appearance:"primary",isDisabled:!0,children:"Disabled"})]})};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'grid',
    gap: 32,
    maxWidth: 720
  }}>
      <section>
        <h3>Durations</h3>
        <table style={{
        borderCollapse: 'collapse',
        width: '100%'
      }}>
          <tbody>
            {DURATIONS.map(([token, value, use]) => <tr key={token}>
                <td style={{
              ...cell,
              ...mono
            }}>{token}</td>
                <td style={{
              ...cell,
              ...mono
            }}>{value}</td>
                <td style={cell}>{use}</td>
              </tr>)}
          </tbody>
        </table>
      </section>
      <section>
        <h3>Easings</h3>
        <table style={{
        borderCollapse: 'collapse',
        width: '100%'
      }}>
          <tbody>
            {EASINGS.map(([token, value, use]) => <tr key={token}>
                <td style={{
              ...cell,
              ...mono
            }}>{token}</td>
                <td style={{
              ...cell,
              ...mono
            }}>{value}</td>
                <td style={cell}>{use}</td>
              </tr>)}
          </tbody>
        </table>
      </section>
      <p style={{
      color: '#626f86',
      fontSize: 14
    }}>
        Under <code>prefers-reduced-motion: reduce</code> the three duration tokens become 0ms, so animations complete
        instantly while state changes still apply.
      </p>
    </div>
}`,...i.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => {
    const [replay, setReplay] = useState(0);
    return <div style={{
      display: 'grid',
      gap: 24,
      maxWidth: 720
    }}>
        <button type="button" onClick={() => setReplay(n => n + 1)} style={{
        justifySelf: 'start',
        padding: '6px 12px',
        border: '1px solid #b7b9be',
        borderRadius: 4
      }}>
          Replay
        </button>
        <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 16
      }}>
          {KEYFRAMES.map(name => <div key={\`\${name}-\${replay}\`} style={{
          display: 'grid',
          gap: 8,
          justifyItems: 'center'
        }}>
              <div style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            background: 'var(--color-background-brand-bold, #1868db)',
            animation: \`\${name} var(--motion-duration-slow) var(--motion-ease-out)\`
          }} />
              <span style={mono}>{name}</span>
            </div>)}
        </div>
      </div>;
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 12
  }}>
      <Button appearance="primary">Press me</Button>
      <Button appearance="subtle">Press me</Button>
      <Button appearance="primary" isLoading>
        Loading
      </Button>
      <Button appearance="primary" isDisabled>
        Disabled
      </Button>
    </div>
}`,...l.parameters?.docs?.source}}};const f=["Tokens","Keyframes","PressFeedback"];export{d as Keyframes,l as PressFeedback,i as Tokens,f as __namedExportsOrder,j as default};
