import React from 'react'

interface DemoFrameProps {
  title: string
  hint?: string
  children: React.ReactNode
  split?: boolean
}

/** Frames a live example so it reads as an interactive demo, not page chrome. */
export const DemoFrame = ({ title, hint, children, split = false }: DemoFrameProps) => {
  return (
    <div className="sdui-doc__demo">
      <div className="sdui-doc__demo-head">
        <span className="sdui-doc__demo-title">{title}</span>
        {hint && <span className="sdui-doc__demo-hint">{hint}</span>}
      </div>
      <div className={split ? 'sdui-doc__demo-body sdui-doc__demo-split' : 'sdui-doc__demo-body'}>{children}</div>
    </div>
  )
}
