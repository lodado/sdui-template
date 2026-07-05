import React from 'react'

import { CodeSnippet } from './CodeSnippet'
import { DemoFrame } from './DemoFrame'
import { BadgeRow, Callout, type DocAccent, DocHero, DocPage, DocSection, Prose } from './DocPage'
import { type Layer, LayerDiagram } from './LayerDiagram'
import { type ModuleEntry, ModuleMap } from './ModuleMap'
import { type Principle, PrincipleCards } from './PrincipleCard'

/** One content block inside a deep-dive section. */
export type DeepDiveBlock =
  | { kind: 'prose'; body: React.ReactNode }
  | { kind: 'code'; file?: string; code: string }
  | { kind: 'demo'; title: string; hint?: string; node: React.ReactNode; split?: boolean }
  | { kind: 'callout'; icon?: string; body: React.ReactNode }
  | { kind: 'badges'; items: string[] }
  | { kind: 'layers'; layers: Layer[]; connector?: string }
  | { kind: 'modules'; modules: ModuleEntry[] }
  | { kind: 'custom'; node: React.ReactNode }

export interface DeepDiveSection {
  index: string
  label: string
  title: string
  blocks: DeepDiveBlock[]
}

export interface DeepDiveConfig {
  accent: DocAccent
  kicker: string
  title: string
  lead: string
  pills: string[]
  /** Optional step cards shown right under the hero. */
  steps?: Principle[]
  stepsIntro?: React.ReactNode
  sections: DeepDiveSection[]
}

const Block = ({ block }: { block: DeepDiveBlock }) => {
  switch (block.kind) {
    case 'prose':
      return (
        <Prose>
          <p>{block.body}</p>
        </Prose>
      )
    case 'code':
      return <CodeSnippet file={block.file} code={block.code} />
    case 'demo':
      return (
        <DemoFrame title={block.title} hint={block.hint} split={block.split}>
          {block.node}
        </DemoFrame>
      )
    case 'callout':
      return <Callout icon={block.icon}>{block.body}</Callout>
    case 'badges':
      return <BadgeRow items={block.items} />
    case 'layers':
      return <LayerDiagram layers={block.layers} connector={block.connector} />
    case 'modules':
      return <ModuleMap modules={block.modules} />
    case 'custom':
      return <>{block.node}</>
    default:
      return null
  }
}

/**
 * Renders a single-feature deep-dive page from a declarative config.
 * Keeps every deep-dive visually consistent with the architecture docs while
 * letting each story stay a small data object.
 */
export const DeepDiveTemplate = ({ config }: { config: DeepDiveConfig }) => {
  return (
    <DocPage accent={config.accent}>
      <DocHero kicker={config.kicker} title={config.title} lead={config.lead} pills={config.pills} />

      {config.steps && config.steps.length > 0 && (
        <DocSection index="→" label="Steps" title="한눈에 보는 흐름">
          {config.stepsIntro && (
            <Prose>
              <p>{config.stepsIntro}</p>
            </Prose>
          )}
          <PrincipleCards principles={config.steps} />
        </DocSection>
      )}

      {config.sections.map((section) => (
        <DocSection key={section.index} index={section.index} label={section.label} title={section.title}>
          {section.blocks.map((block, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Block key={`${section.index}-${i}`} block={block} />
          ))}
        </DocSection>
      ))}
    </DocPage>
  )
}
