import assert from 'node:assert/strict'
import { test } from 'node:test'

import { sanitizeComponentName, splitComponentsSkill } from './split-components.js'

const FIXTURE = `---
name: sduiComponents
description: reference
---

# sduiComponents

## Overview

Intro text.

### Quick Import

\`\`\`ts
import { sduiComponents } from '@lodado/sdui-template-component'
\`\`\`

### Key Rules

- rule one

## Base Components

### Div

Div body.

### Text / Span

Text body.

## Input Components

### Checkbox (Compound)

Checkbox body with \`providerId\`.
`

test('overview keeps frontmatter, Quick Import and Key Rules', () => {
  const split = splitComponentsSkill(FIXTURE)
  assert.ok(split.overview.includes('name: sduiComponents'))
  assert.ok(split.overview.includes('### Quick Import'))
  assert.ok(split.overview.includes('### Key Rules'))
  assert.ok(!split.overview.includes('Div body'))
})

test('splits each ### heading into a component entry with sanitized key', () => {
  const split = splitComponentsSkill(FIXTURE)
  assert.deepEqual(Object.keys(split.components).sort(), ['Checkbox', 'Div', 'Text-Span'])
  assert.ok(split.components['Div'].includes('Div body.'))
  assert.ok(split.components['Checkbox'].startsWith('### Checkbox (Compound)'))
  assert.ok(split.components['Checkbox'].includes('providerId'))
})

test('sanitizeComponentName handles suffixes and slashes', () => {
  assert.equal(sanitizeComponentName('Checkbox (Compound)'), 'Checkbox')
  assert.equal(sanitizeComponentName('Text / Span'), 'Text-Span')
  assert.equal(sanitizeComponentName('Div'), 'Div')
})
