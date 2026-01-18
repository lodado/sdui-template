'use client'

import { type ComponentFactory } from '@lodado/sdui-template'
import type { z } from 'zod'

import { defaultComponentMap } from '../../defaultComponentMap'
import { type ExtractSchemaFields, registerSchema } from './types'

/**
 * Form component map for SDUI Layout Renderer
 *
 * @description
 * Provides component factory map for form components.
 * Supports schema injection via attributes.schema or attributes.schemaName.
 *
 * @example
 * ```tsx
 * // Option 1: Register schemas via getFormComponents
 * const schemas = {
 *   loginForm: z.object({
 *     email: z.string().email('올바른 이메일을 입력해주세요'),
 *     password: z.string().min(8, '비밀번호는 최소 8자 이상이어야 합니다'),
 *   }),
 * }
 *
 * // Type-safe: ExtractSchemaFields<typeof schemas, 'loginForm'> = "email" | "password"
 * // FormField의 name은 이 타입으로 검증 가능
 *
 * <SduiLayoutRenderer
 *   document={document}
 *   components={getFormComponents(schemas)}
 * />
 *
 * // Option 2: Register schema separately
 * registerSchema('loginForm', z.object({
 *   email: z.string().email(),
 *   password: z.string().min(8),
 * }))
 *
 * <SduiLayoutRenderer
 *   document={document}
 *   components={getFormComponents()}
 * />
 * ```
 *
 * @template TSchemas - Type of the schemas object, can be any record type
 * @param schemas - Optional map of schema names to zod schemas that will be registered
 * @returns Component factory map for form components
 */
export function getFormComponents<TSchemas extends Record<string, any> = Record<string, any>>(
  schemas?: TSchemas
): Record<string, ComponentFactory> {
  // Register schemas if provided
  if (schemas) {
    Object.entries(schemas).forEach(([name, schema]) => {
      // Register schema with type assertion to allow any schema type
      registerSchema(name, schema as z.ZodType<any, any, any>)
    })
  }

  return defaultComponentMap
}
