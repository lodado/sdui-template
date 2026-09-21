const ts = require('typescript')

const hooks = new Set([
  'useSduiNodeSubscription',
  'useSduiNodeReference',
  'useSduiVariable',
  'useSduiVariables',
  'useRenderNode',
  'useSduiLayoutAction',
])

function unwrap(node) {
  while (
    node &&
    (ts.isParenthesizedExpression(node) ||
      ts.isAsExpression(node) ||
      ts.isTypeAssertionExpression(node) ||
      ts.isNonNullExpression(node) ||
      ts.isSatisfiesExpression(node))
  ) {
    node = node.expression
  }
  return node
}

function propertyName(node) {
  if (!node) return undefined
  if (ts.isIdentifier(node) || ts.isStringLiteral(node) || ts.isNumericLiteral(node)) return node.text
  if (ts.isComputedPropertyName(node)) {
    const expression = unwrap(node.expression)
    if (ts.isStringLiteral(expression) || ts.isNumericLiteral(expression)) return expression.text
  }
  return undefined
}

module.exports = function analyze(program) {
  const checker = program.getTypeChecker()
  const components = new Set()
  const incoming = new Map()
  const sinks = []
  const writes = new Map()
  const files = program
    .getSourceFiles()
    .filter((file) => !file.isDeclarationFile && !program.isSourceFileFromExternalLibrary(file))

  function resolveComponent(node, seen = new Set()) {
    node = unwrap(node)
    if (!node || seen.has(node)) return undefined
    seen.add(node)
    if (components.has(node)) return node
    let symbol = checker.getSymbolAtLocation(ts.isPropertyAccessExpression(node) ? node.name : node)
    if (symbol && symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
    const declaration = symbol && symbol.valueDeclaration
    if (!declaration) return undefined
    if (components.has(declaration)) return declaration
    if (ts.isVariableDeclaration(declaration)) return resolveComponent(declaration.initializer, seen)
    if (ts.isExportAssignment(declaration)) return resolveComponent(declaration.expression, seen)
    return undefined
  }

  function isHook(node) {
    const callee = unwrap(node.expression)
    let name
    let binding
    if (ts.isIdentifier(callee)) {
      binding = checker.getSymbolAtLocation(callee)?.declarations?.[0]
      if (!binding || !ts.isImportSpecifier(binding)) return false
      name = (binding.propertyName || binding.name).text
    } else if (ts.isPropertyAccessExpression(callee)) {
      binding = checker.getSymbolAtLocation(callee.expression)?.declarations?.[0]
      if (!binding || !ts.isNamespaceImport(binding)) return false
      name = callee.name.text
    } else return false
    while (binding && !ts.isImportDeclaration(binding)) binding = binding.parent
    return binding?.moduleSpecifier.text === '@lodado/sdui-template' && hooks.has(name)
  }

  function selectedType(node, path) {
    let type = checker.getTypeAtLocation(node)
    for (const name of path) {
      type = checker.getNonNullableType(type)
      const property = checker.getPropertyOfType(type, name)
      type = property
        ? checker.getTypeOfSymbolAtLocation(property, node)
        : checker.getIndexTypeOfType(type, ts.IndexKind.String)
      if (!type) return undefined
    }
    return checker.getNonNullableType(type)
  }

  function callable(node, path) {
    const type = selectedType(node, path)
    return type && !(type.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown)) && type.getCallSignatures().length > 0
  }

  function collect(node) {
    if (
      (ts.isFunctionDeclaration(node) && node.body) ||
      ((ts.isArrowFunction(node) || ts.isFunctionExpression(node)) &&
        (ts.isVariableDeclaration(node.parent) || ts.isExportAssignment(node.parent)))
    ) {
      components.add(node)
    }
    if (
      ts.isBinaryExpression(node) &&
      node.operatorToken.kind === ts.SyntaxKind.EqualsToken &&
      ts.isIdentifier(node.left)
    ) {
      const symbol = checker.getSymbolAtLocation(node.left)
      if (symbol) {
        if (!writes.has(symbol)) writes.set(symbol, [])
        writes.get(symbol).push(node.right)
      }
    }
    ts.forEachChild(node, collect)
  }
  files.forEach(collect)

  function collectSinks(node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      // Intrinsic DOM/custom elements consume data rather than forward it.
      if (
        !(ts.isIdentifier(node.tagName) && /^[a-z]/.test(node.tagName.text)) &&
        !ts.isJsxNamespacedName(node.tagName)
      ) {
        const target = resolveComponent(node.tagName)
        const props = new Map()
        for (const attribute of node.attributes.properties) {
          if (ts.isJsxAttribute(attribute)) {
            const name = propertyName(attribute.name)
            if (!name) continue
            const expression =
              attribute.initializer && ts.isJsxExpression(attribute.initializer)
                ? attribute.initializer.expression
                : attribute.initializer
            props.set(name, { name, expression, path: [], node: attribute })
          } else {
            const type = checker.getTypeAtLocation(attribute.expression)
            const properties = checker.getPropertiesOfType(type)
            for (const property of properties) {
              const name = property.getName()
              props.set(name, { name, expression: attribute.expression, path: [name], node: attribute })
            }
            if (!properties.length || checker.getIndexTypeOfType(type, ts.IndexKind.String)) {
              props.set('*', { name: '*', expression: attribute.expression, path: [], node: attribute })
            }
          }
        }
        const edges = [...props.values()].filter((edge) => edge.name !== 'key' && edge.name !== 'ref')
        sinks.push(...edges)
        if (target) {
          if (!incoming.has(target)) incoming.set(target, [])
          incoming.get(target).push(new Map(edges.map((edge) => [edge.name, edge])))
        }
      }
    }
    ts.forEachChild(node, collectSinks)
  }
  files.forEach(collectSinks)

  // Monotone provenance: -1 = no source, 0 = hook, 1 = crossed a component boundary.
  // Cache expression projections and revisit dependents when a cycle gains a source.
  const projections = new Map()
  const pending = new Set()
  let activeProjection

  function refresh(projection) {
    const previous = activeProjection
    activeProjection = projection
    const value = evaluate(projection.node, projection.path, projection.trackFunction)
    activeProjection = previous
    if (value > projection.value) {
      projection.value = value
      for (const dependent of projection.dependents) pending.add(dependent)
    }
  }

  function origin(node, path = [], trackFunction = false) {
    if (!node || path.length > 32) return -1
    if (!projections.has(node)) projections.set(node, new Map())
    const entries = projections.get(node)
    const key = JSON.stringify([path, trackFunction])
    let projection = entries.get(key)
    const fresh = !projection
    if (fresh) {
      // ponytail: 32 path segments / 256 projections per node bound recursive
      // shape expansion; use a summarized access-path lattice for deeper flows.
      if (entries.size >= 256) return -1
      projection = { node, path, trackFunction, value: -1, dependents: new Set() }
      entries.set(key, projection)
    }
    if (activeProjection) projection.dependents.add(activeProjection)
    if (fresh) refresh(projection)
    return projection.value
  }

  function evaluate(node, path, trackFunction) {
    if (!trackFunction && callable(node, path)) return -1
    const visit = (value, selection = path, functions = trackFunction) => origin(value, selection, functions)
    const expression = unwrap(node)
    if (expression !== node) return visit(expression)

    if (ts.isPropertyAccessExpression(node)) return visit(node.expression, [node.name.text, ...path])
    if (ts.isElementAccessExpression(node)) {
      const key = node.argumentExpression && unwrap(node.argumentExpression)
      const name = key && (ts.isStringLiteral(key) || ts.isNumericLiteral(key)) ? key.text : undefined
      return visit(node.expression, name === undefined ? [] : [name, ...path])
    }
    if (ts.isCallExpression(node)) {
      if (isHook(node)) return 0
      return Math.max(visit(node.expression, [], true), ...node.arguments.map((arg) => visit(arg, [], false)))
    }
    if (ts.isIdentifier(node)) {
      let symbol = checker.getSymbolAtLocation(node)
      if (!symbol) return -1
      if (symbol.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol)
      const declaration = symbol.valueDeclaration
      let result = -1
      if (
        declaration &&
        (ts.isVariableDeclaration(declaration) || ts.isBindingElement(declaration) || ts.isParameter(declaration))
      )
        result = visit(declaration)
      for (const write of writes.get(symbol) || []) result = Math.max(result, visit(write))
      return result
    }
    if (ts.isBindingElement(node)) {
      if (node.dotDotDotToken) {
        if (!path.length && ts.isObjectBindingPattern(node.parent)) {
          const keys = checker.getPropertiesOfType(checker.getTypeAtLocation(node))
          return Math.max(-1, ...keys.map((key) => visit(node.parent.parent, [key.getName()])))
        }
        return visit(node.parent.parent)
      }
      const name = ts.isArrayBindingPattern(node.parent)
        ? String(node.parent.elements.indexOf(node))
        : propertyName(node.propertyName || node.name)
      return Math.max(name === undefined ? -1 : visit(node.parent.parent, [name, ...path]), visit(node.initializer))
    }
    if (ts.isVariableDeclaration(node)) return visit(node.initializer)
    if (ts.isParameter(node)) {
      const component = node.parent
      if (!components.has(component) || component.parameters[0] !== node) return -1
      const [name, ...rest] = path
      let result = visit(node.initializer)
      for (const props of incoming.get(component) || []) {
        const edges = name === undefined ? [...props.values()] : [props.get(name) || props.get('*')]
        for (const edge of edges) {
          if (!edge) continue
          const selection = edge.name === '*' ? path : name === undefined ? [] : rest
          if (origin(edge.expression, [...edge.path, ...selection], trackFunction) >= 0) result = 1
        }
      }
      return result
    }
    if (ts.isObjectLiteralExpression(node)) {
      const [name, ...rest] = path
      let result = -1
      for (const property of [...node.properties].reverse()) {
        if (ts.isSpreadAssignment(property)) {
          result = Math.max(result, visit(property.expression))
          if (name !== undefined && checker.getPropertyOfType(checker.getTypeAtLocation(property.expression), name)) {
            return result
          }
        } else if (ts.isPropertyAssignment(property) || ts.isShorthandPropertyAssignment(property)) {
          if (name !== undefined && propertyName(property.name) !== name) continue
          const value = ts.isShorthandPropertyAssignment(property) ? property.name : property.initializer
          // Shorthand property symbols refer to the property, not the local binding.
          if (ts.isShorthandPropertyAssignment(property)) {
            const symbol = checker.getShorthandAssignmentValueSymbol(property)
            const declaration = symbol?.valueDeclaration
            const selection = name === undefined ? [] : rest
            result = Math.max(
              result,
              declaration ? visit(declaration, selection) : -1,
              ...(writes.get(symbol) || []).map((write) => visit(write, selection)),
            )
          } else result = Math.max(result, visit(value, name === undefined ? [] : rest))
          if (name !== undefined) return result
        }
      }
      return result
    }
    if (ts.isArrayLiteralExpression(node)) {
      if (path.length && /^\d+$/.test(path[0])) return visit(node.elements[Number(path[0])], path.slice(1))
      return Math.max(-1, ...node.elements.map((element) => visit(element, [])))
    }
    if (ts.isConditionalExpression(node))
      return Math.max(visit(node.condition, []), visit(node.whenTrue), visit(node.whenFalse))
    if (ts.isBinaryExpression(node)) return Math.max(visit(node.left, []), visit(node.right, []))
    if (ts.isPrefixUnaryExpression(node) || ts.isPostfixUnaryExpression(node)) return visit(node.operand, [])
    if (ts.isTemplateExpression(node))
      return Math.max(-1, ...node.templateSpans.map((span) => visit(span.expression, [])))
    if (ts.isAwaitExpression(node) || ts.isSpreadElement(node)) return visit(node.expression)
    // Function bodies, JSX output, and arbitrary helper implementations are not evaluated.
    return -1
  }

  for (const edge of sinks) origin(edge.expression, edge.path)
  while (pending.size) {
    const projection = pending.values().next().value
    pending.delete(projection)
    refresh(projection)
  }

  const diagnostics = new Map()
  for (const edge of sinks) {
    if (origin(edge.expression, edge.path) !== 1) continue
    const file = edge.node.getSourceFile().fileName
    if (!diagnostics.has(file)) diagnostics.set(file, new Set())
    diagnostics.get(file).add(edge.node)
  }
  return diagnostics
}
