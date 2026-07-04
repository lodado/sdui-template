import type { SduiInlineContent } from '../blocks/schema/inline'
import { InvalidInlineOffsetError } from './errors'
import { getInlineContentLength, mergeInlineContent, splitInlineContent } from './inlineContent'

function assertRange(content: SduiInlineContent, from: number, to: number): void {
  if (from > to) {
    throw new InvalidInlineOffsetError(from, getInlineContentLength(content))
  }
}

/**
 * Extracts the inline nodes covered by [from, to) as standalone content.
 * Text nodes cut at range boundaries keep their marks on the extracted half.
 *
 * @throws InvalidInlineOffsetError when the range is out of bounds or inverted
 */
export function sliceInlineContent(content: SduiInlineContent, from: number, to: number): SduiInlineContent {
  assertRange(content, from, to)
  const [, tail] = splitInlineContent(content, from)

  return splitInlineContent(tail, to - from)[0]
}

/**
 * Removes [from, to) and joins the seam (adjacent text nodes with identical
 * marks merge, empty nodes drop).
 *
 * @throws InvalidInlineOffsetError when the range is out of bounds or inverted
 */
export function removeInlineRange(content: SduiInlineContent, from: number, to: number): SduiInlineContent {
  assertRange(content, from, to)
  const [head] = splitInlineContent(content, from)
  const [, tail] = splitInlineContent(content, to)

  return mergeInlineContent(head, tail)
}

/**
 * Inserts `fragment` at `offset`, normalizing both seams.
 *
 * @throws InvalidInlineOffsetError when offset is out of bounds
 */
export function insertInlineContent(
  content: SduiInlineContent,
  offset: number,
  fragment: SduiInlineContent,
): SduiInlineContent {
  const [head, tail] = splitInlineContent(content, offset)

  return mergeInlineContent(mergeInlineContent(head, fragment), tail)
}
