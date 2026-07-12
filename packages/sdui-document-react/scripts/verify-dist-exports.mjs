// Guards against dangling ESM imports in the preserveModules build: a chunk
// importing a named export that its target chunk no longer emits. This exact
// breakage shipped in 1.0.0 (tree-shaken shared modules overwritten across two
// ES passes) and only surfaced in strict-ESM consumers (Turbopack), not here.
// Runs as `postbuild`; fails the build so it can never reach npm again.
import { readFileSync, readdirSync, statSync } from 'fs'
import { dirname, join, resolve } from 'path'

const ROOT = 'dist/es/client'

const files = []
;(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e)
    statSync(p).isDirectory() ? walk(p) : p.endsWith('.mjs') && files.push(p)
  }
})(ROOT)

const exportsOf = new Map()
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  const names = new Set()
  for (const m of src.matchAll(/export\s*\{([^}]*)\}/g))
    for (const part of m[1].split(',')) {
      const t = part.trim().split(/\s+as\s+/)
      if (t.length) names.add((t[1] || t[0]).trim())
    }
  for (const m of src.matchAll(/export\s+(?:const|function|class|let|var)\s+([A-Za-z0-9_$]+)/g)) names.add(m[1])
  if (/export\s+default/.test(src)) names.add('default')
  exportsOf.set(resolve(f), names)
}

let bad = 0
for (const f of files) {
  const src = readFileSync(f, 'utf8')
  for (const m of src.matchAll(/import\s*\{([^}]*)\}\s*from\s*["'](\.[^"']*\.mjs)["']/g)) {
    const target = exportsOf.get(resolve(dirname(f), m[2]))
    if (!target) continue
    for (const part of m[1].split(',')) {
      const imported = part.trim().split(/\s+as\s+/)[0].trim()
      if (imported && !target.has(imported)) {
        bad++
        console.error(`DANGLING: ${f} imports {${imported}} from ${m[2]} — not exported there`)
      }
    }
  }
}

if (bad > 0) {
  console.error(`\n❌ ${bad} dangling ESM import(s) in ${ROOT}. Build is broken for strict-ESM consumers.`)
  process.exit(1)
}
console.log(`✅ verify-dist-exports: no dangling imports across ${files.length} mjs files`)
