import React from 'react'

export interface ModuleEntry {
  name: string
  tag: string
  desc: React.ReactNode
  file: string
}

export const ModuleMap = ({ modules }: { modules: ModuleEntry[] }) => {
  return (
    <div className="sdui-doc__modules">
      {modules.map((m) => (
        <div key={m.name} className="sdui-doc__module">
          <div className="sdui-doc__module-head">
            <span className="sdui-doc__module-name">{m.name}</span>
            <span className="sdui-doc__module-tag">{m.tag}</span>
          </div>
          <p className="sdui-doc__module-desc">{m.desc}</p>
          <span className="sdui-doc__module-file">{m.file}</span>
        </div>
      ))}
    </div>
  )
}
