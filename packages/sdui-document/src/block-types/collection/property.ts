import { z } from 'zod'

/** Supported collection property value kinds. */
export const PROPERTY_TYPES = ['text', 'select', 'multiSelect', 'date', 'dateRange', 'url'] as const
export type PropertyType = (typeof PROPERTY_TYPES)[number]

/** Preset chip palette keys (shared with tags block); free-form hex is disallowed. */
export const PROPERTY_COLORS = ['gray', 'blue', 'green', 'yellow', 'orange', 'red', 'purple', 'pink'] as const
export type PropertyColor = (typeof PROPERTY_COLORS)[number]

export const propertyOptionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  color: z.enum(PROPERTY_COLORS).optional(),
})
export type PropertyOption = z.infer<typeof propertyOptionSchema>

export const propertyDefSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  type: z.enum(PROPERTY_TYPES),
  /** select / multiSelect option catalog. */
  options: z.array(propertyOptionSchema).optional(),
})
export type PropertyDef = z.infer<typeof propertyDefSchema>

const dateRangeSchema = z.object({ start: z.string(), end: z.string().optional() })
export type DateRangeValue = z.infer<typeof dateRangeSchema>

/** Raw per-page property values, keyed by property id. */
export type PropertyValueMap = Record<string, unknown>

/**
 * Parse a raw stored value against its definition into a typed shape.
 * Returns undefined when the value is absent or malformed — renderers treat
 * undefined as "empty", never as an error.
 */
export function parsePropertyValue(def: PropertyDef, raw: unknown): unknown {
  if (raw === undefined || raw === null) {
    return undefined
  }

  switch (def.type) {
    case 'text':
    case 'url':
      return typeof raw === 'string' ? raw : undefined
    case 'select':
      return typeof raw === 'string' ? raw : undefined
    case 'multiSelect':
      return Array.isArray(raw) ? raw.filter((item): item is string => typeof item === 'string') : undefined
    case 'date':
      return typeof raw === 'string' ? raw : undefined
    case 'dateRange': {
      const result = dateRangeSchema.safeParse(raw)
      return result.success ? result.data : undefined
    }
    default:
      return undefined
  }
}

/** Resolve a select/multiSelect value id to its option definition. */
export function findPropertyOption(def: PropertyDef, optionId: string): PropertyOption | undefined {
  return def.options?.find((option) => option.id === optionId)
}

function comparableKey(def: PropertyDef, value: unknown): string | number {
  const parsed = parsePropertyValue(def, value)
  if (parsed === undefined) {
    return def.type === 'date' || def.type === 'dateRange' ? Number.POSITIVE_INFINITY : ''
  }

  switch (def.type) {
    case 'date':
      return Date.parse(parsed as string) || 0
    case 'dateRange':
      return Date.parse((parsed as DateRangeValue).start) || 0
    case 'multiSelect':
      return (parsed as string[]).join(',')
    default:
      return String(parsed)
  }
}

export type SortDirection = 'asc' | 'desc'

/**
 * Stable sort of items by a property value. `getValue` extracts the raw value
 * for an item; comparison is by parsed/typed key (dates numeric, others string).
 */
export function sortByProperty<T>(
  items: readonly T[],
  def: PropertyDef,
  direction: SortDirection,
  getValue: (item: T) => unknown,
): T[] {
  const factor = direction === 'desc' ? -1 : 1
  return items
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      const ka = comparableKey(def, getValue(a.item))
      const kb = comparableKey(def, getValue(b.item))
      if (ka < kb) return -1 * factor
      if (ka > kb) return 1 * factor
      return a.index - b.index // stable
    })
    .map(({ item }) => item)
}

/** Bucket key for board grouping: the select value id, or a sentinel for empty. */
export const NO_GROUP_KEY = '__none__'

/**
 * Group items into buckets keyed by a select property option id (order follows
 * the def's option order; the empty bucket is last). Non-select defs group all
 * items under NO_GROUP_KEY.
 */
export function groupByProperty<T>(
  items: readonly T[],
  def: PropertyDef,
  getValue: (item: T) => unknown,
): { key: string; option?: PropertyOption; items: T[] }[] {
  if (def.type !== 'select') {
    return [{ key: NO_GROUP_KEY, items: [...items] }]
  }

  const buckets = new Map<string, T[]>()
  ;(def.options ?? []).forEach((option) => buckets.set(option.id, []))
  buckets.set(NO_GROUP_KEY, [])

  items.forEach((item) => {
    const value = parsePropertyValue(def, getValue(item))
    const key = typeof value === 'string' && buckets.has(value) ? value : NO_GROUP_KEY
    buckets.get(key)!.push(item)
  })

  return Array.from(buckets.entries()).map(([key, bucketItems]) => ({
    key,
    option: key === NO_GROUP_KEY ? undefined : findPropertyOption(def, key),
    items: bucketItems,
  }))
}
