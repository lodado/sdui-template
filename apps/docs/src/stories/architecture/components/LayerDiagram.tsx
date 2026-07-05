import React from 'react'

export interface Layer {
  name: string
  tag: string
  desc: React.ReactNode
  accent?: string
}

interface LayerDiagramProps {
  layers: Layer[]
  /** Symbol drawn between layers. Defaults to a downward flow arrow. */
  connector?: string
}

export const LayerDiagram = ({ layers, connector = '↓' }: LayerDiagramProps) => {
  return (
    <div className="sdui-doc__layers">
      {layers.map((layer, i) => (
        <React.Fragment key={layer.name}>
          {i > 0 && (
            <div className="sdui-doc__flowarrow" aria-hidden>
              {connector}
            </div>
          )}
          <div
            className="sdui-doc__layer"
            style={layer.accent ? ({ '--doc-layer-accent': layer.accent } as React.CSSProperties) : undefined}
          >
            <div>
              <div className="sdui-doc__layer-name">{layer.name}</div>
              <span className="sdui-doc__layer-tag">{layer.tag}</span>
            </div>
            <div className="sdui-doc__layer-desc">{layer.desc}</div>
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}
