import './architecture.css'

import React from 'react'

export type DocAccent = 'overview' | 'core' | 'react' | 'renderer' | 'components'

interface DocPageProps {
  accent: DocAccent
  children: React.ReactNode
}

/** Scoped root for an architecture documentation page. */
export const DocPage = ({ accent, children }: DocPageProps) => {
  return (
    <article className="sdui-doc" data-accent={accent}>
      {children}
    </article>
  )
}

interface DocHeroProps {
  kicker: string
  title: string
  lead: React.ReactNode
  pills?: string[]
}

export const DocHero = ({ kicker, title, lead, pills }: DocHeroProps) => {
  return (
    <header className="sdui-doc__hero">
      <div className="sdui-doc__kicker">{kicker}</div>
      <h1 className="sdui-doc__title">{title}</h1>
      <p className="sdui-doc__lead">{lead}</p>
      {pills && pills.length > 0 && (
        <div className="sdui-doc__pillrow">
          {pills.map((pill) => (
            <span key={pill} className="sdui-doc__pill">
              {pill}
            </span>
          ))}
        </div>
      )}
    </header>
  )
}

interface DocSectionProps {
  index: string
  label: string
  title: string
  children: React.ReactNode
}

export const DocSection = ({ index, label, title, children }: DocSectionProps) => {
  return (
    <section className="sdui-doc__section">
      <div className="sdui-doc__section-label">
        <span>{index}</span>
        {label}
      </div>
      <h2 className="sdui-doc__h2">{title}</h2>
      {children}
    </section>
  )
}

/** Prose block — accepts already-formatted React children. */
export const Prose = ({ children }: { children: React.ReactNode }) => {
  return <div className="sdui-doc__prose">{children}</div>
}

interface CalloutProps {
  icon?: string
  children: React.ReactNode
}

export const Callout = ({ icon = '◆', children }: CalloutProps) => {
  return (
    <aside className="sdui-doc__callout">
      <span aria-hidden>{icon}</span>
      <div>{children}</div>
    </aside>
  )
}

export const BadgeRow = ({ items }: { items: string[] }) => {
  return (
    <div className="sdui-doc__badge-row">
      {items.map((item) => (
        <span key={item} className="sdui-doc__badge">
          {item}
        </span>
      ))}
    </div>
  )
}
