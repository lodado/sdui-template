import React from 'react'

export interface FeatureRow {
  /** Feature name — rendered as the row's headline. */
  name: string
  /** One-line plain-language description of what it does. */
  what: React.ReactNode
  /** Public API surface (function / class / hook names). */
  api?: string
  /** Source file path relative to the package. */
  file?: string
}

export interface FeatureGroup {
  /** Package or capability the rows belong to. */
  package: string
  /** Short tag shown next to the package name. */
  tag?: string
  /** Accent hint reused from LayerDiagram colours. */
  accent?: string
  rows: FeatureRow[]
}

/**
 * A grouped feature catalogue table. Beginner-facing: every row answers
 * "what does this do", "what do I call", and "where does it live".
 */
export const FeatureTable = ({ groups }: { groups: FeatureGroup[] }) => {
  return (
    <div className="sdui-doc__ftable">
      {groups.map((group) => (
        <section
          key={group.package}
          className="sdui-doc__ftable-group"
          style={group.accent ? ({ '--ft-accent': group.accent } as React.CSSProperties) : undefined}
        >
          <header className="sdui-doc__ftable-grouphead">
            <span className="sdui-doc__ftable-pkg">{group.package}</span>
            {group.tag && <span className="sdui-doc__ftable-tag">{group.tag}</span>}
            <span className="sdui-doc__ftable-count">{group.rows.length}</span>
          </header>

          <div className="sdui-doc__ftable-rows" role="table">
            <div className="sdui-doc__ftable-row sdui-doc__ftable-row--head" role="row">
              <span role="columnheader">기능</span>
              <span role="columnheader">하는 일</span>
              <span role="columnheader">API · 파일</span>
            </div>
            {group.rows.map((row) => (
              <div key={row.name} className="sdui-doc__ftable-row" role="row">
                <span className="sdui-doc__ftable-name" role="cell">
                  {row.name}
                </span>
                <span className="sdui-doc__ftable-what" role="cell">
                  {row.what}
                </span>
                <span className="sdui-doc__ftable-meta" role="cell">
                  {row.api && <code className="sdui-doc__ftable-api">{row.api}</code>}
                  {row.file && <span className="sdui-doc__ftable-file">{row.file}</span>}
                </span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
