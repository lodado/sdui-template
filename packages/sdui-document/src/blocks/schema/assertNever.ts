/**
 * Compile-time exhaustiveness guard.
 *
 * Call in the `default` branch of a `switch` over a discriminated union: if
 * every variant is handled, `value` narrows to `never` and this type-checks.
 * Add a new union member without handling it and the `default` call becomes a
 * compile error — turning a silently-swallowed variant into a build failure.
 *
 * The runtime throw only fires if an untyped value reaches here (e.g. data
 * crossing a trust boundary that bypassed validation).
 */
export function assertNever(value: never, context: string): never {
  throw new Error(`Unhandled variant in ${context}: ${JSON.stringify(value)}`)
}
