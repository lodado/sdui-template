import { z } from 'zod'

/**
 * Sdui block `attributes` — an embedded SDUI layout document (the JSON
 * `SduiLayoutRenderer` consumes). Intentionally loose here: the render layer
 * (@lodado/sdui-template) owns full document validation and error reporting;
 * the domain only guarantees the envelope shape.
 */
export const sduiAttributesSchema = z.object({
  document: z.looseObject({
    version: z.string(),
    root: z.record(z.string(), z.unknown()),
  }),
})

export type SduiBlockAttributes = z.infer<typeof sduiAttributesSchema>
