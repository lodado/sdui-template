/**
 * Hybrid Logical Clock (HLC).
 *
 * Policies:
 * - HLC orders offline/local edits and serves audit display; it is NEVER the
 *   merge authority — the server-assigned log `seq` is (see documentLog.ts).
 * - Pure module: physical time is injected as `physicalMillis`; this package
 *   never reads the wall clock itself.
 * - `actorId` is the final tie-breaker so the ordering is total.
 */
export type HlcTimestamp = {
  millis: number
  counter: number
  actorId: string
}

/** Advances the local clock for a locally-produced event. */
export function hlcTick(previous: HlcTimestamp | null, physicalMillis: number, actorId: string): HlcTimestamp {
  if (!previous || physicalMillis > previous.millis) {
    return { millis: physicalMillis, counter: 0, actorId }
  }

  return { millis: previous.millis, counter: previous.counter + 1, actorId }
}

/** Advances the local clock after observing a remote timestamp. */
export function hlcMerge(
  previous: HlcTimestamp | null,
  remote: HlcTimestamp,
  physicalMillis: number,
  actorId: string,
): HlcTimestamp {
  const previousMillis = previous?.millis ?? -1
  const millis = Math.max(previousMillis, remote.millis, physicalMillis)

  if (millis === previousMillis && millis === remote.millis) {
    return { millis, counter: Math.max((previous as HlcTimestamp).counter, remote.counter) + 1, actorId }
  }
  if (millis === previousMillis) {
    return { millis, counter: (previous as HlcTimestamp).counter + 1, actorId }
  }
  if (millis === remote.millis) {
    return { millis, counter: remote.counter + 1, actorId }
  }

  return { millis, counter: 0, actorId }
}

export function compareHlc(a: HlcTimestamp, b: HlcTimestamp): number {
  if (a.millis !== b.millis) {
    return a.millis - b.millis
  }
  if (a.counter !== b.counter) {
    return a.counter - b.counter
  }

  if (a.actorId < b.actorId) {
    return -1
  }
  if (a.actorId > b.actorId) {
    return 1
  }
  return 0
}

const MILLIS_PAD = 15
const COUNTER_PAD = 8

/** Lexicographically sortable encoding: sorted strings === compareHlc order. */
export function encodeHlc(timestamp: HlcTimestamp): string {
  const millis = String(timestamp.millis).padStart(MILLIS_PAD, '0')
  const counter = String(timestamp.counter).padStart(COUNTER_PAD, '0')

  return `${millis}:${counter}:${timestamp.actorId}`
}

export function decodeHlc(encoded: string): HlcTimestamp {
  const [millis, counter, ...actor] = encoded.split(':')

  return { millis: Number(millis), counter: Number(counter), actorId: actor.join(':') }
}
