import React from 'react'

export interface Principle {
  num: string
  title: string
  body: React.ReactNode
  wide?: boolean
}

export const PrincipleCards = ({ principles }: { principles: Principle[] }) => {
  return (
    <div className="sdui-doc__cards">
      {principles.map((p) => (
        <div key={p.num} className={p.wide ? 'sdui-doc__card sdui-doc__card--wide' : 'sdui-doc__card'}>
          <span className="sdui-doc__card-num">{p.num}</span>
          <h3 className="sdui-doc__card-title">{p.title}</h3>
          <p className="sdui-doc__card-body">{p.body}</p>
        </div>
      ))}
    </div>
  )
}
